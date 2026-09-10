import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Departments" };

export default function DepartmentsPage() {
  return (
    <ComingSoon
      title="Departments"
      description="Department management is a later phase. This screen will read from /api/v1/departments."
    />
  );
}
