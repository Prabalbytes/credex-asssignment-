"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-base tracking-tight">
            AI Spend<span className="text-primary">Audit</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {isLanding ? (
            <>
              <Link
                href="#how-it-works"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:block px-3 py-2"
              >
                How it works
              </Link>
              <Link
                href="#faq"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:block px-3 py-2"
              >
                FAQ
              </Link>
              <Button size="sm" asChild>
                <Link href="/audit">Start Free Audit</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/">← Home</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
