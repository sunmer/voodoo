import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseChart, parseNumber} from '../shared/data';
import {linechartMeta} from './meta';
import type {LinechartProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
type P = SceneProps<LinechartProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [12, 32], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <svg width={W - PAD * 2} height={160} style={{marginBottom: 40}}>
        <path d={`M0 140 C 300 140, 400 40, 700 70 S 1200 10, ${W - PAD * 2} 20`} fill="none" stroke={theme.accent} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} strokeLinecap="round" />
      </svg>
      <div style={{fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 150, W - PAD * 2, 2, 0.6, 60), lineHeight: 1, fontWeight: 850, color: theme.foreground, opacity: t}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{marginTop: 36, fontSize: wrapFit(texts.subhead, 52, W - PAD * 2, 2, 0.52, 30), lineHeight: 1.25, color: `${theme.foreground}aa`, opacity: sub}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

// Line draws point by point with a value tag riding the leading edge.
const SceneChart: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const points = parseChart(texts.chart);
  const left = PAD + 40;
  const right = W - PAD - 40;
  const top = 280;
  const bottom = 860;
  const values = points.map((p) => p.value);
  const min = Math.min(0, ...values);
  const max = Math.max(...values, min + 1);
  const xy = points.map((p, i) => ({x: left + ((right - left) * i) / (points.length - 1), y: bottom - ((p.value - min) / (max - min)) * (bottom - top)}));
  const t = interpolate(frame, [10, 100], [0, 1], {...clamp, easing: easeInOut});
  const pos = t * (points.length - 1);
  const seg = Math.min(points.length - 2, Math.floor(pos));
  const f = pos - seg;
  const head = {x: xy[seg].x + (xy[seg + 1].x - xy[seg].x) * f, y: xy[seg].y + (xy[seg + 1].y - xy[seg].y) * f};
  const drawn = [...xy.slice(0, seg + 1), head];
  const d = drawn.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const area = `${d} L${head.x} ${bottom} L${xy[0].x} ${bottom} Z`;
  const current = points[Math.min(points.length - 1, Math.round(pos))];
  const colW = (right - left) / (points.length - 1);
  const labelSize = Math.min(30, ...points.map((p) => fit(p.label, 30, colW - 10, 0.56)));
  const tagText = formatNumber(parseNumber(current.display), 1);
  const tagW = Math.max(150, tagText.length * 30 + 50);
  const tagX = Math.min(right - tagW / 2, Math.max(left + tagW / 2, head.x));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: PAD, top: 90, fontFamily: DISPLAY, fontSize: fit(texts.headline, 64, W - PAD * 2, 0.6), fontWeight: 800, color: theme.foreground}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={theme.accent} stopOpacity={0.4} />
            <stop offset="1" stopColor={theme.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1={left} x2={right} y1={bottom - g * (bottom - top)} y2={bottom - g * (bottom - top)} stroke={`${theme.foreground}1f`} strokeWidth={2} />)}
        <path d={area} fill="url(#lc-fill)" />
        <path d={d} fill="none" stroke={theme.accent} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        {xy.map((p, i) => i <= pos + 0.001 && <circle key={i} cx={p.x} cy={p.y} r={12} fill={theme.background} stroke={theme.accent} strokeWidth={6} />)}
        <circle cx={head.x} cy={head.y} r={18} fill={theme.accent2} />
      </svg>
      <div style={{position: 'absolute', left: tagX - tagW / 2, top: Math.max(170, head.y - 110), width: tagW, padding: '12px 0', borderRadius: 8, background: theme.accent2, color: theme.background, textAlign: 'center', fontFamily: MONO_FONT, fontSize: 44, fontWeight: 800}}>{tagText}</div>
      <Role role="chart">
        {points.map((p, i) => (
          <span key={i} style={{position: 'absolute', left: xy[i].x - colW / 2, width: colW, top: bottom + 30, textAlign: 'center', fontSize: labelSize, fontWeight: 650, whiteSpace: 'nowrap', color: i <= pos + 0.001 ? theme.foreground : `${theme.foreground}55`}}>{p.label}</span>
        ))}
      </Role>
    </AbsoluteFill>
  );
};

const SceneSource: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.surface, alignItems: 'center', justifyContent: 'center', padding: PAD, opacity: t}}>
      <div style={{fontFamily: MONO_FONT, fontSize: wrapFit(texts.attribution, 48, W - PAD * 2, 2, 0.62, 28), textAlign: 'center', color: theme.foreground, transform: `translateY(${(1 - t) * 30}px)`}}>
        <Role role="attribution">{texts.attribution}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Linechart: React.FC<LinechartProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={linechartMeta} scenes={[SceneTitle, SceneChart, SceneSource]} props={props} />
  </AbsoluteFill>
);
