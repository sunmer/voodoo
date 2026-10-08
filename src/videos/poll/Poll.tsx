import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {pollMeta} from './meta';
import type {PollProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1080;
const PAD = 80;
type P = SceneProps<PollProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneAsk: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 11, stiffness: 140}});
  const words = texts.headline.split(/\s+/);
  const size = wrapFit(texts.headline, 160, W - PAD * 2, 3, 0.7, 56);
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div style={{position: 'absolute', top: 120, display: 'flex', gap: 22}}>
        {[theme.accent, theme.accent2].map((c, i) => (
          <div key={i} style={{width: 70, height: 70, borderRadius: '50%', background: c, transform: `translateX(${(1 - s) * (i ? 300 : -300)}px)`}} />
        ))}
      </div>
      <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.98, fontWeight: 900, color: theme.foreground, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.25}}>
        <Role role="headline">{words.map((w, i) => {
          const t = spring({frame: frame - 4 - i * 4, fps, config: {damping: 12, stiffness: 160}});
          return <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - t) * 60}px) rotate(${(1 - t) * (i % 2 ? 8 : -8)}deg)`, opacity: Math.min(1, t * 2)}}>{w}</span>;
        })}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneVersus: React.FC<P> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cut = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeInOut});
  const vs = spring({frame: frame - 18, fps, config: {damping: 8, stiffness: 200}});
  // Decorative vote split, stable for the same pair of options.
  const share = Math.round(52 + random(`${texts.point1}|${texts.point2}`) * 20);
  const vote = interpolate(frame, [30, duration - 40], [0, 1], {...clamp, easing: easeOut});
  const left = Math.round(share * vote);
  const right = Math.round((100 - share) * vote);
  const size = (t: string) => wrapFit(t.toUpperCase(), 104, 400, 2, 0.66, 40);
  const k = Math.min(size(texts.point1), size(texts.point2));
  const slant = 120;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: theme.accent, clipPath: `polygon(0 0, ${(W / 2 + slant) * cut}px 0, ${(W / 2 - slant) * cut}px ${H}px, 0 ${H}px)`}} />
      <AbsoluteFill style={{background: theme.accent2, clipPath: `polygon(${W - (W / 2 - slant) * cut}px 0, ${W}px 0, ${W}px ${H}px, ${W - (W / 2 + slant) * cut}px ${H}px)`}} />
      <div style={{position: 'absolute', left: PAD - 20, top: 300, width: 420, fontFamily: DISPLAY, fontSize: k, lineHeight: 1, fontWeight: 900, color: theme.background, textTransform: 'uppercase',
        opacity: cut, transform: `translateX(${(1 - cut) * -200}px)`}}>
        <Role role="point1">{texts.point1}</Role>
      </div>
      <div style={{position: 'absolute', right: PAD - 20, bottom: 300, width: 420, textAlign: 'right', fontFamily: DISPLAY, fontSize: k, lineHeight: 1, fontWeight: 900, color: theme.background, textTransform: 'uppercase',
        opacity: cut, transform: `translateX(${(1 - cut) * 200}px)`}}>
        <Role role="point2">{texts.point2}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD - 20, bottom: 110, fontFamily: MONO_FONT, fontSize: 92, fontWeight: 800, color: theme.background, opacity: vote > 0 ? 1 : 0}}>{left}%</div>
      <div style={{position: 'absolute', right: PAD - 20, top: 110, fontFamily: MONO_FONT, fontSize: 92, fontWeight: 800, color: theme.background, opacity: vote > 0 ? 1 : 0}}>{right}%</div>
      <div style={{position: 'absolute', left: W / 2 - 110, top: H / 2 - 110, width: 220, height: 220, borderRadius: '50%', background: theme.foreground, color: theme.background,
        border: `10px solid ${theme.background}`, display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontSize: 104, fontWeight: 900, fontStyle: 'italic',
        transform: `scale(${vs}) rotate(${(1 - vs) * 180 - 8}deg)`}}>VS</div>
    </AbsoluteFill>
  );
};

const SceneVote: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const tap = spring({frame: frame - 14, fps, config: {damping: 10, stiffness: 160}});
  const pulse = 1 + Math.max(0, Math.sin((frame - 30) / 6)) * 0.05 * (frame > 30 ? 1 : 0);
  return (
    <AbsoluteFill style={{background: theme.background, justifyContent: 'center', alignItems: 'center', gap: 60, padding: PAD}}>
      <div style={{display: 'flex', gap: 30, opacity: t}}>
        {[texts.point1, texts.point2].map((_, i) => (
          <div key={i} style={{width: 120, height: 16, borderRadius: 8, background: i ? theme.accent2 : theme.accent, transform: `scaleX(${t})`}} />
        ))}
      </div>
      <div style={{padding: '34px 60px', borderRadius: 8, background: theme.foreground, color: theme.background, fontFamily: DISPLAY, whiteSpace: 'nowrap',
        fontSize: fit(texts.cta.toUpperCase(), 80, W - PAD * 2 - 120, 0.74), fontWeight: 900, textTransform: 'uppercase', transform: `scale(${tap * pulse})`}}>
        <Role role="cta">{texts.cta}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Poll: React.FC<PollProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={pollMeta} scenes={[SceneAsk, SceneVersus, SceneVote]} props={props} />
  </AbsoluteFill>
);
