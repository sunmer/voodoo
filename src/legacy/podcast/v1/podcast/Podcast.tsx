import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {podcastMeta} from './meta';
import type {PodcastProps} from './schema';

loadTemplateFonts();

const S = 1080;
const PAD = 84;
type P = SceneProps<PodcastProps>;

// A deterministic, audio-free waveform. It reads as speech without audio input.
const Wave: React.FC<{theme: Theme; bars?: number; height?: number}> = ({theme, bars = 42, height = 220}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 120, height, display: 'flex', alignItems: 'center', gap: 8}}>
      {Array.from({length: bars}, (_, i) => {
        const v = Math.abs(Math.sin(frame / 5 + i * 0.7) * Math.cos(frame / 11 + i * 0.31));
        return <div key={i} style={{flex: 1, height: 14 + v * (height - 14), borderRadius: 6, background: i % 7 === 3 ? theme.accent2 : theme.accent}} />;
      })}
    </div>
  );
};

const SceneShow: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ep = spring({frame, fps, config: {damping: 15, stiffness: 130}});
  const title = interpolate(frame, [12, 34], [0, 1], {...clamp, easing: easeOut});
  const host = interpolate(frame, [36, 54], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 16, padding: '14px 24px', borderRadius: 8, background: theme.accent, color: theme.background, fontFamily: MONO_FONT, fontSize: 28, fontWeight: 750, transform: `translateX(${(1 - ep) * -400}px)`}}>
        <div style={{width: 16, height: 16, borderRadius: '50%', background: theme.background, opacity: frame % 30 < 18 ? 1 : 0.3}} />
        <span data-text-role="point1" style={{display: 'contents'}}>{texts.point1}</span>
      </div>
      <div style={{marginTop: 70, fontFamily: DISPLAY, fontSize: fit(texts.brand, 150, S - PAD * 2, 0.66), lineHeight: 0.95, fontWeight: 900, color: theme.foreground, clipPath: `inset(0 ${(1 - title) * 100}% 0 0)`}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{marginTop: 34, fontSize: wrapFit(texts.headline, 64, S - PAD * 2, 2, 0.56), lineHeight: 1.1, fontWeight: 700, color: `${theme.foreground}cc`, opacity: host, transform: `translateY(${(1 - host) * 24}px)`}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{texts.headline}</span>
      </div>
      <Wave theme={theme} />
    </AbsoluteFill>
  );
};

const SceneTopic: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.subhead.split(' ');
  const size = wrapFit(texts.subhead, 92, S - PAD * 2, 4, 0.56);
  const tag = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 30, fontWeight: 700, color: theme.accent2, textTransform: 'uppercase', opacity: tag}}>
        <span data-text-role="point2" style={{display: 'contents'}}>{texts.point2}</span>
      </div>
      <div style={{marginTop: 50, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.24, fontSize: size, lineHeight: 1.08, fontWeight: 820, color: theme.foreground}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{words.map((w, i) => {
          const t = interpolate(frame - 6 - i * 3, [0, 14], [0, 1], {...clamp, easing: easeOut});
          return <span key={i} style={{display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>{w}</span>;
        })}</span>
      </div>
      <Wave theme={theme} bars={60} height={120} />
    </AbsoluteFill>
  );
};

const SceneListen: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const disc = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const cta = interpolate(frame, [14, 30], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 50}}>
      <div style={{width: 300, height: 300, borderRadius: '50%', background: `repeating-radial-gradient(circle, ${theme.surface} 0 10px, ${theme.background} 10px 14px)`, border: `10px solid ${theme.accent}`, transform: `scale(${disc}) rotate(${frame * 4}deg)`, display: 'grid', placeItems: 'center'}}>
        <div style={{width: 90, height: 90, borderRadius: '50%', background: theme.accent}} />
      </div>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 110, S - PAD * 2, 0.66), fontWeight: 900, color: theme.foreground}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{padding: '20px 40px', borderRadius: 8, background: theme.foreground, color: theme.background, fontSize: fit(texts.cta, 42, 700, 0.56), fontWeight: 800, opacity: cta}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Podcast: React.FC<PodcastProps> = (props) => (
  <AbsoluteFill style={{width: S, height: S, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={podcastMeta} scenes={[SceneShow, SceneTopic, SceneListen]} props={props} />
  </AbsoluteFill>
);
