import {Eraser} from 'lucide-react';
import {KIT_ROLE_KEYS, ROLES, THEME_LABELS, THEME_ROLES, type Theme} from '../videos/vocab';
import {setBrandKit, useBrandKit} from './brandKit';
import {PRESETS} from './palettes';

const PLACEHOLDERS: Record<string, string> = {
  brand: 'Acme',
  headline: 'Meet the new Acme',
  subhead: 'Everything your team needs in one place',
  point1: 'Fast setup',
  point2: 'Secure',
  point3: 'Loved by teams',
  cta: 'Try it free',
};

export function BrandKitPanel() {
  const kit = useBrandKit();
  const setText = (role: string, value: string) => setBrandKit((k) => ({...k, enabled: true, texts: {...k.texts, [role]: value}}));
  const setTheme = (theme: Theme | null) => setBrandKit((k) => ({...k, enabled: true, theme}));

  return (
    <section className="kit">
      <div className="kit-head">
        <h2>Brand kit</h2>
        <div className="kit-actions">
          <label className="switch" title="Preview on all videos">
            <input type="checkbox" checked={kit.enabled} onChange={(e) => setBrandKit((k) => ({...k, enabled: e.target.checked}))} />
            <span />
          </label>
          <button className="icon-btn ghost" title="Clear brand kit" onClick={() => setBrandKit({enabled: false, texts: {}, theme: null})}>
            <Eraser size={15} />
          </button>
        </div>
      </div>
      <div className="kit-grid">
        {KIT_ROLE_KEYS.map((role) => {
          const v = kit.texts[role] ?? '';
          const over = v.length > ROLES[role].max;
          return (
            <label key={role} className={`field ${over ? 'invalid' : ''}`}>
              <span className="field-label">
                {ROLES[role].label}
                <span className={`counter ${over ? 'over' : ''}`}>
                  {v.length}/{ROLES[role].max}
                </span>
              </span>
              <input type="text" value={v} placeholder={PLACEHOLDERS[role]} onChange={(e) => setText(role, e.target.value)} />
            </label>
          );
        })}
      </div>
      <div className="kit-theme">
        <span className="field-label">Colors</span>
        <div className="kit-palettes">
          <button className={`palette-btn none ${kit.theme ? '' : 'on'}`} title="Keep each video's colors" onClick={() => setTheme(null)}>
            Original
          </button>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              className={`palette-btn ${JSON.stringify(kit.theme) === JSON.stringify(p.colors) ? 'on' : ''}`}
              title={p.name}
              onClick={() => setTheme(p.colors)}
            >
              {THEME_ROLES.map((r) => (
                <span key={r} style={{background: p.colors[r]}} />
              ))}
            </button>
          ))}
        </div>
        {kit.theme && (
          <div className="kit-colors">
            {THEME_ROLES.map((r) => (
              <label key={r} className="swatch-sm" title={THEME_LABELS[r]}>
                <span style={{background: kit.theme![r]}} />
                <input type="color" value={kit.theme![r]} onChange={(e) => setTheme({...kit.theme!, [r]: e.target.value})} />
                {THEME_LABELS[r]}
              </label>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
