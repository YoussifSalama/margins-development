"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/server/db";
import { audit } from "@/server/audit";
import { allowKey, clientIp } from "@/server/rate-limit";
import { hashPassword, needsRehash, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

const loginSchema = z.object({ email: z.email().trim().toLowerCase(), password: z.string().min(1).max(200) });

// Verified against when the email is unknown so response time doesn't leak which emails exist.
const dummyHash = hashPassword("dummy-password");

export type LoginState = { error?: string };

const INVALID = "Invalid email or password.";
const THROTTLED = "Too many attempts. Try again in a few minutes.";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: INVALID };
  const { email, password } = parsed.data;
  const ip = await clientIp();

  // Throttling instead of locking the account: a hard lock lets anyone keep the only admin out
  // just by failing logins. Budgets are keyed by what the ATTACKER controls (their IP, the email
  // they typed) and apply whether or not the account exists — so the message reveals nothing.
  const [perIp, perPair, perEmail] = await Promise.all([
    allowKey(`login:ip:${ip}`, 10, 600), // one source hammering any account
    allowKey(`login:pair:${email}:${ip}`, 5, 900), // one source guessing one account
    allowKey(`login:email:${email}`, 40, 900), // many sources on one account — high, so it can't be used to lock the owner out cheaply
  ]);
  if (!perIp || !perPair || !perEmail) return { error: THROTTLED };

  const user = await db.users.findOne({ email });
  const ok = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));
  if (!user || !ok) {
    await audit(null, "login.failed", { email });
    return { error: INVALID };
  }

  // hashes written with a weaker cost get upgraded the moment we see the password
  if (needsRehash(user.passwordHash)) await db.users.updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(password) } });
  await createSession(user._id);
  await audit({ id: user._id, email: user.email }, "login.ok");
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
