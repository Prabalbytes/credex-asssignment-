"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, AlertCircle } from "lucide-react";
import { resultStorage } from "@/lib/storage";
import { RecommendationCard } from "@/features/results/RecommendationCard";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type { AuditResult } from "@/types/results";

interface SharedReportViewProps {
  reportId: string;
}

export function SharedReportView({ reportId }: SharedReportViewProps) {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // In an MVP, the shared link only works on the same browser.
    // A real backend would look up by reportId.
    const saved = resultStorage.load();
    if (saved && saved.id === reportId) {
      setResult(saved);
    } else {
      setNotFound(true);
    }
  }, [reportId]);

  if (notFound || (!result && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Report not found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Shared reports only persist in the same browser for this MVP. Run
            your own audit to see results.
          </p>
          <Button asChild>
            <Link href="/audit">
              Run your audit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { summary } = result;

  return (
    <div className="min-h-screen bg-background">
      {/* Report header */}
      <header className="border-b border-border">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-700 text-sm">
              AI Spend<span className="text-primary">Audit</span>
            </span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            Shared report · {new Date(result.generatedAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      <main className="container max-w-3xl py-12">
        {/* Report title */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-1">AI Spend Audit Report</p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            {result.companyName || "Your Team"} · Savings Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Team size: {result.teamSize} · {result.recommendations.length} tools audited
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
          <StatCard
            label="Annual savings"
            value={formatCurrency(summary.totalAnnualSavings, { compact: true })}
            highlight
          />
          <StatCard
            label="Monthly savings"
            value={formatCurrency(summary.totalMonthlySavings)}
          />
          <StatCard
            label="Current spend"
            value={formatCurrency(summary.totalCurrentMonthlySpend)}
            sub="per month"
          />
          <StatCard
            label="Savings rate"
            value={formatPercentage(summary.savingsPercentage)}
          />
        </div>

        {/* Recommendations */}
        <h2 className="font-display font-semibold text-lg mb-4">
          Recommendations
        </h2>
        <div className="space-y-4 mb-12">
          {result.recommendations.map((rec) => (
            <RecommendationCard key={rec.toolEntryId} rec={rec} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium mb-3">
            Want to audit your own AI subscriptions?
          </p>
          <Button asChild>
            <Link href="/audit">
              Start free audit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/50 text-center">
          Pricing data may not reflect real-time changes. Verify with vendors before making decisions.
        </p>
      </main>
    </div>
  );
}
