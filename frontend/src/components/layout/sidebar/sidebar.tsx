"use client";

import { hasPermission } from "@/lib/permissions/permissions";
import type { Role } from "@/lib/permissions/roles";

import { NAV_ITEMS } from "../nav-items";
import { Wordmark } from "../wordmark";
import { NavLink } from "./nav-link";

/**
 * Desktop sidebar. Filters navigation by the signed-in role.
 *
 * Hiding a link is presentation, not security: the backend enforces every
 * permission on its own. A link the user cannot use is simply noise.
 */
export function Sidebar({ role }: { role: Role }) {
  const items = NAV_ITEMS.filter((item) => hasPermission(role, item.permission));

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
        <Wordmark />
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-200 px-4 py-3">
        <p className="text-[11px] text-slate-400">Setura · MVP</p>
      </div>
    </aside>
  );
}
