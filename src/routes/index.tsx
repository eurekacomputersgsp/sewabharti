import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Heart, Users, ArrowRight, Quote } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useSiteContent, useSiteSettings } from "@/hooks/useSiteData";
import { useT } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({ meta: [{ title: "Sewa Bharti Punjab — Serving Humanity Since 1998" }, { name: "description", content: "NGO based in Gurdaspur, Punjab — education, healthcare and rural development." }] }),
});

function HomePage() {
  const { data: content } = useSiteContent();
  const { data: settings } = useSiteSettings();
  const { t } = useT();
  const sections = (settings?.section_visibility as any) ?? {};

  const slides = (content?.hero_slides as any[]) ?? [];
  const counters = (content?.impact_counters as any[]) ?? [];
  const mission = content?.mission ?? {};
  const vision = content?.vision ?? {};
  const ctaDonate = content?.cta_donate ?? {};
  const ctaVolunteer = content?.cta_volunteer ?? {};

  return (
    <PublicLayout>
      {sections.hero !== false && <Hero slides={slides} t={t} />}
      {sections.mission !== false && <MissionVision mission={mission} vision={vision} t={t} />}
      {sections.counters !== false && counters.length > 0 && <Counters counters={counters} t={t} />}
      {sections.featured_projects !== false && <FeaturedProjects t={t} />}
      {sections.testimonials !== false && <Testimonials t={t} />}
      {sections.latest_news !== false && <LatestNews t={t} />}
      {sections.donate_cta !== false && <CTABand cta={ctaDonate} to="/donate" variant="warm" />}
      {sections.volunteer_cta !== false && <CTABand cta={ctaVolunteer} to="/volunteer" variant="green" />}
    </PublicLayout>
  );
}

function Hero({ slides, t }: any) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);
  if (!slides.length) return null;
  const s = slides[i];
  return (
    <section className="relative h-[640px] overflow-hidden">
      {slides.map((sl: any, idx: number) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}>
          <img src={publicUrl(sl.image)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
      ))}
      <div className="relative container-page h-full flex flex-col justify-center text-white max-w-3xl">
        <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-xs font-medium uppercase tracking-wider mb-5 w-fit">
          Sewa · Service · Compassion
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-up">{s.headline}</h1>
        <p className="mt-5 text-lg md:text-xl text-white/90 max-w-2xl animate-fade-up">{s.subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-3 animate-fade-up">
          <Link to="/donate" className="btn-hero"><Heart className="h-5 w-5" /> {t("cta.donate", "Donate Now")}</Link>
          <Link to="/volunteer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 font-semibold transition">
            <Users className="h-5 w-5" /> {t("cta.volunteer", "Become a Volunteer")}
          </Link>
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"><ChevronLeft /></button>
          <button onClick={() => setI((x) => (x + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"><ChevronRight /></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_: any, idx: number) => (
              <button key={idx} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function MissionVision({ mission, vision, t }: any) {
  return (
    <section className="section bg-cream">
      <div className="container-page">
        <div className="text-center mb-12">
          <p className="text-saffron-deep font-semibold text-sm uppercase tracking-wider">Who We Are</p>
          <h2 className="heading-section mt-2">{t("section.mission", "Mission & Vision")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[mission, vision].map((b: any, idx: number) => (
            <div key={idx} className="card-soft p-8 hover:shadow-elegant transition" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "var(--gradient-warm)" }}>
                <Heart className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counters({ counters, t }: any) {
  return (
    <section className="section text-white relative" style={{ background: "var(--gradient-warm)" }}>
      <div className="container-page">
        <h2 className="heading-section text-center mb-12 text-white">{t("section.impact", "Our Impact")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {counters.map((c: any, idx: number) => (
            <CounterCard key={idx} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterCard({ value, label, suffix }: any) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const dur = 1500, start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1);
          setN(Math.floor(value * (0.2 + 0.8 * p)));
          if (p < 1) requestAnimationFrame(tick);
          else setN(value);
        };
        tick();
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold">{n.toLocaleString()}{suffix}</div>
      <div className="mt-2 text-white/85">{label}</div>
    </div>
  );
}

function FeaturedProjects({ t }: any) {
  const { data: projects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("featured", true).order("display_order").limit(4);
      return data ?? [];
    },
  });
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-wrap justify-between items-end mb-10 gap-4">
          <div>
            <p className="text-saffron-deep font-semibold text-sm uppercase tracking-wider">Our Work</p>
            <h2 className="heading-section mt-2">{t("section.featured_projects", "Featured Projects")}</h2>
          </div>
          <Link to="/projects" className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(projects ?? []).map((p: any) => (
            <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} className="card-soft overflow-hidden group hover:-translate-y-1 transition">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={publicUrl(p.cover_image)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-saffron-deep uppercase tracking-wider">{p.category}</span>
                <h3 className="mt-2 font-display font-semibold text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ t }: any) {
  const { data: items } = useQuery({
    queryKey: ["testimonials-home"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").eq("published", true).order("display_order");
      return data ?? [];
    },
  });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!items?.length) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items?.length]);
  if (!items?.length) return null;
  const c = items[i];
  return (
    <section className="section bg-cream">
      <div className="container-page max-w-4xl text-center">
        <p className="text-saffron-deep font-semibold text-sm uppercase tracking-wider">Voices of Change</p>
        <h2 className="heading-section mt-2 mb-10">{t("section.testimonials", "Success Stories")}</h2>
        <div className="card-soft p-10 relative">
          <Quote className="h-12 w-12 mx-auto text-saffron mb-4" />
          <p className="text-lg md:text-xl leading-relaxed text-foreground/85">"{c.message}"</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {c.photo_url && <img src={publicUrl(c.photo_url)} alt={c.name} className="h-12 w-12 rounded-full object-cover" />}
            <div className="text-left">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.role}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestNews({ t }: any) {
  const { data: items } = useQuery({
    queryKey: ["news-home"],
    queryFn: async () => {
      const { data } = await supabase.from("news_events").select("*").eq("published", true).order("event_date", { ascending: false }).limit(3);
      return data ?? [];
    },
  });
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-wrap justify-between items-end mb-10 gap-4">
          <div>
            <p className="text-saffron-deep font-semibold text-sm uppercase tracking-wider">Updates</p>
            <h2 className="heading-section mt-2">{t("section.latest_news", "Latest Activities")}</h2>
          </div>
          <Link to="/news" className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">All news <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(items ?? []).map((n: any) => (
            <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="card-soft overflow-hidden group">
              <div className="aspect-video overflow-hidden">
                <img src={publicUrl(n.cover_image)} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${n.type === "event" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>{n.type === "event" ? "Event" : "News"}</span>
                  {n.event_date && <span className="text-muted-foreground">{new Date(n.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                </div>
                <h3 className="mt-3 font-display font-semibold text-lg leading-snug group-hover:text-primary transition">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ cta, to, variant }: any) {
  const bg = variant === "warm" ? "var(--gradient-warm)" : "linear-gradient(135deg, oklch(0.40 0.12 145), oklch(0.30 0.10 150))";
  return (
    <section className="py-16 text-white" style={{ background: bg }}>
      <div className="container-page flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">{cta.headline}</h2>
          <p className="mt-2 text-white/90 text-lg">{cta.subheadline}</p>
        </div>
        <Link to={to} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-foreground rounded-full font-semibold whitespace-nowrap hover:scale-105 transition">
          {cta.button} <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
