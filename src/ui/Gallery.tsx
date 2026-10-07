import {Download, Repeat2, Search, X} from 'lucide-react';
import {useMemo, useState} from 'react';
import {entries, searchText, technical, vocab, type Entry} from '../catalog/catalog';
import {Header} from './Header';
import {Thumb} from './Thumb';

type Sort = 'popular' | 'new' | 'remixed';

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export function Gallery() {
  const [q, setQ] = useState('');
  const [useCase, setUseCase] = useState<string | null>(null);
  const [styles, setStyles] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('popular');
  const [hover, setHover] = useState<string | null>(null);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = entries.filter((e) => {
      if (useCase && e.useCase !== useCase) return false;
      if (styles.length && !styles.every((s) => e.style.includes(s))) return false;
      if (moods.length && !moods.every((m) => e.mood.includes(m))) return false;
      const hay = searchText(e);
      return terms.every((t) => hay.includes(t));
    });
    const key: Record<Sort, (e: Entry) => number> = {
      popular: (e) => e.stats.exports,
      remixed: (e) => e.stats.remixes,
      new: (e) => Date.parse(e.createdAt),
    };
    return [...list].sort((a, b) => key[sort](b) - key[sort](a));
  }, [q, useCase, styles, moods, sort]);

  const active = Boolean(q || useCase || styles.length || moods.length);
  const clear = () => {
    setQ('');
    setUseCase(null);
    setStyles([]);
    setMoods([]);
  };

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
      </Header>

      <div className="gallery-layout">
        <aside className="filters">
          <section>
            <h3>Use case</h3>
            <div className="list">
              {vocab.useCase.map((u) => (
                <button key={u} className={`row-btn ${useCase === u ? 'on' : ''}`} onClick={() => setUseCase(useCase === u ? null : u)}>
                  <span>{u}</span>
                  <span className="count">{entries.filter((e) => e.useCase === u).length}</span>
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3>Style</h3>
            <div className="chips">
              {vocab.style.map((s) => (
                <button key={s} className={`chip ${styles.includes(s) ? 'on' : ''}`} onClick={() => toggle(styles, setStyles, s)}>
                  {s}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3>Mood</h3>
            <div className="chips">
              {vocab.mood.map((m) => (
                <button key={m} className={`chip ${moods.includes(m) ? 'on' : ''}`} onClick={() => toggle(moods, setMoods, m)}>
                  {m}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3>Format</h3>
            <div className="chips">
              {['16:9', '9:16', '1:1'].map((f) => (
                <span key={f} className={`chip static ${f === '16:9' ? '' : 'disabled'}`}>
                  {f}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <main>
          <div className="results-bar">
            <div className="results-count">
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
              {results.map((e) => {
                const t = technical(e);
                return (
                  <a
                    key={e.id}
                    href={`#/v/${e.id}`}
                    className="card"
                    onMouseEnter={() => setHover(e.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(e.id)}
                    onBlur={() => setHover(null)}
                  >
                    <div className="card-media">
                      <Thumb entry={e} playing={hover === e.id} />
                      <span className="badge">
                        {t.format} · {t.seconds}s
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        <span>{e.title}</span>
                        <div className="palette">
                          {Object.values(e.props.theme).map((c, i) => (
                            <span key={i} style={{background: c}} />
                          ))}
                        </div>
                      </div>
                      <div className="card-meta">
                        <span>@{e.creator}</span>
                        <span className="stats">
                          <span title="Exports">
                            <Download size={13} /> {fmt(e.stats.exports)}
                          </span>
                          <span title="Remixes">
                            <Repeat2 size={13} /> {fmt(e.stats.remixes)}
                          </span>
                        </span>
                      </div>
                      <div className="tags">
                        <span className="tag strong">{e.useCase}</span>
                        {[...e.style, ...e.mood].map((s) => (
                          <span key={s} className="tag">
                            {s}
                          </span>
                        ))}
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
