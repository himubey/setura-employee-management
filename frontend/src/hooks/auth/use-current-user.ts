"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/query-keys";

/**
 * Who is signed in.
 *
 * One query, shared by the whole shell: the sidebar, the header and any page
 * that gates on a role all read the same cache entry, so there is a single
 * `/auth/me` request per page load however many components ask.
 *
 * A 401 is a normal answer here (nobody is signed in), not a failure worth
 * retrying — the retry policy in the QueryProvider already stops on 4xx.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: ({ signal }) => getCurrentUser(signal),
    // The session outlives any single screen; refetching it on every
    // navigation is pure noise.
    staleTime: 5 * 60_000,
  });
}
