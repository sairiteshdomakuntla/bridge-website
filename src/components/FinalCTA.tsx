import { Link } from 'react-router-dom';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import { WindowsGlyph, AndroidGlyph } from './brand';

export default function FinalCTA() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="final reveal">
          <span className="eyebrow">
            {IS_WAITLIST ? 'Early access · waitlist open' : 'Free during v1 · no account'}
          </span>
          <h2>
            {IS_WAITLIST ? (
              <>Your invite is one email away.</>
            ) : (
              <>Stop sending files to yourself.</>
            )}
          </h2>
          <p>
            {IS_WAITLIST
              ? 'One email when your spot opens. Your install links are inside.'
              : 'Two minutes to set up. Then you will forget it is even there.'}
          </p>
          <div className="hero-ctas">
            {IS_WAITLIST ? (
              <Link className="btn btn-on-dark" to={SIGNUP_PATH}>
                Join the waitlist
              </Link>
            ) : (
              <>
                <Link className="btn btn-on-dark" to={SIGNUP_PATH}>
                  <WindowsGlyph size={16} /> Download for Windows
                </Link>
                <Link className="btn btn-on-dark-ghost" to={SIGNUP_PATH}>
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
