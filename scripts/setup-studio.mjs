#!/usr/bin/env node
// Generates the studio secrets. Run: npm run setup-studio
//   npm run setup-studio            → prints the env vars to paste into Vercel
//   npm run setup-studio -- --vercel → sends them straight to the linked Vercel project (needs `vercel link`)
// Nothing is written to disk.
import { spawnSync } from "node:child_process";
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";
import { promisify } from "node:util";

const toVercel = process.argv.includes("--vercel");
const withTotp = !process.argv.includes("--no-2fa");

const ask = (q, hidden) =>
  new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => rl.output.write(s.includes(q) ? s : "");
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a); });
  });

const password = await ask("Choose a studio password (12+ characters): ", true);
if (!password || password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
if ((await ask("Type it again: ", true)) !== password) {
  console.error("The two passwords don't match.");
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

const vars = {
  ADMIN_PASSWORD_HASH: `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`,
  ADMIN_SECRET_KEY: randomBytes(24).toString("base64url"),
  SESSION_SECRET: randomBytes(48).toString("base64url"),
  ...(withTotp ? { ADMIN_TOTP_SECRET: b32(randomBytes(20)) } : {}),
};

if (toVercel) {
  for (const [name, value] of Object.entries(vars)) {
    const r = spawnSync("npx", ["vercel", "env", "add", name, "production", "--sensitive", "--force"], { input: value, stdio: ["pipe", "ignore", "inherit"] });
    if (r.status !== 0) { console.error(`Could not add ${name}. Is this folder linked? Run: npx vercel link`); process.exit(1); }
    console.log(`✓ ${name} added to Vercel (production)`);
  }
} else {
  console.log("\nAdd these in Vercel → Project → Settings → Environment Variables (Production), then redeploy:\n");
  for (const [name, value] of Object.entries(vars)) console.log(`${name}=${value}`);
}

console.log(`
Save these two in your password manager now. You need them to sign in at /studio:

  Secret key:  ${vars.ADMIN_SECRET_KEY}
${withTotp ? `  2FA key:     ${vars.ADMIN_TOTP_SECRET}
               (add it to Google Authenticator: + → Enter a setup key → time-based)
` : ""}
Then redeploy so the site picks them up.
`);
