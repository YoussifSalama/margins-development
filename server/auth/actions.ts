"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/server/db";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;

const loginSchema = z.object({ email: z.email().trim().toLowerCase(), password: z.string().min(1) });

// Verified against when the email is unknown so response time doesn't leak which emails exist.
const dummyHash = hashPassword("dummy-password");

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid email or password." };
  const { email, password } = parsed.data;

  const user = await db.users.findOne({ email });
  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const ok = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));
  if (!user || !ok) {
    if (user) {
      // $inc is atomic, so parallel guesses can't each read the same stale counter
      const updated = await db.users.findOneAndUpdate({ _id: user._id }, { $inc: { failedLogins: 1 } }, { returnDocument: "after" });
      if ((updated?.failedLogins ?? 0) >= MAX_FAILED) {
        await db.users.updateOne({ _id: user._id }, { $set: { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MS) } });
      }
    }
    return { error: "Invalid email or password." };
  }

  await db.users.updateOne({ _id: user._id }, { $set: { failedLogins: 0, lockedUntil: null } });
  await createSession(user._id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
