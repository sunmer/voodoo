import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme, ThemeRole} from '../contract';
import {ArrowIcon, Grain, LITE, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {liquidMeta} from './meta';
import type {LiquidProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const LOOP = 240;
const TAU = Math.PI * 2;

// Each blob is one radial layer of a single background. They overlap and blend
// into one continuous gradient field instead of reading as separate shapes.
type Blob = {color: ThemeRole; cx: number; cy: number; ax: number; ay: number; size: number; kx: number; ky: number; alpha: string};
const BLOBS: Blob[] = [
  {color: 'accent', cx: 28, cy: 32, ax: 16, ay: 14, size: 62, kx: 1, ky: 1, alpha: 'e6'},
  {color: 'accent2', cx: 74, cy: 64, ax: 18, ay: 16, size: 66, kx: 1, ky: 2, alpha: 'e6'},
  {color: 'surface', cx: 52, cy: 46, ax: 22, ay: 18, size: 58, kx: 2, ky: 1, alpha: 'd9'},
  {color: 'accent2', cx: 18, cy: 82, ax: 14, ay: 12, size: 52, kx: 1, ky: 1, alpha: 'bf'},
  {color: 'accent', cx: 84, cy: 16, ax: 12, ay: 14, size: 50, kx: 2, ky: 1, alpha: 'bf'},
];

const LiquidField: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const t = (frame / LOOP) * TAU;
  const layers = BLOBS.map((b, i) => {
    const p1 = random(`liquid-x-${i}`) * TAU;
    const p2 = random(`liquid-y-${i}`) * TAU;
    const p3 = random(`liquid-s-${i}`) * TAU;
    const x = b.cx + b.ax * Math.sin(t * b.kx + p1);
    const y = b.cy + b.ay * Math.cos(t * b.ky + p2);
    const rx = b.size + 10 * Math.sin(t + p3);
    const ry = b.size * 0.9 + 10 * Math.cos(t * 2 + p3);
    const c = theme[b.color];
    return `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, ${c}${b.alpha} 0%, ${c}66 38%, ${c}00 72%)`;
  });
  const sheenX = interpolate(frame, [0, LOOP], [-40, 140]);
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill style={{backgroundImage: layers.join(', ')}} />
      {/* Frosted layer: a milky veil plus soft light that drifts across the glass. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${theme.foreground}14 0%, ${theme.background}10 45%, ${theme.background}59 100%)`,
          backdropFilter: LITE ? undefined : 'blur(40px) saturate(1.2)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(110deg, transparent ${sheenX - 20}%, ${theme.foreground}12 ${sheenX}%, transparent ${sheenX + 20}%)`,
        }}
      />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 52% 46% at 50% 50%, ${theme.background}59 0%, ${theme.background}00 100%)`}} />
    </AbsoluteFill>
  );
};

const Word: React.FC<{word: string; size: number; delay: number; color: string}> = ({word, size, delay, color}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 28], [0, 1], {...clamp, easing: easeOut});
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: size,
        fontWeight: 600,
        letterSpacing: '-0.035em',
        lineHeight: 1.04,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * size * 0.35}px)`,
        filter: LITE || p > 0.98 ? undefined : `blur(${(1 - p) * 16}px)`,
      }}
    >
      {word}
    </span>
  );
};

const Main: React.FC<SceneProps<LiquidProps>> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const words = texts.headline.trim().split(/\s+/);
  const headSize = wrapFit(texts.headline, 168, 1500, 2, 0.56, 64);
  const brandSize = fit(texts.brand, 34, 760, 1.0);
  const ctaSize = fit(texts.cta, 42, 640, 0.6);

  const brandIn = interpolate(frame, [6, 34], [0, 1], {...clamp, easing: easeOut});
  const rule = interpolate(frame, [14, 50], [0, 1], {...clamp, easing: easeInOut});
  const wordStart = 30;
  const wordGap = 6;
  const ctaDelay = Math.min(130, wordStart + words.length * wordGap + 18);
  const pill = spring({frame: frame - ctaDelay, fps, config: {damping: 18, stiffness: 90}});
  const sheen = interpolate(frame, [ctaDelay + 22, ctaDelay + 58], [-60, 160], clamp);

  const zoom = interpolate(frame, [0, 240], [1, 1.035]);
  const drift = interpolate(frame, [0, 240], [10, -10]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: SANS_FONT,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        transform: `scale(${zoom})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          marginBottom: 44,
          opacity: brandIn,
          transform: `translateY(${(1 - brandIn) * 16 + drift * 0.6}px)`,
        }}
      >
        <div style={{width: 80 * rule, height: 2, background: `${theme.foreground}99`}} />
        <div
          style={{
            fontSize: brandSize,
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: theme.foreground,
            whiteSpace: 'nowrap',
            paddingLeft: '0.32em',
          }}
        >
          <span data-text-role={'brand'} style={{display: 'contents'}}>{texts.brand}</span>
        </div>
        <div style={{width: 80 * rule, height: 2, background: `${theme.foreground}99`}} />
      </div>

      <span data-text-role={'headline'} style={{display: 'contents'}}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: `0 ${headSize * 0.24}px`,
            width: 1560,
            textAlign: 'center',
            transform: `translateY(${drift}px)`,
          }}
        >
          {words.map((w, i) => (
            <Word key={i} word={w} size={headSize} delay={wordStart + i * wordGap} color={theme.foreground} />
          ))}
        </div>
      </span>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          marginTop: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '26px 54px',
          borderRadius: 999,
          background: `linear-gradient(180deg, ${theme.foreground}2e, ${theme.surface}26)`,
          border: `1.5px solid ${theme.foreground}4d`,
          boxShadow: `inset 0 1px 0 ${theme.foreground}66, 0 24px 60px rgba(0,0,0,0.18)`,
          backdropFilter: LITE ? undefined : 'blur(24px) saturate(1.4)',
          color: theme.foreground,
          fontSize: ctaSize,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          opacity: Math.min(1, pill * 1.4),
          transform: `translateY(${(1 - pill) * 40 + drift * 1.4}px) scale(${0.92 + pill * 0.08})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sheen}%`,
            width: '40%',
            background: `linear-gradient(100deg, transparent, ${theme.foreground}40, transparent)`,
          }}
        />
        <span data-text-role={'cta'} style={{display: 'contents'}}>{texts.cta}</span>
        <ArrowIcon size={ctaSize * 0.95} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<SceneProps<LiquidProps>>[] = [Main];

export const Liquid: React.FC<LiquidProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <LiquidField theme={props.theme} />
    <SceneTrack meta={liquidMeta} scenes={SCENES} props={props} exit="none" />
    <Grain />
  </AbsoluteFill>
);
