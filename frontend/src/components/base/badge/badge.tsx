import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * Setura Base UI — Badge.
 *
 * Tones are semantic ("success"), not colour names ("green"), so that a
 * later palette change does not require touching every call site.
 */

export type BadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-brand-50 text-brand-700 ring-brand-200",
};

export type BadgeProps = {
  tone?: BadgeTone;
  /** Small filled circle before the label — useful for status. */
  withDot?: boolean;
  className?: string;
  children: ReactNode;
};

const DOT_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-brand-500",
};

export function Badge({
  tone = "neutral",
  withDot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        "text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])}
        />
      )}
      {children}
    </span>
  );
}
