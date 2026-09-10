import type { Metadata } from "next";

import { EmployeesTable } from "@/components/features/employees/employees-table";

export const metadata: Metadata = { title: "Employees" };

/**
 * A Server Component. The heading is static; the table is the client island
 * that talks to the API.
 *
 * There is no permission guard here — the backend is the authority on who may
 * read the employee list, and it answers 403 if the caller may not. Adding a
 * second, weaker check in the browser would only be able to hide the UI.
 */
export default function EmployeesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Employees
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Search, filter and review everyone on record.
        </p>
      </div>

      <EmployeesTable />
    </div>
  );
}
