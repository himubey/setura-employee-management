"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * Setura Base UI — Input.
 *
 * Label, hint and error are part of the component because an input without
 * an accessible label is the single most common a11y defect in an HR tool.
 * `aria-describedby` and `aria-invalid` are wired automatically.
 */

export type InputSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-3.5 text-sm",
};

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  hint?: string;
  error?: string;
  inputSize?: InputSize;
  /** Rendered inside the field, before the text. */
  leadingIcon?: ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    inputSize = "md",
    leadingIcon,
    className,
    containerClassName,
    id,
    required,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
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
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-slate-400"
          >
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          className={cn(
            "w-full rounded-md border bg-white text-slate-900",
            "placeholder:text-slate-400",
            "transition-colors duration-150",
            "focus:outline-2 focus:outline-offset-[-1px]",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            SIZE_CLASSES[inputSize],
            leadingIcon && "pl-8",
            error
              ? "border-red-400 focus:outline-red-500"
              : "border-slate-300 focus:outline-brand-600",
            className,
          )}
          {...props}
        />
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
});
