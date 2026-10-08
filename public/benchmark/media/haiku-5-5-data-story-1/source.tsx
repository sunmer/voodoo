import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo';

const DAYS = [
  {label: 'Monday', value: 2},
  {label: 'Tuesday', value: 3},
  {label: 'Wednesday', value: 4},
  {label: 'Thursday', value: 3},
  {label: 'Friday', value: 5},
];

const SCALE_MAX = 5;
const CHART_LEFT = 260;
const CHART_RIGHT = 1660;
const CHART_TOP = 280;
const BASELINE_Y = 840;
const PX_PER_HOUR = (BASELINE_Y - CHART_TOP) / SCALE_MAX;
const SLOT = (CHART_RIGHT - CHART_LEFT) / DAYS.length;
const BAR_W = 160;

const ramp = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});
  const eyebrowOpacity = ramp(frame, [0, 14], [0, 1]);
  const exit = ramp(frame, [72, 88], [1, 0]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
      <div
        style={{
          fontFamily: FONT,
          color: palette.muted,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 6,
          textTransform: 'uppercase',
          opacity: eyebrowOpacity,
          marginBottom: 28,
        }}
      >
        Illustrative data
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: palette.foreground,
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1.05,
          textAlign: 'center',
          opacity: enter,
          transform: `translateY(${(1 - enter) * 30}px)`,
        }}
      >
        A week with more focus
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = ramp(frame, [0, 12], [0, 1]);
  const exit = ramp(frame, [166, 180], [1, 0]);
  const gridValues = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill style={{opacity: enter * exit}}>
      <div
        style={{
          position: 'absolute',
          left: CHART_LEFT,
          top: 110,
          fontFamily: FONT,
          fontSize: 48,
          fontWeight: 700,
          color: palette.foreground,
        }}
      >
        Focus hours per day
      </div>
      <div
        style={{
          position: 'absolute',
          left: CHART_LEFT,
          top: 172,
          fontFamily: FONT,
          fontSize: 28,
          color: palette.muted,
        }}
      >
        Illustrative data
      </div>

      {gridValues.map((v) => {
        const y = BASELINE_Y - v * PX_PER_HOUR;
        return (
          <React.Fragment key={`grid-${v}`}>
            <div
              style={{
                position: 'absolute',
                left: CHART_LEFT,
                top: y,
                width: CHART_RIGHT - CHART_LEFT,
                height: 1,
                background: v === 0 ? palette.foreground : `${palette.muted}40`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 160,
                width: 72,
                top: y - 16,
                textAlign: 'right',
                fontFamily: FONT,
                fontSize: 24,
                color: palette.muted,
              }}
            >
              {v}
            </div>
          </React.Fragment>
        );
      })}

      {DAYS.map((d, i) => {
        const start = 12 + i * 8;
        const p = spring({
          frame: Math.max(0, frame - start),
          fps,
          config: {damping: 200},
          durationInFrames: 40,
        });
        const h = d.value * PX_PER_HOUR * p;
        const cx = CHART_LEFT + SLOT * (i + 0.5);
        const labelOpacity = ramp(p, [0.7, 1], [0, 1]);
        return (
          <React.Fragment key={d.label}>
            <div
              style={{
                position: 'absolute',
                left: cx - BAR_W / 2,
                top: BASELINE_Y - h,
                width: BAR_W,
                height: h,
                background: palette.accent,
                borderRadius: '8px 8px 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx - 100,
                width: 200,
                top: BASELINE_Y - h - 58,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 44,
                fontWeight: 700,
                color: palette.foreground,
                opacity: labelOpacity,
              }}
            >
              {`${d.value} h`}
            </div>
            <div
              style={{
                position: 'absolute',
                left: cx - SLOT / 2,
                width: SLOT,
                top: 880,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 34,
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
          left: CHART_LEFT,
          top: BASELINE_Y,
          width: CHART_RIGHT - CHART_LEFT,
          height: 2,
          background: palette.foreground,
        }}
      />
    </AbsoluteFill>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const main = spring({frame, fps, config: {damping: 200}});
  const sub = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 104,
          fontWeight: 700,
          lineHeight: 1.05,
          color: palette.foreground,
          textAlign: 'center',
          opacity: main,
          transform: `translateY(${(1 - main) * 24}px)`,
        }}
      >
        17 hours of focused work
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: 10,
          textTransform: 'uppercase',
          color: palette.accent,
          marginTop: 36,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.background, overflow: 'hidden'}}>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Finale />
      </Sequence>
    </AbsoluteFill>
  );
};
