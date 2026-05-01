import { useState, useEffect } from 'react';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  heroHeadline: "Hi, I'm Jeen.\nI design systems\nthat think.",
  accentColor: '#F3FE52',
  showScrollHint: true,
  workStyle: 'rows',
} /*EDITMODE-END*/;

export default function TweaksPanel() {
  const [visible, setVisible] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const set = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: '#FAFAFA', border: '1.5px solid #0A0A0A', borderRadius: 12,
      boxShadow: '5px 5px 0 0 #0A0A0A', padding: '20px', width: 260,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: '#0A0A0A' }}>Tweaks</span>
        <button
          onClick={() => { setVisible(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#9A9A90', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Accent color */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#6A6A60', display: 'block', marginBottom: 6 }}>Accent color</label>
          <input type="color" value={tweaks.accentColor}
            onChange={(e) => set('accentColor', e.target.value)}
            style={{ width: '100%', height: 36, border: '1.5px solid #0A0A0A', borderRadius: 6, cursor: 'pointer' }} />
        </div>

        {/* Work style */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#6A6A60', display: 'block', marginBottom: 6 }}>Work section style</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['rows', 'cards'].map((opt) => (
              <button key={opt} onClick={() => set('workStyle', opt)} style={{
                flex: 1, padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: tweaks.workStyle === opt ? '#0A0A0A' : 'transparent',
                color: tweaks.workStyle === opt ? '#F3FE52' : '#6A6A60',
                border: '1.5px solid ' + (tweaks.workStyle === opt ? '#0A0A0A' : '#E8E8E0'),
                transition: 'all 150ms',
              }}>{opt}</button>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#6A6A60' }}>Show scroll indicator</label>
          <div onClick={() => set('showScrollHint', !tweaks.showScrollHint)} style={{
            width: 36, height: 20, borderRadius: 99,
            background: tweaks.showScrollHint ? '#F3FE52' : '#E8E8E0',
            border: '1.5px solid #0A0A0A', cursor: 'pointer', position: 'relative', transition: 'background 200ms',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#0A0A0A',
              position: 'absolute', top: 1, left: tweaks.showScrollHint ? 18 : 2, transition: 'left 200ms',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
