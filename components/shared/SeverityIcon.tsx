import { AlertTriangle, TrendingDown, CheckCircle2 } from "lucide-react";
import type { SeverityLevel } from "@/types/results";
import { cn } from "@/lib/utils";

interface SeverityIconProps {
  severity: SeverityLevel;
  className?: string;
}

export function SeverityIcon({ severity, className }: SeverityIconProps) {
  if (severity === "overspending") {
    return <AlertTriangle className={cn("text-red-400", className)} />;
  }
  if (severity === "optimizable") {
    return <TrendingDown className={cn("text-amber-400", className)} />;
  }
  return <CheckCircle2 className={cn("text-emerald-400", className)} />;
}
