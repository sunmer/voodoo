import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {newyearMeta} from './meta';
import type {NewyearProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
type P = SceneProps<NewyearProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneCount: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const index = Math.min(4, Math.floor(frame / 28));
  const label = ['5', '4', '3', '2', '1'][index];
  const local = frame - index * 28;
  const pop = spring({frame: local, fps, config: {damping: 11, stiffness: 170}});
  const ring = interpolate(local, [0, 27], [0, 1], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: PAD}}>
      <div style={{marginTop: 70, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 38, W - PAD * 2, 0.62), fontWeight: 700, letterSpacing: 0, color: theme.accent2, textTransform: 'uppercase'}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', top: 470, width: 720, height: 720, borderRadius: '50%',
        background: `conic-gradient(${theme.accent} ${ring * 360}deg, ${theme.surface} 0deg)`, display: 'grid', placeItems: 'center'}}>
        <div style={{width: 650, height: 650, borderRadius: '50%', background: theme.background, display: 'grid', placeItems: 'center'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 470, fontWeight: 900, lineHeight: 1, color: theme.foreground, transform: `scale(${1.5 - pop * 0.5})`, opacity: Math.min(1, pop * 1.4)}}>{label}</div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 260, left: PAD, right: PAD, textAlign: 'center', fontFamily: MONO_FONT, fontSize: fit(texts.date, 58, W - PAD * 2, 0.62), fontWeight: 800,
        color: theme.foreground, textTransform: 'uppercase', opacity: interpolate(frame, [10, 30], [0, 1], clamp)}}>
        <Role role="date">{texts.date}</Role>
      </div>
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{colors: string[]}> = ({colors}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 70}, (_, i) => {
        const x = random(`x${i}`) * W;
        const speed = 7 + random(`s${i}`) * 12;
        const y = -80 - random(`y${i}`) * 900 + frame * speed;
        const spin = frame * (4 + random(`r${i}`) * 9);
        return <div key={i} style={{position: 'absolute', left: x + Math.sin((frame + i * 9) / 12) * 40, top: y, width: 18, height: 34, borderRadius: 3,
          background: colors[i % colors.length], transform: `rotate(${spin}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};

const SceneCheer: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.headline.toUpperCase().split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 230, W - PAD * 2, 0.78), 980 / (words.length * 0.95));
  const flash = interpolate(frame, [0, 10], [1, 0], clamp);
  const cta = spring({frame: frame - 34, fps, config: {damping: 12, stiffness: 150}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: PAD, textAlign: 'center'}}>
      <Confetti colors={[theme.accent, theme.accent2, theme.foreground]} />
      <AbsoluteFill style={{background: theme.foreground, opacity: flash}} />
      <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.94, fontWeight: 900, color: theme.foreground}}>
        <Role role="headline">{words.map((w, i) => {
          const t = spring({frame: frame - 4 - i * 6, fps, config: {damping: 10, stiffness: 140}});
          return <div key={i} style={{transform: `scale(${t})`, color: i % 2 ? theme.accent : theme.foreground}}>{w}</div>;
        })}</Role>
      </div>
      <div style={{marginTop: 54, fontSize: wrapFit(texts.subhead, 54, W - PAD * 2, 2, 0.55, 30), lineHeight: 1.18, fontWeight: 650, color: theme.foreground,
        opacity: interpolate(frame, [20, 36], [0, 1], {...clamp, easing: easeOut})}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
      <div style={{marginTop: 70, padding: '30px 54px', borderRadius: 8, background: theme.accent2, color: theme.background, fontSize: fit(texts.cta, 50, 760, 0.58), fontWeight: 850,
        transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Newyear: React.FC<NewyearProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={newyearMeta} scenes={[SceneCount, SceneCheer]} props={props} exit="none" />
  </AbsoluteFill>
);
