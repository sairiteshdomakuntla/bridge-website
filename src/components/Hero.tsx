import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, ShieldCheck, Wifi, Timer, Clipboard, FileText, Camera } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IS_WAITLIST, SIGNUP_PATH, SITE } from '../config';
import { Logo, WindowsGlyph, AndroidGlyph } from './brand';

type Clip = { src: string; label: string; caption: string; icon: LucideIcon };

const SHOWREEL: Clip[] = [
  { src: '/videos/clipboard.mp4', label: 'Clipboard', caption: 'Copy here, paste there', icon: Clipboard },
  { src: '/videos/file.mp4', label: 'Files', caption: 'Either way, original quality', icon: FileText },
  { src: '/videos/camera.mp4', label: 'Camera', caption: 'Phone as wireless webcam', icon: Camera },
];

/** Plays only while on screen — keeps three loops from burning CPU off-view. */
function ShowreelVideo({ src, onFail }: { src: string; onFail: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('autoplay');
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={onFail}
    />
  );
}

function Showreel() {
  const [failedIdx, setFailedIdx] = useState<number[]>([]);
  const cards = SHOWREEL.filter((_, i) => !failedIdx.includes(i));
  if (cards.length === 0) return null;

  return (
    <div className="hero-showreel reveal">
      {SHOWREEL.map((clip, i) => {
        if (failedIdx.includes(i)) return null;
        const Icon = clip.icon;
        return (
          <div className="showreel-card" key={clip.label}>
            <ShowreelVideo src={clip.src} onFail={() => setFailedIdx((f) => [...f, i])} />
            <div className="showreel-meta">
              <span className="showreel-icon" aria-hidden="true">
                <Icon size={15} />
              </span>
              <div>
                <b>{clip.label}</b>
                <span>{clip.caption}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-badge">
          <Logo size={18} />
          For Android + Windows
          <span className="ver">{IS_WAITLIST ? 'Early access · waitlist open' : `v${SITE.appVersion} · free`}</span>
        </div>
        <h1>
          Your phone and PC,
          <br />
          finally in sync.
        </h1>
        <p className="hero-sub">
          Copy on one device, paste on the other. Long links, screenshots, files, texts — works both ways.
          <strong> No cables, no accounts, nothing leaves your Wi-Fi.</strong>
        </p>
        <div className="hero-ctas">
          {IS_WAITLIST ? (
            <>
              <Link className="btn btn-primary" to={SIGNUP_PATH}>
                <Bell size={16} /> Join the waitlist
              </Link>
              <Link className="btn btn-ghost" to="/setup">
                See how it works
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-primary" to={SIGNUP_PATH}>
                <WindowsGlyph size={16} /> Download for Windows
              </Link>
              <Link className="btn btn-ghost" to={SIGNUP_PATH}>
                <AndroidGlyph size={16} /> Get for Android
              </Link>
            </>
          )}
        </div>
        <div className="hero-trust">
          <span className="trust-chip">
            <Check size={14} /> No account needed
          </span>
          <span className="trust-chip">
            <Wifi size={14} /> Works on your home Wi-Fi
          </span>
          <span className="trust-chip">
            <ShieldCheck size={14} /> Private by design
          </span>
          <span className="trust-chip">
            <Timer size={14} /> Setup in 2 minutes
          </span>
        </div>
        <Showreel />
      </div>
    </header>
  );
}
