import { useState } from 'react';
import { Plus } from 'lucide-react';
import { IS_WAITLIST, SITE } from '../config';
import { FAQS } from '../data/site';
import SectionHead from './SectionHead';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Waitlist mode is a focused pre-launch page: drop the FAQ that assumes
  // the reader already has the installer ("My PC warned me").
  const visibleFaqs = IS_WAITLIST
    ? FAQS.filter((f) => !f.q.startsWith('Is Bridge safe to install'))
    : FAQS;

  return (
    <section className="block" id="faq">
      <div className="wrap">
        <SectionHead
          eyebrow="FAQ"
          heading={
            <>
              Wondering something? <span className="thin">Start here.</span>
            </>
          }
        />
        <div className="faq reveal">
          {visibleFaqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div className={`faq-item${open ? ' open' : ''}`} key={f.q}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span>{f.q}</span>
                  <Plus className="plus" size={18} aria-hidden="true" />
                </button>
                <div className="faq-a" aria-hidden={!open}>
                  <div className="faq-a-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="faq-foot reveal">
          {IS_WAITLIST ? (
            <>
              More questions? Reach us at{' '}
              <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> — we read everything.
            </>
          ) : (
            <>
              Technical and want packet-level proof? Expand the Technical details sections above — keys, wire format
              and the full permission ledger are all there.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
