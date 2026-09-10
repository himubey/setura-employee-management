"use client";

import {
  useAttendanceSummary,
  useOnLeaveCount,
} from "@/hooks/dashboard/use-dashboard-summary";
import { useEmployeeCounts } from "@/hooks/employees/use-employee-counts";

import { StatCard } from "./stat-card";

/**
 * The four KPI cards.
 *
 * Three independent queries, one per data source, so a card that cannot load
 * shows a dash while its neighbours still render. "Absent today" is derived
 * rather than fetched — see below.
 */
export function DashboardStats() {
  const counts = useEmployeeCounts();
  const attendance = useAttendanceSummary();
  const onLeave = useOnLeaveCount();

  /**
   * Absent = active staff who are neither present nor on leave.
   *
   * CONTRACT: derived here only because it needs three separate figures that
   * currently come from three endpoints. If Sakshi's attendance summary
   * already returns an authoritative `absent`, use that instead — the backend
   * knows about half-days and holidays and this arithmetic does not.
   */
  const absent =
    counts.data && attendance.data && onLeave.data !== undefined
      ? Math.max(
          0,
          counts.data.active - attendance.data.present - onLeave.data,
        )
      : undefined;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total employees"
        value={counts.data?.total}
        hint={counts.data ? `${counts.data.active} active` : undefined}
        tone="brand"
        loading={counts.isPending}
        error={counts.isError}
      />

      <StatCard
        label="Present today"
        value={attendance.data?.present}
        hint="Includes late arrivals"
        tone="success"
        loading={attendance.isPending}
        error={attendance.isError}
      />

      <StatCard
        label="Absent today"
        value={absent}
        hint="Active staff with no record"
        tone="warning"
        loading={counts.isPending || attendance.isPending || onLeave.isPending}
        error={counts.isError || attendance.isError || onLeave.isError}
      />

      <StatCard
        label="On leave"
        value={onLeave.data}
        hint="Approved leave covering today"
        loading={onLeave.isPending}
        error={onLeave.isError}
      />
    </div>
  );
}
