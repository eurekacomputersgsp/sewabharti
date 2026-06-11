import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Login — Sewa Bharti" }] }),
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("Welcome back!"); nav({ to: "/admin" }); }
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      if (error) toast.error(error.message);
      else toast.success("Account created. You can now sign in.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-warm)" }}>
      <div className="card-soft p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Sewa Bharti Admin</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{mode === "signin" ? "Sign in to manage the website" : "Create your admin account"}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border rounded-md" />
          <input required type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 border rounded-md" />
          <button disabled={loading} className="btn-hero w-full">{loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}</button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm text-muted-foreground hover:text-primary">
          {mode === "signin" ? "Need an admin account? Sign up" : "Have an account? Sign in"}
        </button>
        <a href="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-primary">← Back to website</a>
      </div>
    </div>
  );
}
