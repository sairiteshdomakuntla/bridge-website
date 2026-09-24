export type Perm = {
  perm: string;
  platform: 'android' | 'windows';
  why: string;
  when: string;
  ifDenied: string;
};

export const PERMS: Perm[] = [
  {
    perm: 'android.permission.INTERNET + ACCESS_NETWORK_STATE',
    platform: 'android',
    why: 'Bridge talks to your PC over your local Wi-Fi network (Socket.IO on port 4000). There is no cloud relay, so local networking is the entire transport.',
    when: 'Granted at install. No prompt — but Bridge only ever connects to the IP you pair with via QR.',
    ifDenied: 'Cannot be denied. If your VPN or firewall blocks LAN traffic, pairing will simply fail — Bridge tells you so.',
  },
  {
    perm: 'Notification access (BIND_NOTIFICATION_LISTENER_SERVICE)',
    platform: 'android',
    why: 'This is how your texts and chat messages reach your PC. Android delivers a structured copy of each notification to Bridge, which forwards title + text over the encrypted socket. Direct reply and dismiss go back through the same channel.',
    when: 'Only when you open Bridge → Notifications and flip the toggle. Android takes you to system Settings; Bridge never enables it silently.',
    ifDenied: 'No notification mirroring. Everything else keeps working. You can enable it later any time.',
  },
  {
    perm: 'android.permission.CAMERA',
    platform: 'android',
    why: 'Powers “phone as camera”: the WebRTC video track that turns your phone into a wireless webcam for the PC. Frames go peer-to-peer over your LAN, never to a server.',
    when: 'Only the first time you open the Camera screen in Bridge.',
    ifDenied: 'Camera screen shows an explanatory empty state. Clipboard, files, notifications and remote keep working.',
  },
  {
    perm: 'android.permission.POST_NOTIFICATIONS',
    platform: 'android',
    why: 'The persistent Bridge notification hosts the “Sync Now” action — the one-tap path that syncs your clipboard under Android’s foreground-window rules — plus connection status and the find-my-phone ringing controls.',
    when: 'On first launch (Android 13+).',
    ifDenied: 'You lose the one-tap Sync Now shortcut and status updates. In-app sync still works when Bridge is open.',
  },
  {
    perm: 'FOREGROUND_SERVICE (+ FOREGROUND_SERVICE_DATA_SYNC)',
    platform: 'android',
    why: 'Keeps the encrypted socket to your PC alive while Bridge runs, so clipboard, files and notifications arrive without reopening the app. Type is dataSync — nothing more.',
    when: 'Granted at install; the service only starts after you pair a PC.',
    ifDenied: 'Cannot be denied per-permission, but killing Bridge or disabling background activity disconnects the session. Reopen to reconnect.',
  },
  {
    perm: 'Local network server + input injection',
    platform: 'windows',
    why: 'The Windows agent hosts the Socket.IO server (port 4000), shows the pairing QR, and applies what your phone sends: pasting clipboard, typing remote keystrokes, moving the cursor, pressing media keys.',
    when: 'Windows Firewall asks once on first launch — allow “private networks” so your phone can reach the PC. Input happens only from your paired phone, only while connected.',
    ifDenied: 'Pairing fails (firewall) or remote input does nothing. Clipboard history already received stays readable.',
  },
];

export const FAQS = [
  {
    q: 'Do I need to be technical to use Bridge?',
    a: 'Not at all. If you can copy-paste and scan a QR code, you can use Bridge. Install both apps, join the same Wi-Fi, scan once — then it just works in the background.',
  },
  {
    q: 'Where does my data go? Is this another cloud app?',
    a: 'No. Everything travels directly between your phone and your PC over your own Wi-Fi. There is no account, no uploading, no tracking. Turn off your internet (keep Wi-Fi on) and Bridge still works.',
  },
  {
    q: 'Why do I tap “Sync Now” after copying?',
    a: 'Android only lets the app you are currently using see what you copied — it is a privacy rule built into every Android phone. So you copy, tap Sync Now once on the Bridge notification, then paste on your PC. One extra tap, and your data stays safe.',
  },
  {
    q: 'Why does Bridge ask to read my notifications?',
    a: 'Only so your texts can show up on your computer with reply. You turn it on yourself in Settings, you can turn it off any time, and nothing is ever uploaded anywhere.',
  },
  {
    q: 'Do I need an account? Are you tracking me?',
    a: 'No account, no sign-in, no tracking in v1. Pairing is just a QR code on your PC screen scanned by your phone.',
  },
  {
    q: 'How is this different from Phone Link?',
    a: 'Phone Link needs a Microsoft account and the internet. Bridge needs neither — just your Wi-Fi. It also does things Phone Link does not: send files either way, use your phone as a webcam or remote, and ring your phone even on silent.',
  },
  {
    q: 'What do I need to run it?',
    a: 'A Windows 10/11 PC and an Android phone on the same Wi-Fi, plus about two minutes. Install both apps, scan the code, done.',
  },
  {
    q: 'Is Bridge safe to install? My PC warned me.',
    a: 'Yes — that warning just means the app is new. Windows flags any new, unsigned installer, and Android flags any app installed outside the Play Store. As long as you downloaded from this site, on your own Wi-Fi, you are good. You can remove permissions or uninstall any time.',
  },
];
