"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployeeCounts } from "@/lib/api/employees";
import { queryKeys } from "@/lib/query/query-keys";

/** Headcount totals for the dashboard KPI cards. */
export function useEmployeeCounts() {
  return useQuery({
    queryKey: queryKeys.employees.counts,
    queryFn: ({ signal }) => getEmployeeCounts(signal),
  });
}
