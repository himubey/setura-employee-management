"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

/**
 * Setura Base UI — Select.
 *
 * A native <select>. It is keyboard accessible, works on mobile, needs no
 * portal, no focus trap and no JavaScript — which is exactly the trade the
 * brief asks for. A custom listbox can be added later if design requires
 * option icons or multi-select.
 */

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "children"
> & {
  label?: string;
  hint?: string;
  error?: string;
  options: readonly SelectOption[];
  /** Shown as the first, empty option. */
  placeholder?: string;
  containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      options,
      placeholder,
      className,
      containerClassName,
      id,
      required,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {required && (
              <span aria-hidden="true" className="ml-0.5 text-red-600">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={cn(errorId, hintId) || undefined}
            className={cn(
              "h-9 w-full appearance-none rounded-md border bg-white pr-8 pl-3 text-sm text-slate-900",
              "transition-colors duration-150",
              "focus:outline-2 focus:outline-offset-[-1px]",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              error
                ? "border-red-400 focus:outline-red-500"
                : "border-slate-300 focus:outline-brand-600",
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Overlaid rather than a background image: an SVG element keeps the
              markup out of a Tailwind arbitrary value, where its spaces and
              quotes would break class parsing. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
