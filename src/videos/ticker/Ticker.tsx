import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, FONT, Grain, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {tickerMeta} from './meta';
import type {TickerProps} from './schema';

const S = 1080;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// One endless row of repeated text, scrolling left or right.
const Row: React.FC<{text: string; size: number; color: string; dir: 1 | -1; speed: number; outline?: boolean}> = ({
  text,
  size,
  color,
  dir,
  speed,
  outline,
}) => {
  const frame = useCurrentFrame();
  const unit = `${text.toUpperCase()}  \u2022  `;
  const unitWidth = unit.length * size * 0.62;
  const x = ((frame * speed * dir) % unitWidth) - unitWidth;
  return (
    <div
      style={{
        whiteSpace: 'pre',
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1,
        transform: `translateX(${x}px)`,
        color: outline ? 'transparent' : color,
        WebkitTextStroke: outline ? `3px ${color}` : undefined,
      }}
    >
      {unit.repeat(Math.ceil((S * 2) / unitWidth) + 2)}
    </div>
  );
};

const SceneMarquee: React.FC<TickerProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const box = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 130}});
  const tilt = interpolate(frame, [0, 90], [-8, -4]);
  const exit = interpolate(frame, [76, 90], [0, 1], {...clamp, easing: easeIn});
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill style={{background: theme.background, transform: `scale(${1 + exit * 0.3})`, opacity: 1 - exit}}>
      <AbsoluteFill style={{justifyContent: 'center', gap: 18, transform: `rotate(${tilt}deg) scale(1.25)`}}>
        {rows.map((i) => (
          <Row
            key={i}
            text={texts.headline}
            size={150}
            color={i % 3 === 1 ? theme.accent : theme.foreground}
            dir={i % 2 ? 1 : -1}
            speed={9 + i * 2}
            outline={i % 3 === 2}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            padding: '36px 56px',
            background: theme.accent2,
            color: theme.background,
            border: `8px solid ${theme.background}`,
            boxShadow: `18px 18px 0 ${theme.background}`,
            fontSize: fit(texts.brand, 120, 760, 0.66),
            fontWeight: 900,
            textTransform: 'uppercase',
            transform: `scale(${box}) rotate(${(1 - box) * 20 - 3}deg)`,
          }}
        >
          {texts.brand}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Split-flap board: each cell flickers through random glyphs, then settles.
const Flap: React.FC<{text: string; delay: number; color: string; cell: string; size: number}> = ({text, delay, color, cell, size}) => {
  const frame = useCurrentFrame();
  const chars = text.toUpperCase().padEnd(10, ' ').slice(0, Math.max(10, text.length)).split('');
  return (
    <div style={{display: 'flex', gap: 8}}>
      {chars.map((ch, i) => {
        const settle = delay + i + 8;
        const t = frame - delay - i;
        const shown = t < 0 ? ' ' : frame >= settle || ch === ' ' ? ch : GLYPHS[Math.floor(random(`${text}${i}${frame}`) * GLYPHS.length)];
        const flip = frame < settle && t >= 0 ? (frame % 2) * 12 : 0;
        return (
          <div
            key={i}
            style={{
              width: size * 0.78,
              height: size * 1.2,
              background: cell,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: size,
              fontWeight: 800,
              color,
              position: 'relative',
              transform: `rotateX(${flip}deg)`,
            }}
          >
            {shown}
            <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: 'rgba(0,0,0,0.35)'}} />
          </div>
        );
      })}
    </div>
  );
};

const SceneBoard: React.FC<TickerProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  const longest = Math.max(10, ...items.map((t) => t.length));
  const size = Math.min(96, (S - 120) / (longest * 0.78 + longest * 0.08));
  const exit = interpolate(frame, [68, 80], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{background: theme.background, justifyContent: 'center', alignItems: 'center', gap: 40, opacity: 1 - exit}}>
      <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 36, letterSpacing: '0.2em', color: theme.accent, fontWeight: 700}}>
        {texts.brand.toUpperCase()}
      </div>
      {items.map((t, i) => (
        <Flap key={i} text={t} delay={4 + i * 6} size={size} color={i === 1 ? theme.accent : theme.foreground} cell={theme.surface} />
      ))}
    </AbsoluteFill>
  );
};

const SceneStamp: React.FC<TickerProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wipe = interpolate(frame, [0, 16], [0, 100], {...clamp, easing: easeInOut});
  const word = spring({frame: frame - 12, fps, config: {damping: 11, stiffness: 150}});
  const stamp = spring({frame: frame - 28, fps, config: {damping: 9, stiffness: 200}});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `inset(0 ${100 - wipe}% 0 0)`}}>
      <AbsoluteFill style={{top: 'auto', height: 140, overflow: 'hidden', justifyContent: 'center', background: theme.background}}>
        <Row text={texts.cta} size={90} color={theme.accent2} dir={-1} speed={8} />
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 60, paddingBottom: 140}}>
        <div
          style={{
            fontSize: fit(texts.brand, 190, 900, 0.68),
            fontWeight: 900,
            color: theme.background,
            textTransform: 'uppercase',
            transform: `translateY(${(1 - word) * 200}px)`,
            opacity: word,
          }}
        >
          {texts.brand}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '26px 44px',
            border: `6px solid ${theme.background}`,
            color: theme.background,
            fontSize: 54,
            fontWeight: 900,
            textTransform: 'uppercase',
            transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-4deg)`,
            opacity: Math.min(1, stamp * 2),
          }}
        >
          {texts.cta}
          <ArrowIcon size={50} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<TickerProps>[] = [SceneMarquee, SceneBoard, SceneStamp];

export const Ticker: React.FC<TickerProps> = (props) => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: props.theme.background, opacity: intro}}>
      {tickerMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};
