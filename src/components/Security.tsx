import { House, ShieldCheck, KeyRound } from 'lucide-react';
import SectionHead from './SectionHead';

const ITEMS = [
  {
    icon: House,
    title: 'Stays in the room',
    body: 'Phone to PC over your own Wi-Fi. Turn off the internet and it still works.',
  },
  {
    icon: ShieldCheck,
    title: 'No account, no tracking',
    body: 'No sign-up, no ads, no analytics. Nothing collected, nothing to leak.',
  },
  {
    icon: KeyRound,
    title: 'Locked, and easy to undo',
    body: 'Connected by a one-time scan. Remove a device or switch off a permission and it stops instantly.',
  },
];

export default function Security() {
  return (
    <section className="block" id="security">
      <div className="wrap">
        <SectionHead
          eyebrow="Privacy, in plain words"
          heading={
            <>
              Yours stays yours. <span className="thin">That’s the whole policy.</span>
            </>
          }
          desc="No account and no cloud — your stuff moves directly between your two devices, nowhere else."
        />
        <div className="assurance">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <div className="assure reveal" key={title}>
              <span className="assure-icon">
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
