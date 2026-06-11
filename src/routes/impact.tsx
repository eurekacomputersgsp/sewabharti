import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useSiteContent } from "@/hooks/useSiteData";

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
  head: () => ({ meta: [{ title: "Impact & Reports — Sewa Bharti Punjab" }] }),
});

function ImpactPage() {
  const { data: content } = useSiteContent();
  const counters = (content?.impact_counters as any[]) ?? [];
  return (
    <PublicLayout>
      <section className="text-white py-16" style={{ background: "var(--gradient-warm)" }}>
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Impact & Transparency</h1>
          <p className="mt-3 text-white/90 max-w-2xl mx-auto">Every rupee accounted for. Every life touched documented.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {counters.map((c: any, i: number) => (
              <div key={i} className="card-soft p-6 text-center">
                <div className="text-4xl font-bold text-saffron-deep">{c.value.toLocaleString()}{c.suffix}</div>
                <div className="mt-2 text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 card-soft p-8">
            <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-saffron-deep" /> Annual Reports</h2>
            <p className="mt-2 text-muted-foreground">Detailed financial and program reports — audited and published yearly.</p>
            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              {[2025, 2024, 2023].map((y) => (
                <a key={y} href="#" className="card-soft p-4 hover:bg-muted flex items-center gap-3 transition">
                  <Download className="h-5 w-5 text-primary" />
                  <div><div className="font-semibold">Annual Report {y}</div><div className="text-xs text-muted-foreground">PDF · Audited</div></div>
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">For transparency disclosures, FCRA filings or audited statements, contact us.</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
