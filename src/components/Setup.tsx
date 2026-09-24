import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import SectionHead from './SectionHead';

export default function Setup() {
  return (
    <section className="block" id="setup">
      <div className="wrap">
        <SectionHead
          eyebrow="Setup · two minutes"
          heading={
            <>
              Pair once. <span className="thin">Forget it exists.</span>
            </>
          }
          desc="No accounts, no cables, no tech skills needed. If both devices share Wi-Fi, you’re done."
        />
        <div className="steps">
          <div className="step reveal">
            <div className="num">1</div>
            <h3>Install both apps</h3>
            <p>
              {IS_WAITLIST ? (
                <>
                  Join the <Link to={SIGNUP_PATH}>waitlist</Link> — we’ll email your Windows + Android links when
                  your spot opens.
                </>
              ) : (
                <>
                  One on your Windows PC, one on your Android phone. Links in{' '}
                  <Link to={SIGNUP_PATH}>Download</Link> below.
                </>
              )}
            </p>
          </div>
          <div className="step reveal">
            <div className="num">2</div>
            <h3>Join the same Wi-Fi</h3>
            <p>Home, office, hotspot — as long as phone and PC are on the same network, Bridge finds its way.</p>
          </div>
          <div className="step reveal">
            <div className="num">3</div>
            <h3>Scan the code on your PC</h3>
            <p>Your PC shows a code. Point your phone at it. Connected — everything is private from here on.</p>
          </div>
        </div>
        {!IS_WAITLIST && (
          <details className="geek reveal">
            <summary>
              <span>What happens under the hood</span>
              <span className="geek-hint">
                for the curious <ChevronDown size={12} />
              </span>
            </summary>
            <div className="geek-body">
              <p>
                The QR encodes your PC’s address plus a fresh 256-bit secret. After one handshake, every message is
                end-to-end encrypted (AES-256-GCM), keys live in the OS keychain on both sides, and Bridge auto-picks
                the right network adapter while ignoring virtual ones.
              </p>
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
