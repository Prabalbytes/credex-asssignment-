import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-primary/20",
        overspending: "bg-red-500/10 text-red-400 ring-red-500/20",
        optimizable: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        "good-value": "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
        secondary: "bg-secondary text-muted-foreground ring-border",
        outline: "bg-transparent text-foreground ring-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
