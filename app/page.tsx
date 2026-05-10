import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/features/landing/HeroSection";
import { BenefitsSection } from "@/features/landing/BenefitsSection";
import { SavingsExample } from "@/features/landing/SavingsExample";
import { FAQSection } from "@/features/landing/FAQSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <SavingsExample />
        <FAQSection />

        {/* Final CTA */}
        <section className="py-20 md:py-28 text-center">
          <div className="container">
            <div className="mx-auto max-w-xl">
              <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
                Ready to stop guessing?
              </h2>
              <p className="text-muted-foreground mb-8">
                Takes 2 minutes. No signup. See exactly what you're overpaying.
              </p>
              <Button size="xl" asChild>
                <Link href="/audit">
                  Start your free audit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
