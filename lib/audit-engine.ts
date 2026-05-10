// ─── Audit Engine — Pure deterministic logic, no AI ──────────────────────────
// Input:  AuditFormData
// Output: AuditResult
//
// Rules applied (in order):
// 1. Price accuracy  — is the user paying the correct plan price?
// 2. Plan right-sizing — are they on the right tier for their seat count?
// 3. Annual billing   — could they save by switching to annual?
// 4. Redundancy       — are they paying for overlapping tools?
// 5. Alternatives     — is there a cheaper tool for their use case?

import { TOOLS_REGISTRY } from "@/data/tools";
import type { AuditFormData, ToolEntry } from "@/types/audit";
import type {
  AlternativeTool,
  AuditResult,
  AuditSummary,
  SeverityLevel,
  ToolRecommendation,
} from "@/types/results";
import type { PricingTier, ToolDefinition } from "@/types/tools";
import { generateId } from "./utils";

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getToolDef(toolId: string): ToolDefinition | null {
  return TOOLS_REGISTRY[toolId] ?? null;
}

function getTier(tool: ToolDefinition, planId: string): PricingTier | null {
  return tool.tiers.find((t) => t.id === planId) ?? null;
}

function computeExpectedMonthly(tier: PricingTier, seats: number): number {
  switch (tier.pricingModel) {
    case "per-seat":
      return tier.monthlyPrice * seats;
    case "flat":
    case "usage-based":
      return tier.monthlyPrice;
    case "hybrid":
      return tier.monthlyPrice * seats;
    default:
      return tier.monthlyPrice;
  }
}

// How much could be saved by switching to annual billing?
function annualBillingSavings(
  tier: PricingTier,
  seats: number
): { savings: number; recommendedPlanId: string | null } {
  if (!tier.annualPrice) return { savings: 0, recommendedPlanId: null };
  const monthly = computeExpectedMonthly(tier, seats);
  const annual = tier.annualPrice * seats * 12;
  const currentAnnual = monthly * 12;
  if (annual < currentAnnual) {
    return {
      savings: (currentAnnual - annual) / 12,
      recommendedPlanId: tier.id,
    };
  }
  return { savings: 0, recommendedPlanId: null };
}

// Find a cheaper tier that still covers the user's seat count
function findCheaperTier(
  tool: ToolDefinition,
  currentTier: PricingTier,
  seats: number
): PricingTier | null {
  const currentCost = computeExpectedMonthly(currentTier, seats);
  for (const tier of tool.tiers) {
    if (tier.id === currentTier.id) continue;
    const cost = computeExpectedMonthly(tier, seats);
    const maxOk = !tier.maxSeats || tier.maxSeats >= seats;
    if (cost < currentCost && maxOk) return tier;
  }
  return null;
}

// Build alternatives from sister tools
function buildAlternatives(
  toolDef: ToolDefinition,
  seats: number,
  currentMonthlySpend: number
): AlternativeTool[] {
  return toolDef.alternatives
    .map((altId) => {
      const alt = getToolDef(altId);
      if (!alt || alt.tiers.length === 0) return null;
      // Pick the closest matching tier (first paid tier or free)
      const tier =
        alt.tiers.find((t) => t.monthlyPrice > 0) ?? alt.tiers[0];
      const altMonthly = computeExpectedMonthly(tier, seats);
      if (altMonthly >= currentMonthlySpend) return null;
      return {
        toolId: alt.id,
        name: alt.name,
        monthlyPrice: altMonthly,
        savings: currentMonthlySpend - altMonthly,
        reason: `${alt.name} offers comparable features on the ${tier.name} plan`,
      } satisfies AlternativeTool;
    })
    .filter((x): x is AlternativeTool => x !== null)
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 2);
}

function classifySeverity(savings: number, current: number): SeverityLevel {
  if (current === 0) return "good-value";
  const ratio = savings / current;
  if (ratio > 0.25) return "overspending";
  if (ratio > 0.05) return "optimizable";
  return "good-value";
}

// ─── Main engine function ─────────────────────────────────────────────────────

