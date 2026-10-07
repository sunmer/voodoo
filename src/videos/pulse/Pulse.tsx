import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, FONT, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {pulseMeta} from './meta';
import type {PulseProps} from './schema';

const W = 1080;
const H = 1350;
const PAD = 90;

// Deterministic rising line; reads as a growth chart.
const POINTS = [0.12, 0.2, 0.16, 0.3, 0.27, 0.42, 0.38, 0.55, 0.5, 0.68, 0.64, 0.86];

const LineChart: React.FC<{theme: Theme; progress: number; opacity: number}> = ({theme, progress, opacity}) => {
  const w = W - PAD * 2;
  const h = 520;
  const pts = POINTS.map((v, i) => [(i / (POINTS.length - 1)) * w, h - v * h]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const len = 2400;
  const head = pts[Math.min(pts.length - 1, Math.floor(progress * (pts.length - 1)))];
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: PAD, bottom: 160, opacity, overflow: 'visible'}}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={0} x2={w} y1={h - g * h} y2={h - g * h} stroke={theme.foreground} strokeOpacity={0.1} strokeWidth={2} />
      ))}
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={theme.accent} fillOpacity={0.12 * progress} />
      <path d={d} fill="none" stroke={theme.accent} strokeWidth={8} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - progress)} />
      {progress > 0.02 && <circle cx={head[0]} cy={head[1]} r={16} fill={theme.background} stroke={theme.accent} strokeWidth={6} />}
    </svg>
  );
};

const Reveal: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame - delay, [0, 20], [110, 0], {...clamp, easing: easeOut});
  return (
    <div style={{overflow: 'hidden'}}>
      <div style={{transform: `translateY(${y}%)`}}>{children}</div>
    </div>
  );
};

const SceneTitle: React.FC<PulseProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [10, 70], [0, 1], {...clamp, easing: easeInOut});
  const exit = interpolate(frame, [72, 84], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{padding: PAD, opacity: 1 - exit}}>
      <LineChart theme={theme} progress={draw} opacity={1} />
      <Reveal delay={2}>
        <div style={{fontSize: 34, fontWeight: 700, color: theme.accent2, textTransform: 'uppercase', letterSpacing: '0.12em'}}>{texts.brand}</div>
      </Reveal>
      <div style={{height: 30}} />
      <Reveal delay={8}>
        <div style={{fontSize: fit(texts.headline, 120, W - PAD * 2, 0.56), fontWeight: 850, lineHeight: 1.05, color: theme.foreground}}>{texts.headline}</div>
      </Reveal>
      <div style={{height: 24}} />
      <Reveal delay={16}>
        <div style={{fontSize: 40, lineHeight: 1.3, color: `${theme.foreground}aa`, maxWidth: 820}}>{texts.subhead}</div>
      </Reveal>
    </AbsoluteFill>
  );
};

const SceneBars: React.FC<PulseProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  const heights = [0.48, 0.72, 1];
  const colors = [theme.surface, theme.accent2, theme.accent];
  const maxH = 720;
  const exit = interpolate(frame, [74, 86], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'flex-end', paddingBottom: 150, opacity: 1 - exit}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, height: maxH + 200}}>
        {items.map((t, i) => {
          const s = spring({frame: frame - 6 - i * 10, fps, config: {damping: 16, stiffness: 90}});
          const pct = Math.round(heights[i] * 100 * s);
          return (
            <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 20}}>
              <div style={{fontSize: 64, fontWeight: 850, color: theme.foreground, fontVariantNumeric: 'tabular-nums'}}>{pct}%</div>
              <div style={{height: maxH * heights[i] * s, borderRadius: '18px 18px 0 0', background: colors[i], border: i === 0 ? `3px solid ${theme.foreground}33` : undefined}} />
            </div>
          );
        })}
      </div>
      <div style={{height: 4, background: theme.foreground, opacity: 0.6}} />
      <div style={{display: 'flex', gap: 40, marginTop: 24}}>
        {items.map((t, i) => (
          <div key={i} style={{flex: 1, fontSize: fit(t, 40, 270, 0.55), fontWeight: 700, color: theme.foreground, opacity: interpolate(frame - 20 - i * 10, [0, 14], [0, 1], clamp)}}>
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneClose: React.FC<PulseProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = interpolate(frame, [0, 40], [0, 1], {...clamp, easing: easeInOut});
  const word = spring({frame: frame - 14, fps, config: {damping: 14, stiffness: 120}});
  const btn = spring({frame: frame - 26, fps, config: {damping: 12, stiffness: 140}});
  const r = 300;
  const c = 2 * Math.PI * r;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <svg width={r * 2 + 40} height={r * 2 + 40} style={{position: 'absolute', top: H / 2 - r - 140, transform: 'rotate(-90deg)'}}>
        <circle cx={r + 20} cy={r + 20} r={r} fill="none" stroke={theme.foreground} strokeOpacity={0.12} strokeWidth={14} />
        <circle cx={r + 20} cy={r + 20} r={r} fill="none" stroke={theme.accent} strokeWidth={14} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ring)} />
      </svg>
      <div style={{position: 'absolute', top: H / 2 - 140, transform: 'translateY(-50%)', textAlign: 'center', width: W - PAD * 2}}>
        <div style={{fontSize: fit(texts.brand, 130, 520, 0.6), fontWeight: 850, color: theme.foreground, transform: `scale(${word})`}}>{texts.brand}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 190,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '30px 56px',
          borderRadius: 999,
          background: theme.accent,
          color: theme.background,
          fontSize: 50,
          fontWeight: 800,
          transform: `translateY(${(1 - btn) * 80}px)`,
          opacity: btn,
        }}
      >
        {texts.cta}
        <ArrowIcon size={46} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<PulseProps>[] = [SceneTitle, SceneBars, SceneClose];

export const Pulse: React.FC<PulseProps> = (props) => {
  const {theme} = props;
  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: theme.background}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 85% 10%, ${theme.accent}22, transparent 45%)`}} />
      {pulseMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
