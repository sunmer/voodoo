import {Player, type PlayerRef} from '@remotion/player';
import {ArrowLeft, Check, Copy, Download, Maximize, Minimize, Pause, Play, Redo2, RotateCcw, Shuffle, Undo2, Wand2} from 'lucide-react';
import {useCallback, useEffect, useMemo, useRef, useState, type CSSProperties} from 'react';
import type {Variant} from '../catalog/catalog';
import {THEME_LABELS, THEME_ROLES, type Role, type VideoProps} from '../videos/contract';
import {compositions} from '../videos/registry';
import {applyKit, kitHasValues, useBrandKit} from './brandKit';
import {derivePalettes} from './palettes';
import {TextCanvas} from './TextCanvas';
import {Timeline} from './Timeline';

const storageKey = (id: string) => `voodoo:v2:${id}`;
type LockableOrientation = ScreenOrientation & {lock?: (orientation: 'landscape') => Promise<void>};
const unlockOrientation = () => {
  try { screen.orientation?.unlock?.(); } catch { /* Some browsers expose unsupported orientation methods. */ }
};

function useHistory(initial: VideoProps) {
  const [state, setState] = useState({past: [] as VideoProps[], now: initial, future: [] as VideoProps[]});
  const set = useCallback((next: VideoProps) => {
    setState((s) => JSON.stringify(s.now) === JSON.stringify(next) ? s :
      {past: [...s.past.slice(-49), s.now], now: next, future: []});
  }, []);
  const undo = () => setState((s) => s.past.length ? {past: s.past.slice(0, -1), now: s.past[s.past.length - 1], future: [s.now, ...s.future]} : s);
  const redo = () => setState((s) => s.future.length ? {past: [...s.past, s.now], now: s.future[0], future: s.future.slice(1)} : s);
  return {props: state.now, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0};
}

