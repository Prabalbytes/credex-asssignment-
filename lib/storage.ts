// ─── LocalStorage Persistence Layer ──────────────────────────────────────────

import type { AuditFormData } from "@/types/audit";
import type { AuditResult } from "@/types/results";
import { DEFAULT_FORM_DATA } from "@/types/audit";

const KEYS = {
  FORM: "asa:form",
  RESULT: "asa:result",
} as const;

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently fail
  }
}

export const formStorage = {
  load: (): AuditFormData => safeGet<AuditFormData>(KEYS.FORM, DEFAULT_FORM_DATA),
  save: (data: AuditFormData): void => safeSet(KEYS.FORM, data),
  clear: (): void => {
    if (typeof window !== "undefined") localStorage.removeItem(KEYS.FORM);
  },
};

export const resultStorage = {
  load: (): AuditResult | null => safeGet<AuditResult | null>(KEYS.RESULT, null),
  save: (result: AuditResult): void => safeSet(KEYS.RESULT, result),
  clear: (): void => {
    if (typeof window !== "undefined") localStorage.removeItem(KEYS.RESULT);
  },
};
