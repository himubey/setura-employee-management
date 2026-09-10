import type { EmployeeListQuery } from "@/lib/validations/employee";
import type { Paginated } from "@/types/api";
import type { AttendanceDailySummary } from "@/types/attendance";
import type { CurrentUser } from "@/types/auth";
import type { DepartmentOption } from "@/types/department";
import type { EmployeeCounts, EmployeeListItem } from "@/types/employee";

/**
 * TEMPORARY — delete this file in Phase 6.
 *
 * An in-memory stand-in for the FastAPI backend so the frontend can be run,
 * reviewed and built before the backend exists. It is reached only when
 * `NEXT_PUBLIC_USE_MOCK_API=true`; each feature module has exactly one line
 * that consults it, so removing this is a small, mechanical change.
 *
 * The data is deliberately static (no randomness, no Date.now() in the seed)
 * so two renders never disagree and a server/client hydration mismatch is
 * impossible.
 */

const DEPARTMENTS: DepartmentOption[] = [
  { id: "11111111-1111-4111-8111-000000000001", name: "Engineering" },
  { id: "11111111-1111-4111-8111-000000000002", name: "Human Resources" },
  { id: "11111111-1111-4111-8111-000000000003", name: "Finance" },
  { id: "11111111-1111-4111-8111-000000000004", name: "Sales" },
  { id: "11111111-1111-4111-8111-000000000005", name: "Operations" },
];

type Seed = readonly [
  first: string,
  last: string,
  position: string,
  departmentIndex: number,
  status: EmployeeListItem["status"],
  employmentType: EmployeeListItem["employmentType"],
  joinedDate: string,
];

const SEEDS: readonly Seed[] = [
  ["Asha", "Rao", "Engineering Manager", 0, "ACTIVE", "FULL_TIME", "2021-03-15"],
  ["Rohan", "Mehta", "Senior Backend Engineer", 0, "ACTIVE", "FULL_TIME", "2021-08-02"],
  ["Priya", "Nair", "Frontend Engineer", 0, "ACTIVE", "FULL_TIME", "2022-01-10"],
  ["Vikram", "Singh", "QA Engineer", 0, "ON_LEAVE", "FULL_TIME", "2022-05-23"],
  ["Neha", "Kulkarni", "DevOps Engineer", 0, "ACTIVE", "CONTRACT", "2023-02-06"],
  ["Arjun", "Pillai", "Junior Engineer", 0, "ACTIVE", "INTERN", "2024-07-01"],
  ["Meera", "Iyer", "HR Manager", 1, "ACTIVE", "FULL_TIME", "2020-11-09"],
  ["Sanjay", "Gupta", "Recruiter", 1, "ACTIVE", "FULL_TIME", "2023-04-17"],
  ["Divya", "Sharma", "HR Executive", 1, "ACTIVE", "PART_TIME", "2024-01-15"],
  ["Kabir", "Chopra", "Finance Controller", 2, "ACTIVE", "FULL_TIME", "2020-06-01"],
  ["Ananya", "Bose", "Accountant", 2, "ACTIVE", "FULL_TIME", "2022-09-12"],
  ["Farhan", "Qureshi", "Payroll Specialist", 2, "INACTIVE", "FULL_TIME", "2021-02-08"],
  ["Ritu", "Deshpande", "Sales Director", 3, "ACTIVE", "FULL_TIME", "2019-10-21"],
  ["Aditya", "Verma", "Account Executive", 3, "ACTIVE", "FULL_TIME", "2022-03-14"],
  ["Sneha", "Reddy", "Sales Development Rep", 3, "ON_LEAVE", "FULL_TIME", "2023-08-28"],
  ["Imran", "Sheikh", "Account Executive", 3, "ACTIVE", "CONTRACT", "2024-02-19"],
  ["Lakshmi", "Menon", "Operations Manager", 4, "ACTIVE", "FULL_TIME", "2020-01-13"],
  ["Tanvi", "Joshi", "Office Administrator", 4, "ACTIVE", "FULL_TIME", "2023-06-05"],
  ["Harsh", "Patel", "Facilities Coordinator", 4, "ACTIVE", "PART_TIME", "2024-04-22"],
  ["Zoya", "Khan", "Operations Analyst", 4, "ACTIVE", "FULL_TIME", "2024-09-30"],
];

