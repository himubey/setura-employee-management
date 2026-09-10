import { z } from "zod";

/**
 * Employee validation. These schemas are the contract between the UI, the
 * Route Handlers and the service layer — the service re-parses its input so
 * that a caller bypassing the form cannot slip past validation.
 */

export const employeeStatusSchema = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]);

export const employmentTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
]);

/** `YYYY-MM-DD`, matching the PostgreSQL `date` columns. */
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD.");

/**
 * The plain object shape, kept separate from the refined schema below.
 * `.refine()` produces a ZodEffects, which cannot be `.partial()`-ed or
 * `.extend()`-ed — deriving the update schema from this base avoids that.
 */
const employeeFields = z
  .object({
    employeeCode: z
      .string()
      .trim()
      .min(2, "Employee code is required.")
      .max(32)
      .regex(/^[A-Za-z0-9\-_]+$/, "Use letters, numbers, hyphens only."),
    firstName: z.string().trim().min(1, "First name is required.").max(80),
    lastName: z.string().trim().min(1, "Last name is required.").max(80),
    workEmail: z.string().trim().toLowerCase().email("Enter a valid email."),
    personalEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email.")
      .optional()
      .or(z.literal("")),
    phone: z.string().trim().max(32).optional().or(z.literal("")),

    departmentId: z.string().uuid().nullable().optional(),
    position: z.string().trim().min(1, "Position is required.").max(120),
    managerId: z.string().uuid().nullable().optional(),

    status: employeeStatusSchema.default("ACTIVE"),
    employmentType: employmentTypeSchema.default("FULL_TIME"),

    joinedDate: isoDateSchema,
    exitDate: isoDateSchema.nullable().optional(),
  });

/** An exit date before the join date is the one cross-field rule worth having. */
export const createEmployeeSchema = employeeFields.refine(
  (value) => !value.exitDate || value.exitDate >= value.joinedDate,
  { message: "Exit date cannot be before the join date.", path: ["exitDate"] },
);

export const updateEmployeeSchema = employeeFields
  .partial()
  .extend({ id: z.string().uuid() });

/** Query parameters for the employees table: search, filter, paginate, sort. */
export const employeeListQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(""),
  departmentId: z.string().uuid().optional(),
  status: employeeStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(10),
  sortBy: z
    .enum(["name", "position", "status", "joinedDate"])
    .default("joinedDate"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * `z.input` (not `z.infer`) for the write types: a caller supplies the shape
 * BEFORE defaults are applied, so `status` and `employmentType` stay optional
 * at the call site. `z.infer` is the right type for a parsed *result*.
 */
export type CreateEmployeeInput = z.input<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.input<typeof updateEmployeeSchema>;
export type CreateEmployeeData = z.infer<typeof createEmployeeSchema>;
export type EmployeeListQuery = z.infer<typeof employeeListQuerySchema>;
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
