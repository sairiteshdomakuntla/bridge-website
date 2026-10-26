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
  const raw = (fromEnv ?? 'public').toLowerCase();
  return raw === 'waitlist' ? 'waitlist' : 'public';
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
 * Download wiring. Windows installs ship from the GitHub bridge-releases
 * release assets; Android ships from Google Play.
 * Keep windowsSha256/windowsSize matching the exact Setup.exe you upload —
 * regenerate whenever the binary changes:
 *   Get-FileHash <file> -Algorithm SHA256
 */
export const SITE = {
  appVersion: '1.1.0',
  androidVersionCode: '6',

  windowsInstaller: 'Bridge-Windows-1.1.0-Setup.exe',
  windowsSize: '83.3 MB',
  windowsSha256: '53FBCCFE016EC4C00A2543200B4A50D8C863DD649FFFB488C7BF453892A912B5',
  windowsDownloadUrl: 'https://github.com/sairiteshdomakuntla/bridge-releases/releases/download/v1.0.0/Bridge-Windows-1.1.0-Setup.exe',

  // Android is distributed via Google Play — no APK download.
  androidDownloadUrl: 'https://play.google.com/store/apps/details?id=dev.sairitesh.bridge',

  playStoreUrl: 'https://play.google.com/store/apps/details?id=dev.sairitesh.bridge',
  releasesUrl: '/download',
  supportEmail: 'sairiteshdomakuntla@gmail.com',
  websiteUrl: 'https://bridgeconnects.vercel.app',
} as const;

/** Short, human-friendly fingerprint: ED3A5454…AA6ACA71 */
export function shortHash(full: string): string {
  return `${full.slice(0, 8)}…${full.slice(-8)}`;
}

/**
 * Canonical signup path per launch mode. Waitlist mode lives at /waitlist
 * (not /download — there is nothing to download yet); public mode keeps
 * the original /download URL. Use this for every CTA href.
 */
export const SIGNUP_PATH = IS_WAITLIST ? '/waitlist' : '/download';

/** Section id of the signup block, matching SIGNUP_PATH. */
export const SIGNUP_SECTION = IS_WAITLIST ? 'waitlist' : 'download';
