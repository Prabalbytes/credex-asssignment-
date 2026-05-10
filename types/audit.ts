// ─── Audit Form & Session Types ───────────────────────────────────────────────

import type { ToolId, UseCase } from "./tools";

export interface ToolEntry {
  id: string; // unique row id (nanoid)
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number; // what the user says they pay
  primaryUseCase: UseCase;
}

export interface AuditFormData {
  companyName: string;
  teamSize: number;
  tools: ToolEntry[];
  submittedAt?: string;
}

export const DEFAULT_FORM_DATA: AuditFormData = {
  companyName: "",
  teamSize: 1,
  tools: [],
};
