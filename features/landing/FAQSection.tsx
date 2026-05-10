"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is this actually free?",
    a: "Yes, completely. There's no signup, no credit card, and no freemium gate. The audit runs entirely in your browser.",
  },
  {
    q: "Do you store my spend data?",
    a: "No. All calculations happen client-side. Your data is saved in your browser's localStorage so you can return to it, but nothing is sent to any server.",
  },
  {
    q: "How accurate is the pricing data?",
    a: "We manually curate pricing from each vendor's public pricing page. Prices are reviewed regularly, but AI pricing changes frequently — always verify before making a decision.",
  },
  {
    q: "What tools are supported?",
    a: "Currently: Cursor, ChatGPT, Claude, Gemini, GitHub Copilot, OpenAI API, Anthropic API, Windsurf, and v0. We're adding more tools regularly.",
  },
  {
    q: "Can I share my audit results?",
    a: "Yes — the results page has a share button that generates a public link to a clean, read-only version of your report.",
  },
  {
    q: "What if my exact plan isn't listed?",
    a: "Enter the plan that's closest to yours and manually enter your actual monthly spend. The audit engine will use your reported spend for the savings calculation.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container max-w-2xl">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          Common questions
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border gradient-card overflow-hidden">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {faq.q}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
