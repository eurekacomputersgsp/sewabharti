import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useSiteContent } from "@/hooks/useSiteData";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About — Sewa Bharti Punjab" }] }),
});

function AboutPage() {
  const { data: content } = useSiteContent();
  const { data: team } = useQuery({
    queryKey: ["team"],
    queryFn: async () => (await supabase.from("team_members").select("*").order("display_order")).data ?? [],
  });
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").eq("published", true).order("display_order")).data ?? [],
  });
  const history = content?.about_history ?? {};
  const mission = content?.mission ?? {};
  const vision = content?.vision ?? {};
  return (
    <PublicLayout>
      <section className="text-white py-20" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Sewa Bharti Punjab</h1>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">Serving Punjab's underprivileged with compassion, dignity and sewa since 1998.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section">{history.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{history.text}</p>
        </div>
      </section>
      <section className="section bg-cream">
        <div className="container-page grid md:grid-cols-2 gap-6">
          {[mission, vision].map((b: any, i: number) => (
            <div key={i} className="card-soft p-8">
              <h3 className="text-2xl font-bold">{b.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <h2 className="heading-section text-center mb-10">Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(team ?? []).map((m: any) => (
              <div key={m.id} className="card-soft p-6 text-center">
                {m.photo_url && <img src={publicUrl(m.photo_url)} alt={m.name} className="h-24 w-24 rounded-full mx-auto object-cover" />}
                <h3 className="mt-4 font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-saffron-deep">{m.designation}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-cream">
        <div className="container-page">
          <h2 className="heading-section text-center mb-10">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(testimonials ?? []).map((t: any) => (
              <div key={t.id} className="card-soft p-6">
                <p className="text-foreground/80 italic">"{t.message}"</p>
                <div className="mt-4 flex items-center gap-3">
                  {t.photo_url && <img src={publicUrl(t.photo_url)} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                  <div><div className="font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
