import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/testimonials")({ component: AdminT });

function AdminT() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-tt"], queryFn: async () => (await supabase.from("testimonials").select("*").order("display_order")).data ?? [] });
  const [e, setE] = useState<any | null>(null);
  const empty = { name: "", role: "", message: "", photo_url: "", published: true, display_order: 0 };
  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const op = e.id ? supabase.from("testimonials").update(e).eq("id", e.id) : supabase.from("testimonials").insert(e);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success("Saved"); setE(null); qc.invalidateQueries({ queryKey: ["admin-tt"] }); }
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("testimonials").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-tt"] }); };
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Testimonials</h1><button onClick={() => setE(empty)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> Add</button></div>
      <div className="grid md:grid-cols-2 gap-4">
        {(data ?? []).map((t: any) => (
          <div key={t.id} className="card-soft p-4">
            <p className="italic text-sm">"{t.message}"</p>
            <div className="mt-3 flex justify-between items-center">
              <div><div className="font-semibold text-sm">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
              <div className="flex gap-1">
                <button onClick={() => setE(t)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => del(t.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {e && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-background p-6 rounded-xl w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">{e.id ? "Edit" : "Add"} Testimonial</h2>
            <input required placeholder="Name" value={e.name} onChange={(ev) => setE({ ...e, name: ev.target.value })} className="w-full px-3 py-2 border rounded" />
            <input placeholder="Role" value={e.role ?? ""} onChange={(ev) => setE({ ...e, role: ev.target.value })} className="w-full px-3 py-2 border rounded" />
            <textarea required placeholder="Message" rows={3} value={e.message} onChange={(ev) => setE({ ...e, message: ev.target.value })} className="w-full px-3 py-2 border rounded" />
            <ImageUploader value={e.photo_url} onChange={(u) => setE({ ...e, photo_url: u })} label="Photo" />
            <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={e.published} onChange={(ev) => setE({ ...e, published: ev.target.checked })} /> Published</label>
            <div className="flex gap-2 justify-end"><button type="button" onClick={() => setE(null)} className="px-4 py-2 border rounded">Cancel</button><button className="btn-hero text-sm">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
