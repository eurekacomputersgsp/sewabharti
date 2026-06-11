import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/donations")({ component: AdminDonations });

function AdminDonations() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-donations"], queryFn: async () => (await supabase.from("donations").select("*").order("created_at", { ascending: false })).data ?? [] });
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("donations").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-donations"] }); }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Donations</h1>
      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Date</th><th className="p-3">Donor</th><th className="p-3">Phone</th><th className="p-3">Amount</th><th className="p-3">Purpose</th><th className="p-3">PAN</th><th className="p-3">Status</th></tr></thead>
          <tbody>{(data ?? []).map((d: any) => (
            <tr key={d.id} className="border-t">
              <td className="p-3">{new Date(d.created_at).toLocaleDateString()}</td>
              <td className="p-3 font-medium">{d.donor_name}</td>
              <td className="p-3">{d.phone}</td>
              <td className="p-3">₹{Number(d.amount).toLocaleString()}</td>
              <td className="p-3">{d.purpose}</td>
              <td className="p-3 text-xs">{d.pan_number}</td>
              <td className="p-3"><select value={d.status} onChange={(e) => setStatus(d.id, e.target.value)} className="px-2 py-1 border rounded text-xs"><option value="pending">Pending</option><option value="verified">Verified</option><option value="received">Received</option></select></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
