"use client";
import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  auditId: string;
}

export function ShareButton({ auditId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/report/${auditId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      prompt("Copy this link to share your report:", url);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-primary" />
          Link copied!
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          Share report
        </>
      )}
    </Button>
  );
}
