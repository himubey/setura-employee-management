import type { Metadata } from "next";
import { format } from "date-fns";

import { StatCard } from "@/components/features/dashboard/stat-card";
import { requireUser } from "@/lib/auth/session";
import { getDailySummary, todayIsoDate } from "@/services/attendance.service";
import { countEmployeesByStatus } from "@/services/employee.service";
import { countOnLeaveToday } from "@/services/leave.service";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Server Component. Reads through the service layer — no Drizzle query and
 * no business logic in the page itself, and no TanStack Query, because
 * nothing on this screen is interactive.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  const today = todayIsoDate();

  const [employeeCounts, attendanceSummary, onLeave] = await Promise.all([
    countEmployeesByStatus(),
    getDailySummary(today),
    countOnLeaveToday(today),
  ]);

  const firstName = user.name.split(" ")[0] ?? user.name;
  const absent = Math.max(
    0,
    employeeCounts.active - attendanceSummary.present - onLeave,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Good day, {firstName}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total employees"
          value={employeeCounts.total}
          hint={`${employeeCounts.active} active`}
          tone="brand"
        />
        <StatCard
          label="Present today"
          value={attendanceSummary.present}
          hint="Includes late and half-days"
          tone="success"
        />
        <StatCard
          label="Absent today"
          value={absent}
          hint="Active staff with no record"
          tone="warning"
        />
        <StatCard
          label="On leave"
          value={onLeave}
          hint="Approved leave covering today"
        />
      </div>
    </div>
  );
}
