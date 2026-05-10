// ─── Financial Calculation Utilities ─────────────────────────────────────────
// Pure math helpers. No framework dependencies.

/** Convert a monthly amount to annual */
export function annualize(monthly: number): number {
  return monthly * 12;
}

/** Savings percentage between current and recommended spend */
export function savingsPercentage(current: number, recommended: number): number {
  if (current === 0) return 0;
  return Math.max(0, Math.min(100, ((current - recommended) / current) * 100));
}

/** Effective monthly cost for a per-seat plan */
export function effectiveMonthlyCost(pricePerSeat: number, seats: number): number {
  return pricePerSeat * seats;
}

/** Annual savings from switching to annual billing */
export function annualBillingDiscount(
  monthlyPrice: number,
  annualPrice: number,
  seats: number
): number {
  const currentAnnual = monthlyPrice * seats * 12;
  const newAnnual = annualPrice * seats * 12;
  return Math.max(0, currentAnnual - newAnnual);
}

/** Human-readable savings label */
export function savingsLabel(monthlySavings: number): string {
  if (monthlySavings === 0) return "Already optimized";
  if (monthlySavings < 10) return "Minor savings";
  if (monthlySavings < 50) return "Moderate savings";
  if (monthlySavings < 200) return "Significant savings";
  return "Major savings";
}
