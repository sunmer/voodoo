import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeIn, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {announcementMeta} from './meta';
import type {AnnouncementProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
type P = SceneProps<AnnouncementProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Nested frames rush toward the camera, then the headline punches in at the center.
const SceneTunnel: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.headline.toUpperCase().split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 260, W - PAD * 2, 0.78), wrapFit(texts.headline.toUpperCase(), 260, W - PAD * 2, 2, 0.74, 70));
  const punch = spring({frame: frame - 44, fps, config: {damping: 11, stiffness: 140}});
  const brand = interpolate(frame, [56, 74], [0, 1], {...clamp, easing: easeOut});
  const colors = [theme.accent, theme.surface, theme.accent2, theme.foreground];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {Array.from({length: 9}, (_, i) => {
        const z = ((frame * 1.6 + i * 22) % 198) / 198;
        const s = interpolate(z, [0, 1], [0.04, 2.6], {easing: easeIn});
        const fade = interpolate(z, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
        return <div key={i} style={{position: 'absolute', width: W * 0.6, height: H * 0.6, border: `${18 / Math.max(s, 0.3)}px solid ${colors[i % 4]}`,
          transform: `scale(${s}) rotate(${i % 2 ? 2 : -2}deg)`, opacity: fade * 0.9}} />;
      })}
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle, ${theme.background} 30%, ${theme.background}00 70%)`, opacity: punch}} />
      <div style={{position: 'relative', textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, fontWeight: 900, color: theme.foreground,
        transform: `scale(${0.2 + punch * 0.8})`, opacity: Math.min(1, punch * 2)}}>
        <Role role="headline">{texts.headline.toUpperCase()}</Role>
      </div>
      <div style={{position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center', fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, 900, 0.62),
        fontWeight: 700, letterSpacing: 0, color: theme.accent, textTransform: 'uppercase', opacity: brand}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneDetail: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bar = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [8, 30], [0, 1], {...clamp, easing: easeOut});
  const cta = spring({frame: frame - 26, fps, config: {damping: 13, stiffness: 150}});
  const words = texts.subhead.split(/\s+/);
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `inset(0 ${(1 - bar) * 100}% 0 0)`, padding: PAD, justifyContent: 'center', gap: 80}}>
      <div style={{maxWidth: W - PAD * 2 - 200, fontFamily: DISPLAY, fontSize: wrapFit(texts.subhead, 120, W - PAD * 2 - 200, 3, 0.56, 50), lineHeight: 1.04,
        fontWeight: 850, color: theme.background}}>
        <Role role="subhead">{words.map((w, i) => {
          const t = interpolate(frame - 8 - i * 3, [0, 16], [0, 1], {...clamp, easing: easeOut});
          return <span key={i} style={{display: 'inline-block', marginRight: '0.25em', opacity: Math.min(sub * 2, t), transform: `translateY(${(1 - t) * 40}px)`}}>{w}</span>;
        })}</Role>
      </div>
      <div style={{alignSelf: 'flex-start', height: 120, display: 'flex', alignItems: 'center', gap: 22, padding: '0 56px', borderRadius: 60, background: theme.background,
        color: theme.foreground, fontSize: fit(texts.cta, 52, 700, 0.56), fontWeight: 800, whiteSpace: 'nowrap', transform: `scale(${cta})`, transformOrigin: 'left center'}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={46} />
      </div>
      <div style={{position: 'absolute', right: PAD, bottom: PAD, width: 180, height: 180, display: 'grid', placeItems: 'center'}}>
        {[0, 1, 2].map((r) => {
          const p = ((frame + r * 20) % 60) / 60;
          return <div key={r} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${theme.background}`, transform: `scale(${0.3 + p})`, opacity: 1 - p}} />;
        })}
        <div style={{width: 44, height: 44, borderRadius: '50%', background: theme.accent2}} />
      </div>
    </AbsoluteFill>
  );
};

export const Announcement: React.FC<AnnouncementProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={announcementMeta} scenes={[SceneTunnel, SceneDetail]} props={props} />
  </AbsoluteFill>
);
