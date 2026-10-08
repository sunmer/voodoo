import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {pulseMeta} from './meta';
import type {PulseProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 84;

// Deterministic rising series; reads as a growth chart.
const POINTS = [0.14, 0.22, 0.18, 0.31, 0.28, 0.42, 0.39, 0.53, 0.49, 0.66, 0.62, 0.84];

// Smooth path through points (Catmull-Rom to Bezier).
function smooth(pts: number[][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const Chip: React.FC<{theme: Theme; children: React.ReactNode}> = ({theme, children}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, height: 52, padding: '0 22px', borderRadius: 26, background: `${theme.foreground}0d`, border: `1.5px solid ${theme.foreground}1a`, fontSize: 24, fontWeight: 700, color: theme.foreground}}>
    <span style={{width: 12, height: 12, borderRadius: 6, background: theme.accent2}} />
    {children}
  </div>
);

const AreaChart: React.FC<{theme: Theme; progress: number}> = ({theme, progress}) => {
  const w = W - PAD * 2;
  const h = 500;
  const pts = POINTS.map((v, i) => [(i / (POINTS.length - 1)) * w, h - v * h]);
  const d = smooth(pts);
  const len = 2200;
  const idx = progress * (pts.length - 1);
  const a = pts[Math.floor(idx)];
  const b = pts[Math.min(pts.length - 1, Math.ceil(idx))];
  const t = idx - Math.floor(idx);
  const head = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const value = Math.round(interpolate(progress, [0, 1], [0, POINTS.at(-1)! * 100]));
  const id = `pulse-fill-${theme.accent.slice(1)}`;
  return (
    <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 120, height: h + 60}}>
      <svg width={w} height={h} style={{position: 'absolute', top: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={theme.accent} stopOpacity={0.35} />
            <stop offset="1" stopColor={theme.accent} stopOpacity={0} />
          </linearGradient>
          <clipPath id={`${id}-clip`}>
            <rect x={0} y={-40} width={head[0]} height={h + 80} />
          </clipPath>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={0} x2={w} y1={h - g * h} y2={h - g * h} stroke={theme.foreground} strokeOpacity={g === 0 ? 0.35 : 0.08} strokeWidth={2} strokeDasharray={g === 0 ? undefined : '6 10'} />
        ))}
        <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} clipPath={`url(#${id}-clip)`} />
        <path d={d} fill="none" stroke={theme.accent} strokeWidth={7} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - progress)} />
        {progress > 0.02 && (
          <>
            <line x1={head[0]} x2={head[0]} y1={head[1]} y2={h} stroke={theme.accent} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="4 6" />
            <circle cx={head[0]} cy={head[1]} r={28} fill={theme.accent} fillOpacity={0.18} />
            <circle cx={head[0]} cy={head[1]} r={13} fill={theme.background} stroke={theme.accent} strokeWidth={6} />
          </>
        )}
      </svg>
      {progress > 0.02 && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(w - 170, Math.max(0, head[0] - 85)),
            top: head[1] - 110,
            width: 170,
            height: 64,
            borderRadius: 14,
            background: theme.foreground,
            color: theme.background,
            display: 'grid',
            placeItems: 'center',
            fontSize: 32,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {`+${value}%`}
        </div>
      )}
      <div style={{position: 'absolute', top: h + 22, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontFamily: MONO_FONT, fontSize: 20, color: `${theme.foreground}77`}}>
        {['01', '02', '03', '04', '05', '06'].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};

const Reveal: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame - delay, [0, 22], [110, 0], {...clamp, easing: easeOut});
  return (
    <div style={{overflow: 'hidden', paddingBottom: 6}}>
      <div style={{transform: `translateY(${y}%)`}}>{children}</div>
    </div>
  );
};

const SceneTitle: React.FC<PulseProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [14, 76], [0, 1], {...clamp, easing: easeInOut});
  const words = texts.headline.split(' ');
  const size = Math.min(132, ...words.map((w) => (W - PAD * 2) / (Math.max(w.length, 4) * 0.6)));
  return (
    <AbsoluteFill style={{padding: `${PAD + 10}px ${PAD}px`}}>
      <Reveal delay={0}>
        <Chip theme={theme}><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></Chip>
      </Reveal>
      <div style={{height: 40}} />
      <Reveal delay={6}>
        <div style={{fontSize: size, fontWeight: 800, lineHeight: 1, color: theme.foreground, maxWidth: W - PAD * 2}}><span data-text-role={"headline"} style={{display: 'contents'}}>{texts.headline}</span></div>
      </Reveal>
      <div style={{height: 30}} />
      <Reveal delay={14}>
        <div style={{fontSize: 38, lineHeight: 1.3, fontWeight: 450, color: `${theme.foreground}99`, maxWidth: 820}}><span data-text-role={"subhead"} style={{display: 'contents'}}>{texts.subhead}</span></div>
      </Reveal>
      <AreaChart theme={theme} progress={draw} />
    </AbsoluteFill>
  );
};

