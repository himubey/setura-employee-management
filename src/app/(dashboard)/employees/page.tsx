import type { Metadata } from "next";

import { Button } from "@/components/base/button/button";
import { EmployeesTable } from "@/components/features/employees/employees-table";
import { requirePermission } from "@/lib/auth/session";
import { listDepartmentOptions } from "@/services/department.service";
import { listEmployees } from "@/services/employee.service";

export const metadata: Metadata = { title: "Employees" };

/**
 * Server Component.
 *
 * Loads the first page on the server (fast first paint, no spinner, no
 * client-side waterfall) and hands it to the table as initial data. Every
 * later view — search, filter, sort, page — is fetched by TanStack Query.
 */
export default async function EmployeesPage() {
  await requirePermission("employee:read_all");

  const [employees, departments] = await Promise.all([
    listEmployees({}),
    listDepartmentOptions(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Employees
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {employees.total} {employees.total === 1 ? "person" : "people"} on
            record
          </p>
        </div>

        {/* Creation is the next phase; the control anchors the layout. */}
        <Button disabled>Add employee</Button>
      </div>

      <EmployeesTable initialData={employees} departments={departments} />
    </div>
  );
}