export function Editor({variant}: {variant: Variant}) {
  const c = compositions[variant.template];
  const kit = useBrandKit();
  const initial = useMemo(() => {
    try {
      const result = c.schema.safeParse(JSON.parse(localStorage.getItem(storageKey(variant.id)) ?? 'null'));
      return result.success ? result.data as VideoProps : variant.props;
    } catch { return variant.props; }
  }, [c, variant]);
  const h = useHistory(initial);
  const {props} = h;
  const player = useRef<PlayerRef>(null);
  const immersive = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [editing, setEditing] = useState<Role | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');
  const [hexes, setHexes] = useState(props.theme);
  const palettes = useMemo(() => derivePalettes(variant.props.theme), [variant.props.theme]);
  const kitProps = kitHasValues(kit) ? applyKit(props, kit) : null;
  const kitDiffers = kitProps && JSON.stringify(kitProps) !== JSON.stringify(props);

  useEffect(() => {
    setHexes(props.theme);
    try { localStorage.setItem(storageKey(variant.id), JSON.stringify(props)); }
    catch { setNotice('Changes could not be saved on this device. Download a copy to keep them.'); }
  }, [props, variant.id]);
  useEffect(() => {
    const p = player.current;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    const hidden = () => { if (document.hidden) p?.pause(); };
    p?.addEventListener('play', on);
    p?.addEventListener('pause', off);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      p?.removeEventListener('play', on);
      p?.removeEventListener('pause', off);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const fullscreen = () => { if (!document.fullscreenElement) setExpanded(false); };
    const resize = () => {
      if (window.innerWidth > 1024) {
        setExpanded(false);
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      }
    };
    document.addEventListener('fullscreenchange', fullscreen);
    window.addEventListener('resize', resize);
    return () => {
      document.body.style.overflow = overflow;
      unlockOrientation();
      document.removeEventListener('fullscreenchange', fullscreen);
      window.removeEventListener('resize', resize);
    };
  }, [expanded]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return;
      if (e.key === 'Escape' && expanded) {
        setExpanded(false);
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      }
      if (editing) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) h.redo(); else h.undo();
      }
      if (e.code === 'Space' && target.tagName !== 'BUTTON') { e.preventDefault(); player.current?.toggle(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toggleExpanded = async () => {
    if (expanded) {
      setExpanded(false);
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
    } else {
      setExpanded(true);
      // Keep CSS screen-filling mode when native element fullscreen is unavailable.
      if (document.fullscreenEnabled && immersive.current?.requestFullscreen) {
        await immersive.current.requestFullscreen().catch(() => {});
      }
      if (c.width > c.height) {
        try { await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape'); } catch { /* Physical rotation remains available. */ }
      }
    }
  };
  const download = () => {
    const blob = new Blob([JSON.stringify({template: variant.template, parent: variant.id, props}, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${variant.id}.props.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const copyRender = async () => {
    const json = JSON.stringify(props).replace(/'/g, `'\\''`);
    try {
      await navigator.clipboard.writeText(`npx remotion render src/remotion/index.ts ${variant.template} out/${variant.id}.mp4 --props='${json}'`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { setNotice('Clipboard is unavailable. Download your edits instead.'); }
  };
  const changeHex = (key: typeof THEME_ROLES[number], value: string) => {
    setHexes((old) => ({...old, [key]: value}));
    if (/^#[0-9a-f]{6}$/i.test(value)) h.set({...props, theme: {...props.theme, [key]: value}});
  };

  return (
    <main className="editor-page">
      <div ref={immersive} className={`immersive-editor ${c.width > c.height ? 'landscape-video' : ''} ${expanded ? 'expanded' : ''}`} style={{'--video-ratio': c.width / c.height} as CSSProperties}>
        <header className="editor-top">
          <a className="overlay-btn" href="#/" title="All videos" aria-label="All videos"><ArrowLeft size={20} /></a>
          <h1>{variant.title}</h1>
          <div className="editor-history">
            <button className="overlay-btn" title="Undo" aria-label="Undo" disabled={!h.canUndo || !!editing} onClick={h.undo}><Undo2 size={18} /></button>
            <button className="overlay-btn" title="Redo" aria-label="Redo" disabled={!h.canRedo || !!editing} onClick={h.redo}><Redo2 size={18} /></button>
          </div>
        </header>
        <div className="editor-video-area">
          <div className="editor-video">
            <TextCanvas player={player} props={props} playing={playing} onEditing={setEditing}
              onCommit={(role, value) => h.set({...props, texts: {...props.texts, [role]: value}})}>
              <Player ref={player} component={c.component} inputProps={props} durationInFrames={c.durationInFrames}
                compositionWidth={c.width} compositionHeight={c.height} fps={c.fps}
                initialFrame={c.posterFrame} loop autoPlay={playing} controls={false} clickToPlay={false}
                doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} acknowledgeRemotionLicense
                style={{width: '100%', height: '100%'}} />
            </TextCanvas>
          </div>
        </div>
        <nav className="editor-tools" aria-label="Video tools">
          <button className="overlay-btn mobile-expand" title={expanded ? 'Exit fullscreen' : 'Fullscreen'} aria-label={expanded ? 'Exit fullscreen' : 'Fullscreen'}
            disabled={!!editing} onClick={toggleExpanded}>{expanded ? <Minimize size={20} /> : <Maximize size={20} />}</button>
          {kitDiffers && <button className="overlay-btn kit-apply" title="Apply brand kit" aria-label="Apply brand kit"
            disabled={!!editing} onClick={() => h.set(kitProps!)}><Wand2 size={20} /></button>}
          <button className="overlay-btn" title="Reset to original" aria-label="Reset to original"
            disabled={!!editing || JSON.stringify(props) === JSON.stringify(variant.props)} onClick={() => h.set(variant.props)}><RotateCcw size={20} /></button>
          <button className="overlay-btn" title="Download props JSON" aria-label="Download props JSON" disabled={!!editing} onClick={download}><Download size={20} /></button>
          <button className={`overlay-btn ${copied ? 'confirmed' : ''}`} title="Copy render command" aria-label="Copy render command" disabled={!!editing} onClick={copyRender}>
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </nav>
        <div className="editor-bottom">
          <button className="overlay-btn playback-btn" title={playing ? 'Pause' : 'Play'} aria-label={playing ? 'Pause' : 'Play'}
            disabled={!!editing} onClick={() => player.current?.toggle()}>{playing ? <Pause size={20} /> : <Play size={20} />}</button>
          <Timeline meta={c} player={player} focusRole={editing} disabled={!!editing} />
        </div>
      </div>
      <section className="editor-theme" aria-labelledby="theme-heading">
        <div className="theme-heading">
          <h2 id="theme-heading">Theme</h2>
          <button className="icon-btn" title="Shuffle palette" aria-label="Shuffle palette" disabled={!!editing}
            onClick={() => h.set({...props, theme: palettes[Math.floor(Math.random() * palettes.length)].colors})}><Shuffle size={18} /></button>
        </div>
        <div className="theme-content">
          <div className="palettes" role="group" aria-label="Palettes">
            {palettes.map((p) => <button key={p.name} className={`palette-btn ${JSON.stringify(p.colors) === JSON.stringify(props.theme) ? 'on' : ''}`}
              title={p.name} aria-label={p.name} aria-pressed={JSON.stringify(p.colors) === JSON.stringify(props.theme)}
              disabled={!!editing} onClick={() => h.set({...props, theme: p.colors})}>
              {THEME_ROLES.map((role) => <span key={role} style={{background: p.colors[role]}} />)}
            </button>)}
          </div>
          <div className="theme-colors">
            {THEME_ROLES.map((key) => (
              <div className="theme-color" key={key}>
                <label className="swatch" style={{background: props.theme[key]}} title={`Pick ${THEME_LABELS[key]}`}>
                  <input type="color" aria-label={`Pick ${THEME_LABELS[key]}`} value={props.theme[key]} disabled={!!editing} onChange={(e) => changeHex(key, e.target.value)} />
                </label>
                <label htmlFor={`hex-${key}`}>{THEME_LABELS[key]}</label>
                <input id={`hex-${key}`} className="hex" aria-label={`${THEME_LABELS[key]} hex`} value={hexes[key]} spellCheck={false} disabled={!!editing}
                  aria-invalid={!/^#[0-9a-f]{6}$/i.test(hexes[key])} onChange={(e) => changeHex(key, e.target.value.trim())}
                  onBlur={() => setHexes((old) => ({...old, [key]: props.theme[key]}))} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {notice && <div className="editor-notice" role="status">{notice}<button className="link-btn" onClick={() => setNotice('')}>Dismiss</button></div>}
    </main>
  );
}
