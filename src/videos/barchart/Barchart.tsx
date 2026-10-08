import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseChart, parseNumber} from '../shared/data';
import {barchartMeta} from './meta';
import type {BarchartProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1080;
const PAD = 90;
type P = SceneProps<BarchartProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [12, 30], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{width: 120 * t, height: 12, background: theme.accent, marginBottom: 50}} />
      <div style={{fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 130, W - PAD * 2, 2, 0.6), lineHeight: 1, fontWeight: 900, color: theme.foreground, opacity: t, transform: `translateY(${(1 - t) * 40}px)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{marginTop: 40, fontSize: wrapFit(texts.subhead, 44, W - PAD * 2, 2, 0.52, 28), lineHeight: 1.25, fontWeight: 500, color: `${theme.foreground}aa`, opacity: sub}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneChart: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const points = parseChart(texts.chart);
  const max = Math.max(...points.map((p) => Math.abs(p.value)), 1);
  const gap = 28;
  const bar = (W - PAD * 2 - gap * (points.length - 1)) / points.length;
  const area = 600;
  const peak = points.findIndex((p) => Math.abs(p.value) === max);
  const labelSize = Math.min(30, ...points.map((p) => fit(p.label, 30, bar, 0.56)));
  const valueSize = Math.min(46, ...points.map((p) => fit(p.display, 46, bar, 0.6)));
  return (
    <AbsoluteFill style={{padding: PAD}}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <div key={g} style={{position: 'absolute', left: PAD, right: PAD, top: 160 + area * (1 - g), height: 2, background: `${theme.foreground}14`}} />
      ))}
      <Role role="chart">
        <div style={{position: 'absolute', left: PAD, right: PAD, top: 160, height: area, display: 'flex', gap, alignItems: 'flex-end'}}>
          {points.map((p, i) => {
            const t = interpolate(frame - 8 - i * 7, [0, 34], [0, 1], {...clamp, easing: easeInOut});
            const n = parseNumber(p.display);
            return (
              <div key={i} style={{width: bar, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
                <span style={{fontFamily: MONO_FONT, fontSize: valueSize, fontWeight: 800, color: i === peak ? theme.accent : theme.foreground, marginBottom: 14, opacity: Math.min(1, t * 3)}}>{formatNumber(n, t)}</span>
                <div style={{width: '100%', height: Math.max(6, (Math.abs(p.value) / max) * (area - 80) * t), borderRadius: '8px 8px 0 0', background: i === peak ? theme.accent : theme.accent2}} />
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: PAD, right: PAD, top: 160 + area + 24, display: 'flex', gap}}>
          {points.map((p, i) => (
            <span key={i} style={{width: bar, textAlign: 'center', fontSize: labelSize, fontWeight: 650, color: `${theme.foreground}cc`, whiteSpace: 'nowrap', opacity: interpolate(frame - i * 7, [0, 14], [0, 1], clamp)}}>{p.label}</span>
          ))}
        </div>
      </Role>
    </AbsoluteFill>
  );
};

const SceneSource: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.surface, padding: PAD, justifyContent: 'center', alignItems: 'center', gap: 40, clipPath: `inset(0 0 ${(1 - t) * 100}% 0)`}}>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 120, W - PAD * 2, 0.62), fontWeight: 900, color: theme.foreground}}><Role role="brand">{texts.brand}</Role></div>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.attribution, 30, W - PAD * 2, 0.62), color: `${theme.foreground}aa`}}><Role role="attribution">{texts.attribution}</Role></div>
    </AbsoluteFill>
  );
};

export const Barchart: React.FC<BarchartProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={barchartMeta} scenes={[SceneTitle, SceneChart, SceneSource]} props={props} />
  </AbsoluteFill>
);
