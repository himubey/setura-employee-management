import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getStorageEnv } from "@/env";

/**
 * Cloudflare R2 driver. SERVER ONLY.
 *
 * R2 speaks the S3 API, so the AWS SDK is the driver rather than a bespoke
 * HTTP client. Nothing outside this folder should import `@aws-sdk/*` —
 * that is the whole point of the abstraction in ./index.ts.
 *
 * Scope note: this file deliberately implements presigned URLs and delete
 * only. Upload orchestration, virus scanning, quotas and the documents UI
 * are out of scope for the initial setup.
 */

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, " +
        "R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME in your environment.",
    );
    this.name = "StorageNotConfiguredError";
  }
}

type R2Context = {
  client: S3Client;
  bucket: string;
  publicUrl: string | undefined;
};

let context: R2Context | undefined;

function getContext(): R2Context {
  if (context) return context;

  const env = getStorageEnv();
  if (!env) throw new StorageNotConfiguredError();

  context = {
    client: new S3Client({
      // R2 ignores region but the SDK requires one.
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    }),
    bucket: env.R2_BUCKET_NAME,
    publicUrl: env.R2_PUBLIC_URL,
  };

  return context;
}

/** True when R2 credentials are present, so callers can degrade gracefully. */
export function isStorageConfigured(): boolean {
  return getStorageEnv() !== null;
}

/** Time-limited URL the browser can PUT a file to directly. */
export async function createUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300,
): Promise<string> {
  const { client, bucket } = getContext();
  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: expiresInSeconds },
  );
}

/** Time-limited URL to read a private object. */
export async function createDownloadUrl(
  key: string,
  expiresInSeconds = 300,
): Promise<string> {
  const { client, bucket } = getContext();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSeconds },
  );
}

export async function deleteObject(key: string): Promise<void> {
  const { client, bucket } = getContext();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** Only meaningful when a public domain is attached to the bucket. */
export function publicUrlFor(key: string): string | null {
  const { publicUrl } = getContext();
  return publicUrl ? `${publicUrl.replace(/\/$/, "")}/${key}` : null;
}
