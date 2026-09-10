import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { requirePermission } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Attendance" };

export default async function AttendancePage() {
  await requirePermission("attendance:read_own");

  return (
    <ComingSoon
      title="Attendance"
      description="The schema, service and validation for attendance are in place. The daily register and reports are the next phase of work."
    />
  );
}
