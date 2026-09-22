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

const ROTATE_WORDS = ['Copy', 'Reply', 'Share', 'Present', 'Paste'];

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
    a: 'Phone Link needs a Microsoft account and the internet. Bridge needs neither — just your Wi-Fi. It also does a few things Phone Link does not: send any file in one tap, use your phone as a webcam or remote, and ring your phone even on silent.',
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
            <a href="/setup">How it works</a>
            <a href="/love">Reviews</a>
            <a href="/faq">FAQ</a>
            <a href="/download">Download</a>
          </div>
          <a className="nav-cta" href="/download">Get Bridge — free</a>
          <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </div>
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <a href="/features">Features</a>
          <a href="/setup">How it works</a>
          <a href="/love">Reviews</a>
          <a href="/faq">FAQ</a>
          <a href="/download">Download</a>
        </div>
      )}

      {/* ---------- hero ---------- */}
      <header className="hero" id="top">
        <div className="hero-beams" />
        <div className="hero-grid" />
        <div className="wrap hero-inner">
          <div className="hero-badge">
            <Logo size={20} />
            For Android + Windows
            <span className="ver">v{SITE.appVersion} · free</span>
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
            on your phone, appear on your computer. OTPs, photos, files, texts —{' '}
            <strong>no cables, no accounts, no uploading to the internet.</strong>
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
            <span className="trust-chip"><i />No account needed</span>
            <span className="trust-chip"><i />Works on your home Wi-Fi</span>
            <span className="trust-chip"><i />Private by design</span>
            <span className="trust-chip"><i />Setup in 2 minutes</span>
          </div>

          {/* friendly product visual — no IPs, no ports, no jargon */}
          <div className="stage">
            <div className="magic-flow reveal in">
              <div className="magic-card">
                <div className="magic-emoji">📱</div>
                <b>Copy on your phone</b>
                <small>OTP, photo, link — anything</small>
                <div className="magic-bubble">“482 916 — expires in 4 min”</div>
              </div>
              <div className="magic-arrow" aria-hidden="true">
                <span>→</span>
                <small>instant</small>
              </div>
              <div className="magic-card">
                <div className="magic-emoji">💻</div>
                <b>Paste on your PC</b>
                <small>Just press Ctrl+V anywhere</small>
                <div className="magic-bubble pc">482 916 ✓ pasted</div>
              </div>
              <div className="magic-arrow" aria-hidden="true">
                <span>→</span>
                <small>reply too</small>
              </div>
              <div className="magic-card">
                <div className="magic-emoji">💬</div>
                <b>Reply without touching phone</b>
                <small>Type on your big keyboard</small>
                <div className="magic-bubble reply">“On it — sending now ✓”</div>
              </div>
            </div>
            <div className="stage-caption">
              <span><b>Same Wi-Fi</b> · nothing uploaded to the internet</span>
            </div>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} style={{ display: 'contents' }}>
                <span><b>copy-paste</b> between phone & PC</span>
                <span>send <b>photos in one tap</b></span>
                <span>reply to <b>texts from computer</b></span>
                <span>phone as <b>remote + keyboard</b></span>
                <span>phone as <b>webcam</b></span>
                <span><b>find lost phone</b> in seconds</span>
                <span><b>no account</b> · no cloud</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ---------- everyday moments ---------- */}
      <section className="block" id="moments">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Made for real life</span>
            <h2>Stop emailing yourself. <span className="thin">Seriously.</span></h2>
            <p>If any of these feel familiar, Bridge was built for you.</p>
          </div>
          <div className="moments-grid">
            {[
              ['🔑', 'OTPs that expire', 'Bank code on your phone, login on your PC? Copy once, paste on PC. Done before it expires.'],
              ['📸', 'Photos stuck on phone', 'Tap Share → Bridge. The photo is on your computer, full quality, no cable, no WhatsApp compression.'],
              ['💬', 'Texts while you work', 'Friend texts mid-work? Reply from your keyboard without ever picking up the phone.'],
              ['🛋️', 'Movie night + presentations', 'Phone becomes a remote: pause, volume, next slide — from the couch or the back of the room.'],
            ].map(([icon, title, body]) => (
              <div className="moment reveal" key={title}><span className="big">{icon}</span><b>{title}</b><p>{body}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- story ---------- */}
      <section className="block" id="story">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Why Bridge exists</span>
            <h2>You live in two machines. <span className="thin">It shouldn’t feel like it.</span></h2>
            <p>iPhone + Mac users got this years ago. Android + Windows users got cables and email-to-self. Bridge fixes that — simply and privately.</p>
          </div>
          <div className="story-grid">
            <div className="story-card reveal">
              <span className="tag">✕ the old way</span>
              <h3>Copy on phone. Email it to yourself. Open laptop. Download. Paste.</h3>
              <p>Codes expire. Photos lose quality. Replies wait until you find your phone. And every hop passes through someone else's server.</p>
            </div>
            <div className="story-card after reveal">
              <span className="tag">✓ the Bridge way</span>
              <h3>Copy on phone. Paste on PC. That’s the whole manual.</h3>
              <p>Scan one code to connect. From then on your clipboard, photos, texts and even your phone’s camera just show up where you’re working.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- features ---------- */}
      <section className="block" id="features">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">What it does</span>
            <h2>Everything you wish <span className="thin">just worked.</span></h2>
            <p>No settings to babysit. Things you do every day, now effortless.</p>
          </div>
          <div className="bento">
            <div className="bcard reveal">
              <div className="icon">📋</div>
              <h3>Copy on phone, paste on PC</h3>
              <p>Text, links, codes, even pictures. Copy on Android, press Ctrl+V on Windows. History included, so yesterday’s copy is still there.</p>
              <div className="foot"><b>→</b> one extra tap, then paste anywhere</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">📁</div>
              <h3>Send photos & files in one tap</h3>
              <p>In any app tap Share and choose Bridge. Photos, videos, PDFs land on your PC instantly in full quality.</p>
              <div className="foot"><b>→</b> no cable, no compression, no upload</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">💬</div>
              <h3>Answer texts from your computer</h3>
              <p>WhatsApp, Telegram, SMS show up on Windows. Type replies on your real keyboard, dismiss the noise, phone stays in your pocket.</p>
              <div className="foot"><b>→</b> your chats, at typing speed</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">▦</div>
              <h3>Phone becomes a remote</h3>
              <p>Control your PC from the couch: move the mouse, type, change volume, pause movies, flip slides.</p>
              <div className="foot"><b>→</b> presentations + movie nights</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">🎥</div>
              <h3>Use your phone as a webcam</h3>
              <p>Your phone camera is 10× better than your laptop’s. One tap and meetings use it — wirelessly.</p>
              <div className="foot"><b>→</b> look sharp, zero new hardware</div>
            </div>
            <div className="bcard reveal">
              <div className="icon">🔔</div>
              <h3>Find a lost phone in seconds</h3>
              <p>Phone under a cushion? Click “Ring” on your PC — it rings loud even on silent. Plus live battery on screen.</p>
              <div className="foot"><b>→</b> works even on silent mode</div>
            </div>
          </div>
          <details className="geek reveal">
            <summary><span>🤓 Nerdy? Show me how it actually works</span><span className="geek-hint">proof inside</span></summary>
            <div className="geek-body">
              <ul>
                <li><b>Clipboard:</b> text + images, both directions, history on both sides, echo-proofed dedupe store. Android 10+ focus rules mean one “Sync Now” tap.</li>
                <li><b>Files:</b> 64 KB chunks with SHA-256 checks over direct socket — resume-safe, verified.</li>
                <li><b>Notifications:</b> via Android notification-listener, reply + dismiss round-trip. Revoke any time.</li>
                <li><b>Remote:</b> ~60 Hz deltas, fire-and-forget trackpad + keyboard + media keys, sensitivity slider.</li>
                <li><b>Camera:</b> WebRTC peer-to-peer video over the same LAN link. No relay server.</li>
                <li><b>Ring:</b> ~15 s max-volume ring + live battery over the same encrypted channel.</li>
              </ul>
            </div>
          </details>
        </div>
      </section>

      {/* ---------- tour ---------- */}
      <section className="block" id="tour">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">See it in action</span>
            <h2>A normal day <span className="thin">with Bridge on.</span></h2>
          </div>
          <div className="dock reveal">
            {['Copy-paste', 'Texts', 'Remote', 'Camera'].map((t, i) => (
              <button key={t} type="button" className={tour === i ? 'active' : ''} onClick={() => setTour(i)}>{t}</button>
            ))}
          </div>
          <div className="tour-panel" key={tour}>
            {tour === 0 && (
              <>
                <div>
                  <h3><span className="n">01 / COPY-PASTE</span>Copy there. Paste here.</h3>
                  <p>Your hands learn it in minutes. Codes, links, pictures — all move instantly.</p>
                  <ul className="tour-list">
                    <li>Copy anything on your phone, in any app</li>
                    <li>Tap Sync Now on the Bridge popup</li>
                    <li>Press <span className="kbd">Ctrl</span> + <span className="kbd">V</span> on PC — done</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <div className="clip-card"><div className="meta"><span className="src">phone → pc</span><span className="time">now</span></div><p>“OTP is 482 916 — expires in 4 min”</p></div>
                  <div className="clip-card"><div className="meta"><span className="src">pc → phone</span><span className="time">2m</span></div><p>Meet link: 6pm, bring the demo</p></div>
                  <div className="mono" style={{ fontSize: 12, color: '#6b6b76' }}>✓ arrived instantly · nothing uploaded</div>
                </div>
              </>
            )}
            {tour === 1 && (
              <>
                <div>
                  <h3><span className="n">02 / TEXTS</span>Your chats, on your big keyboard.</h3>
                  <p>Messages appear on your PC the second they hit your phone. Reply fast, ignore fast.</p>
                  <ul className="tour-list">
                    <li>WhatsApp, Telegram, SMS — any app</li>
                    <li>Reply and dismiss right from PC</li>
                    <li>Turn off any time — you stay in control</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <div className="notif-row"><div className="avatar">S</div><div><b>SMS · Bank</b><small>Your code is 482 916. Valid 4 min.</small></div></div>
                  <div className="notif-row"><div className="avatar tg">T</div><div style={{ flex: 1 }}><b>Telegram · Design group</b><small>“Final mock is ready — review?”</small><div className="reply"><input defaultValue="Looking now 👀" readOnly /><button>Send</button></div></div></div>
                </div>
              </>
            )}
            {tour === 2 && (
              <>
                <div>
                  <h3><span className="n">03 / REMOTE</span>The couch is now a control room.</h3>
                  <p>Scroll docs, flip slides, pause the movie — phone in hand, feet up.</p>
                  <ul className="tour-list">
                    <li>Mouse pad with smooth scrolling</li>
                    <li>Type + play, pause, volume, mute</li>
                    <li>Great for movies and presentations</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <div className="trackpad"><span className="cursor" /></div>
                  <div className="mediakeys"><span>⏯ play</span><span>⏭ next</span><span>🔊 vol+</span><span>🔉 vol−</span><span>⛔ mute</span></div>
                  <div className="mono" style={{ fontSize: 12, color: '#6b6b76', marginTop: 12 }}>feels instant · same Wi-Fi</div>
                </div>
              </>
            )}
            {tour === 3 && (
              <>
                <div>
                  <h3><span className="n">04 / CAMERA</span>Your best webcam is in your pocket.</h3>
                  <p>One tap and meetings use your phone camera. Plus find-my-phone and battery, right alongside.</p>
                  <ul className="tour-list">
                    <li>Way sharper than most laptop cameras</li>
                    <li>Ring a lost phone + see battery live</li>
                    <li>Nothing recorded, nothing uploaded</li>
                  </ul>
                </div>
                <div className="tour-visual" style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 44 }}>🎥</div>
                    <div className="mono" style={{ fontSize: 12, color: '#5eead4', marginTop: 8 }}>● live preview</div>
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
            <p>No accounts, no cables, no tech skills needed. If both devices share Wi-Fi, you’re done.</p>
          </div>
          <div className="steps">
            <div className="step reveal"><div className="num">1</div><h3>Install both apps</h3><p>One on your Windows PC, one on your Android phone. Links in <a href="/download" style={{ color: '#c4d3ff' }}>Download</a> below.</p></div>
            <div className="step reveal"><div className="num">2</div><h3>Join the same Wi-Fi</h3><p>Home, office, hotspot — as long as phone and PC are on the same network, Bridge finds its way.</p></div>
            <div className="step reveal"><div className="num">3</div><h3>Scan the code on your PC</h3><p>Your PC shows a code. Point your phone at it. Connected — everything is private from here on.</p></div>
          </div>
          <details className="geek reveal">
            <summary><span>🤓 What happens under the hood?</span><span className="geek-hint">for the curious</span></summary>
            <div className="geek-body">
              <p>The QR encodes your PC’s address plus a fresh 256-bit secret. After one handshake, every message is end-to-end encrypted (AES-256-GCM), keys live in the OS keychain on both sides, and Bridge auto-picks the right network adapter while ignoring virtual ones.</p>
            </div>
          </details>
        </div>
      </section>

      {/* ---------- love ---------- */}
      <section className="block" id="love">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">People like you</span>
            <h2>Built for humans, <span className="thin">not IT departments.</span></h2>
          </div>
          <div className="cr-grid">
            {[
              ['🎓 “I stopped typing OTPs by hand.”', 'Aarav · student', 'Bank codes, college logins, exam portals — I copy on my phone and paste on my laptop. Saves me every single day.'],
              ['💼 “My phone stays in my bag at work.”', 'Meera · designer', 'I reply to WhatsApp from my keyboard and drag client photos straight to my PC. No cables on my desk anymore.'],
              ['🏠 “Even my dad uses it.”', 'Ravi · engineer', 'He just taps Share → Bridge to get photos on his computer. If he can use it without calling me, anyone can.'],
            ].map(([title, who, body]) => (
              <div className="cr-card reveal" key={who} style={{ gridColumn: 'span 1' }}>
                <h3 style={{ fontSize: 16 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>{body}</p>
                <div className="mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- security ---------- */}
      <section className="block" id="security">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Privacy, in plain words</span>
            <h2>Yours stays yours. <span className="thin">That’s the whole policy.</span></h2>
            <p>No account. No cloud. No tracking. Your stuff moves directly between your two devices and nowhere else.</p>
          </div>
          <div className="assurance">
            {[
              ['🏠', 'Stays in the room', 'Phone → PC over your own Wi-Fi. Turn off the internet and it still works.'],
              ['🚫', 'No account, no tracking', 'No sign-up, no ads, no analytics. There is nothing to leak because nothing is collected.'],
              ['🔑', 'Locked + undoable', 'Connected by a one-time scan. Remove a device or turn off a permission and it stops instantly.'],
            ].map(([icon, title, body]) => (
              <div className="assure reveal" key={title} style={{ gridColumn: 'span 1' }}><span className="big">{icon}</span><b>{title}</b><p>{body}</p></div>
            ))}
          </div>
          <details className="geek reveal">
            <summary><span>🤓 Skeptic? Inspect the technical proof</span><span className="geek-hint">packets, keys, code</span></summary>
            <div className="geek-body">
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
              <div className="honest reveal" style={{ marginTop: 14 }}>
                <span className="flag">⚠️</span>
                <div>
                  <h3>One honest limitation: why clipboard needs one tap</h3>
                  <p>Since Android 10, only the app you are actively using can see what you copied. No app can read it silently in the background. So you copy → tap <b>Sync Now</b> → paste. One tap, and it is Android protecting you — not us being lazy.</p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* ---------- permissions ---------- */}
      <section className="block" id="permissions">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Permissions</span>
            <h2>We ask nicely. <span className="thin">And explain everything.</span></h2>
            <p>Bridge needs a few sensitive permissions to do its job. Each one is asked only when its feature needs it, and you can take it back any time.</p>
          </div>
          <div className="perm-intro reveal">
            <span className="trust-chip"><i />asked only when needed</span>
            <span className="trust-chip"><i />everything revocable</span>
            <span className="trust-chip"><i />nothing hidden</span>
          </div>
          <details className="geek reveal">
            <summary><span>🤓 Show the full permission-by-permission list</span><span className="geek-hint">6 entries · 0 hidden</span></summary>
            <div className="geek-body" style={{ padding: 0, border: 'none', background: 'none' }}>
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
          </details>
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
          <p className="compare-note reveal">TL;DR — Phone Link needs an account and the internet. KDE Connect is powerful but fiddly. Bridge is the simple one: paired in seconds, with the tricks neither of them has.</p>
        </div>
      </section>

      {/* ---------- download ---------- */}
      <section className="block" id="download">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Get Bridge · v{SITE.appVersion} · free</span>
            <h2>Two installs. <span className="thin">Two minutes.</span></h2>
            <p>You need <b>both</b> — one on your PC, one on your phone — on the same Wi-Fi.</p>
          </div>
          <div className="dl-grid">
            <div className="dl-card featured reveal">
              <div className="os"><div className="glyph win"><WindowsGlyph size={24} /></div><div><h3>For Windows</h3><div className="file mono">Windows 10 / 11 · 64-bit</div></div></div>
              <ul>
                <li>Shows the code to connect your phone</li>
                <li>Clipboard history + reply to texts</li>
                <li>Receives files, camera, remote</li>
              </ul>
              <a className="btn btn-specular" href={SITE.windowsDownloadUrl} download={SITE.windowsInstaller} style={{ width: '100%', justifyContent: 'center' }}>Download for Windows · {SITE.windowsSize}</a>
              <details className="geek small">
                <summary>Verify file · SHA-256</summary>
                <div className="geek-body mono" style={{ fontSize: 11.5 }} title={SITE.windowsSha256}>{SITE.windowsInstaller}<br />{shortHash(SITE.windowsSha256)} · {SITE.windowsSha256}</div>
              </details>
            </div>
            <div className="dl-card reveal">
              <div className="os"><div className="glyph droid"><AndroidGlyph size={24} /></div><div><h3>For Android</h3><div className="file mono">Android 8.0+ · v{SITE.appVersion}</div></div></div>
              <ul>
                <li>One-tap copy to PC</li>
                <li>Share any photo or file to PC</li>
                <li>Remote, camera, find-my-phone</li>
              </ul>
              <a className="btn btn-ghost" href={SITE.androidDownloadUrl} download={SITE.androidApk} style={{ width: '100%', justifyContent: 'center' }}>Download for Android · {SITE.androidSize}</a>
              <details className="geek small">
                <summary>Verify file · SHA-256</summary>
                <div className="geek-body mono" style={{ fontSize: 11.5 }} title={SITE.androidSha256}>{SITE.androidApk}<br />{shortHash(SITE.androidSha256)} · {SITE.androidSha256}</div>
              </details>
            </div>
          </div>
          <div className="dl-note reveal">
            <b>First time? Read this once:</b>
            <ol>
              <li><b>Windows asks “Run anyway?”</b> — normal for new apps. Click “More info → Run anyway”.</li>
              <li><b>Firewall asks about private networks</b> — click Allow, or your phone can’t find the PC.</li>
              <li><b>Android asks to allow installs</b> — allow once for your browser, then install.</li>
              <li><b>Connect:</b> open Bridge on PC → scan the code with your phone → done.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- changelog / roadmap ---------- */}
      <section className="block" id="updates">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Momentum</span>
            <h2>Ready today. <span className="thin">Getting better.</span></h2>
          </div>
          <div className="cr-grid">
            <div className="cr-card reveal">
              <h3>v1.0.0 — first release <span className="pill">now</span></h3>
              <ul>
                <li>Copy-paste text + pictures</li>
                <li>One-tap photo & file sending</li>
                <li>Reply to texts from PC</li>
                <li>Phone as remote + webcam</li>
                <li>Ring lost phone + battery</li>
              </ul>
            </div>
            <div className="cr-card reveal">
              <h3>Coming next <span className="pill">soon</span></h3>
              <ul>
                <li>Signed installer (no more warnings)</li>
                <li>Play Store listing + auto-updates</li>
                <li>Search + pin your clipboard history</li>
                <li>Open-sourcing after v1 settles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="block" id="faq">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Questions, answered simply</span>
            <h2>Wondering something? <span className="thin">Start here.</span></h2>
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
          <p className="reveal" style={{ marginTop: 18, fontSize: 13.5, color: 'var(--faint)' }}>
            Technical and want packet-level proof? Expand the 🤓 sections above — keys, wire format and the full permission ledger are all there.
          </p>
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
            <p>Free during v1. No account. Two minutes to set up, then you’ll forget it’s even there.</p>
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
              <p>Your phone and PC, finally in sync. Private by design.</p>
              <p className="mono" style={{ fontSize: 11.5 }}>v{SITE.appVersion} · free during v1</p>
            </div>
            <div className="foot-col">
              <h4>Product</h4>
              <a href="/features">Features</a>
              <a href="/setup">How it works</a>
              <a href="/love">Reviews</a>
              <a href="/updates">What’s new</a>
            </div>
            <div className="foot-col">
              <h4>For geeks</h4>
              <a href="/security">Technical proof</a>
              <a href="/permissions">Permissions</a>
              <a href="/compare">Comparison</a>
              <a href="/faq">FAQ</a>
            </div>
            <div className="foot-col">
              <h4>Get</h4>
              <a href={SITE.windowsDownloadUrl}>Windows app</a>
              <a href={SITE.androidDownloadUrl}>Android app</a>
              <a href="/download">All downloads</a>
              <a href={`mailto:${SITE.supportEmail}`}>Contact</a>
            </div>
          </div>
          <div className="foot-base">
            <span>© 2026 Bridge. Not open source — yet.</span>
            <span><a href="/privacy" style={{ textDecoration: 'none' }}>Privacy Policy</a> · <span className="live">●</span> your Wi-Fi is the cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- router ---------------- */

const SECTIONS = ['story', 'moments', 'features', 'tour', 'setup', 'love', 'security', 'permissions', 'compare', 'download', 'updates', 'faq'];

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
