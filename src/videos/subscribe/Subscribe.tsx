import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {subscribeMeta} from './meta';
import type {SubscribeProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<SubscribeProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Bell: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
  </svg>
);

const Pointer: React.FC = () => (
  <svg width="82" height="82" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2 4 7-3 1.4-4-7-5 4z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /></svg>
);

const ScenePress: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame, fps, config: {damping: 15, stiffness: 120}});
  const move = interpolate(frame, [26, 70], [0, 1], {...clamp, easing: easeInOut});
  const press = interpolate(frame, [72, 78, 86], [1, 0.9, 1], clamp);
  const done = frame >= 78;
  const bell = frame >= 104 ? Math.sin((frame - 104) * 0.8) * interpolate(frame, [104, 132], [24, 0], clamp) : 0;
  const rings = interpolate(frame, [78, 120], [0, 1], {...clamp, easing: easeOut});
  const cursorX = interpolate(move, [0, 1], [1560, 1135]);
  const cursorY = interpolate(move, [0, 1], [920, 590]) + (frame >= 72 && frame < 86 ? 8 : 0);
  const bellX = interpolate(frame, [88, 104], [1135, 1385], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 175, fontFamily: DISPLAY, fontSize: fit(texts.headline, 76, 1500, 0.62), fontWeight: 900, color: theme.foreground,
        opacity: interpolate(frame, [4, 18], [0, 1], clamp), transform: `translateY(${(1 - card) * -40}px)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{width: 1300, height: 430, borderRadius: 8, background: theme.surface, display: 'flex', alignItems: 'center', gap: 46, padding: '0 70px',
        transform: `translateY(${(1 - card) * 300}px)`, opacity: card, boxShadow: '0 40px 100px #0008'}}>
        <div style={{width: 170, height: 170, flex: 'none', borderRadius: '50%', background: theme.accent2, color: theme.background, display: 'grid', placeItems: 'center',
          fontFamily: DISPLAY, fontSize: 84, fontWeight: 900}}>{texts.brand.trim().charAt(0).toUpperCase()}</div>
        <div style={{minWidth: 0, flex: 1}}>
          <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 66, 500, 0.62), fontWeight: 900, color: theme.foreground}}><Role role="brand">{texts.brand}</Role></div>
          <div style={{marginTop: 12, fontSize: wrapFit(texts.subhead, 34, 500, 2, 0.53, 22), lineHeight: 1.2, color: `${theme.foreground}aa`}}><Role role="subhead">{texts.subhead}</Role></div>
        </div>
        <div style={{position: 'relative', width: 390, height: 112, flex: 'none', transform: `scale(${press})`}}>
          <div style={{position: 'absolute', inset: -40 * rings, borderRadius: 60, border: `5px solid ${theme.accent}`, opacity: done ? 1 - rings : 0}} />
          <div style={{height: '100%', borderRadius: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, background: done ? `${theme.foreground}22` : theme.accent,
            color: theme.foreground, fontSize: fit(texts.cta, 40, done ? 270 : 330, 0.58), fontWeight: 850, whiteSpace: 'nowrap'}}>
            {done && <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>}
            <Role role="cta">{texts.cta}</Role>
          </div>
        </div>
        <div style={{width: 112, height: 112, flex: 'none', borderRadius: '50%', display: 'grid', placeItems: 'center', background: frame >= 104 ? theme.accent : `${theme.foreground}22`,
          color: frame >= 104 ? theme.background : theme.foreground, transform: `rotate(${bell}deg)`}}><Bell size={54} /></div>
      </div>
      <div style={{position: 'absolute', left: frame < 88 ? cursorX : bellX, top: frame < 88 ? cursorY : 590, opacity: interpolate(frame, [20, 30, 140, 160], [0, 1, 1, 0], clamp)}}><Pointer /></div>
    </AbsoluteFill>
  );
};

export const Subscribe: React.FC<SubscribeProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={subscribeMeta} scenes={[ScenePress]} props={props} />
  </AbsoluteFill>
);
