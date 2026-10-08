import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo, sans-serif';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

const Scene: React.FC<{ children: React.ReactNode; fadeOut?: boolean }> = ({ children, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 6], [0, 1], clamp);
  const b = fadeOut ? interpolate(frame, [80, 89], [1, 0], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: a * b, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </AbsoluteFill>
  );
};

const baseText: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  color: palette.foreground,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  letterSpacing: '-0.03em',
};

/* Scene 1: noise resolves into clarity */
const NoiseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const settle = ease(frame, 6, 38);
  const chaos = 1 - settle;
  const tick = Math.floor(frame / 2);
  const lessIn = ease(frame, 0, 24);
  const word = 'noise.'.split('');

  const bars = Array.from({ length: 14 }).map((_, i) => {
    const y = 80 + hash(i + 3) * 920;
    const w = 200 + hash(i + 9) * 700;
    const x = 80 + hash(i + 15 + tick * 0.37) * (1760 - w);
    const vis = chaos * (hash(i * 7 + tick) > 0.45 ? 1 : 0);
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: 4,
          background: i % 3 === 0 ? palette.secondary : palette.muted,
          opacity: vis * 0.35,
        }}
      />
    );
  });

  return (
    <Scene>
      {bars}
      <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 230 }}>
        <span
          style={{
            ...baseText,
            marginRight: 36,
            transform: `translateX(${(1 - lessIn) * -120}px)`,
            opacity: lessIn,
          }}
        >
          Less
        </span>
        <span style={{ display: 'flex', position: 'relative' }}>
          {word.map((c, i) => {
            const dx = (hash(i * 3 + tick) - 0.5) * 160 * chaos;
            const dy = (hash(i * 5 + tick + 40) - 0.5) * 140 * chaos;
            const rot = (hash(i * 11 + tick) - 0.5) * 40 * chaos;
            return (
              <span
                key={i}
                style={{
                  ...baseText,
                  display: 'inline-block',
                  color: settle > 0.98 ? palette.accent : i % 2 ? palette.secondary : palette.muted,
                  transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                  opacity: 0.35 + 0.65 * settle,
                }}
              >
                {c}
              </span>
            );
          })}
        </span>
      </div>
    </Scene>
  );
};

/* Scene 2: focus pull */
const FocusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = ease(frame, 0, 32);
  const blurMore = interpolate(frame, [0, 32], [26, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blurFocus = interpolate(frame, [6, 38], [40, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const scale = interpolate(frame, [0, 38], [1.12, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const W = 1380;
  const H = 300;
  const off = (1 - p) * 140;
  const corner = (sx: number, sy: number): React.CSSProperties => ({
    position: 'absolute',
    width: 60,
    height: 60,
    left: 960 + sx * (W / 2 + off) - (sx > 0 ? 60 : 0),
    top: 540 + sy * (H / 2 + off) - (sy > 0 ? 60 : 0),
    borderColor: palette.accent,
    borderStyle: 'solid',
    borderWidth: 0,
    borderTopWidth: sy < 0 ? 6 : 0,
    borderBottomWidth: sy > 0 ? 6 : 0,
    borderLeftWidth: sx < 0 ? 6 : 0,
    borderRightWidth: sx > 0 ? 6 : 0,
    opacity: p,
  });
  return (
    <Scene>
      <div style={corner(-1, -1)} />
      <div style={corner(1, -1)} />
      <div style={corner(-1, 1)} />
      <div style={corner(1, 1)} />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: 210,
          transform: `scale(${scale})`,
        }}
      >
        <span style={{ ...baseText, marginRight: 44, filter: `blur(${blurMore}px)`, color: palette.muted }}>More</span>
        <span style={{ ...baseText, filter: `blur(${blurFocus}px)`, color: palette.accent }}>focus.</span>
      </div>
    </Scene>
  );
};

/* Scene 3: words converge together */
const TogetherScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ease(frame, 0, 26);
  const b = ease(frame, 6, 32);
  const c = ease(frame, 14, 40);
  const line = ease(frame, 36, 58);
  return (
    <Scene>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, fontSize: 180 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span
            style={{
              ...baseText,
              marginRight: 46,
              transform: `translateX(${(1 - a) * -700}px)`,
              opacity: a,
            }}
          >
            Better
          </span>
          <span
            style={{
              ...baseText,
              color: palette.secondary,
              transform: `translateX(${(1 - b) * 700}px)`,
              opacity: b,
            }}
          >
            work,
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              ...baseText,
              display: 'inline-block',
              color: palette.accent,
              transform: `translateY(${(1 - c) * 160}px)`,
              opacity: c,
            }}
          >
            together.
          </span>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: -24,
              height: 8,
              width: `${line * 100}%`,
              background: palette.secondary,
            }}
          />
        </div>
      </div>
    </Scene>
  );
};

/* Scene 4: final message, still after ~1s */
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rel = ease(frame, 0, 14);
  const words = [
    { t: 'Make', l: 0, d: 2 },
    { t: 'room', l: 0, d: 5 },
    { t: 'for', l: 0, d: 8 },
    { t: 'what', l: 1, d: 11 },
    { t: 'matters.', l: 1, d: 14 },
  ];
  const renderLine = (l: number) => (
    <div style={{ display: 'flex', alignItems: 'baseline', overflow: 'hidden', paddingBottom: 18 }}>
      {words
        .filter((w) => w.l === l)
        .map((w) => {
          const p = ease(frame, w.d, w.d + 14);
          return (
            <span
              key={w.t}
              style={{
                ...baseText,
                fontSize: 160,
                marginRight: 40,
                display: 'inline-block',
                color: w.t === 'matters.' ? palette.accent : palette.foreground,
                transform: `translateY(${(1 - p) * 180}px)`,
                opacity: p,
              }}
            >
              {w.t}
            </span>
          );
        })}
    </div>
  );
  return (
    <Scene fadeOut={false}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: rel,
            transform: `translateY(${(1 - rel) * -24}px)`,
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 14, background: palette.accent }} />
          <span
            style={{
              ...baseText,
              fontSize: 64,
              letterSpacing: '0.02em',
              color: palette.secondary,
            }}
          >
            Relay
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderLine(0)}
          {renderLine(1)}
        </div>
      </div>
    </Scene>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 359], [0, 1], clamp);
  const drift = interpolate(frame, [0, 360], [0, -60], clamp);
  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${palette.muted}14 1px, transparent 1px), linear-gradient(90deg, ${palette.muted}14 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.5,
        }}
      />
      <Sequence from={0} durationInFrames={90}>
        <NoiseScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <FocusScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <TogetherScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <FinalScene />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          left: 80,
          bottom: 80,
          width: 1760,
          height: 4,
          background: `${palette.muted}33`,
        }}
      >
        <div style={{ width: `${progress * 100}%`, height: 4, background: palette.accent }} />
      </div>
    </AbsoluteFill>
  );
};
