/**
 * Barrel for `src/types/`.
 *
 * Import from the specific module (`@/types/employee`) in feature code — it
 * makes the dependency obvious in review. This barrel exists for the handful
 * of places that genuinely need several domains at once.
 *
 * Every type re-exported here is PROVISIONAL until Sakshi publishes the
 * FastAPI contract; see the header of `./api.ts`.
 */
export type {
  ApiErrorBody,
  IsoDate,
  IsoDateTime,
  Paginated,
  SortDirection,
} from "./api";
export type { AttendanceDailySummary, AttendanceStatus } from "./attendance";
export type { CurrentUser, LoginResponse } from "./auth";
export type { Department, DepartmentOption } from "./department";
export type {
  EmployeeCounts,
  EmployeeDetail,
  EmployeeListItem,
} from "./employee";
export type { LeaveRequestStatus, OnLeaveCount } from "./leave";
