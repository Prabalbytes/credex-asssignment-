"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolRow } from "./ToolRow";
import { useAuditForm } from "./useAuditForm";
import { runAudit } from "@/lib/audit-engine";
import { resultStorage } from "@/lib/storage";
import type { AuditFormValues } from "./useAuditForm";
import type { AuditFormData } from "@/types/audit";

export function AuditForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, fields, addTool, removeTool } = useAuditForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(values: AuditFormValues) {
  setIsSubmitting(true);
  await new Promise((r) => setTimeout(r, 600));
  const result = runAudit(values as AuditFormData);

  // Save to Supabase
  const { error } = await supabase.from("audits").insert({
    id: result.id,
    company_name: result.companyName,
    team_size: result.teamSize,
    tools: values.tools,
    recommendations: result.recommendations,
    total_monthly_spend: result.summary.totalCurrentMonthlySpend,
    total_monthly_savings: result.summary.totalMonthlySavings,
    total_annual_savings: result.summary.totalAnnualSavings,
    savings_percentage: result.summary.savingsPercentage,
    overspending_count: result.summary.overspendingCount,
    optimizable_count: result.summary.optimizableCount,
    good_value_count: result.summary.goodValueCount,
  });

  if (error) {
    console.error("Supabase insert error:", error);
  }

  // Save locally as backup
  resultStorage.save(result);
  router.push("/results");
}

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Company info */}
      <div className="rounded-xl border border-border gradient-card p-6 mb-6">
        <h2 className="font-display font-semibold text-lg mb-4">Team info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company / team name</Label>
            <Input
              id="companyName"
              placeholder="Acme Corp"
              {...register("companyName")}
            />
            <p className="text-xs text-muted-foreground/60">Optional — used in the report</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teamSize">Total team size</Label>
            <Input
              id="teamSize"
              type="number"
              min={1}
              placeholder="10"
              {...register("teamSize")}
            />
            {errors.teamSize && (
              <p className="text-xs text-destructive">{errors.teamSize.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-lg">
              Your AI subscriptions
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add every tool your team currently pays for
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTool}
            className="shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Add tool
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              No tools added yet
            </p>
            <Button type="button" variant="outline" onClick={addTool}>
              <Plus className="h-3.5 w-3.5" />
              Add your first tool
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <ToolRow
                key={field.id}
                index={index}
                field={field}
                form={form}
                onRemove={() => removeTool(index)}
                isOnly={fields.length === 1}
              />
            ))}
          </div>
        )}

        {errors.tools?.root && (
          <p className="mt-2 text-sm text-destructive">{errors.tools.root.message}</p>
        )}
        {typeof errors.tools?.message === "string" && (
          <p className="mt-2 text-sm text-destructive">{errors.tools.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center gap-3">
        <Button
          type="submit"
          size="xl"
          disabled={isSubmitting || fields.length === 0}
          className="w-full sm:w-auto min-w-[220px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing subscriptions…
            </>
          ) : (
            <>
              Run Audit
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Analysis runs in your browser — nothing is sent to any server
        </p>
      </div>
    </form>
  );
}
