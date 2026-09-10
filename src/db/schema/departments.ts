import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * `managerId` points at an employee but is intentionally left without a
 * database-level FK: departments and employees reference each other, and a
 * circular FK would make both inserts impossible without a deferred
 * constraint. The link is enforced in the service layer instead.
 *
 * Relations for every table are declared in ./relations.ts so that schema
 * files never import one another (no module cycles).
 */
export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  description: text("description"),
  managerId: uuid("manager_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
