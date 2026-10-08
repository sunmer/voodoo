import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {counterMeta} from './meta';
import type {CounterProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
type P = SceneProps<CounterProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneCount: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const n = parseNumber(texts.stat);
  const t = interpolate(frame, [8, 80], [0, 1], {...clamp, easing: easeOut});
  const label = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  const ticks = 40;
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.headline, 46, W - PAD * 2, 0.62), fontWeight: 700, color: theme.accent, textTransform: 'uppercase', opacity: label}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{marginTop: 30, fontFamily: FLEX_FONT, fontStretch: '72%', fontSize: fit(texts.stat, 440, W - PAD * 2, 0.43), lineHeight: 1, fontWeight: 900, color: theme.foreground, whiteSpace: 'nowrap'}}>
        <Role role="stat">{formatNumber(n, t)}</Role>
      </div>
      <div style={{marginTop: 50, display: 'flex', gap: 8, height: 90, alignItems: 'flex-end'}}>
        {Array.from({length: ticks}, (_, i) => {
          const on = i / ticks < t;
          return <div key={i} style={{flex: 1, height: on ? 90 - (i % 5 ? 40 : 0) : 20, background: on ? (i % 5 ? theme.accent2 : theme.accent) : `${theme.foreground}22`}} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneContext: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeInOut});
  const sub = interpolate(frame, [6, 24], [0, 1], {...clamp, easing: easeOut});
  const cta = spring({frame: frame - 22, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 50}}>
      <div style={{width: (W - PAD * 2) * line, height: 6, background: theme.accent}} />
      <div style={{fontSize: wrapFit(texts.subhead, 92, W - PAD * 2, 3, 0.54, 44), lineHeight: 1.12, fontWeight: 800, color: theme.foreground, opacity: sub, transform: `translateY(${(1 - sub) * 40}px)`}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.attribution, 30, W - PAD * 2, 0.62), color: `${theme.foreground}99`, opacity: sub}}>
        <Role role="attribution">{texts.attribution}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30}}>
        <span style={{fontSize: fit(texts.brand, 54, 420, 0.6), fontWeight: 900, color: theme.foreground}}><Role role="brand">{texts.brand}</Role></span>
        <span style={{height: 104, display: 'flex', alignItems: 'center', gap: 18, padding: '0 40px', borderRadius: 52, background: theme.accent, color: theme.background,
          fontSize: fit(texts.cta, 40, 440, 0.56), fontWeight: 800, transform: `scale(${cta})`}}><Role role="cta">{texts.cta}</Role><ArrowIcon size={36} /></span>
      </div>
    </AbsoluteFill>
  );
};

export const Counter: React.FC<CounterProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={counterMeta} scenes={[SceneCount, SceneContext]} props={props} />
  </AbsoluteFill>
);
