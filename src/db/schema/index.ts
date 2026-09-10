/**
 * The single entry point drizzle-kit reads (see drizzle.config.ts) and the
 * schema object passed to `drizzle()` in src/db/index.ts.
 *
 * This barrel exists because Drizzle genuinely needs one flat namespace of
 * every table and relation. It is not a convenience re-export — application
 * code should import from the specific domain file where that is clearer.
 */
export * from "./enums";
export * from "./users";
export * from "./departments";
export * from "./employees";
export * from "./attendance";
export * from "./leave";
export * from "./documents";
export * from "./audit-logs";
export * from "./relations";
