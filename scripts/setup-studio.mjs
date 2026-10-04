#!/usr/bin/env node
// Generates the studio secrets. Run: npm run setup-studio
// Prints env vars to paste into Vercel (Settings → Environment Variables). Nothing is written to disk.
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";
import { promisify } from "node:util";

const ask = (q, hidden) =>
  new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => rl.output.write(s.includes(q) ? s : "");
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a); });
  });

const password = process.argv[2] ?? (await ask("Choose a studio password (12+ characters): ", true));
if (!password || password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = await promisify(scrypt)(password.normalize("NFKC"), salt, 64);
const b32 = (buf) => {
  const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "", out = "";
  for (const b of buf) bits += b.toString(2).padStart(8, "0");
  for (let i = 0; i + 5 <= bits.length; i += 5) out += a[parseInt(bits.slice(i, i + 5), 2)];
  return out;
};
const totp = b32(randomBytes(20));

console.log(`
Add these in Vercel → Project → Settings → Environment Variables (Production), then redeploy:

ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}
ADMIN_SECRET_KEY=${randomBytes(24).toString("base64url")}
SESSION_SECRET=${randomBytes(48).toString("base64url")}

Optional 2FA (recommended): also add
ADMIN_TOTP_SECRET=${totp}
and add it to Google Authenticator / 1Password as a manual key:
otpauth://totp/Studio:dhaneshshetty.in?secret=${totp}&issuer=Studio

Keep ADMIN_SECRET_KEY somewhere safe (a password manager). You type it at login with your password.
`);