const SceneBars: React.FC<PulseProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  const heights = [0.48, 0.72, 0.94];
  const colors = [`${theme.foreground}2a`, theme.accent2, theme.accent];
  const maxH = 700;
  const head = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: `${PAD + 10}px ${PAD}px`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: head}}>
        <Chip theme={theme}><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></Chip>
        <span style={{fontFamily: MONO_FONT, fontSize: 22, color: `${theme.foreground}77`}}>{'INDEX \u2191'}</span>
      </div>
      <div style={{marginTop: 34, fontSize: fit(texts.headline, 72, W - PAD * 2, 0.56), fontWeight: 800, color: theme.foreground, opacity: head}}><span data-text-role={"headline"} style={{display: 'contents'}}>{texts.headline}</span></div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 130, height: maxH + 220}}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <div key={g} style={{position: 'absolute', left: 0, right: 0, bottom: 90 + g * maxH, borderTop: `2px dashed ${theme.foreground}14`}} />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', alignItems: 'flex-end', gap: 36}}>
          {items.map((t, i) => {
            const raw = spring({frame: frame - 8 - i * 9, fps, config: {damping: 15, stiffness: 90}});
            const s = Math.min(1, raw);
            const pct = Math.round(heights[i] * 100 * s);
            return (
              <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 18}}>
                <div style={{fontSize: 66, fontWeight: 800, color: theme.foreground, fontVariantNumeric: 'tabular-nums', opacity: Math.min(1, raw * 2)}}>
                  {pct}
                  <span style={{fontSize: 36, color: `${theme.foreground}88`}}>%</span>
                </div>
                <div
                  style={{
                    height: maxH * heights[i] * raw,
                    borderRadius: '20px 20px 6px 6px',
                    background: colors[i],
                    boxShadow: i === 2 ? `0 24px 60px ${theme.accent}44` : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 86, height: 4, borderRadius: 2, background: theme.foreground, opacity: 0.5}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', gap: 36}}>
          {items.map((t, i) => (
            <div key={i} style={{flex: 1, fontSize: fit(t, 34, 270, 0.56), lineHeight: 1.15, fontWeight: 700, color: theme.foreground, opacity: interpolate(frame - 18 - i * 9, [0, 14], [0, 1], clamp)}}>
              <span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneClose: React.FC<PulseProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = interpolate(frame, [0, 42], [0, 1], {...clamp, easing: easeInOut});
  const word = spring({frame: frame - 12, fps, config: {damping: 14, stiffness: 120}});
  const btn = spring({frame: frame - 24, fps, config: {damping: 13, stiffness: 140}});
  const r = 290;
  const c = 2 * Math.PI * r;
  const cy = H / 2 - 120;
  const ticks = Array.from({length: 60});
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g transform={`rotate(-90 ${W / 2} ${cy})`}>
          {ticks.map((_, i) => {
            const a = (i / ticks.length) * Math.PI * 2;
            const on = i / ticks.length <= ring;
            return (
              <line
                key={i}
                x1={W / 2 + Math.cos(a) * (r + 40)}
                y1={cy + Math.sin(a) * (r + 40)}
                x2={W / 2 + Math.cos(a) * (r + (i % 5 ? 52 : 64))}
                y2={cy + Math.sin(a) * (r + (i % 5 ? 52 : 64))}
                stroke={on ? theme.accent2 : theme.foreground}
                strokeOpacity={on ? 0.9 : 0.12}
                strokeWidth={4}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={W / 2} cy={cy} r={r} fill="none" stroke={theme.foreground} strokeOpacity={0.1} strokeWidth={20} />
          <circle cx={W / 2} cy={cy} r={r} fill="none" stroke={theme.accent} strokeWidth={20} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ring)} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: cy, transform: `translateY(-50%) scale(${0.85 + word * 0.15})`, opacity: word, textAlign: 'center'}}>
        <div style={{fontSize: fit(texts.brand, 120, 470, 0.6), fontWeight: 850, lineHeight: 1, color: theme.foreground}}><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></div>
        <div style={{marginTop: 18, fontFamily: MONO_FONT, fontSize: 24, color: `${theme.foreground}88`}}>{`${Math.round(ring * 100)}% COMPLETE`}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 170, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '30px 54px',
            borderRadius: 999,
            background: theme.accent,
            color: theme.background,
            fontSize: fit(texts.cta, 48, 640, 0.55),
            fontWeight: 800,
            whiteSpace: 'nowrap',
            boxShadow: `0 24px 60px ${theme.accent}55`,
            transform: `translateY(${(1 - btn) * 80}px)`,
            opacity: btn,
          }}
        >
          <span data-text-role={"cta"} style={{display: 'contents'}}>{texts.cta}</span>
          <ArrowIcon size={44} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scenes slide up as one continuous feed.
const Slide: React.FC<{from: number; duration: number; first: boolean; last: boolean; children: React.ReactNode}> = ({duration, first, last, children}) => {
  const frame = useCurrentFrame();
  const enter = first ? 1 : interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  const exit = last ? 0 : interpolate(frame, [duration - 14, duration], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - enter) * 120 - exit * 120}px)`, opacity: enter * (1 - exit)}}>{children}</AbsoluteFill>
  );
};

const SCENES: React.FC<PulseProps>[] = [SceneTitle, SceneBars, SceneClose];

export const Pulse: React.FC<PulseProps> = (props) => {
  const {theme} = props;
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 240], [0, 1]);
  return (
    <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden', background: theme.background}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${80 - glow * 20}% ${8 + glow * 10}%, ${theme.accent}26, transparent 42%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 10% 100%, ${theme.accent2}1a, transparent 40%)`}} />
      {pulseMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Slide from={s.from} duration={s.duration} first={i === 0} last={i === pulseMeta.scenes.length - 1}>
              <Scene {...props} />
            </Slide>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
