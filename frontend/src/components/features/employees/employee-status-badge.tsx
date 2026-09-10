import { Badge, type BadgeTone } from "@/components/base/badge/badge";
import type { EmployeeStatus } from "@/lib/validations/employee";

/**
 * The one place employee status becomes a colour and a label. Keeping the
 * mapping here means the table, a future detail page and any export all
 * agree on what "ON_LEAVE" looks like.
 */
const STATUS_CONFIG: Record<EmployeeStatus, { label: string; tone: BadgeTone }> =
  {
    ACTIVE: { label: "Active", tone: "success" },
    ON_LEAVE: { label: "On leave", tone: "warning" },
    INACTIVE: { label: "Inactive", tone: "neutral" },
  };

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge tone={config.tone} withDot>
      {config.label}
    </Badge>
  );
}
