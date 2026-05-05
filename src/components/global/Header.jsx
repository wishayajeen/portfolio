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

  const navClass = [
    'site-nav',
    scrolled || menuOpen ? 'nav--active' : '',
    menuOpen ? 'menu-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass}>
      <div className="nav-inner">
        {/* Logo */}
        <button className="nav-logo-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoSrc} width="32" height="32" alt="Jeen" className="nav-logo-img" />
          <span className="nav-logo-name">Jeen</span>
        </button>

        {/* Desktop nav */}
        <div className="nav-links-desktop">
          {[['Playground', 'playground'], ['About', 'about'], ['Work', 'work']].map(([label, id]) => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <button className="nav-cta" onClick={() => scrollTo('footer')}>Say hi →</button>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile-dropdown">
          {[['Playground', 'playground'], ['About', 'about'], ['Work', 'work'], ['Say hi →', 'footer']].map(([label, id]) => (
            <button
              key={id}
              className={`nav-mobile-link${id === 'footer' ? ' nav-mobile-link--accent' : ''}`}
              onClick={() => scrollTo(id)}
            >{label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}
