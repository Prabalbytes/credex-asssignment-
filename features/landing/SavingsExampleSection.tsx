import { TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const EXAMPLE_TEAM = {
  name: "Example: 8-person startup",
  currentMonthly: 740,
  recommendedMonthly: 385,
  tools: [
    {
      name: "GitHub Copilot Business",
      current: 152,
      recommended: 80,
      note: "→ Downgrade to Individual ($10/seat)",
    },
    {
      name: "ChatGPT Plus × 8",
      current: 160,
      recommended: 80,
      note: "→ Consolidate to 4 seats (4 don't use it)",
    },
    {
      name: "Cursor Pro × 8",
      current: 160,
      recommended: 128,
      note: "→ Switch to annual billing",
    },
    {
      name: "Claude Pro × 4",
      current: 80,
      recommended: 80,
      note: "✓ No change — optimal",
    },
    {
      name: "OpenAI API",
      current: 188,
      recommended: 97,
      note: "→ Add batching + Haiku for simple tasks",
    },
  ],
};

export function SavingsExampleSection() {
  const savings = EXAMPLE_TEAM.currentMonthly - EXAMPLE_TEAM.recommendedMonthly;

  return (
    <section className="py-20 border-b border-border/60">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Real savings for real teams
          </h2>
          <p className="mt-3 text-muted-foreground">
            Here&apos;s what a typical audit looks like for an 8-person engineering team.
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-xl border bg-card overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border/60 bg-secondary/40">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              {EXAMPLE_TEAM.name}
            </p>
          </div>

          {/* Tool rows */}
          <div className="divide-y divide-border/60">
            {EXAMPLE_TEAM.tools.map((tool) => {
              const saved = tool.current - tool.recommended;
              return (
                <div key={tool.name} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.note}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-sm text-muted-foreground line-through font-mono">
                      {formatCurrency(tool.current)}
                    </span>
                    <span className="text-sm font-mono font-medium">
                      {formatCurrency(tool.recommended)}
                    </span>
                    {saved > 0 && (
                      <span className="text-xs font-mono text-savings w-16 text-right">
                        -{formatCurrency(saved)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="px-5 py-4 bg-savings/8 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-savings" />
              <span className="font-display font-semibold text-sm">Total monthly savings</span>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-xl text-savings font-mono">
                {formatCurrency(savings)}/mo
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(savings * 12)}/yr · 48% reduction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
