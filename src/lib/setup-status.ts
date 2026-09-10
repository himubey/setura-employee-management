/**
 * SERVER ONLY.
 *
 * Lets the app boot and render something useful before a database exists.
 * Without this, `next dev` on a fresh clone crashes on the first page load,
 * which makes the project impossible to explore.
 *
 * This is NOT an auth bypass: when the app IS configured, the normal session
 * check runs and an unauthenticated visitor is redirected to /login. The
 * unconfigured branch renders a setup screen and no application data.
 */
export function isAppConfigured(): boolean {
  return (
    Boolean(process.env.DATABASE_URL) && Boolean(process.env.BETTER_AUTH_SECRET)
  );
}

/** Names the variables that are still missing, for the setup screen. */
export function missingRequiredEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.BETTER_AUTH_SECRET) missing.push("BETTER_AUTH_SECRET");
  return missing;
}
