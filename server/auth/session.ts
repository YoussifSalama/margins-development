import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/server/db";

// __Host- = the browser only accepts it over HTTPS, for this exact host, path "/" — it can't be
// planted by a subdomain. Needs Secure, so plain "session" is used on http://localhost.
const COOKIE = process.env.NODE_ENV === "production" ? "__Host-session" : "session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAX_AGE_MS);
  await db.sessions.insertOne({ _id: sha256(token), userId, expiresAt });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await db.sessions.deleteOne({ _id: sha256(token) });
  store.delete(COOKIE);
}

/** id of the session making this request (the token's hash) — so "sign out everywhere else" can keep it */
export async function currentSessionId() {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? sha256(token) : null;
}

export type SessionUser = { id: string; name: string; email: string; role: "admin" | "editor" };

// Memoized per render pass; every query/action calls this, not just layouts.
export const getUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  // the TTL index only sweeps about once a minute, so expiry is still checked here
  const session = await db.sessions.findOne({ _id: sha256(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await db.users.findOne({ _id: session.userId }, { projection: { name: 1, email: 1, role: 1 } });
  return user ? { id: user._id, name: user.name, email: user.email, role: user.role } : null;
});

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  // an editor asking for an admin screen gets "not found", not a crash page or a hint that it exists
  if (user.role !== "admin") notFound();
  return user;
}
