import { twMerge } from "tailwind-merge";

export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

/**
 * Joins class names and resolves conflicting Tailwind utilities so that a
 * caller-supplied `className` always wins over a component's defaults.
 *
 * `clsx` is deliberately not a dependency — the truthy-join below is the
 * only part of it we use. `tailwind-merge` IS a dependency because conflict
 * resolution ("px-3" vs "px-6") cannot be reimplemented in a few lines
 * without re-encoding Tailwind's entire utility grammar.
 */
export function cn(...inputs: ClassValue[]): string {
  const parts: string[] = [];

  const push = (value: ClassValue): void => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      for (const item of value) push(item);
      return;
    }
    parts.push(String(value));
  };

  for (const input of inputs) push(input);

  return twMerge(parts.join(" "));
}
