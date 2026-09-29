import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import { Logo, WindowsGlyph, AndroidGlyph } from './brand';

const ROTATING_FEATURES = [
  'INSTANT CLIPBOARD.',
  'ORIGINAL FILES.',
  'WIRELESS WEBCAM.',
  'REMOTE CONTROL.',
  'INLINE REPLIES.',
];

const CAPABILITIES = [
  { n: '01', label: 'Clipboard', actIndex: 0 },
  { n: '02', label: 'Files', actIndex: 1 },
  { n: '03', label: 'Camera', actIndex: 2 },
  { n: '04', label: 'Remote', actIndex: 3 },
  { n: '05', label: 'Texts', actIndex: 4 },
];

export default function Hero() {
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % ROTATING_FEATURES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const scrollToAct = (idx: number) => {
    const el = document.querySelector(`[data-act="${idx}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const tour = document.getElementById('tour');
      tour?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="statement" id="top">
      <div className="dots" aria-hidden="true" />
      <span className="tick tl" aria-hidden="true" />
      <span className="tick tr" aria-hidden="true" />
      <span className="tick bl" aria-hidden="true" />
      <span className="tick br" aria-hidden="true" />

      {/* Industrial crosshairs inspired by Nothing design */}
      <span className="crosshair ch-tl" aria-hidden="true">+</span>
      <span className="crosshair ch-tr" aria-hidden="true">+</span>
      <span className="crosshair ch-bl" aria-hidden="true">+</span>
      <span className="crosshair ch-br" aria-hidden="true">+</span>

      <span className="spec spec-tl" aria-hidden="true">SYS // BRIDGE 1.0</span>
      <span className="spec spec-tr" aria-hidden="true">ANDROID + WINDOWS</span>
      <span className="spec spec-bl" aria-hidden="true">CIPHER // AES-256-GCM</span>
      <span className="spec spec-br" aria-hidden="true">PORT // 4000 · 0 CLOUD</span>

      <div className="wrap statement-inner">
        <div className="hero-badge">
          <Logo size={18} />
          <span>For Android + Windows</span>
          <span className="dot" aria-hidden="true" />
          <span className="hero-badge-status">
            <span className="pulse-indicator" aria-hidden="true" />
            {IS_WAITLIST ? 'Early access' : 'Free during v1'}
          </span>
        </div>

        <h1>
          PHONE &amp; PC.<br />
          <span className="hero-rotator">
            <span className="hero-rotator-word" key={featureIndex}>
              {ROTATING_FEATURES[featureIndex]}
            </span>
          </span>
        </h1>

        <p className="hero-sub">
          Clipboard, original files, webcam and remote control flow seamlessly over your local Wi-Fi.
          Zero accounts. Zero cloud.
        </p>

        {/* Feature quick jumps */}
        <div className="hero-chips" aria-label="Quick jump to feature flows">
          {CAPABILITIES.map((cap) => (
            <button
              key={cap.n}
              type="button"
              className="hero-chip"
              onClick={() => scrollToAct(cap.actIndex)}
            >
              <span className="chip-n">{cap.n}</span>
              <span className="chip-name">{cap.label}</span>
            </button>
          ))}
        </div>

        <div className="hero-ctas">
          {IS_WAITLIST ? (
            <>
              <Link className="btn btn-primary" to={SIGNUP_PATH}>
                Join the waitlist
              </Link>
              <Link className="hero-link" to="/tour">
                Watch the film →
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
      </div>
    </header>
  );
}
