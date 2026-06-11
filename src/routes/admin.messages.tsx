import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

function AdminMessages() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-messages"], queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [] });
  const setStatus = async (id: string, status: string) => { await supabase.from("contact_messages").update({ status }).eq("id", id); qc.invalidateQueries({ queryKey: ["admin-messages"] }); };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("contact_messages").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-messages"] }); };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      <div className="space-y-3">
        {(data ?? []).map((m: any) => (
          <div key={m.id} className={`card-soft p-4 ${m.status === "unread" ? "border-l-4 border-l-saffron" : ""}`}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex gap-2 items-center"><strong>{m.name}</strong> <span className="text-xs text-muted-foreground">{m.email} · {m.phone}</span></div>
                {m.subject && <div className="text-sm font-medium mt-1">{m.subject}</div>}
                <p className="text-sm mt-2 whitespace-pre-line">{m.message}</p>
                <div className="text-xs text-muted-foreground mt-2">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <select value={m.status} onChange={(e) => setStatus(m.id, e.target.value)} className="px-2 py-1 border rounded text-xs"><option value="unread">Unread</option><option value="read">Read</option><option value="replied">Replied</option></select>
                <button onClick={() => del(m.id)} className="text-destructive p-1.5 hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4 mx-auto" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
