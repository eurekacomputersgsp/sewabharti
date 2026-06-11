import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/subscribers")({ component: AdminSubscribers });

function AdminSubscribers() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-subs"], queryFn: async () => (await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })).data ?? [] });
  const del = async (id: string) => { await supabase.from("newsletter_subscribers").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-subs"] }); };
  const exportCsv = () => {
    const csv = "email,subscribed_at\n" + (data ?? []).map((s: any) => `${s.email},${s.created_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
  };
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Newsletter Subscribers ({data?.length ?? 0})</h1><button onClick={exportCsv} className="btn-hero text-sm">Export CSV</button></div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Email</th><th className="p-3">Subscribed</th><th></th></tr></thead>
          <tbody>{(data ?? []).map((s: any) => (
            <tr key={s.id} className="border-t"><td className="p-3">{s.email}</td><td className="p-3">{new Date(s.created_at).toLocaleDateString()}</td>
              <td className="p-3 text-right"><button onClick={() => del(s.id)} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
