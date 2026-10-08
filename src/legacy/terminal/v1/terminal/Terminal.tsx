import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, LITE, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {terminalMeta} from './meta';
import type {TerminalProps} from './schema';

loadTemplateFonts();

const MONO = MONO_FONT;
const CPF = 1.1; // characters typed per frame
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app';
const typed = (text: string, frame: number, start: number) => text.slice(0, Math.max(0, Math.floor((frame - start) * CPF)));
const typeEnd = (text: string, start: number) => start + Math.ceil(text.length / CPF);

const Cursor: React.FC<{color: string; size: number}> = ({color, size}) => {
  const frame = useCurrentFrame();
  return <span style={{display: 'inline-block', width: size * 0.56, height: size * 1.1, marginLeft: 6, verticalAlign: 'text-bottom', background: color, opacity: Math.floor(frame / 9) % 2 ? 0 : 1}} />;
};

// Ambient backdrop shared by all scenes: grid, glow, slow drift.
const Backdrop: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.foreground}0b 1px, transparent 1px), linear-gradient(90deg, ${theme.foreground}0b 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${frame * 0.3}px ${frame * 0.5}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)',
        }}
      />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 50% at 50% 110%, ${theme.accent}30, transparent 70%)`}} />
    </AbsoluteFill>
  );
};

const Window: React.FC<{theme: Theme; title: string; tab: string; children: React.ReactNode}> = ({theme, title, tab, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', perspective: 2400}}>
      <div
        style={{
          width: 1600,
          height: 860,
          borderRadius: 22,
          background: `${theme.surface}f2`,
          border: `1.5px solid ${theme.foreground}1f`,
          boxShadow: `0 60px 160px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 ${theme.foreground}14`,
          overflow: 'hidden',
          transform: `translateY(${(1 - s) * 140}px) rotateX(${(1 - s) * 14}deg) scale(${0.94 + s * 0.06})`,
          opacity: Math.min(1, s * 1.4),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{height: 70, display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px', background: `${theme.background}66`, borderBottom: `1.5px solid ${theme.foreground}14`}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
          ))}
          <div style={{marginLeft: 26, height: 42, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 10, background: theme.surface, fontFamily: MONO, fontSize: 21, color: `${theme.foreground}cc`}}>
            <span style={{width: 10, height: 10, borderRadius: 5, background: theme.accent}} />
            {tab}
          </div>
          <div style={{flex: 1, textAlign: 'right', fontFamily: MONO, fontSize: 20, color: `${theme.foreground}66`}}>{title}</div>
        </div>
        <div style={{flex: 1, position: 'relative', padding: '56px 72px', fontFamily: MONO, color: theme.foreground}}>{children}</div>
        <div style={{height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', fontFamily: MONO, fontSize: 18, background: theme.accent, color: theme.background, fontWeight: 700}}>
          <span>{'\u25CF main'}</span>
          <span>{'UTF-8  \u2022  LF  \u2022  ready'}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// RGB-split glitch with deterministic slice jitter.
const Glitch: React.FC<{text: string; size: number; theme: Theme; amount: number; font?: string; weight?: number}> = ({
  text,
  size,
  theme,
  amount,
  font = SANS_FONT,
  weight = 800,
}) => {
  const frame = useCurrentFrame();
  const jitter = amount > 0 ? (random(`g${frame}`) - 0.5) * 30 * amount : 0;
  const slice = amount > 0 ? random(`s${frame}`) * 80 : 0;
  const base: React.CSSProperties = {position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', fontSize: size, fontWeight: weight, lineHeight: 1.05, fontFamily: font};
  return (
    <div style={{position: 'relative', height: size * 1.1}}>
      <div style={{...base, color: theme.accent2, transform: `translateX(${-8 * amount + jitter}px)`, opacity: amount ? 0.85 : 0, mixBlendMode: LITE ? undefined : 'screen'}}>{text}</div>
      <div style={{...base, color: theme.accent, transform: `translateX(${8 * amount - jitter}px)`, opacity: amount ? 0.85 : 0, mixBlendMode: LITE ? undefined : 'screen'}}>{text}</div>
      <div style={{...base, color: theme.foreground, clipPath: amount ? `inset(${slice}% 0 ${Math.max(0, 70 - slice)}% 0)` : undefined, transform: `translateX(${jitter * 0.6}px)`}}>{text}</div>
      {amount > 0 && <div style={{...base, color: theme.foreground, clipPath: `inset(0 0 ${100 - slice}% 0)`}}>{text}</div>}
      {amount > 0 && <div style={{...base, color: theme.foreground, clipPath: `inset(${Math.min(100, slice + 30)}% 0 0 0)`}}>{text}</div>}
    </div>
  );
};

const SceneBoot: React.FC<TerminalProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const cmd = `npx ${slug(texts.brand)} launch --prod`;
  const cmdStart = 16;
  const outStart = typeEnd(cmd, cmdStart) + 6;
  const size = fit(texts.headline, 150, 1440, 0.58);
  const glitch = frame > outStart + 6 && frame < outStart + 20 ? interpolate(frame, [outStart + 6, outStart + 20], [1, 0]) : 0;
  const head = interpolate(frame, [outStart + 6, outStart + 22], [0, 1], {...clamp, easing: easeOut});
  const logs = ['resolving dependencies', 'optimizing bundle', 'deploying to 14 regions'];
  return (
    <Window theme={theme} title={`~/${slug(texts.brand)}`} tab="zsh">
      <div style={{fontSize: 46}}>
        <span style={{color: theme.accent}}>{'\u279C '}</span>
        <span style={{color: theme.accent2}}><span data-text-role={"brand"} style={{display: 'contents'}}>{`${slug(texts.brand)} `}</span></span>
        <span data-text-role={"brand"} style={{display: 'contents'}}>{typed(cmd, frame, cmdStart)}</span>
        {frame < outStart && <Cursor color={theme.foreground} size={46} />}
      </div>
      <div style={{marginTop: 30, fontSize: 30, lineHeight: 1.7, color: `${theme.foreground}80`}}>
        {logs.map((l, i) => (
          <div key={l} style={{opacity: frame >= outStart + i * 2 ? 1 : 0}}>
            <span style={{color: theme.accent}}>{'\u2713 '}</span>
            {l}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 72, bottom: 70, opacity: head, transform: `translateY(${(1 - head) * 30}px)`}}>
        <span data-text-role={"headline"} style={{display: 'contents'}}><Glitch text={texts.headline} size={size} theme={theme} amount={glitch} /></span>
      </div>
    </Window>
  );
};

const SceneChecks: React.FC<TerminalProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  const progress = interpolate(frame, [8, 62], [0, 1], {...clamp, easing: easeInOut});
  return (
    <Window theme={theme} title="build.log" tab="build">
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, color: `${theme.foreground}77`, marginBottom: 48}}>
        <span><span data-text-role={"brand"} style={{display: 'contents'}}>{`${texts.brand.toUpperCase()} // RELEASE`}</span></span>
        <span style={{fontVariantNumeric: 'tabular-nums'}}>{`${Math.round(progress * 100)}%`}</span>
      </div>
      {items.map((t, i) => {
        const start = 8 + i * 15;
        const done = frame > start + 14;
        const enter = interpolate(frame - start, [0, 10], [0, 1], {...clamp, easing: easeOut});
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 34, marginBottom: 40, opacity: enter, transform: `translateX(${(1 - enter) * -30}px)`}}>
            <span
              style={{
                width: 84,
                height: 84,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                fontSize: 36,
                background: done ? theme.accent : `${theme.foreground}12`,
                color: done ? theme.background : `${theme.foreground}66`,
              }}
            >
              {done ? '\u2713' : '\u2022'}
            </span>
            <span style={{fontFamily: SANS_FONT, fontSize: 88, fontWeight: 750}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{t}</span></span>
          </div>
        );
      })}
      <div style={{marginTop: 26, height: 14, borderRadius: 7, background: `${theme.foreground}14`, overflow: 'hidden'}}>
        <div style={{width: `${progress * 100}%`, height: '100%', borderRadius: 7, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`}} />
      </div>
      <div style={{marginTop: 34, fontSize: 34, color: `${theme.foreground}99`}}>
        <span style={{color: theme.accent2}}>{'// '}</span>
        <span data-text-role={"subhead"} style={{display: 'contents'}}>{typed(texts.subhead, frame, 34)}</span>
      </div>
    </Window>
  );
};

const SceneShip: React.FC<TerminalProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 3, 14], [0, 1, 0], clamp);
  const glitch = frame < 14 ? interpolate(frame, [0, 14], [1, 0], clamp) : frame > 52 && frame < 56 ? 0.5 : 0;
  const btn = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 140}});
  const scale = interpolate(frame, [0, 80], [1.04, 1], {...clamp, easing: easeOut});
  const size = fit(texts.brand, 260, 1500, 0.62);
  const width = Math.min(1500, size * 0.62 * texts.brand.length);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 64, transform: `scale(${scale})`}}>
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${theme.foreground}07 0 2px, transparent 2px 6px)`}} />
      <div style={{fontFamily: MONO, fontSize: 34, color: theme.accent, opacity: btn}}><span data-text-role={"headline"} style={{display: 'contents'}}>{`[ ${texts.headline} ]`}</span></div>
      <div style={{width}}>
        <span data-text-role={"brand"} style={{display: 'contents'}}><Glitch text={texts.brand} size={size} theme={theme} amount={glitch} weight={850} /></span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '26px 48px',
          borderRadius: 14,
          background: theme.accent,
          color: theme.background,
          fontFamily: MONO,
          fontSize: 44,
          fontWeight: 800,
          boxShadow: `0 0 80px ${theme.accent}55`,
          transform: `translateY(${(1 - btn) * 50}px)`,
          opacity: btn,
        }}
      >
        <span data-text-role={"cta"} style={{display: 'contents'}}>{`$ ${texts.cta}`}</span>
        <ArrowIcon size={42} />
      </div>
      <AbsoluteFill style={{background: theme.accent, opacity: flash * 0.45}} />
    </AbsoluteFill>
  );
};

// Short horizontal glitch bars that cover each cut.
const Cut: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5, 10], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      {Array.from({length: 9}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${random(`l${i}${frame}`) * 40 - 10}%`,
            width: `${40 + random(`w${i}`) * 80}%`,
            top: `${i * 11 + random(`t${i}${frame}`) * 6}%`,
            height: 18 + random(`h${i}`) * 60,
            background: i % 3 === 0 ? theme.accent : i % 3 === 1 ? theme.accent2 : theme.foreground,
            opacity: 0.85,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const SCENES: React.FC<TerminalProps>[] = [SceneBoot, SceneChecks, SceneShip];

export const Terminal: React.FC<TerminalProps> = (props) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 10], [0, 1], {...clamp, easing: easeOut});
  const exit = interpolate(frame, [258, 270], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: props.theme.background, opacity: fade * (1 - exit * 0.6)}}>
      <Backdrop theme={props.theme} />
      {terminalMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
      {terminalMeta.scenes.slice(1).map((s) => (
        <Sequence key={s.from} name="transition" from={s.from - 5} durationInFrames={10}>
          <Cut theme={props.theme} />
        </Sequence>
      ))}
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)'}} />
    </AbsoluteFill>
  );
};
