const STEPS = [
  {
    number: "01",
    title: "Add your AI tools",
    description: "Enter each tool your team uses, your current plan, monthly spend, and number of seats.",
  },
  {
    number: "02",
    title: "Get instant analysis",
    description: "Our rules engine checks for overspending, overlapping tools, and cheaper plan alternatives.",
  },
  {
    number: "03",
    title: "See exact savings",
    description: "Review per-tool recommendations with specific monthly and annual savings figures.",
  },
  {
    number: "04",
    title: "Share the report",
    description: "Share a clean, public audit URL with your team or finance team to act on.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 border-b border-border/60">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            No account required. Results in under 2 minutes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <div className="font-mono text-4xl font-bold text-border mb-4">
                {step.number}
              </div>
              <h3 className="font-display font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
