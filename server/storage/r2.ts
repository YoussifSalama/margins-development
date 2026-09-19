import "server-only";
import { AwsClient } from "aws4fetch";

// Vercel caps request bodies at 4.5 MB, so files never pass through the app:
// the browser PUTs straight to R2 using a short-lived presigned URL.

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Uploads are not configured: ${name} is missing`);
  return value;
};

// Env (Cloudflare → R2 → bucket → Settings / API tokens):
//   CLOUDFLARE_ACCESS_KEY_ID / CLOUDFLARE_SECRET_ACCESS_KEY  — an R2 API token with object read+write
//   CLOUDFLARE_S3_CLIENT_API   — the S3 endpoint, https://<account-id>.r2.cloudflarestorage.com
//   CLOUDFLARE_BUCKET_NAME     — bucket for website media
//   CLOUDFLARE_PUBLIC_URL      — optional: the bucket's public base URL; without it files are served via /files/<key>
//   CLOUDFLARE_PRIVATE_BUCKET_NAME — optional, for CVs; never falls back to the public bucket
let client: AwsClient | undefined;
const r2 = () =>
  (client ??= new AwsClient({
    accessKeyId: env("CLOUDFLARE_ACCESS_KEY_ID"),
    secretAccessKey: env("CLOUDFLARE_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  }));

const objectUrl = (bucket: string, key: string) => new URL(`${env("CLOUDFLARE_S3_CLIENT_API").replace(/\/$/, "")}/${bucket}/${key}`);

// Content-Type and Content-Length are part of the signature, so the client
// can't upload a different type or a bigger file than the one we approved.
export async function presignPut(bucket: string, key: string, contentType: string, size: number) {
  const url = objectUrl(bucket, key);
  url.searchParams.set("X-Amz-Expires", "300");
  const signed = await r2().sign(
    new Request(url, { method: "PUT", headers: { "Content-Type": contentType, "Content-Length": String(size) } }),
    { aws: { signQuery: true, allHeaders: true } },
  );
  return signed.url;
}

export async function presignGet(bucket: string, key: string, expiresSeconds = 60, downloadAs?: string) {
  const url = objectUrl(bucket, key);
  url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
  // force a download with a readable filename instead of opening the file in the browser
  if (downloadAs) url.searchParams.set("response-content-disposition", `attachment; filename="${downloadAs.replace(/[^\w.\- ]+/g, "_")}"`);
  return (await r2().sign(new Request(url), { aws: { signQuery: true } })).url;
}

export const publicBucket = () => env("CLOUDFLARE_BUCKET_NAME");
/**
 * Where CVs are stored. A dedicated private bucket when CLOUDFLARE_PRIVATE_BUCKET_NAME is set
 * (recommended). Otherwise the media bucket under cv/ — those keys carry 256 random bits, are
 * never shown publicly, are blocked by the /files route, and are only ever handed to staff as
 * one-minute signed links; but that bucket is public, so a private one is the right home.
 */
export const cvBucket = () => process.env.CLOUDFLARE_PRIVATE_BUCKET_NAME || env("CLOUDFLARE_BUCKET_NAME");

/** Size and type of a stored object, or null if it isn't there. */
export async function headObject(bucket: string, key: string) {
  const response = await r2().fetch(objectUrl(bucket, key).toString(), { method: "HEAD" });
  if (!response.ok) return null;
  return { size: Number(response.headers.get("content-length") ?? 0), contentType: response.headers.get("content-type") ?? "" };
}

/** First bytes of an object — enough to check a file signature without downloading it. */
export async function readStart(bucket: string, key: string, bytes = 8) {
  const response = await r2().fetch(objectUrl(bucket, key).toString(), { headers: { range: `bytes=0-${bytes - 1}` } });
  return response.ok || response.status === 206 ? new Uint8Array(await response.arrayBuffer()) : null;
}

/** Server-side copy inside the bucket (S3 CopyObject). */
export async function copyObject(bucket: string, from: string, to: string) {
  const response = await r2().fetch(objectUrl(bucket, to).toString(), { method: "PUT", headers: { "x-amz-copy-source": `/${bucket}/${from}` } });
  return response.ok;
}

/**
 * Deletes objects under `prefix` older than `maxAgeMs`. Upload links are handed out before an
 * application exists, so abandoned files are inevitable; this keeps them from piling up.
 * Best effort: a token without list permission just logs once (use a bucket lifecycle rule then).
 */
export async function sweep(bucket: string, prefix: string, maxAgeMs: number) {
  const url = objectUrl(bucket, "");
  url.searchParams.set("list-type", "2");
  url.searchParams.set("prefix", prefix);
  url.searchParams.set("max-keys", "200");
  const response = await r2().fetch(url.toString());
  if (!response.ok) return console.warn(`sweep(${prefix}): listing not permitted (${response.status}) — add an R2 lifecycle rule for this prefix instead`);
  const xml = await response.text();
  const cutoff = Date.now() - maxAgeMs;
  for (const [, key, modified] of xml.matchAll(/<Contents>[\s\S]*?<Key>([\s\S]*?)<\/Key>[\s\S]*?<LastModified>([\s\S]*?)<\/LastModified>[\s\S]*?<\/Contents>/g)) {
    if (new Date(modified).getTime() < cutoff) await deleteObject(bucket, key);
  }
}

export const deleteObject = (bucket: string, key: string) => r2().fetch(objectUrl(bucket, key).toString(), { method: "DELETE" });
/**
 * Where a browser loads an uploaded file from. With CLOUDFLARE_PUBLIC_URL set, straight from
 * Cloudflare. Without it, through our own /files/<key> route, which reads the object with the
 * access key and streams it back — the same way Plato serves its documents — so the bucket
 * can stay private and only the four CLOUDFLARE_* keys are needed.
 */
export const publicUrl = (key: string) => {
  const base = process.env.CLOUDFLARE_PUBLIC_URL?.replace(/\/$/, "");
  return base ? `${base}/${key}` : `/files/${key}`;
};

/** Server-side signed read of an object, for the /files proxy. Passes Range through for video. */
export const fetchObject = (bucket: string, key: string, headers: HeadersInit = {}) => r2().fetch(objectUrl(bucket, key).toString(), { headers });
