import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/volunteers")({ component: AdminVolunteers });

function AdminVolunteers() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-volunteers"], queryFn: async () => (await supabase.from("volunteers").select("*").order("created_at", { ascending: false })).data ?? [] });
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("volunteers").update({ status }).eq("id", id);
    if (!error) { qc.invalidateQueries({ queryKey: ["admin-volunteers"] }); toast.success("Updated"); }
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("volunteers").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-volunteers"] });
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Volunteers</h1>
      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">City</th><th className="p-3">Skills</th><th className="p-3">Status</th><th></th></tr></thead>
          <tbody>{(data ?? []).map((v: any) => (
            <tr key={v.id} className="border-t">
              <td className="p-3">{new Date(v.created_at).toLocaleDateString()}</td>
              <td className="p-3 font-medium">{v.name}</td>
              <td className="p-3">{v.phone}</td>
              <td className="p-3">{v.city}</td>
              <td className="p-3 max-w-xs truncate">{v.skills}</td>
              <td className="p-3"><select value={v.status} onChange={(e) => setStatus(v.id, e.target.value)} className="px-2 py-1 border rounded text-xs"><option value="new">New</option><option value="contacted">Contacted</option><option value="active">Active</option></select></td>
              <td className="p-3"><button onClick={() => del(v.id)} className="text-destructive p-1.5 hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
