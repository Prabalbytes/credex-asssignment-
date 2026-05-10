import Link from "next/link";
import { FileSearch, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No audit found",
  description = "Run a new audit to see your AI spend report.",
  actionLabel = "Start audit",
  actionHref = "/audit",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
        <FileSearch size={28} className="text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Link
        href={actionHref}
        className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        {actionLabel}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
