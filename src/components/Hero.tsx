import { Link } from 'react-router-dom';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import { Logo, WindowsGlyph, AndroidGlyph } from './brand';

export default function Hero() {
  return (
    <header className="statement" id="top">
      <div className="dots" aria-hidden="true" />
      <span className="tick tl" aria-hidden="true" />
      <span className="tick tr" aria-hidden="true" />
      <span className="tick bl" aria-hidden="true" />
      <span className="tick br" aria-hidden="true" />
      <span className="spec spec-tl" aria-hidden="true">Bridge 1.0</span>
      <span className="spec spec-tr" aria-hidden="true">Android + Windows</span>
      <span className="spec spec-bl" aria-hidden="true">AES-256-GCM</span>
      <span className="spec spec-br" aria-hidden="true">Port 4000 · 0 cloud</span>

      <div className="wrap statement-inner">
        <div className="hero-badge">
          <Logo size={18} />
          For Android + Windows
          <span className="dot" aria-hidden="true" />
          <span>{IS_WAITLIST ? 'Early access' : 'Free during v1'}</span>
        </div>
        <h1>
          Copy on phone.<br />
          Paste on PC.
        </h1>
        <p className="hero-sub">
          Files, texts and camera flow both ways over your own Wi-Fi.
          No account. No cloud.
        </p>
        <div className="hero-ctas">
          {IS_WAITLIST ? (
            <>
              <Link className="btn btn-primary" to={SIGNUP_PATH}>
                Join the waitlist
              </Link>
              <Link className="hero-link" to="/tour">
                See the film →
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
        <a className="scroll-cue" href="#moments" aria-label="Scroll to see more">
          <span>Scroll for the film</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
