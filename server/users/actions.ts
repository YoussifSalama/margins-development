"use server";

import { z } from "zod";
import { defineAction, UserError } from "@/server/action";
import { requireAdmin } from "@/server/auth/session";
import { hashPassword } from "@/server/auth/password";
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
    } else {
      if (!password) throw new UserError("A password is required for new users.");
      await db.users.insertOne({
        _id: newId(), ...values, passwordHash: await hashPassword(password), failedLogins: 0, lockedUntil: null, createdAt: new Date(),
      });
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
  },
  { role: "admin" },
);

const passwordChange = z.object({ password: z.string().min(10, "At least 10 characters").max(200) });

export const changeOwnPassword = defineAction(passwordChange, async ({ password }, me) => {
  await db.users.updateOne({ _id: me.id }, { $set: { passwordHash: await hashPassword(password) } });
});
