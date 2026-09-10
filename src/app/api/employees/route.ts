import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { ForbiddenError, authorize } from "@/lib/permissions/authorize";
import { listEmployees } from "@/services/employee.service";
import type { ApiError } from "@/types";

/**
 * Read endpoint backing the employees table's interactive search, filtering
 * and paging (Client Component -> TanStack Query -> here -> service -> Drizzle).
 *
 * The initial page load does NOT go through this route — the page is a
 * Server Component that calls the service directly. This exists only for
 * what happens after the user starts typing.
 *
 * Note `getCurrentUser` rather than `requireUser`: `requireUser` redirects,
 * and `redirect()` works by throwing, which the catch below would turn into
 * a misleading 500. An expired session on an XHR should be a plain 401.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Your session has expired. Sign in again." },
        { status: 401 },
      );
    }

    authorize(user.role, "employee:read_all");

    const params = Object.fromEntries(new URL(request.url).searchParams);
    const result = await listEmployees(params);

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown): NextResponse<ApiError> {
  if (error instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "_";
      (fields[key] ??= []).push(issue.message);
    }
    return NextResponse.json(
      { error: "Invalid request.", fields },
      { status: 400 },
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  // Never leak an internal message (it can contain the connection string).
  console.error("[api/employees]", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}
