import { z } from "zod";

/**
 * Server-side environment validation.
 *
 * This module must never be imported from a Client Component — it reads
 * secrets. Importing it in a `"use client"` module will fail the build,
 * which is the intended safety net.
 *
 * Values are validated lazily so that `next build` and `npm run typecheck`
 * succeed without a populated `.env` (Phase 3 requirement: the project
 * structure must not depend on a live database).
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
});

const storageEnvSchema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type StorageEnv = z.infer<typeof storageEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;

/** Throws a readable error if required server variables are missing. */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid server environment configuration:\n${issues}\n\n` +
        "Copy .env.example to .env and fill in the missing values.",
    );
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

/** Storage config is optional until file uploads are switched on. */
export function getStorageEnv(): StorageEnv | null {
  const parsed = storageEnvSchema.safeParse(process.env);
  return parsed.success ? parsed.data : null;
}
