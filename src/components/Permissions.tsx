import { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { PERMS, type Perm } from '../data/site';
import SectionHead from './SectionHead';

export default function Permissions() {
  const [filter, setFilter] = useState<'all' | 'android' | 'windows'>('all');

  const filtered =
    filter === 'all' ? PERMS : PERMS.filter((p) => p.platform === filter);

  return (
    <section className="block" id="permissions">
      <div className="wrap">
        <SectionHead
          heading={<>Every permission, on the record.</>}
          desc="Bridge needs a few sensitive permissions to do its job. Each one is requested only when its feature needs it, and you can revoke it any time."
        />

        <div className="perm-intro reveal">
          <span>
            <Check size={14} /> Asked only on-demand
          </span>
          <span>
            <Check size={14} /> 100% revocable in OS settings
          </span>
          <span>
            <Check size={14} /> 0 telemetry · 0 cloud upload
          </span>
        </div>

        <details className="geek reveal">
          <summary>
            <span>Full permission audit</span>
            <span className="geek-hint">{PERMS.length} entries · 0 hidden</span>
          </summary>
          <div className="geek-body flush">
            <div className="perm-ledger">
              <div className="perm-ledger-head">
                <div className="perm-ledger-title">
                  <ShieldCheck size={16} />
                  <span>Permissions Ledger</span>
                  <span className="perm-ledger-badge">
                    {filtered.length} of {PERMS.length} entries
                  </span>
                </div>

                <div className="perm-filters" role="tablist" aria-label="Filter by OS">
                  <button
                    type="button"
                    className={`perm-filter-btn${filter === 'all' ? ' on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter('all');
                    }}
                  >
                    All ({PERMS.length})
                  </button>
                  <button
                    type="button"
                    className={`perm-filter-btn${filter === 'android' ? ' on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter('android');
                    }}
                  >
                    Android (5)
                  </button>
                  <button
                    type="button"
                    className={`perm-filter-btn${filter === 'windows' ? ' on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter('windows');
                    }}
                  >
                    Windows (1)
                  </button>
                </div>
              </div>

              <div className="perm-cards">
                {filtered.map((p: Perm) => (
                  <div className="perm-card" key={p.perm}>
                    <div className="perm-card-top">
                      <div className="perm-card-name">
                        <code className="perm-code">{p.perm}</code>
                        <span className={`perm-badge-os ${p.platform}`}>
                          {p.platform}
                        </span>
                      </div>
                    </div>

                    <p className="perm-why">{p.why}</p>

                    <div className="perm-meta-grid">
                      <div className="perm-meta-box">
                        <span className="perm-meta-label">When asked</span>
                        <span className="perm-meta-val">{p.when}</span>
                      </div>
                      <div className="perm-meta-box deny">
                        <span className="perm-meta-label">If denied</span>
                        <span className="perm-meta-val">{p.ifDenied}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
