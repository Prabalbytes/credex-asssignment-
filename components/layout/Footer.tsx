import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-sm tracking-tight">
            AI Spend<span className="text-primary">Audit</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground max-w-sm">
          Pricing data is manually curated and may not reflect real-time changes.
          Always verify with the official vendor pricing page.
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/audit" className="hover:text-foreground transition-colors">
            Start Audit
          </Link>
          <span>·</span>
          <span>© 2025 AI Spend Audit</span>
        </div>
      </div>
    </footer>
  );
}
