// ─── Audit Form State Hook ─────────────────────────────────────────────────────
"use client";
import { useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { AuditFormData } from "@/types/audit";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const toolEntrySchema = z.object({
  id: z.string(),
  toolId: z.string().min(1, "Select a tool"),
  planId: z.string().min(1, "Select a plan"),
  seats: z.coerce.number().int().min(1, "At least 1 seat"),
  monthlySpend: z.coerce.number().min(0, "Enter 0 if free"),
  primaryUseCase: z.string().min(1, "Select a use case"),
});

export const auditFormSchema = z.object({
  companyName: z.string().optional(),
  teamSize: z.coerce.number().int().min(1, "At least 1"),
  tools: z
    .array(toolEntrySchema)
    .min(1, "Add at least one tool to audit"),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuditForm() {
  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      companyName: "",
      teamSize: 5,
      tools: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = formStorage.load();
    if (saved.tools.length > 0) {
      form.reset({
        companyName: saved.companyName,
        teamSize: saved.teamSize,
        tools: saved.tools,
      });
    }
  }, [form]);

  // Persist on change
  const watchedValues = form.watch();
  useEffect(() => {
    const sub = form.watch((values) => {
      formStorage.save(values as AuditFormData);
    });
    return () => sub.unsubscribe();
  }, [form]);

  const addTool = useCallback(() => {
    append({
      id: generateId(),
      toolId: "",
      planId: "",
      seats: 1,
      monthlySpend: 0,
      primaryUseCase: "",
    });
  }, [append]);

  const removeTool = useCallback(
    (index: number) => remove(index),
    [remove]
  );

  return { form, fields, addTool, removeTool, watchedValues };
}
