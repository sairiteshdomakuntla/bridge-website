/**
 * Launch mode switch — the ONLY value you need to change to go public.
 *
 *   LAUNCH_MODE = "waitlist"  → install/download CTAs become a waitlist signup.
 *   LAUNCH_MODE = "public"    → original download/install experience, untouched.
 *
 * Can also be set without code changes via the Vite env var:
 *   VITE_LAUNCH_MODE=public npm run build
 */
export type LaunchMode = 'waitlist' | 'public';

function resolveLaunchMode(): LaunchMode {
  const fromEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.VITE_LAUNCH_MODE as string | undefined)
      : undefined;
  const raw = (fromEnv ?? 'waitlist').toLowerCase();
  return raw === 'public' ? 'public' : 'waitlist';
}

export const LAUNCH_MODE: LaunchMode = resolveLaunchMode();

/** Convenience flag for conditional rendering. */
export const IS_WAITLIST: boolean = LAUNCH_MODE === 'waitlist';

/**
 * Optional waitlist collection endpoint (POST JSON { name, email, platform, createdAt }).
 * Empty by default — signups are kept in the browser (localStorage) so no
 * extra infrastructure is required. Set VITE_WAITLIST_ENDPOINT to a form
 * backend / serverless function URL to also forward signups there.
 */
export const WAITLIST_ENDPOINT: string =
  (typeof import.meta !== 'undefined'
    ? (import.meta.env?.VITE_WAITLIST_ENDPOINT as string | undefined)
    : undefined) ||
  'https://script.google.com/macros/s/AKfycbz2MlNb8dCgNV6kB-8oSoptKzG8SPZbC05x36tcmP9royO5VG8DgmJ6PhZoB6csGWN3Dw/exec';

/** localStorage key used when no endpoint (or in addition to it). */
export const WAITLIST_STORAGE_KEY = 'bridge-waitlist';

/**
 * Download wiring. Binaries are served straight from this site
 * (public/downloads/) so users get one-click installs.
 * SHA-256 hashes below are of the exact files being served —
 * regenerate them whenever the binaries are replaced:
 *   Get-FileHash <file> -Algorithm SHA256
 */
export const SITE = {
  appVersion: '1.0.0',
  androidVersionCode: '2',

  windowsInstaller: 'Bridge-Windows-1.0.0-Setup.exe',
  windowsSize: '83.3 MB',
  windowsSha256: 'CCB8FC852DEA48A079DF73DA0FA3221D64E9D5E452E1457B5CCE853654264BB8',
  windowsDownloadUrl: '/downloads/Bridge-Windows-1.0.0-Setup.exe',

  androidApk: 'Bridge-Android-v1.0.0.apk',
  androidSize: '99.7 MB',
  androidSha256: 'C25561FA9945BD75A5B004347D60EB26FD0FA9E1FFB6B47195A474FB88DB0CB5',
  androidDownloadUrl: '/downloads/Bridge-Android-v1.0.0.apk',

  // TODO: point here once the Play Store listing is live.
  playStoreUrl: '/download',
  releasesUrl: '/download',
  supportEmail: 'sairiteshdomakuntla@gmail.com',
  websiteUrl: 'https://bridgeconnects.vercel.app',
} as const;

/** Short, human-friendly fingerprint: ED3A5454…AA6ACA71 */
export function shortHash(full: string): string {
  return `${full.slice(0, 8)}…${full.slice(-8)}`;
}
