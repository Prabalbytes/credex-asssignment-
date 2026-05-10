import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, ArrowRight } from "lucide-react";

const EXAMPLE_ROWS = [
  {
    tool: "ChatGPT",
    current: "Enterprise · 12 seats",
    currentCost: 720,
    recommended: "Team · 12 seats",
    recommendedCost: 360,
    savings: 360,
    severity: "overspending" as const,
  },
  {
    tool: "GitHub Copilot",
    current: "Business · 12 seats",
    currentCost: 228,
    recommended: "Individual · 8 active seats",
    recommendedCost: 80,
    savings: 148,
    severity: "overspending" as const,
  },
  {
    tool: "Cursor",
    current: "Pro · 12 seats",
    currentCost: 240,
    recommended: "Pro Annual · 12 seats",
    recommendedCost: 192,
    savings: 48,
    severity: "optimizable" as const,
  },
  {
    tool: "Claude",
    current: "Pro · 3 seats",
    currentCost: 60,
    recommended: "Pro — good value",
    recommendedCost: 60,
    savings: 0,
    severity: "good-value" as const,
  },
] as const;

const SEVERITY_LABELS = {
  overspending: "Overspending",
  optimizable: "Optimizable",
  "good-value": "Good value",
};

export function SavingsExample() {
  const totalSavings = EXAMPLE_ROWS.reduce((s, r) => s + r.savings, 0);

  return (
    <section id="example" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Example audit result
          </h2>
          <p className="mt-3 text-muted-foreground">
            A real-world 12-person engineering team. Names changed.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden gradient-card mx-auto max-w-4xl">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-widest">
            <span>Tool</span>
            <span>Current → Recommended</span>
            <span className="text-right">Current</span>
            <span className="text-right">After</span>
            <span className="text-right">Saved/mo</span>
          </div>

          {EXAMPLE_ROWS.map((row, i) => (
            <div
              key={row.tool}
              className={`grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-2 md:gap-4 items-center px-6 py-4 text-sm ${
                i < EXAMPLE_ROWS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Badge variant={row.severity}>
                  {SEVERITY_LABELS[row.severity]}
                </Badge>
                <span className="font-medium">{row.tool}</span>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="line-through">{row.current}</span>
                {row.savings > 0 && (
                  <>
                    {" → "}
                    <span className="text-foreground">{row.recommended}</span>
                  </>
                )}
              </div>

              <div className="font-mono text-right text-muted-foreground">
                {formatCurrency(row.currentCost)}/mo
              </div>

              <div className="font-mono text-right">
                {formatCurrency(row.recommendedCost)}/mo
              </div>

              <div
                className={`font-mono text-right font-semibold ${
                  row.savings > 0 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {row.savings > 0 ? `−${formatCurrency(row.savings)}` : "—"}
              </div>
            </div>
          ))}

          {/* Footer total */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-primary/5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingDown className="h-4 w-4 text-primary" />
              Total monthly savings
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-primary text-lg">
                −{formatCurrency(totalSavings)}/mo
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                = {formatCurrency(totalSavings * 12)}/yr
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/audit">
              Run your own audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
