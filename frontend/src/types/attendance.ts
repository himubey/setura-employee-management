import type { IsoDate } from "./api";

/**
 * PROVISIONAL — see the header of `src/types/api.ts`.
 * Nothing beyond the daily summary is rendered yet; these shapes exist so the
 * contract conversation with Sakshi has something concrete to react to.
 */

/**
 * `GET /api/v1/attendance/summary?date=YYYY-MM-DD` — the dashboard cards.
 *
 * CONTRACT: this aggregate endpoint may not exist. Confirm whether "absent"
 * is computed by the backend (active staff with no record for the day) or
 * whether the frontend is expected to derive it.
 */
export type AttendanceDailySummary = {
  date: IsoDate;
  present: number;
  late: number;
  absent: number;
};

/**
 * CONTRACT: entirely unconfirmed — the status vocabulary in particular.
 * `src/lib/validations/attendance.ts` holds the current guess.
 */
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
