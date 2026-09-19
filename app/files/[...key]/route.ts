import { fetchObject, publicBucket } from "@/server/storage/r2";

// Serves uploaded media without a public bucket: reads the object from R2 with the access key
// and streams it to the browser. Keys are random UUIDs and never change, so responses are
// cached for a year on Vercel's CDN — Cloudflare is hit once per file, not once per visitor.

// only website media; CVs (cv/…) are private and always go through signed admin links
const ALLOWED = /^media\/\d{4}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|mp4|pdf)$/;

const PASS_THROUGH = ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"];

export async function GET(request: Request, { params }: RouteContext<"/files/[...key]">) {
  const key = (await params).key.join("/");
  if (!ALLOWED.test(key)) return new Response("Not found", { status: 404 });

  let upstream: Response;
  try {
    const range = request.headers.get("range");
    upstream = await fetchObject(publicBucket(), key, range ? { range } : {});
  } catch (error) {
    console.error("R2 read failed:", error);
    return new Response("Storage unavailable", { status: 503 });
  }
  if (upstream.status === 404) return new Response("Not found", { status: 404 });
  if (!upstream.ok && upstream.status !== 206) return new Response("Storage error", { status: 502 });

  const headers = new Headers({ "cache-control": "public, max-age=31536000, immutable" });
  for (const name of PASS_THROUGH) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}
