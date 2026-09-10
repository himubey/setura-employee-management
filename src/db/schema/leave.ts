import {
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { employees } from "./employees";
import { leaveRequestStatus } from "./enums";

/** Configurable categories: Annual, Sick, Unpaid, and so on. */
export const leaveTypes = pgTable("leave_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  /** Days granted per calendar year. 0 means uncapped/unpaid. */
  annualAllowanceDays: integer("annual_allowance_days").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const leaveRequests = pgTable(
  "leave_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    leaveTypeId: uuid("leave_type_id")
      .notNull()
      .references(() => leaveTypes.id, { onDelete: "restrict" }),

    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    /** Stored rather than derived so half-days remain representable. */
    totalDays: integer("total_days").notNull(),

    reason: text("reason"),
    status: leaveRequestStatus("status").notNull().default("PENDING"),

    reviewedBy: uuid("reviewed_by").references(() => employees.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("leave_requests_employee_id_idx").on(table.employeeId),
    index("leave_requests_status_idx").on(table.status),
    // "Who is on leave today" scans by date range.
    index("leave_requests_date_range_idx").on(table.startDate, table.endDate),
  ],
);

export type LeaveType = typeof leaveTypes.$inferSelect;
export type NewLeaveType = typeof leaveTypes.$inferInsert;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type NewLeaveRequest = typeof leaveRequests.$inferInsert;
