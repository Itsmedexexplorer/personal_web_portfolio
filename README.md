# dhaneshshetty.in

My portfolio. You start on the ground under a blue sky; as you scroll you climb through the clouds into orbit, then fly through each project one by one while a particle form reshapes into a symbol for it.

- **Next.js 16** (App Router, server components, ISR) · **Three.js** for the sky and particles · **Lenis** smooth scroll
- **Live GitHub heatmap** and "currently building" pill, refreshed from GitHub every hour
- **Studio** at `/studio`: edit projects, log, skills, recognition and resume from the browser. Publishing updates the live site in about a second, no redeploy.

## Run it

```bash
npm install
npm run dev
```

Without any environment variables the site runs on the bundled content in `lib/content/defaults.ts`.

## The studio

Content is one JSON document. The studio writes each published version to Vercel Blob as a new immutable file, keeps the last 12 as history (restorable), and expires the page cache with `updateTag`, so every visitor sees the change on their next request.

### Set it up once

1. **Storage.** In the Vercel dashboard sidebar: *Storage → Create → Blob*, choose **Public** access, then on the store’s *Projects* tab click *Connect to Project*. That adds `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID`.
2. **Secrets.** Run `npm run setup-studio`, choose a password, and paste the printed variables into *Settings → Environment Variables*:
   - `ADMIN_PASSWORD_HASH` (scrypt hash; your password is never stored)
   - `ADMIN_SECRET_KEY` (a second secret you type at login)
   - `SESSION_SECRET` (signs the session cookie; change it to sign out everywhere)
   - `ADMIN_TOTP_SECRET` (optional authenticator-app 2FA)
3. **Redeploy.** Then open `/studio`.

Security: scrypt password hashing, constant-time comparisons, optional TOTP, 5 failed attempts per 15 minutes per IP, an 8-hour httpOnly `SameSite=Strict` session, every server action re-checks the session, all saved links are sanitised to http(s)/mailto, and uploads are limited to images, video and PDF up to 25 MB.

## Where things live

| Path | What |
| --- | --- |
| `lib/content/` | Content types, bundled defaults, validation and the Blob-backed store |
| `components/scene/` | Sky shader, particle shapes and the WebGL canvas |
| `components/site/` | Page sections; `Voyage.tsx` is the pinned project flight |
| `app/studio/` | Studio page and server actions |
| `lib/auth.ts` | Password, secret key, TOTP and sessions |

## Performance notes

- Three.js loads after first paint; the hero text is server-rendered.
- Particle count, pixel ratio, cloud detail and frame rate scale down on phones and low-memory devices.
- Blur on flying panels is desktop-only; phones use opacity and depth.
- `prefers-reduced-motion` turns off smooth scroll, letter animations and particle drift.
