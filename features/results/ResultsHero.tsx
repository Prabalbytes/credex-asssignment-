import { StatCard } from "@/components/shared/StatCard";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type { AuditSummary } from "@/types/results";
import { TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ResultsHeroProps {
  summary: AuditSummary;
  companyName: string;
}

export function ResultsHero({ summary, companyName }: ResultsHeroProps) {
  const hasSignificantSavings = summary.totalMonthlySavings > 10;

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 gradient-hero opacity-60" />

      <div className="relative">
        {/* Headline */}
        <div className="text-center mb-10">
          {companyName && (
            <p className="text-sm text-muted-foreground mb-2 font-mono">
              Audit for {companyName}
            </p>
          )}

          {hasSignificantSavings ? (
            <>
              <h1 className="font-display text-4xl font-bold md:text-5xl mb-3">
                You could save{" "}
                <span className="text-gradient">
                  {formatCurrency(summary.totalAnnualSavings, { compact: true })}
                </span>{" "}
                this year
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                That's {formatCurrency(summary.totalMonthlySavings)}/month back in your budget —
                without changing your workflow.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl font-bold md:text-5xl mb-3">
                Your AI stack is{" "}
                <span className="text-gradient">well-optimized</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                We found minimal savings opportunities. You're running a lean AI stack.
              </p>
            </>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Annual savings"
            value={formatCurrency(summary.totalAnnualSavings, { compact: true })}
            sub="if all recommendations applied"
            highlight
          />
          <StatCard
            label="Monthly savings"
            value={formatCurrency(summary.totalMonthlySavings)}
            sub={`${formatPercentage(summary.savingsPercentage)} of current spend`}
          />
          <StatCard
            label="Current spend"
            value={formatCurrency(summary.totalCurrentMonthlySpend)}
            sub="per month"
          />
          <StatCard
            label="Recommended"
            value={formatCurrency(summary.totalRecommendedMonthlySpend)}
            sub="per month after changes"
          />
        </div>

        {/* Severity pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {summary.overspendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {summary.overspendingCount} overspending
            </div>
          )}
          {summary.optimizableCount > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
              <TrendingDown className="h-3.5 w-3.5" />
              {summary.optimizableCount} optimizable
            </div>
          )}
          {summary.goodValueCount > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {summary.goodValueCount} good value
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
