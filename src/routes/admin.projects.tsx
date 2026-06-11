import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/projects")({ component: AdminProjects });

const CATS = ["Education", "Health", "Women Empowerment", "Rural Development", "Disaster Relief"];

function AdminProjects() {
  const qc = useQueryClient();
  const { data: items } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => (await supabase.from("projects").select("*").order("display_order")).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { title: "", slug: "", category: "Education", short_description: "", description: "", cover_image: "", status: "active", featured: false, display_order: 0 };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing };
    if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const op = payload.id ? supabase.from("projects").update(payload).eq("id", payload.id) : supabase.from("projects").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-projects"] }); qc.invalidateQueries({ queryKey: ["featured-projects"] }); qc.invalidateQueries({ queryKey: ["projects"] }); }
  };
  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-projects"] }); }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={() => setEditing(empty)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> New Project</button>
      </div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Featured</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {(items ?? []).map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">{p.featured ? "★" : "—"}</td>
                <td className="p-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={save} className="bg-background rounded-xl p-6 w-full max-w-2xl space-y-3 my-8">
            <h2 className="text-xl font-bold">{editing.id ? "Edit" : "New"} Project</h2>
            <input required placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <input placeholder="Slug (auto from title)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <div className="grid grid-cols-2 gap-3">
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="px-3 py-2 border rounded">{CATS.map((c) => <option key={c}>{c}</option>)}</select>
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="px-3 py-2 border rounded"><option value="active">Active</option><option value="completed">Completed</option></select>
            </div>
            <input placeholder="Short description" value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <textarea placeholder="Full description" rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <ImageUploader value={editing.cover_image} onChange={(url) => setEditing({ ...editing, cover_image: url })} label="Cover image" />
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
              <label className="text-sm">Order: <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} className="w-20 ml-1 px-2 py-1 border rounded" /></label>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded border">Cancel</button>
              <button className="btn-hero text-sm">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
