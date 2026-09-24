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

/* ---------------- icons (professional, stroke-based — no emojis) ---------------- */

function Icon({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function IconClipboard({ size = 20 }: { size?: number }) {
  return <Icon size={size}><rect x="8" y="2.5" width="8" height="4" rx="1.5" /><path d="M16 4.5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h2" /><path d="M9 12h6M9 16h4" /></Icon>;
}
function IconImage({ size = 20 }: { size?: number }) {
  return <Icon size={size}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="m5.5 19 5-5 3 3 2.5-2.5 2.5 2.5" /></Icon>;
}
function IconChat({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12Z" /><path d="M8.5 11.5h7M8.5 14h4" /></Icon>;
}
function IconRemote({ size = 20 }: { size?: number }) {
  return <Icon size={size}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><circle cx="12" cy="6" r="0.6" fill="currentColor" /><path d="M10.5 11h3M10.5 14h3M10.5 17h1.5" /></Icon>;
}
function IconCamera({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M4 8h3l2-2.5h6L17 8h3a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 19V9.5A1.5 1.5 0 0 1 4 8Z" /><circle cx="12" cy="14" r="3.4" /></Icon>;
}
function IconBell({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9Z" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></Icon>;
}
function IconLink({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M10 13.5a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.7 1.7" /><path d="M14 10.5a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.7-1.7" /></Icon>;
}
function IconShield({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.3 7.5 10 4.3-1.7 7.5-5 7.5-10v-6L12 2.5Z" /><path d="m9 12 2.2 2.2L15.5 10" /></Icon>;
}
function IconHome({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="m3.5 10.5 8.5-7 8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></Icon>;
}
function IconKey({ size = 20 }: { size?: number }) {
  return <Icon size={size}><circle cx="8" cy="15.5" r="4.5" /><path d="m11.5 12.5 8-8M17 5l2.5 2.5M14.5 7.5 17 10" /></Icon>;
}
function IconPhone({ size = 20 }: { size?: number }) {
  return <Icon size={size}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></Icon>;
}
function IconLaptop({ size = 20 }: { size?: number }) {
  return <Icon size={size}><rect x="4" y="4.5" width="16" height="11" rx="2" /><path d="M2.5 19.5h19" /></Icon>;
}
function IconDoc({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M6 2.5h8L19 8v13.5H6V2.5Z" /><path d="M13.5 2.5V8H19" /><path d="M9 13h6M9 16.5h6" /></Icon>;
}
function IconBolt({ size = 20 }: { size?: number }) {
  return <Icon size={size}><path d="M13 2.5 4.5 13.5H11L10 21.5 19.5 10H13l0-7.5Z" /></Icon>;
}
function IconCheck({ size = 14 }: { size?: number }) {
  return <Icon size={size}><path d="m4.5 12.5 5 5 10-11" /></Icon>;
}
function IconChevron({ size = 14 }: { size?: number }) {
  return <Icon size={size}><path d="m6 9 6 6 6-6" /></Icon>;
}

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

/* Demo videos live in public/videos/. If a file is missing (or fails to
   load), the styled mock below it renders instead — the page never breaks. */
const TOUR_VIDEOS = [
  '/videos/clipboard.mp4',
  '/videos/file.mp4',
  '/videos/camera.mp4',
  '/videos/remote.mp4',
  '/videos/texts.mp4',
];

function TourVideo({ src, children }: { src: string; children: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{children}</>;
  return (
    <video
      className="tour-video"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
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
          <a href="/tour">Tour</a>
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
            on one device, appear on the other. Long links, screenshots, files, texts — works both ways,{' '}
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

          {/* product visual — real-world examples, no jargon */}
          <div className="stage">
            <div className="magic-flow reveal in">
              <div className="magic-card">
                <div className="magic-icon"><IconPhone size={22} /></div>
                <b>Copy on either side</b>
                <small>Phone or PC — link, image, text</small>
                <div className="magic-bubble">figma.com/design/Site-Revamp?node-id=4128…</div>
              </div>
              <div className="magic-arrow" aria-hidden="true">
                <span>⇄</span>
                <small>both ways</small>
              </div>
              <div className="magic-card">
                <div className="magic-icon"><IconLaptop size={22} /></div>
                <b>Paste on the other</b>
                <small>Ctrl+V on PC, tap Paste on phone</small>
                <div className="magic-bubble pc"><span className="tick"><IconCheck size={12} /></span> Pasted — opens directly</div>
              </div>
              <div className="magic-arrow" aria-hidden="true">
                <span>→</span>
                <small>reply too</small>
              </div>
              <div className="magic-card">
                <div className="magic-icon"><IconChat size={22} /></div>
                <b>Reply from your keyboard</b>
                <small>Full speed, phone stays put</small>
                <div className="magic-bubble reply">On it — sending the file now</div>
              </div>
            </div>
            <div className="stage-caption">
              <span><b>Both directions</b> · same Wi-Fi · nothing uploaded to the internet</span>
            </div>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} style={{ display: 'contents' }}>
                <span><b>copy-paste</b> links + screenshots</span>
                <span>send <b>files either way</b></span>
                <span>reply to <b>texts from PC</b></span>
                <span>phone as <b>remote + keyboard</b></span>
                <span>phone as <b>HD webcam</b></span>
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
            <h2>Stop WhatsApping yourself. <span className="thin">Seriously.</span></h2>
            <p>The things that are genuinely painful without Bridge — not six-digit codes you could retype, but the stuff you can't.</p>
          </div>
          <div className="moments-grid">
            <div className="moment reveal"><span className="moment-icon"><IconLink size={22} /></span><b>Links you can't retype</b><p>80-character Meet, Docs or Figma link on WhatsApp, work waiting on the laptop. Copy once, paste in the browser. Zero typos.</p></div>
            <div className="moment reveal"><span className="moment-icon"><IconImage size={22} /></span><b>Screenshots straight into work</b><p>Whiteboard photo, ID scan, design mock. Copy the image on your phone, paste it into Word, Docs or Photoshop — full quality.</p></div>
            <div className="moment reveal"><span className="moment-icon"><IconChat size={22} /></span><b>Texts without breaking flow</b><p>Message lands mid-work. Reply from your real keyboard in seconds, dismiss the noise, never pick up the phone.</p></div>
            <div className="moment reveal"><span className="moment-icon"><IconRemote size={22} /></span><b>Present from anywhere</b><p>Phone becomes mouse, keyboard and clicker. Advance slides from the back of the room, pause movies from the couch.</p></div>
          </div>
        </div>
      </section>

      {/* ---------- story ---------- */}
      <section className="block" id="story">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Why Bridge exists</span>
            <h2>You live in two machines. <span className="thin">It shouldn’t feel like it.</span></h2>
            <p>iPhone + Mac users got this years ago. Android + Windows users got cables and a WhatsApp group with just themselves in it. Bridge fixes that — simply and privately.</p>
          </div>
          <div className="story-grid">
            <div className="story-card reveal">
              <span className="tag">The old way</span>
              <h3>Copy on phone. Dump it in your own WhatsApp chat. Open laptop. Copy it again. Paste.</h3>
              <p>Links arrive broken across lines. Screenshots come back compressed. The chat buries everything by evening. And every hop passes through someone else's server.</p>
            </div>
            <div className="story-card after reveal">
              <span className="tag">The Bridge way</span>
              <h3>Copy on either side. Paste on the other. That’s the whole manual.</h3>
              <p>Scan one code to connect. From then on your links, images, screenshots, files and texts move both ways — phone to PC and PC to phone — and your phone's camera shows up where you're working.</p>
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
            <p>Six tools in one quiet app. No dashboard to babysit.</p>
          </div>
          <div className="bento">
            <div className="bcard reveal">
              <div className="icon"><IconClipboard size={20} /></div>
              <h3>Clipboard, both ways</h3>
              <p>Copy on either side, paste on the other. Long links, UPI IDs, notes, screenshots — text and images, with full history on both devices and a home-screen widget on Android.</p>
              <div className="foot"><span className="tick">→</span> phone ⇄ PC · screenshots paste too</div>
            </div>
            <div className="bcard reveal">
              <div className="icon"><IconDoc size={20} /></div>
              <h3>Files, both ways</h3>
              <p>Phone to PC via Share in any app; PC to phone straight from the Windows dashboard. Photos, videos, PDFs land in original quality — no WhatsApp compression, no cable.</p>
              <div className="foot"><span className="tick">→</span> no cable, no compression, no upload</div>
            </div>
            <div className="bcard reveal">
              <div className="icon"><IconChat size={20} /></div>
              <h3>Texts from your PC</h3>
              <p>WhatsApp, Telegram, SMS surface on Windows with reply and dismiss. Your full-size keyboard finally answers your phone.</p>
              <div className="foot"><span className="tick">→</span> any app, at typing speed</div>
            </div>
            <div className="bcard reveal">
              <div className="icon"><IconRemote size={20} /></div>
              <h3>Phone as remote</h3>
              <p>Trackpad with smooth two-finger scroll, left and right click, keyboard, media keys and volume. Start it from your phone — or open it with one click on the PC.</p>
              <div className="foot"><span className="tick">→</span> mouse + keyboard + clicker</div>
            </div>
            <div className="bcard reveal">
              <div className="icon"><IconCamera size={20} /></div>
              <h3>Phone as HD webcam</h3>
              <p>Your rear camera outclasses most laptop webcams and budget USB cams. One tap and it shows up as “Bridge Phone Camera” in Meet, Zoom and Teams — wireless. See it in the tour below.</p>
              <div className="foot"><span className="tick">→</span> system webcam, zero new hardware</div>
            </div>
            <div className="bcard reveal">
              <div className="icon"><IconBell size={20} /></div>
              <h3>Find phone + battery</h3>
              <p>Phone under a cushion? Ring it from your PC even on silent. Live battery level sits in your Windows dashboard.</p>
              <div className="foot"><span className="tick">→</span> rings loud, even on silent</div>
            </div>
          </div>
          <details className="geek reveal">
            <summary><span>Technical details</span><span className="geek-hint">implementation notes <IconChevron size={12} /></span></summary>
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
            {['Clipboard', 'Files', 'Camera', 'Remote', 'Texts'].map((t, i) => (
              <button key={t} type="button" className={tour === i ? 'active' : ''} onClick={() => setTour(i)}>{t}</button>
            ))}
          </div>
          <div className="tour-panel" key={tour}>
            {tour === 0 && (
              <>
                <div>
                  <h3><span className="n">01 / CLIPBOARD</span>Copy here. Paste there. Either way.</h3>
                  <p>The flow your hands learn in minutes. Links, screenshots, IDs, notes — phone to PC and PC to phone, with history on both sides.</p>
                  <ul className="tour-list">
                    <li>Copy something on either device, in any app</li>
                    <li>Tap Sync Now once on the phone</li>
                    <li>Paste on the other side — Ctrl+V or tap Paste</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <TourVideo src={TOUR_VIDEOS[0]}>
                    <div className="clip-card"><div className="meta"><span className="src">phone → pc</span><span className="time">now</span></div><p>figma.com/design/Site-Revamp?node-id=4128…</p></div>
                    <div className="clip-card"><div className="meta"><span className="src">pc → phone</span><span className="time">2m</span></div><p>upi://pay?pa=shop@okhdfc&amp;am=499 …</p></div>
                    <div className="mono" style={{ fontSize: 12, color: '#6b6b76' }}>Both directions · history kept · nothing uploaded</div>
                  </TourVideo>
                </div>
              </>
            )}
            {tour === 1 && (
              <>
                <div>
                  <h3><span className="n">02 / FILES</span>Share, don't WhatsApp yourself.</h3>
                  <p>Photos, videos, PDFs in original quality — either direction. No cable, no compression, no drive upload.</p>
                  <ul className="tour-list">
                    <li>Phone to PC: Share in any app, choose Bridge</li>
                    <li>PC to phone: send from the Windows dashboard</li>
                    <li>Progress shown on both sides, verified on arrival</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <TourVideo src={TOUR_VIDEOS[1]}>
                    <div className="clip-card"><div className="meta"><span className="src">phone → pc</span><span className="time">now</span></div><p>design-specs.pdf · 4.2 MB · received</p></div>
                    <div className="clip-card"><div className="meta"><span className="src">pc → phone</span><span className="time">1m</span></div><p>Offer-letter.pdf · sent to phone</p></div>
                    <div className="mono" style={{ fontSize: 12, color: '#6b6b76' }}>Both directions · original quality</div>
                  </TourVideo>
                </div>
              </>
            )}
            {tour === 2 && (
              <>
                <div>
                  <h3><span className="n">03 / CAMERA</span>Your meetings just got a better camera.</h3>
                  <p>Your phone becomes a wireless HD webcam — pick it in Meet, Zoom or Teams like any other camera. Same desk, same light, no contest.</p>
                  <ul className="tour-list">
                    <li>Shows up as “Bridge Phone Camera” everywhere</li>
                    <li>Notebook text and small details stay readable</li>
                    <li>Front or back lens, switch in one tap</li>
                  </ul>
                </div>
                <div className="tour-visual cam-demo">
                  <TourVideo src={TOUR_VIDEOS[2]}>
                    <div className="cam-view high">
                      <div className="cam-scene">
                        <div className="cam-desk" />
                        <div className="cam-plant" />
                        <div className="cam-mug" />
                        <div className="cam-note">desk feed</div>
                      </div>
                      <div className="cam-rec"><i />Live · 1080p · private link</div>
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: '#6b6b76', marginTop: 10 }}>Wireless HD · nothing uploaded</div>
                  </TourVideo>
                </div>
              </>
            )}
            {tour === 3 && (
              <>
                <div>
                  <h3><span className="n">04 / REMOTE</span>The couch is now a control room.</h3>
                  <p>Trackpad, keyboard, media keys. Scroll a doc, flip slides, pause the movie — phone in hand, feet up.</p>
                  <ul className="tour-list">
                    <li>Trackpad with natural two-finger scroll</li>
                    <li>Keyboard tab + Enter / Backspace / Space</li>
                    <li>Play, next, volume, mute</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <TourVideo src={TOUR_VIDEOS[3]}>
                    <div className="trackpad"><span className="cursor" /></div>
                    <div className="mediakeys"><span>Play</span><span>Next</span><span>Vol +</span><span>Vol −</span><span>Mute</span></div>
                    <div className="mono" style={{ fontSize: 12, color: '#6b6b76', marginTop: 12 }}>Feels instant · same Wi-Fi</div>
                  </TourVideo>
                </div>
              </>
            )}
            {tour === 4 && (
              <>
                <div>
                  <h3><span className="n">05 / TEXTS</span>Your chats, at full typing speed.</h3>
                  <p>Messages arrive on Windows the moment they hit your phone. Reply inline, dismiss the noise — the phone never leaves your pocket.</p>
                  <ul className="tour-list">
                    <li>WhatsApp, Telegram, SMS + any notifying app</li>
                    <li>Inline reply and dismiss from Windows</li>
                    <li>Turn it off any time — mirroring stops dead</li>
                  </ul>
                </div>
                <div className="tour-visual">
                  <TourVideo src={TOUR_VIDEOS[4]}>
                    <div className="notif-row"><div className="avatar">A</div><div><b>WhatsApp · Alice</b><small>Send the Figma link when you're at your desk?</small></div></div>
                    <div className="notif-row"><div className="avatar tg">T</div><div style={{ flex: 1 }}><b>Telegram · Design group</b><small>Final mock is in Figma — review?</small><div className="reply"><input defaultValue="Looking now" readOnly /><button>Send</button></div></div></div>
                  </TourVideo>
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
            <summary><span>What happens under the hood</span><span className="geek-hint">for the curious <IconChevron size={12} /></span></summary>
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
            <span className="eyebrow">Early users</span>
            <h2>Built for humans, <span className="thin">not IT departments.</span></h2>
          </div>
          <div className="cr-grid">
            {[
              ['“I stopped retyping links entirely.”', 'Aarav · Student', 'Figma links, Docs links, long application IDs — copy on my phone, paste on the laptop. It is the one thing I use every single day.'],
              ['“My phone stays in my bag at work.”', 'Meera · Designer', 'Client screenshots go straight into Photoshop at full quality, and I reply to messages from my keyboard. No cables on my desk anymore.'],
              ['“Meetings finally see my desk clearly.”', 'Ravi · Engineer', 'I point my phone at the circuit and the team sees every wire. My laptop webcam could never do that. No face on camera needed.'],
            ].map(([title, who, body]) => (
              <div className="cr-card quote reveal" key={who} style={{ gridColumn: 'span 1' }}>
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
            <div className="assure reveal" style={{ gridColumn: 'span 1' }}><span className="assure-icon"><IconHome size={22} /></span><b>Stays in the room</b><p>Phone to PC over your own Wi-Fi. Turn off the internet and it still works.</p></div>
            <div className="assure reveal" style={{ gridColumn: 'span 1' }}><span className="assure-icon"><IconShield size={22} /></span><b>No account, no tracking</b><p>No sign-up, no ads, no analytics. Nothing collected, nothing to leak.</p></div>
            <div className="assure reveal" style={{ gridColumn: 'span 1' }}><span className="assure-icon"><IconKey size={22} /></span><b>Locked, and easy to undo</b><p>Connected by a one-time scan. Remove a device or switch off a permission and it stops instantly.</p></div>
          </div>
          <details className="geek reveal">
            <summary><span>Technical proof</span><span className="geek-hint">packets, keys, wire format <IconChevron size={12} /></span></summary>
            <div className="geek-body">
              <div className="sec-grid">
                <div className="diagram reveal">
                  <div className="node"><div className="glyph"><IconPhone size={18} /></div><div><b>Android app</b><small>flutter_secure_storage · Keystore</small></div></div>
                  <div className="link">AES-256-GCM · bridge-message · your Wi-Fi only</div>
                  <div className="node"><div className="glyph" style={{ color: '#8fb0ff' }}><WindowsGlyph size={18} /></div><div><b>Windows agent</b><small>Electron safeStorage · DPAPI</small></div></div>
                  <div className="blocked"><span className="tick">—</span><span><b>No cloud.</b> No relay, no account server, no analytics endpoint. Offline router? Still works.</span></div>
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
                <span className="flag"><IconShield size={20} /></span>
                <div>
                  <h3>One honest limitation: why clipboard needs one tap</h3>
                  <p>Since Android 10, only the app you are actively using can see what you copied. No app can read it silently in the background. So you copy, tap <b>Sync Now</b>, paste. One tap, and it is Android protecting you — not us being lazy.</p>
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
            <h2>Asked only when needed. <span className="thin">Explained every time.</span></h2>
            <p>Bridge needs a few sensitive permissions to do its job. Each one is requested only when its feature needs it, and you can revoke it any time.</p>
          </div>
          <div className="perm-intro reveal">
            <span className="trust-chip"><i />asked only when needed</span>
            <span className="trust-chip"><i />everything revocable</span>
            <span className="trust-chip"><i />nothing hidden</span>
          </div>
          <details className="geek reveal">
            <summary><span>Full permission list</span><span className="geek-hint">6 entries · 0 hidden <IconChevron size={12} /></span></summary>
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
                <tr><td>Works fully offline, no cloud relay</td><td className="bcol">Yes</td><td className="no">No — needs internet</td><td className="yes">Yes</td></tr>
                <tr><td>Pairing effort</td><td className="bcol">10-second scan</td><td className="mid">Sign-in + codes + retries</td><td className="mid">Manual accept on both sides</td></tr>
                <tr><td>Clipboard text + images, both directions</td><td className="bcol">Yes</td><td className="mid">Text only, Samsung-limited</td><td className="yes">Yes</td></tr>
                <tr><td>Notification reply from PC, any app</td><td className="bcol">Yes</td><td className="mid">Mostly Samsung devices</td><td className="mid">Partial</td></tr>
                <tr><td>Trackpad + keyboard + media keys</td><td className="bcol">Yes</td><td className="no">—</td><td className="mid">Partial, via plugins</td></tr>
                <tr><td>Phone as PC webcam</td><td className="bcol">Yes, wireless HD</td><td className="no">—</td><td className="mid">Via plugins</td></tr>
                <tr><td>Send files either way, original quality</td><td className="bcol">Yes, both directions</td><td className="mid">Photos only</td><td className="yes">Yes</td></tr>
                <tr><td>Ring phone on silent + live battery</td><td className="bcol">Yes</td><td className="no">—</td><td className="mid">Partial</td></tr>
                <tr><td>Every permission documented</td><td className="bcol">This page</td><td className="no">—</td><td className="no">—</td></tr>
                <tr><td>Telemetry / data leaves network</td><td className="bcol">None, ever</td><td className="mid">Account-linked diagnostics</td><td className="yes">None</td></tr>
              </tbody>
            </table>
          </div>
          <p className="compare-note reveal">Phone Link needs an account and the internet. KDE Connect is powerful but fiddly. Bridge is the simple one: paired in seconds, with the extras neither of them bundles.</p>
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
                <li>Shows the code that connects your phone</li>
                <li>Clipboard history + reply to texts</li>
                <li>Home for your files, camera and remote</li>
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
                <li>Copy anything to your PC in one tap</li>
                <li>Share any photo or file to your PC</li>
                <li>Remote, camera and ring-my-phone included</li>
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
              <li><b>Connect:</b> open Bridge on PC, scan the code with your phone. Done.</li>
            </ol>
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
            Technical and want packet-level proof? Expand the Technical details sections above — keys, wire format and the full permission ledger are all there.
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
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Stop WhatsApping yourself</span>
            <h2>Copy on one device.<br />Paste on the other.</h2>
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
              <a href="/tour">Tour</a>
              <a href="/setup">How it works</a>
              <a href="/love">Reviews</a>
            </div>
            <div className="foot-col">
              <h4>Trust</h4>
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
            <span>© 2026 Bridge.</span>
            <span><a href="/privacy" style={{ textDecoration: 'none' }}>Privacy Policy</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- router ---------------- */

const SECTIONS = ['story', 'moments', 'features', 'tour', 'setup', 'love', 'security', 'permissions', 'compare', 'download', 'faq'];

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
