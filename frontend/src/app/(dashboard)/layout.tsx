import { AppShell } from "@/components/layout/app-shell";

/**
 * Wraps every authenticated screen.
 *
 * This layout stays a Server Component so the route segment itself is static;
 * `AppShell` is the client island that reads the session. The QueryProvider
 * lives in the root layout, above both route groups.
 *
 * On the shell being a Client Component: the plan is for FastAPI to issue an
 * HttpOnly cookie on a different origin (:8000), which only the browser
 * holds. A Server Component here could not ask "who is signed in" without
 * proxying that cookie itself. If Sakshi's auth design allows a server-side
 * read, this is the one place to revisit — pages below stay unchanged either
 * way, and remain Server Components unless they need interactivity.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
