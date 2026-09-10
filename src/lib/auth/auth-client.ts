"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side auth client.
 *
 * No base URL is configured on purpose: Better Auth defaults to the current
 * origin, so nothing server-side (and no secret) leaks into the client bundle.
 */
export const authClient = createAuthClient();

export const { signIn, signOut, signUp, useSession } = authClient;
