"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";

interface LeadCaptureFormProps {
  auditId: string;
  monthlySavings: number;
}

export function LeadCaptureForm({ auditId, monthlySavings }: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isHighValue = monthlySavings > 500;
  const isLowValue = monthlySavings < 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize: teamSize ? parseInt(teamSize) : null,
          auditId,
          monthlySavings,
          website, // honeypot field
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="font-display font-semibold text-lg mb-1">
          Report sent to your inbox
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Check {email} for your full audit report and savings breakdown.
        </p>

        {isHighValue && (
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <p className="text-sm font-semibold text-primary mb-2">
              💰 You qualify for a Credex consultation
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Your team could save even more by sourcing AI credits through
              Credex — discounted credits from companies that overforecast.
            </p>
            
             <a href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Book a free Credex consultation
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border gradient-card p-6">
      {/* Header based on savings level */}
      {isHighValue ? (
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
            💰 High savings detected
          </div>
          <h3 className="font-display font-semibold text-lg">
            Get your full report + Credex consultation
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You could save{" "}
            <span className="text-primary font-semibold">
              {formatCurrency(monthlySavings)}/mo
            </span>
            . We'll send your report and connect you with Credex.
          </p>
        </div>
      ) : isLowValue ? (
        <div className="mb-5">
          <h3 className="font-display font-semibold text-lg">
            You're spending well 👍
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Minimal savings found right now. Get notified when new
            optimizations apply to your stack.
          </p>
        </div>
      ) : (
        <div className="mb-5">
          <h3 className="font-display font-semibold text-lg">
            Get your report in your inbox
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            We'll email you the full breakdown with{" "}
            <span className="text-primary font-semibold">
              {formatCurrency(monthlySavings)}/mo
            </span>{" "}
            in savings recommendations.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-3">
          {/* Email — required */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company</Label>
              <Input
                id="companyName"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Your role</Label>
              <Input
                id="role"
                placeholder="CTO / Founder"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="teamSize">Team size</Label>
            <Input
              id="teamSize"
              type="number"
              placeholder="10"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full mt-4"
          disabled={loading || !email}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : isHighValue ? (
            "Get report + book consultation"
          ) : isLowValue ? (
            "Notify me of new optimizations"
          ) : (
            "Send my report"
          )}
        </Button>

        <p className="text-xs text-muted-foreground/60 text-center mt-2">
          No spam. One email with your report.
        </p>
      </form>
    </div>
  );
}