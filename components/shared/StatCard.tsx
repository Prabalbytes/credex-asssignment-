import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  className?: string;
}

export function StatCard({ label, value, sub, highlight, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border p-5 gradient-card",
        highlight && "border-primary/30 border-glow",
        className
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
        {label}
      </p>
      <p
        className={cn(
          "text-3xl font-display font-bold tracking-tight",
          highlight ? "text-gradient" : "text-foreground"
        )}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
