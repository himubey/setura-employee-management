/**
 * Transport-level shapes shared by every endpoint.
 *
 * ── PROVISIONAL ───────────────────────────────────────────────────────────
 * The FastAPI backend is owned by Sakshi and its contract is not published
 * yet. Everything in `src/types/` is this frontend's *expectation*, written
 * so the UI can be built and typed today. Each provisional type carries a
 * `CONTRACT:` note listing exactly what needs confirming.
 *
 * When the real contract lands, these files are the only place that changes —
 * no component reads a field name directly from a response.
 * ──────────────────────────────────────────────────────────────────────────
 */

/**
 * Envelope for every paginated list endpoint.
 *
 * CONTRACT: field names are a guess. FastAPI projects commonly use
 * `items`/`total`/`page`/`size`/`pages` (fastapi-pagination's default) or
 * `results`/`count` (DRF style). Confirm with Sakshi, then change this one
 * type — `Paginated<T>` is consumed structurally everywhere else.
 */
export type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type SortDirection = "asc" | "desc";

/**
 * The body of a failed response.
 *
 * CONTRACT: `detail` is FastAPI's default key for `HTTPException`, so it is a
 * safe assumption. `fields` is NOT a FastAPI default — confirm how per-field
 * validation errors are returned (FastAPI's own 422 uses a `detail` array of
 * `{loc, msg, type}` objects, which is a different shape again).
 */
export type ApiErrorBody = {
  detail?: string;
  fields?: Record<string, string[]>;
};

/**
 * An ISO-8601 calendar date, `YYYY-MM-DD`. JSON has no date type, so these
 * arrive as strings and are parsed at the edge (see `src/utils/format.ts`).
 */
export type IsoDate = string;

/** An ISO-8601 instant with an offset, e.g. `2026-09-10T09:15:00+05:30`. */
export type IsoDateTime = string;
