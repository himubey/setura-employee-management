import type { Permission } from "./permissions";
import { hasPermission } from "./permissions";
import type { Role } from "./roles";

/**
 * Thrown when an authenticated user lacks a permission. Route Handlers and
 * Server Actions map this to a 403; the error message is safe to show.
 */
export class ForbiddenError extends Error {
  readonly permission: Permission;

  constructor(permission: Permission) {
    super(`Not allowed to perform "${permission}".`);
    this.name = "ForbiddenError";
    this.permission = permission;
  }
}

/** Thrown when there is no session at all. Maps to a 401 / redirect to login. */
export class UnauthorizedError extends Error {
  constructor(message = "You must be signed in.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Guard for the service layer. Throws rather than returning a boolean so a
 * forgotten check is a crash, not a silent data leak.
 */
export function authorize(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError(permission);
  }
}

/**
 * Row-level rule for employee records, kept here so the policy lives in one
 * place rather than being re-derived in each service.
 *
 * - HR admins and above see everyone.
 * - Managers see everyone (the MVP org is ~20 people and managers already
 *   need the directory). Narrow this to direct reports when the org grows.
 * - An employee sees only their own record.
 */
export function canAccessEmployee(
  role: Role,
  viewerEmployeeId: string | null,
  targetEmployeeId: string,
): boolean {
  if (hasPermission(role, "employee:read_all")) return true;
  return viewerEmployeeId !== null && viewerEmployeeId === targetEmployeeId;
}
