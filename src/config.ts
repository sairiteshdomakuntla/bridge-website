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
  windowsSha256: 'ED3A5454886072B35842EDFAB0BA55F31789328E13D49EDC0460B8C6AA6ACA71',
  windowsDownloadUrl: '/downloads/Bridge-Windows-1.0.0-Setup.exe',

  androidApk: 'Bridge-Android-v1.0.0.apk',
  androidSize: '99.7 MB',
  androidSha256: '4435F02B236054B24DD8226655EA4773543B631A7C3E134B79D764E4EEED3349',
  androidDownloadUrl: '/downloads/Bridge-Android-v1.0.0.apk',

  // TODO: point here once the Play Store listing is live.
  playStoreUrl: '/download',
  releasesUrl: '/download',
  supportEmail: 'sairiteshdomakuntla@gmail.com',
  websiteUrl: 'https://getbridge-awc.vercel.app',
} as const;

/** Short, human-friendly fingerprint: ED3A5454…AA6ACA71 */
export function shortHash(full: string): string {
  return `${full.slice(0, 8)}…${full.slice(-8)}`;
}
