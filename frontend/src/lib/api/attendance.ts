import type { IsoDate } from "@/types/api";
import type { AttendanceDailySummary } from "@/types/attendance";

import { api, USE_MOCK_API } from "./client";
import { mockAttendanceSummary } from "./mock";

/**
 * `/api/v1/attendance`
 *
 * PROVISIONAL — see `src/types/attendance.ts`. Only the daily summary is
 * consumed today; check-in/check-out are here so the module boundary is
 * settled, and are not called from any screen yet.
 */

/** Today in the browser's timezone, as `YYYY-MM-DD`. */
export function todayIsoDate(): IsoDate {
  const now = new Date();
  // Shift by the offset before serialising: `toISOString()` is UTC, so a
  // user east of UTC would otherwise see "yesterday" late in the evening.
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function getDailySummary(
  date: IsoDate,
  signal?: AbortSignal,
): Promise<AttendanceDailySummary> {
  if (USE_MOCK_API) return mockAttendanceSummary(date);
  return api.get<AttendanceDailySummary>(
    "/api/v1/attendance/summary",
    { date },
    signal,
  );
}

export function checkIn(): Promise<void> {
  return api.post<void>("/api/v1/attendance/check-in");
}

export function checkOut(): Promise<void> {
  return api.post<void>("/api/v1/attendance/check-out");
}
