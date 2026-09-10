import {
  createDownloadUrl,
  createUploadUrl,
  deleteObject,
  isStorageConfigured,
  publicUrlFor,
} from "./r2";

/**
 * The storage-facing API for the rest of the application.
 *
 * Everything outside this folder imports from here, never from ./r2 — so
 * swapping R2 for another provider is a change to one file. Keys are built
 * here too, so the layout of the bucket is defined in exactly one place.
 */

/** `employees/<employeeId>/<category>/<timestamp>-<safe-name>` */
export function buildEmployeeDocumentKey(input: {
  employeeId: string;
  category: string;
  fileName: string;
}): string {
  const safeName = input.fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  const safeCategory = input.category.replace(/[^a-z0-9\-_]+/gi, "-");

  return `employees/${input.employeeId}/${safeCategory}/${Date.now()}-${safeName}`;
}

export const storage = {
  isConfigured: isStorageConfigured,
  createUploadUrl,
  createDownloadUrl,
  deleteObject,
  publicUrlFor,
} as const;

export { StorageNotConfiguredError } from "./r2";
