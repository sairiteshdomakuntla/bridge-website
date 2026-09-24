export function Logo({ size = 26 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Bridge logo"
      width={size}
      height={size}
      className="nav-logo-mark-img"
      style={{ width: size, height: size, borderRadius: Math.max(6, size * 0.28), display: 'block' }}
    />
  );
}

export function WindowsGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2.5" y="3.5" width="9" height="8" rx="1.5" />
      <rect x="12.5" y="3.5" width="9" height="8" rx="1.5" />
      <rect x="2.5" y="12.5" width="9" height="8" rx="1.5" />
      <rect x="12.5" y="12.5" width="9" height="8" rx="1.5" />
    </svg>
  );
}

export function AndroidGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.4 5 6.8 3.2M15.6 5l1.6-1.8" />
      <path d="M5 11.2a7 7 0 0 1 14 0" />
      <path d="M5 11.2h14" />
      <circle cx="9.4" cy="8.6" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="8.6" r="0.5" fill="currentColor" stroke="none" />
      <path d="M8.5 13.4v5.4M15.5 13.4v5.4M5.9 14.4v3.6M18.1 14.4v3.6" />
    </svg>
  );
}
