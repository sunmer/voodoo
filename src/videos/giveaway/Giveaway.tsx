import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {giveawayMeta} from './meta';
import type {GiveawayProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1080;
const PAD = 80;
type P = SceneProps<GiveawayProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneHook: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headline = texts.headline.toUpperCase();
  const size = wrapFit(headline, 150, W - PAD * 2, 2, 0.8, 44);
  const box = spring({frame: frame - 4, fps, config: {damping: 12, stiffness: 140}});
  const lid = spring({frame: frame - 26, fps, config: {damping: 8, stiffness: 160}});
  const words = headline.split(/\s+/);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <AbsoluteFill style={{opacity: 0.22, background: `repeating-conic-gradient(from ${frame * 0.5}deg at 50% 78%, ${theme.accent} 0deg 9deg, transparent 9deg 18deg)`}} />
      <div style={{marginTop: 70, padding: '14px 30px', borderRadius: 40, background: theme.foreground, color: theme.background, fontSize: fit(texts.brand, 34, 560, 0.62), fontWeight: 800,
        opacity: interpolate(frame, [0, 10], [0, 1], clamp)}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{marginTop: 40, width: W - PAD * 2, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 0.98, color: theme.foreground}}>
        <Role role="headline">{words.map((w, i) => {
          const s = spring({frame: frame - 30 - i * 4, fps, config: {damping: 10, stiffness: 180}});
          return <span key={i} style={{display: 'inline-block', margin: `0 ${size * 0.12}px`, transform: `scale(${s}) rotate(${(1 - s) * (i % 2 ? 14 : -14)}deg)`}}>{w}</span>;
        })}</Role>
      </div>
      <div style={{position: 'absolute', bottom: 70, left: W / 2 - 170, width: 340, height: 230, transform: `translateY(${(1 - box) * 400}px)`}}>
        <div style={{position: 'absolute', inset: 0, top: 30, background: theme.accent, borderRadius: 14}} />
        <div style={{position: 'absolute', top: 30, bottom: 0, left: 145, width: 50, background: theme.accent2}} />
        <div style={{position: 'absolute', left: -20, right: -20, top: 0, height: 74, background: theme.accent, borderRadius: 14, filter: 'brightness(1.12)',
          transformOrigin: '0% 100%', transform: `translateY(${-lid * 120}px) rotate(${-lid * 16}deg)`}}>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: 165, width: 50, background: theme.accent2}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneSteps: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = parseList(texts.items);
  const row = Math.min(150, 860 / items.length);
  const longest = items.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(wrapFit(longest, 58, W - PAD * 2 - 170, 2, 0.55, 22), row * 0.34);
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 14}}>
      <Role role="items">{items.map((item, i) => {
        const t = interpolate(frame - 4 - i * 9, [0, 16], [0, 1], {...clamp, easing: easeOut});
        const tick = interpolate(frame - 18 - i * 9, [0, 14], [0, 1], clamp);
        return (
          <div key={i} style={{height: row - 14, display: 'flex', alignItems: 'center', gap: 34, padding: '0 34px', borderRadius: 8, background: theme.surface,
            opacity: t, transform: `translateY(${(1 - t) * 60}px)`}}>
            <svg width={Math.min(76, row * 0.55)} height={Math.min(76, row * 0.55)} viewBox="0 0 40 40" style={{flex: 'none'}}>
              <circle cx={20} cy={20} r={18} fill={tick > 0 ? theme.accent : 'none'} stroke={theme.accent} strokeWidth={3} />
              <path d="M11 21l6 6 12-13" fill="none" stroke={theme.background} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - tick)} />
            </svg>
            <span style={{fontSize: size, lineHeight: 1.15, fontWeight: 750, color: theme.foreground, minWidth: 0, overflowWrap: 'anywhere'}}>{item}</span>
          </div>
        );
      })}</Role>
    </AbsoluteFill>
  );
};

const COLORS = ['accent', 'accent2', 'foreground', 'surface'] as const;

const SceneDeadline: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const banner = spring({frame, fps, config: {damping: 11, stiffness: 150}});
  const cta = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: theme.background, justifyContent: 'center', alignItems: 'center', gap: 80}}>
      {Array.from({length: 70}, (_, i) => {
        const x = random(`gx${i}`) * W;
        const y = -60 + ((random(`gy${i}`) * H + frame * (5 + random(`gv${i}`) * 6)) % (H + 80));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 16, height: 28, borderRadius: 3, background: theme[COLORS[i % 4]],
          transform: `rotate(${frame * (4 + i % 7) + i * 40}deg)`, opacity: 0.85}} />;
      })}
      <div style={{padding: '34px 56px', background: theme.accent, color: theme.background, borderRadius: 8, transform: `rotate(-4deg) scale(${banner})`, maxWidth: W - PAD * 2,
        fontFamily: DISPLAY, fontWeight: 900, fontSize: fit(texts.date.toUpperCase(), 84, W - PAD * 2 - 112, 0.68), textTransform: 'uppercase', textAlign: 'center'}}>
        <Role role="date">{texts.date}</Role>
      </div>
      <div style={{height: 112, display: 'flex', alignItems: 'center', gap: 20, padding: '0 50px', borderRadius: 56, background: theme.foreground, color: theme.background,
        fontSize: fit(texts.cta, 48, 640, 0.56), fontWeight: 800, transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={42} />
      </div>
    </AbsoluteFill>
  );
};

export const Giveaway: React.FC<GiveawayProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={giveawayMeta} scenes={[SceneHook, SceneSteps, SceneDeadline]} props={props} />
  </AbsoluteFill>
);
