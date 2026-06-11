import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [{ title: "Gallery — Sewa Bharti Punjab" }] }),
});

function GalleryPage() {
  const { data: photos } = useQuery({ queryKey: ["photos"], queryFn: async () => (await supabase.from("gallery_photos").select("*").order("display_order")).data ?? [] });
  const { data: videos } = useQuery({ queryKey: ["videos"], queryFn: async () => (await supabase.from("gallery_videos").select("*").order("display_order")).data ?? [] });
  const albums = ["All", ...new Set((photos ?? []).map((p: any) => p.album).filter(Boolean))];
  const [album, setAlbum] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const filtered = (photos ?? []).filter((p: any) => album === "All" || p.album === album);
  return (
    <PublicLayout>
      <section className="text-white py-16" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center"><h1 className="text-4xl md:text-5xl font-bold">Gallery</h1></div>
      </section>
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {albums.map((a) => <button key={a} onClick={() => setAlbum(a)} className={`px-4 py-2 rounded-full text-sm font-medium ${album === a ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{a}</button>)}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p: any) => (
              <button key={p.id} onClick={() => setLightbox(publicUrl(p.image_url))} className="aspect-square overflow-hidden rounded-lg group">
                <img src={publicUrl(p.image_url)} alt={p.caption} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </button>
            ))}
          </div>
          {(videos ?? []).length > 0 && (
            <>
              <h2 className="heading-section mt-16 mb-6">Videos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(videos ?? []).map((v: any) => (
                  <div key={v.id} className="card-soft overflow-hidden">
                    <div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} className="w-full h-full" allowFullScreen title={v.title} /></div>
                    <div className="p-4 font-medium">{v.title}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white p-2"><X /></button>
          <img src={lightbox} alt="" className="max-h-full max-w-full" />
        </div>
      )}
    </PublicLayout>
  );
}
