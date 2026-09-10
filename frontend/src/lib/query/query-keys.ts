import type { EmployeeListQuery } from "@/lib/validations/employee";

/**
 * Every cache key in one place.
 *
 * Keys are built here rather than inline at each `useQuery` so that an
 * invalidation after a mutation cannot silently miss a query because the two
 * call sites spelled the key differently. Hierarchical by design:
 * `invalidateQueries({ queryKey: queryKeys.employees.all })` clears every
 * employee list and detail at once.
 */
export const queryKeys = {
  auth: {
    currentUser: ["auth", "me"] as const,
  },

  employees: {
    all: ["employees"] as const,
    list: (query: Partial<EmployeeListQuery>) =>
      ["employees", "list", query] as const,
    detail: (id: string) => ["employees", "detail", id] as const,
    counts: ["employees", "counts"] as const,
  },

  departments: {
    all: ["departments"] as const,
    options: ["departments", "options"] as const,
  },

  attendance: {
    all: ["attendance"] as const,
    dailySummary: (date: string) => ["attendance", "summary", date] as const,
  },

  leave: {
    all: ["leave"] as const,
    onLeaveCount: (date: string) => ["leave", "on-leave", date] as const,
  },
} as const;
