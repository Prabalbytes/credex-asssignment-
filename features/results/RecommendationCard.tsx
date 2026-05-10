import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityIcon } from "@/components/shared/SeverityIcon";
import { formatCurrency } from "@/lib/utils";
import type { ToolRecommendation } from "@/types/results";
import { ArrowRight, ExternalLink } from "lucide-react";
import { TOOLS_REGISTRY } from "@/data/tools";

const SEVERITY_LABEL: Record<string, string> = {
  overspending: "Overspending",
  optimizable: "Optimizable",
  "good-value": "Good value",
};

interface RecommendationCardProps {
  rec: ToolRecommendation;
}

export function RecommendationCard({ rec }: RecommendationCardProps) {
  const toolDef = TOOLS_REGISTRY[rec.toolId];
  const hasSavings = rec.monthlySavings > 0;

  return (
    <Card className={rec.severity === "overspending" ? "border-red-500/20" : rec.severity === "optimizable" ? "border-amber-500/20" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
              <SeverityIcon severity={rec.severity} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-base">{rec.toolName}</h3>
                <Badge variant={rec.severity}>{SEVERITY_LABEL[rec.severity]}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {rec.currentPlanName}
                {hasSavings && (
                  <>
                    {" → "}
                    <span className="text-foreground">{rec.recommendedPlanName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {hasSavings && (
            <div className="text-right shrink-0">
              <p className="text-primary font-mono font-bold text-lg leading-none">
                −{formatCurrency(rec.monthlySavings)}/mo
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {formatCurrency(rec.annualSavings)}/yr
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Spend comparison */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono text-muted-foreground line-through">
            {formatCurrency(rec.currentMonthlySpend)}/mo
          </span>
          {hasSavings && (
            <>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono font-semibold text-foreground">
                {formatCurrency(rec.recommendedMonthlySpend)}/mo
              </span>
            </>
          )}
        </div>

        {/* Reason */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {rec.reason}
        </p>

        {/* Action */}
        <div className="flex items-center gap-3 flex-wrap">
          {toolDef && (
            <a
              href={toolDef.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              {rec.actionLabel}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Alternatives */}
        {rec.alternatives.length > 0 && (
          <div className="rounded-lg bg-secondary/50 p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Alternative tools
            </p>
            {rec.alternatives.map((alt) => (
              <div key={alt.toolId} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{alt.name}</span>
                  <span className="text-muted-foreground text-xs ml-2">
                    {alt.reason}
                  </span>
                </div>
                <span className="font-mono text-primary text-xs shrink-0 ml-3">
                  Save {formatCurrency(alt.savings)}/mo
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
