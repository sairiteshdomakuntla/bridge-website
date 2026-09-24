import SectionHead from './SectionHead';

const NOTES: { body: string; who: string; role: string; tag: string }[] = [
  {
    body: 'I used to send Figma and Docs links to myself on WhatsApp, then open them on my laptop. Now I just copy on my phone and paste on the PC. Been doing this for a couple of weeks and I have not retyped a link once.',
    who: 'Aarav',
    role: 'CS student',
    tag: 'week 2',
  },
  {
    body: 'Client screenshots go straight into Photoshop at full size — no more WhatsApp compression ruining them. I also reply to messages from my actual keyboard instead of picking up the phone every five minutes.',
    who: 'Meera',
    role: 'freelance designer',
    tag: 'week 3',
  },
  {
    body: 'On calls I point my phone at the board and the team can read every wire. My laptop cam could never do that. Setup was QR code, same Wi-Fi, done — I did not open the app again after that.',
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
          eyebrow="Early testers"
          heading={
            <>
              From people using it. <span className="thin">In their words.</span>
            </>
          }
        />
        <div className="cr-grid">
          {NOTES.map((n) => (
            <div className="cr-card quote reveal" key={n.who}>
              <p className="note-body">{n.body}</p>
              <div className="who">
                <span className="who-name">{n.who}</span>
                <span className="who-role">{n.role}</span>
                <span className="who-tag">{n.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
