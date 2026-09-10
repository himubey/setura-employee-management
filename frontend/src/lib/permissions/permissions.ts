import type { Role } from "./roles";

/**
 * Permissions are a flat list of `resource:action` strings mapped to roles.
 *
 * PRESENTATION ONLY. This file decides which nav links and buttons a role
 * sees; it enforces nothing. The FastAPI backend is the sole authority on
 * access, and answers 403 regardless of what the browser believes. Anything
 * row-level ("may this manager see *this* employee?") is the backend's
 * question alone — it has the row.
 *
 * CONTRACT: the role names must match Sakshi's user role enum exactly.
 */
export const PERMISSIONS = [
  "employee:read",
  "employee:read_all",
  "employee:create",
  "employee:update",
  "employee:delete",

  "department:read",
  "department:manage",

  "attendance:read_own",
  "attendance:read_all",
  "attendance:manage",

  "leave:request",
  "leave:read_own",
  "leave:read_all",
  "leave:approve",

  "document:read",
  "document:upload",

  "settings:manage",
  "audit_log:read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const EMPLOYEE_PERMISSIONS: readonly Permission[] = [
  "employee:read",
  "department:read",
  "attendance:read_own",
  "leave:request",
  "leave:read_own",
  "document:read",
];

const MANAGER_PERMISSIONS: readonly Permission[] = [
  ...EMPLOYEE_PERMISSIONS,
  "employee:read_all",
  "attendance:read_all",
  "leave:read_all",
  "leave:approve",
];

const HR_ADMIN_PERMISSIONS: readonly Permission[] = [
  ...MANAGER_PERMISSIONS,
  "employee:create",
  "employee:update",
  "department:manage",
  "attendance:manage",
  "document:upload",
  "audit_log:read",
];

const SUPER_ADMIN_PERMISSIONS: readonly Permission[] = [
  ...HR_ADMIN_PERMISSIONS,
  "employee:delete",
  "settings:manage",
];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  EMPLOYEE: EMPLOYEE_PERMISSIONS,
  MANAGER: MANAGER_PERMISSIONS,
  HR_ADMIN: HR_ADMIN_PERMISSIONS,
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
};

/** Pure predicate — safe to call from a Client Component for UI gating. */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(
  role: Role,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}
