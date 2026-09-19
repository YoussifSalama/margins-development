import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/server/db";

// Per-key budgets for everything an anonymous visitor can trigger (public forms, login).
// Counters live in MongoDB and expire by themselves (TTL index).
// ponytail: fixed windows in MongoDB — fine for a marketing site. Add Turnstile / a WAF rule
// if a botnet ever spreads requests across enough real IPs to matter.

/**
 * The visitor's IP, from a header the PLATFORM sets — never from one the client controls.
 * X-Forwarded-For is only believed on Vercel, where the edge overwrites it; anywhere else a
 * client could send any value and get a fresh budget per request. Without a trusted source
 * everyone shares one bucket ("unknown"), which fails closed instead of open.
 */
export async function clientIp() {
  const h = await headers();
  const trusted = h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip") ?? (process.env.VERCEL ? h.get("x-forwarded-for") : null);
  return trusted?.split(",")[0].trim() || "unknown";
}

/** Counts one hit against `key`; false once the budget for this window is spent. */
export async function allowKey(key: string, limit: number, windowSeconds: number) {
  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  // hashed: keys may contain an email address, and the collection shouldn't store those
  const id = createHash("sha256").update(`${key}:${window}`).digest("hex");
  const hit = await db.rateLimits.findOneAndUpdate(
    { _id: id },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 1) * windowSeconds * 1000) } },
    { upsert: true, returnDocument: "after" },
  );
  return (hit?.count ?? 1) <= limit;
}

/** Budget per (action, visitor IP). */
export const allow = async (action: string, limit: number, windowSeconds: number) => allowKey(`${action}:${await clientIp()}`, limit, windowSeconds);
