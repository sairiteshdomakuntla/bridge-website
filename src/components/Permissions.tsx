import { Check, ChevronDown } from 'lucide-react';
import { PERMS } from '../data/site';
import SectionHead from './SectionHead';

export default function Permissions() {
  return (
    <section className="block" id="permissions">
      <div className="wrap">
        <SectionHead
          eyebrow="Permissions"
          heading={
            <>
              Asked only when needed. <span className="thin">Explained every time.</span>
            </>
          }
          desc="Bridge needs a few sensitive permissions to do its job. Each one is requested only when its feature needs it, and you can revoke it any time."
        />
        <div className="perm-intro reveal">
          <span className="trust-chip">
            <Check size={14} /> asked only when needed
          </span>
          <span className="trust-chip">
            <Check size={14} /> everything revocable
          </span>
          <span className="trust-chip">
            <Check size={14} /> nothing hidden
          </span>
        </div>
        <details className="geek reveal">
          <summary>
            <span>Full permission list</span>
            <span className="geek-hint">
              6 entries · 0 hidden <ChevronDown size={12} />
            </span>
          </summary>
          <div className="geek-body flush">
            <div className="perm-table">
              <div className="perm-row head">
                <div>Permission / capability</div>
                <div>Why · when · if denied</div>
              </div>
              {PERMS.map((p) => (
                <div className="perm-row" key={p.perm}>
                  <div className="perm-name">
                    <code>{p.perm}</code>
                    <span className={`plat ${p.platform}`}>{p.platform}</span>
                  </div>
                  <div className="perm-detail">
                    <p className="why">{p.why}</p>
                    <div className="meta">
                      <div>
                        <dt>Asked</dt>
                        <dd>{p.when}</dd>
                      </div>
                      <div>
                        <dt>If denied</dt>
                        <dd className="deny">{p.ifDenied}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
