import type { LoginInput } from "@/lib/validations/auth";
import type { CurrentUser } from "@/types/auth";

import { api, USE_MOCK_API } from "./client";
import { mockCurrentUser } from "./mock";

/**
 * `/api/v1/auth` — session lifecycle.
 *
 * PROVISIONAL: paths and payloads follow `src/types/auth.ts`, which is the
 * frontend's expectation rather than a published contract.
 *
 * This module assumes FastAPI sets an HttpOnly session cookie: there is no
 * token to hand back and store, JavaScript never sees the credential, and an
 * XSS payload therefore cannot exfiltrate it. `getCurrentUser()` is how the
 * UI asks "who am I". If Sakshi returns a bearer token instead, this file and
 * `client.ts` are the only two that change.
 */

export function login(input: LoginInput): Promise<CurrentUser> {
  if (USE_MOCK_API) return mockCurrentUser();
  return api.post<CurrentUser>("/api/v1/auth/login", input);
}

export function logout(): Promise<void> {
  if (USE_MOCK_API) return Promise.resolve();
  return api.post<void>("/api/v1/auth/logout");
}

/** Rejects with `ApiError` (status 401) when there is no session. */
export function getCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  if (USE_MOCK_API) return mockCurrentUser();
  return api.get<CurrentUser>("/api/v1/auth/me", undefined, signal);
}
