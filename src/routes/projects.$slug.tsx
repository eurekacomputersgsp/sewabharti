import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => (await supabase.from("projects").select("*").eq("slug", slug).maybeSingle()).data,
  });
  if (isLoading) return <PublicLayout><div className="container-page py-20">Loading...</div></PublicLayout>;
  if (!p) return <PublicLayout><div className="container-page py-20 text-center"><h1 className="text-2xl">Project not found</h1><Link to="/projects" className="text-primary mt-4 inline-block">← Back to projects</Link></div></PublicLayout>;
  const gallery = (p.gallery_images as any[]) ?? [];
  return (
    <PublicLayout>
      <div className="relative h-[420px]">
        <img src={publicUrl(p.cover_image)} alt={p.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-page pb-10 text-white">
          <Link to="/projects" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-3"><ArrowLeft className="h-4 w-4" /> Back</Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-saffron">{p.category}</span>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold">{p.title}</h1>
        </div>
      </div>
      <section className="section">
        <div className="container-page max-w-3xl">
          <p className="text-lg leading-relaxed whitespace-pre-line">{p.description}</p>
          {gallery.length > 0 && (
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {gallery.map((g, i) => <img key={i} src={publicUrl(g)} alt="" className="rounded-lg" />)}
            </div>
          )}
          <div className="mt-12 card-soft p-8 text-center" style={{ background: "var(--gradient-warm)" }}>
            <h3 className="text-2xl font-bold text-white">Support this project</h3>
            <p className="mt-2 text-white/90">Your donation directly funds this work.</p>
            <Link to="/donate" className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-semibold"><Heart className="h-5 w-5" /> Donate Now</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
