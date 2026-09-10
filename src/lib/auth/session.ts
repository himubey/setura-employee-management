import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth } from "./auth";
import { DEFAULT_ROLE, isRole, type Role } from "@/lib/permissions/roles";
import type { Permission } from "@/lib/permissions/permissions";
import { authorize } from "@/lib/permissions/authorize";

/**
 * Session helpers for Server Components, Server Actions and Route Handlers.
 * SERVER ONLY.
 *
 * These are the only places the rest of the app should read the session from,
 * so that role normalisation happens exactly once.
 */

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

/** Returns the signed-in user, or null. Never throws on a missing session. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const { id, name, email, image } = session.user;
  const rawRole = (session.user as { role?: unknown }).role;

  return {
    id,
    name,
    email,
    image: image ?? null,
    role: isRole(rawRole) ? rawRole : DEFAULT_ROLE,
  };
}

/**
 * For pages and actions that require a login. Redirects to /login instead of
 * throwing, which is what a page wants.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Requires a login AND a specific permission. Throws ForbiddenError if not. */
export async function requirePermission(
  permission: Permission,
): Promise<CurrentUser> {
  const user = await requireUser();
  authorize(user.role, permission);
  return user;
}
