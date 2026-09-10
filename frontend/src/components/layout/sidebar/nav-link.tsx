"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "../nav-items";
import { cn } from "@/utils/cn";

/**
 * The only part of the navigation that needs the client: highlighting the
 * active route. The sidebar itself stays a Server Component.
 */
export function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "size-4.5 shrink-0",
          isActive ? "text-brand-600" : "text-slate-400",
        )}
      >
        <path d={item.iconPath} />
      </svg>
      {item.label}
    </Link>
  );
}
