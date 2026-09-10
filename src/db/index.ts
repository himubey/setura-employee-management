import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getServerEnv } from "@/env";

import * as schema from "./schema";

/**
 * Database client.
 *
 * SERVER ONLY. Importing this module from a Client Component is a bug — it
 * reads DATABASE_URL. Keep it behind Server Components, Server Actions,
 * Route Handlers and the service layer.
 *
 * The client is created lazily so that `next build` and `npm run typecheck`
 * succeed on a machine with no DATABASE_URL. The connection is only opened
 * when a query actually runs.
 *
 * `neon-http` issues one HTTP request per query. That is the right trade for
 * a serverless deployment and for ~20 employees. If we later need real
 * transactions across multiple statements, swap this for `drizzle-orm/neon-serverless`
 * (WebSocket-based `Pool`) — the rest of the codebase does not change.
 */
export type Database = ReturnType<typeof createClient>;

function createClient() {
  const { DATABASE_URL } = getServerEnv();
  // No `casing` option: every column already declares its snake_case name
  // explicitly in the schema, which keeps the mapping visible at the table.
  return drizzle(neon(DATABASE_URL), { schema });
}

let client: Database | undefined;

function getClient(): Database {
  client ??= createClient();
  return client;
}

/**
 * Proxy so that `db.select()` reads naturally while the underlying client is
 * still built on first use rather than at import time.
 */
export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    return Reflect.get(getClient(), property, receiver);
  },
});

export { schema };
