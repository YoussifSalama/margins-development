import "server-only";
import { headers } from "next/headers";
import { db } from "@/server/db";

// The public forms are the only unauthenticated writes in the app. Each (action, visitor IP)
// gets a small budget per time window; the counter documents expire by themselves (TTL index).
// ponytail: fixed window in MongoDB — fine for a marketing site. Move to Turnstile / a WAF rule
// if a bot ever rotates IPs fast enough to matter.
export async function allow(action: string, limit: number, windowSeconds: number) {
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() || "unknown";
  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  const hit = await db.rateLimits.findOneAndUpdate(
    { _id: `${action}:${ip}:${window}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 1) * windowSeconds * 1000) } },
    { upsert: true, returnDocument: "after" },
  );
  return (hit?.count ?? 1) <= limit;
}
