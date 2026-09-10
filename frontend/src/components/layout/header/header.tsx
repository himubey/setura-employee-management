"use client";

import { hasPermission } from "@/lib/permissions/permissions";
import { ROLE_LABELS } from "@/lib/permissions/roles";
import type { CurrentUser } from "@/types/auth";
import { initials } from "@/utils/format";

import { MobileNav } from "../mobile-nav/mobile-nav";
import { NAV_ITEMS } from "../nav-items";

/**
 * Application header. Receives the user from AppShell rather than querying
 * again, so the whole shell renders from one `/auth/me` response.
 */
export function Header({ user }: { user: CurrentUser }) {
  const items = NAV_ITEMS.filter((item) =>
    hasPermission(user.role, item.permission),
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm">
      <MobileNav items={items} />

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm leading-tight font-medium text-slate-900">
            {user.name}
          </p>
          <p className="text-xs leading-tight text-slate-500">
            {ROLE_LABELS[user.role]}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
        >
          {initials(user.name)}
        </span>
      </div>
    </header>
  );
}
