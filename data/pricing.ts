// ─── Pricing helpers — thin wrappers over the tools registry ─────────────────
// Consumers should prefer importing from @/data/tools directly.
// This file exists for convenience and backward compatibility.

export { TOOLS_REGISTRY, TOOL_LIST, USE_CASES } from "./tools";

/** Flat list of all tool ID strings, useful for Zod enum validation */
export const TOOL_IDS = [
  "cursor",
  "chatgpt",
  "claude",
  "gemini",
  "github-copilot",
  "openai-api",
  "anthropic-api",
  "windsurf",
  "v0",
] as const;

export type KnownToolId = (typeof TOOL_IDS)[number];
