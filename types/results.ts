// ─── Audit Results Types ──────────────────────────────────────────────────────

import type { ToolId } from "./tools";

export type SeverityLevel = "overspending" | "optimizable" | "good-value";

export interface AlternativeTool {
  toolId: ToolId;
  name: string;
  monthlyPrice: number;
  savings: number;
  reason: string;
}

export interface ToolRecommendation {
  toolEntryId: string;
  toolId: ToolId;
  toolName: string;
  currentMonthlySpend: number;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  severity: SeverityLevel;
  currentPlanName: string;
  recommendedPlanName: string;
  recommendedPlanId: string | null;
  reason: string;
  actionLabel: string;
  alternatives: AlternativeTool[];
}

export interface AuditSummary {
  totalCurrentMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  overspendingCount: number;
  optimizableCount: number;
  goodValueCount: number;
}

export interface AuditResult {
  id: string;
  companyName: string;
  teamSize: number;
  generatedAt: string;
  summary: AuditSummary;
  recommendations: ToolRecommendation[];
}
