import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/team")({ component: AdminTeam });

function AdminTeam() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-team"], queryFn: async () => (await supabase.from("team_members").select("*").order("display_order")).data ?? [] });
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { name: "", designation: "", bio: "", photo_url: "", display_order: 0 };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const op = editing.id ? supabase.from("team_members").update(editing).eq("id", editing.id) : supabase.from("team_members").insert(editing);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team"] }); }
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("team_members").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-team"] }); };
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Team Members</h1><button onClick={() => setEditing(empty)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> Add</button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? []).map((m: any) => (
          <div key={m.id} className="card-soft p-4 text-center">
            {m.photo_url && <img src={m.photo_url.startsWith("http") ? m.photo_url : ""} alt="" className="h-20 w-20 rounded-full mx-auto object-cover" />}
            <div className="font-semibold mt-2">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.designation}</div>
            <div className="flex gap-1 justify-center mt-2">
              <button onClick={() => setEditing(m)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(m.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-background p-6 rounded-xl w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">{editing.id ? "Edit" : "Add"} Team Member</h2>
            <input required placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <input placeholder="Designation" value={editing.designation ?? ""} onChange={(e) => setEditing({ ...editing, designation: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <textarea placeholder="Bio" rows={2} value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className="w-full px-3 py-2 border rounded" />
            <ImageUploader value={editing.photo_url} onChange={(u) => setEditing({ ...editing, photo_url: u })} label="Photo" />
            <input type="number" placeholder="Order" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded" />
            <div className="flex gap-2 justify-end"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded">Cancel</button><button className="btn-hero text-sm">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
