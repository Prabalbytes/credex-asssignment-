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



## Day 2 — 2026-05-11

**Hours worked:** 8

**What I did:**
- Set up Supabase project and created audits and leads tables with RLS policies
- Installed @supabase/supabase-js and configured environment variables locally and on Vercel
- Created lib/supabase.ts client file
- Wired audit form submission to save results to Supabase database
- Built email capture form with honeypot bot protection
- Created /api/capture-lead route to save leads to Supabase and trigger emails
- Integrated Resend for transactional confirmation emails
- Built /api/generate-summary route using Anthropic Claude API
- Added AI-generated summary with graceful fallback to results page
- Fixed shareable report URL — was failing due to Next.js 14 requiring params to be awaited
- Fixed Supabase RLS policy that was blocking public SELECT on audits table
- Tested full flow end-to-end across different devices successfully

**What I learned:**
- Next.js 14 App Router requires params to be awaited in dynamic routes — caught this through console logging
- Supabase RLS policies must explicitly allow SELECT with USING (true) for public access
- Always test shareable URLs from a completely different device and browser session
- Honeypot fields are a simple but effective first layer of bot protection

**Blockers / what I'm stuck on:**
- AI summary showing $0 values when loaded from localStorage — only shows correct values when audit is freshly run on live URL
- Anthropic API occasionally slow on cold starts

**Plan for tomorrow:**
- Set up GitHub Actions CI pipeline
- Write minimum 5 passing tests for audit engine
- Write PRICING_DATA.md with cited vendor URLs
- Write ARCHITECTURE.md with Mermaid diagram
- Start REFLECTION.md
