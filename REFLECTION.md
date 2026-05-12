# REFLECTION.md

## 1. The hardest bug I hit and how I debugged it

The hardest bug I encountered was the shareable report URL showing
“Report not found” on any device other than the one that originally
generated the audit. This took roughly two hours of systematic debugging.

My first hypothesis was that the Supabase Row Level Security (RLS)
policy was blocking reads. I checked the policy and it appeared correct —
`USING (true)` for public SELECT access. I dropped and recreated the
policy anyway to verify it was not corrupted. The issue still persisted.

My second hypothesis was that the audit ID was not being saved correctly.
I opened the Supabase table editor and confirmed the row existed with
the correct ID. At this point the database clearly contained the data,
and the policy allowed reads, but the page was still returning nothing.

The breakthrough came when I added:

```ts
console.log("Supabase result:", { data, error });
```

inside the `fetchAudit()` function and inspected the browser console
while opening the report page. The request was failing with:

```txt
406 Not Acceptable
&id=eq.undefined
```

The important detail was that the ID itself was `undefined`.

I traced this back to `app/report/[id]/page.tsx`. In Next.js 14 App
Router, `params` is asynchronous and must be awaited. My code was trying
to access `params.id` synchronously, which returned undefined.

Changing:

```ts
const id = params.id;
```

to:

```ts
const { id } = await params;
```

fixed the issue immediately.

The main lesson I took away was that when debugging “data not found”
issues, it is important to verify what the query is actually sending
before assuming the database or permissions are broken.

---

## 2. A decision I reversed mid-week

I originally planned to build the entire project as a frontend-only
application with no backend. The audit would run fully in the browser,
results would be stored in localStorage, and the “shareable URL” would
simply encode the audit data into query parameters.

I reversed this decision on Day 2 for two reasons.

First, the assignment explicitly required a real backend for lead
capture and persistence. Initially I focused mostly on the audit engine
and UI and underestimated how important the backend requirements were.

Second, and more importantly, I realized that localStorage fundamentally
breaks the concept of a shareable report. A report that only works on
the same browser and device is not actually shareable — it is just a
local bookmark.

Moving to Supabase added several extra hours of work, but it made the
application behave like a real product instead of a frontend demo. The
frontend-only approach would have been a shortcut that failed one of the
core requirements of the assignment.

That decision also improved the architecture significantly because audit
data, lead data, and public reports became properly separated concerns.

---

## 3. What I would build in week 2

The biggest weakness in the current product is pricing freshness.
Right now all pricing data is manually verified and hardcoded into the
application. AI tooling prices change frequently, which means the audit
results will eventually become outdated.

### Day 1–2: Pricing synchronization

I would move pricing data into Supabase instead of hardcoded TypeScript
files. This would allow pricing updates without redeploying the app.
Initially the updates could be manual, then later automated using a
scheduled sync process.

### Day 3: Usage data imports

Currently users manually enter monthly spend and seat counts. I would
add CSV upload support for exports from Stripe or billing dashboards.
This would reduce friction and make the audit significantly more
accurate.

### Day 4: Proper Credex integration

The current high-savings CTA only redirects users to Credex.rocks.
I would build a real consultation booking flow using Calendly or a
custom lead-routing system that includes the audit data automatically.

### Day 5: Funnel analytics

The product currently has no analytics. I would instrument:
- Landing page visits
- Form starts
- Form completions
- Email captures
- Consultation bookings

Without funnel data, product decisions become guesswork instead of
measurable iteration.

---

## 4. How I used AI tools

I used Claude heavily throughout the week. Here is an honest breakdown
of how I used it and where I deliberately avoided relying on it.

### What I used AI for

- Generating the initial project scaffold and folder structure
- Writing boilerplate TypeScript types and component shells
- Debugging framework-specific issues when stuck
- Reviewing API route structure and architecture decisions
- Drafting markdown documentation files

### What I deliberately did not trust AI with

- The audit engine pricing logic
- Savings calculations
- Vendor pricing verification
- User interviews
- Git commit history

The pricing and recommendation logic was written and verified manually
against official vendor pricing pages because AI-generated pricing logic
would be unreliable and difficult to validate.

### One specific time the AI was wrong

Claude initially suggested an outdated Supabase setup pattern using
older helper packages that no longer matched the latest documentation.
The generated imports caused type errors inside `lib/supabase.ts`
and the client initialization failed.

I caught the issue by comparing the generated code against the official
Supabase documentation and noticing the API had changed.

The fix was switching to the newer `createClient` pattern directly from:

```ts
@supabase/supabase-js
```

This was a useful reminder that AI-generated code can look convincing
while still being outdated by one or two framework versions.

---

## 5. Self-ratings

| Category | Rating | Reflection |
|---|---|---|
| Discipline | 6/10 | Mid-semester exams delayed the start of the project, which compressed the timeline significantly. Once started, work was consistent, but some decisions became rushed because of time pressure. |
| Code Quality | 7/10 | The TypeScript types and audit engine separation are clean. However, a few components became larger than ideal and some API error handling could be improved further. |
| Design Sense | 7/10 | The overall dark fintech-style UI works well and the information hierarchy on the results page is clear. Mobile responsiveness still needs refinement on smaller layouts. |
| Problem Solving | 8/10 | The report URL debugging process was handled methodically instead of randomly changing code. Most major issues were solved through logging and isolating assumptions step by step. |
| Entrepreneurial Thinking | 6/10 | I spent more time thinking like an engineer than a founder during the first half of the project. The user interviews helped shift my focus toward real user behavior, pricing confusion, and why teams forget unused subscriptions in the first place. |