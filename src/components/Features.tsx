import { Clipboard, FileText, MessageSquare, Smartphone, Camera, Bell, ChevronDown, ArrowRight } from 'lucide-react';
import { IS_WAITLIST } from '../config';
import SectionHead from './SectionHead';

const FEATURES = [
  {
    icon: Clipboard,
    title: 'Clipboard, both ways',
    body: 'Copy on either side, paste on the other. Long links, UPI IDs, notes, screenshots — text and images, with full history on both devices and a home-screen widget on Android.',
    foot: 'phone ⇄ PC · screenshots paste too',
  },
  {
    icon: FileText,
    title: 'Files, both ways',
    body: 'Phone to PC via Share in any app; PC to phone straight from the Windows dashboard. Photos, videos, PDFs land in original quality — no WhatsApp compression, no cable.',
    foot: 'no cable, no compression, no upload',
  },
  {
    icon: MessageSquare,
    title: 'Texts from your PC',
    body: 'WhatsApp, Telegram, SMS surface on Windows with reply and dismiss. Your full-size keyboard finally answers your phone.',
    foot: 'any app, at typing speed',
  },
  {
    icon: Smartphone,
    title: 'Phone as remote',
    body: 'Trackpad with smooth two-finger scroll, left and right click, keyboard, media keys and volume. Start it from your phone — or open it with one click on the PC.',
    foot: 'mouse + keyboard + clicker',
  },
  {
    icon: Camera,
    title: 'Phone as HD webcam',
    body: 'Your rear camera outclasses most laptop webcams and budget USB cams. One tap and it shows up as “Bridge Phone Camera” in Meet, Zoom and Teams — wireless.',
    foot: 'system webcam, zero new hardware',
  },
  {
    icon: Bell,
    title: 'Find phone + battery',
    body: 'Phone under a cushion? Ring it from your PC even on silent. Live battery level sits in your Windows dashboard.',
    foot: 'rings loud, even on silent',
  },
];

export default function Features() {
  return (
    <section className="block" id="features">
      <div className="wrap">
        <SectionHead
          eyebrow="What it does"
          heading={
            <>
              Everything you wish <span className="thin">just worked.</span>
            </>
          }
          desc="Six tools that stay out of your way."
        />
        <div className="bento">
          {FEATURES.map(({ icon: Icon, title, body, foot }) => (
            <div className="bcard reveal" key={title}>
              <div className="icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="foot">
                <ArrowRight size={12} /> {foot}
              </div>
            </div>
          ))}
        </div>
        {!IS_WAITLIST && (
          <details className="geek reveal">
            <summary>
              <span>Technical details</span>
              <span className="geek-hint">
                implementation notes <ChevronDown size={12} />
              </span>
            </summary>
            <div className="geek-body">
              <ul>
                <li><b>Clipboard:</b> text + images, both directions, history on both sides, echo-proofed dedupe store. Android 10+ focus rules mean one “Sync Now” tap.</li>
                <li><b>Files:</b> 64 KB chunks with SHA-256 checks over direct socket — resume-safe, verified.</li>
                <li><b>Notifications:</b> via Android notification-listener, reply + dismiss round-trip. Revoke any time.</li>
                <li><b>Remote:</b> ~60 Hz deltas, fire-and-forget trackpad + keyboard + media keys, sensitivity slider.</li>
                <li><b>Camera:</b> WebRTC peer-to-peer video over the same LAN link. No relay server.</li>
                <li><b>Ring:</b> ~15 s max-volume ring + live battery over the same encrypted channel.</li>
              </ul>
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
