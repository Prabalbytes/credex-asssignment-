import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuditForm } from "@/features/audit/AuditForm";
import { ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Audit your AI tools",
  description:
    "Enter your AI tool subscriptions and we'll find where you're overspending.",
};

export default function AuditPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12 md:py-16">
        <div className="container max-w-3xl">
          {/* Page header */}
          <div className="mb-10 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Audit your AI subscriptions
            </h1>
            <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
              Add every tool your team pays for. We'll find the savings.
            </p>
          </div>

          <AuditForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
