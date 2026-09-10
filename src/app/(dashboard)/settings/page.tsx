import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { requirePermission } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requirePermission("settings:manage");

  return (
    <ComingSoon
      title="Settings"
      description="Organisation settings, holidays and role assignment will live here."
    />
  );
}
