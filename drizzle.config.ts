import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit runs outside Next.js, so `.env` is not loaded for us.
 * `process.loadEnvFile` (Node >= 20.12) does it with no extra dependency.
 * Missing file is not an error — `db:*` scripts simply fail later with a
 * clear message, and the rest of the project stays usable without a database.
 */
try {
  process.loadEnvFile(".env");
} catch {
  // .env is absent — DATABASE_URL may still come from the shell.
}

/**
 * drizzle-kit reads this file for `db:generate`, `db:migrate`, `db:push`
 * and `db:studio`.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
