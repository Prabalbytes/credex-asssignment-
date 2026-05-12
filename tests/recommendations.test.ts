// Recommendation Logic Tests
import { runAudit } from "../lib/audit-engine";
import type { AuditFormData } from "../types/audit";

const base = (tools: AuditFormData["tools"]): AuditFormData => ({
  companyName: "T", teamSize: 5, tools,
});

describe("Severity classification", () => {
  it("Enterprise ChatGPT on 3 seats = overspending", () => {
    const r = runAudit(base([{
      id: "t1", toolId: "chatgpt", planId: "chatgpt-enterprise",
      seats: 3, monthlySpend: 180, primaryUseCase: "writing"
    }]));
    expect(r.recommendations[0].severity).toBe("overspending");
  });

  it("Copilot Individual at list price = good-value or optimizable", () => {
  const r = runAudit(base([{
    id: "t1", toolId: "github-copilot", planId: "copilot-individual",
    seats: 1, monthlySpend: 10, primaryUseCase: "coding"
  }]));
  expect(["good-value", "optimizable"]).toContain(r.recommendations[0].severity);
  expect(r.recommendations[0].monthlySavings).toBeGreaterThanOrEqual(0);
 });

  it("severity counts sum to total recommendations", () => {
    const r = runAudit(base([
      { id: "t1", toolId: "chatgpt", planId: "chatgpt-enterprise", seats: 2, monthlySpend: 120, primaryUseCase: "writing" },
      { id: "t2", toolId: "claude", planId: "claude-pro", seats: 2, monthlySpend: 40, primaryUseCase: "writing" },
    ]));
    const { overspendingCount, optimizableCount, goodValueCount } = r.summary;
    expect(overspendingCount + optimizableCount + goodValueCount).toBe(r.recommendations.length);
  });

  it("savingsPercentage is between 0 and 100", () => {
    const r = runAudit(base([{
      id: "t1", toolId: "chatgpt", planId: "chatgpt-enterprise",
      seats: 1, monthlySpend: 60, primaryUseCase: "general"
    }]));
    expect(r.summary.savingsPercentage).toBeGreaterThanOrEqual(0);
    expect(r.summary.savingsPercentage).toBeLessThanOrEqual(100);
  });
});
