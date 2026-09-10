import { differenceInCalendarDays, parseISO } from "date-fns";
import { and, count, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { leaveRequests, leaveTypes } from "@/db/schema/leave";
import {
  createLeaveRequestSchema,
  reviewLeaveRequestSchema,
  type CreateLeaveRequestInput,
  type ReviewLeaveRequestInput,
} from "@/lib/validations/leave";

import { todayIsoDate } from "./attendance.service";

/**
 * Leave business logic. SERVER ONLY.
 *
 * Balance accrual and carry-over are intentionally not implemented yet —
 * `leave_types.annualAllowanceDays` exists so that logic has somewhere to
 * live when the requirement is real.
 */

export async function listLeaveTypes() {
  return db.select().from(leaveTypes).orderBy(leaveTypes.name);
}

/** Inclusive day count: a single-day request is 1, not 0. */
export function calculateTotalDays(startDate: string, endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1;
}

export async function createLeaveRequest(input: CreateLeaveRequestInput) {
  const data = createLeaveRequestSchema.parse(input);

  const rows = await db
    .insert(leaveRequests)
    .values({
      employeeId: data.employeeId,
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: calculateTotalDays(data.startDate, data.endDate),
      reason: data.reason && data.reason.length > 0 ? data.reason : null,
      status: "PENDING",
    })
    .returning();

  const created = rows[0];
  if (!created) throw new Error("Failed to create the leave request.");
  return created;
}

/**
 * Approve or reject. `reviewerEmployeeId` is passed in rather than read from
 * the session here, so the service stays independent of the request context
 * and remains callable from a script or a test.
 */
export async function reviewLeaveRequest(
  input: ReviewLeaveRequestInput,
  reviewerEmployeeId: string,
) {
  const data = reviewLeaveRequestSchema.parse(input);

  const rows = await db
    .update(leaveRequests)
    .set({
      status: data.status,
      reviewedBy: reviewerEmployeeId,
      reviewedAt: new Date(),
      reviewNote:
        data.reviewNote && data.reviewNote.length > 0 ? data.reviewNote : null,
      updatedAt: new Date(),
    })
    .where(eq(leaveRequests.id, data.id))
    .returning();

  return rows[0] ?? null;
}

/** Backs the "On leave" dashboard card. */
export async function countOnLeaveToday(
  date: string = todayIsoDate(),
): Promise<number> {
  const rows = await db
    .select({ value: count() })
    .from(leaveRequests)
    .where(
      and(
        eq(leaveRequests.status, "APPROVED"),
        lte(leaveRequests.startDate, date),
        gte(leaveRequests.endDate, date),
      ),
    );

  return rows[0]?.value ?? 0;
}

export async function countPendingRequests(): Promise<number> {
  const rows = await db
    .select({ value: count() })
    .from(leaveRequests)
    .where(eq(leaveRequests.status, "PENDING"));

  return rows[0]?.value ?? 0;
}
