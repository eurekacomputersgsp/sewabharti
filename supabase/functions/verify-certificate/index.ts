// Public certificate verification endpoint.
// Requires ALL four identity fields (registration number, serial number, name,
// and son/daughter of) to match — this avoids exposing the certificate table
// via a permissive RLS policy.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const norm = (s: unknown) => (typeof s === "string" ? s.trim() : "");
const nlow = (s: unknown) => norm(s).toLowerCase();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders });
  }

  const registration_number = norm(body.registration_number);
  const serial_number = norm(body.serial_number);
  const name = norm(body.name);
  const son_of = norm(body.son_of);

  if (!registration_number || !serial_number || !name || !son_of) {
    return new Response(
      JSON.stringify({ verified: false, error: "All four identifying fields are required." }),
      { status: 400, headers: corsHeaders },
    );
  }

  // Basic sanity limits — reject overly long inputs.
  for (const v of [registration_number, serial_number, name, son_of]) {
    if (v.length > 200) {
      return new Response(JSON.stringify({ verified: false }), { status: 200, headers: corsHeaders });
    }
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data, error } = await supabase
    .from("certificates")
    .select("registration_number, serial_number, name, son_of, course_name, starting_date, ending_date, grade")
    .eq("registration_number", registration_number)
    .eq("serial_number", serial_number)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ verified: false, error: "Lookup failed" }), { status: 500, headers: corsHeaders });
  }

  if (!data || nlow(data.name) !== nlow(name) || nlow(data.son_of) !== nlow(son_of)) {
    // Do not disclose which field mismatched — return a generic negative result.
    return new Response(JSON.stringify({ verified: false }), { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ verified: true, certificate: data }), { status: 200, headers: corsHeaders });
});
