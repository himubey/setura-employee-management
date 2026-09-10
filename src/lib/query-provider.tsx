"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query provider.
 *
 * Scope note (brief section 8): this is NOT the app's data-loading strategy.
 * Server Components load data for straightforward pages. Query is here for
 * the interactive cases — the employees table's search, filter and paging,
 * and mutations later.
 *
 * The client is created inside `useState` so each browser session gets its
 * own instance and no cache is ever shared between users on the server.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Server Components already deliver fresh data on navigation;
            // this keeps interactive refetching from being chatty.
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
