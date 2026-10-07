import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, Vignette, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {terminalMeta} from './meta';
import type {TerminalProps} from './schema';

const MONO = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace';
const CPF = 0.9; // characters typed per frame

const typed = (text: string, frame: number, start: number) => text.slice(0, Math.max(0, Math.floor((frame - start) * CPF)));
const typeEnd = (text: string, start: number) => start + Math.ceil(text.length / CPF);

const Cursor: React.FC<{color: string; size: number}> = ({color, size}) => {
  const frame = useCurrentFrame();
  return <span style={{display: 'inline-block', width: size * 0.55, height: size * 1.05, marginLeft: 4, verticalAlign: 'text-bottom', background: color, opacity: Math.floor(frame / 8) % 2 ? 0 : 1}} />;
};

// The window frame stays on screen across all scenes.
const Window: React.FC<{theme: Theme; title: string; children: React.ReactNode}> = ({theme, title, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 16, stiffness: 110}});
  return (
    <AbsoluteFill style={{background: theme.background, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.foreground}0d 1px, transparent 1px), linear-gradient(90deg, ${theme.foreground}0d 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `0 ${frame * 0.6}px`,
        }}
      />
      <div
        style={{
          width: 1560,
          height: 820,
          borderRadius: 18,
          background: theme.surface,
          border: `2px solid ${theme.foreground}22`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px ${theme.accent}22`,
          overflow: 'hidden',
          transform: `translateY(${(1 - s) * 120}px) scale(${0.92 + s * 0.08})`,
          opacity: s,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px', borderBottom: `2px solid ${theme.foreground}14`}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
          ))}
          <div style={{flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: `${theme.foreground}88`}}>{title}</div>
        </div>
        <div style={{flex: 1, position: 'relative', padding: '48px 64px', fontFamily: MONO, color: theme.foreground}}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

// RGB-split glitch with a few deterministic slice offsets.
const Glitch: React.FC<{text: string; size: number; theme: Theme; amount: number}> = ({text, size, theme, amount}) => {
  const frame = useCurrentFrame();
  const jitter = amount > 0 ? (random(`g${frame}`) - 0.5) * 24 * amount : 0;
  const base: React.CSSProperties = {position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', fontSize: size, fontWeight: 800, lineHeight: 1.1};
  return (
    <div style={{position: 'relative', height: size * 1.15, fontFamily: MONO}}>
      <div style={{...base, color: theme.accent2, transform: `translateX(${-6 * amount + jitter}px)`, opacity: amount ? 0.8 : 0}}>{text}</div>
      <div style={{...base, color: theme.accent, transform: `translateX(${6 * amount - jitter}px)`, opacity: amount ? 0.8 : 0}}>{text}</div>
      <div style={{...base, color: theme.foreground}}>{text}</div>
    </div>
  );
};

const SceneBoot: React.FC<TerminalProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const cmd = `npx ${texts.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')} launch`;
  const cmdStart = 14;
  const outStart = typeEnd(cmd, cmdStart) + 8;
  const size = fit(texts.headline, 120, 1400, 0.62);
  const glitch = frame > outStart && frame < outStart + 14 ? 1 : 0;
  const exit = interpolate(frame, [88, 100], [0, 1], {...clamp, easing: easeIn});
  return (
    <Window theme={theme} title={`~/${texts.brand.toLowerCase()}`}>
      <div style={{opacity: 1 - exit, transform: `translateY(${exit * -60}px)`}}>
        <div style={{fontSize: 40}}>
          <span style={{color: theme.accent}}>{'$ '}</span>
          {typed(cmd, frame, cmdStart)}
          {frame < outStart && <Cursor color={theme.foreground} size={40} />}
        </div>
        {frame >= outStart && (
          <>
            <div style={{fontSize: 28, marginTop: 30, color: `${theme.foreground}88`}}>{'> compiling assets... done'}</div>
            <div style={{marginTop: 70}}>
              <Glitch text={texts.headline} size={size} theme={theme} amount={glitch} />
            </div>
          </>
        )}
      </div>
    </Window>
  );
};

const SceneChecks: React.FC<TerminalProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  const progress = interpolate(frame, [6, 60], [0, 1], {...clamp, easing: easeInOut});
  const exit = interpolate(frame, [80, 90], [0, 1], {...clamp, easing: easeIn});
  return (
    <Window theme={theme} title="build.log">
      <div style={{opacity: 1 - exit}}>
        {items.map((t, i) => {
          const start = 8 + i * 16;
          const done = frame > start + 14;
          return (
            <div key={i} style={{fontSize: 56, marginBottom: 34, display: 'flex', gap: 30, opacity: frame >= start ? 1 : 0}}>
              <span style={{color: done ? theme.accent : `${theme.foreground}55`, width: 60}}>{done ? '\u2713' : '\u2026'}</span>
              <span>{typed(t, frame, start)}</span>
            </div>
          );
        })}
        <div style={{marginTop: 50, height: 22, borderRadius: 11, background: `${theme.foreground}14`, overflow: 'hidden'}}>
          <div style={{width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`}} />
        </div>
        <div style={{marginTop: 34, fontSize: 30, color: `${theme.foreground}99`}}>
          {'// '}
          {typed(texts.subhead, frame, 40)}
        </div>
      </div>
    </Window>
  );
};

const SceneShip: React.FC<TerminalProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 4, 14], [0, 1, 0], clamp);
  const glitch = frame < 16 ? interpolate(frame, [0, 16], [1, 0], clamp) : frame > 50 && frame < 54 ? 0.6 : 0;
  const btn = spring({frame: frame - 20, fps, config: {damping: 13, stiffness: 140}});
  const size = fit(texts.brand, 220, 1500, 0.64);
  return (
    <AbsoluteFill style={{background: theme.background, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 70}}>
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${theme.foreground}08 0 2px, transparent 2px 6px)`}} />
      <div style={{display: 'flex', justifyContent: 'center', width: 1700}}>
        <div style={{width: size * 0.62 * texts.brand.length}}>
          <Glitch text={texts.brand} size={size} theme={theme} amount={glitch} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '28px 54px',
          borderRadius: 12,
          border: `3px solid ${theme.accent}`,
          color: theme.accent,
          fontFamily: MONO,
          fontSize: 50,
          fontWeight: 700,
          transform: `translateY(${(1 - btn) * 60}px)`,
          opacity: btn,
        }}
      >
        {`> ${texts.cta}`}
        <ArrowIcon size={46} />
      </div>
      <AbsoluteFill style={{background: theme.accent, opacity: flash * 0.5}} />
    </AbsoluteFill>
  );
};

const SCENES: React.FC<TerminalProps>[] = [SceneBoot, SceneChecks, SceneShip];

export const Terminal: React.FC<TerminalProps> = (props) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 10], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: props.theme.background, opacity: fade}}>
      {terminalMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
      <Vignette />
    </AbsoluteFill>
  );
};
