import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db, schema } from "@/db";
import { getServerEnv } from "@/env";
import { DEFAULT_ROLE } from "@/lib/permissions/roles";

/**
 * Better Auth server instance. SERVER ONLY.
 *
 * Email + password with an HTTP-only session cookie. No custom JWT: Better
 * Auth's cookie sessions are the secure default and there is no requirement
 * here (no third-party API consumer, no mobile client) that would justify
 * hand-rolling token handling.
 *
 * Created lazily so `next build` works without a populated `.env`.
 */
function createAuth() {
  const env = getServerEnv();

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      // Enable once email infrastructure exists (explicitly out of scope
      // for this setup — see section 21 of the brief).
      requireEmailVerification: false,
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: DEFAULT_ROLE,
          // Never let a client set its own role during sign-up. The value is
          // constrained by the `user_role` PostgreSQL enum on the way in, and
          // re-checked with `isRole()` on the way out (see session.ts).
          input: false,
        },
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // refresh the cookie once a day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },

    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
    },

    // Must stay last: lets Server Actions set the session cookie.
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

let instance: Auth | undefined;

export function getAuth(): Auth {
  instance ??= createAuth();
  return instance;
}

export const auth = new Proxy({} as Auth, {
  get(_target, property, receiver) {
    return Reflect.get(getAuth(), property, receiver);
  },
});
