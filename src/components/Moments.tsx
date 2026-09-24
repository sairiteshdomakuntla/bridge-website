import { Link2, Image, MessageSquare, Smartphone } from 'lucide-react';
import SectionHead from './SectionHead';

const MOMENTS = [
  {
    icon: Link2,
    title: "Links you can't retype",
    body: '80-character Meet, Docs or Figma link on WhatsApp, work waiting on the laptop. Copy once, paste in the browser. Zero typos.',
  },
  {
    icon: Image,
    title: 'Screenshots straight into work',
    body: 'Whiteboard photo, ID scan, design mock. Copy the image on your phone, paste it into Word, Docs or Photoshop — full quality.',
  },
  {
    icon: MessageSquare,
    title: 'Texts without breaking flow',
    body: 'Message lands mid-work. Reply from your real keyboard in seconds, dismiss the noise, never pick up the phone.',
  },
  {
    icon: Smartphone,
    title: 'Present from anywhere',
    body: 'Phone becomes mouse, keyboard and clicker. Advance slides from the back of the room, pause movies from the couch.',
  },
];

export default function Moments() {
  return (
    <section className="block" id="moments">
      <div className="wrap">
        <SectionHead
          eyebrow="Made for real life"
          heading={
            <>
              Stop WhatsApping yourself. <span className="thin">Seriously.</span>
            </>
          }
          desc="The things that are genuinely painful without Bridge — not six-digit codes you could retype, but the stuff you can't."
        />
        <div className="moments-grid">
          {MOMENTS.map(({ icon: Icon, title, body }) => (
            <div className="moment reveal" key={title}>
              <span className="moment-icon">
                <Icon size={20} />
              </span>
              <b>{title}</b>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
