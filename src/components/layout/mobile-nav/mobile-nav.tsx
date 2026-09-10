"use client";

import { useEffect, useState } from "react";

import type { NavItem } from "../nav-items";
import { NavLink } from "../sidebar/nav-link";
import { Wordmark } from "../wordmark";

/**
 * Mobile navigation drawer.
 *
 * Built on native behaviour where practical: Escape closes it, focus is
 * returned to the trigger, and body scroll is locked while open. No focus-trap
 * dependency — the drawer covers the viewport and the underlying page is
 * `inert`, which is what a trap would be approximating.
 *
 * `items` is filtered on the server before it reaches this component.
 */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label="Open navigation"
        className="-ml-1 grid size-9 place-items-center rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="size-5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />

          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl"
          >
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  className="size-4.5"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} onNavigate={() => setOpen(false)} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
