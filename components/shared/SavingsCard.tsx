import { cn } from "@/lib/utils";

interface SavingsCardProps {
  label: string;
  value: string;
  subtext?: string;
  variant?: "gold" | "default" | "danger" | "success";
  className?: string;
}

export function SavingsCard({
  label,
  value,
  subtext,
  variant = "default",
  className,
}: SavingsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex flex-col gap-1",
        variant === "gold" && "bg-gold/5 border-gold/20",
        variant === "default" && "bg-surface border-border",
        variant === "danger" && "bg-danger/5 border-danger/20",
        variant === "success" && "bg-success/5 border-success/20",
        className
      )}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span
        className={cn(
          "font-display font-bold text-2xl leading-none tabular-nums",
          variant === "gold" && "text-gold",
          variant === "default" && "text-foreground",
          variant === "danger" && "text-danger",
          variant === "success" && "text-success"
        )}
      >
        {value}
      </span>
      {subtext && (
        <span className="text-xs text-muted-foreground">{subtext}</span>
      )}
    </div>
  );
}
