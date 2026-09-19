// run: npx tsx scripts/check-auth.mts
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "@/server/auth/password";

const hash = await hashPassword("correct horse battery");
assert.ok(await verifyPassword("correct horse battery", hash));
assert.equal(await verifyPassword("wrong", hash), false);
assert.equal(await verifyPassword("x", "garbage"), false);
assert.notEqual(hash, await hashPassword("correct horse battery"), "salt must differ per hash");
console.log("✓ password hashing");
