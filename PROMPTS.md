# PROMPTS.md

## Why I used AI here at all

The audit engine is pure hardcoded logic. I deliberately kept AI out of
the math because if a rule is wrong, I want it to be obviously wrong and
fixable — not buried inside a model's reasoning.

But the results page felt cold. You'd see "$300/month saved" and a table
of recommendations, and it just sat there. A short paragraph that actually
speaks to your situation makes it feel like someone reviewed your stack,
not just ran it through a spreadsheet. That's the one place Claude adds
real value here.

---

## The prompt I ended up with

You are a financial advisor specializing in SaaS cost optimization.
Analyze this AI tool spend audit and write a personalized 100-word summary.
Company: ${companyName || "A startup team"}
Team size: ${teamSize}
Current monthly spend: $${summary.totalCurrentMonthlySpend}
Potential monthly savings: $${summary.totalMonthlySavings}
Annual savings opportunity: $${summary.totalAnnualSavings}
Tools audited: ${recommendations.map(r => r.toolName).join(", ")}
Overspending tools: ${recommendations
.filter(r => r.severity === "overspending")
.map(r => r.toolName).join(", ") || "None"}
Write a direct, specific, honest 100-word summary.

Start with the biggest saving opportunity
Mention specific tools and numbers
End with one clear action to take first
Tone: professional but conversational, like a trusted advisor
Do NOT use bullet points, just a paragraph

---

## What I tried first and why it failed

My first attempt was just: "Summarize this audit in 100 words."

The output was embarrassing. It said things like "your team is spending
money on AI tools and could save some of it." No specifics, no personality,
nothing you'd actually want to read.

The problem was I was asking Claude to both interpret and calculate at the
same time. When I started asking it to calculate savings from raw data, it
would sometimes get the numbers slightly wrong — especially when seats were
involved. The fix was obvious in hindsight: pass it the already-calculated
numbers and just ask it to narrate them. Models are great at language.
They're unreliable calculators.

I also tried a much longer prompt with 10+ instructions. Counterintuitively
that made things worse — Claude would follow some constraints and silently
ignore others. Cutting it down to 5 clear instructions fixed the consistency.

---

## The role framing

"Financial advisor specializing in SaaS cost optimization" made a
surprisingly big difference. Without it the tone was either too casual
("hey so looks like you're overspending!") or too corporate ("pursuant to
our analysis of your expenditure"). The role framing gave it a register —
confident, direct, like someone who has seen this problem a hundred times
and knows exactly what to say.

---

## Fallback

If the API call fails — timeout, missing key, rate limit — the route
catches the error and returns a hardcoded template with the real numbers
plugged in. The results page never shows a broken state because of the
AI summary. That felt important: the AI summary is a nice-to-have, not
load-bearing.

---

## Model choice

Claude Haiku. For 100 words of narrative prose, Haiku is completely
sufficient and costs roughly 10x less than Sonnet. I tested both and
couldn't reliably tell the difference in output quality for this specific
task. Using the cheaper model here was an easy call.