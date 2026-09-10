"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/components/base/button/button";
import type { EmployeeListItem } from "@/services/employee.service";
import { formatDate, initials } from "@/utils/format";

import { EmployeeStatusBadge } from "./employee-status-badge";

/**
 * TanStack Table column definitions.
 *
 * Kept apart from the table component so the columns are readable on their
 * own and can be reused by an export or a compact variant later. Cells render
 * Setura Base UI — TanStack contributes logic, never markup.
 */
const columnHelper = createColumnHelper<EmployeeListItem>();

export const employeeColumns = [
  columnHelper.accessor(
    (row) => `${row.firstName} ${row.lastName}`,
    {
      id: "name",
      header: "Employee",
      enableSorting: true,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
            >
              {initials(info.getValue())}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">
                {info.getValue()}
              </p>
              <p className="truncate text-xs text-slate-500">{row.workEmail}</p>
            </div>
          </div>
        );
      },
    },
  ),

  columnHelper.accessor("departmentName", {
    header: "Department",
    enableSorting: false,
    cell: (info) => info.getValue() ?? <span className="text-slate-400">—</span>,
  }),

  columnHelper.accessor("position", {
    header: "Position",
    enableSorting: true,
  }),

  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: true,
    cell: (info) => <EmployeeStatusBadge status={info.getValue()} />,
  }),

  columnHelper.accessor("joinedDate", {
    header: "Joined",
    enableSorting: true,
    cell: (info) => (
      <span className="whitespace-nowrap">{formatDate(info.getValue())}</span>
    ),
  }),

  columnHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          // The detail screen is a later phase; the control is here so the
          // column and its layout are settled.
          disabled
          aria-label={`View ${info.row.original.firstName} ${info.row.original.lastName}`}
        >
          View
        </Button>
      </div>
    ),
  }),
];
