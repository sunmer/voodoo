import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, Grain, clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {spotlightMeta} from './meta';
import type {SpotlightProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 92;

const Stage: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 34) * 24;
  const y = 36 + Math.cos(frame / 47) * 10;
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 48% 34% at ${x}% ${y}%, ${theme.surface} 0%, ${theme.surface}88 34%, transparent 72%)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, background: `linear-gradient(transparent, ${theme.surface}aa)`}} />
      <div style={{position: 'absolute', left: -120, top: 1540, width: 1320, height: 2, background: `${theme.foreground}18`, transform: 'rotate(-7deg)'}} />
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<SpotlightProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = wrapFit(texts.headline, 178, W - PAD * 2, 3, 0.55);
  const beam = interpolate(frame, [0, 52], [-55, 128], {...clamp, easing: easeInOut});
  const label = interpolate(frame, [4, 24], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [42, 62], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 28, fontWeight: 650, color: theme.accent, textTransform: 'uppercase', opacity: label, transform: `translateX(${(1 - label) * -40}px)`}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{position: 'relative', marginTop: 46, fontFamily: DISPLAY, fontSize: size, lineHeight: 0.96, fontWeight: 900, color: theme.foreground}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{texts.headline}</span>
        <div style={{position: 'absolute', inset: '-60px -150px', pointerEvents: 'none', background: `linear-gradient(105deg, transparent ${beam - 18}%, ${theme.accent}66 ${beam}%, transparent ${beam + 18}%)`, mixBlendMode: 'screen'}} />
      </div>
      <div style={{marginTop: 54, maxWidth: 780, fontSize: 43, lineHeight: 1.28, color: `${theme.foreground}c4`, opacity: sub, transform: `translateY(${(1 - sub) * 26}px)`}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneStats: React.FC<SpotlightProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 34}}>
      {items.map((item, i) => {
        const s = spring({frame: frame - i * 9, fps, config: {damping: 16, stiffness: 115}});
        const lit = interpolate(frame - 8 - i * 12, [0, 18], [0, 1], {...clamp, easing: easeOut});
        const color = i === 1 ? theme.accent2 : theme.accent;
        return (
          <div key={i} style={{height: 316, borderRadius: 30, padding: '0 58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative', background: `${theme.surface}e8`, border: `2px solid ${color}${lit > 0.5 ? 'cc' : '33'}`, boxShadow: `0 0 ${80 * lit}px ${color}33`, opacity: s, transform: `translateY(${(1 - s) * 180}px) rotate(${(1 - s) * (i % 2 ? 4 : -4)}deg)`}}>
            <div style={{position: 'absolute', left: -200 + lit * 1300, top: -100, width: 160, height: 520, background: `${theme.foreground}18`, transform: 'rotate(18deg)'}} />
            <div style={{zIndex: 1}}>
              <div style={{fontFamily: MONO_FONT, fontSize: 25, color, marginBottom: 18}}>0{i + 1}</div>
              <div style={{fontSize: fit(item, 76, 620, 0.55), fontWeight: 820, color: theme.foreground, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{item}</span></div>
            </div>
            <div style={{zIndex: 1, width: 110, height: 110, borderRadius: 55, border: `3px solid ${color}`, display: 'grid', placeItems: 'center', color}}>
              <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d={['M5 12l4 4L19 6', 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z', 'M4 14l6-6 4 4 6-6'][i]} /></svg>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<SpotlightProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const r = interpolate(frame, [0, 28], [0, 130], {...clamp, easing: easeInOut});
  const word = spring({frame: frame - 9, fps, config: {damping: 15, stiffness: 100}});
  const cta = spring({frame: frame - 24, fps, config: {damping: 13, stiffness: 140}});
  return (
    <AbsoluteFill style={{background: theme.foreground, clipPath: `circle(${r}% at 50% 42%)`, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 82, padding: PAD}}>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 166, W - PAD * 2, 0.62), lineHeight: 1, fontWeight: 900, color: theme.background, opacity: word, transform: `scale(${0.82 + word * 0.18})`}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{height: 126, display: 'flex', alignItems: 'center', gap: 24, padding: '0 62px', borderRadius: 63, background: theme.accent, color: theme.background, fontSize: fit(texts.cta, 52, 650, 0.55), fontWeight: 820, transform: `translateY(${(1 - cta) * 70}px)`, opacity: cta}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={46} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<SpotlightProps>[] = [SceneTitle, SceneStats, SceneLockup];

const Exit: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const t = last ? 0 : interpolate(frame, [duration - 14, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{opacity: 1 - t, transform: `scale(${1 - t * 0.08})`}}>{children}</AbsoluteFill>;
};

export const Spotlight: React.FC<SpotlightProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <Stage theme={props.theme} />
    {spotlightMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}><Exit duration={s.duration} last={i === SCENES.length - 1}><Scene {...props} /></Exit></Sequence>;
    })}
    <Grain />
  </AbsoluteFill>
);
