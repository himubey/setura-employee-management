"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listEmployees } from "@/lib/api/employees";
import { queryKeys } from "@/lib/query/query-keys";
import type { EmployeeListQuery } from "@/lib/validations/employee";

/**
 * The employees list.
 *
 * `keepPreviousData` is what makes the table feel instant: while the next
 * page or a new filter is in flight the previous rows stay on screen instead
 * of collapsing to a spinner, and `isFetching` drives a small indicator.
 *
 * `signal` is forwarded from TanStack Query, so typing quickly in the search
 * box aborts the superseded requests rather than racing them.
 */
export function useEmployees(query: Partial<EmployeeListQuery>) {
  return useQuery({
    queryKey: queryKeys.employees.list(query),
    queryFn: ({ signal }) => listEmployees(query, signal),
    placeholderData: keepPreviousData,
  });
}
