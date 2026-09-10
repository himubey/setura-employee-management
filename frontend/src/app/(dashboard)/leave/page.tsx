import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Leave" };

export default function LeavePage() {
  return (
    <ComingSoon
      title="Leave"
      description="Leave requests, balances and the approval queue are a later phase. This screen will read from /api/v1/leave."
    />
  );
}
