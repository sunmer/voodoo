import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {palette} from './contract';

const DAYS = [
  {label: 'Monday', value: 2},
  {label: 'Tuesday', value: 3},
  {label: 'Wednesday', value: 4},
  {label: 'Thursday', value: 3},
  {label: 'Friday', value: 5},
];

const HOUR_PX = 96; // linear scale: 96px per focus hour
const BASELINE_BOTTOM = 250; // baseline, px from bottom of frame
const CHART_LEFT = 260;
const CHART_WIDTH = 1400;
const STEP = CHART_WIDTH / DAYS.length;
const BAR_WIDTH = 170;

const CENTER_X = (i: number) => CHART_LEFT + STEP * (i + 0.5);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  const inProgress = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 110, mass: 0.9},
  });
  const outOpacity = interpolate(frame, [72, 88], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outY = interpolate(frame, [72, 90], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(inProgress, [0, 1], [50, 0]);
  const subOpacity = interpolate(frame, [18, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(frame, [18, 34], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const markOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: outOpacity,
        transform: `translateY(${outY}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 120,
          fontFamily: 'Archivo',
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: 10,
          color: palette.accent,
          textTransform: 'uppercase',
          opacity: markOpacity,
        }}
      >
        Relay
      </div>

      <div
        style={{
          fontFamily: 'Archivo',
          fontSize: 120,
          fontWeight: 700,
          color: palette.foreground,
          letterSpacing: -2,
          textAlign: 'center',
          transform: `translateY(${titleY}px)`,
          opacity: inProgress,
        }}
      >
        A week with more focus
      </div>

      <div
        style={{
          fontFamily: 'Archivo',
          fontSize: 40,
          fontWeight: 500,
          color: palette.muted,
          letterSpacing: 4,
          textTransform: 'uppercase',
          marginTop: 36,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  const groupOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const groupOpacityOut = interpolate(frame, [168, 180], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headerOpacity = interpolate(frame, [2, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headerY = interpolate(frame, [2, 18], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(groupOpacity, groupOpacityOut),
      }}
    >
      {/* Chart header */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: CHART_LEFT,
          fontFamily: 'Archivo',
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: palette.foreground,
            letterSpacing: -0.5,
          }}
        >
          Focus hours per day
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: palette.muted,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginTop: 10,
          }}
        >
          Illustrative data
        </div>
      </div>

      {/* Horizontal gridlines with scale numbers (0-5 hours) */}
      {[0, 1, 2, 3, 4, 5].map((h) => (
        <React.Fragment key={h}>
          <div
            style={{
              position: 'absolute',
              left: CHART_LEFT,
              width: CHART_WIDTH,
              bottom: BASELINE_BOTTOM + h * HOUR_PX,
              height: h === 0 ? 3 : 1,
              backgroundColor:
                h === 0 ? palette.muted : 'rgba(177, 180, 188, 0.22)',
            }}
          />
          {h > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: CHART_LEFT - 70,
                bottom: BASELINE_BOTTOM + h * HOUR_PX - 14,
                width: 50,
                textAlign: 'right',
                fontFamily: 'Archivo',
                fontSize: 24,
                fontWeight: 500,
                color: 'rgba(177, 180, 188, 0.6)',
              }}
            >
              {h}h
            </div>
          ) : null}
        </React.Fragment>
      ))}

      {/* Bars, day labels and exact values */}
      {DAYS.map((day, i) => {
        const delay = i * 8;
        const s = spring({
          frame: frame - delay,
          fps,
          config: {damping: 14, stiffness: 130, mass: 0.8},
        });
        const barHeight = day.value * HOUR_PX * s;
        const valueOpacity = interpolate(s, [0.45, 0.9], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const labelOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <React.Fragment key={day.label}>
            <div
              style={{
                position: 'absolute',
                left: CENTER_X(i) - BAR_WIDTH / 2,
                bottom: BASELINE_BOTTOM,
                width: BAR_WIDTH,
                height: barHeight,
                backgroundColor: palette.accent,
                borderRadius: 6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: CENTER_X(i) - BAR_WIDTH / 2,
                width: BAR_WIDTH,
                bottom: BASELINE_BOTTOM + barHeight + 18,
                textAlign: 'center',
                fontFamily: 'Archivo',
                fontSize: 44,
                fontWeight: 700,
                color: palette.foreground,
                opacity: valueOpacity,
              }}
            >
              {day.value}
            </div>
            <div
              style={{
                position: 'absolute',
                left: CENTER_X(i) - BAR_WIDTH / 2 - 40,
                width: BAR_WIDTH + 80,
                bottom: BASELINE_BOTTOM - 64,
                textAlign: 'center',
                fontFamily: 'Archivo',
                fontSize: 32,
                fontWeight: 500,
                color: palette.muted,
                opacity: labelOpacity,
              }}
            >
              {day.label}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  const total = DAYS.reduce((sum, d) => sum + d.value, 0); // 17

  const inProgress = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 110, mass: 0.9},
  });
  const textY = interpolate(inProgress, [0, 1], [40, 0]);
  const markOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineGrow = spring({
    frame: frame - 8,
    fps,
    config: {damping: 18, stiffness: 90},
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 120,
          fontFamily: 'Archivo',
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: 10,
          color: palette.accent,
          textTransform: 'uppercase',
          opacity: markOpacity,
        }}
      >
        Relay
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: inProgress,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: 'Archivo',
            fontSize: 300,
            fontWeight: 700,
            lineHeight: 1,
            color: palette.accent,
            letterSpacing: -8,
          }}
        >
          {total}
        </div>
        <div
          style={{
            fontFamily: 'Archivo',
            fontSize: 78,
            fontWeight: 600,
            color: palette.foreground,
            letterSpacing: -1,
            marginTop: 12,
          }}
        >
          hours of focused work
        </div>
        <div
          style={{
            width: 340 * lineGrow,
            height: 5,
            backgroundColor: palette.secondary,
            marginTop: 44,
            borderRadius: 3,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const progressWidth = interpolate(frame, [0, 360], [0, 1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        fontFamily: 'Archivo',
      }}
    >
      <Sequence durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <BarChart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: progressWidth,
          height: 6,
          backgroundColor: 'rgba(120, 185, 237, 0.5)',
        }}
      />
    </AbsoluteFill>
  );
};
