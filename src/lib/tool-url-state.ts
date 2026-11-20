// URL input is untrusted. Restore only the known shape and bounded, finite values.
export function restoreToolValue<T>(value: unknown, fallback: T): T {
  if (typeof fallback === "number") return (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1e9 ? value : fallback) as T;
  if (typeof fallback === "string") return (typeof value === "string" && value.length <= 8000 ? value : fallback) as T;
  if (typeof fallback === "boolean") return (typeof value === "boolean" ? value : fallback) as T;
  if (fallback && typeof fallback === "object" && !Array.isArray(fallback)) {
    const record = isToolRecord(value) ? value : {};
    return Object.fromEntries(Object.entries(fallback).map(([key, defaultValue]) => [key, restoreToolValue(record[key], defaultValue)])) as T;
  }
  return fallback;
}

export function isToolRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function readToolParam<T>(search: string, key: string, fallback: T, restore?: (value: unknown) => T): T {
  try {
    const raw = new URLSearchParams(search).get(key);
    if (raw === null || raw.length > 16000) return fallback;
    const value: unknown = JSON.parse(raw);
    return restore ? restore(value) : restoreToolValue(value, fallback);
  } catch { return fallback; }
}

export function boundedNumber(value: unknown, fallback: number, min = 0, max = 1e9) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
}

export function restoreIndices(value: unknown, count: number): number[] {
  return Array.isArray(value) ? [...new Set(value.filter((index): index is number => Number.isInteger(index) && index >= 0 && index < count))] : [];
}

export function restoreChoice(value: unknown, fallback: string, options: string[]) {
  return typeof value === "string" && options.includes(value) ? value : fallback;
}

export function restoreNumbers<T extends Record<string, number>>(value: unknown, defaults: T, limits: Record<string, { min?: number; max?: number }> = {}): T {
  const record = isToolRecord(value) ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, boundedNumber(record[key], fallback, limits[key]?.min, limits[key]?.max)])) as T;
}

export function restoreProfile<T extends Record<string, string | number>>(value: unknown, defaults: T, choices: Partial<Record<keyof T, string[]>>, limits: Partial<Record<keyof T, { min?: number; max?: number }>> = {}): T {
  const record = isToolRecord(value) ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key,
    typeof fallback === "number"
      ? boundedNumber(record[key], fallback, limits[key]?.min, limits[key]?.max)
      : choices[key] ? restoreChoice(record[key], fallback, choices[key]) : restoreToolValue(record[key], fallback),
  ])) as T;
}
