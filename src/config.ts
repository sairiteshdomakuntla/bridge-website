/**
 * Single place to wire up real download URLs when they go live.
 * Until then the Download section points at the release hub (#download)
 * and shows version + requirements honestly.
 */
export const SITE = {
  appVersion: '1.0.0',
  androidVersionCode: '2',
  windowsInstaller: 'Bridge-Windows-1.0.0-Setup.exe',
  androidApk: 'Bridge-Android-v1.0.0.apk',

  // TODO: paste real links here when the Play Store listing + hosted .exe are live.
  playStoreUrl: '#download',
  windowsDownloadUrl: '#download',
  releasesUrl: '#download',
  supportEmail: 'hello@bridge.local',
} as const;