const EMPLOYEES: EmployeeListItem[] = SEEDS.map((seed, index) => {
  const [first, last, position, departmentIndex, status, employmentType, joinedDate] =
    seed;
  const department = DEPARTMENTS[departmentIndex] ?? null;

  return {
    id: `22222222-2222-4222-8222-${String(index + 1).padStart(12, "0")}`,
    employeeCode: `STR-${String(index + 1).padStart(3, "0")}`,
    firstName: first,
    lastName: last,
    workEmail: `${first.toLowerCase()}.${last.toLowerCase()}@seturasolutions.com`,
    position,
    status,
    employmentType,
    joinedDate,
    departmentId: department?.id ?? null,
    departmentName: department?.name ?? null,
  };
});

const CURRENT_USER: CurrentUser = {
  id: "33333333-3333-4333-8333-000000000001",
  email: "meera.iyer@seturasolutions.com",
  name: "Meera Iyer",
  role: "HR_ADMIN",
  employeeId: EMPLOYEES[6]?.id ?? null,
};

/** Network latency, so loading states are visible while developing. */
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 150));
}

export function mockCurrentUser(): Promise<CurrentUser> {
  return delay(CURRENT_USER);
}

export function mockDepartmentOptions(): Promise<DepartmentOption[]> {
  return delay(DEPARTMENTS);
}

export function mockEmployeeCounts(): Promise<EmployeeCounts> {
  const counts = EMPLOYEES.reduce(
    (acc, employee) => {
      if (employee.status === "ACTIVE") acc.active += 1;
      else if (employee.status === "ON_LEAVE") acc.onLeave += 1;
      else acc.inactive += 1;
      return acc;
    },
    { total: EMPLOYEES.length, active: 0, inactive: 0, onLeave: 0 },
  );

  return delay(counts);
}

export function mockAttendanceSummary(date: string): Promise<AttendanceDailySummary> {
  const active = EMPLOYEES.filter((e) => e.status === "ACTIVE").length;
  return delay({ date, present: active - 2, late: 1, absent: 2 });
}

export function mockOnLeaveToday(): Promise<number> {
  return delay(EMPLOYEES.filter((employee) => employee.status === "ON_LEAVE").length);
}

/** Mirrors what the backend will do in SQL: filter, then sort, then page. */
export function mockListEmployees(
  query: Partial<EmployeeListQuery>,
): Promise<Paginated<EmployeeListItem>> {
  const {
    search = "",
    departmentId,
    status,
    page = 1,
    pageSize = 10,
    sortBy = "joinedDate",
    sortDir = "desc",
  } = query;

  const needle = search.trim().toLowerCase();

  const filtered = EMPLOYEES.filter((employee) => {
    if (departmentId && employee.departmentId !== departmentId) return false;
    if (status && employee.status !== status) return false;
    if (!needle) return true;

    return [
      `${employee.firstName} ${employee.lastName}`,
      employee.workEmail,
      employee.employeeCode,
      employee.position,
    ].some((field) => field.toLowerCase().includes(needle));
  });

  const direction = sortDir === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    const left = sortValue(a, sortBy);
    const right = sortValue(b, sortBy);
    return left.localeCompare(right) * direction;
  });

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Clamp: a filter can shrink the result set below the page the user is on.
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;

  return delay({
    rows: sorted.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    pageCount,
  });
}

function sortValue(
  employee: EmployeeListItem,
  sortBy: EmployeeListQuery["sortBy"],
): string {
  switch (sortBy) {
    case "name":
      return `${employee.firstName} ${employee.lastName}`;
    case "position":
      return employee.position;
    case "status":
      return employee.status;
    case "joinedDate":
      return employee.joinedDate;
  }
}
