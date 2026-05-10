# AI Spend Audit

**Stop overpaying for AI tools your team barely uses.**

A free, frontend-only SaaS tool that audits your team's AI subscriptions and surfaces overspending, better plans, and alternative tools — in under 2 minutes.

---

## Features

- **Audit form** — add any combination of Cursor, ChatGPT, Claude, Gemini, GitHub Copilot, OpenAI API, Anthropic API, Windsurf, and v0
- **Deterministic audit engine** — pure TypeScript pricing logic, no AI, fully testable
- **Results dashboard** — per-tool recommendations, savings breakdown, severity classification
- **Shareable report** — copy a link to a public read-only version of the report
- **Persistent state** — form data and results saved in `localStorage`
- **Privacy-first** — everything runs in the browser, nothing sent to a server

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui (Radix UI) |
| Forms | react-hook-form + Zod |
| Fonts | Syne (display) · DM Sans (body) · DM Mono (numbers) |
| Tests | Jest + ts-jest |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## Project Structure

```
ai-spend-audit/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── audit/page.tsx      # Audit form
│   ├── results/page.tsx    # Results dashboard
│   └── report/[id]/        # Shareable public report
│
├── components/             # Shared presentational components
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Header, Footer
│   └── shared/             # StatCard, SeverityIcon
│
├── features/               # Feature-sliced modules
│   ├── landing/            # Hero, Benefits, SavingsExample, FAQ
│   ├── audit/              # AuditForm, ToolRow, useAuditForm, schema
│   └── results/            # ResultsHero, RecommendationCard, SavingsBreakdown, ShareButton
│
├── lib/                    # Business logic & utilities
│   ├── audit-engine.ts     # Core deterministic audit logic ← start here
│   ├── calculations.ts     # Pure financial math helpers
│   ├── formatters.ts       # Display formatting
│   ├── storage.ts          # localStorage persistence
│   └── utils.ts            # cn(), formatCurrency(), etc.
│
├── data/                   # Static data
│   ├── tools.ts            # Tool definitions + pricing tiers registry
│   ├── pricing.ts          # Re-exports + TOOL_IDS constant
│   ├── recommendations.ts  # Static messaging / copy
│   └── mock-results.ts     # Sample AuditResult for demos
│
├── types/                  # TypeScript type definitions
│   ├── tools.ts            # ToolDefinition, PricingTier, PricingModel
│   ├── audit.ts            # AuditFormData, ToolEntry
│   └── results.ts          # AuditResult, ToolRecommendation, AuditSummary
│
└── tests/                  # Unit tests
    ├── audit-engine.test.ts
    ├── pricing.test.ts
    └── recommendations.test.ts
```

---

## Audit Engine

The core logic lives in `lib/audit-engine.ts`. It's a pure function:

```typescript
runAudit(formData: AuditFormData): AuditResult
```

Rules applied (in priority order):

1. **Tier right-sizing** — is there a cheaper plan that covers the seat count?
2. **Annual billing** — would switching to annual save ≥5%?
3. **Bill accuracy** — is the user paying more than the listed plan price?
4. **Alternatives** — are there cheaper tools for the same use case?

Each recommendation is classified as `overspending | optimizable | good-value`.

---

## Running Tests

```bash
npm test
```

Tests cover:
- Audit engine correctness (savings calculation, severity classification)
- Pricing data integrity (all tiers have valid prices, IDs are unique)
- Recommendation logic (counts sum correctly, no negative savings)

---

## Adding a New Tool

1. Add an entry to `data/tools.ts` in `TOOLS_REGISTRY`
2. Add the tool ID to `TOOL_IDS` in `data/pricing.ts`
3. Pricing tiers automatically appear in the audit form
4. Add alternatives cross-references in the relevant tool's `alternatives` array

---

## Environment Variables

None required. This is a fully client-side app.

---

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel with zero configuration — the project is a standard Next.js app.

---

## Roadmap (v1.1+)

- [ ] AI-generated narrative summary (Claude API)
- [ ] Backend persistence for shareable reports (Postgres + Prisma)
- [ ] Usage data import (CSV upload from billing portals)
- [ ] Slack/email digest integration
- [ ] Team comparison benchmarking

---

## License

MIT — free to use, modify, and deploy.
