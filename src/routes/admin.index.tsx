import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HandHeart, Users, FolderKanban, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [d, v, p, m, s] = await Promise.all([
        supabase.from("donations").select("amount", { count: "exact" }),
        supabase.from("volunteers").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);
      const totalAmount = (d.data ?? []).reduce((s: number, x: any) => s + Number(x.amount), 0);
      return {
        donations: d.count ?? 0,
        donationAmount: totalAmount,
        volunteers: v.count ?? 0,
        projects: p.count ?? 0,
        unreadMessages: m.count ?? 0,
        subscribers: s.count ?? 0,
      };
    },
  });
  const cards = [
    { label: "Donations", value: stats?.donations ?? 0, sub: `₹${(stats?.donationAmount ?? 0).toLocaleString()}`, icon: HandHeart, color: "text-saffron-deep" },
    { label: "Volunteers", value: stats?.volunteers ?? 0, icon: Users, color: "text-accent" },
    { label: "Projects", value: stats?.projects ?? 0, icon: FolderKanban, color: "text-primary" },
    { label: "Unread Messages", value: stats?.unreadMessages ?? 0, icon: Mail, color: "text-destructive" },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back. Here's the overview.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card-soft p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="text-3xl font-bold mt-1">{c.value}</div>
                {c.sub && <div className="text-xs text-muted-foreground mt-1">{c.sub}</div>}
              </div>
              <c.icon className={`h-7 w-7 ${c.color}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="card-soft p-5">
          <h3 className="font-semibold mb-3">Newsletter Subscribers</h3>
          <div className="text-3xl font-bold">{stats?.subscribers ?? 0}</div>
        </div>
        <div className="card-soft p-5">
          <h3 className="font-semibold mb-3">Quick Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Edit homepage content from <strong>Site Content</strong></li>
            <li>Toggle section visibility from <strong>Settings</strong></li>
            <li>Manage UPI / bank from <strong>Settings</strong></li>
            <li>Add Hindi/Punjabi labels in <strong>Translations</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
