import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SITE, shortHash } from './config';
import Privacy from './Privacy';

/* ---------------- hooks ---------------- */

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    const watch = (root: ParentNode) => {
      root.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    };
    watch(document);
    // Tabs / accordions mount fresh .reveal nodes after first paint —
    // keep watching so they can never get stuck invisible.
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.classList.contains('reveal') && !n.classList.contains('in')) io.observe(n);
            watch(n);
          }
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

const ROTATE_WORDS = ['copy', 'paste', 'reply', 'present', 'share'];

/** Deep-link support: /features, /security … scroll to the matching section. */
function useSectionScroll(section?: string) {
  useEffect(() => {
    if (!section) {
      window.scrollTo(0, 0);
      return;
    }
    const t = setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 60);
    return () => clearTimeout(t);
  }, [section]);
}

function useRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ROTATE_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return ROTATE_WORDS[i];
}

/* ---------------- data ---------------- */

type Perm = {
  perm: string;
  platform: 'android' | 'windows';
  why: string;
  when: string;
  ifDenied: string;
};

const PERMS: Perm[] = [
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
    why: 'This is how your texts, OTPs and chat messages reach your PC. Android delivers a structured copy of each notification to Bridge, which forwards title + text over the encrypted socket. Direct reply and dismiss go back through the same channel.',
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

const FAQS = [
  {
    q: 'Is Bridge a cloud service? Where does my data go?',
    a: 'Nowhere except between your two devices. Bridge opens a direct Socket.IO connection over your local network (usually Wi-Fi) and encrypts every message with AES-256-GCM. There is no account, no relay server, no analytics endpoint. Unplug your router from the internet and Bridge still works.',
  },
  {
    q: 'Why does Android clipboard sync need a “Sync Now” tap?',
    a: 'Since Android 10, the OS only hands clipboard contents to the app whose window is currently focused (the isUidFocused gate in ClipboardService). No third-party app can poll it in the background — not with a foreground service, not with accessibility. So the flow is: copy anywhere → tap Sync Now on the Bridge notification (a transparent activity that briefly holds focus) → paste on Windows. One tap, and the reason is the OS, not us. We document this instead of pretending otherwise.',
  },
  {
    q: 'Why does Bridge ask for notification access? That sounds scary.',
    a: 'It is a powerful permission, so here is exactly what happens: Android hands Bridge the same structured notification data any listener gets (app name, title, text). Bridge forwards it over the encrypted LAN socket to your PC and deletes nothing, uploads nothing. Reply/dismiss actions travel back the same way. You grant it in system Settings, you can revoke it there any time, and mirroring stops instantly.',
  },
  {
    q: 'Do I need an account? Is there telemetry?',
    a: 'No account, no sign-in, no telemetry in v1. Pairing is a QR code shown on your PC and scanned by your phone — a 256-bit secret encoded out-of-band that becomes your AES key. Keys live in Windows DPAPI-backed safeStorage and the Android Keystore, never in plain text.',
  },
  {
    q: 'Phone Link / KDE Connect already exist. Why Bridge?',
    a: 'Phone Link needs a Microsoft account and routes through the cloud; KDE Connect is excellent but broad and fiddly for some Windows setups. Bridge is narrower and opinionated: Android + Windows, LAN-only, QR pairing in seconds, clipboard (text + images), file transfer via Share Sheet, notification reply, phone-as-trackpad/keyboard/media-remote, and phone-as-camera — with every permission justified on this page.',
  },
  {
    q: 'What do I need to run it?',
    a: 'A Windows 10/11 PC and an Android phone on the same local network, plus about two minutes. Install the Windows agent, install the Android app, scan the QR on your PC screen. No router configuration, no accounts, no cable.',
  },
  {
    q: 'Is Bridge open source?',
    a: 'Not yet. The protocol and permission model are documented openly on this page (including the wire format), and the plan is to open the code once the v1 release is stable. Until then, judge us by specificity: everything Bridge does is listed under Permissions with reasons.',
  },
  {
    q: 'My firewall / Play Protect warns me. Is it safe?',
    a: 'Expected, and safe to proceed — with eyes open. The Windows agent is new, so SmartScreen may flag the unsigned installer; the APK installs outside the Play Store, so Android shows the standard sideload prompt. Both warnings exist because the apps are new and self-distributed, not because of malicious behavior. Verify the file names and versions in the Download section, keep both devices on your own network, and revoke permissions any time.',
  },
];

/* ---------------- small pieces ---------------- */

function WindowsGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2.5" y="3.5" width="9" height="8" rx="1.5" />
      <rect x="12.5" y="3.5" width="9" height="8" rx="1.5" />
      <rect x="2.5" y="12.5" width="9" height="8" rx="1.5" />
      <rect x="12.5" y="12.5" width="9" height="8" rx="1.5" />
    </svg>
  );
}

function AndroidGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.4 5 6.8 3.2M15.6 5l1.6-1.8" />
      <path d="M5 11.2a7 7 0 0 1 14 0" />
      <path d="M5 11.2h14" />
      <circle cx="9.4" cy="8.6" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="8.6" r="0.5" fill="currentColor" stroke="none" />
      <path d="M8.5 13.4v5.4M15.5 13.4v5.4M5.9 14.4v3.6M18.1 14.4v3.6" />
    </svg>
  );
}

function Logo({ size = 26 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Bridge logo"
      width={size}
      height={size}
      className="nav-logo-mark-img"
      style={{ width: size, height: size, borderRadius: Math.max(6, size * 0.28), display: 'block' }}
    />
  );
}

/* ---------------- main ---------------- */

function Home({ section }: { section?: string }) {
  useReveal();
  useSectionScroll(section);
  const word = useRotator();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tour, setTour] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (glow.current) {
        glow.current.style.left = e.clientX + 'px';
        glow.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="grain">
      <div id="cursor-glow" ref={glow} />

      {/* ---------- nav ---------- */}
      <div className="nav-shell">
        <nav className="nav">
          <a className="nav-logo" href="/">
            <Logo />
            <span>Bridge</span>
          </a>
          <div className="nav-links">
            <a href="/features">Features</a>
            <a href="/tour">Tour</a>
            <a href="/security">Security</a>
            <a href="/permissions">Permissions</a>
            <a href="/download">Download</a>
            <a href="/faq">FAQ</a>
          </div>
          <a className="nav-cta" href="/download">Get Bridge</a>
          <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </div>
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <a href="/features">Features</a>
          <a href="/tour">Tour</a>
          <a href="/security">Security</a>
          <a href="/permissions">Permissions</a>
          <a href="/download">Download</a>
          <a href="/faq">FAQ</a>
        </div>
      )}

      {/* ---------- hero ---------- */}
      <header className="hero" id="top">
        <div className="hero-beams" />
        <div className="hero-grid" />
        <div className="wrap hero-inner">
          <div className="hero-badge">
            <Logo size={20} />
            Android ↔ Windows continuity
            <span className="ver">v{SITE.appVersion}</span>
          </div>
          <h1>
            Your phone and PC,
            <br />
            finally <span className="grad">in sync.</span>
          </h1>
          <p className="hero-sub" style={{ marginTop: 18 }}>
            <span className="rotator">
              <span className="rotator-word" key={word}>
                {word}
              </span>
            </span>{' '}
            on your phone, land on your PC. Clipboard, files, notifications, texts, even your
            phone-as-trackpad — <strong>over your own Wi-Fi, encrypted, with no account and no cloud.</strong>
          </p>
          <div className="hero-ctas">
            <a className="btn btn-specular" href="/download">
              <span className="os-glyph"><WindowsGlyph size={14} /></span> Download for Windows
            </a>
            <a className="btn btn-ghost" href="/download">
              <span className="os-glyph"><AndroidGlyph size={14} /></span> Get for Android
            </a>
          </div>
          <div className="hero-trust">
            <span className="trust-chip"><i />LAN-only · no cloud relay</span>
            <span className="trust-chip"><i />AES-256-GCM end-to-end</span>
            <span className="trust-chip"><i />No account · no telemetry</span>
            <span className="trust-chip"><i />QR pairing · 10 seconds</span>
          </div>

          {/* product stage */}
          <div className="stage">
            <div className="stage-frame">
              <div className="win-bar">
                <div className="lights">
                  <i style={{ background: '#fb7185' }} />
                  <i style={{ background: '#fbbf24' }} />
                  <i style={{ background: '#5eead4' }} />
                </div>
                <div className="addr"><b>● LAN</b> 192.168.1.4 : 4000 · encrypted</div>
              </div>
              <div className="stage-body">
                <div className="win-main">
                  <div className="clip-card">
                    <div className="meta"><span className="src">phone → pc</span><span className="time">just now</span></div>
                    <p>“OTP for the deployment is 482 916 — expires in 4 min”</p>
                    <div className="paste-hint">⌘V / Ctrl+V to paste anywhere on Windows</div>
                  </div>
                  <div className="notif-row">
                    <div className="avatar">A</div>
                    <div style={{ flex: 1 }}>
                      <b>WhatsApp · Alice</b>
                      <small>“Send me the files when the build passes?”</small>
                      <div className="reply">
                        <input defaultValue="On it — pushing now" readOnly />
                        <button>Reply</button>
                      </div>
                    </div>
                  </div>
                  <div className="clip-card">
                    <div className="meta"><span className="src">share sheet → pc</span><span className="time">12s ago</span></div>
                    <p>📁 design-specs.pdf · received via share sheet</p>
                  </div>
                </div>
                <div className="phone-col">
                  <div className="phone-mock">
                    <div className="phone-screen">
                      <div className="notch" />
                      <div style={{ fontSize: 13, fontWeight: 650 }}>Bridge</div>
                      <div className="mono" style={{ fontSize: 11, color: '#5eead4' }}>● connected · Home Wi-Fi</div>
                      <div className="qr-box">
                        <div className="qr-grid" />
                        <div className="mono" style={{ fontSize: 11, color: '#a1a1aa' }}>paired · AES-256-GCM</div>
                      </div>
                      <div className="sync-toast"><span className="ring" /><span>Synced clipboard → PC</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stage-caption">
              <span><b>← phone</b> copy, files, reply</span>
              <span><b>pc →</b> paste, type, present</span>
              <span><b>⇄</b> same Wi-Fi · nothing leaves the room</span>
            </div>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} style={{ display: 'contents' }}>
                <span><b>universal clipboard</b> · text + images</span>
                <span>file transfer → <b>share sheet to pc</b></span>
                <span>reply to <b>texts from desktop</b></span>
                <span>phone as <b>trackpad + keyboard</b></span>
                <span>phone as <b>camera</b></span>
                <span><b>find my phone</b> + battery</span>
                <span><b>no account</b> · no cloud</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ---------- story ---------- */}
      <section className="block" id="story">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Why Bridge exists</span>
            <h2>You live in two machines. <span className="thin">It shouldn’t feel like it.</span></h2>
            <p>Apple users got Continuity a decade ago. Android + Windows users got cables, email-to-self, and cloud detours. Bridge is the missing layer — built local-first, because your clipboard should never take a world tour.</p>
          </div>
          <div className="story-grid">
            <div className="story-card reveal">
              <span className="tag">✕ the old way</span>
              <h3>Copy on phone. Email it to yourself. Open laptop. Download. Paste.</h3>
              <p>OTPs expire. Files get stuck in email drafts. Replies wait until you find your phone under a pillow. Every hop is a cloud server reading over your shoulder.</p>
            </div>
            <div className="story-card after reveal">
              <span className="tag">✓ the Bridge way</span>
              <h3>Copy on phone. Paste on PC. That’s the whole manual.</h3>
              <p>One QR scan pairs your devices over your own Wi-Fi. From then on your clipboard, notifications, files and even your phone’s camera just show up where you’re working.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- features ---------- */}
      <section className="block" id="features">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">What it does</span>
            <h2>Six jobs, <span className="thin">one quiet app.</span></h2>
            <p>Bridge isn’t a dashboard you manage. It’s plumbing — features that disappear into muscle memory within a day.</p>
          </div>
          <div className="bento">
            <div className="bcard reveal">
              <div className="icon">📋</div>
              <h3>Universal clipboard — text & images</h3>
              <p>Copy text or an image on Android, paste it on Windows with <code>Ctrl+V</code>. History is kept on both sides, echo-proofed by an event-dedupe store so nothing pastes twice. Copy in any app → tap <code>Sync Now</code> → paste on PC.</p>
              <div className="foot"><b>→</b> one tap, thanks to Android 10+ focus rules (explained honestly below)</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">📁</div>
              <h3>File transfer & Share Sheet</h3>
              <p>Send files, photos, videos, or documents directly to your PC. Tap Share in any Android app and choose Bridge, or pick and send files directly from the app dashboard.</p>
              <div className="foot"><b>→</b> 64 KB chunks + SHA-256 checks</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">💬</div>
              <h3>Texts, answered from your keyboard</h3>
              <p>WhatsApp, Telegram, SMS — they surface on Windows with inline reply and dismiss. Your full-size keyboard finally answers your phone.</p>
              <div className="foot"><b>→</b> uses notification access, nothing else</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">▦</div>
              <h3>Phone as trackpad & remote</h3>
              <p>Trackpad with natural scrolling, a keyboard tab, media keys, volume and mute — plus a sensitivity slider. Couch-present like you mean it.</p>
              <div className="foot"><b>→</b> ~60 Hz deltas, fire-and-forget</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">🎥</div>
              <h3>Phone as camera for your PC</h3>
              <p>A WebRTC video track turns your phone into a wireless webcam over the same encrypted LAN link. Great cameras, zero new hardware.</p>
              <div className="foot"><b>→</b> peer-to-peer, no relay server</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">🔔</div>
              <h3>Find My Phone & battery monitor</h3>
              <p>Misplaced your phone under a cushion? Click “Ring phone” from your Windows dashboard to sound an alert even on silent, and monitor your live battery level.</p>
              <div className="foot"><b>→</b> rings ~15s at max volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- tour ---------- */}
      <section className="block" id="tour">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">A day with Bridge</span>
            <h2>Follow one copy <span className="thin">through the whole loop.</span></h2>
          </div>
          <div className="dock reveal">
            {['Clipboard', 'Notifications', 'Remote', 'Camera'].map((t, i) => (
              <button key={t} type="button" className={tour === i ? 'active' : ''} onClick={() => setTour(i)}>{t}</button>
            ))}
          </div>
          <div className="tour-panel" key={tour}>
            {tour === 0 && (
              <>
                <div>
                  <h3><span className="n">01 / CLIPBOARD</span>Copy there. Paste here.</h3>
                  <p>The flow your hands learn in minutes. Text, links, OTPs, images — everything rides the same encrypted envelope.</p>
                  <ul className="tour-list">
                    <li>Copy anything on your phone, in any app</li>
                    <li>Tap Sync Now on the Bridge notification</li>
                    <li>Press <span className="kbd">Ctrl</span> + <span className="kbd">V</span> on Windows — done</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <div className="clip-card"><div className="meta"><span className="src">phone → pc</span><span className="time">now</span></div><p>github.com/release — v1.0.0 is out 🎉</p></div>
                  <div className="clip-card"><div className="meta"><span className="src">pc → phone</span><span className="time">2m</span></div><p>Meet link: 6pm, bring the demo build</p></div>
                  <div className="mono" style={{ fontSize: 12, color: '#6b6b76' }}>dedupe: 2 events · 0 echoes · ✓ encrypted</div>
                </div>
              </>
            )}
            {tour === 1 && (
              <>
                <div>
                  <h3><span className="n">02 / NOTIFICATIONS</span>Your chats, at full typing speed.</h3>
                  <p>Messages arrive on Windows the moment they hit your phone. Reply inline, dismiss the noise, never pick the phone up mid-flow.</p>
                  <ul className="tour-list">
                    <li>WhatsApp, Telegram, SMS + any notifying app</li>
                    <li>Inline reply and dismiss from Windows</li>
                    <li>Revoke listener access any time — mirroring stops dead</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <div className="notif-row"><div className="avatar">S</div><div><b>SMS · Bank</b><small>Your OTP is 482 916. Valid 4 min.</small></div></div>
                  <div className="notif-row"><div className="avatar tg">T</div><div style={{ flex: 1 }}><b>Telegram · Design group</b><small>“Final mock is in Figma — review?”</small><div className="reply"><input defaultValue="Looking now 👀" readOnly /><button>Send</button></div></div></div>
                </div>
              </>
            )}
            {tour === 2 && (
              <>
                <div>
                  <h3><span className="n">03 / REMOTE</span>The couch is now a control room.</h3>
                  <p>Trackpad, keyboard, media keys. Scroll a doc, flip slides, pause the movie — phone in hand, feet up.</p>
                  <ul className="tour-list">
                    <li>Trackpad with natural two-finger scroll</li>
                    <li>Keyboard tab + Enter / Backspace / Space</li>
                    <li>Play, next, volume, mute — media-focus aware</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <div className="trackpad"><span className="cursor" /></div>
                  <div className="mediakeys"><span>⏯ play</span><span>⏭ next</span><span>🔊 vol+</span><span>🔉 vol−</span><span>⛔ mute</span></div>
                  <div className="mono" style={{ fontSize: 12, color: '#6b6b76', marginTop: 12 }}>sensitivity 1.8× · 60 Hz · LAN latency ≈ ms</div>
                </div>
              </>
            )}
            {tour === 3 && (
              <>
                <div>
                  <h3><span className="n">04 / CAMERA</span>Your best webcam is in your pocket.</h3>
                  <p>One tap turns the phone into a wireless camera for the PC — over the same encrypted LAN peer connection.</p>
                  <ul className="tour-list">
                    <li>WebRTC video, phone → PC, no relay</li>
                    <li>Find-my-phone ring + live battery alongside</li>
                    <li>Nothing recorded, nothing uploaded</li>
                  </ul>
                </div>
                <div className="tour-visual" style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 44 }}>🎥</div>
                    <div className="mono" style={{ fontSize: 12, color: '#5eead4', marginTop: 8 }}>● live · 1280×720 · LAN peer</div>
                    <div className="mono" style={{ fontSize: 12, color: '#6b6b76', marginTop: 4 }}>🔋 78% · not charging</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="block" id="setup">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Setup · two minutes</span>
            <h2>Pair once. <span className="thin">Forget it exists.</span></h2>
            <p>No accounts, no cables, no router surgery. If both devices share a Wi-Fi network, you’re done.</p>
          </div>
          <div className="steps">
            <div className="step reveal"><div className="num">1</div><h3>Install both halves</h3><p>Windows agent on your PC, Bridge app on your Android phone. Links in <a href="/download" style={{ color: '#c4d3ff' }}>Download</a> — one <code>.exe</code>, one <code>.apk</code> / Play listing.</p></div>
            <div className="step reveal"><div className="num">2</div><h3>Join the same Wi-Fi</h3><p>Phone and PC on the same local network. Bridge auto-selects the right LAN adapter and ignores virtual ones (VMs, VPNs, WSL).</p></div>
            <div className="step reveal"><div className="num">3</div><h3>Scan the QR on your PC</h3><p>The PC shows a QR encoding <code>ip + port + 256-bit key</code>. Scan it with Bridge. Handshake verifies, AES-GCM switches on, and you’re paired — keys stored in the OS keychain on both sides.</p></div>
          </div>
        </div>
      </section>

      {/* ---------- security ---------- */}
      <section className="block" id="security">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Trust, engineered</span>
            <h2>Your data never leaves the room. <span className="thin">Here’s the proof.</span></h2>
            <p>“We take privacy seriously” is cheap. Architecture is expensive. So here is ours, down to the byte layout.</p>
          </div>
          <div className="sec-grid">
            <div className="diagram reveal">
              <div className="node"><div className="glyph">📱</div><div><b>Android app</b><small>flutter_secure_storage · Keystore</small></div></div>
              <div className="link">⇅ AES-256-GCM · bridge-message · your Wi-Fi only</div>
              <div className="node"><div className="glyph" style={{ color: '#8fb0ff' }}><WindowsGlyph size={18} /></div><div><b>Windows agent</b><small>Electron safeStorage · DPAPI</small></div></div>
              <div className="blocked"><span>🚫</span><span><b>No cloud.</b> No relay, no account server, no analytics endpoint. Offline router? Still works.</span></div>
            </div>
            <div className="codeblock reveal">
              <div className="chead"><span style={{ color: '#fb7185' }}>●</span><span style={{ color: '#fbbf24' }}>●</span><span style={{ color: '#5eead4' }}>●</span>&nbsp; every packet on the wire</div>
              <pre>{`// one Socket.IO event, always encrypted
socket.emit('bridge-message', base64([
  nonce      // 12 random bytes
  ciphertext // your JSON envelope
  tag        // 16-byte GCM auth tag
]))

// inside, after decrypt:
{ eventId, type, origin, timestamp, payload }
// types: clipboard · file · notification
//        remote-input · device · camera-signal`}</pre>
            </div>
          </div>
          <div className="assurance">
            {[
              ['🔑', 'QR-paired keys', 'A fresh 256-bit secret per pairing, delivered out-of-band via QR. Never typed, never transmitted in clear.'],
              ['💾', 'OS-grade key storage', 'Windows DPAPI + Electron safeStorage. Android Keystore via secure storage. No plaintext secrets on disk.'],
              ['🔁', 'Echo-proof sync', 'Both sides keep a capped event-dedupe store, so a synced paste never loops back and pastes twice.'],
              ['📴', 'Revocable by design', 'Unpair from either side and keys are wiped. Revoke Android permissions and that feature simply stops.'],
            ].map(([icon, title, body]) => (
              <div className="assure reveal" key={title}><span className="big">{icon}</span><b>{title}</b><p>{body}</p></div>
            ))}
          </div>
          <div className="honest reveal">
            <span className="flag">⚠️</span>
            <div>
              <h3>An honest limitation: why clipboard needs one tap</h3>
              <p>Since Android 10, <code>ClipboardManager</code> only answers the app holding the focused window (<code>isUidFocused</code> in AOSP’s ClipboardService). No foreground service, accessibility hack, or background permission changes that for third-party apps. So Bridge doesn’t pretend:</p>
              <ul>
                <li>Copy anywhere → tap <b>Sync Now</b> on the Bridge notification → paste on PC.</li>
                <li>The notification action opens a transparent activity that briefly holds real focus — the same gate as opening the app — then routes through the normal pipeline.</li>
                <li>If Android ever opens a legitimate background path, we’ll adopt it. Until then: one tap, zero shenanigans.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- permissions ---------- */}
      <section className="block" id="permissions">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Full disclosure</span>
            <h2>Every permission. <span className="thin">Every reason.</span></h2>
            <p>Apps like Bridge need sensitive access to do anything useful. So here is the complete ledger — what, why, when you’re asked, and what breaks if you say no. Written for people who actually read this stuff.</p>
          </div>
          <div className="perm-intro reveal">
            <span className="trust-chip"><i />8 entries · 0 hidden</span>
            <span className="trust-chip"><i />requested only when the feature needs it</span>
            <span className="trust-chip"><i />everything revocable</span>
          </div>
          <div className="perm-table reveal">
            <div className="perm-row head"><div>Permission / capability</div><div>Why · when · if denied</div></div>
            {PERMS.map((p) => (
              <div className="perm-row" key={p.perm}>
                <div className="perm-name">
                  <code>{p.perm}</code>
                  <span className={`plat ${p.platform}`}>{p.platform}</span>
                </div>
                <div className="perm-detail">
                  <p className="why">{p.why}</p>
                  <div className="meta">
                    <div><dt>Asked</dt><dd>{p.when}</dd></div>
                    <div><dt>If denied</dt><dd className="deny">{p.ifDenied}</dd></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- compare ---------- */}
      <section className="block" id="compare">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Honest comparison</span>
            <h2>How Bridge <span className="thin">stacks up.</span></h2>
          </div>
          <div className="compare reveal">
            <table>
              <thead><tr><th></th><th className="bridge-col">Bridge</th><th>Phone Link</th><th>KDE Connect</th></tr></thead>
              <tbody>
                <tr><td>Account required</td><td className="bcol">None</td><td className="mid">Microsoft account</td><td className="yes">None</td></tr>
                <tr><td>Works fully offline (LAN-only, no cloud relay)</td><td className="bcol">Yes</td><td className="no">No — needs internet</td><td className="yes">Yes</td></tr>
                <tr><td>Pairing effort</td><td className="bcol">10-second QR scan</td><td className="mid">Sign-in + codes + retries</td><td className="mid">Manual accept on both sides</td></tr>
                <tr><td>Clipboard text + images, both directions</td><td className="bcol">Yes</td><td className="mid">Text only, Samsung-limited</td><td className="yes">Yes</td></tr>
                <tr><td>Notification reply from PC, any app</td><td className="bcol">Yes</td><td className="mid">Mostly Samsung devices</td><td className="mid">Partial</td></tr>
                <tr><td>Trackpad + keyboard + media keys, one screen</td><td className="bcol">Yes</td><td className="no">—</td><td className="mid">Partial, via plugins</td></tr>
                <tr><td>Phone as PC camera over LAN</td><td className="bcol">Yes, encrypted WebRTC</td><td className="no">—</td><td className="mid">Via plugins</td></tr>
                <tr><td>Send any file via Android share sheet</td><td className="bcol">Yes, one tap</td><td className="mid">Photos only</td><td className="yes">Yes</td></tr>
                <tr><td>Ring phone on silent + live battery on PC</td><td className="bcol">Yes</td><td className="no">—</td><td className="mid">Partial</td></tr>
                <tr><td>Every permission documented with reasons</td><td className="bcol">This page ↑</td><td className="no">—</td><td className="no">—</td></tr>
                <tr><td>Telemetry / data leaves your network</td><td className="bcol">None, ever</td><td className="mid">Account-linked diagnostics</td><td className="yes">None</td></tr>
              </tbody>
            </table>
          </div>
          <p className="compare-note reveal">TL;DR — Phone Link taxes you with an account and the cloud. KDE Connect is great but broad and fiddly. Bridge is the narrow, opinionated one: Android + Windows, paired in seconds, with the tricks neither of them has.</p>
        </div>
      </section>

      {/* ---------- download ---------- */}
      <section className="block" id="download">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Get Bridge · v{SITE.appVersion}</span>
            <h2>Two installs. <span className="thin">Two minutes.</span></h2>
            <p>You need <b>both halves</b> — the Windows agent and the Android app — on the same Wi-Fi network.</p>
          </div>
          <div className="dl-grid">
            <div className="dl-card featured reveal">
              <div className="os"><div className="glyph win"><WindowsGlyph size={24} /></div><div><h3>Bridge for Windows</h3><div className="file mono">{SITE.windowsInstaller} · Windows 10 / 11 · 64-bit</div></div></div>
              <ul>
                <li>Pairing QR + connection dashboard</li>
                <li>Clipboard history, notifications + reply</li>
                <li>Remote input receiver, camera viewer</li>
              </ul>
              <a className="btn btn-specular" href={SITE.windowsDownloadUrl} download={SITE.windowsInstaller} style={{ width: '100%', justifyContent: 'center' }}>Download .exe · {SITE.windowsSize}</a>
              <div className="mono" style={{ fontSize: 11.5, color: '#6b6b76', marginTop: 12, textAlign: 'center' }} title={SITE.windowsSha256}>SHA-256: {shortHash(SITE.windowsSha256)}</div>
            </div>
            <div className="dl-card reveal">
              <div className="os"><div className="glyph droid"><AndroidGlyph size={24} /></div><div><h3>Bridge for Android</h3><div className="file mono">{SITE.androidApk} · Android 8.0+ · v{SITE.appVersion} ({SITE.androidVersionCode})</div></div></div>
              <ul>
                <li>Sync Now clipboard shortcut</li>
                <li>Share-sheet → send any file to PC</li>
                <li>Trackpad, camera, ring-my-phone</li>
              </ul>
              <a className="btn btn-ghost" href={SITE.androidDownloadUrl} download={SITE.androidApk} style={{ width: '100%', justifyContent: 'center' }}>Download .apk · {SITE.androidSize}</a>
              <div className="mono" style={{ fontSize: 11.5, color: '#6b6b76', marginTop: 12, textAlign: 'center' }} title={SITE.androidSha256}>SHA-256: {shortHash(SITE.androidSha256)}</div>
            </div>
          </div>
          <div className="dl-note reveal">
            <b>First-run notes (read once, smooth forever):</b>
            <ol>
              <li><b>Windows SmartScreen</b> may flag the installer since it’s newly published and unsigned — click “More info → Run anyway”. Cautious? Match the SHA-256 fingerprint above after downloading.</li>
              <li><b>Windows Firewall</b> will ask about private-network access on first launch — allow it, or your phone can’t reach the PC.</li>
              <li><b>Android sideload:</b> allow “install unknown apps” for your browser once, then install. The Play Store listing (coming soon) removes this step.</li>
              <li><b>Pairing:</b> open the Windows agent → scan its QR with Bridge on your phone → grant notification access only if you want message mirroring.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- changelog / roadmap ---------- */}
      <section className="block" id="updates">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Momentum</span>
            <h2>Shipped. <span className="thin">Shipping next.</span></h2>
          </div>
          <div className="cr-grid">
            <div className="cr-card reveal">
              <h3>v1.0.0 — first public cut <span className="pill">now</span></h3>
              <ul>
                <li>QR pairing + AES-256-GCM on every message</li>
                <li>Clipboard text + image sync with history</li>
                <li>Instant share-sheet file transfer (files, photos, docs)</li>
                <li>Notification mirror with reply + dismiss</li>
                <li>Phone-as-trackpad, keyboard, media keys</li>
                <li>Phone-as-camera (WebRTC) + ring + battery</li>
              </ul>
            </div>
            <div className="cr-card reveal">
              <h3>Roadmap <span className="pill">next</span></h3>
              <ul>
                <li>Signed Windows installer (bye, SmartScreen)</li>
                <li>Google Play listing + auto-updates</li>
                <li>Clipboard history search + pins</li>
                <li>Open-sourcing the codebase after v1 stabilizes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="block" id="faq">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Questions, answered straight</span>
            <h2>Asked by skeptics. <span className="thin">Answered like one.</span></h2>
          </div>
          <div className="faq reveal">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div className={`faq-item${open ? ' open' : ''}`} key={f.q}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="plus" aria-hidden="true">+</span>
                  </button>
                  <div className="faq-a" aria-hidden={!open}>
                    <div className="faq-a-inner">
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- final ---------- */}
      <section className="block">
        <div className="wrap">
          <div className="final reveal">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <Logo size={56} />
            </div>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Stop emailing yourself</span>
            <h2>Copy on your phone.<br />Paste on your PC.</h2>
            <p>Free during v1. No account. Your network, your data, your two minutes of setup.</p>
            <div className="hero-ctas" style={{ marginTop: 0 }}>
              <a className="btn btn-specular" href="/download"><span className="os-glyph"><WindowsGlyph size={14} /></span> Download for Windows</a>
              <a className="btn btn-ghost" href="/download"><span className="os-glyph"><AndroidGlyph size={14} /></span> Get for Android</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <a className="nav-logo" href="/" style={{ textDecoration: 'none' }}><Logo /><span>Bridge</span></a>
              <p>Local-first continuity for Android & Windows. Your LAN is the cloud.</p>
              <p className="mono" style={{ fontSize: 11.5 }}>v{SITE.appVersion} · AES-256-GCM · LAN-only</p>
            </div>
            <div className="foot-col">
              <h4>Product</h4>
              <a href="/features">Features</a>
              <a href="/tour">Tour</a>
              <a href="/setup">Setup</a>
              <a href="/updates">Changelog</a>
            </div>
            <div className="foot-col">
              <h4>Trust</h4>
              <a href="/security">Security</a>
              <a href="/permissions">Permissions</a>
              <a href="/compare">Comparison</a>
              <a href="/faq">FAQ</a>
            </div>
            <div className="foot-col">
              <h4>Get</h4>
              <a href={SITE.windowsDownloadUrl}>Windows agent</a>
              <a href={SITE.androidDownloadUrl}>Android app</a>
              <a href="/download">Releases</a>
              <a href={`mailto:${SITE.supportEmail}`}>Contact</a>
            </div>
          </div>
          <div className="foot-base">
            <span>© 2026 Bridge. Not open source — yet.</span>
            <span><a href="/privacy" style={{ textDecoration: 'none' }}>Privacy Policy</a> · <span className="live">●</span> all systems local</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- router ---------------- */

const SECTIONS = ['story', 'features', 'tour', 'setup', 'security', 'permissions', 'compare', 'download', 'updates', 'faq'];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {SECTIONS.map((s) => (
          <Route key={s} path={`/${s}`} element={<Home section={s} />} />
        ))}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
