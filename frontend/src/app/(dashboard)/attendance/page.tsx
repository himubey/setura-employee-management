import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return (
    <ComingSoon
      title="Attendance"
      description="The attendance register, check-in/check-out and daily reports are a later phase. This screen will read from /api/v1/attendance."
    />
  );
}
