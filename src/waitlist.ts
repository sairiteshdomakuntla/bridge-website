import { WAITLIST_ENDPOINT, WAITLIST_STORAGE_KEY } from './config';

export type WaitlistEntry = {
  name: string;
  email: string;
  platform: string;
  createdAt: string;
};

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getWaitlistEntries(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist a waitlist signup.
 *
 * The website is fully static (no backend/database in this repo), so signups
 * are stored in localStorage by default. If VITE_WAITLIST_ENDPOINT is set,
 * the entry is ALSO forwarded there via POST (fire-and-forget) so a real
 * collection backend can be attached later with zero code changes.
 */
export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  const entries = getWaitlistEntries();
  if (!entries.some((e) => e.email.toLowerCase() === entry.email.toLowerCase())) {
    entries.push(entry);
    try {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Storage full/blocked — still try the endpoint below.
    }
  }

  if (WAITLIST_ENDPOINT) {
    try {
      await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(entry),
      });
    } catch {
      // Local copy is already saved — endpoint failures must not block signup.
    }
  }
}
