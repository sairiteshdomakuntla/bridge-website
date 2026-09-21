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
GitHub Pages, Nginx). No server, no env vars.

The site uses client-side routing (`react-router-dom`): every section has its
own URL (`/features`, `/security`, `/permissions`, `/download`, …) plus
`/privacy` (Play Store disclosure — `/privacy-policy` also works as an alias). `vercel.json` contains the SPA
fallback rewrite; for other hosts, redirect all non-file paths to `/index.html`.
