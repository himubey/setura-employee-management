import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { departments } from "./departments";
import { employeeStatus, employmentType } from "./enums";
import { user } from "./users";

/**
 * The HR record for a person.
 *
 * `userId` is nullable on purpose: HR can create an employee record before
 * that person has a login (or for someone who never gets one). It is unique
 * so a login maps to at most one employee.
 */
export const employees = pgTable(
  "employees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Human-facing identifier, e.g. "STR-001". */
    employeeCode: text("employee_code").notNull().unique(),
    userId: text("user_id")
      .unique()
      .references(() => user.id, { onDelete: "set null" }),

    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    workEmail: text("work_email").notNull().unique(),
    personalEmail: text("personal_email"),
    phone: text("phone"),

    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    position: text("position").notNull(),
    /** Self-reference: the employee this person reports to. */
    managerId: uuid("manager_id"),

    status: employeeStatus("status").notNull().default("ACTIVE"),
    employmentType: employmentType("employment_type")
      .notNull()
      .default("FULL_TIME"),

    joinedDate: date("joined_date").notNull(),
    exitDate: date("exit_date"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Employees are listed and filtered by department and status on the
    // main table screen, and sorted by join date.
    index("employees_department_id_idx").on(table.departmentId),
    index("employees_status_idx").on(table.status),
    index("employees_manager_id_idx").on(table.managerId),
    index("employees_joined_date_idx").on(table.joinedDate),
  ],
);

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
