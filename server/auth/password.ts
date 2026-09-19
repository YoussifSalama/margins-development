import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// scrypt at OWASP's current minimum (N=2^17, r=8, p=1). The cost is stored inside the hash,
// so it can be raised again later and old hashes keep verifying — and get upgraded on login.
const N = 2 ** 17;
const LEGACY_N = 2 ** 14; // hashes written before the cost was stored ("salt:hash")

const derive = (password: string, salt: Buffer, length: number, cost: number) =>
  new Promise<Buffer>((resolve, reject) => {
    // scrypt needs 128·N·r bytes; Node's default 32 MB cap is below what N=2^17 requires
    const options: ScryptOptions = { N: cost, r: 8, p: 1, maxmem: 256 * cost * 8 };
    scrypt(password, salt, length, options, (error, key) => (error ? reject(error) : resolve(key)));
  });

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, 64, N);
  return `scrypt$${N}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function parse(stored: string) {
  if (stored.startsWith("scrypt$")) {
    const [, cost, salt, hash] = stored.split("$");
    return { cost: Number(cost), salt, hash };
  }
  const [salt, hash] = stored.split(":");
  return { cost: LEGACY_N, salt, hash };
}

export async function verifyPassword(password: string, stored: string) {
  const { cost, salt, hash } = parse(stored);
  if (!salt || !hash || !Number.isInteger(cost) || cost < LEGACY_N || cost > 2 ** 20) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = await derive(password, Buffer.from(salt, "hex"), expected.length, cost);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** true when the stored hash uses a weaker cost than today's — re-hash it after a successful login */
export const needsRehash = (stored: string) => parse(stored).cost < N;
