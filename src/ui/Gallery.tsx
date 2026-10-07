import {Download, Repeat2, Search, SlidersHorizontal, Wand2, X} from 'lucide-react';
import {useMemo, useState} from 'react';
import {searchText, templates, variants, vocab, type Format, type Tone, type Variant} from '../catalog/catalog';
import {SCENE_TYPES} from '../videos/vocab';
import {applyKit, kitActive, useBrandKit} from './brandKit';
import {BrandKitPanel} from './BrandKitPanel';
import {Header} from './Header';
import {Media} from './Media';

type Sort = 'popular' | 'new' | 'remixed';
type Energy = 'Calm' | 'Medium' | 'High';
type Filters = {
  template: string | null;
  purpose: string | null;
  formats: Format[];
  styles: string[];
  tones: Tone[];
  energy: Energy | null;
  scenes: string[];
};

export const energyOf = (n: number): Energy => (n <= 2 ? 'Calm' : n === 3 ? 'Medium' : 'High');
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const FORMATS: Format[] = ['16:9', '9:16', '1:1'];
const SCENE_FILTERS = Object.entries(SCENE_TYPES).filter(([k]) => k !== 'transition');

function matches(v: Variant, f: Filters, skip?: keyof Filters) {
  if (skip !== 'template' && f.template && v.template !== f.template) return false;
  if (skip !== 'purpose' && f.purpose && v.purpose !== f.purpose) return false;
  if (skip !== 'formats' && f.formats.length && !f.formats.includes(v.format)) return false;
  if (skip !== 'styles' && f.styles.length && !f.styles.every((s) => v.style.includes(s))) return false;
  if (skip !== 'tones' && f.tones.length && !f.tones.includes(v.tone)) return false;
  if (skip !== 'energy' && f.energy && energyOf(v.energy) !== f.energy) return false;
  if (skip !== 'scenes' && f.scenes.length && !f.scenes.every((s) => v.tmpl.meta.scenes.some((x) => x.type === s))) return false;
  return true;
}

