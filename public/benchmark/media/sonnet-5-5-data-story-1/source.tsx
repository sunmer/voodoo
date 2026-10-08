import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, Easing } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo, sans-serif';
const FPS = 30;

const data = [
  { day: 'Monday', value: 2 },
  { day: 'Tuesday', value: 3 },
  { day: 'Wednesday', value: 4 },
  { day: 'Thursday', value: 3 },
  { day: 'Friday', value: 5 },
];

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t1 = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t2 = interpolate(frame, [18, 42], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lineW = interpolate(frame, [6, 50], [0, 240], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = interpolate(frame, [80, 90], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, justifyContent: 'center', padding: '0 160px' }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 124,
          fontWeight: 800,
          letterSpacing: -3,
          color: palette.foreground,
          lineHeight: 1.05,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 40}px)`,
        }}
      >
        A week with more focus
      </div>
      <div style={{ height: 8, width: lineW, background: palette.accent, marginTop: 44, borderRadius: 4 }} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 500,
          color: palette.muted,
          marginTop: 36,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 24}px)`,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const baseY = 880;
  const perHour = 124;
  const left = 240;
  const slot = 304;
  const barW = 180;
  const fadeIn = interpolate(frame, [0, 14], [0, 1], clamp);
  const fadeOut = interpolate(frame, [171, 180], [1, 0], clamp);
  const ticks = [0, 1, 2, 3, 4, 5];

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <div style={{ position: 'absolute', left: 160, top: 84 }}>
        <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 800, color: palette.foreground, letterSpacing: -1 }}>
          Focus hours per day
        </div>
        <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 500, color: palette.muted, marginTop: 8 }}>
          Illustrative data
        </div>
      </div>

      {ticks.map((tk) => {
        const y = baseY - tk * perHour;
        return (
          <React.Fragment key={tk}>
            <div
              style={{
                position: 'absolute',
                left: left - 40,
                width: 5 * slot + 40,
                top: y - (tk === 0 ? 2 : 1),
                height: tk === 0 ? 4 : 2,
                background: tk === 0 ? palette.foreground : palette.muted,
                opacity: tk === 0 ? 0.9 : 0.22,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 100,
                width: 70,
                textAlign: 'right',
                top: y - 18,
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 500,
                color: palette.muted,
              }}
            >
              {tk}
            </div>
          </React.Fragment>
        );
      })}

      {data.map((d, i) => {
        const p = spring({
          frame: frame - 10 - i * 8,
          fps: FPS,
          config: { damping: 200, mass: 1, stiffness: 120 },
        });
        const h = d.value * perHour * p;
        const x = left + i * slot + (slot - barW) / 2;
        const isMax = d.value === 5;
        const valOpacity = interpolate(p, [0.5, 0.9], [0, 1], clamp);
        const labelOpacity = interpolate(frame - 6 - i * 8, [0, 14], [0, 1], clamp);
        return (
          <React.Fragment key={d.day}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: baseY - h,
                width: barW,
                height: h,
                background: isMax ? palette.accent : palette.secondary,
                borderRadius: '10px 10px 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x - 40,
                width: barW + 80,
                textAlign: 'center',
                top: baseY - h - 64,
                fontFamily: FONT,
                fontSize: 52,
                fontWeight: 800,
                color: isMax ? palette.accent : palette.foreground,
                opacity: valOpacity,
              }}
            >
              {d.value}
            </div>
            <div
              style={{
                position: 'absolute',
                left: x - 60,
                width: barW + 120,
                textAlign: 'center',
                top: baseY + 28,
                fontFamily: FONT,
                fontSize: 34,
                fontWeight: 600,
                color: palette.foreground,
                opacity: labelOpacity,
              }}
            >
              {d.day}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const b = interpolate(frame, [14, 36], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 160px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 36,
          opacity: a,
          transform: `translateY(${(1 - a) * 36}px)`,
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 280, fontWeight: 800, color: palette.accent, letterSpacing: -8, lineHeight: 1 }}>
          17
        </span>
        <span style={{ fontFamily: FONT, fontSize: 96, fontWeight: 700, color: palette.foreground, letterSpacing: -2 }}>
          hours of focused work
        </span>
      </div>
      <div style={{ height: 6, width: 200, background: palette.secondary, marginTop: 52, borderRadius: 3, opacity: b }} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 800,
          color: palette.foreground,
          marginTop: 36,
          letterSpacing: 2,
          opacity: b,
          transform: `translateY(${(1 - b) * 20}px)`,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
