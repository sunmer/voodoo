import {Player, type PlayerRef} from '@remotion/player';
import {ArrowLeft, Check, Copy, Download, Pause, Play, Redo2, RotateCcw, Shuffle, Undo2, Wand2} from 'lucide-react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {variants, type Variant} from '../catalog/catalog';
import {describeSchema, THEME_LABELS, THEME_ROLES, type Role, type VideoProps} from '../videos/contract';
import {compositions} from '../videos/registry';
import {applyKit, kitHasValues, useBrandKit} from './brandKit';
import {energyOf} from './Gallery';
import {Header} from './Header';
import {Media} from './Media';
import {derivePalettes} from './palettes';
import {Timeline} from './Timeline';

const storageKey = (id: string) => `voodoo:v2:${id}`;

function useHistory(initial: VideoProps) {
  const [state, setState] = useState({past: [] as VideoProps[], now: initial, future: [] as VideoProps[]});
  const set = useCallback((next: VideoProps, merge = false) => {
    setState((s) => (merge && s.past.length ? {...s, now: next, future: []} : {past: [...s.past.slice(-50), s.now], now: next, future: []}));
  }, []);
  const undo = () =>
    setState((s) => (s.past.length ? {past: s.past.slice(0, -1), now: s.past[s.past.length - 1], future: [s.now, ...s.future]} : s));
  const redo = () => setState((s) => (s.future.length ? {past: [...s.past, s.now], now: s.future[0], future: s.future.slice(1)} : s));
  return {props: state.now, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0};
}

