import { format, formatISO, isValid, parseISO } from "date-fns";

export function formatDate(value: Date | string | number, pattern = "dd/MM/yyyy"): string {
  const date = toDate(value);
  return date ? format(date, pattern) : "";
}

export function formatDateTime(value: Date | string | number, pattern = "dd/MM/yyyy HH:mm"): string {
  const date = toDate(value);
  return date ? format(date, pattern) : "";
}

export function formatDateIso(value: Date | string | number): string {
  const date = toDate(value);
  return date ? formatISO(date) : "";
}

export function parseDateIso(value: string): Date | null {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

function toDate(value: Date | string | number): Date | null {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }

  const numeric = new Date(value);
  return isValid(numeric) ? numeric : null;
}