export function Gallery({initialTemplate}: {initialTemplate: string | null}) {
  const kit = useBrandKit();
  const applied = kitActive(kit);
  const [kitOpen, setKitOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('popular');
  const [hover, setHover] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [f, setF] = useState<Filters>({template: initialTemplate, purpose: null, formats: [], styles: [], tones: [], energy: null, scenes: []});

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({...s, [k]: v}));
  const toggle = <K extends 'formats' | 'styles' | 'tones' | 'scenes'>(k: K, v: Filters[K][number]) =>
    setF((s) => {
      const list = s[k] as string[];
      return {...s, [k]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v]};
    });

  const searched = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return variants.filter((v) => terms.every((t) => searchText(v).includes(t)));
  }, [q]);

  const count = (skip: keyof Filters, pred: (v: Variant) => boolean) => searched.filter((v) => matches(v, f, skip) && pred(v)).length;

  const results = useMemo(() => {
    const key: Record<Sort, (v: Variant) => number> = {
      popular: (v) => v.stats.exports,
      remixed: (v) => v.stats.remixes,
      new: (v) => Date.parse(v.createdAt),
    };
    return searched.filter((v) => matches(v, f)).sort((a, b) => key[sort](b) - key[sort](a));
  }, [searched, f, sort]);

  const active = Boolean(q || f.template || f.purpose || f.formats.length || f.styles.length || f.tones.length || f.energy || f.scenes.length);
  const activeCount =
    (f.template ? 1 : 0) + (f.purpose ? 1 : 0) + (f.energy ? 1 : 0) + f.formats.length + f.styles.length + f.tones.length + f.scenes.length;
  const clear = () => {
    setQ('');
    setF({template: null, purpose: null, formats: [], styles: [], tones: [], energy: null, scenes: []});
    if (location.hash.includes('?')) location.hash = '#/';
  };

  const chip = (on: boolean, label: string, n: number, onClick: () => void) => (
    <button key={label} className={`chip ${on ? 'on' : ''}`} disabled={!on && n === 0} onClick={onClick}>
      {label}
      <span className="chip-count">{n}</span>
    </button>
  );

  return (
    <div className="page">
      <Header>
        <label className="search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos, styles, keywords" />
          {q && (
            <button className="icon-btn ghost" onClick={() => setQ('')} title="Clear search">
              <X size={14} />
            </button>
          )}
        </label>
        <button className={`kit-btn ${kitOpen ? 'open' : ''} ${applied ? 'applied' : ''}`} onClick={() => setKitOpen((o) => !o)} title="Brand kit">
          <Wand2 size={16} />
          <span className="kit-btn-label">Brand kit</span>
          {applied && <span className="dot" />}
        </button>
      </Header>

      {kitOpen && <BrandKitPanel />}

      <div className="gallery-layout">
        <aside className={`filters ${filtersOpen ? 'open' : ''}`}>
          <section>
            <h3>Purpose</h3>
            <div className="list">
              {vocab.purpose.map((p) => {
                const n = count('purpose', (v) => v.purpose === p);
                return (
                  <button key={p} className={`row-btn ${f.purpose === p ? 'on' : ''}`} disabled={!n && f.purpose !== p} onClick={() => set('purpose', f.purpose === p ? null : p)}>
                    <span>{p}</span>
                    <span className="count">{n}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section>
            <h3>Format</h3>
            <div className="chips">{FORMATS.map((x) => chip(f.formats.includes(x), x, count('formats', (v) => v.format === x), () => toggle('formats', x)))}</div>
          </section>
          <section>
            <h3>Style</h3>
            <div className="chips">{vocab.style.map((s) => chip(f.styles.includes(s), s, count('styles', (v) => v.style.includes(s)), () => toggle('styles', s)))}</div>
          </section>
          <section>
            <h3>Energy</h3>
            <div className="chips">
              {(['Calm', 'Medium', 'High'] as Energy[]).map((e) =>
                chip(f.energy === e, e, count('energy', (v) => energyOf(v.energy) === e), () => set('energy', f.energy === e ? null : e)),
              )}
            </div>
          </section>
          <section>
            <h3>Tone</h3>
            <div className="chips">{(['Dark', 'Light'] as Tone[]).map((t) => chip(f.tones.includes(t), t, count('tones', (v) => v.tone === t), () => toggle('tones', t)))}</div>
          </section>
          <section>
            <h3>Includes scene</h3>
            <div className="chips">
              {SCENE_FILTERS.map(([k, label]) =>
                chip(f.scenes.includes(k), label, count('scenes', (v) => v.tmpl.meta.scenes.some((s) => s.type === k)), () => toggle('scenes', k)),
              )}
            </div>
          </section>
          <section>
            <h3>Template</h3>
            <div className="list">
              {templates.map((t) => {
                const n = count('template', (v) => v.template === t.id);
                return (
                  <button key={t.id} className={`row-btn ${f.template === t.id ? 'on' : ''}`} onClick={() => set('template', f.template === t.id ? null : t.id)}>
                    <span>
                      {t.title} <span className="muted small">@{t.creator}</span>
                    </span>
                    <span className="count">{n}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <main>
          <div className="results-bar">
            <div className="results-count">
              <button className={`filters-toggle ${filtersOpen ? 'on' : ''}`} onClick={() => setFiltersOpen((o) => !o)} title="Filters">
                <SlidersHorizontal size={15} />
                {activeCount > 0 && <span className="badge-count">{activeCount}</span>}
              </button>
              {results.length} {results.length === 1 ? 'video' : 'videos'}
              {active && (
                <button className="link-btn" onClick={clear}>
                  Clear filters
                </button>
              )}
            </div>
            <div className="segmented" role="tablist">
              {(['popular', 'new', 'remixed'] as Sort[]).map((s) => (
                <button key={s} className={sort === s ? 'on' : ''} onClick={() => setSort(s)}>
                  {s === 'popular' ? 'Popular' : s === 'new' ? 'Newest' : 'Most remixed'}
                </button>
              ))}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              No videos match.
              <button className="link-btn" onClick={clear}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid">
              {results.map((v) => {
                const props = applied ? applyKit(v.props, kit) : null;
                const theme = (props ?? v.props).theme;
                return (
                  <a
                    key={v.id}
                    href={`#/v/${v.id}`}
                    className="card"
                    onMouseEnter={() => setHover(v.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(v.id)}
                    onBlur={() => setHover(null)}
                  >
                    <div className="card-media">
                      <Media variant={v} props={props} playing={!props && hover === v.id} />
                      <span className="badge">
                        {v.format} · {v.seconds}s
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        <span>{v.title}</span>
                        <div className="palette">
                          {Object.values(theme).map((c: string, i) => (
                            <span key={i} style={{background: c}} />
                          ))}
                        </div>
                      </div>
                      <div className="card-meta">
                        <span>
                          @{v.creator} · {v.tmpl.title}
                        </span>
                        <span className="stats">
                          <span title="Exports">
                            <Download size={13} /> {fmt(v.stats.exports)}
                          </span>
                          <span title="Remixes">
                            <Repeat2 size={13} /> {fmt(v.stats.remixes)}
                          </span>
                        </span>
                      </div>
                      <div className="tags">
                        <span className="tag strong">{v.purpose}</span>
                        <span className="tag">{v.placement[0]}</span>
                        {v.style.map((s) => (
                          <span key={s} className="tag">
                            {s}
                          </span>
                        ))}
                        <span className="tag">{energyOf(v.energy)}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
