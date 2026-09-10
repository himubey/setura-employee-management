"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { DepartmentOption } from "@/services/department.service";
import type { EmployeeListItem } from "@/services/employee.service";
import type { Paginated } from "@/types";

import { employeeColumns } from "./employees-table-columns";

/**
 * The employees table.
 *
 * This is the one screen that genuinely needs a Client Component: search,
 * filtering, sorting and paging are interactive. It is seeded with data the
 * Server Component already fetched (`initialData`), so the first paint has
 * rows and no spinner — TanStack Query only takes over once the user
 * interacts.
 *
 * Sorting and paging are server-side (`manualSorting` / `manualPagination`):
 * the service does the work in SQL, so this scales past what fits in memory.
 */

type EmployeesResponse = Paginated<EmployeeListItem>;

export function EmployeesTable({
  initialData,
  departments,
}: {
  initialData: EmployeesResponse;
  departments: DepartmentOption[];
}) {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(initialData.page);
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
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      departmentId,
      status,
      page: String(page),
      pageSize: String(initialData.pageSize),
      sortBy: sort?.id ?? "joinedDate",
      sortDir: sort?.desc === false ? "asc" : "desc",
    }),
    [debouncedSearch, departmentId, status, page, initialData.pageSize, sort],
  );

  const isInitialView =
    debouncedSearch === "" &&
    departmentId === "" &&
    status === "" &&
    page === initialData.page &&
    sort?.id === "joinedDate" &&
    sort.desc === true;

  const { data, isFetching, isError } = useQuery({
    queryKey: ["employees", queryParams],
    queryFn: async (): Promise<EmployeesResponse> => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value) params.set(key, value);
      }

      const response = await fetch(`/api/employees?${params.toString()}`);
      if (!response.ok) throw new Error("Could not load employees.");
      return response.json() as Promise<EmployeesResponse>;
    },
    // Avoids a redundant request for the exact view already rendered.
    initialData: isInitialView ? initialData : undefined,
    placeholderData: keepPreviousData,
  });

  const result = data ?? initialData;

  const table = useReactTable({
    data: result.rows,
    columns: employeeColumns,
    state: { sorting },
    onSortingChange: changeSorting,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount: result.pageCount,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnCount = table.getAllLeafColumns().length;

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
          options={departments.map((department) => ({
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
          {isFetching && <Spinner size="sm" className="text-slate-400" />}
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
            {isError ? (
              <TableEmptyState
                colSpan={columnCount}
                title="Could not load employees"
                description="Check your connection and try again."
              />
            ) : result.rows.length === 0 ? (
              <TableEmptyState
                colSpan={columnCount}
                title="No employees found"
                description={
                  search || departmentId || status
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
          // The state, not `result.page`: with keepPreviousData the fetched
          // page lags a request behind, which would make Previous/Next
          // compute their targets from a stale number.
          page={page}
          pageCount={result.pageCount}
          total={result.total}
          pageSize={result.pageSize}
          onPageChange={setPage}
        />
      </div>
    </Card>
  );
}
