"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Spinner } from "@/components/base/spinner/spinner";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { ApiError, NetworkError } from "@/lib/api/client";

import { ApiUnavailable } from "./api-unavailable";
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";

/**
 * The authenticated shell: sidebar + header + main content.
 *
 * A Client Component, and deliberately so — see the note in
 * `src/app/(dashboard)/layout.tsx`. One `useCurrentUser()` query answers
 * "who is signed in" for the whole tree.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending, error } = useCurrentUser();

  const isUnauthorized = error instanceof ApiError && error.isUnauthorized;

  // In an effect, not during render: navigating is a side effect, and calling
  // router.replace() while rendering warns and can loop.
  useEffect(() => {
    if (isUnauthorized) router.replace("/login");
  }, [isUnauthorized, router]);

  if (error instanceof NetworkError) return <ApiUnavailable />;

  // Covers both the first load and the moment after a 401 while the redirect
  // above is still in flight — neither should flash an empty shell.
  if (isPending || !user) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner className="text-slate-400" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
