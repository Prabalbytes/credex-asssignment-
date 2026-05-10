// Audit Engine Tests
import { runAudit } from "../lib/audit-engine";
import type { AuditFormData } from "../types/audit";

const BASE: AuditFormData = { companyName: "Test", teamSize: 10, tools: [] };

describe("runAudit", () => {
  it("returns result with id and timestamp", () => {
    const r = runAudit(BASE);
    expect(r.id).toBeTruthy();
    expect(new Date(r.generatedAt).getTime()).not.toBeNaN();
  });

  it("zero savings for empty tools", () => {
    const r = runAudit(BASE);
    expect(r.summary.totalMonthlySavings).toBe(0);
  });

  it("finds overspending on enterprise plan for small team", () => {
    const form: AuditFormData = {
      ...BASE,
      tools: [{
        id: "r1", toolId: "chatgpt", planId: "chatgpt-enterprise",
        seats: 5, monthlySpend: 300, primaryUseCase: "writing"
      }],
    };
    const r = runAudit(form);
    expect(r.recommendations[0].severity).toBe("overspending");
    expect(r.recommendations[0].monthlySavings).toBeGreaterThan(0);
  });

  it("sums savings across multiple tools", () => {
    const form: AuditFormData = {
      ...BASE,
      tools: [
        { id: "r1", toolId: "chatgpt", planId: "chatgpt-enterprise", seats: 5, monthlySpend: 300, primaryUseCase: "writing" },
        { id: "r2", toolId: "cursor", planId: "cursor-pro", seats: 5, monthlySpend: 100, primaryUseCase: "coding" },
      ],
    };
    const r = runAudit(form);
    const summed = r.recommendations.reduce((s, x) => s + x.monthlySavings, 0);
    expect(r.summary.totalMonthlySavings).toBeCloseTo(summed, 2);
  });

  it("never produces negative savings", () => {
    const form: AuditFormData = {
      ...BASE,
      tools: [{ id: "r1", toolId: "claude", planId: "claude-pro", seats: 1, monthlySpend: 20, primaryUseCase: "writing" }],
    };
    const r = runAudit(form);
    r.recommendations.forEach(rec => {
      expect(rec.monthlySavings).toBeGreaterThanOrEqual(0);
    });
  });

  it("handles unknown toolId gracefully", () => {
    const form: AuditFormData = {
      ...BASE,
      tools: [{ id: "r1", toolId: "unknown-tool" as any, planId: "x", seats: 1, monthlySpend: 50, primaryUseCase: "general" }],
    };
    expect(() => runAudit(form)).not.toThrow();
  });
});
