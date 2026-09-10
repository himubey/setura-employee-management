import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from "@/lib/validations/employee";
import type { Paginated } from "@/types/api";
import type {
  EmployeeCounts,
  EmployeeDetail,
  EmployeeListItem,
} from "@/types/employee";

import { api, USE_MOCK_API, type QueryParams } from "./client";
import { mockEmployeeCounts, mockListEmployees } from "./mock";

/**
 * `/api/v1/employees`
 *
 * PROVISIONAL — paths, query-parameter names and response shapes all follow
 * `src/types/employee.ts` and need confirming against Sakshi's contract.
 */

export function listEmployees(
  query: Partial<EmployeeListQuery>,
  signal?: AbortSignal,
): Promise<Paginated<EmployeeListItem>> {
  if (USE_MOCK_API) return mockListEmployees(query);
  // CONTRACT: parameter names assumed to be search / departmentId / status /
  // page / pageSize / sortBy / sortDir. A snake_case backend needs mapping
  // here — this function is the only place that would change.
  return api.get<Paginated<EmployeeListItem>>(
    "/api/v1/employees",
    query as QueryParams,
    signal,
  );
}

export function getEmployee(
  id: string,
  signal?: AbortSignal,
): Promise<EmployeeDetail> {
  return api.get<EmployeeDetail>(`/api/v1/employees/${id}`, undefined, signal);
}

export function getEmployeeCounts(signal?: AbortSignal): Promise<EmployeeCounts> {
  if (USE_MOCK_API) return mockEmployeeCounts();
  return api.get<EmployeeCounts>("/api/v1/employees/stats", undefined, signal);
}

export function createEmployee(
  input: CreateEmployeeInput,
): Promise<EmployeeDetail> {
  return api.post<EmployeeDetail>("/api/v1/employees", input);
}

export function updateEmployee({
  id,
  ...input
}: UpdateEmployeeInput): Promise<EmployeeDetail> {
  return api.patch<EmployeeDetail>(`/api/v1/employees/${id}`, input);
}

export function deleteEmployee(id: string): Promise<void> {
  return api.delete<void>(`/api/v1/employees/${id}`);
}
