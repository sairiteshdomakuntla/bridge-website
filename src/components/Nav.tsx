import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { IS_WAITLIST, SIGNUP_PATH } from '../config';
import { Logo } from './brand';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/features', label: 'Features' },
    { to: '/tour', label: 'Tour' },
    { to: '/setup', label: 'How it works' },
    ...(!IS_WAITLIST ? [{ to: '/love', label: 'Reviews' }] : []),
    { to: '/faq', label: 'FAQ' },
    { to: SIGNUP_PATH, label: IS_WAITLIST ? 'Waitlist' : 'Download' },
  ];

  return (
    <>
      <div className="nav-shell">
        <nav className="nav">
          <Link className="nav-logo" to="/">
            <Logo />
            <span>Bridge</span>
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link className="nav-cta" to={SIGNUP_PATH}>
            {IS_WAITLIST ? 'Join waitlist' : 'Get Bridge — free'}
          </Link>
          <button
            className="nav-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
