// Pricing Data Integrity Tests
import { TOOLS_REGISTRY, TOOL_LIST } from "../data/tools";

describe("TOOLS_REGISTRY", () => {
  const REQUIRED = ["cursor","chatgpt","claude","gemini","github-copilot","openai-api","anthropic-api","windsurf","v0"];

  it("contains all required tools", () => {
    REQUIRED.forEach(id => expect(TOOLS_REGISTRY[id]).toBeDefined());
  });

  it("every tool has at least one tier", () => {
    TOOL_LIST.forEach(t => expect(t.tiers.length).toBeGreaterThanOrEqual(1));
  });

  it("monthlyPrice is non-negative for all tiers", () => {
    TOOL_LIST.forEach(t =>
      t.tiers.forEach(tier => expect(tier.monthlyPrice).toBeGreaterThanOrEqual(0))
    );
  });

  it("annualPrice <= monthlyPrice when defined", () => {
    TOOL_LIST.forEach(t =>
      t.tiers.forEach(tier => {
        if (tier.annualPrice !== undefined) {
          expect(tier.annualPrice).toBeLessThanOrEqual(tier.monthlyPrice);
        }
      })
    );
  });

  it("all tier IDs are globally unique", () => {
    const ids = TOOL_LIST.flatMap(t => t.tiers.map(tier => tier.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
