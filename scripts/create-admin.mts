// usage: npm run admin:create -- email@example.com "Full Name" 'password' [admin|editor]
// Running it for an existing email resets that account's password and clears a lockout.
import { closeDb, db, newId, ready } from "@/server/db";
import { hashPassword } from "@/server/auth/password";

const [email, name, password, role = "admin"] = process.argv.slice(2);
if (!email || !name || !password || password.length < 10 || !["admin", "editor"].includes(role)) {
  console.error('usage: admin:create <email> "<name>" <password ≥10 chars> [admin|editor]');
  process.exit(1);
}

await ready; // the unique email index must exist before the upsert
await db.users.updateOne(
  { email: email.toLowerCase() },
  {
    $set: { name, passwordHash: await hashPassword(password), role: role as "admin" | "editor", failedLogins: 0, lockedUntil: null },
    $setOnInsert: { _id: newId(), createdAt: new Date() },
  },
  { upsert: true },
);

console.log(`✓ ${role} ${email}`);
await closeDb();
