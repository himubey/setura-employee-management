import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./users";

/**
 * Append-only trail of who changed what. Written from the service layer,
 * never updated or deleted.
 *
 * `metadata` is intentionally untyped JSON at the database level; callers
 * should pass a narrow, explicitly-typed object.
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Null when the action was taken by the system rather than a person. */
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null",
    }),
    /** e.g. "employee.created", "leave_request.approved". */
    action: text("action").notNull(),
    /** e.g. "employee". */
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_actor_id_idx").on(table.actorId),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ],
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
