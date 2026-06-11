import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()).data,
  });
  const [f, setF] = useState<any>(null);
  useEffect(() => { if (data && !f) setF(data); }, [data]);
  if (!f) return <div>Loading…</div>;
  const upd = (k: string, v: any) => setF({ ...f, [k]: v });
  const updJSON = (k: string, raw: string) => { try { upd(k, JSON.parse(raw)); } catch {} };
  const save = async () => {
    const { error } = await supabase.from("site_settings").update(f).eq("id", 1);
    if (error) toast.error(error.message);
    else { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["site_settings"] }); }
  };
  const txt = (k: string, label: string) => (
    <label className="block"><span className="text-sm font-medium">{label}</span>
      <input value={f[k] ?? ""} onChange={(e) => upd(k, e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" /></label>
  );
  const json = (k: string, label: string, rows = 4) => (
    <label className="block"><span className="text-sm font-medium">{label} (JSON)</span>
      <textarea defaultValue={JSON.stringify(f[k], null, 2)} onChange={(e) => updJSON(k, e.target.value)} rows={rows} className="mt-1 w-full px-3 py-2 border rounded font-mono text-xs" /></label>
  );
  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <button onClick={save} className="btn-hero text-sm"><Save className="h-4 w-4" /> Save All</button>
      </div>
      <div className="space-y-5">
        <div className="card-soft p-5 space-y-3">
          <h3 className="font-semibold">Organization</h3>
          {txt("ngo_name", "NGO Name")}
          <ImageUploader value={f.logo_url} onChange={(u) => upd("logo_url", u)} label="Logo" />
          {txt("address", "Address")}
          {json("phones", "Phones", 3)}
          {json("emails", "Emails", 3)}
        </div>
        <div className="card-soft p-5 space-y-3">
          <h3 className="font-semibold">Donation Details</h3>
          {txt("upi_id", "UPI ID")}
          <label className="block"><span className="text-sm font-medium">Bank Details</span>
            <textarea value={f.bank_details ?? ""} onChange={(e) => upd("bank_details", e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border rounded" /></label>
        </div>
        <div className="card-soft p-5 space-y-3">
          <h3 className="font-semibold">Social Links & Map</h3>
          {json("social_links", "Social Links")}
          {txt("map_embed_url", "Google Map Embed URL")}
        </div>
        <div className="card-soft p-5 space-y-3">
          <h3 className="font-semibold">Theme Colors</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-sm font-medium">Primary</span>
              <input type="color" value={f.primary_color ?? "#E65100"} onChange={(e) => upd("primary_color", e.target.value)} className="mt-1 w-full h-10 border rounded" /></label>
            <label className="block"><span className="text-sm font-medium">Accent</span>
              <input type="color" value={f.accent_color ?? "#1B5E20"} onChange={(e) => upd("accent_color", e.target.value)} className="mt-1 w-full h-10 border rounded" /></label>
          </div>
        </div>
        <div className="card-soft p-5 space-y-3">
          <h3 className="font-semibold">Navigation & Footer</h3>
          {json("nav_links", "Nav Links", 8)}
          {json("footer_quick_links", "Footer Quick Links", 6)}
        </div>
        <div className="card-soft p-5 space-y-3">
          <h3 className="font-semibold">Homepage Section Visibility</h3>
          {json("section_visibility", "Sections (true/false)", 9)}
        </div>
      </div>
    </div>
  );
}
