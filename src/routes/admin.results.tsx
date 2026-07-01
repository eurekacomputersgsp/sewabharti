import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Upload, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile, publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/admin/results")({ component: AdminResults });

const EMPTY = { title: "", description: "", file_url: "", file_type: "", published_date: new Date().toISOString().slice(0, 10), is_published: true, sort_order: 0 };

function AdminResults() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => (await supabase.from("results").select("*").order("sort_order").order("published_date", { ascending: false })).data ?? [],
  });
  const [edit, setEdit] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [delTarget, setDelTarget] = useState<any | null>(null);
  const [delPwd, setDelPwd] = useState("");
  const [delWord, setDelWord] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setBusy(true);
    try {
      const url = await uploadFile(f, "results");
      const ext = (f.name.split(".").pop() || "").toLowerCase();
      setEdit((prev: any) => ({ ...prev, file_url: url, file_type: ext }));
      toast.success("File uploaded");
    } catch (e: any) { toast.error(e.message ?? "Upload failed"); }
    finally { setBusy(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit.file_url) return toast.error("Please upload a result file (JPG, PNG, or PDF).");
    const p = { ...edit };
    const op = p.id ? supabase.from("results").update(p).eq("id", p.id) : supabase.from("results").insert(p);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin-results"] });
  };

  const confirmDelete = async () => {
    if (delWord !== "delete") return toast.error('Please type "delete" exactly.');
    if (!delPwd) return toast.error("Enter your password.");
    setDelBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const email = u.user?.email;
    if (!email) { setDelBusy(false); return toast.error("Not signed in."); }
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password: delPwd });
    if (authErr) { setDelBusy(false); return toast.error("Incorrect password."); }
    const { error } = await supabase.from("results").delete().eq("id", delTarget.id);
    setDelBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDelTarget(null); setDelPwd(""); setDelWord("");
    qc.invalidateQueries({ queryKey: ["admin-results"] });
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Results</h1>
        <button onClick={() => setEdit(EMPTY)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> New Result</button>
      </div>

      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr><th className="p-3">Date</th><th className="p-3">Title</th><th className="p-3">Type</th><th className="p-3">Published</th><th className="p-3">File</th><th></th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.published_date}</td>
                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3 uppercase text-xs">{r.file_type}</td>
                <td className="p-3">{r.is_published ? "✓" : "—"}</td>
                <td className="p-3"><a href={publicUrl(r.file_url)} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Open</a></td>
                <td className="p-3 flex gap-1 justify-end">
                  <button onClick={() => setEdit(r)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDelTarget(r)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (<tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No results yet.</td></tr>)}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={save} className="bg-background p-6 rounded-xl w-full max-w-xl space-y-3 my-8">
            <h2 className="text-xl font-bold">{edit.id ? "Edit" : "New"} Result</h2>
            <div>
              <label className="text-sm font-medium">Title *</label>
              <input required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea rows={3} value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Published Date</label>
                <input type="date" value={edit.published_date ?? ""} onChange={(e) => setEdit({ ...edit, published_date: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-medium">Sort Order</label>
                <input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Result File (JPG, PNG, or PDF) *</label>
              <div className="flex gap-2 items-center">
                <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 bg-muted rounded text-sm flex items-center gap-1.5 hover:bg-muted/70">
                  <Upload className="h-4 w-4" /> {busy ? "Uploading…" : edit.file_url ? "Replace File" : "Upload File"}
                </button>
                {edit.file_url && (
                  <a href={publicUrl(edit.file_url)} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Preview ({edit.file_type})
                  </a>
                )}
              </div>
              <input ref={fileRef} type="file" hidden accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
            <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={edit.is_published} onChange={(e) => setEdit({ ...edit, is_published: e.target.checked })} /> Published (visible on public site)</label>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEdit(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button className="btn-hero text-sm">Save</button>
            </div>
          </form>
        </div>
      )}

      {delTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-destructive">Delete Result</h2>
            <p className="text-sm text-muted-foreground">Permanently delete <strong>{delTarget.title}</strong>? This cannot be undone.</p>
            <div>
              <label className="text-sm font-medium">Admin Password</label>
              <input type="password" autoFocus value={delPwd} onChange={(e) => setDelPwd(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Type <span className="font-mono bg-muted px-1.5 rounded">delete</span> to confirm</label>
              <input value={delWord} onChange={(e) => setDelWord(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setDelTarget(null); setDelPwd(""); setDelWord(""); }} className="px-4 py-2 border rounded">Cancel</button>
              <button disabled={delBusy} onClick={confirmDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded disabled:opacity-50">
                {delBusy ? "Deleting…" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
