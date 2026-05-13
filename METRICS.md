# METRICS.md

## North Star Metric

**Audits completed per week.**

Not visitors. Not signups. Not email captures.

Audits completed — because that is the moment the product delivers
value. A visitor who lands and leaves got nothing. A user who completes
an audit saw their overspending, got a recommendation, and potentially
changed a decision. Everything downstream (email capture, consultation
booking, Credex revenue) only happens after an audit is completed.

If audits completed per week is growing, the product is working.
If it is flat or declining, something is broken — either the traffic
source dried up or the form is losing people before completion.

---

## 3 Input Metrics That Drive the North Star

**1. Audit form start rate**
Definition: percentage of landing page visitors who click "Start Audit"
and begin filling the form.
Target: above 35%
Why it matters: if this is low, the landing page is not convincing
people the tool is worth their 2 minutes. Fix the headline or the
social proof, not the form.

**2. Audit form completion rate**
Definition: percentage of people who start the form and submit it.
Target: above 65%
Why it matters: if people start but don't finish, the form is too
long, too confusing, or asking for information they don't have handy.
The tool selector or plan dropdown is probably the drop-off point.

**3. Email capture rate**
Definition: percentage of audit completers who submit their email.
Target: above 20%
Why it matters: this is the lead quality signal. If people complete
the audit but don't give their email, either the savings found were
too low to motivate action or the email form feels too intrusive.
Segment by savings amount — high-savings users should convert at 40%+.

---

## What to Instrument First

In priority order:

1. **Audit completion event** — fire when `runAudit()` is called
   successfully. This is the North Star. Instrument this before
   anything else.

2. **Form drop-off by step** — track which tool row causes abandonment.
   If everyone drops off at row 3, the form is too long.

3. **Email capture conversion by savings tier** — did users with
   $500+/mo savings capture at a higher rate? If not, the CTA copy
   is wrong.

4. **Shareable link clicks** — how many people actually share their
   report? This measures word-of-mouth potential.

5. **Consultation CTA clicks** — how many high-savings users click
   the Credex link? This directly predicts revenue.

Simple implementation: a single `track(event, properties)` function
that posts to a free analytics service. Posthog has a generous free
tier and captures all of the above with minimal setup.

---

## What Number Triggers a Pivot Decision

If after 30 days of genuine distribution effort:

- **Audit completion rate is below 30%** — the form is broken or the
  tool selection is too limited. Pivot to a simpler version: just ask
  total monthly AI spend, team size, and primary tools. Less accurate
  audit, much lower friction.

- **Email capture rate is below 10% across all savings tiers** — the
  value proposition is not landing. Users complete the audit but do
  not believe the recommendations enough to want the report. Pivot the
  results page to show more evidence: source citations, comparison
  tables, methodology explanation.

- **Zero consultation bookings after 500 audits** — the Credex CTA
  is not connecting. Either the savings threshold ($500/mo) is too
  high and most audits don't qualify, or the CTA copy is too salesy.
  Lower the threshold to $200/mo or reframe the CTA entirely.

- **Less than 100 audits completed in 30 days despite distribution
  effort** — the distribution strategy is wrong, not the product.
  Stop posting in the same places and find one channel that actually
  has the target user. One Slack group where CTOs talk about costs
  is worth more than 10 generic startup subreddits.

---

## What This Tool Is Not Optimizing For

DAU, MAU, session length, pages per visit.

This is a tool people use once every 3-6 months when their team size
changes or a vendor announces a pricing update. Measuring daily
engagement would be measuring the wrong thing entirely. A user who
comes back in 90 days when GitHub Copilot changes pricing is a
successful retained user — even though they show up as churned in
any standard retention cohort.

The right retention metric for this tool is:
**percentage of email-captured users who run a second audit within
6 months.**

Target: above 25%.