export function Editor({variant}: {variant: Variant}) {
  const c = compositions[variant.template];
  const fields = useMemo(() => describeSchema(c.schema), [c]);
  const kit = useBrandKit();
  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey(variant.id));
      return raw ? (JSON.parse(raw) as VideoProps) : null;
    } catch {
      return null;
    }
  }, [variant.id]);
  const h = useHistory(saved ?? variant.props);
  const {props} = h;
  const player = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [focusRole, setFocusRole] = useState<Role | null>(null);
  const lastField = useRef<string | null>(null);

  const valid = c.schema.safeParse(props);
  const errors = new Map<string, string>();
  if (!valid.success) for (const i of valid.error.issues) errors.set(i.path.join('.'), i.message);

  useEffect(() => {
    if (valid.success) localStorage.setItem(storageKey(variant.id), JSON.stringify(props));
  }, [props, valid.success, variant.id]);

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

  // Focusing a text field jumps the preview to the scene that shows it.
  const focusText = (role: Role) => {
    setFocusRole(role);
    const scene = c.scenes.find((s) => s.roles.includes(role));
    if (scene && player.current) {
      player.current.pause();
      player.current.seekTo(scene.from + scene.focus);
    }
  };
  const blurText = () => {
    lastField.current = null;
    setFocusRole(null);
  };

  const palettes = useMemo(() => derivePalettes(variant.props.theme), [variant.props.theme]);
  const dirty = JSON.stringify(props) !== JSON.stringify(variant.props);
  const safeProps = valid.success ? props : (saved ?? variant.props);
  const kitProps = kitHasValues(kit) ? applyKit(props, kit) : null;
  const kitDiffers = kitProps && JSON.stringify(kitProps) !== JSON.stringify(props);

  const related = useMemo(() => {
    const score = (v: Variant) =>
      (v.template === variant.template ? 2 : 0) + (v.purpose === variant.purpose ? 2 : 0) + v.style.filter((s) => variant.style.includes(s)).length;
    return variants
      .filter((v) => v.id !== variant.id)
      .map((v) => ({v, s: score(v)}))
      .sort((a, b) => b.s - a.s || b.v.stats.exports - a.v.stats.exports)
      .slice(0, 4)
      .map((x) => x.v);
  }, [variant]);

  const renderCmd = `npx remotion render src/remotion/index.ts ${variant.template} out/${variant.id}.mp4 --props='${JSON.stringify(props)}'`;
  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1400);
  };
  const downloadProps = () => {
    const blob = new Blob([JSON.stringify({template: variant.template, parent: variant.id, props}, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${variant.id}.props.json`;
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
          <button className="icon-btn" onClick={() => h.set(variant.props)} disabled={!dirty} title="Reset to original">
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
          <div className={`player-frame ${c.width < c.height ? 'portrait' : ''}`}>
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
                // Otherwise the Player steals focus from text fields when we pause it.
                spaceKeyToPlayOrPause={false}
                acknowledgeRemotionLicense
                style={{width: '100%', height: '100%'}}
              />
            </div>
          </div>
          <Timeline meta={c} player={player} focusRole={focusRole} />
          <div className="stage-info">
            <div>
              <h1>{variant.title}</h1>
              <p className="muted">
                @{variant.creator} · {variant.format} · {variant.seconds}s · {variant.tmpl.model}
              </p>
            </div>
            <button className="icon-btn" onClick={() => player.current?.toggle()} title={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <p className="desc">{variant.description}</p>
          <details className="prompt">
            <summary>
              Template prompt · {variant.tmpl.title} by @{variant.tmpl.creator}
            </summary>
            <p>{variant.tmpl.prompt}</p>
            <button className="link-btn" onClick={() => copy('prompt', variant.tmpl.prompt)}>
              {copied === 'prompt' ? 'Copied' : 'Copy prompt'}
            </button>
          </details>

          <section className="related">
            <div className="related-head">
              <h2>Related</h2>
              <a className="link-btn" href={`#/?template=${variant.template}`}>
                All {variant.tmpl.title} variants
              </a>
            </div>
            <div className="related-grid">
              {related.map((v) => (
                <a key={v.id} href={`#/v/${v.id}`} className="related-card">
                  <Media variant={v} props={null} playing={false} />
                  <span className="related-title">{v.title}</span>
                  <span className="muted small">
                    {v.tmpl.title} · {v.format}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </section>

        <aside className="panel">
          {kitDiffers && (
            <section className="kit-apply">
              <button className="secondary-btn" onClick={() => h.set(kitProps!)}>
                <Wand2 size={15} /> Apply brand kit
              </button>
            </section>
          )}
          <section>
            <div className="panel-head">
              <h2>Text</h2>
              <span className="muted small">{fields.length} slots</span>
            </div>
            {fields.map((f) => {
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
                    onFocus={() => focusText(f.key)}
                    onBlur={blurText}
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
                    {THEME_ROLES.map((r) => (
                      <span key={r} style={{background: p.colors[r]}} />
                    ))}
                  </button>
                );
              })}
            </div>
            {THEME_ROLES.map((key) => {
              const v = props.theme[key] ?? '';
              const ok = /^#[0-9a-f]{6}$/i.test(v);
              const err = errors.get(`theme.${key}`);
              return (
                <div key={key} className={`color-row ${err ? 'invalid' : ''}`}>
                  <label className="swatch" style={{background: ok ? v : 'transparent'}} title={`Pick ${THEME_LABELS[key]}`}>
                    <input type="color" value={ok ? v : '#000000'} onChange={(e) => update('theme', key, e.target.value)} onBlur={blurText} />
                  </label>
                  <span className="color-label">{THEME_LABELS[key]}</span>
                  <input className="hex" type="text" value={v} spellCheck={false} onChange={(e) => update('theme', key, e.target.value.trim())} onBlur={blurText} />
                </div>
              );
            })}
          </section>

          <section className="meta">
            <h2>Taxonomy</h2>
            <dl>
              <dt>Purpose</dt>
              <dd>{variant.purpose}</dd>
              <dt>Placement</dt>
              <dd>{variant.placement.join(', ')}</dd>
              <dt>Style</dt>
              <dd>{variant.style.join(', ')}</dd>
              <dt>Energy</dt>
              <dd>
                {energyOf(variant.energy)} ({variant.energy}/5)
              </dd>
              <dt>Tone</dt>
              <dd>{variant.tone}</dd>
              <dt>Motion</dt>
              <dd>{variant.motion.join(', ')}</dd>
              <dt>Scenes</dt>
              <dd>{variant.sceneLabels.join(' → ')}</dd>
              <dt>Template</dt>
              <dd className="mono">
                {variant.template} · {c.width}×{c.height} · {c.fps}fps
              </dd>
              <dt>License</dt>
              <dd>{variant.tmpl.license}</dd>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
