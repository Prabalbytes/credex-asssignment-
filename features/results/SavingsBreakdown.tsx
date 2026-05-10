import { formatCurrency } from "@/lib/utils";
import type { ToolRecommendation } from "@/types/results";
import { SeverityIcon } from "@/components/shared/SeverityIcon";

interface SavingsBreakdownProps {
  recommendations: ToolRecommendation[];
}

export function SavingsBreakdown({ recommendations }: SavingsBreakdownProps) {
  const withSavings = recommendations.filter((r) => r.monthlySavings > 0);
  const total = withSavings.reduce((s, r) => s + r.monthlySavings, 0);

  if (withSavings.length === 0) return null;

  return (
    <div className="rounded-xl border border-border gradient-card p-6">
      <h2 className="font-display font-semibold text-base mb-4">
        Savings breakdown
      </h2>

      <div className="space-y-3">
        {withSavings.map((rec) => {
          const pct = total > 0 ? (rec.monthlySavings / total) * 100 : 0;
          return (
            <div key={rec.toolEntryId}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <SeverityIcon severity={rec.severity} className="h-3.5 w-3.5" />
                  <span>{rec.toolName}</span>
                </div>
                <span className="font-mono font-medium text-primary">
                  −{formatCurrency(rec.monthlySavings)}/mo
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm font-medium">
        <span>Total monthly savings</span>
        <span className="font-mono font-bold text-primary text-lg">
          −{formatCurrency(total)}/mo
        </span>
      </div>
    </div>
  );
}
