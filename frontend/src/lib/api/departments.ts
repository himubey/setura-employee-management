import type { DepartmentOption } from "@/types/department";

import { api, USE_MOCK_API } from "./client";
import { mockDepartmentOptions } from "./mock";

/**
 * `/api/v1/departments`
 *
 * PROVISIONAL — see `src/types/department.ts`.
 */

export function listDepartmentOptions(
  signal?: AbortSignal,
): Promise<DepartmentOption[]> {
  if (USE_MOCK_API) return mockDepartmentOptions();
  // CONTRACT: assumed to return a bare array. If it returns a Paginated
  // envelope, unwrap it here so callers keep receiving a plain array.
  return api.get<DepartmentOption[]>("/api/v1/departments", undefined, signal);
}
