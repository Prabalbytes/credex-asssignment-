// ─── Static recommendation copy / messaging ───────────────────────────────────
// Used by the audit engine and UI for consistent messaging.

export const SEVERITY_LABELS = {
  overspending: "Overspending",
  optimizable: "Optimizable",
  "good-value": "Good value",
} as const;

export const SEVERITY_DESCRIPTIONS = {
  overspending: "You're paying significantly more than necessary for this tool.",
  optimizable: "Small changes could meaningfully reduce your spend here.",
  "good-value": "This tool is well-priced for your usage.",
} as const;

export const NEXT_STEPS = [
  "Share this report with your finance or ops team",
  "Address overspending items first — they have the fastest ROI",
  "Ask vendors about annual billing discounts",
  "Audit seat counts quarterly — unused seats are silent waste",
  "Re-run this audit every 90 days as team size changes",
] as const;
