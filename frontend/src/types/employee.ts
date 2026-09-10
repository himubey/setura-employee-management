import type {
  EmployeeStatus,
  EmploymentType,
} from "@/lib/validations/employee";

import type { IsoDate } from "./api";

/**
 * PROVISIONAL — see the header of `src/types/api.ts`.
 */

/**
 * A row of `GET /api/v1/employees`, flattened for the table.
 *
 * CONTRACT:
 *   - `departmentName` assumes the backend joins and flattens. If it returns
 *     a nested `department: { id, name }` object instead, flatten it in
 *     `lib/api/employees.ts` so the table column stays unchanged.
 *   - `status` and `employmentType` must match the enums in
 *     `src/lib/validations/employee.ts` exactly.
 *   - confirm casing (`employee_code` vs `employeeCode`).
 */
export type EmployeeListItem = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  position: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  joinedDate: IsoDate;
  departmentId: string | null;
  departmentName: string | null;
};

/**
 * `GET /api/v1/employees/{id}` — the detail view.
 *
 * CONTRACT: entirely unconfirmed. Listed as the fields the detail screen is
 * likely to need, so the shape is visible for review; nothing renders it yet.
 */
export type EmployeeDetail = EmployeeListItem & {
  personalEmail: string | null;
  phone: string | null;
  managerId: string | null;
  managerName: string | null;
  exitDate: IsoDate | null;
};

/**
 * `GET /api/v1/employees/stats` — the dashboard KPI cards.
 *
 * CONTRACT: this endpoint may not exist. If the backend offers no aggregate,
 * the dashboard can derive the same numbers from a filtered list call — but
 * one small endpoint is far cheaper than four list requests.
 */
export type EmployeeCounts = {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
};
