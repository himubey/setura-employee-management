import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/auth/auth";

/**
 * Better Auth mounts its whole HTTP surface here: sign-in, sign-out,
 * sign-up, session, and so on.
 *
 * The handler is built per request rather than at module scope. `next build`
 * imports every route handler while collecting page data, and building the
 * auth instance eagerly would read (and therefore require) DATABASE_URL and
 * BETTER_AUTH_SECRET at build time — which would break a clone that has no
 * `.env` yet.
 */
export async function GET(request: Request): Promise<Response> {
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request): Promise<Response> {
  return toNextJsHandler(getAuth()).POST(request);
}
