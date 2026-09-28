import SectionHead from './SectionHead';

const ITEMS = [
  { title: 'Stays in the room', body: 'Phone to PC over your own Wi-Fi. Turn off the internet and it still works.' },
  { title: 'No account, no tracking', body: 'No sign-up, no ads, no analytics. Nothing collected, nothing to leak.' },
  { title: 'Locked, and easy to undo', body: 'Connected by a one-time scan. Remove a device or switch off a permission and it stops instantly.' },
];

export default function Security() {
  return (
    <section className="block" id="security">
      <div className="wrap">
        <SectionHead
          eyebrow="Privacy"
          heading={<>Yours stays yours.</>}
          desc="No account and no cloud. Your stuff moves directly between your two devices, nowhere else."
        />
        <div className="assurance reveal">
          {ITEMS.map((it) => (
            <div className="assure" key={it.title}>
              <b>{it.title}</b>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
