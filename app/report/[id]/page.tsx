// ─── Public Shareable Report Page ─────────────────────────────────────────────
// In production: fetch from DB by ID.
// For this MVP: reads from localStorage via client component.

import type { Metadata } from "next";
import { SharedReportView } from "./SharedReportView";

export const metadata: Metadata = {
  title: "AI Spend Audit Report",
  description: "View this AI subscription audit report.",
  openGraph: {
    title: "AI Spend Audit Report",
    description: "See how much this team could save on their AI tool subscriptions.",
    type: "article",
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  return <SharedReportView reportId={id} />;
}
