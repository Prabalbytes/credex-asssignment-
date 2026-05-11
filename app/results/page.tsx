"use client";
import { LeadCaptureForm } from "@/features/results/LeadCaptureForm";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultsHero } from "@/features/results/ResultsHero";
import { RecommendationCard } from "@/features/results/RecommendationCard";
import { SavingsBreakdown } from "@/features/results/SavingsBreakdown";
import { ShareButton } from "@/features/results/ShareButton";
import { Button } from "@/components/ui/button";
import { resultStorage } from "@/lib/storage";
import type { AuditResult } from "@/types/results";
import { Loader2, RefreshCcw, AlertCircle } from "lucide-react";

export default function ResultsPage() {
  
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
  const saved = resultStorage.load();
  setResult(saved);
  setLoading(false);

  if (saved) {
    setSummaryLoading(true);
    fetch("/api/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: saved.companyName,
        teamSize: saved.teamSize,
        recommendations: saved.recommendations,
        summary: saved.summary,
      }),
    })
      .then((res) => res.json())
      .then((data) => setAiSummary(data.summary || ""))
      .catch(() => setAiSummary(""))
      .finally(() => setSummaryLoading(false));
  }
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-3">No audit found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find a recent audit. Run one first and we'll show your
              results here.
            </p>
            <Button asChild>
              <Link href="/audit">Start an audit</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sortedRecs = [...result.recommendations].sort((a, b) => {
    const order = { overspending: 0, optimizable: 1, "good-value": 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 md:py-12">
        <div className="container max-w-4xl">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
            <p className="text-xs font-mono text-muted-foreground">
              Generated {new Date(result.generatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2">
              <ShareButton auditId={result.id} />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/audit">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Re-audit
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero summary */}
          <ResultsHero
            summary={result.summary}
            companyName={result.companyName}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
            {/* Recommendations */}
            <div>
              <h2 className="font-display font-semibold text-xl mb-5">
                Tool-by-tool recommendations
              </h2>
              <div className="space-y-4">
                {sortedRecs.map((rec) => (
                  <RecommendationCard key={rec.toolEntryId} rec={rec} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SavingsBreakdown recommendations={result.recommendations} />

               <LeadCaptureForm
                 auditId={result.id}
                 monthlySavings={result.summary.totalMonthlySavings}
                />

              {/* AI summary */}
              <div className="rounded-xl border border-border/50 p-5 gradient-card">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                 AI Analysis
                 </p>
                 {summaryLoading ? (
                   <div className="space-y-2">
                   <div className="h-2.5 rounded bg-secondary w-full animate-pulse" />
                   <div className="h-2.5 rounded bg-secondary w-4/5 animate-pulse" />
                   <div className="h-2.5 rounded bg-secondary w-5/6 animate-pulse" />
                   <div className="h-2.5 rounded bg-secondary w-3/4 animate-pulse" />
                   </div>
                  ) : aiSummary ? (
                   <p className="text-sm text-muted-foreground leading-relaxed">
                   {aiSummary}
                   </p>
                  ) : (
                       <p className="text-xs text-muted-foreground/60">
                       Summary unavailable — check your API key.
                       </p>
                      )}
                </div> 

              {/* Next steps */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
                  Next steps
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Share this report with your finance team</li>
                  <li>Review the overspending items first</li>
                  <li>Contact vendors about annual plans</li>
                  <li>Re-audit in 90 days</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Honest disclaimer */}
          <p className="mt-12 text-xs text-muted-foreground/50 text-center">
            Pricing data is manually curated. Verify recommendations with each
            vendor before making changes. Savings are estimates.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
