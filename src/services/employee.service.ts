import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";

import { db } from "@/db";
import { departments } from "@/db/schema/departments";
import { employees } from "@/db/schema/employees";
import {
  createEmployeeSchema,
  employeeListQuerySchema,
  updateEmployeeSchema,
  type CreateEmployeeInput,
  type EmployeeListQuery,
  type UpdateEmployeeInput,
} from "@/lib/validations/employee";
import type { Paginated } from "@/types";

/**
 * Employee business logic. SERVER ONLY.
 *
 * Every public function re-parses its input with the Zod schema, so a
 * Route Handler, a Server Action and a seed script all get the same
 * guarantees without repeating validation.
 *
 * Queries stay in this file (the layer that owns the tables) rather than
 * leaking into page components.
 */

/** The row shape the employees table screen renders. */
export type EmployeeListItem = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  position: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  joinedDate: string;
  departmentId: string | null;
  departmentName: string | null;
};

export async function listEmployees(
  rawQuery: Partial<EmployeeListQuery> | Record<string, unknown>,
): Promise<Paginated<EmployeeListItem>> {
  const query = employeeListQuerySchema.parse(rawQuery);

  const filters: SQL[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    const match = or(
      ilike(employees.firstName, pattern),
      ilike(employees.lastName, pattern),
      ilike(employees.workEmail, pattern),
      ilike(employees.employeeCode, pattern),
      ilike(employees.position, pattern),
    );
    if (match) filters.push(match);
  }

  if (query.departmentId) {
    filters.push(eq(employees.departmentId, query.departmentId));
  }

  if (query.status) {
    filters.push(eq(employees.status, query.status));
  }

  const where = filters.length > 0 ? and(...filters) : undefined;

  const direction = query.sortDir === "asc" ? asc : desc;
  // "name" sorts on last name then first name, so the order matches how the
  // column reads rather than grouping every "Aarav" together.
  const sortColumns = {
    name: [employees.lastName, employees.firstName],
    position: [employees.position],
    status: [employees.status],
    joinedDate: [employees.joinedDate],
  }[query.sortBy];

  const offset = (query.page - 1) * query.pageSize;

  const [rows, totals] = await Promise.all([
    db
      .select({
        id: employees.id,
        employeeCode: employees.employeeCode,
        firstName: employees.firstName,
        lastName: employees.lastName,
        workEmail: employees.workEmail,
        position: employees.position,
        status: employees.status,
        joinedDate: employees.joinedDate,
        departmentId: employees.departmentId,
        departmentName: departments.name,
      })
      .from(employees)
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .where(where)
      .orderBy(...sortColumns.map((column) => direction(column)))
      .limit(query.pageSize)
      .offset(offset),
    db.select({ value: count() }).from(employees).where(where),
  ]);

  const total = totals[0]?.value ?? 0;

  return {
    rows,
    total,
    page: query.page,
    pageSize: query.pageSize,
    pageCount: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function getEmployeeById(id: string) {
  const rows = await db
    .select()
    .from(employees)
    .where(eq(employees.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createEmployee(input: CreateEmployeeInput) {
  const data = createEmployeeSchema.parse(input);

  const rows = await db
    .insert(employees)
    .values({
      ...data,
      personalEmail: emptyToNull(data.personalEmail),
      phone: emptyToNull(data.phone),
      departmentId: data.departmentId ?? null,
      managerId: data.managerId ?? null,
      exitDate: data.exitDate ?? null,
    })
    .returning();

  const created = rows[0];
  if (!created) throw new Error("Failed to create the employee record.");
  return created;
}

export async function updateEmployee(input: UpdateEmployeeInput) {
  const { id, ...data } = updateEmployeeSchema.parse(input);

  const rows = await db
    .update(employees)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employees.id, id))
    .returning();

  return rows[0] ?? null;
}

/** Counts backing the dashboard cards. One round trip per metric is fine at this size. */
export async function countEmployeesByStatus(): Promise<{
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
}> {
  const rows = await db
    .select({ status: employees.status, value: count() })
    .from(employees)
    .groupBy(employees.status);

  const byStatus = new Map(rows.map((row) => [row.status, row.value]));

  const active = byStatus.get("ACTIVE") ?? 0;
  const onLeave = byStatus.get("ON_LEAVE") ?? 0;
  const inactive = byStatus.get("INACTIVE") ?? 0;

  return { total: active + onLeave + inactive, active, onLeave, inactive };
}

function emptyToNull(value: string | undefined): string | null {
  return value && value.length > 0 ? value : null;
}
