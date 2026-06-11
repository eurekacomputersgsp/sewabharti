import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings, useSiteContent } from "@/hooks/useSiteData";
import { useT } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: content } = useSiteContent();
  const { t } = useT();
  const [email, setEmail] = useState("");

  const social = (settings?.social_links as any) || {};
  const quickLinks: { label: string; path: string }[] = (settings?.footer_quick_links as any) || [];
  const phones: string[] = (settings?.phones as any) || [];
  const emails: string[] = (settings?.emails as any) || [];
  const newsletter = content?.newsletter_text ?? {};

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error && !error.message.includes("duplicate")) toast.error(error.message);
    else toast.success("Subscribed! Thank you.");
    setEmail("");
  };

  return (
    <footer className="bg-charcoal text-white/90 mt-16">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold text-saffron">{settings?.ngo_name}</div>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Serving humanity in Punjab since 1998 through education, healthcare, women empowerment and rural development.
          </p>
          <div className="flex gap-3 mt-5">
            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="p-2 bg-white/10 hover:bg-saffron rounded-full transition"><Facebook className="h-4 w-4" /></a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="p-2 bg-white/10 hover:bg-saffron rounded-full transition"><Instagram className="h-4 w-4" /></a>}
            {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer" className="p-2 bg-white/10 hover:bg-saffron rounded-full transition"><Twitter className="h-4 w-4" /></a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="p-2 bg-white/10 hover:bg-saffron rounded-full transition"><Youtube className="h-4 w-4" /></a>}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-white">{t("footer.quick_links", "Quick Links")}</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.path}><Link to={l.path} className="text-white/70 hover:text-saffron">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-white">{t("footer.contact", "Contact")}</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {settings?.address && <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-saffron" />{settings.address}</li>}
            {phones.map((p) => <li key={p} className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-saffron" />{p}</li>)}
            {emails.map((e) => <li key={e} className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-saffron" />{e}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-white">{newsletter.title ?? "Newsletter"}</h4>
          <p className="text-sm text-white/70 mb-3">{newsletter.text}</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40" />
            <button type="submit" className="px-4 py-2 bg-saffron rounded-md text-sm font-medium hover:bg-saffron-deep transition">
              {t("cta.subscribe", "Subscribe")}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-white/50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {settings?.ngo_name}. {t("footer.rights", "All rights reserved.")}</span>
          <span><Link to="/auth" className="hover:text-saffron">Admin Login</Link></span>
        </div>
      </div>
    </footer>
  );
}
