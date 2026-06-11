import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Building2, Smartphone } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, useSiteSettings } from "@/hooks/useSiteData";

export const Route = createFileRoute("/donate")({
  component: DonatePage,
  head: () => ({ meta: [{ title: "Donate — Sewa Bharti Punjab" }] }),
});

const AMOUNTS = [501, 1100, 2100, 5100, 11000];

function DonatePage() {
  const { data: content } = useSiteContent();
  const { data: settings } = useSiteSettings();
  const intro = content?.donate_intro ?? {};
  const [form, setForm] = useState({ donor_name: "", phone: "", email: "", amount: "1100", purpose: "General Fund", pan_number: "", message: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("donations").insert({ ...form, amount: Number(form.amount) });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Donation pledge received! Please complete payment via UPI or bank transfer."); setForm({ donor_name: "", phone: "", email: "", amount: "1100", purpose: "General Fund", pan_number: "", message: "" }); }
  };
  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied"); };
  const f = (k: string, label: string, props: any = {}) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary outline-none" {...props} />
    </label>
  );
  return (
    <PublicLayout>
      <section className="text-white py-16" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{intro.title}</h1>
          <p className="mt-3 text-white/90 max-w-2xl mx-auto">{intro.text}</p>
        </div>
      </section>
      <section className="section">
        <div className="container-page grid lg:grid-cols-2 gap-8">
          <form onSubmit={submit} className="card-soft p-8 space-y-4">
            <h2 className="text-2xl font-bold">Donation Details</h2>
            <div className="flex flex-wrap gap-2">
              {AMOUNTS.map((a) => (
                <button type="button" key={a} onClick={() => setForm({ ...form, amount: String(a) })} className={`px-4 py-2 rounded-full text-sm font-medium ${form.amount === String(a) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>₹{a.toLocaleString()}</button>
              ))}
            </div>
            {f("amount", "Amount (₹) *", { required: true, type: "number", min: 1 })}
            {f("donor_name", "Full Name *", { required: true })}
            <div className="grid sm:grid-cols-2 gap-4">
              {f("phone", "Phone *", { required: true, type: "tel" })}
              {f("email", "Email", { type: "email" })}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">Purpose</span>
                <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded-md">
                  <option>General Fund</option><option>Education</option><option>Health</option><option>Women Empowerment</option><option>Rural Development</option><option>Disaster Relief</option>
                </select>
              </label>
              {f("pan_number", "PAN (for 80G)")}
            </div>
            <label className="block">
              <span className="text-sm font-medium">Message</span>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={2} className="mt-1 w-full px-3 py-2 border rounded-md" />
            </label>
            <button disabled={loading} className="btn-hero w-full">{loading ? "Submitting..." : "Submit Donation Pledge"}</button>
          </form>
          <div className="space-y-5">
            <div className="card-soft p-6">
              <h3 className="flex items-center gap-2 font-semibold text-lg"><Smartphone className="h-5 w-5 text-saffron-deep" /> {intro.upi_label ?? "Pay via UPI"}</h3>
              <div className="mt-3 flex items-center justify-between bg-muted p-3 rounded-md">
                <code className="text-lg font-mono">{settings?.upi_id}</code>
                <button onClick={() => copy(settings?.upi_id ?? "")} className="p-2 hover:bg-background rounded"><Copy className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="card-soft p-6">
              <h3 className="flex items-center gap-2 font-semibold text-lg"><Building2 className="h-5 w-5 text-saffron-deep" /> {intro.bank_label ?? "Bank Transfer"}</h3>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{settings?.bank_details}</p>
            </div>
            <div className="card-soft p-6 bg-accent/5 border-accent/20">
              <p className="text-sm">After completing UPI or bank transfer, share the transaction reference via WhatsApp to one of our numbers for instant acknowledgement and 80G receipt.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
