import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative text-center">
        {/* Eyebrow */}
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8">
          <Sparkles className="h-3 w-3" />
          Free AI subscription audit — 2 minutes
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-delay-1 font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl max-w-4xl mx-auto leading-[1.05]">
          Stop overpaying for{" "}
          <span className="text-gradient">AI tools</span>{" "}
          your team barely uses
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-delay-2 mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Input your current AI subscriptions. We'll audit every line item,
          surface redundancies, and show you exactly how much you could save —
          without switching your workflow.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-delay-3 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="xl" asChild>
            <Link href="/audit">
              Start Free Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link href="#example">See example report</Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-xs text-muted-foreground/70">
          No signup · No credit card · Results in under 2 minutes
        </p>

        {/* Tool logos strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 opacity-40">
          {["ChatGPT", "Claude", "Cursor", "Copilot", "Gemini", "OpenAI API"].map((name) => (
            <span
              key={name}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground font-mono"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
