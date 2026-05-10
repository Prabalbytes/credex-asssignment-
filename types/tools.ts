// ─── Tool & Pricing Types ─────────────────────────────────────────────────────

export type ToolId =
  | "cursor"
  | "chatgpt"
  | "claude"
  | "gemini"
  | "github-copilot"
  | "openai-api"
  | "anthropic-api"
  | "windsurf"
  | "v0";

export type PricingModel = "flat" | "per-seat" | "usage-based" | "hybrid";

export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "customer-support"
  | "data-analysis"
  | "general";

export interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number; // per seat or flat
  annualPrice?: number; // per seat/flat if billed annually
  maxSeats?: number;
  features: string[];
  pricingModel: PricingModel;
  apiIncluded?: boolean;
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  category: "coding" | "chat" | "api";
  description: string;
  logoColor: string;
  tiers: PricingTier[];
  bestFor: UseCase[];
  alternatives: ToolId[];
  websiteUrl: string;
}

// ─── Legacy alias (data/pricing.ts uses ToolMetadata) ────────────────────────
/** @deprecated Use ToolDefinition instead */
export type ToolMetadata = ToolDefinition;
