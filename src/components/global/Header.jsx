import { useState, useEffect } from 'react';

export default function Header({ logoSrc }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    transition: 'all 250ms cubic-bezier(0.22,1,0.36,1)',
    padding: '0 48px',
    background: scrolled || menuOpen ? 'rgba(10,10,10,0.96)' : 'transparent',
    backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
    borderBottom: scrolled || menuOpen ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
  };

  const linkStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
    color: '#FAFAFA', background: 'none', border: 'none', cursor: 'pointer',
    padding: '6px 12px', borderRadius: 99, transition: 'color 150ms',
    letterSpacing: '0.01em',
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src={logoSrc} width="32" height="32" alt="Jeen" style={{ borderRadius: '50%', padding: 2, background: '#FFFFFF', objectFit: 'cover' }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#FAFAFA' }}>Jeen</span>
        </button>

        {/* Desktop nav */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[['Playground', 'playground'], ['About', 'about'], ['Work', 'work']].map(([label, id]) => (
            <button key={id} className="nav-link" style={linkStyle} onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <button className="nav-cta" onClick={() => scrollTo('footer')} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            background: '#F3FE52', color: '#0A0A0A', padding: '9px 20px',
            borderRadius: 99, border: '1.5px solid #0A0A0A', cursor: 'pointer',
            marginLeft: 8, transition: 'transform 150ms, box-shadow 150ms',
            boxShadow: '2px 2px 0 0 #0A0A0A',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0 0 #0A0A0A'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 0 #0A0A0A'; }}
          >Say hi →</button>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 24px 24px', display: 'flex', flexDirection: 'column',
        }}>
          {[['Playground', 'playground'], ['About', 'about'], ['Work', 'work'], ['Say hi →', 'footer']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 500,
              color: id === 'footer' ? '#F3FE52' : '#FAFAFA',
              background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', padding: '14px 0', textAlign: 'left',
            }}>{label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}
