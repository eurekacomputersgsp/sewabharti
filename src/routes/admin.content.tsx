import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin/content")({ component: AdminContent });

function AdminContent() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => (await supabase.from("site_content").select("*").order("key")).data ?? [],
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const save = async (key: string) => {
    try {
      const value = JSON.parse(drafts[key]);
      const { error } = await supabase.from("site_content").update({ value }).eq("key", key);
      if (error) throw error;
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["site_content"] });
    } catch (e: any) { toast.error(e.message ?? "Invalid JSON"); }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Site Content</h1>
      <p className="text-muted-foreground mb-6">Edit homepage hero, mission, counters, CTAs and SEO. Values are JSON — edit carefully or use the helper editors below for hero slides.</p>
      <div className="space-y-4">
        {(rows ?? []).map((r: any) => {
          const text = drafts[r.key] ?? JSON.stringify(r.value, null, 2);
          const isHero = r.key === "hero_slides";
          return (
            <div key={r.key} className="card-soft p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold font-mono text-sm">{r.key}</h3>
                <button onClick={() => save(r.key)} className="btn-hero text-xs"><Save className="h-3.5 w-3.5" /> Save</button>
              </div>
              {isHero && (
                <div className="mb-3 space-y-2">
                  {(JSON.parse(text) as any[]).map((s: any, i: number) => (
                    <ImageUploader key={i} value={s.image} label={`Slide ${i + 1} image`} onChange={(url) => {
                      const arr = JSON.parse(text); arr[i].image = url; setDrafts({ ...drafts, [r.key]: JSON.stringify(arr, null, 2) });
                    }} />
                  ))}
                </div>
              )}
              <textarea value={text} onChange={(e) => setDrafts({ ...drafts, [r.key]: e.target.value })} rows={isHero ? 12 : 6} className="w-full px-3 py-2 border rounded font-mono text-xs" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
