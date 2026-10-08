import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {hiringMeta} from './meta';
import type {HiringProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<HiringProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneHook: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.headline.toUpperCase().split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 220, W - PAD * 2, 0.84), 800 / (words.length * 0.92));
  const stamp = spring({frame: frame - 40, fps, config: {damping: 9, stiffness: 190}});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 34, 600, 0.62), fontWeight: 700, color: theme.accent, textTransform: 'uppercase', opacity: interpolate(frame, [0, 12], [0, 1], clamp)}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 200, fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, fontWeight: 900, color: theme.foreground}}>
        <Role role="headline">{words.map((w, i) => {
          const t = interpolate(frame - 6 - i * 7, [0, 18], [0, 1], {...clamp, easing: easeOut});
          return <div key={i} style={{overflow: 'hidden'}}><div style={{transform: `translateY(${(1 - t) * 105}%)`}}>{w}</div></div>;
        })}</Role>
      </div>
      <div style={{position: 'absolute', right: PAD, top: 170, width: 230, height: 230, borderRadius: '50%', background: theme.accent, color: theme.background,
        display: 'grid', placeItems: 'center', transform: `scale(${stamp}) rotate(${(1 - stamp) * -90 - 18}deg)`}}>
        <div style={{width: 120, height: 120, position: 'relative'}}>
          <div style={{position: 'absolute', left: 50, top: 0, width: 20, height: 120, background: theme.background}} />
          <div style={{position: 'absolute', top: 50, left: 0, height: 20, width: 120, background: theme.background}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneRoles: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = parseList(texts.items);
  const row = Math.min(170, 820 / items.length);
  const longest = items.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 78, W - PAD * 2 - 180, 0.6), row * 0.48);
  return (
    <AbsoluteFill style={{padding: PAD, paddingTop: 120}}>
      <div style={{fontSize: wrapFit(texts.subhead, 46, W - PAD * 2, 2, 0.55, 28), lineHeight: 1.2, fontWeight: 650, color: `${theme.foreground}bb`, maxWidth: W - PAD * 2,
        opacity: interpolate(frame, [0, 14], [0, 1], clamp)}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
      <div style={{marginTop: 60}}>
        <Role role="items">{items.map((item, i) => {
          const t = interpolate(frame - 10 - i * 8, [0, 20], [0, 1], {...clamp, easing: easeOut});
          const line = interpolate(frame - 10 - i * 8, [0, 26], [0, 1], {...clamp, easing: easeInOut});
          return (
            <div key={i} style={{height: row, position: 'relative', display: 'flex', alignItems: 'center', gap: 40}}>
              <div style={{position: 'absolute', left: 0, bottom: 0, height: 3, width: `${line * 100}%`, background: `${theme.foreground}33`}} />
              <span style={{fontFamily: MONO_FONT, fontSize: 28, fontWeight: 700, color: theme.accent, width: 60, flex: 'none', opacity: t}}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{fontFamily: DISPLAY, fontSize: size, fontWeight: 850, color: theme.foreground, whiteSpace: 'nowrap', minWidth: 0, opacity: t, transform: `translateX(${(1 - t) * 120}px)`}}>{item}</span>
              <span style={{marginLeft: 'auto', flex: 'none', color: theme.accent2, opacity: t}}><ArrowIcon size={44} /></span>
            </div>
          );
        })}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneApply: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wipe = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeInOut});
  const cta = spring({frame: frame - 14, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `circle(${wipe * 120}% at 85% 20%)`, justifyContent: 'center', alignItems: 'center', gap: 70, padding: PAD}}>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.date, 64, W - PAD * 2, 0.62), fontWeight: 800, color: theme.background, textTransform: 'uppercase', textAlign: 'center'}}>
        <Role role="date">{texts.date}</Role>
      </div>
      <div style={{height: 120, display: 'flex', alignItems: 'center', gap: 22, padding: '0 54px', borderRadius: 60, background: theme.background, color: theme.foreground,
        fontSize: fit(texts.cta, 50, 700, 0.56), fontWeight: 800, transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={44} />
      </div>
    </AbsoluteFill>
  );
};

export const Hiring: React.FC<HiringProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={hiringMeta} scenes={[SceneHook, SceneRoles, SceneApply]} props={props} />
  </AbsoluteFill>
);
