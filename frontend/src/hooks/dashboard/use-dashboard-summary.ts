"use client";

import { useQuery } from "@tanstack/react-query";

import { getDailySummary, todayIsoDate } from "@/lib/api/attendance";
import { countOnLeave } from "@/lib/api/leave";
import { queryKeys } from "@/lib/query/query-keys";

/**
 * The two non-headcount figures behind the dashboard cards.
 *
 * Kept as separate queries rather than one combined call so a slow or
 * missing attendance endpoint does not blank the leave card as well — each
 * card renders its own loading and error state.
 */

export function useAttendanceSummary(date: string = todayIsoDate()) {
  return useQuery({
    queryKey: queryKeys.attendance.dailySummary(date),
    queryFn: ({ signal }) => getDailySummary(date, signal),
  });
}

export function useOnLeaveCount(date: string = todayIsoDate()) {
  return useQuery({
    queryKey: queryKeys.leave.onLeaveCount(date),
    queryFn: ({ signal }) => countOnLeave(date, signal),
  });
}
