import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";

// Studio auth: a scrypt-hashed password + a secret key (+ optional TOTP 2FA), then a signed,
// httpOnly session cookie. Nothing secret is ever stored in plain text or sent to the browser.
//
// Env:
//   ADMIN_PASSWORD_HASH  scrypt:<saltHex>:<hashHex>   (generate with `npm run hash-password`)
//   ADMIN_SECRET_KEY     any long random string, typed at login as a second factor
//   SESSION_SECRET       32+ random bytes; rotating it signs everyone out
//   ADMIN_TOTP_SECRET    optional base32 secret for an authenticator app

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const COOKIE = "studio_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export const authConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SECRET_KEY && (process.env.SESSION_SECRET?.length ?? 0) >= 32);

const sameBytes = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);
const sameText = (a: string, b: string) => {
  // hash both sides so length differences don't leak through timing
  const h = (s: string) => createHmac("sha256", "cmp").update(s).digest();
  return timingSafeEqual(h(a), h(b));
};

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password.normalize("NFKC"), salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split(":");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const hash = await scrypt(password.normalize("NFKC"), Buffer.from(saltHex, "hex"), 64);
  return sameBytes(hash, Buffer.from(hashHex, "hex"));
}

// --- TOTP (RFC 6238, SHA-1, 6 digits, 30 s) ---
function base32(s: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of s.replace(/[\s=-]/g, "").toUpperCase()) {
    const v = alphabet.indexOf(c);
    if (v >= 0) bits += v.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}
function totpAt(key: Buffer, step: number): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(step));
  const mac = createHmac("sha1", key).update(msg).digest();
  const o = mac[mac.length - 1] & 0xf;
  const code = ((mac.readUInt32BE(o) & 0x7fffffff) % 1_000_000).toString();
  return code.padStart(6, "0");
}
function verifyTotp(code: string, secret: string): boolean {
  const key = base32(secret), step = Math.floor(Date.now() / 30000);
  return [-1, 0, 1].some((d) => sameText(totpAt(key, step + d), code.replace(/\s/g, "")));
}
export const totpRequired = () => Boolean(process.env.ADMIN_TOTP_SECRET);

// --- rate limiting (per server instance) ---
const attempts = new Map<string, { n: number; until: number }>();
async function clientKey() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function checkLogin(form: { password: string; secret: string; code?: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!authConfigured()) return { ok: false, error: "Studio is not configured yet. Set the ADMIN_* and SESSION_SECRET env vars." };
  const key = await clientKey(), now = Date.now(), a = attempts.get(key);
  if (a && a.n >= 5 && a.until > now) return { ok: false, error: `Too many attempts. Try again in ${Math.ceil((a.until - now) / 60000)} min.` };

  const passOk = await verifyPassword(form.password, process.env.ADMIN_PASSWORD_HASH!);
  const secretOk = sameText(form.secret, process.env.ADMIN_SECRET_KEY!);
  const codeOk = !totpRequired() || verifyTotp(form.code ?? "", process.env.ADMIN_TOTP_SECRET!);
  if (passOk && secretOk && codeOk) {
    attempts.delete(key);
    return { ok: true };
  }
  const n = (a && a.until > now ? a.n : 0) + 1;
  attempts.set(key, { n, until: now + 15 * 60 * 1000 });
  await new Promise((r) => setTimeout(r, 700));
  return { ok: false, error: "Those details don't match." };
}

// --- session ---
const sign = (payload: string) => createHmac("sha256", process.env.SESSION_SECRET!).update(payload).digest("base64url");

export async function startSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000, n: randomBytes(8).toString("hex") })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  if (!authConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !sameText(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
