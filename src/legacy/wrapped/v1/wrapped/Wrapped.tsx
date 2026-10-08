import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {wrappedMeta} from './meta';
import type {WrappedProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 84;
type P = SceneProps<WrappedProps>;

const Shapes: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const shapes = [
    {x: -120, y: 120, s: 520, c: theme.accent, r: '50%'},
    {x: 640, y: 1260, s: 600, c: theme.accent2, r: '8px'},
    {x: 700, y: 180, s: 260, c: theme.surface, r: '50% 0'},
  ];
  return (
    <AbsoluteFill style={{background: theme.background}}>
      {shapes.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: p.x, top: p.y, width: p.s, height: p.s, borderRadius: p.r, background: p.c, transform: `rotate(${frame * (i % 2 ? -0.4 : 0.5) + i * 20}deg)`}} />
      ))}
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.headline.split(' ');
  const size = wrapFit(texts.headline, 220, W - PAD * 2, 3, 0.64);
  const brand = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 34, fontWeight: 700, color: theme.foreground, opacity: brand}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{marginTop: 30, fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, fontWeight: 900, color: theme.foreground}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{words.map((w, i) => {
          const s = spring({frame: frame - 8 - i * 8, fps, config: {damping: 12, stiffness: 150}});
          return <div key={i} style={{transform: `translateY(${(1 - s) * 300}px) rotate(${(1 - s) * -10}deg)`, opacity: Math.min(1, s * 2)}}>{w}</div>;
        })}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneStats: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  const intro = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  const colors = [theme.accent, theme.accent2, theme.foreground];
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 34}}>
      <div style={{fontSize: wrapFit(texts.subhead, 64, W - PAD * 2, 2, 0.55), lineHeight: 1.1, fontWeight: 800, color: theme.foreground, opacity: intro, marginBottom: 20}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
      {items.map((item, i) => {
        const s = spring({frame: frame - 18 - i * 22, fps, config: {damping: 13, stiffness: 120}});
        return (
          <div key={i} style={{height: 250, padding: '0 50px', display: 'flex', alignItems: 'center', gap: 36, borderRadius: 8, background: colors[i], color: i === 2 ? theme.background : theme.foreground, transform: `translateX(${(1 - s) * (i % 2 ? 1 : -1) * 1200}px) rotate(${(i - 1) * 2}deg)`}}>
            <span style={{fontFamily: MONO_FONT, fontSize: 40, fontWeight: 800}}>#{i + 1}</span>
            <span style={{fontFamily: DISPLAY, fontSize: fit(item, 110, 680, 0.7), fontWeight: 900, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{item}</span></span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const cta = spring({frame: frame - 16, fps, config: {damping: 12, stiffness: 150}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: theme.foreground, clipPath: `circle(${s * 170}% at 50% 100%)`}}>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 150, W - PAD * 2, 0.66), lineHeight: 1, fontWeight: 900, color: theme.background}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{marginTop: 60, padding: '26px 50px', borderRadius: 60, background: theme.accent, color: theme.foreground, fontSize: fit(texts.cta, 50, 760, 0.56), fontWeight: 820, transform: `scale(${cta})`}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Wrapped: React.FC<WrappedProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <Shapes theme={props.theme} />
    <SceneTrack meta={wrappedMeta} scenes={[SceneTitle, SceneStats, SceneOutro]} props={props} exit="slide" />
  </AbsoluteFill>
);
