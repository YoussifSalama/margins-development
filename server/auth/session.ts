import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/server/db";

const COOKIE = "session";
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
  if (user.role !== "admin") throw new Error("Forbidden: admin role required");
  return user;
}
