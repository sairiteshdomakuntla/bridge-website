import SectionHead from './SectionHead';

export default function Story() {
  return (
    <section className="block" id="story">
      <div className="wrap">
        <SectionHead
          eyebrow="Why Bridge exists"
          heading={
            <>
              You live in two machines. <span className="thin">It shouldn’t feel like it.</span>
            </>
          }
          desc="iPhone + Mac users got this years ago. Android + Windows users got cables and a WhatsApp group with just themselves in it. Bridge fixes that — simply and privately."
        />
        <div className="story-grid">
          <div className="story-card reveal">
            <span className="tag">The old way</span>
            <h3>Copy on phone. Dump it in your own WhatsApp chat. Open laptop. Copy it again. Paste.</h3>
            <p>
              Links arrive broken across lines. Screenshots come back compressed. The chat buries everything by
              evening. And every hop passes through someone else's server.
            </p>
          </div>
          <div className="story-card after reveal">
            <span className="tag">The Bridge way</span>
            <h3>Copy on either side. Paste on the other. That’s the whole manual.</h3>
            <p>
              Scan one code to connect. From then on your links, images, screenshots, files and texts move both
              ways — phone to PC and PC to phone — and your phone's camera shows up where you're working.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
