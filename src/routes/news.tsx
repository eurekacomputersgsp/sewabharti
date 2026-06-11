import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({ meta: [{ title: "News & Events — Sewa Bharti Punjab" }] }),
});

function NewsPage() {
  const { data: items } = useQuery({
    queryKey: ["news"],
    queryFn: async () => (await supabase.from("news_events").select("*").eq("published", true).order("event_date", { ascending: false })).data ?? [],
  });
  return (
    <PublicLayout>
      <section className="text-white py-16" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center"><h1 className="text-4xl md:text-5xl font-bold">News & Events</h1></div>
      </section>
      <section className="section">
        <div className="container-page grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items ?? []).map((n: any) => (
            <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="card-soft overflow-hidden group">
              <div className="aspect-video overflow-hidden"><img src={publicUrl(n.cover_image)} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${n.type === "event" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>{n.type === "event" ? "Event" : "News"}</span>
                  {n.event_date && <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(n.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                </div>
                <h3 className="mt-3 font-semibold text-lg">{n.title}</h3>
                {n.venue && <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{n.venue}</p>}
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
