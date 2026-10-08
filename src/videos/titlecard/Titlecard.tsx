import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {titlecardMeta} from './meta';
import type {TitlecardProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<TitlecardProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const bars = interpolate(frame, [0, 26], [540, 150], {...clamp, easing: easeInOut});
  const reveal = interpolate(frame, [24, 70], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [54, 90], [0, 1], {...clamp, easing: easeInOut});
  const zoom = interpolate(frame, [0, 180], [1.08, 1], clamp);
  const width = interpolate(frame, [24, 90], [62, 112], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        background: `radial-gradient(circle at 50% 50%, ${theme.surface}, ${theme.background} 70%)`}}>
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 30, 900, 0.62), color: theme.accent, textTransform: 'uppercase', opacity: reveal, marginBottom: 34}}>
          <Role role="brand">{texts.brand}</Role>
        </div>
        <div style={{maxWidth: 1600, clipPath: `inset(0 ${(1 - reveal) * 50}% 0 ${(1 - reveal) * 50}%)`, fontFamily: FLEX_FONT, fontStretch: `${width}%`,
          fontSize: wrapFit(texts.headline.toUpperCase(), 190, 1600, 2, 0.84, 80), lineHeight: 1, fontWeight: 850, color: theme.foreground, textTransform: 'uppercase'}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
        <div style={{width: 760 * line, height: 3, background: theme.accent2, margin: '42px 0'}} />
        <div style={{maxWidth: 1300, fontSize: wrapFit(texts.subhead, 44, 1300, 2, 0.52, 28), lineHeight: 1.25, color: `${theme.foreground}cc`, opacity: line}}>
          <Role role="subhead">{texts.subhead}</Role>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bars, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bars, background: '#000'}} />
    </AbsoluteFill>
  );
};

export const Titlecard: React.FC<TitlecardProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={titlecardMeta} scenes={[SceneTitle]} props={props} />
  </AbsoluteFill>
);
