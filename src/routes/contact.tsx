import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, useSiteSettings } from "@/hooks/useSiteData";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — Sewa Bharti Punjab" }] }),
});

function ContactPage() {
  const { data: content } = useSiteContent();
  const { data: settings } = useSiteSettings();
  const intro = content?.contact_intro ?? {};
  const phones: string[] = (settings?.phones as any) ?? [];
  const emails: string[] = (settings?.emails as any) ?? [];
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Message sent! We'll respond soon."); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }
  };
  return (
    <PublicLayout>
      <section className="text-white py-16" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{intro.title}</h1>
          <p className="mt-3 text-white/90">{intro.text}</p>
        </div>
      </section>
      <section className="section">
        <div className="container-page grid lg:grid-cols-2 gap-8">
          <form onSubmit={submit} className="card-soft p-8 space-y-4">
            <h2 className="text-2xl font-bold">Send a Message</h2>
            <input required placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            <div className="grid sm:grid-cols-2 gap-4">
              <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            <textarea required placeholder="Your message *" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            <button disabled={loading} className="btn-hero w-full">{loading ? "Sending..." : "Send Message"}</button>
          </form>
          <div className="space-y-5">
            <div className="card-soft p-6 space-y-4">
              <div className="flex gap-3"><MapPin className="h-5 w-5 text-saffron-deep shrink-0 mt-0.5" /><div><div className="font-semibold">Address</div><p className="text-muted-foreground text-sm">{settings?.address}</p></div></div>
              <div className="flex gap-3"><Phone className="h-5 w-5 text-saffron-deep shrink-0 mt-0.5" /><div><div className="font-semibold">Phone</div>{phones.map((p) => <a key={p} href={`tel:${p}`} className="block text-muted-foreground hover:text-primary text-sm">{p}</a>)}</div></div>
              <div className="flex gap-3"><Mail className="h-5 w-5 text-saffron-deep shrink-0 mt-0.5" /><div><div className="font-semibold">Email</div>{emails.map((e) => <a key={e} href={`mailto:${e}`} className="block text-muted-foreground hover:text-primary text-sm">{e}</a>)}</div></div>
            </div>
            {settings?.map_embed_url && (
              <div className="card-soft overflow-hidden aspect-video">
                <iframe src={settings.map_embed_url} className="w-full h-full border-0" loading="lazy" title="Map" />
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
