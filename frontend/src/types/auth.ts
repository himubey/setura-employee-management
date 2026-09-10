import type { Role } from "@/lib/permissions/roles";

/**
 * PROVISIONAL — see the header of `src/types/api.ts`.
 */

/**
 * `GET /api/v1/auth/me`
 *
 * CONTRACT: field names and the role enum both need confirming. In
 * particular:
 *   - is the display name one `name` field, or `first_name`/`last_name`?
 *   - does the payload use snake_case (`employee_id`) rather than camelCase?
 *     If so we normalise once in `lib/api/auth.ts`, not in components.
 *   - are the four roles spelled exactly SUPER_ADMIN / HR_ADMIN / MANAGER /
 *     EMPLOYEE? `src/lib/permissions/roles.ts` is keyed on those strings.
 */
export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Null for an account with no employee record attached. */
  employeeId: string | null;
};

/**
 * `POST /api/v1/auth/login`
 *
 * CONTRACT: the biggest open question in the whole contract — how a session
 * is returned. This frontend assumes FastAPI sets an **HttpOnly cookie** and
 * the response body is just the user. If Sakshi returns a bearer token
 * instead, the client's `credentials: "include"` becomes an Authorization
 * header and the token must be held in memory, never localStorage.
 */
export type LoginResponse = CurrentUser;
