"use client";
import { useEffect } from "react";
import type { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOLS_REGISTRY, USE_CASES } from "@/data/tools";
import type { AuditFormValues } from "./useAuditForm";

interface ToolRowProps {
  index: number;
  field: FieldArrayWithId<AuditFormValues, "tools">;
  form: UseFormReturn<AuditFormValues>;
  onRemove: () => void;
  isOnly: boolean;
}

export function ToolRow({ index, field, form, onRemove, isOnly }: ToolRowProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const toolErrors = errors.tools?.[index];

  const selectedToolId = watch(`tools.${index}.toolId`);
  const selectedTool = selectedToolId ? TOOLS_REGISTRY[selectedToolId] : null;

  // Reset plan when tool changes
  useEffect(() => {
    setValue(`tools.${index}.planId`, "");
  }, [selectedToolId, index, setValue]);

  return (
    <div className="rounded-xl border border-border gradient-card p-5">
      {/* Row header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-muted-foreground">
          Tool #{index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={isOnly}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          aria-label="Remove tool"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tool */}
        <div className="space-y-1.5">
          <Label htmlFor={`tool-${index}`}>AI Tool</Label>
          <Select
            value={selectedToolId || ""}
            onValueChange={(val) => setValue(`tools.${index}.toolId`, val)}
          >
            <SelectTrigger id={`tool-${index}`} aria-label="Select AI tool">
              <SelectValue placeholder="Select a tool…" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TOOLS_REGISTRY).map((tool) => (
                <SelectItem key={tool.id} value={tool.id}>
                  {tool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toolErrors?.toolId && (
            <p className="text-xs text-destructive">{toolErrors.toolId.message}</p>
          )}
        </div>

        {/* Plan */}
        <div className="space-y-1.5">
          <Label htmlFor={`plan-${index}`}>Current Plan</Label>
          <Select
            value={watch(`tools.${index}.planId`) || ""}
            onValueChange={(val) => setValue(`tools.${index}.planId`, val)}
            disabled={!selectedTool}
          >
            <SelectTrigger id={`plan-${index}`} aria-label="Select plan">
              <SelectValue placeholder={selectedTool ? "Select plan…" : "Pick a tool first"} />
            </SelectTrigger>
            <SelectContent>
              {selectedTool?.tiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                  {tier.monthlyPrice > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground font-mono">
                      ${tier.monthlyPrice}/seat
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toolErrors?.planId && (
            <p className="text-xs text-destructive">{toolErrors.planId.message}</p>
          )}
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label htmlFor={`seats-${index}`}>Seats / Licenses</Label>
          <Input
            id={`seats-${index}`}
            type="number"
            min={1}
            placeholder="1"
            {...register(`tools.${index}.seats`)}
          />
          {toolErrors?.seats && (
            <p className="text-xs text-destructive">{toolErrors.seats.message}</p>
          )}
        </div>

        {/* Monthly spend */}
        <div className="space-y-1.5">
          <Label htmlFor={`spend-${index}`}>Monthly Spend ($)</Label>
          <Input
            id={`spend-${index}`}
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            {...register(`tools.${index}.monthlySpend`)}
          />
          <p className="text-xs text-muted-foreground/60">What you actually pay</p>
          {toolErrors?.monthlySpend && (
            <p className="text-xs text-destructive">{toolErrors.monthlySpend.message}</p>
          )}
        </div>

        {/* Use case */}
        <div className="space-y-1.5">
          <Label htmlFor={`usecase-${index}`}>Primary Use Case</Label>
          <Select
            value={watch(`tools.${index}.primaryUseCase`) || ""}
            onValueChange={(val) => setValue(`tools.${index}.primaryUseCase`, val)}
          >
            <SelectTrigger id={`usecase-${index}`} aria-label="Select use case">
              <SelectValue placeholder="Select use case…" />
            </SelectTrigger>
            <SelectContent>
              {USE_CASES.map((uc) => (
                <SelectItem key={uc.id} value={uc.id}>
                  {uc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toolErrors?.primaryUseCase && (
            <p className="text-xs text-destructive">{toolErrors.primaryUseCase.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
