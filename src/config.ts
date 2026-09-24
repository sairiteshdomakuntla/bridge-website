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
