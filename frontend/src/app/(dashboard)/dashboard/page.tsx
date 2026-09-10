import type { Metadata } from "next";

import { DashboardStats } from "@/components/features/dashboard/dashboard-stats";
import { DashboardGreeting } from "@/components/features/dashboard/dashboard-greeting";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * A Server Component that composes two client islands.
 *
 * The page itself renders no data, so it stays on the server; only the parts
 * that read from the API cross the boundary. That keeps the pattern honest —
 * "use client" marks what genuinely needs the browser, not a whole route.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardGreeting />
      <DashboardStats />
    </div>
  );
}
