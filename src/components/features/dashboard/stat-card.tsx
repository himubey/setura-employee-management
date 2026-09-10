import { Card } from "@/components/base/card/card";
import { cn } from "@/utils/cn";

/**
 * A single dashboard metric. Deliberately a number and a label — no charts
 * yet (brief section 16).
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
  value: number | string;
  hint?: string;
  tone?: StatTone;
};

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-semibold tabular-nums",
          TONE_CLASSES[tone],
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}
