import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SERIF_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {birthdayMeta} from './meta';
import type {BirthdayProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1080;
const PAD = 80;
type P = SceneProps<BirthdayProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Balloons: React.FC<{colors: string[]}> = ({colors}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 9}, (_, i) => {
        const x = 40 + random(`bx${i}`) * 980;
        const y = 1180 - frame * (3 + random(`bs${i}`) * 4) + random(`by${i}`) * 320;
        return (
          <div key={i} style={{position: 'absolute', left: x + Math.sin(frame / 18 + i) * 22, top: y}}>
            <div style={{width: 92, height: 112, borderRadius: '50% 50% 48% 48%', background: colors[i % colors.length]}} />
            <div style={{width: 2, height: 120, marginLeft: 45, background: `${colors[i % colors.length]}aa`}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneWish: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.headline.split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 170, W - PAD * 2, 0.68), 610 / (words.length * 0.95));
  const name = spring({frame: frame - 52, fps, config: {damping: 8, stiffness: 160}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: PAD, textAlign: 'center'}}>
      <Balloons colors={[theme.accent, theme.accent2, theme.surface]} />
      <div style={{position: 'relative', fontFamily: DISPLAY, fontSize: size, lineHeight: 0.95, fontWeight: 900, color: theme.foreground}}>
        <Role role="headline">{words.map((w, i) => {
          const t = spring({frame: frame - 6 - i * 8, fps, config: {damping: 9, stiffness: 150}});
          return <div key={i} style={{transform: `translateY(${(1 - t) * 140}px) rotate(${(i % 2 ? 3 : -3) * t}deg)`}}>{w}</div>;
        })}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 46, padding: '20px 46px', borderRadius: 8, background: theme.accent, color: theme.background, transform: `scale(${name}) rotate(-4deg)`,
        fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: fit(texts.author, 76, W - PAD * 2 - 100, 0.52), fontWeight: 700}}>
        <Role role="author">{texts.author}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneCake: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: easeOut});
  const flame = 1 + Math.sin(frame * 0.7) * 0.12;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: PAD, textAlign: 'center'}}>
      <div style={{marginTop: 70, fontFamily: DISPLAY, fontSize: fit(texts.date, 64, W - PAD * 2, 0.62), fontWeight: 900, color: theme.accent2, textTransform: 'uppercase', opacity: t}}>
        <Role role="date">{texts.date}</Role>
      </div>
      <div style={{position: 'relative', width: 520, height: 390, marginTop: 70, transform: `translateY(${(1 - t) * 300}px)`}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 130, top: 0, width: 26, height: 100, borderRadius: 8, background: theme.foreground}}>
          <div style={{position: 'absolute', left: -7, top: -52, width: 40, height: 52, borderRadius: '50% 50% 45% 45%', background: theme.accent2, transform: `scale(${flame})`}} />
        </div>)}
        <div style={{position: 'absolute', left: 0, right: 0, top: 100, height: 290, borderRadius: 8, background: theme.accent, overflow: 'hidden'}}>
          <div style={{height: 60, background: theme.foreground, borderRadius: '0 0 30px 30px'}} />
        </div>
      </div>
      <div style={{marginTop: 54, fontSize: wrapFit(texts.subhead, 48, W - PAD * 2, 2, 0.54, 28), lineHeight: 1.2, fontWeight: 650, color: theme.foreground, opacity: interpolate(frame, [26, 44], [0, 1], clamp)}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Birthday: React.FC<BirthdayProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={birthdayMeta} scenes={[SceneWish, SceneCake]} props={props} />
  </AbsoluteFill>
);
