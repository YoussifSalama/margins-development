import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

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
