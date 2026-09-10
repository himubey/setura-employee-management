"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ApiError } from "@/lib/api/client";

/**
 * The single QueryClient for the app.
 *
 * With the backend split out into FastAPI, TanStack Query is the app's
 * server-state layer: every screen that reads data goes through it.
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
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            /**
             * Retrying a 4xx cannot succeed — a 401 or a 403 will not change
             * without a new session — and it delays the redirect to /login by
             * several seconds. Server errors and network faults get one retry.
             */
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status < 500) return false;
              return failureCount < 1;
            },
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
