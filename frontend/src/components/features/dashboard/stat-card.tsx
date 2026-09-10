import { Card } from "@/components/base/card/card";
import { cn } from "@/utils/cn";

/**
 * A single dashboard metric — a number and a label. No charts.
 *
 * Each card owns its own loading and error state so one slow or missing
 * endpoint degrades a single tile instead of blanking the whole row.
 */

export type StatTone = "brand" | "success" | "warning" | "neutral";

const TONE_CLASSES: Record<StatTone, string> = {
  brand: "text-brand-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  neutral: "text-slate-900",
};

export type StatCardProps = {
  label: string;
  value: number | string | undefined;
  hint?: string;
  tone?: StatTone;
  loading?: boolean;
  error?: boolean;
};

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  loading = false,
  error = false,
}: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </p>

      {loading ? (
        // A skeleton bar rather than a spinner: it occupies the same space the
        // number will, so the row does not reflow when the value lands.
        <div
          role="status"
          aria-label={`Loading ${label}`}
          className="mt-2 h-9 w-16 animate-pulse rounded-sm bg-slate-100"
        />
      ) : error || value === undefined ? (
        <p className="mt-2 text-3xl font-semibold text-slate-300" title="Unavailable">
          —
        </p>
      ) : (
        <p
          className={cn(
            "mt-2 text-3xl font-semibold tabular-nums",
            TONE_CLASSES[tone],
          )}
        >
          {value}
        </p>
      )}

      <p className="mt-1 min-h-4 text-xs text-slate-500">
        {error ? "Unavailable" : (hint ?? "")}
      </p>
    </Card>
  );
}
