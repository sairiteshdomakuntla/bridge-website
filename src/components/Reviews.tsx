import SectionHead from './SectionHead';

const NOTES: { body: string; who: string; role: string; tag: string }[] = [
  {
    body: 'I used to send Figma and Docs links to myself on WhatsApp. Now I copy on my phone and paste on the PC. I have not retyped a link in weeks.',
    who: 'Aarav',
    role: 'CS student',
    tag: 'week 2',
  },
  {
    body: 'Client screenshots go straight into Photoshop at full size. And I reply to messages from my keyboard instead of picking up the phone.',
    who: 'Meera',
    role: 'freelance designer',
    tag: 'week 3',
  },
  {
    body: 'On calls I point my phone at the board and the team can read every wire. Setup was a QR scan on shared Wi-Fi. Done.',
    who: 'Ravi',
    role: 'hardware engineer',
    tag: 'week 4',
  },
];

export default function Reviews() {
  return (
    <section className="block" id="love">
      <div className="wrap">
        <SectionHead
          heading={<>Early users, unscripted.</>}
        />
        <div className="voice-lead reveal">
          <p>{NOTES[0].body}</p>
          <div className="who"><b>{NOTES[0].who}</b> · {NOTES[0].role} · {NOTES[0].tag}</div>
        </div>
        <div className="voice-row reveal">
          {NOTES.slice(1).map((n) => (
            <blockquote key={n.who}>
              <p>{n.body}</p>
              <div className="who"><b>{n.who}</b> · {n.role} · {n.tag}</div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
