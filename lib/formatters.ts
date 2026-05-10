/**
 * Display formatting utilities.
 */

/** Format a dollar amount (e.g. $1,240 or $12.50) */
export function formatCurrency(
  amount: number,
  options?: { cents?: boolean; compact?: boolean }
): string {
  if (options?.compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: options?.cents ? 2 : 0,
    maximumFractionDigits: options?.cents ? 2 : 0,
  }).format(amount);
}

/** Format a percentage (e.g. "42%") */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Format a date to "Month DD, YYYY" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Pluralise a word based on count */
export function pluralise(count: number, word: string, plural?: string): string {
  return count === 1 ? word : plural ?? `${word}s`;
}

/** Returns a human-readable savings label */
export function savingsLabel(monthlySavings: number): string {
  if (monthlySavings === 0) return "Already optimized";
  if (monthlySavings < 10) return "Minor savings available";
  if (monthlySavings < 50) return "Moderate savings available";
  if (monthlySavings < 200) return "Significant savings available";
  return "Major savings available";
}

/** Efficiency score to label */
export function efficiencyLabel(score: number): string {
  if (score >= 90) return "Highly efficient";
  if (score >= 70) return "Well optimized";
  if (score >= 50) return "Room for improvement";
  if (score >= 30) return "Significant waste";
  return "Major overspend";
}
