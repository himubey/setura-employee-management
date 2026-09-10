"use client";

import { cn } from "@/utils/cn";

import { Button } from "../button/button";

/**
 * Setura Base UI — Pagination.
 *
 * Page-number logic lives here (not in the table) so any list can reuse it.
 * Windowing keeps the control to a fixed width regardless of page count.
 */

export type PaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-4 py-3",
        className,
      )}
    >
      <p className="text-xs text-slate-500">
        {total === 0 ? (
          "No results"
        ) : (
          <>
            Showing <span className="font-medium text-slate-700">{first}</span>–
            <span className="font-medium text-slate-700">{last}</span> of{" "}
            <span className="font-medium text-slate-700">{total}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>

        <ul className="hidden items-center gap-1 sm:flex">
          {buildPageWindow(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <li
                key={`gap-${index}`}
                aria-hidden="true"
                className="px-1.5 text-xs text-slate-400"
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={cn(
                    "h-8 min-w-8 rounded-md px-2 text-xs font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                    item === page
                      ? "bg-brand-600 text-white"
                      : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>

        <span className="text-xs text-slate-500 sm:hidden">
          {page} / {pageCount}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}

/**
 * Returns at most 7 slots: first, last, the current page and its neighbours,
 * with "gap" markers where pages were skipped.
 */
function buildPageWindow(
  page: number,
  pageCount: number,
): Array<number | "gap"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, page]);
  if (page - 1 > 1) pages.add(page - 1);
  if (page + 1 < pageCount) pages.add(page + 1);
  if (page <= 3) pages.add(2).add(3).add(4);
  if (page >= pageCount - 2) {
    pages.add(pageCount - 1).add(pageCount - 2).add(pageCount - 3);
  }

  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const result: Array<number | "gap"> = [];
  let previous = 0;

  for (const value of sorted) {
    if (previous && value - previous === 2) {
      // A "…" standing in for exactly one page is wider than the number
      // it hides — show the number instead.
      result.push(previous + 1);
    } else if (previous && value - previous > 2) {
      result.push("gap");
    }
    result.push(value);
    previous = value;
  }

  return result;
}
