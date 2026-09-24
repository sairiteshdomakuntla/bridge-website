# Bridge — website

Promotional + trust website for **Bridge** (Android ↔ Windows continuity).
Vite + React + TypeScript, zero UI dependencies — all styling is hand-written
in `src/styles.css`.

## Run

```powershell
npm install
npm run dev      # http://localhost:5174
npm run build    # static output in dist/
npm run preview
```

## Launch mode: waitlist vs public

One value in `src/config.ts` controls the whole site:

```ts
LAUNCH_MODE = "waitlist"   // CTAs become a waitlist signup (default)
LAUNCH_MODE = "public"     // original download/install experience, untouched
```

It reads `VITE_LAUNCH_MODE` when set, so you can also switch with no code
changes (see `.env.example`):

```powershell
$env:VITE_LAUNCH_MODE="public"; npm run build   # public downloads
$env:VITE_LAUNCH_MODE="waitlist"; npm run build # waitlist (default)
```

Going public needs nothing else — the original download UI (`DownloadGrid` in
`src/App.tsx`) is kept verbatim and simply re-rendered.

Waitlist signups are stored in browser `localStorage` (the site is fully
static — no backend/database exists in this repo). To also forward signups to
a real collector, set `VITE_WAITLIST_ENDPOINT` to a URL that accepts
`POST { name, email, platform, createdAt }` — no code changes required.

## Going live with real downloads

All download links live in one place: `src/config.ts`

```ts
playStoreUrl, windowsDownloadUrl, releasesUrl, supportEmail
```

They currently point at `/download`. Paste the Play Store listing URL and the
hosted `.exe` URL there when ready, along with the SHA-256 in the Download
section. Bump `appVersion` / file names per release.

## Deploy

`dist/` is fully static — host it anywhere (Vercel, Netlify, Cloudflare Pages,
GitHub Pages, Nginx). No server; `VITE_LAUNCH_MODE` / `VITE_WAITLIST_ENDPOINT`
are optional build-time env vars (see `.env.example`).

The site uses client-side routing (`react-router-dom`): every section has its
own URL (`/features`, `/security`, `/permissions`, `/faq`, …) plus
`/privacy` (Play Store disclosure — `/privacy-policy` also works as an alias).
The signup block lives at `/waitlist` in waitlist mode and `/download` in
public mode (`/download`, `/waitlist`, `/join` are kept as aliases so old
links never 404). `vercel.json` contains the SPA
fallback rewrite; for other hosts, redirect all non-file paths to `/index.html`.
