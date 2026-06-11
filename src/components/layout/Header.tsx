import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Heart, Globe } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { useT, type Lang } from "@/i18n/LanguageContext";
import { publicUrl } from "@/lib/storage";

export function Header() {
  const { data: settings } = useSiteSettings();
  const { lang, setLang, t } = useT();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navLinks: { label: string; path: string }[] = (settings?.nav_links as any) || [];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          {settings?.logo_url && (
            <img src={publicUrl(settings.logo_url)} alt={settings.ngo_name} className="h-12 w-12 rounded-full object-cover" />
          )}
          <div className="leading-tight">
            <div className="font-display font-bold text-lg text-saffron-deep">{settings?.ngo_name ?? "Sewa Bharti"}</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Gurdaspur · Punjab</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.path;
            const tkey = `nav.${l.path === "/" ? "home" : l.path.slice(1)}`;
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${active ? "text-primary bg-primary/10" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}
              >
                {t(tkey, l.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 border rounded-full px-2 py-1">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            {(["en", "hi", "pa"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs px-2 py-0.5 rounded-full ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l === "en" ? "EN" : l === "hi" ? "हिं" : "ਪੰ"}
              </button>
            ))}
          </div>
          <Link to="/donate" className="hidden md:inline-flex btn-hero text-sm">
            <Heart className="h-4 w-4" /> {t("nav.donate", "Donate Now")}
          </Link>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="container-page py-3 flex flex-col gap-1">
            {navLinks.map((l) => {
              const tkey = `nav.${l.path === "/" ? "home" : l.path.slice(1)}`;
              return (
                <Link key={l.path} to={l.path} onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-muted text-sm font-medium">
                  {t(tkey, l.label)}
                </Link>
              );
            })}
            <Link to="/donate" onClick={() => setOpen(false)} className="btn-hero mt-2 text-sm">
              <Heart className="h-4 w-4" /> {t("nav.donate", "Donate Now")}
            </Link>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-muted-foreground">Lang:</span>
              {(["en", "hi", "pa"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded ${lang === l ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "ਪੰਜਾਬੀ"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
