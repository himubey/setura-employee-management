import { Header } from "@/components/layout/header/header";
import { SetupRequired } from "@/components/layout/setup-required";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { QueryProvider } from "@/lib/query-provider";
import { requireUser } from "@/lib/auth/session";
import { isAppConfigured, missingRequiredEnv } from "@/lib/setup-status";

/**
 * Authenticated application shell: sidebar + header + main content.
 *
 * A Server Component. The session is read once here and passed down, so no
 * child needs to re-fetch it and no page becomes a Client Component just to
 * know who is signed in.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAppConfigured()) {
    return <SetupRequired missing={missingRequiredEnv()} />;
  }

  const user = await requireUser();

  return (
    <QueryProvider>
      <div className="flex min-h-dvh">
        <Sidebar role={user.role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={user} />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}
