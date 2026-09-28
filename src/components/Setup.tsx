import { Link } from 'react-router-dom';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import SectionHead from './SectionHead';

export default function Setup() {
  return (
    <section className="block" id="setup">
      <div className="wrap">
        <SectionHead
          heading={<>Up and running in two minutes.</>}
          desc="If both devices share Wi-Fi, you are done. No accounts, no cables, no tech skills needed."
        />
        <div className="steps reveal">
          <div className="step">
            <span className="num">01</span>
            <h3>Install both apps</h3>
            <p>
              {IS_WAITLIST ? (
                <>
                  Join the <Link to={SIGNUP_PATH}>waitlist</Link>. Your Windows
                  and Android links arrive with your invite.
                </>
              ) : (
                <>
                  One on your Windows PC, one on your Android phone. Links in{' '}
                  <Link to={SIGNUP_PATH}>download</Link> below.
                </>
              )}
            </p>
          </div>
          <div className="step">
            <span className="num">02</span>
            <h3>Join the same Wi-Fi</h3>
            <p>Home, office, hotspot. As long as phone and PC share a network, Bridge finds its way.</p>
          </div>
          <div className="step">
            <span className="num">03</span>
            <h3>Scan the code on your PC</h3>
            <p>Your PC shows a code. Point your phone at it. Connected, and private from here on.</p>
          </div>
        </div>
        {!IS_WAITLIST && (
          <details className="geek reveal">
            <summary>
              <span>What happens under the hood</span>
              <span className="geek-hint">for the curious</span>
            </summary>
            <div className="geek-body">
              <p>
                The QR encodes your PC address plus a fresh 256-bit secret. After one handshake, every message is
                encrypted (AES-256-GCM), keys live in the OS keychain on both sides, and Bridge auto-picks
                the right network adapter while ignoring virtual ones.
              </p>
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
