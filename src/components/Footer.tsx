import { Link } from 'react-router-dom';
import { IS_WAITLIST, SIGNUP_PATH, SITE } from '../config';
import { Logo } from './brand';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link className="nav-logo" to="/">
              <Logo />
              <span>Bridge</span>
            </Link>
            <p>Your phone and PC, finally in sync. Private by design.</p>
            <p className="foot-version">v{SITE.appVersion} · free during v1</p>
          </div>
          <div className="foot-col">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/tour">Tour</Link>
            <Link to="/setup">How it works</Link>
            {!IS_WAITLIST && <Link to="/love">Reviews</Link>}
          </div>
          <div className="foot-col">
            <h4>Trust</h4>
            <Link to="/security">Security</Link>
            <Link to="/permissions">Permissions</Link>
            {!IS_WAITLIST && <Link to="/compare">Comparison</Link>}
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="foot-col">
            <h4>Get</h4>
            {IS_WAITLIST ? (
              <>
                <Link to={SIGNUP_PATH}>Join the waitlist</Link>
                <Link to="/setup">How it works</Link>
                <a href={`mailto:${SITE.supportEmail}`}>Contact</a>
              </>
            ) : (
              <>
                <a href={SITE.windowsDownloadUrl}>Windows app</a>
                <a href={SITE.androidDownloadUrl}>Android app</a>
                <Link to={SIGNUP_PATH}>All downloads</Link>
                <a href={`mailto:${SITE.supportEmail}`}>Contact</a>
              </>
            )}
          </div>
        </div>
        <div className="foot-base">
          <span>© 2026 Bridge.</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
