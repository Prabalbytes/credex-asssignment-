# DEVLOG — AI Spend Audit

> **Note on timeline:** Mid-semester examinations ran May 7–9.
> This assignment was started immediately after completion on May 10.
> All 4 working days are documented honestly below.

---

## Day 1 — 2026-05-10

**Hours worked:** 5

**What I did:**
- Initialized Next.js project with TypeScript and Tailwind CSS
- Setup folder structure for app, components, features, lib, and types
- Built initial landing page and audit form UI
- Added mock pricing data and started frontend audit engine logic
- Deployed frontend to Vercel for initial testing

**What I learned:**
- How to structure a scalable Next.js frontend project
- Importance of separating audit logic from UI components
- Better understanding of state persistence and reusable TypeScript types

**Blockers / what I'm stuck on:**
- Still deciding the best structure for pricing schemas and recommendation rules
- Need to improve result calculation flow before integrating backend

**Plan for tomorrow:**
- Set up Supabase project and create audits + leads tables
- Wire audit submission to save to database
- Get shareable URL working from real DB instead of localStorage
