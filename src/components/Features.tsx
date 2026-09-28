import { Link } from 'react-router-dom';
import SectionHead from './SectionHead';

const STATS = [
  { value: '2', unit: ' min', label: 'From install to paired. Scan one code and start.' },
  { value: '0', unit: '', label: 'Accounts, uploads and trackers. Nothing leaves your Wi-Fi.' },
  { value: '4000', unit: '', label: 'One local port carries everything. That is the whole cloud.' },
  { value: '~15', unit: ' s', label: 'Max-volume ring, even on silent. Plus live battery.' },
];

export default function Features() {
  return (
    <section className="block" id="features">
      <div className="wrap">
        <SectionHead
          heading={<>Small numbers. Big difference.</>}
        />
        <div className="stats reveal">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}<em>{s.unit}</em></b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="stat-note reveal">
          The flows behind these numbers are filmed live below. <Link to="/tour">Watch the film →</Link>
        </p>
        <details className="geek reveal">
          <summary>
            <span>Technical details</span>
            <span className="geek-hint">implementation notes</span>
          </summary>
          <div className="geek-body">
            <ul>
              <li><b>Clipboard:</b> text and images, both directions, history on both sides, echo-proofed dedupe store. Android 10 and up focus rules mean one Sync Now tap.</li>
              <li><b>Files:</b> 64 KB chunks with SHA-256 checks over a direct socket. Resume-safe and verified.</li>
              <li><b>Notifications:</b> Android notification listener, reply and dismiss round-trip. Revoke any time.</li>
              <li><b>Remote:</b> trackpad deltas near 60 Hz, keyboard plus media keys, sensitivity 0.5 to 3.0 (default 1.8).</li>
              <li><b>Camera:</b> WebRTC peer-to-peer video over the same LAN link. No relay server.</li>
              <li><b>Ring:</b> about 15 seconds at max volume, plus live battery over the same encrypted channel.</li>
            </ul>
          </div>
        </details>
      </div>
    </section>
  );
}
