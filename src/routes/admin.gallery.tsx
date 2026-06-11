import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/gallery")({ component: AdminGallery });

function AdminGallery() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const { data: photos } = useQuery({ queryKey: ["admin-photos"], queryFn: async () => (await supabase.from("gallery_photos").select("*").order("display_order")).data ?? [] });
  const { data: videos } = useQuery({ queryKey: ["admin-videos"], queryFn: async () => (await supabase.from("gallery_videos").select("*").order("display_order")).data ?? [] });
  const [editing, setEditing] = useState<any | null>(null);
  const isPhoto = tab === "photos";
  const empty = isPhoto ? { image_url: "", caption: "", album: "", display_order: 0 } : { title: "", youtube_id: "", album: "", display_order: 0 };
  const table = isPhoto ? "gallery_photos" : "gallery_videos";
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const op = editing.id ? supabase.from(table).update(editing).eq("id", editing.id) : supabase.from(table).insert(editing);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: [`admin-${tab}`] }); }
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from(table).delete().eq("id", id); qc.invalidateQueries({ queryKey: [`admin-${tab}`] }); };
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Gallery</h1><button onClick={() => setEditing(empty)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> Add</button></div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("photos")} className={`px-3 py-1.5 rounded text-sm ${tab === "photos" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Photos ({photos?.length ?? 0})</button>
        <button onClick={() => setTab("videos")} className={`px-3 py-1.5 rounded text-sm ${tab === "videos" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Videos ({videos?.length ?? 0})</button>
      </div>
      {isPhoto ? (
        <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(photos ?? []).map((p: any) => (
            <div key={p.id} className="card-soft overflow-hidden">
              <img src={p.image_url.startsWith("http") ? p.image_url : ""} alt="" className="w-full aspect-square object-cover" />
              <div className="p-2 text-xs">
                <div className="truncate">{p.caption}</div>
                <div className="text-muted-foreground">{p.album}</div>
                <div className="flex gap-1 mt-1">
                  <button onClick={() => setEditing(p)} className="p-1 hover:bg-muted rounded"><Pencil className="h-3 w-3" /></button>
                  <button onClick={() => del(p.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {(videos ?? []).map((v: any) => (
            <div key={v.id} className="card-soft p-3">
              <div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} className="w-full h-full" /></div>
              <div className="flex justify-between mt-2"><div className="text-sm font-medium">{v.title}</div>
                <div className="flex gap-1"><button onClick={() => setEditing(v)} className="p-1 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button><button onClick={() => del(v.id)} className="p-1 text-destructive"><Trash2 className="h-4 w-4" /></button></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-background p-6 rounded-xl w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">{editing.id ? "Edit" : "Add"} {isPhoto ? "Photo" : "Video"}</h2>
            {isPhoto ? (
              <>
                <ImageUploader value={editing.image_url} onChange={(u) => setEditing({ ...editing, image_url: u })} label="Image" />
                <input placeholder="Caption" value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </>
            ) : (
              <>
                <input required placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border rounded" />
                <input required placeholder="YouTube ID (e.g. dQw4w9WgXcQ)" value={editing.youtube_id} onChange={(e) => setEditing({ ...editing, youtube_id: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </>
            )}
            <input placeholder="Album / Category" value={editing.album ?? ""} onChange={(e) => setEditing({ ...editing, album: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <input type="number" placeholder="Order" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded" />
            <div className="flex gap-2 justify-end"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded">Cancel</button><button className="btn-hero text-sm">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
