import {Player, type PlayerRef} from '@remotion/player';
import {ArrowLeft, Check, Copy, Download, Pause, Play, Redo2, RotateCcw, Shuffle, Undo2} from 'lucide-react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {technical, type Entry} from '../catalog/catalog';
import {describeSchema, type VideoProps} from '../videos/contract';
import {compositions} from '../videos/registry';
import {Header} from './Header';
import {derivePalettes} from './palettes';

const storageKey = (id: string) => `voodoo:${id}`;

function useHistory(initial: VideoProps) {
  const [state, setState] = useState({past: [] as VideoProps[], now: initial, future: [] as VideoProps[]});
  const set = useCallback((next: VideoProps, merge = false) => {
    setState((s) =>
      merge && s.past.length
        ? {...s, now: next, future: []}
        : {past: [...s.past.slice(-50), s.now], now: next, future: []},
    );
  }, []);
  const undo = () =>
    setState((s) => (s.past.length ? {past: s.past.slice(0, -1), now: s.past[s.past.length - 1], future: [s.now, ...s.future]} : s));
  const redo = () =>
    setState((s) => (s.future.length ? {past: [...s.past, s.now], now: s.future[0], future: s.future.slice(1)} : s));
  return {props: state.now, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0};
}

export function Editor({entry}: {entry: Entry}) {
  const c = compositions[entry.composition];
  const fields = useMemo(() => describeSchema(c.schema), [c]);
  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey(entry.id));
      return raw ? (JSON.parse(raw) as VideoProps) : null;
    } catch {
      return null;
    }
  }, [entry.id]);
  const h = useHistory(saved ?? entry.props);
  const {props} = h;
  const player = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const lastField = useRef<string | null>(null);

  const valid = c.schema.safeParse(props);
  const errors = new Map<string, string>();
  if (!valid.success) for (const i of valid.error.issues) errors.set(i.path.join('.'), i.message);

  useEffect(() => {
    if (valid.success) localStorage.setItem(storageKey(entry.id), JSON.stringify(props));
  }, [props, valid.success, entry.id]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    p.addEventListener('play', on);
    p.addEventListener('pause', off);
    return () => {
      p.removeEventListener('play', on);
      p.removeEventListener('pause', off);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z') return;
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' && (t as HTMLInputElement).type === 'text') return;
      e.preventDefault();
      if (e.shiftKey) h.redo();
      else h.undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Typing into the same field merges into one undo step.
  const update = (group: 'texts' | 'theme', key: string, value: string) => {
    const id = `${group}.${key}`;
    h.set({...props, [group]: {...props[group], [key]: value}}, lastField.current === id);
    lastField.current = id;
  };
  const commitField = () => (lastField.current = null);

  const palettes = useMemo(() => derivePalettes(entry.props.theme), [entry.props.theme]);
  const dirty = JSON.stringify(props) !== JSON.stringify(entry.props);
  const t = technical(entry);
  const safeProps = valid.success ? props : saved ?? entry.props;

  const renderCmd = `npx remotion render src/remotion/index.ts ${entry.composition} out/${entry.id}.mp4 --props='${JSON.stringify(props)}'`;
  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1400);
  };
  const downloadProps = () => {
    const blob = new Blob([JSON.stringify(props, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${entry.id}.props.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="page editor-page">
      <Header>
        <div className="toolbar">
          <button className="icon-btn" onClick={h.undo} disabled={!h.canUndo} title="Undo">
            <Undo2 size={16} />
          </button>
          <button className="icon-btn" onClick={h.redo} disabled={!h.canRedo} title="Redo">
            <Redo2 size={16} />
          </button>
          <button className="icon-btn" onClick={() => h.set(entry.props)} disabled={!dirty} title="Reset to original">
            <RotateCcw size={16} />
          </button>
          <span className="divider" />
          <button className="icon-btn" onClick={downloadProps} disabled={!valid.success} title="Download props JSON">
            <Download size={16} />
          </button>
          <button className="primary-btn" onClick={() => copy('render', renderCmd)} disabled={!valid.success} title="Copy local render command">
            {copied === 'render' ? <Check size={16} /> : <Copy size={16} />}
            Render command
          </button>
        </div>
      </Header>

      <div className="editor-layout">
        <section className="stage">
          <a className="back" href="#/">
            <ArrowLeft size={16} /> All videos
          </a>
          <div className="player-wrap" style={{aspectRatio: `${c.width} / ${c.height}`}}>
            <Player
              ref={player}
              component={c.component}
              inputProps={safeProps}
              durationInFrames={c.durationInFrames}
              compositionWidth={c.width}
              compositionHeight={c.height}
              fps={c.fps}
              controls
              loop
              autoPlay
              clickToPlay
              acknowledgeRemotionLicense
              style={{width: '100%', height: '100%'}}
            />
          </div>
          <div className="stage-info">
            <div>
              <h1>{entry.title}</h1>
              <p className="muted">
                @{entry.creator} · {t.format} · {t.seconds}s · {entry.model}
              </p>
            </div>
            <button className="icon-btn" onClick={() => player.current?.toggle()} title={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <p className="desc">{entry.description}</p>
          <details className="prompt">
            <summary>Original prompt</summary>
            <p>{entry.prompt}</p>
            <button className="link-btn" onClick={() => copy('prompt', entry.prompt)}>
              {copied === 'prompt' ? 'Copied' : 'Copy prompt'}
            </button>
          </details>
        </section>

        <aside className="panel">
          <section>
            <div className="panel-head">
              <h2>Text</h2>
              <span className="muted small">{fields.texts.length} slots</span>
            </div>
            {fields.texts.map((f) => {
              const v = props.texts[f.key] ?? '';
              const err = errors.get(`texts.${f.key}`);
              return (
                <label key={f.key} className={`field ${err ? 'invalid' : ''}`}>
                  <span className="field-label">
                    {f.label}
                    <span className={`counter ${v.length > f.max ? 'over' : ''}`}>
                      {v.length}/{f.max}
                    </span>
                  </span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) => update('texts', f.key, e.target.value)}
                    onBlur={commitField}
                  />
                  {err && <span className="error">{err}</span>}
                </label>
              );
            })}
          </section>

          <section>
            <div className="panel-head">
              <h2>Theme</h2>
              <button
                className="icon-btn ghost"
                title="Shuffle palette"
                onClick={() => h.set({...props, theme: palettes[Math.floor(Math.random() * palettes.length)].colors})}
              >
                <Shuffle size={15} />
              </button>
            </div>
            <div className="palettes">
              {palettes.map((p) => {
                const on = JSON.stringify(p.colors) === JSON.stringify(props.theme);
                return (
                  <button key={p.name} className={`palette-btn ${on ? 'on' : ''}`} title={p.name} onClick={() => h.set({...props, theme: p.colors})}>
                    {Object.values(p.colors).map((col, i) => (
                      <span key={i} style={{background: col}} />
                    ))}
                  </button>
                );
              })}
            </div>
            {fields.colors.map((f) => {
              const v = props.theme[f.key] ?? '';
              const err = errors.get(`theme.${f.key}`);
              return (
                <div key={f.key} className={`color-row ${err ? 'invalid' : ''}`}>
                  <label className="swatch" style={{background: /^#[0-9a-f]{6}$/i.test(v) ? v : 'transparent'}} title={`Pick ${f.label}`}>
                    <input type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : '#000000'} onChange={(e) => update('theme', f.key, e.target.value)} onBlur={commitField} />
                  </label>
                  <span className="color-label">{f.label}</span>
                  <input
                    className="hex"
                    type="text"
                    value={v}
                    spellCheck={false}
                    onChange={(e) => update('theme', f.key, e.target.value.trim())}
                    onBlur={commitField}
                  />
                </div>
              );
            })}
          </section>

          <section className="meta">
            <h2>Metadata</h2>
            <dl>
              <dt>Use case</dt>
              <dd>{entry.useCase}</dd>
              <dt>Style</dt>
              <dd>{entry.style.join(', ')}</dd>
              <dt>Mood</dt>
              <dd>{entry.mood.join(', ')}</dd>
              <dt>Keywords</dt>
              <dd>{entry.keywords.join(', ')}</dd>
              <dt>Composition</dt>
              <dd className="mono">
                {entry.composition} · {c.width}×{c.height} · {c.fps}fps
              </dd>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
