import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

/** Mirrors `emailAndPassword.minPasswordLength` in src/lib/auth/auth.ts. */
export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128, "That password is too long.");

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
