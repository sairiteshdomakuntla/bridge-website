import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import { Logo, WindowsGlyph, AndroidGlyph } from './brand';

export default function FinalCTA() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="final reveal">
          <div className="final-logo">
            <Logo size={52} />
          </div>
          <span className="eyebrow">
            {IS_WAITLIST ? 'Early access · waitlist open' : 'Stop WhatsApping yourself'}
          </span>
          <h2>
            {IS_WAITLIST ? (
              <>
                Bridge is in early access.
                <br />
                Save your spot.
              </>
            ) : (
              <>
                Copy on one device.
                <br />
                Paste on the other.
              </>
            )}
          </h2>
          <p>
            {IS_WAITLIST
              ? 'Join the waitlist — we’ll email your install links as soon as your spot opens. Free during v1. No account.'
              : 'Free during v1. No account. Two minutes to set up, then you’ll forget it’s even there.'}
          </p>
          <div className="hero-ctas">
            {IS_WAITLIST ? (
              <Link className="btn btn-on-primary" to={SIGNUP_PATH}>
                <Bell size={16} /> Join the waitlist
              </Link>
            ) : (
              <>
                <Link className="btn btn-on-primary" to={SIGNUP_PATH}>
                  <WindowsGlyph size={16} /> Download for Windows
                </Link>
                <Link className="btn btn-on-primary-ghost" to={SIGNUP_PATH}>
                  <AndroidGlyph size={16} /> Get for Android
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
