import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {portraitcardAssets} from './assets';
import {portraitcardFiles} from './assets/files';
import {portraitcardMeta} from './meta';
import type {PortraitcardProps} from './schema';

loadTemplateFonts();

const W = 1080;
const PAD = 90;
const INNER = W - PAD * 2;
const PHOTO_TOP = 170;
const PHOTO_H = 920;
const TEXT_TOP = 1140;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Words rise one by one from under a mask.
const MaskName: React.FC<{text: string; size: number; color: string; delay: number}> = ({text, size, color, delay}) => {
  const frame = useCurrentFrame();
  const words = text.trim().split(/\s+/);
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.24}px`, width: INNER}}>
      {words.map((w, i) => {
        const y = interpolate(frame - delay - i * 5, [0, 24], [110, 0], {...clamp, easing: easeOut});
        return (
          <span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: size * 0.08}}>
            <span style={{display: 'inline-block', fontSize: size, fontWeight: 900, lineHeight: 1, color, letterSpacing: '-0.02em', transform: `translateY(${y}%)`}}>
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const SceneProfile: React.FC<PortraitcardProps> = ({texts, theme, media}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const asset = portraitcardAssets.find((a) => a.id === media.photo)!;

  const rise = spring({frame: frame - 4, fps, config: {damping: 18, stiffness: 70, mass: 1}});
  const back = spring({frame: frame - 12, fps, config: {damping: 16, stiffness: 60, mass: 1}});
  const reveal = interpolate(frame, [4, 40], [0, 1], {...clamp, easing: easeInOut});
  // Parallax: the photo travels slower than its frame and keeps drifting after it lands.
  const frameY = interpolate(rise, [0, 1], [320, 0]);
  const photoY = interpolate(frame, [0, 210], [-90, 30]) + frameY * -0.35;
  const zoom = interpolate(frame, [0, 210], [1.18, 1.06], clamp);
  const brandIn = interpolate(frame, [10, 34], [0, 1], {...clamp, easing: easeOut});
  const attrIn = interpolate(frame, [48, 74], [0, 1], {...clamp, easing: easeOut});
  const ring = interpolate(frame, [0, 210], [-4, -2]);

  const nameSize = wrapFit(texts.author, 104, INNER, 2, 0.6, 44);
  const attrSize = wrapFit(texts.attribution, 40, INNER - 70, 2, 0.52, 24);

  return (
    <AbsoluteFill>
      {/* Brand */}
      <div style={{position: 'absolute', top: 72, left: PAD, right: PAD, display: 'flex', alignItems: 'center', gap: 18, opacity: brandIn,
        transform: `translateY(${(1 - brandIn) * -20}px)`}}>
        <div style={{width: 18, height: 18, borderRadius: 999, background: theme.accent}} />
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 30, INNER - 200, 0.62), fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: theme.foreground, whiteSpace: 'nowrap'}}>
          <Role role="brand">{texts.brand}</Role>
        </div>
        <div style={{flex: 1, height: 2, background: `${theme.foreground}33`}} />
      </div>

      {/* Offset accent plate behind the photo */}
      <div style={{position: 'absolute', left: PAD + 26, top: PHOTO_TOP + 30, width: INNER, height: PHOTO_H, borderRadius: 72,
        background: theme.accent2, transform: `translateY(${interpolate(back, [0, 1], [420, 0])}px) rotate(${ring}deg)`, opacity: 0.9}} />

      {/* Photo frame */}
      <div style={{position: 'absolute', left: PAD, top: PHOTO_TOP, width: INNER, height: PHOTO_H, borderRadius: 72, overflow: 'hidden',
        background: theme.surface, transform: `translateY(${frameY}px)`, clipPath: `inset(${(1 - reveal) * 100}% 0 0 0 round 72px)`,
        boxShadow: '0 40px 80px rgba(0,0,0,0.35)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: -60, height: PHOTO_H + 120, transform: `translateY(${photoY}px) scale(${zoom})`}}>
          <Img src={portraitcardFiles[media.photo]} alt={asset.label} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, borderRadius: 72, boxShadow: `inset 0 0 0 3px ${theme.foreground}22`}} />
      </div>

      {/* Name and role */}
      <div style={{position: 'absolute', top: TEXT_TOP, left: PAD, width: INNER, display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{fontFamily: DISPLAY}}>
          <Role role="author"><MaskName text={texts.author} size={nameSize} color={theme.foreground} delay={30} /></Role>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 22, opacity: attrIn, transform: `translateX(${(1 - attrIn) * -40}px)`}}>
          <div style={{width: 48 * attrIn, height: 4, marginTop: attrSize * 0.6, background: theme.accent, flexShrink: 0}} />
          <div style={{fontFamily: SANS_FONT, fontSize: attrSize, fontWeight: 500, lineHeight: 1.2, color: theme.foreground, opacity: 0.85}}>
            <Role role="attribution">{texts.attribution}</Role>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneQuote: React.FC<PortraitcardProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 16, stiffness: 90}});
  const words = interpolate(frame, [14, 46], [0, 1], {...clamp, easing: easeOut});
  const bar = interpolate(frame, [10, 50], [0, 1], {...clamp, easing: easeInOut});
  const size = wrapFit(texts.quote, 50, INNER - 150, 4, 0.5, 26);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: TEXT_TOP + 230, borderRadius: 40, background: theme.surface, overflow: 'hidden',
        padding: '44px 52px 44px 110px', transform: `translateX(${interpolate(s, [0, 1], [1000, 0])}px)`, boxShadow: '0 24px 60px rgba(0,0,0,0.25)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: theme.accent, transformOrigin: 'top', transform: `scaleY(${bar})`}} />
        <div style={{position: 'absolute', left: 34, top: 18, fontFamily: SERIF_FONT, fontSize: 130, fontWeight: 800, lineHeight: 1, color: theme.accent}}>
          {'\u201C'}
        </div>
        <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: size, fontWeight: 500, lineHeight: 1.3, color: theme.foreground,
          clipPath: `inset(0 0 ${(1 - words) * 100}% 0)`, opacity: 0.3 + words * 0.7}}>
          <Role role="quote">{texts.quote}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene timing comes from meta.ts so metadata and render agree.
const SCENES: React.FC<PortraitcardProps>[] = [SceneProfile, SceneQuote];

export const Portraitcard: React.FC<PortraitcardProps> = (props) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 210], [0, 1]);
  return (
    <AbsoluteFill style={{background: props.theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -300, top: 600 - glow * 120, width: 900, height: 900, borderRadius: 999,
        background: `radial-gradient(circle, ${props.theme.accent}26 0%, transparent 65%)`}} />
      <div style={{position: 'absolute', right: -360, top: -200 + glow * 80, width: 900, height: 900, borderRadius: 999,
        background: `radial-gradient(circle, ${props.theme.accent2}22 0%, transparent 65%)`}} />
      {portraitcardMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
