import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {comingsoonMeta} from './meta';
import type {ComingsoonProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
const SLATS = 14;
type P = SceneProps<ComingsoonProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Venetian blinds: slats turn away one after another to reveal the headline.
const SceneBlinds: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const headline = texts.headline.toUpperCase();
  const size = wrapFit(headline, 180, W - PAD * 2, 3, 0.78, 56);
  const scan = interpolate(frame, [20, 90], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <div style={{position: 'absolute', top: 160, left: PAD, right: PAD, display: 'flex', alignItems: 'center', gap: 24,
        fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, W - PAD * 2 - 60, 0.62), fontWeight: 700, color: theme.foreground, textTransform: 'uppercase'}}>
        <span style={{width: 22, height: 22, flex: 'none', borderRadius: '50%', background: theme.accent2, opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame / 9))}} />
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.95, fontWeight: 900, color: theme.foreground}}>
        <Role role="headline">{headline}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, bottom: 220, height: 6, width: (W - PAD * 2) * scan, background: theme.accent2}} />
      {Array.from({length: SLATS}, (_, i) => {
        const t = interpolate(frame - 14 - i * 3.5, [0, 22], [0, 1], {...clamp, easing: easeInOut});
        return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: (H / SLATS) * i, height: H / SLATS + 1,
          background: i % 2 ? theme.accent : theme.surface, transform: `scaleY(${1 - t})`, transformOrigin: 'top'}} />;
      })}
    </AbsoluteFill>
  );
};

const SceneDial: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sweep = interpolate(frame, [0, 70], [0, 1], {...clamp, easing: easeOut});
  const show = interpolate(frame, [30, 52], [0, 1], {...clamp, easing: easeOut});
  const cta = spring({frame: frame - 50, fps, config: {damping: 13, stiffness: 150}});
  const D = 720;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: PAD}}>
      <div style={{marginTop: 170, width: D, height: D, position: 'relative', borderRadius: '50%',
        background: `conic-gradient(${theme.accent} ${sweep * 360}deg, ${theme.surface} 0deg)`}}>
        <div style={{position: 'absolute', inset: 34, borderRadius: '50%', background: theme.background}} />
        {Array.from({length: 60}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: D / 2 - 3, top: 50, width: 6, height: i % 5 ? 22 : 48, transformOrigin: `3px ${D / 2 - 50}px`,
            transform: `rotate(${i * 6}deg)`, background: i / 60 < sweep ? theme.foreground : `${theme.foreground}33`}} />
        ))}
        <div style={{position: 'absolute', left: D / 2 - 5, top: 130, width: 10, height: D / 2 - 130, borderRadius: 5, background: theme.accent2,
          transformOrigin: 'bottom', transform: `rotate(${sweep * 360}deg)`}} />
        <div style={{position: 'absolute', left: D / 2 - 24, top: D / 2 - 24, width: 48, height: 48, borderRadius: '50%', background: theme.accent2}} />
      </div>
      <div style={{marginTop: 110, width: W - PAD * 2, textAlign: 'center', fontFamily: DISPLAY, fontSize: wrapFit(texts.date, 120, W - PAD * 2, 2, 0.62, 48), lineHeight: 1.05,
        fontWeight: 900, color: theme.foreground, opacity: show, transform: `translateY(${(1 - show) * 50}px)`}}>
        <Role role="date">{texts.date}</Role>
      </div>
      <div style={{position: 'absolute', bottom: 200, display: 'grid', placeItems: 'center'}}>
        {[0, 1].map((r) => {
          const p = ((frame + r * 30) % 60) / 60;
          return <div key={r} style={{position: 'absolute', width: 560, height: 120, borderRadius: 60, border: `3px solid ${theme.accent}`,
            transform: `scale(${1 + p * 0.3 * cta})`, opacity: (1 - p) * cta}} />;
        })}
        <div style={{height: 120, display: 'flex', alignItems: 'center', gap: 20, padding: '0 54px', borderRadius: 60, background: theme.accent, color: theme.background,
          fontSize: fit(texts.cta, 50, 640, 0.56), fontWeight: 800, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
          <Role role="cta">{texts.cta}</Role><ArrowIcon size={44} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Comingsoon: React.FC<ComingsoonProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={comingsoonMeta} scenes={[SceneBlinds, SceneDial]} props={props} />
  </AbsoluteFill>
);
