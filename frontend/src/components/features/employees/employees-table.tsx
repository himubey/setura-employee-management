"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Card } from "@/components/base/card/card";
import { Input } from "@/components/base/input/input";
import { Pagination } from "@/components/base/pagination/pagination";
import { Select } from "@/components/base/select/select";
import { Spinner } from "@/components/base/spinner/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmptyState,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/base/table/table";
import { useDepartmentOptions } from "@/hooks/departments/use-department-options";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useEmployees } from "@/hooks/employees/use-employees";
import type { EmployeeListQuery } from "@/lib/validations/employee";

import { employeeColumns } from "./employees-table-columns";

const PAGE_SIZE = 10;

/**
 * The employees table.
 *
 * Search, filtering, sorting and paging are all interactive, so this is a
 * Client Component. Sorting and paging are server-side
 * (`manualSorting` / `manualPagination`): the backend does the work, so this
 * scales past what fits in memory.
 *
 * The component holds only view state — the query string. Everything about
 * fetching lives in `useEmployees`, and everything about the wire format
 * lives in `lib/api/employees.ts`, so a change to the API contract does not
 * reach this file.
 */
export function EmployeesTable() {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "joinedDate", desc: true },
  ]);

  const debouncedSearch = useDebouncedValue(search, 300);

  /**
   * Any change to a filter invalidates the current page number. This is done
   * in the same event that changes the filter — not in an effect — because an
   * effect runs after the render that already issued a request with the new
   * filter and the old page, costing a wasted round trip every keystroke.
   */
  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeDepartment(value: string) {
    setDepartmentId(value);
    setPage(1);
  }

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  function changeSorting(updater: Updater<SortingState>) {
    setSorting((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );
    setPage(1);
  }

  const sort = sorting[0];
  const query = useMemo<Partial<EmployeeListQuery>>(
    () => ({
      search: debouncedSearch,
      ...(departmentId ? { departmentId } : {}),
      ...(status ? { status: status as EmployeeListQuery["status"] } : {}),
      page,
      pageSize: PAGE_SIZE,
      sortBy: (sort?.id ?? "joinedDate") as EmployeeListQuery["sortBy"],
      sortDir: sort?.desc === false ? "asc" : "desc",
    }),
    [debouncedSearch, departmentId, status, page, sort],
  );

  const { data, isPending, isFetching, isError } = useEmployees(query);
  const departments = useDepartmentOptions();

  const rows = data?.rows ?? [];

  const table = useReactTable({
    data: rows,
    columns: employeeColumns,
    state: { sorting },
    onSortingChange: changeSorting,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount: data?.pageCount ?? 0,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnCount = table.getAllLeafColumns().length;
  const hasFilters = Boolean(search || departmentId || status);

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-end">
        <Input
          label="Search"
          placeholder="Name, email, code or position"
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
          containerClassName="sm:max-w-xs sm:flex-1"
          leadingIcon={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          }
        />

        <Select
          label="Department"
          placeholder="All departments"
          value={departmentId}
          onChange={(event) => changeDepartment(event.target.value)}
          // Empty until the options land; the control stays usable throughout.
          options={(departments.data ?? []).map((department) => ({
            value: department.id,
            label: department.name,
          }))}
          containerClassName="sm:w-48"
        />

        <Select
          label="Status"
          placeholder="All statuses"
          value={status}
          onChange={(event) => changeStatus(event.target.value)}
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "ON_LEAVE", label: "On leave" },
            { value: "INACTIVE", label: "Inactive" },
          ]}
          containerClassName="sm:w-40"
        />

        <div className="hidden h-9 items-center sm:flex">
          {/* isFetching, not isPending: this is the background-refresh hint
              shown while previous rows remain on screen. */}
          {isFetching && !isPending && (
            <Spinner size="sm" className="text-slate-400" />
          )}
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column;
                  return (
                    <TableHeaderCell
                      key={header.id}
                      sortDirection={column.getIsSorted()}
                      onSort={
                        column.getCanSort()
                          ? () => column.toggleSorting()
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHeaderCell>
                  );
                })}
              </tr>
            ))}
          </TableHead>

          <TableBody>
            {isPending ? (
              <TableEmptyState
                colSpan={columnCount}
                title="Loading employees…"
                description="Fetching the first page."
              />
            ) : isError ? (
              <TableEmptyState
                colSpan={columnCount}
                title="Could not load employees"
                description="The request failed. Check that the API is running and try again."
              />
            ) : rows.length === 0 ? (
              <TableEmptyState
                colSpan={columnCount}
                title="No employees found"
                description={
                  hasFilters
                    ? "No one matches these filters. Try clearing them."
                    : "Add your first employee to get started."
                }
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="border-t border-slate-200">
        <Pagination
          // The state, not `data.page`: with keepPreviousData the fetched page
          // lags a request behind, which would make Previous/Next compute
          // their targets from a stale number.
          page={page}
          pageCount={data?.pageCount ?? 1}
          total={data?.total ?? 0}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </Card>
  );
}
