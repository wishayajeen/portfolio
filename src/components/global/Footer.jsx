import { useState } from 'react';
import { Copy } from 'lucide-react';

export default function Footer({ pockyProfileSrc }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const contactEmail = 'wpjeen@gmail.com';

  const handleSend = () => {
    if (email.trim()) { setSent(true); }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard failures silently.
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer id="footer">

      {/* CTA band */}
      <div className="footer-cta">
        <div className="footer-cta-inner">
          <div className="footer-cta-content">
            <div className="footer-eyebrow">let's talk</div>
            <h2 className="footer-headline">
              Got a project, collab,<br />or just want to say hi?
            </h2>
            <p className="footer-sub">
              I'm always up for interesting conversations about design, AI, and building things in public. Drop me a line.
            </p>

            {/* TODO: wire up to a form service (e.g. Formspree) before un-hiding */}
            <div style={{ display: 'none' }}>
              {!sent ? (
                <div className="footer-email-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="your@email.com"
                    className="footer-email-input" />
                  <button onClick={handleSend} className="footer-email-btn"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                    Send →
                  </button>
                </div>
              ) : (
                <div className="footer-success">
                  <span className="footer-success-dot" />
                  Got it! I'll be in touch soon.
                </div>
              )}
            </div>

            <div className="footer-contact-row">
              {copied ? (
                <div className="footer-success footer-success--inline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </div>
              ) : (
                <div className="footer-email-copy-group">
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  <button type="button" className="icon-btn" onClick={copyEmail} aria-label="Copy email address">
                    <Copy size={20} aria-hidden="true" />
                  </button>
                </div>
              )}
              <span className="footer-contact-divider">or find me on</span>
              {[
                { label: 'GitHub', href: 'https://github.com/wishayajeen' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wsjeen/' },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="footer-inner">
          <div className="footer-cols">

            {/* Left: brand */}
            <div>
              <div className="footer-brand-header">
                <span className="footer-brand-name">Jeen</span>
              </div>
              <p className="footer-brand-desc">
                Designer building at the intersection of AI and design systems.
              </p>
              <div className="footer-powered">
                <img src={pockyProfileSrc} alt="Pocky" className="footer-powered-avatar" />
                <span className="footer-powered-label">Powered by Pocky</span>
              </div>
            </div>

            {/* Nav columns */}
            <div className="footer-nav-cols">
              {[{ title: 'Navigate', links: [['Playground', 'playground'], ['About', 'about'], ['Work', 'work']] }].map((col) => (
                <div key={col.title} className="footer-nav-col">
                  <div className="footer-nav-heading">{col.title}</div>
                  {col.links.map(([label, id]) => (
                    <button key={label} className="footer-nav-link" onClick={() => id && scrollTo(id)}>
                      {label}
                    </button>
                  ))}
                </div>
              ))}

              {/* Status */}
              <div className="footer-status-col">
                <div className="footer-status-heading">Status</div>
                <div className="footer-status-badge">
                  <span className="footer-status-dot" />
                  System live
                </div>
                <span className="footer-version">v1.0 · April 2026</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom-bar">
            <span className="footer-copyright">
              © 2026 Jeen. Built as a living system.
            </span>
            <div className="footer-social-links">
              {[
                { label: 'GitHub', href: 'https://github.com/wishayajeen' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wsjeen/' },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="footer-nav-link" target="_blank" rel="noopener noreferrer">{label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
