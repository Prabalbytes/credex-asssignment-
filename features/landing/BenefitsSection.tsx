import { Shield, Zap, BarChart3, RefreshCcw } from "lucide-react";

const BENEFITS = [
  {
    icon: Zap,
    title: "Instant audit",
    description:
      "Enter your tools and plans. Get a full savings breakdown in under 2 minutes — no account needed.",
  },
  {
    icon: BarChart3,
    title: "Tool-by-tool breakdown",
    description:
      "See exactly which subscriptions are overpriced, which plans are wrong-sized, and which tools overlap.",
  },
  {
    icon: RefreshCcw,
    title: "Better plan suggestions",
    description:
      "We map your team size and use case to the most cost-effective plan available — including annual billing discounts.",
  },
  {
    icon: Shield,
    title: "Private by design",
    description:
      "All analysis runs in your browser. We never store your spend data or company information.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Built for teams tired of bloated AI bills
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            The average team overpays by 34% on AI subscriptions. Most don't
            know which plan they're on, let alone whether it's right.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border p-6 gradient-card hover:border-primary/30 transition-colors"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
