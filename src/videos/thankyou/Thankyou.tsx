import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {SERIF_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {thankyouMeta} from './meta';
import type {ThankyouProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<ThankyouProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneThanks: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [8, 70], [0, 1], {...clamp, easing: easeInOut});
  const words = texts.headline.split(/\s+/);
  let index = 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 140}}>
      <svg width="1300" height="380" viewBox="0 0 1300 380" style={{position: 'absolute', top: 210}}>
        <path d="M40 260 C250 40 380 360 610 170 S960 30 1260 230" fill="none" stroke={theme.accent} strokeWidth="18" strokeLinecap="round" strokeDasharray="1600" strokeDashoffset={1600 * (1 - draw)} opacity="0.55" />
      </svg>
      <div style={{position: 'relative', maxWidth: 1600, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: wrapFit(texts.headline, 180, 1600, 2, 0.62, 80), lineHeight: 1, fontWeight: 650, color: theme.foreground}}>
        <Role role="headline">{words.map((word, w) => (
          <span key={w} style={{display: 'inline-block', whiteSpace: 'nowrap', marginRight: w < words.length - 1 ? '0.25em' : 0}}>
            {[...word].map((ch) => {
              const i = index++;
              const t = interpolate(frame - 14 - i * 2.2, [0, 18], [0, 1], {...clamp, easing: easeOut});
              return <span key={i} style={{display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 50}px) rotate(${(1 - t) * -8}deg)`}}>{ch}</span>;
            })}
          </span>
        ))}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 56, maxWidth: 1250, fontSize: wrapFit(texts.subhead, 48, 1250, 2, 0.52, 28), lineHeight: 1.25, fontWeight: 550, color: `${theme.foreground}cc`,
        opacity: interpolate(frame, [62, 84], [0, 1], clamp)}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneNext: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panel = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeInOut});
  const pill = spring({frame: frame - 18, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, background: theme.accent, clipPath: `polygon(0 0, ${panel * 58}% 0, ${panel * 48}% 100%, 0 100%)`}} />
      <div style={{position: 'absolute', left: 120, top: 420, width: 760, fontFamily: SERIF_FONT, fontSize: fit(texts.brand, 110, 760, 0.55), fontWeight: 750, color: theme.background, opacity: panel}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', right: 150, top: 470, height: 130, display: 'flex', alignItems: 'center', gap: 24, padding: '0 58px', borderRadius: 65,
        background: theme.foreground, color: theme.background, fontSize: fit(texts.cta, 52, 650, 0.58), fontWeight: 850, transform: `scale(${pill})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={48} />
      </div>
    </AbsoluteFill>
  );
};

export const Thankyou: React.FC<ThankyouProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={thankyouMeta} scenes={[SceneThanks, SceneNext]} props={props} />
  </AbsoluteFill>
);
