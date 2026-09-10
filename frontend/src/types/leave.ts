/**
 * PROVISIONAL — see the header of `src/types/api.ts`.
 * Only the on-leave count is used today (a dashboard card).
 */

/**
 * `GET /api/v1/leave/on-leave?date=YYYY-MM-DD`
 *
 * CONTRACT: this endpoint is invented by the frontend to fill the "On leave"
 * KPI card. If Sakshi would rather not add it, the same number can come from
 * `GET /api/v1/leave` filtered by date and status — but that ships a list to
 * render a single integer.
 */
export type OnLeaveCount = {
  count: number;
};

/** CONTRACT: entirely unconfirmed — the status vocabulary in particular. */
export type LeaveRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
