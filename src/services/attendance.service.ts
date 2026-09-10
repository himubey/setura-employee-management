import { and, count, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { attendance } from "@/db/schema/attendance";
import {
  markAttendanceSchema,
  type MarkAttendanceInput,
} from "@/lib/validations/attendance";

/**
 * Attendance business logic. SERVER ONLY.
 *
 * Scope for the initial setup: the reads the dashboard needs, plus an
 * idempotent write. The attendance screen itself is a later phase.
 */

/** Today in `YYYY-MM-DD`, matching the PostgreSQL `date` column. */
export function todayIsoDate(reference: Date = new Date()): string {
  const year = reference.getFullYear();
  const month = String(reference.getMonth() + 1).padStart(2, "0");
  const day = String(reference.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type DailyAttendanceSummary = {
  date: string;
  present: number;
  absent: number;
  onLeave: number;
};

export async function getDailySummary(
  date: string = todayIsoDate(),
): Promise<DailyAttendanceSummary> {
  const rows = await db
    .select({ status: attendance.status, value: count() })
    .from(attendance)
    .where(eq(attendance.date, date))
    .groupBy(attendance.status);

  const byStatus = new Map(rows.map((row) => [row.status, row.value]));

  return {
    date,
    // Late and half-days still count as someone who showed up.
    present:
      (byStatus.get("PRESENT") ?? 0) +
      (byStatus.get("LATE") ?? 0) +
      (byStatus.get("HALF_DAY") ?? 0),
    absent: byStatus.get("ABSENT") ?? 0,
    onLeave: byStatus.get("ON_LEAVE") ?? 0,
  };
}

/**
 * Upsert on (employee_id, date) — re-marking the same day corrects the
 * existing row rather than creating a duplicate.
 */
export async function markAttendance(input: MarkAttendanceInput) {
  const data = markAttendanceSchema.parse(input);

  const rows = await db
    .insert(attendance)
    .values({
      employeeId: data.employeeId,
      date: data.date,
      status: data.status,
      checkInAt: data.checkInAt ?? null,
      checkOutAt: data.checkOutAt ?? null,
      note: data.note && data.note.length > 0 ? data.note : null,
    })
    .onConflictDoUpdate({
      target: [attendance.employeeId, attendance.date],
      set: {
        status: data.status,
        checkInAt: data.checkInAt ?? null,
        checkOutAt: data.checkOutAt ?? null,
        note: data.note && data.note.length > 0 ? data.note : null,
        updatedAt: new Date(),
      },
    })
    .returning();

  const saved = rows[0];
  if (!saved) throw new Error("Failed to save the attendance record.");
  return saved;
}

export async function listAttendanceForEmployee(
  employeeId: string,
  from: string,
  to: string,
) {
  return db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.employeeId, employeeId),
        gte(attendance.date, from),
        lte(attendance.date, to),
      ),
    )
    .orderBy(attendance.date);
}