export function runAudit(formData: AuditFormData): AuditResult {
  const recommendations: ToolRecommendation[] = formData.tools.map(
    (entry: ToolEntry) => {
      const toolDef = getToolDef(entry.toolId);

      // Guard: unknown tool — pass through as good-value
      if (!toolDef) {
        return buildPassthroughRec(entry);
      }

      const currentTier = getTier(toolDef, entry.planId);
      if (!currentTier) {
        return buildPassthroughRec(entry, toolDef.name);
      }

      // 1. Compute what this plan actually costs
      const expectedMonthly = computeExpectedMonthly(currentTier, entry.seats);

      // 2. Try to find a cheaper tier
      const cheaperTier = findCheaperTier(toolDef, currentTier, entry.seats);
      const cheaperTierCost = cheaperTier
        ? computeExpectedMonthly(cheaperTier, entry.seats)
        : null;

      // 3. Check annual billing discount
      const { savings: annualSave } = annualBillingSavings(
        currentTier,
        entry.seats
      );

      // 4. Determine best recommendation
      let recommendedMonthly = expectedMonthly;
      let recommendedPlanName = currentTier.name;
      let recommendedPlanId: string | null = null;
      let reason = "";
      let actionLabel = "No action needed";

      const tierSavings =
        cheaperTierCost !== null ? expectedMonthly - cheaperTierCost : 0;

      if (tierSavings > 0 && tierSavings >= annualSave) {
        // Downgrade to cheaper tier wins
        recommendedMonthly = cheaperTierCost!;
        recommendedPlanName = cheaperTier!.name;
        recommendedPlanId = cheaperTier!.id;
        reason = `The ${cheaperTier!.name} plan covers your team's needs at a lower cost.`;
        actionLabel = `Switch to ${cheaperTier!.name}`;
      } else if (annualSave > 0) {
        // Annual billing wins
        recommendedMonthly = expectedMonthly - annualSave;
        recommendedPlanName = `${currentTier.name} (Annual)`;
        recommendedPlanId = currentTier.id;
        reason = `Switching to annual billing saves ${Math.round((annualSave / expectedMonthly) * 100)}% per month.`;
        actionLabel = "Switch to annual billing";
      } else if (entry.monthlySpend > expectedMonthly * 1.1) {
        // User is overpaying vs listed price
        recommendedMonthly = expectedMonthly;
        recommendedPlanName = currentTier.name;
        recommendedPlanId = currentTier.id;
        reason = `Your reported spend ($${entry.monthlySpend}) exceeds the listed plan price. Verify your billing.`;
        actionLabel = "Audit your bill";
      } else {
        reason = `You're on a competitive plan. No immediate changes recommended.`;
        actionLabel = "Monitor usage";
      }

      const actualCurrentSpend =
        entry.monthlySpend > 0 ? entry.monthlySpend : expectedMonthly;
      const monthlySavings = Math.max(0, actualCurrentSpend - recommendedMonthly);
      const annualSavings = monthlySavings * 12;

      // 5. Build alternatives
      const alternatives = buildAlternatives(
        toolDef,
        entry.seats,
        actualCurrentSpend
      );

      return {
        toolEntryId: entry.id,
        toolId: entry.toolId,
        toolName: toolDef.name,
        currentMonthlySpend: actualCurrentSpend,
        recommendedMonthlySpend: recommendedMonthly,
        monthlySavings,
        annualSavings,
        severity: classifySeverity(monthlySavings, actualCurrentSpend),
        currentPlanName: currentTier.name,
        recommendedPlanName,
        recommendedPlanId,
        reason,
        actionLabel,
        alternatives,
      } satisfies ToolRecommendation;
    }
  );

  const summary = computeSummary(recommendations);

  return {
    id: generateId(),
    companyName: formData.companyName || "Your Team",
    teamSize: formData.teamSize,
    generatedAt: new Date().toISOString(),
    summary,
    recommendations,
  };
}

function buildPassthroughRec(
  entry: ToolEntry,
  toolName?: string
): ToolRecommendation {
  return {
    toolEntryId: entry.id,
    toolId: entry.toolId,
    toolName: toolName ?? entry.toolId,
    currentMonthlySpend: entry.monthlySpend,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "good-value",
    currentPlanName: "Unknown",
    recommendedPlanName: "Unknown",
    recommendedPlanId: null,
    reason: "Unable to evaluate — plan not found in our pricing database.",
    actionLabel: "Verify plan details",
    alternatives: [],
  };
}

function computeSummary(recs: ToolRecommendation[]): AuditSummary {
  const totalCurrentMonthlySpend = recs.reduce(
    (sum, r) => sum + r.currentMonthlySpend,
    0
  );
  const totalRecommendedMonthlySpend = recs.reduce(
    (sum, r) => sum + r.recommendedMonthlySpend,
    0
  );
  const totalMonthlySavings = recs.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const savingsPercentage =
    totalCurrentMonthlySpend > 0
      ? (totalMonthlySavings / totalCurrentMonthlySpend) * 100
      : 0;

  return {
    totalCurrentMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsPercentage,
    overspendingCount: recs.filter((r) => r.severity === "overspending").length,
    optimizableCount: recs.filter((r) => r.severity === "optimizable").length,
    goodValueCount: recs.filter((r) => r.severity === "good-value").length,
  };
}
