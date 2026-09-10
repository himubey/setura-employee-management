import { z } from "zod";

export const attendanceStatusSchema = z.enum([
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "ON_LEAVE",
  "HOLIDAY",
]);

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD.");

export const markAttendanceSchema = z
  .object({
    employeeId: z.string().uuid(),
    date: isoDateSchema,
    status: attendanceStatusSchema.default("PRESENT"),
    checkInAt: z.coerce.date().nullable().optional(),
    checkOutAt: z.coerce.date().nullable().optional(),
    note: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine(
    (value) =>
      !value.checkInAt || !value.checkOutAt || value.checkOutAt >= value.checkInAt,
    { message: "Check-out cannot be before check-in.", path: ["checkOutAt"] },
  );

export const attendanceListQuerySchema = z.object({
  employeeId: z.string().uuid().optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
  status: attendanceStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
});

export type MarkAttendanceInput = z.input<typeof markAttendanceSchema>;
export type AttendanceListQuery = z.infer<typeof attendanceListQuerySchema>;
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
