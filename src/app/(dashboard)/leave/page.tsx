import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { requirePermission } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Leave" };

export default async function LeavePage() {
  await requirePermission("leave:read_own");

  return (
    <ComingSoon
      title="Leave"
      description="Leave types, requests and the approval workflow exist in the service layer. The request form and approvals queue are the next phase of work."
    />
  );
}
