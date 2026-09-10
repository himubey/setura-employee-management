import type { IsoDate } from "@/types/api";
import type { OnLeaveCount } from "@/types/leave";

import { api, USE_MOCK_API } from "./client";
import { mockOnLeaveToday } from "./mock";

/**
 * `/api/v1/leave`
 *
 * PROVISIONAL — see `src/types/leave.ts`. Only the on-leave count is used
 * today, by a dashboard card.
 */

/** How many people have approved leave covering the given date. */
export async function countOnLeave(
  date: IsoDate,
  signal?: AbortSignal,
): Promise<number> {
  if (USE_MOCK_API) return mockOnLeaveToday();

  const response = await api.get<OnLeaveCount>(
    "/api/v1/leave/on-leave",
    { date },
    signal,
  );
  return response.count;
}
