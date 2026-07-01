import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Download, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/certificates")({ component: AdminCertificates });

const EMPTY = {
  registration_number: "",
  serial_number: "",
  name: "",
  son_of: "",
  course_name: "",
  starting_date: "",
  ending_date: "",
  grade: "",
};

function AdminCertificates() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-certs"],
    queryFn: async () => (await supabase.from("certificates").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [edit, setEdit] = useState<any | null>(null);
  const [delTarget, setDelTarget] = useState<any | null>(null);
  const [delPwd, setDelPwd] = useState("");
  const [delWord, setDelWord] = useState("");
  const [delBusy, setDelBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const p: any = { ...edit };
    ["starting_date", "ending_date"].forEach((k) => { if (!p[k]) p[k] = null; });
    const op = p.id
      ? supabase.from("certificates").update(p).eq("id", p.id)
      : supabase.from("certificates").insert(p);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin-certs"] });
  };

  const confirmDelete = async () => {
    if (delWord !== "delete") return toast.error('Please type "delete" exactly to confirm.');
    if (!delPwd) return toast.error("Enter your password.");
    setDelBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const email = u.user?.email;
    if (!email) { setDelBusy(false); return toast.error("Not signed in."); }
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password: delPwd });
    if (authErr) { setDelBusy(false); return toast.error("Incorrect password."); }
    const { error } = await supabase.from("certificates").delete().eq("id", delTarget.id);
    setDelBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDelTarget(null); setDelPwd(""); setDelWord("");
    qc.invalidateQueries({ queryKey: ["admin-certs"] });
  };

  const downloadAll = () => {
    const rows = data ?? [];
    if (!rows.length) return toast.error("No records to export.");
    const cols = ["registration_number", "serial_number", "name", "son_of", "course_name", "starting_date", "ending_date", "grade", "created_at"];
    const esc = (v: any) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = [cols.join(","), ...rows.map((r: any) => cols.map((c) => esc(r[c])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `certificates-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const filtered = (data ?? []).filter((r: any) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return [r.registration_number, r.serial_number, r.name, r.son_of, r.course_name].some((v) => (v ?? "").toLowerCase().includes(s));
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Certificates</h1>
        <div className="flex gap-2">
          <button onClick={downloadAll} className="px-3 py-2 border rounded text-sm flex items-center gap-1.5 hover:bg-muted"><Download className="h-4 w-4" /> Download All</button>
          <button onClick={() => setEdit(EMPTY)} className="btn-hero text-sm"><Plus className="h-4 w-4" /> New</button>
        </div>
      </div>

      <div className="mb-3 relative max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, reg no, serial…" className="w-full pl-9 pr-3 py-2 border rounded text-sm" />
      </div>

      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Reg No.</th>
              <th className="p-3">Serial</th>
              <th className="p-3">Name</th>
              <th className="p-3">Son/D. of</th>
              <th className="p-3">Course</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Dates</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono text-xs">{r.registration_number}</td>
                <td className="p-3 font-mono text-xs">{r.serial_number}</td>
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.son_of}</td>
                <td className="p-3">{r.course_name}</td>
                <td className="p-3">{r.grade}</td>
                <td className="p-3 text-xs text-muted-foreground">{r.starting_date} → {r.ending_date}</td>
                <td className="p-3 flex gap-1 justify-end">
                  <button onClick={() => setEdit(r)} className="p-1.5 hover:bg-muted rounded" title="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDelTarget(r)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No certificates found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={save} className="bg-background p-6 rounded-xl w-full max-w-2xl space-y-3 my-8">
            <h2 className="text-xl font-bold">{edit.id ? "Edit" : "New"} Certificate</h2>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Registration Number *" v={edit.registration_number} onChange={(v) => setEdit({ ...edit, registration_number: v })} required />
              <Input label="Serial Number *" v={edit.serial_number} onChange={(v) => setEdit({ ...edit, serial_number: v })} required />
              <Input label="Name *" v={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} required />
              <Input label="Son / Daughter of *" v={edit.son_of} onChange={(v) => setEdit({ ...edit, son_of: v })} required />
              <Input label="Course Name *" v={edit.course_name} onChange={(v) => setEdit({ ...edit, course_name: v })} required />
              <Input label="Grade" v={edit.grade} onChange={(v) => setEdit({ ...edit, grade: v })} />
              <Input type="date" label="Starting Date" v={edit.starting_date ?? ""} onChange={(v) => setEdit({ ...edit, starting_date: v })} />
              <Input type="date" label="Ending Date" v={edit.ending_date ?? ""} onChange={(v) => setEdit({ ...edit, ending_date: v })} />
            </div>
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
            <h2 className="text-xl font-bold text-destructive">Delete Certificate</h2>
            <p className="text-sm text-muted-foreground">
              You are about to permanently delete the certificate for <strong>{delTarget.name}</strong> (Reg. {delTarget.registration_number}). This cannot be undone.
            </p>
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

function Input({ label, v, onChange, type = "text", required }: { label: string; v: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">{label}</label>
      <input type={type} required={required} value={v ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
    </div>
  );
}
