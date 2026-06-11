import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteData";

export const Route = createFileRoute("/volunteer")({
  component: VolunteerPage,
  head: () => ({ meta: [{ title: "Volunteer — Sewa Bharti Punjab" }] }),
});

function VolunteerPage() {
  const { data: content } = useSiteContent();
  const intro = content?.volunteer_intro ?? {};
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", skills: "", availability: "", message: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("volunteers").insert(form);
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Thank you! We'll contact you within 48 hours."); setForm({ name: "", phone: "", email: "", city: "", skills: "", availability: "", message: "" }); }
  };
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
        <div className="container-page max-w-2xl">
          <form onSubmit={submit} className="card-soft p-8 space-y-4">
            {f("name", "Full Name *", { required: true })}
            <div className="grid sm:grid-cols-2 gap-4">
              {f("phone", "Phone *", { required: true, type: "tel" })}
              {f("email", "Email", { type: "email" })}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {f("city", "City")}
              {f("availability", "Availability (e.g. Weekends)")}
            </div>
            <label className="block">
              <span className="text-sm font-medium">Skills / Areas of interest</span>
              <textarea value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} rows={2} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Message</span>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary outline-none" />
            </label>
            <button disabled={loading} className="btn-hero w-full">{loading ? "Submitting..." : "Register as Volunteer"}</button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
