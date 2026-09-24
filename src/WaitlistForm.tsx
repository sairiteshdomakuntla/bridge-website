import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { SITE } from './config';
import { getWaitlistEntries, isValidEmail, saveWaitlistEntry } from './waitlist';

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
          <div className="glyph win" aria-hidden="true">
            <Check size={22} />
          </div>
          <div>
            <h3>You’re on the list</h3>
            <div className="file">early access · invite by email</div>
          </div>
        </div>
        <p className="wl-intro">
          Thanks — we’re letting people in gradually so setup stays smooth. We’ll send your invite to{' '}
          <b>{alreadyIn && !done ? 'your inbox' : email || 'your inbox'}</b> as soon as your spot opens. Questions?{' '}
          <a href={`mailto:${SITE.supportEmail}`}>Contact support</a>
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
        <div className="glyph win" aria-hidden="true">
          <Sparkles size={20} />
        </div>
        <div>
          <h3>Join the waitlist</h3>
          <div className="file">early access · free during v1</div>
        </div>
      </div>
      <p className="wl-intro">
        Bridge is onboarding early users in small batches. Leave your email and we’ll send your Windows + Android
        install links as soon as your spot opens.
      </p>
      <form className="wl-form" onSubmit={submit} noValidate>
        <label className="wl-field">
          <span>Name <i>(optional)</i></span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ritesh"
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
        <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
          {saving ? 'Saving your spot…' : 'Notify me — join waitlist'}
        </button>
        <p className="wl-fine">No spam, no account. One email when your invite is ready.</p>
      </form>
    </div>
  );
}
