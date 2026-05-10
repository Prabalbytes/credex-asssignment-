// ─── Feedback / state components ─────────────────────────────────────────────
import { Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({ title = "Loading…", className }: MessageProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, className }: MessageProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}>
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", description, className }: MessageProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}>
      <Info className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
}

export function SuccessState({ title = "Done!", description, className }: MessageProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}>
      <CheckCircle2 className="h-8 w-8 text-primary" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
}
