import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, FolderKanban, HandHeart, Users, Image as ImageIcon, Newspaper,
  UserCog, MessageSquareQuote, FileText, Mail, MailPlus, Settings, Languages, LogOut, Eye,
  Award, FileCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/donations", label: "Donations", icon: HandHeart },
  { to: "/admin/volunteers", label: "Volunteers", icon: Users },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/news", label: "News & Events", icon: Newspaper },
  { to: "/admin/results", label: "Results", icon: FileCheck },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
  { to: "/admin/team", label: "Team", icon: UserCog },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/content", label: "Site Content", icon: FileText },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/subscribers", label: "Subscribers", icon: MailPlus },
  { to: "/admin/translations", label: "Translations", icon: Languages },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
    if (!loading && user && !isAdmin) toast.error("Access denied: admin only");
  }, [loading, user, isAdmin, nav]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3 p-4 text-center">
      <h2 className="text-xl font-bold">Admin access required</h2>
      <p className="text-muted-foreground text-sm">Sign in with the admin account to access this panel.</p>
      <Link to="/auth" className="btn-hero">Go to Login</Link>
    </div>
  );

  const signOut = async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-charcoal text-white/90 hidden md:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="font-display font-bold text-saffron">Sewa Bharti</div>
          <div className="text-xs text-white/50">Admin Panel</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition ${active ? "bg-saffron text-white" : "hover:bg-white/10"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-white/10"><Eye className="h-4 w-4" /> View Site</a>
          <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-white/10"><LogOut className="h-4 w-4" /> Sign Out</button>
        </div>
      </aside>
      <div className="flex-1 overflow-x-hidden">
        <div className="md:hidden bg-charcoal text-white p-3 flex justify-between items-center sticky top-0 z-30">
          <div className="font-semibold">Sewa Bharti Admin</div>
          <button onClick={signOut} className="text-sm">Sign Out</button>
        </div>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
