"use client";

import { useActionState } from "react";
import { login } from "@/app/studio/actions";

export default function Login({ configured, needsCode }: { configured: boolean; needsCode: boolean }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <main className="studio-login">
      <form action={action} className="login-card">
        <span className="s-mono">Studio</span>
        <h1>Restricted area</h1>
        {!configured && (
          <p className="s-warn">Studio isn&apos;t set up yet. Add ADMIN_PASSWORD_HASH, ADMIN_SECRET_KEY and SESSION_SECRET to your Vercel environment variables, then redeploy.</p>
        )}
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <label>Secret key<input name="secret" type="password" autoComplete="off" required /></label>
        {needsCode && <label>Authenticator code<input name="code" inputMode="numeric" pattern="[0-9 ]{6,7}" autoComplete="one-time-code" required /></label>}
        <button type="submit" disabled={pending || !configured}>{pending ? "Checking…" : "Unlock"}</button>
        {state?.error && <p className="s-error" role="alert">{state.error}</p>}
      </form>
    </main>
  );
}
