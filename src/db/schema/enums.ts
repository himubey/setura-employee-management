import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Shared enums live in one file so that a value is declared exactly once and
 * every domain schema referencing it stays in sync. Drizzle emits each
 * `pgEnum` as a real PostgreSQL enum type, so adding a value later is a
 * migration, not a silent change.
 */

export const userRole = pgEnum("user_role", [
  "SUPER_ADMIN",
  "HR_ADMIN",
  "MANAGER",
  "EMPLOYEE",
]);

export const employeeStatus = pgEnum("employee_status", [
  "ACTIVE",
  "INACTIVE",
  "ON_LEAVE",
]);

export const employmentType = pgEnum("employment_type", [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
]);

export const attendanceStatus = pgEnum("attendance_status", [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "ON_LEAVE",
  "HOLIDAY",
]);

export const leaveRequestStatus = pgEnum("leave_request_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);
