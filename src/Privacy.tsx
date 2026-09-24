import { useEffect, useState } from 'react';

/**
 * Privacy Policy for Bridge
 * Clean, neutral legal documentation layout satisfying user privacy expectations,
 * GDPR, CCPA, and App Store User Data / Data Safety / Data Deletion requirements.
 *
 * Route: /privacy and /privacy-policy
 */
export default function Privacy() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Privacy Policy — Bridge';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'Bridge — Android Continuity';
    };
  }, []);

  const handleCopyLink = () => {
    const url = window.location.origin.includes('localhost')
      ? 'https://bridgeconnects.vercel.app/privacy'
      : `${window.location.origin}/privacy`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="legal-page">
      <header className="legal-nav-bar">
        <div className="legal-nav-inner">
          <a className="legal-brand" href="/">
            <img
              src="/logo.png"
              alt="Bridge logo"
              width={24}
              height={24}
            />
            <span>Bridge</span>
          </a>
          <a className="legal-back-link" href="/">← Back to website</a>
        </div>
      </header>

      <main className="legal-container">
        <header className="legal-header">
          <span className="legal-tag">Legal Documentation</span>
          <h1>Privacy Policy for Bridge</h1>
          <p className="legal-intro">
            This Privacy Policy explains how <b>Bridge</b> handles information when you use our software.
            Bridge is a private, local-first continuity solution connecting your Android device and Windows PC
            over your local Wi-Fi network. This policy outlines our architecture, the specific permissions
            our application requests, and how data is processed, stored, and deleted.
          </p>

          <div className="legal-meta-grid">
            <span className="legal-chip">Application: <b>Bridge</b> (<code>dev.sairitesh.bridge</code>)</span>
            <span className="legal-chip">Effective Date: <b>September 24, 2026</b></span>
            <span className="legal-chip">Website: <a className="legal-chip-link" href="https://bridgeconnects.vercel.app">bridgeconnects.vercel.app</a></span>
          </div>

          <div className="legal-actions">
            <button className="legal-btn" onClick={() => window.print()} title="Print or save as PDF">
              Print / Save as PDF
            </button>
            <button className="legal-btn" onClick={handleCopyLink} title="Copy link to clipboard">
              {copied ? 'Copied link!' : 'Copy Policy Link'}
            </button>
          </div>
        </header>

        <div className="legal-callout">
          <h4>Core Architectural Principle: Local-First, Peer-to-Peer Communication</h4>
          <p>
            Bridge is built from the ground up without cloud servers. All synchronization between your Android device
            and your Windows PC takes place <b>directly across your own local Wi-Fi network</b> using end-to-end
            <b> AES-256-GCM encryption</b>. We do not operate external relay servers, remote databases, or cloud brokers.
            Your notifications, clipboard items, camera feed, and files never leave your private local network.
          </p>
        </div>

        <nav className="legal-toc">
          <div className="legal-toc-title">Contents</div>
          <div className="legal-toc-list">
            <a href="#overview">1. Overview & Core Principles</a>
            <a href="#summary-table">2. Summary of Data Handling Practices</a>
            <a href="#information-handled">3. Information We Access and Process</a>
            <a href="#permissions">4. Device Permissions & Access Disclosures</a>
            <a href="#retention-deletion">5. Data Storage, Retention, and Complete Deletion</a>
            <a href="#third-parties">6. Third-Party Services, Advertising, and Tracking</a>
            <a href="#security">7. Security Safeguards & Encryption</a>
            <a href="#children">8. Children's Privacy</a>
            <a href="#user-rights">9. User Controls & Choices</a>
            <a href="#contact">10. Policy Updates & Contact Information</a>
          </div>
        </nav>

        {/* Section 1 */}
        <section className="legal-section" id="overview">
          <h2><span className="legal-sec-num">01</span> Overview & Core Principles</h2>
          <p>
            Bridge connects your Android phone and Windows computer to provide continuity features such as notification mirroring,
            cross-device copy-and-paste, direct file sharing, wireless webcam streaming, and phone locator ringing.
          </p>
          <ul className="legal-list">
            <li><b>Direct Device-to-Device:</b> Communication occurs directly between your devices over your private Local Area Network (LAN).</li>
            <li><b>Zero Cloud Storage:</b> We operate no remote databases or centralized cloud servers to collect or store your personal data.</li>
            <li><b>No Account Requirement:</b> Bridge requires no account creation, registration, username, password, phone number, or email to operate.</li>
            <li><b>Zero Monetization of Data:</b> We do not collect telemetry, profile your usage, or sell any personal information to advertisers or data brokers.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="legal-section" id="summary-table">
          <h2><span className="legal-sec-num">02</span> Summary of Data Handling Practices</h2>
          <p>
            The table below provides a concise overview of the data types processed by Bridge, how they are handled,
            and their retention lifecycle:
          </p>

          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Data Category</th>
                  <th>Specific Information</th>
                  <th>Transmission & Storage</th>
                  <th>Shared with Third Parties?</th>
                  <th>Purpose</th>
                  <th>Retention Lifecycle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Notifications</b></td>
                  <td>Notification title, text, app package name, and action triggers</td>
                  <td>Transmitted directly to paired PC via local Wi-Fi; no remote collection</td>
                  <td><b>No</b> (0% shared)</td>
                  <td>Mirroring phone notifications to PC screen</td>
                  <td>Ephemeral (cleared from active memory immediately upon delivery)</td>
                </tr>
                <tr>
                  <td><b>Camera & Video</b></td>
                  <td>Live optical video stream</td>
                  <td>Streamed point-to-point to paired PC; not recorded or uploaded</td>
                  <td><b>No</b> (0% shared)</td>
                  <td>Pairing QR code scan and wireless PC webcam feature</td>
                  <td>Ephemeral (frames are rendered in real time and discarded)</td>
                </tr>
                <tr>
                  <td><b>Clipboard Content</b></td>
                  <td>Copied text, URLs, and copied image bitmaps</td>
                  <td>Transmitted directly to paired PC upon explicit user action</td>
                  <td><b>No</b> (0% shared)</td>
                  <td>Cross-device copy-and-paste synchronization</td>
                  <td>Transient in memory / Stored locally on device if clipboard history is enabled</td>
                </tr>
                <tr>
                  <td><b>Files & Documents</b></td>
                  <td>Files explicitly shared by the user via share sheet or file picker</td>
                  <td>Transferred point-to-point across local Wi-Fi sockets</td>
                  <td><b>No</b> (0% shared)</td>
                  <td>Direct file drop between phone and PC</td>
                  <td>Stored only in the destination folder chosen by the user on their PC</td>
                </tr>
                <tr>
                  <td><b>Device Identifiers</b></td>
                  <td>Device name, local private IP address, cryptographic public keys</td>
                  <td>Stored locally in app private sandbox storage</td>
                  <td><b>No</b> (0% shared)</td>
                  <td>Local network peer discovery and AES-256-GCM authentication</td>
                  <td>Retained locally until devices are unpaired or app data is cleared</td>
                </tr>
                <tr>
                  <td><b>Diagnostics & Analytics</b></td>
                  <td>None (no analytics, behavioral tracking, or crash logs)</td>
                  <td><b>None collected</b></td>
                  <td><b>No</b> (0% shared)</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="legal-section" id="information-handled">
          <h2><span className="legal-sec-num">03</span> Information We Access and Process</h2>
          <p>
            Bridge processes only the information strictly required to perform continuity tasks initiated or configured by the user:
          </p>

          <div className="legal-card">
            <h3>1. Notification Content</h3>
            <p><b>Information Accessed:</b> Notification title, body text, sending application name/package, and actionable intent buttons (e.g., "Reply").</p>
            <p><b>Functionality:</b> Allows you to see incoming messages and alerts on your Windows computer and trigger notification actions directly from your PC.</p>
            <p><b>Handling:</b> Packets are encrypted with AES-256-GCM and sent over your local Wi-Fi router directly to the desktop agent. Notifications are held ephemerally in active memory and are never persisted to external servers or logged remotely.</p>
          </div>

          <div className="legal-card">
            <h3>2. Camera Feed & Video Stream</h3>
            <p><b>Information Accessed:</b> Real-time optical camera frames.</p>
            <p><b>Functionality:</b> Used strictly for: (1) scanning the setup QR code displayed on your PC screen during initial device pairing; and (2) streaming live video to your PC when you launch the "Phone as Webcam" feature.</p>
            <p><b>Handling:</b> Video frames are streamed point-to-point across your local network directly into the virtual webcam feed on your computer. Video frames are never recorded, saved to cloud storage, or made accessible to third parties.</p>
          </div>

          <div className="legal-card">
            <h3>3. System Clipboard Data</h3>
            <p><b>Information Accessed:</b> Copied text, URLs, and image data.</p>
            <p><b>Functionality:</b> Enables seamless copy-and-paste continuity between your phone and your PC.</p>
            <p><b>Handling:</b> In compliance with modern operating system restrictions, clipboard data is only read when the user explicitly triggers an action (such as copying within Bridge, tapping the "Sync Now" notification action, or using the home-screen clipboard widget). Content is transferred directly across local Wi-Fi and is never routed through remote servers.</p>
          </div>

          <div className="legal-card">
            <h3>4. User-Selected Files and Media</h3>
            <p><b>Information Accessed:</b> Specific documents, images, or media files that you choose to send.</p>
            <p><b>Functionality:</b> Allows fast, wireless file transfer from your Android device to your computer.</p>
            <p><b>Handling:</b> Bridge does not index, catalog, or scan your photo library or personal storage. Only files explicitly sent via the Android Share sheet or file picker are streamed across the local network to your PC.</p>
          </div>

          <div className="legal-card">
            <h3>5. Remote Locator Signal (Find My Phone)</h3>
            <p><b>Information Accessed:</b> Incoming peer ring command from your paired PC.</p>
            <p><b>Functionality:</b> Triggers an audible ring and full-screen alarm screen on your phone to help you locate it when misplaced, even if the device is set to silent or locked.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="legal-section" id="permissions">
          <h2><span className="legal-sec-num">04</span> Device Permissions & Access Disclosures</h2>
          <p>
            To deliver continuity features, Bridge requests specific permissions on your Android device.
            Here is a transparent breakdown of each permission requested and why it is needed:
          </p>

          <div className="legal-card">
            <h3>
              <code>BIND_NOTIFICATION_LISTENER_SERVICE</code>
              <span>Notification Listener Access</span>
            </h3>
            <p><b>Purpose:</b> Enables Bridge to observe incoming notifications so they can be mirrored to your paired PC in real time.</p>
            <p><b>Safeguards:</b> Notification contents are processed in volatile memory only, encrypted in transit, and never transmitted to any cloud server.</p>
            <p><b>User Control:</b> Granted explicitly through Android Settings and can be revoked at any time via <code>Android Settings → Apps → Special app access → Notification access → Bridge</code>.</p>
          </div>

          <div className="legal-card">
            <h3>
              <code>android.permission.CAMERA</code>
              <span>Camera Access</span>
            </h3>
            <p><b>Purpose:</b> Used to scan the initial pairing QR code and stream real-time video when using your phone as a PC webcam.</p>
            <p><b>Safeguards:</b> Video frames are streamed point-to-point over local Wi-Fi and are never recorded or uploaded.</p>
            <p><b>User Control:</b> Prompted at runtime. Can be granted or revoked at any time via <code>Android Settings → Apps → Bridge → Permissions → Camera</code>.</p>
          </div>

          <div className="legal-card">
            <h3>
              <code>android.permission.FOREGROUND_SERVICE</code> &amp; <code>FOREGROUND_SERVICE_DATA_SYNC</code>
              <span>Foreground Synchronization Service</span>
            </h3>
            <p><b>Purpose:</b> Required on Android 14+ (API level 34+) to maintain a persistent local network socket connection with your paired PC while Bridge is in the background, ensuring immediate notification and clipboard sync.</p>
            <p><b>User Visibility:</b> Android displays a persistent notification in the status bar while the foreground service is active, ensuring you are always aware of active connections.</p>
          </div>

          <div className="legal-card">
            <h3>
              <code>android.permission.USE_FULL_SCREEN_INTENT</code>
              <span>Full-Screen Alarm Intent</span>
            </h3>
            <p><b>Purpose:</b> Used exclusively for the "Find My Phone" feature to display a high-priority ringing screen with a "Stop Alarm" button even when your device screen is locked.</p>
          </div>

          <div className="legal-card">
            <h3>
              <code>android.permission.INTERNET</code> &amp; <code>android.permission.ACCESS_NETWORK_STATE</code>
              <span>Local Network Socket Communication</span>
            </h3>
            <p><b>Purpose:</b> Used strictly to detect local Wi-Fi connectivity and establish direct TCP/WebSocket peer connections to your paired PC's local IP address (private RFC1918 subnets: <code>192.168.x.x</code>, <code>10.x.x.x</code>). It is never used to communicate with external cloud servers.</p>
          </div>

          <div className="legal-card">
            <h3>
              <code>android.permission.VIBRATE</code> &amp; <code>android.permission.WAKE_LOCK</code>
              <span>Vibration &amp; Device Wake</span>
            </h3>
            <p><b>Purpose:</b> Provides haptic feedback during pairing and Find My Phone alerts; prevents Wi-Fi radio sleep during active large file transfers.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="legal-section" id="retention-deletion">
          <h2><span className="legal-sec-num">05</span> Data Storage, Retention, and Complete Deletion</h2>
          <p>
            We believe you should have complete ownership and control over your data.
            Because Bridge operates on a local-first model, all user data, configuration, and cryptographic pairing keys
            reside exclusively on your own devices.
          </p>

          <p><b>Data Retention Schedule:</b></p>
          <ul className="legal-list">
            <li><b>Ephemeral Data (RAM):</b> Notification mirroring packets, camera video frames, and clipboard sync streams exist only temporarily in volatile memory during active local transmission and are discarded immediately.</li>
            <li><b>Persistent Local Data (Disk):</b> Pairing keys, trusted device IDs, and local app preferences are stored in the protected, sandboxed internal storage of the application and cannot be accessed by other applications.</li>
            <li><b>Zero Remote Retention:</b> No personal data or user logs are ever uploaded, synchronized, or stored on remote developer servers or third-party cloud infrastructure.</li>
          </ul>

          <p><b>Step-by-Step Instructions to Delete Your Data:</b></p>
          <ul className="legal-list">
            <li>
              <b>1. In-App Unpairing:</b> Inside the Bridge Android app, open the paired devices menu and tap <b>"Remove this PC"</b> (or "Unpair").
              This immediately deletes the cryptographic pairing keys, session tokens, and cached connection details from both devices.
            </li>
            <li>
              <b>2. Clearing Local App Storage (Android OS):</b> You can delete all local data, cached items, and settings at any time by navigating to:
              <br />
              <code>Android Settings → Apps → Bridge → Storage &amp; cache → Clear Storage (or Clear Data)</code>.
              <br />
              This resets the application completely to its original, freshly installed state.
            </li>
            <li>
              <b>3. Uninstalling the Application:</b> Uninstalling Bridge from your device permanently removes the application, its sandboxed storage, and all local configuration files.
            </li>
            <li>
              <b>4. No Cloud Deletion Request Required:</b> Because Bridge does not operate user accounts, cloud databases, or remote tracking servers, <b>there is no remote server-side data to delete</b>. Once you clear local storage or uninstall the application, 100% of your data is permanently gone.
            </li>
            <li>
              <b>5. Deletion Inquiries:</b> If you have any questions or require guidance on data deletion, you can reach out via the contact information below.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="legal-section" id="third-parties">
          <h2><span className="legal-sec-num">06</span> Third-Party Services, Advertising, and Tracking</h2>
          <p>
            Bridge is designed to be completely free of third-party tracking, surveillance, and monetization tools:
          </p>
          <ul className="legal-list">
            <li><b>No Third-Party Advertising:</b> Bridge contains no commercial advertising SDKs, banner ads, interstitial networks, or monetization frameworks (e.g., No Google AdMob, Unity, AppLovin).</li>
            <li><b>No Analytics or Telemetry:</b> Bridge contains no user behavioral tracking or analytics libraries (e.g., No Firebase Analytics, Mixpanel, Segment, or Adjust).</li>
            <li><b>No Crash Reporting Services:</b> Bridge does not automatically upload crash logs or device metrics to external third-party services.</li>
            <li><b>No Data Sharing or Selling:</b> We do not sell, rent, license, or disclose your personal information to third parties, marketers, or data brokers under any circumstances.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="legal-section" id="security">
          <h2><span className="legal-sec-num">07</span> Security Safeguards & Encryption</h2>
          <p>
            We implement strict security practices to ensure your device-to-device continuity is protected:
          </p>
          <ul className="legal-list">
            <li><b>Asymmetric Key Pairing:</b> Pairing is initiated through a one-time cryptographic handshake via QR code that securely exchanges ephemeral keys between your phone and PC.</li>
            <li><b>Authenticated AES-256-GCM Encryption:</b> All local network packets (notifications, clipboard text, webcam video frames, and file transfers) are encrypted using AES-256-GCM, preventing eavesdropping or tampering even on shared Wi-Fi networks.</li>
            <li><b>Local Subnet Confinement:</b> Communication is restricted to private RFC1918 IP addresses (e.g., <code>192.168.x.x</code>, <code>10.x.x.x</code>). Bridge never exposes listening ports to the public internet.</li>
            <li><b>Operating System Sandbox:</b> On Android, encryption keys and preferences are stored exclusively inside the application's private sandboxed directory, protected by Android OS security boundaries.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="legal-section" id="children">
          <h2><span className="legal-sec-num">08</span> Children's Privacy</h2>
          <p>
            Bridge is a general-purpose productivity utility intended for general audiences. It is not directed at children
            under the age of 13 (or under 16 in the European Economic Area). Bridge does not knowingly collect, solicit,
            or store personal information from children. If you believe a child has provided us with personal information,
            please reach out to us using the contact details below, and we will take immediate appropriate action.
          </p>
        </section>

        {/* Section 9 */}
        <section className="legal-section" id="user-rights">
          <h2><span className="legal-sec-num">09</span> User Controls & Choices</h2>
          <p>
            You maintain full control over your device permissions and continuity features:
          </p>
          <ul className="legal-list">
            <li><b>Granular Feature Toggles:</b> You can selectively enable or disable notification mirroring, clipboard synchronization, or camera streaming within the application settings at any time.</li>
            <li><b>Permission Management:</b> You can grant or revoke any permission (Notification Access, Camera, Local Network) at any time through your Android system settings.</li>
            <li><b>Instant Disconnect:</b> Tapping "Disconnect" or "Remove PC" instantly terminates active socket connections and wipes pairing sessions.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="legal-section" id="contact">
          <h2><span className="legal-sec-num">10</span> Policy Updates & Contact Information</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory updates.
            When updates occur, we will update the "Effective Date" at the top of this document. We encourage you to review
            this policy periodically to stay informed about our data handling practices.
          </p>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or Bridge's privacy practices,
            please contact the developer:
          </p>
          <ul className="legal-list">
            <li><b>Developer:</b> Sai Ritesh Domakuntla</li>
            <li><b>Email:</b> <a href="mailto:sairiteshdomakuntla@gmail.com">sairiteshdomakuntla@gmail.com</a></li>
            <li><b>Application Package:</b> <code>dev.sairitesh.bridge</code></li>
            <li><b>Official Website:</b> <a href="https://bridgeconnects.vercel.app">https://bridgeconnects.vercel.app</a></li>
          </ul>
        </section>
      </main>

      <footer className="legal-footer">
        <div className="wrap">
          <p>
            © 2026 Bridge ·{' '}
            <a href="/">Home</a> ·{' '}
            <a href="/permissions">Permissions</a> ·{' '}
            <a href="mailto:sairiteshdomakuntla@gmail.com">Contact</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
