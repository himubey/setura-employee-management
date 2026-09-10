"use client";

import { useQuery } from "@tanstack/react-query";

import { listDepartmentOptions } from "@/lib/api/departments";
import { queryKeys } from "@/lib/query/query-keys";

/** Every department, for the filter dropdowns. */
export function useDepartmentOptions() {
  return useQuery({
    queryKey: queryKeys.departments.options,
    queryFn: ({ signal }) => listDepartmentOptions(signal),
    // Departments change a few times a year, not a few times a minute.
    staleTime: 10 * 60_000,
  });
}
