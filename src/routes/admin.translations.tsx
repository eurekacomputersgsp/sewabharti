import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/translations")({ component: AdminTr });

function AdminTr() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-tr"], queryFn: async () => (await supabase.from("translations").select("*").order("key")).data ?? [] });
  const [neu, setNeu] = useState({ key: "", lang: "en", value: "" });
  const grouped: Record<string, Record<string, string>> = {};
  (data ?? []).forEach((r: any) => { grouped[r.key] = grouped[r.key] ?? {}; grouped[r.key][r.lang] = r.value; });
  const update = async (key: string, lang: string, value: string) => {
    const { error } = await supabase.from("translations").upsert({ key, lang, value }, { onConflict: "key,lang" });
    if (!error) { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["translations"] }); qc.invalidateQueries({ queryKey: ["admin-tr"] }); }
  };
  const del = async (key: string) => { if (!confirm(`Delete all langs for "${key}"?`)) return; await supabase.from("translations").delete().eq("key", key); qc.invalidateQueries({ queryKey: ["admin-tr"] }); };
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("translations").upsert(neu, { onConflict: "key,lang" });
    setNeu({ key: "", lang: "en", value: "" });
    qc.invalidateQueries({ queryKey: ["admin-tr"] });
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Translations</h1>
      <form onSubmit={add} className="card-soft p-4 mb-6 flex gap-2">
        <input required placeholder="key (e.g. nav.home)" value={neu.key} onChange={(e) => setNeu({ ...neu, key: e.target.value })} className="flex-1 px-3 py-2 border rounded text-sm font-mono" />
        <select value={neu.lang} onChange={(e) => setNeu({ ...neu, lang: e.target.value })} className="px-3 py-2 border rounded text-sm"><option value="en">EN</option><option value="hi">HI</option><option value="pa">PA</option></select>
        <input required placeholder="value" value={neu.value} onChange={(e) => setNeu({ ...neu, value: e.target.value })} className="flex-1 px-3 py-2 border rounded text-sm" />
        <button className="btn-hero text-sm"><Plus className="h-4 w-4" /> Add</button>
      </form>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Key</th><th className="p-3">English</th><th className="p-3">हिन्दी</th><th className="p-3">ਪੰਜਾਬੀ</th><th></th></tr></thead>
          <tbody>{Object.entries(grouped).map(([key, vals]) => (
            <tr key={key} className="border-t">
              <td className="p-3 font-mono text-xs">{key}</td>
              {["en", "hi", "pa"].map((l) => (
                <td key={l} className="p-2"><input defaultValue={vals[l] ?? ""} onBlur={(e) => e.target.value !== (vals[l] ?? "") && update(key, l, e.target.value)} className="w-full px-2 py-1 border rounded text-sm" /></td>
              ))}
              <td className="p-2"><button onClick={() => del(key)} className="p-1 text-destructive"><Trash2 className="h-4 w-4" /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
