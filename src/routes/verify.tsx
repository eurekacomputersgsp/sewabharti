import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, Search, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/verify")({ component: VerifyPage });

function VerifyPage() {
  const [form, setForm] = useState({ registration_number: "", serial_number: "", name: "", son_of: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; data?: any }>(null);

  const norm = (s: string) => s.trim().toLowerCase();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("registration_number", form.registration_number.trim())
      .eq("serial_number", form.serial_number.trim())
      .maybeSingle();
    setBusy(false);
    if (error || !data) return setResult({ ok: false });
    if (norm(data.name) !== norm(form.name) || norm(data.son_of) !== norm(form.son_of)) {
      return setResult({ ok: false });
    }
    setResult({ ok: true, data });
  };

  return (
    <PublicLayout>
      <section className="container-page py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-saffron/10 text-saffron mb-3">
              <Award className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Verify Certificate</h1>
            <p className="text-muted-foreground mt-2">Enter certificate details exactly as printed to verify authenticity.</p>
          </div>

          <form onSubmit={submit} className="card-soft p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Registration Number *</label>
                <input required value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-medium">Serial Number *</label>
                <input required value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-medium">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-medium">Son / Daughter of *</label>
                <input required value={form.son_of} onChange={(e) => setForm({ ...form, son_of: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <button disabled={busy} className="btn-hero w-full justify-center">
              <Search className="h-4 w-4" /> {busy ? "Verifying…" : "Verify Certificate"}
            </button>
          </form>

          {result && (
            <div className="mt-6">
              {result.ok ? (
                <div className="card-soft p-6 border-2 border-green-500/40 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3 mb-4 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-8 w-8" />
                    <div>
                      <div className="font-bold text-lg">Certificate Verified ✓</div>
                      <div className="text-sm text-muted-foreground">This is a genuine certificate issued by Sewa Bharti.</div>
                    </div>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <Row k="Name" v={result.data.name} />
                    <Row k="Son/Daughter of" v={result.data.son_of} />
                    <Row k="Registration No." v={result.data.registration_number} />
                    <Row k="Serial No." v={result.data.serial_number} />
                    <Row k="Course" v={result.data.course_name} />
                    <Row k="Grade" v={result.data.grade} />
                    <Row k="Start Date" v={result.data.starting_date} />
                    <Row k="End Date" v={result.data.ending_date} />
                  </dl>
                </div>
              ) : (
                <div className="card-soft p-6 border-2 border-destructive/40 bg-destructive/5">
                  <div className="flex items-center gap-3 text-destructive">
                    <XCircle className="h-8 w-8" />
                    <div>
                      <div className="font-bold text-lg">Verification Failed</div>
                      <div className="text-sm text-muted-foreground">No certificate matches those details. Please check your entries and try again.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex flex-col border-b py-1.5">
      <dt className="text-xs text-muted-foreground uppercase tracking-wide">{k}</dt>
      <dd className="font-medium">{v || "—"}</dd>
    </div>
  );
}
