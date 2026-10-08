import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo';
const BASELINE_Y = 860;
const UNIT = 80;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const DATA = [
  { label: 'Monday', value: 2 },
  { label: 'Tuesday', value: 3 },
  { label: 'Wednesday', value: 4 },
  { label: 'Thursday', value: 3 },
  { label: 'Friday', value: 5 },
];

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleP = spring({ frame, fps, config: { damping: 200 } });
  const subOpacity = interpolate(frame, [18, 40], [0, 1], CLAMP);
  const exit = interpolate(frame, [72, 88], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: exit }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.1,
          color: palette.foreground,
          textAlign: 'center',
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [40, 0])}px)`,
        }}
      >
        A week with more focus
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 40,
          color: palette.secondary,
          marginTop: 32,
          opacity: subOpacity,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [172, 180], [1, 0], CLAMP);
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: 140,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 40,
          color: palette.muted,
          opacity: headerOpacity,
        }}
      >
        Focus hours by day
      </div>
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: BASELINE_Y,
          width: 1440,
          height: 3,
          backgroundColor: palette.muted,
        }}
      />
      {DATA.map((d, i) => {
        const delay = 6 + i * 10;
        const p = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 22, stiffness: 110 },
        });
        const height = p * d.value * UNIT;
        const center = 384 + 288 * i;
        const labelOpacity = interpolate(p, [0.6, 1], [0, 1], CLAMP);
        return (
          <React.Fragment key={d.label}>
            <div
              style={{
                position: 'absolute',
                left: center - 88,
                top: BASELINE_Y - height,
                width: 176,
                height,
                backgroundColor: palette.accent,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: center - 144,
                top: BASELINE_Y - height - 64,
                width: 288,
                textAlign: 'center',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 48,
                color: palette.foreground,
                opacity: labelOpacity,
              }}
            >
              {d.value} h
            </div>
            <div
              style={{
                position: 'absolute',
                left: center - 144,
                top: 880,
                width: 288,
                textAlign: 'center',
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 36,
                color: palette.foreground,
              }}
            >
              {d.label}
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: 948,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 28,
          color: palette.muted,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mainP = spring({ frame, fps, config: { damping: 200 } });
  const relayOpacity = interpolate(frame, [20, 40], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.1,
          color: palette.foreground,
          textAlign: 'center',
          opacity: mainP,
          transform: `translateY(${interpolate(mainP, [0, 1], [40, 0])}px)`,
        }}
      >
        17 hours of focused work
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 56,
          color: palette.accent,
          marginTop: 40,
          letterSpacing: 6,
          opacity: relayOpacity,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: FONT,
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
