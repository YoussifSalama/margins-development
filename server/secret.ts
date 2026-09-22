import "server-only";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// One dedicated secret for the app's own signatures — never a storage or database credential
// doing double duty. Missing or short → throw: signing with an empty key must never happen.
function appSecret() {
  const secret = process.env.APP_SECRET;
  if (!secret || secret.length < 32) throw new Error("APP_SECRET is missing or shorter than 32 characters");
  return secret;
}

export const sign = (purpose: string, value: string) => createHmac("sha256", appSecret()).update(`${purpose}:${value}`).digest("hex");

export function verify(purpose: string, value: string, signature: string) {
  const expected = Buffer.from(sign(purpose, value));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

// For secrets stored at rest (e.g. a CMS-entered API key) — never for signatures.
// ponytail: SHA-256 of APP_SECRET as the AES key, no separate KDF. APP_SECRET is already
// 32+ random bytes, not a user password, so a slow KDF (scrypt) buys nothing here.
const secretKey = () => createHash("sha256").update(appSecret()).digest();

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64");
}

export function decryptSecret(payload: string) {
  const raw = Buffer.from(payload, "base64");
  const decipher = createDecipheriv("aes-256-gcm", secretKey(), raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
}
