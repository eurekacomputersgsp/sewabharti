import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, ExternalLink, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { publicUrl } from "@/lib/storage";

export const Route = createFileRoute("/results")({ component: ResultsPage });

function ResultsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["results-public"],
    queryFn: async () => (await supabase.from("results").select("*").eq("is_published", true).order("sort_order").order("published_date", { ascending: false })).data ?? [],
  });

  return (
    <PublicLayout>
      <section className="container-page py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold">Results</h1>
          <p className="text-muted-foreground mt-2">Official results published by Sewa Bharti.</p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : !data || data.length === 0 ? (
          <p className="text-center text-muted-foreground">No results have been published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {data.map((r: any) => {
              const url = publicUrl(r.file_url);
              const isImg = /\.(png|jpe?g|webp|gif)$/i.test(r.file_url);
              return (
                <div key={r.id} className="card-soft overflow-hidden flex flex-col">
                  <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    {isImg ? (
                      <img src={url} alt={r.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold">{r.title}</h3>
                    {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
                    {r.published_date && (
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {r.published_date}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <a href={url} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded text-sm hover:bg-muted">
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </a>
                      <a href={url} download className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-saffron text-white rounded text-sm hover:bg-saffron-deep">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
