import { cn } from "@/utils/cn";

/** Setura Base UI — Spinner. Pure CSS, no icon library. */

export type SpinnerSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "size-3.5 border-2",
  md: "size-5 border-2",
  lg: "size-8 border-[3px]",
};

export type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
  /** Announced to screen readers. Set to null for purely decorative use. */
  label?: string | null;
};

export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex items-center", className)}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-current border-t-transparent opacity-70",
          SIZE_CLASSES[size],
        )}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
