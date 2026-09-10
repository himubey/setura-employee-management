import {
  bigint,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { employees } from "./employees";
import { user } from "./users";

/**
 * Metadata for a file stored in Cloudflare R2. The bytes live in R2; this
 * table only records where they are and who they belong to.
 *
 * `storageKey` is the R2 object key. It is never a public URL — access goes
 * through a presigned URL issued by src/lib/storage.
 */
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),

    /** Free-form for now: "contract", "id-proof", "certificate". */
    category: text("category").notNull().default("general"),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    storageKey: text("storage_key").notNull().unique(),

    uploadedBy: text("uploaded_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("documents_employee_id_idx").on(table.employeeId)],
);

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
