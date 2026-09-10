/**
 * The four roles Setura ships with. This is the single source of truth —
 * `user_role` in the database enum mirrors it exactly.
 */
export const ROLES = [
  "SUPER_ADMIN",
  "HR_ADMIN",
  "MANAGER",
  "EMPLOYEE",
] as const;

export type Role = (typeof ROLES)[number];

export const DEFAULT_ROLE: Role = "EMPLOYEE";

/**
 * Rank is used only for "is at least" style checks (e.g. can this person see
 * the admin settings link). Anything finer-grained goes through
 * permissions.ts, which is explicit rather than hierarchical.
 */
const ROLE_RANK: Record<Role, number> = {
  EMPLOYEE: 0,
  MANAGER: 1,
  HR_ADMIN: 2,
  SUPER_ADMIN: 3,
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function roleAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super admin",
  HR_ADMIN: "HR admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};
