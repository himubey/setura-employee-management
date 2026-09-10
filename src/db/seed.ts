/**
 * Development seed data: 5 departments, 4 leave types and 20 employees.
 *
 * Run with `npm run db:seed` after `npm run db:push`.
 *
 * Deliberately additive and idempotent — it inserts nothing that already
 * exists and never truncates a table, so it cannot destroy real data if it
 * is pointed at the wrong database by mistake.
 *
 * It does NOT create login accounts: passwords must be hashed by Better Auth,
 * so users are created through the sign-up flow, not by writing rows here.
 */
import { subDays, subMonths } from "date-fns";

import { db } from "./index";
import { departments } from "./schema/departments";
import { employees } from "./schema/employees";
import { leaveTypes } from "./schema/leave";

// The Drizzle client is lazy, so loading .env here — after the imports but
// before any query — is early enough. A missing file is not fatal: the
// variables may come from the shell, and env.ts produces a better message.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env — fall through to whatever the shell provides.
}

type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

const DEPARTMENTS = [
  { name: "Engineering", code: "ENG" },
  { name: "Human Resources", code: "HR" },
  { name: "Sales", code: "SLS" },
  { name: "Finance", code: "FIN" },
  { name: "Operations", code: "OPS" },
];

const LEAVE_TYPES = [
  { name: "Annual Leave", code: "ANNUAL", annualAllowanceDays: 24 },
  { name: "Sick Leave", code: "SICK", annualAllowanceDays: 12 },
  { name: "Casual Leave", code: "CASUAL", annualAllowanceDays: 6 },
  { name: "Unpaid Leave", code: "UNPAID", annualAllowanceDays: 0 },
];

const PEOPLE: Array<{
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  monthsAgo: number;
}> = [
  { firstName: "Aarav", lastName: "Sharma", position: "Engineering Manager", department: "ENG", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 41 },
  { firstName: "Diya", lastName: "Patel", position: "Senior Backend Engineer", department: "ENG", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 33 },
  { firstName: "Rohan", lastName: "Mehta", position: "Frontend Engineer", department: "ENG", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 22 },
  { firstName: "Ishita", lastName: "Nair", position: "QA Engineer", department: "ENG", status: "ON_LEAVE", employmentType: "FULL_TIME", monthsAgo: 18 },
  { firstName: "Kabir", lastName: "Singh", position: "DevOps Engineer", department: "ENG", status: "ACTIVE", employmentType: "CONTRACT", monthsAgo: 9 },
  { firstName: "Ananya", lastName: "Rao", position: "Junior Engineer", department: "ENG", status: "ACTIVE", employmentType: "INTERN", monthsAgo: 3 },
  { firstName: "Meera", lastName: "Iyer", position: "Head of People", department: "HR", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 47 },
  { firstName: "Vikram", lastName: "Desai", position: "HR Executive", department: "HR", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 14 },
  { firstName: "Nisha", lastName: "Kulkarni", position: "Recruiter", department: "HR", status: "ACTIVE", employmentType: "PART_TIME", monthsAgo: 6 },
  { firstName: "Arjun", lastName: "Reddy", position: "Sales Director", department: "SLS", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 38 },
  { firstName: "Priya", lastName: "Menon", position: "Account Executive", department: "SLS", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 20 },
  { firstName: "Sameer", lastName: "Joshi", position: "Account Executive", department: "SLS", status: "ON_LEAVE", employmentType: "FULL_TIME", monthsAgo: 16 },
  { firstName: "Tara", lastName: "Bhatt", position: "Sales Development Rep", department: "SLS", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 7 },
  { firstName: "Neel", lastName: "Chopra", position: "Sales Development Rep", department: "SLS", status: "INACTIVE", employmentType: "CONTRACT", monthsAgo: 26 },
  { firstName: "Riya", lastName: "Kapoor", position: "Finance Manager", department: "FIN", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 29 },
  { firstName: "Aditya", lastName: "Verma", position: "Accountant", department: "FIN", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 12 },
  { firstName: "Sana", lastName: "Qureshi", position: "Payroll Analyst", department: "FIN", status: "ACTIVE", employmentType: "PART_TIME", monthsAgo: 5 },
  { firstName: "Manav", lastName: "Gupta", position: "Operations Lead", department: "OPS", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 35 },
  { firstName: "Lakshmi", lastName: "Pillai", position: "Office Manager", department: "OPS", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 24 },
  { firstName: "Zoya", lastName: "Khan", position: "Operations Associate", department: "OPS", status: "ACTIVE", employmentType: "FULL_TIME", monthsAgo: 2 },
];

function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function main(): Promise<void> {
  console.log("Seeding Setura development data…");

  const insertedDepartments = await db
    .insert(departments)
    .values(DEPARTMENTS)
    .onConflictDoNothing()
    .returning({ id: departments.id, code: departments.code });

  // onConflictDoNothing returns only new rows, so read back the full set.
  const allDepartments = insertedDepartments.length === DEPARTMENTS.length
    ? insertedDepartments
    : await db
        .select({ id: departments.id, code: departments.code })
        .from(departments);

  const departmentIdByCode = new Map(
    allDepartments.map((row) => [row.code, row.id]),
  );
  console.log(`  departments: ${departmentIdByCode.size}`);

  await db.insert(leaveTypes).values(LEAVE_TYPES).onConflictDoNothing();
  console.log(`  leave types: ${LEAVE_TYPES.length}`);

  const employeeRows = PEOPLE.map((person, index) => {
    // Offset each person by a few days so join dates are not all identical.
    const joined = subDays(subMonths(new Date(), person.monthsAgo), index);
    return {
      employeeCode: `STR-${String(index + 1).padStart(3, "0")}`,
      firstName: person.firstName,
      lastName: person.lastName,
      workEmail: `${person.firstName.toLowerCase()}.${person.lastName.toLowerCase()}@seturasolutions.com`,
      position: person.position,
      departmentId: departmentIdByCode.get(person.department) ?? null,
      status: person.status,
      employmentType: person.employmentType,
      joinedDate: isoDate(joined),
    };
  });

  const inserted = await db
    .insert(employees)
    .values(employeeRows)
    .onConflictDoNothing()
    .returning({ id: employees.id });

  console.log(`  employees: ${inserted.length} new`);
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
