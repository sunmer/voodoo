import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {countdownMeta} from './meta';
import type {CountdownProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
const R = 380;
type P = SceneProps<CountdownProps>;

const SceneCount: React.FC<P> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = Math.round(duration / fps);
  const n = Math.max(1, total - Math.floor(frame / fps));
  const local = frame % fps;
  const pop = spring({frame: local, fps, config: {damping: 11, stiffness: 190}});
  const progress = local / fps;
  const c = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{marginTop: 180, fontFamily: MONO_FONT, fontSize: 34, fontWeight: 700, color: theme.accent, textTransform: 'uppercase'}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{marginTop: 30, padding: `0 ${PAD}px`, textAlign: 'center', fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 104, W - PAD * 2, 2, 0.62), lineHeight: 1, fontWeight: 900, textTransform: 'uppercase', color: theme.foreground}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{texts.headline}</span>
      </div>
      <div style={{position: 'absolute', top: 640, width: R * 2 + 40, height: R * 2 + 40, display: 'grid', placeItems: 'center'}}>
        <svg width={R * 2 + 40} height={R * 2 + 40} style={{position: 'absolute', transform: 'rotate(-90deg)'}}>
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={`${theme.foreground}1f`} strokeWidth={18} />
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={n % 2 ? theme.accent : theme.accent2} strokeWidth={18} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * progress} />
        </svg>
        <div style={{fontFamily: DISPLAY, fontSize: 520, lineHeight: 1, fontWeight: 900, color: theme.foreground, transform: `scale(${0.5 + pop * 0.5})`, opacity: interpolate(local, [fps - 5, fps], [1, 0], clamp)}}>{n}</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneLive: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 10], [1, 0], clamp);
  const burst = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const cta = interpolate(frame, [22, 40], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: theme.accent}}>
      <AbsoluteFill style={{background: theme.foreground, opacity: flash}} />
      <div style={{fontFamily: DISPLAY, fontSize: wrapFit(texts.subhead, 130, W - PAD * 2, 4, 0.62), lineHeight: 0.98, fontWeight: 900, textTransform: 'uppercase', color: theme.background, transform: `scale(${burst})`}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
      <div style={{marginTop: 80, height: 124, display: 'flex', alignItems: 'center', gap: 22, padding: '0 54px', borderRadius: 62, background: theme.background, color: theme.foreground, fontSize: fit(texts.cta, 52, 760, 0.56), fontWeight: 820, opacity: cta, transform: `translateY(${(1 - cta) * 40}px)`}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={46} />
      </div>
    </AbsoluteFill>
  );
};

export const Countdown: React.FC<CountdownProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={countdownMeta} scenes={[SceneCount, SceneLive]} props={props} exit="none" />
  </AbsoluteFill>
);
