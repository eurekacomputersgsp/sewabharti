import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/news")({ component: AdminNews });

function AdminNews() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-news"], queryFn: async () => (await supabase.from("news_events").select("*").order("event_date", { ascending: false })).data ?? [] });
  const [e, setE] = useState<any | null>(null);
  const empty = { title: "", slug: "", type: "news", event_date: "", venue: "", excerpt: "", content: "", cover_image: "", published: true };
  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const p = { ...e };
    if (!p.slug) p.slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!p.event_date) p.event_date = null;
    const op = p.id ? supabase.from("news_events").update(p).eq("id", p.id) : supabase.from("news_events").insert(p);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success("Saved"); setE(null); qc.invalidateQueries({ queryKey: ["admin-news"] }); }
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("news_events").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-news"] }); };
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">News & Events</h1><button onClick={() => setE(empty)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> New</button></div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Title</th><th className="p-3">Pub</th><th></th></tr></thead>
          <tbody>{(data ?? []).map((n: any) => (
            <tr key={n.id} className="border-t">
              <td className="p-3">{n.event_date}</td>
              <td className="p-3">{n.type}</td>
              <td className="p-3 font-medium">{n.title}</td>
              <td className="p-3">{n.published ? "✓" : "—"}</td>
              <td className="p-3 flex gap-1 justify-end">
                <button onClick={() => setE(n)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => del(n.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {e && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={save} className="bg-background p-6 rounded-xl w-full max-w-2xl space-y-3 my-8">
            <h2 className="text-xl font-bold">{e.id ? "Edit" : "New"} Entry</h2>
            <input required placeholder="Title" value={e.title} onChange={(ev) => setE({ ...e, title: ev.target.value })} className="w-full px-3 py-2 border rounded" />
            <input placeholder="Slug (auto)" value={e.slug} onChange={(ev) => setE({ ...e, slug: ev.target.value })} className="w-full px-3 py-2 border rounded" />
            <div className="grid grid-cols-3 gap-3">
              <select value={e.type} onChange={(ev) => setE({ ...e, type: ev.target.value })} className="px-3 py-2 border rounded"><option value="news">News</option><option value="event">Event</option></select>
              <input type="date" value={e.event_date ?? ""} onChange={(ev) => setE({ ...e, event_date: ev.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Venue" value={e.venue ?? ""} onChange={(ev) => setE({ ...e, venue: ev.target.value })} className="px-3 py-2 border rounded" />
            </div>
            <input placeholder="Excerpt" value={e.excerpt ?? ""} onChange={(ev) => setE({ ...e, excerpt: ev.target.value })} className="w-full px-3 py-2 border rounded" />
            <textarea placeholder="Content (markdown)" rows={6} value={e.content ?? ""} onChange={(ev) => setE({ ...e, content: ev.target.value })} className="w-full px-3 py-2 border rounded font-mono text-xs" />
            <ImageUploader value={e.cover_image} onChange={(u) => setE({ ...e, cover_image: u })} label="Cover image" />
            <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={e.published} onChange={(ev) => setE({ ...e, published: ev.target.checked })} /> Published</label>
            <div className="flex gap-2 justify-end"><button type="button" onClick={() => setE(null)} className="px-4 py-2 border rounded">Cancel</button><button className="btn-hero text-sm">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
