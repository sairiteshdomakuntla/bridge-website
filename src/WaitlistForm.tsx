import { useState } from 'react';
import { SITE } from './config';
import { getWaitlistEntries, isValidEmail, saveWaitlistEntry } from './waitlist';

/**
 * Waitlist signup card. Reuses the existing .dl-card / .btn visual language
 * so no redesign is introduced — it simply swaps the download buttons for a
 * signup flow when LAUNCH_MODE === "waitlist".
 */
export default function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // If this browser already signed up, show the success state immediately.
  const [alreadyIn] = useState(() => getWaitlistEntries().length > 0);

  if (done || alreadyIn) {
    return (
      <div className="dl-card featured reveal in">
        <div className="os">
          <div className="glyph win" aria-hidden="true">✓</div>
          <div>
            <h3>You’re on the list</h3>
            <div className="file mono">early access · invite by email</div>
          </div>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--muted)', marginBottom: 18, lineHeight: 1.6 }}>
          Thanks — we’re letting people in gradually so setup stays smooth. We’ll send your invite to{' '}
          <b style={{ color: 'var(--text)' }}>{alreadyIn && !done ? 'your inbox' : email || 'your inbox'}</b> as soon as your spot opens up. Questions?{' '}
          <a href={`mailto:${SITE.supportEmail}`} style={{ color: '#c4d3ff', textDecoration: 'underline' }}>
            Contact support
          </a>
        </p>
        <div className="wl-queue">
          <span className="tick">→</span> No download needed yet — we’ll send your links when it’s your turn.
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setError('Enter a valid email address so we can send your invite.');
      return;
    }
    setError(null);
    setSaving(true);
    // Bridge only works with both devices (Android + Windows on the same
    // Wi-Fi), so there is no setup choice to offer — record it directly.
    await saveWaitlistEntry({
      name: name.trim(),
      email: cleanEmail.toLowerCase(),
      platform: 'Android + Windows',
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    setDone(true);
  };

  return (
    <div className="dl-card featured reveal in">
      <div className="os">
        <div className="glyph win" aria-hidden="true">✦</div>
        <div>
          <h3>Join the waitlist</h3>
          <div className="file mono">early access · free during v1</div>
        </div>
      </div>
      <p style={{ fontSize: 14.5, color: 'var(--muted)', marginBottom: 18 }}>
        Bridge is onboarding early users in small batches. Leave your email and we’ll send
        your Windows + Android install links as soon as your spot opens.
      </p>
      <form className="wl-form" onSubmit={submit} noValidate>
        <label className="wl-field">
          <span>Name <i>(optional)</i></span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav"
            autoComplete="name"
            maxLength={80}
          />
        </label>
        <label className="wl-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        {error && <p className="wl-error" role="alert">{error}</p>}
        <button className="btn btn-specular" type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
          {saving ? 'Saving your spot…' : 'Notify me — join waitlist'}
        </button>
        <p className="wl-fine">No spam, no account. One email when your invite is ready.</p>
      </form>
    </div>
  );
}
