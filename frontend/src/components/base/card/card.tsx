import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * Setura Base UI — Card.
 *
 * Composed of four small pieces rather than a dozen props. Each is a plain
 * div, so anything unusual can be built without fighting the component.
 */

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned slot for buttons or filters. */
  actions?: ReactNode;
  className?: string;
};

export function CardHeader({
  title,
  description,
  actions,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-3.5",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return <div className={cn("px-4 py-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border-t border-slate-200 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
