import { useEffect } from 'react';

/**
 * Privacy Policy — written to satisfy Google Play's requirements for
 * sensitive permissions (Notification Access, Camera, Local Network).
 * Route: /privacy-policy (alias: /privacy)
 */
export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Bridge';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'Bridge — Your Android and Windows, finally in sync';
    };
  }, []);

  return (
    <div className="grain">
      <div className="nav-shell">
        <nav className="nav">
          <a className="nav-logo" href="/">
            <img
              src="/logo.png"
              alt="Bridge logo"
              width={26}
              height={26}
              style={{ width: 26, height: 26, borderRadius: 8, display: 'block' }}
            />
            <span>Bridge</span>
          </a>
          <div className="nav-links">
            <a href="/features">Features</a>
            <a href="/security">Security</a>
            <a href="/permissions">Permissions</a>
            <a href="/download">Download</a>
          </div>
          <a className="nav-cta" href="/">Back to site</a>
        </nav>
      </div>

      <main className="doc">
        <div className="wrap">
          <div className="doc-head">
            <span className="eyebrow">Legal · Play Store disclosure</span>
            <h1>Privacy Policy</h1>
            <p>
              Bridge is a private, local-first continuity app connecting your Android phone
              and your Windows PC over your own local Wi-Fi network. This policy explains
              exactly what the app accesses, why, and where your data goes — in plain language,
              because sensitive permissions deserve plain answers.
            </p>
            <div className="doc-meta">
              <span className="trust-chip"><i />Last updated: September 2026</span>
              <span className="trust-chip"><i />Contact: sairiteshdomakuntla@gmail.com</span>
            </div>
          </div>

          <nav className="doc-toc">
            <span>On this page</span>
            <a href="#philosophy">1 · Core privacy philosophy</a>
            <a href="#access">2 · Information we access & why</a>
            <a href="#retention">3 · Retention & deletion</a>
            <a href="#third-party">4 · Third-party services</a>
            <a href="#security">5 · Security</a>
            <a href="#children">6 · Children's privacy</a>
            <a href="#contact">7 · Contact</a>
          </nav>

          <section className="doc-sec" id="philosophy">
            <h2><span className="doc-num">01</span>Overview & core privacy philosophy</h2>
            <ul className="doc-list">
              <li>All communication between your phone and PC is <b>direct (peer-to-peer)</b> over your local network — encrypted with <b>AES-256-GCM</b>, and <b>never routed through or stored on any external cloud server</b>.</li>
              <li>Bridge has <b>no user accounts</b> and requires no sign-up.</li>
              <li>Bridge collects <b>no telemetry or analytics</b> and sells <b>zero user data</b> — there is nothing to sell, because nothing ever leaves your network.</li>
            </ul>
          </section>

          <section className="doc-sec" id="access">
            <h2><span className="doc-num">02</span>Information we access and how it is used</h2>

            <div className="doc-perm">
              <h3>Notification Access <code>NotificationListenerService</code></h3>
              <p><b>What:</b> Bridge reads the notification title, message text, and application name of incoming alerts.</p>
              <p><b>Why:</b> Strictly to mirror notifications to your paired Windows PC so you can view and respond from your computer.</p>
              <p><b>Handling:</b> Ephemeral data transmitted directly across your local Wi-Fi using AES-256 encryption. Notification contents are never sent to external servers or logged remotely.</p>
            </div>

            <div className="doc-perm">
              <h3>Camera <code>android.permission.CAMERA</code></h3>
              <p><b>What:</b> Camera stream and image capture.</p>
              <p><b>Why:</b> Used strictly to (1) scan the QR code on your PC screen during initial pairing, and (2) stream video to your Windows PC when you explicitly launch the “Webcam” feature.</p>
              <p><b>Handling:</b> Video frames are streamed directly over local Wi-Fi to your PC and are never recorded, saved, or uploaded to any third party.</p>
            </div>

            <div className="doc-perm">
              <h3>Clipboard data</h3>
              <p><b>What:</b> Text and copied images in the Android system clipboard.</p>
              <p><b>Why:</b> To allow seamless copy-pasting between your phone and your Windows PC.</p>
              <p><b>Handling:</b> Only processed when you copy content or tap “Sync Now”. Transferred directly to your paired PC over local Wi-Fi.</p>
            </div>

            <div className="doc-perm">
              <h3>Files & media</h3>
              <p><b>What:</b> Files or photos explicitly picked by you using the system file picker or the Android Share Sheet.</p>
              <p><b>Why:</b> To send files directly between your phone and computer.</p>
              <p><b>Handling:</b> Streamed directly over local Wi-Fi. Bridge does not scan or index your photo library or storage.</p>
            </div>

            <div className="doc-perm">
              <h3>Find-my-phone ring alerts</h3>
              <p><b>What:</b> High-priority full-screen alarm trigger.</p>
              <p><b>Why:</b> Used exclusively when you trigger “Find My Phone” from your paired PC to help you locate your phone while it is locked.</p>
            </div>
          </section>

          <section className="doc-sec" id="retention">
            <h2><span className="doc-num">03</span>Data retention and deletion</h2>
            <ul className="doc-list">
              <li>Bridge does not operate external databases or cloud servers.</li>
              <li>All pairing keys and clipboard history reside <b>locally on your device</b>.</li>
              <li>Tapping <b>“Remove this PC”</b> or uninstalling the app <b>permanently purges all pairing keys and local caches</b>.</li>
              <li>Because Bridge does not maintain user accounts, <b>no account-deletion request is required</b> — there is no account to delete.</li>
            </ul>
          </section>

          <section className="doc-sec" id="third-party">
            <h2><span className="doc-num">04</span>Third-party services</h2>
            <p>Bridge does not include third-party advertising SDKs, tracking frameworks, or analytics libraries. There are no third parties to share data with.</p>
          </section>

          <section className="doc-sec" id="security">
            <h2><span className="doc-num">05</span>Security</h2>
            <ul className="doc-list">
              <li>Cryptographic pairing using asymmetric key exchange, with <b>AES-256-GCM encryption on all network payloads</b>.</li>
              <li>Connections are scoped strictly to <b>private RFC1918 local area networks</b> (<code>192.168.x.x</code>, <code>10.x.x.x</code>, etc.). Bridge does not traverse the public internet.</li>
            </ul>
          </section>

          <section className="doc-sec" id="children">
            <h2><span className="doc-num">06</span>Children's privacy</h2>
            <p>Bridge is not directed to children under 13 and does not knowingly collect data from children.</p>
          </section>

          <section className="doc-sec" id="contact">
            <h2><span className="doc-num">07</span>Contact information</h2>
            <p>
              Questions about this policy or Bridge's privacy practices? Reach us at{' '}
              <a href="mailto:sairiteshdomakuntla@gmail.com">sairiteshdomakuntla@gmail.com</a>.
              We will update this page—and the “Last updated” date above—whenever the policy changes.
            </p>
          </section>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-base">
            <span>© 2026 Bridge. Not open source — yet.</span>
            <span><a href="/" style={{ textDecoration: 'none' }}>Home</a> · <a href="/permissions" style={{ textDecoration: 'none' }}>Permissions</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
