import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "@/utils/cn";

/**
 * Setura Base UI — Table primitives.
 *
 * These are presentation only: semantic HTML table elements with Setura's
 * styling. All table *logic* (sorting, pagination, column definitions) comes
 * from TanStack Table — see components/features/employees/employees-table.tsx.
 *
 * Keeping the two apart is deliberate: we own every pixel, and we do not own
 * the headless logic we would otherwise have to reimplement.
 */

export function TableContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full overflow-x-auto", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full border-collapse text-left text-sm", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-slate-200 bg-slate-50", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-slate-100", className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors hover:bg-slate-50/70", className)}
      {...props}
    />
  );
}

export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  /** Renders a sort control and communicates state to screen readers. */
  sortDirection?: "asc" | "desc" | false;
  onSort?: () => void;
};

export function TableHeaderCell({
  className,
  children,
  sortDirection,
  onSort,
  ...props
}: TableHeaderCellProps) {
  const sortable = typeof onSort === "function";

  return (
    <th
      scope="col"
      aria-sort={
        sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : sortable
              ? "none"
              : undefined
      }
      className={cn(
        "px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-600 uppercase",
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 rounded-sm hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {children}
          <SortGlyph direction={sortDirection ?? false} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 text-slate-700 align-middle", className)} {...props} />
  );
}

export type TableEmptyStateProps = {
  colSpan: number;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function TableEmptyState({
  colSpan,
  title,
  description,
  action,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-sm font-medium text-slate-900">{title}</p>
          {description && (
            <p className="max-w-sm text-xs text-slate-500">{description}</p>
          )}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </td>
    </tr>
  );
}

function SortGlyph({ direction }: { direction: "asc" | "desc" | false }) {
  return (
    <span aria-hidden="true" className="text-[10px] leading-none">
      {direction === "asc" ? "▲" : direction === "desc" ? "▼" : "↕"}
    </span>
  );
}
