/**
 * Cross-cutting types used by more than one layer. Domain types live with
 * their domain (`src/db/schema/*` for rows, `src/lib/validations/*` for
 * inputs) — this file is only for shapes that have no other home.
 */

/** Standard envelope for every paginated list the services return. */
export type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

/** Shape returned by Route Handlers on failure. */
export type ApiError = {
  error: string;
  /** Field-level messages, keyed by field name, when validation failed. */
  fields?: Record<string, string[]>;
};

export type SortDirection = "asc" | "desc";
