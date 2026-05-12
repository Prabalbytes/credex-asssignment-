# TESTS.md

## Test Suite Overview

All tests are located in the `tests/` directory and cover the core audit engine logic.

## How to Run

```bash
npm test
```

## Test Files

### tests/audit-engine.test.ts
Covers the core `runAudit()` function:
- Returns valid result with ID and timestamp
- Produces zero savings for empty tools list
- Identifies overspending on enterprise plan for small team
- Correctly sums savings across multiple tools
- Never produces negative savings
- Handles unknown toolId gracefully without throwing

### tests/pricing.test.ts
Covers pricing data integrity:
- All required tools exist in registry
- Every tool has at least one pricing tier
- All monthly prices are non-negative
- Annual prices are less than or equal to monthly prices
- All tier IDs are globally unique

### tests/recommendations.test.ts
Covers recommendation logic:
- Enterprise ChatGPT on 3 seats classified as overspending
- Copilot Individual at list price classified as good-value or optimizable
- Severity counts sum to total recommendations
- Savings percentage stays between 0 and 100

## Results
- **3 test suites**
- **15 tests total**
- **15 passing**