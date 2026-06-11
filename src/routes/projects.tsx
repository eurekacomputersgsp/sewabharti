import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({ meta: [{ title: "Our Projects — Sewa Bharti Punjab" }] }),
});

const CATEGORIES = ["All", "Education", "Health", "Women Empowerment", "Rural Development", "Disaster Relief"];

function ProjectsPage() {
  const [cat, setCat] = useState("All");
  const { data: items } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await supabase.from("projects").select("*").order("display_order")).data ?? [],
  });
  const filtered = (items ?? []).filter((p: any) => cat === "All" || p.category === cat);
  return (
    <PublicLayout>
      <section className="text-white py-16" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Projects</h1>
          <p className="mt-3 text-white/90">Real programs creating real impact across Punjab.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>{c}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p: any) => (
              <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} className="card-soft overflow-hidden group hover:-translate-y-1 transition">
                <div className="aspect-[4/3] overflow-hidden"><img src={publicUrl(p.cover_image)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-saffron-deep uppercase tracking-wider">{p.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-accent/15 text-accent" : "bg-muted"}`}>{p.status}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.short_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
