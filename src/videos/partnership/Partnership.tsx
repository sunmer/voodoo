import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {partnershipMeta} from './meta';
import type {PartnershipProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1080;
const PAD = 80;
type P = SceneProps<PartnershipProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Two halves slide together; their circles orbit and merge into an overlapping pair.
const SceneMerge: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const close = interpolate(frame, [0, 34], [0, 1], {...clamp, easing: easeInOut});
  const join = spring({frame: frame - 30, fps, config: {damping: 13, stiffness: 110}});
  const text = interpolate(frame, [54, 76], [0, 1], {...clamp, easing: easeOut});
  const angle = (1 - join) * Math.PI;
  const R = 150;
  const gap = 110 * join + 260 * (1 - join);
  const cx = W / 2;
  const cy = 400;
  const dx = Math.cos(angle) * gap;
  const dy = Math.sin(angle) * gap * 0.5;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, width: W / 2, height: H, background: theme.surface, transform: `translateX(${(1 - close) * -100}%)`}} />
      <div style={{position: 'absolute', right: 0, top: 0, width: W / 2, height: H, background: theme.background, transform: `translateX(${(1 - close) * 100}%)`}} />
      <div style={{position: 'absolute', left: cx - dx - R, top: cy - dy - R, width: R * 2, height: R * 2, borderRadius: '50%', background: theme.accent, mixBlendMode: 'multiply', opacity: close}} />
      <div style={{position: 'absolute', left: cx + dx - R, top: cy + dy - R, width: R * 2, height: R * 2, borderRadius: '50%', background: theme.accent2, mixBlendMode: 'multiply', opacity: close}} />
      <div style={{position: 'absolute', left: cx - 30, top: cy - 30, width: 60, height: 60, display: 'grid', placeItems: 'center', opacity: join}}>
        <div style={{position: 'absolute', width: 60, height: 10, background: theme.background}} />
        <div style={{position: 'absolute', width: 10, height: 60, background: theme.background}} />
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 650, textAlign: 'center', opacity: text, transform: `translateY(${(1 - text) * 40}px)`}}>
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 34, W - PAD * 2, 0.62), fontWeight: 700, color: theme.foreground, textTransform: 'uppercase'}}>
          <Role role="brand">{texts.brand}</Role>
        </div>
        <div style={{marginTop: 26, fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 120, W - PAD * 2, 2, 0.62, 50), lineHeight: 0.98, fontWeight: 900, color: theme.foreground}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneDetails: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: easeInOut});
  const sub = interpolate(frame, [10, 32], [0, 1], {...clamp, easing: easeOut});
  const date = interpolate(frame, [22, 42], [0, 1], {...clamp, easing: easeOut});
  const cta = spring({frame: frame - 36, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{width: 60, height: 60, borderRadius: '50%', background: theme.accent, flex: 'none'}} />
        <div style={{height: 6, flex: 1, transform: `scaleX(${line})`, transformOrigin: 'left', background: theme.foreground}} />
        <div style={{width: 60, height: 60, borderRadius: '50%', background: theme.accent2, flex: 'none', opacity: line}} />
      </div>
      <div style={{marginTop: 70, fontSize: wrapFit(texts.subhead, 78, W - PAD * 2, 3, 0.54, 38), lineHeight: 1.12, fontWeight: 800, color: theme.foreground,
        opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
      <div style={{marginTop: 60, display: 'inline-flex', alignSelf: 'flex-start', padding: '14px 26px', border: `3px solid ${theme.foreground}`, borderRadius: 10,
        fontFamily: MONO_FONT, fontSize: fit(texts.date, 40, W - PAD * 2 - 60, 0.62), fontWeight: 700, color: theme.foreground, whiteSpace: 'nowrap', opacity: date}}>
        <Role role="date">{texts.date}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, bottom: PAD, height: 112, display: 'flex', alignItems: 'center', gap: 20, padding: '0 46px', borderRadius: 56,
        background: theme.accent, color: theme.background, fontSize: fit(texts.cta, 46, 640, 0.56), fontWeight: 800, whiteSpace: 'nowrap', transform: `scale(${cta})`, transformOrigin: 'left center'}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={40} />
      </div>
    </AbsoluteFill>
  );
};

export const Partnership: React.FC<PartnershipProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={partnershipMeta} scenes={[SceneMerge, SceneDetails]} props={props} />
  </AbsoluteFill>
);
