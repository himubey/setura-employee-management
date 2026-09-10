/**
 * PROVISIONAL — see the header of `src/types/api.ts`.
 */

/**
 * `GET /api/v1/departments` in its lightweight, select-friendly form.
 *
 * CONTRACT: confirm whether this endpoint returns a bare array or the same
 * `Paginated<T>` envelope as the other list endpoints. The department filter
 * on the employees table needs every department, not a first page.
 */
export type DepartmentOption = {
  id: string;
  name: string;
};

/**
 * The fuller record a departments management screen would need.
 *
 * CONTRACT: unconfirmed, and nothing renders it yet.
 */
export type Department = DepartmentOption & {
  code: string | null;
  managerId: string | null;
  employeeCount: number;
};
