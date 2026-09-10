"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login, logout } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/query-keys";
import type { LoginInput } from "@/lib/validations/auth";

/**
 * Sign in.
 *
 * On success the returned user is written straight into the cache, so the
 * shell renders from it immediately rather than issuing a second `/auth/me`
 * round trip on the next page.
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, user);
      router.push("/dashboard");
    },
  });
}

/**
 * Sign out.
 *
 * The whole cache is cleared, not just the session: leaving one user's
 * employee list in memory for the next person to sign in on the same browser
 * would be a real leak.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}
