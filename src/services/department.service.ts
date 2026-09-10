import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { departments } from "@/db/schema/departments";

/** Department business logic. SERVER ONLY. */

export type DepartmentOption = {
  id: string;
  name: string;
};

/** Used to populate the department filter on the employees screen. */
export async function listDepartmentOptions(): Promise<DepartmentOption[]> {
  return db
    .select({ id: departments.id, name: departments.name })
    .from(departments)
    .orderBy(asc(departments.name));
}

export async function listDepartments() {
  return db.select().from(departments).orderBy(asc(departments.name));
}

export async function getDepartmentById(id: string) {
  const rows = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);
  return rows[0] ?? null;
}
