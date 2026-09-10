import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

/** Renders a date as "12 Mar 2025". Returns an em dash for missing values. */
export function formatDate(value: Date | string | null | undefined): string {
  const date = toDate(value);
  return date ? format(date, "dd MMM yyyy") : "—";
}

/** Renders a time as "09:15". */
export function formatTime(value: Date | string | null | undefined): string {
  const date = toDate(value);
  return date ? format(date, "HH:mm") : "—";
}

/**
 * Renders "3 days ago" / "in 3 days". `addSuffix` matters: the strict
 * distance itself is unsigned, so a hand-appended "ago" would be wrong for
 * any future date.
 */
export function formatRelative(value: Date | string | null | undefined): string {
  const date = toDate(value);
  return date ? formatDistanceToNowStrict(date, { addSuffix: true }) : "—";
}

/** Builds initials for an avatar fallback: "Asha Rao" -> "AR". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return words.map((word) => word.charAt(0).toUpperCase()).join("") || "?";
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}
