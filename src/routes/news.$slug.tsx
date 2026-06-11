import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/news/$slug")({ component: NewsDetail });

function NewsDetail() {
  const { slug } = Route.useParams();
  const { data: n, isLoading } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => (await supabase.from("news_events").select("*").eq("slug", slug).maybeSingle()).data,
  });
  if (isLoading) return <PublicLayout><div className="container-page py-20">Loading...</div></PublicLayout>;
  if (!n) return <PublicLayout><div className="container-page py-20 text-center"><h1 className="text-2xl">Not found</h1></div></PublicLayout>;
  return (
    <PublicLayout>
      <article className="container-page max-w-3xl py-12">
        <Link to="/news" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" /> All news</Link>
        <div className="flex gap-3 text-xs items-center mb-3">
          <span className={`px-2 py-0.5 rounded-full font-medium ${n.type === "event" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>{n.type === "event" ? "Event" : "News"}</span>
          {n.event_date && <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(n.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
          {n.venue && <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{n.venue}</span>}
        </div>
        <h1 className="text-4xl font-bold leading-tight">{n.title}</h1>
        {n.cover_image && <img src={publicUrl(n.cover_image)} alt={n.title} className="mt-6 rounded-xl w-full" />}
        <div className="mt-6 prose max-w-none text-lg leading-relaxed whitespace-pre-line">{n.content}</div>
      </article>
    </PublicLayout>
  );
}
