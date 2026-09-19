"use server";

import { z } from "zod";
import { defineAction, UserError } from "@/server/action";
import { currentSessionId, requireAdmin } from "@/server/auth/session";
import { audit } from "@/server/audit";
import { allowKey } from "@/server/rate-limit";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { db, newId } from "@/server/db";
import { id } from "@/lib/schemas/common";
import { userInput } from "@/lib/schemas/user";

export async function listUsers() {
  await requireAdmin();
  const users = await db.users.find({}, { projection: { name: 1, email: 1, role: 1, createdAt: 1 } }).sort({ createdAt: 1 }).toArray();
  return users.map(({ _id, name, email, role, createdAt }) => ({ id: _id, name, email, role, createdAt }));
}

export const saveUser = defineAction(
  userInput.safeExtend({ id: id.optional() }),
  async ({ id, password, ...values }, me) => {
    if (id) {
      if (id === me.id && values.role !== "admin") throw new UserError("You can't remove your own admin role.");
      await db.users.updateOne(
        { _id: id },
        { $set: { ...values, ...(password ? { passwordHash: await hashPassword(password), failedLogins: 0, lockedUntil: null } : {}) } },
      );
      // a password reset signs the user out everywhere
      if (password) await db.sessions.deleteMany({ userId: id });
      await audit(me, "user.updated", { target: id, role: values.role, passwordReset: Boolean(password) });
    } else {
      if (!password) throw new UserError("A password is required for new users.");
      await db.users.insertOne({
        _id: newId(), ...values, passwordHash: await hashPassword(password), failedLogins: 0, lockedUntil: null, createdAt: new Date(),
      });
      await audit(me, "user.created", { email: values.email, role: values.role });
    }
  },
  { role: "admin" },
);

export const deleteUser = defineAction(
  id,
  async (userId, me) => {
    if (userId === me.id) throw new UserError("You can't delete your own account.");
    await db.users.deleteOne({ _id: userId });
    // cascade: their sessions die with them
    await db.sessions.deleteMany({ userId });
    await audit(me, "user.deleted", { target: userId });
  },
  { role: "admin" },
);

const passwordChange = z.object({
  currentPassword: z.string().min(1, "Enter your current password").max(200),
  password: z.string().min(10, "At least 10 characters").max(200),
});

// A stolen session must not be enough to take the account over for good: the current password is
// required, and every OTHER session is signed out — so if someone else was in, they're out now.
export const changeOwnPassword = defineAction(passwordChange, async ({ currentPassword, password }, me) => {
  if (!(await allowKey(`password-change:${me.id}`, 5, 900))) throw new UserError("Too many attempts. Try again in a few minutes.");
  const user = await db.users.findOne({ _id: me.id }, { projection: { passwordHash: 1 } });
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new UserError("Some fields need attention.", { currentPassword: "That isn't your current password" });
  }
  await db.users.updateOne({ _id: me.id }, { $set: { passwordHash: await hashPassword(password) } });
  const keep = await currentSessionId();
  await db.sessions.deleteMany({ userId: me.id, ...(keep ? { _id: { $ne: keep } } : {}) });
  await audit(me, "user.password-changed");
});
