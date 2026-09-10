import { z } from "zod";

export const leaveRequestStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD.");

export const createLeaveRequestSchema = z
  .object({
    employeeId: z.string().uuid(),
    leaveTypeId: z.string().uuid(),
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    reason: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "The end date must be on or after the start date.",
    path: ["endDate"],
  });

export const reviewLeaveRequestSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const leaveListQuerySchema = z.object({
  employeeId: z.string().uuid().optional(),
  status: leaveRequestStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
});

export type CreateLeaveRequestInput = z.input<typeof createLeaveRequestSchema>;
export type ReviewLeaveRequestInput = z.input<typeof reviewLeaveRequestSchema>;
export type LeaveListQuery = z.infer<typeof leaveListQuerySchema>;
export type LeaveRequestStatus = z.infer<typeof leaveRequestStatusSchema>;
