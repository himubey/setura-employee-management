import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { requirePermission } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Departments" };

export default async function DepartmentsPage() {
  await requirePermission("department:read");

  return (
    <ComingSoon
      title="Departments"
      description="Departments already back the employees filter. A management screen follows once employee creation and editing are done."
    />
  );
}
