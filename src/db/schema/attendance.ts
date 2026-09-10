import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { employees } from "./employees";
import { attendanceStatus } from "./enums";

/**
 * One row per employee per day. The unique constraint is what makes
 * "mark attendance" safely idempotent — an upsert on (employee_id, date).
 */
export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),

    date: date("date").notNull(),
    status: attendanceStatus("status").notNull().default("PRESENT"),

    checkInAt: timestamp("check_in_at", { withTimezone: true }),
    checkOutAt: timestamp("check_out_at", { withTimezone: true }),
    note: text("note"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("attendance_employee_date_unique").on(table.employeeId, table.date),
    // Dashboard counts are "everyone, for today" — date leads the index.
    index("attendance_date_idx").on(table.date),
    index("attendance_employee_id_idx").on(table.employeeId),
  ],
);

/**
 * Company-wide non-working days. Kept separate from attendance so that a
 * holiday does not need a row per employee.
 */
export const holidays = pgTable(
  "holidays",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    date: date("date").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("holidays_date_idx").on(table.date)],
);

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type Holiday = typeof holidays.$inferSelect;
export type NewHoliday = typeof holidays.$inferInsert;
