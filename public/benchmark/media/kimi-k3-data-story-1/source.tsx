import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { palette } from './contract';

const DAYS = [
  { day: 'Monday', value: 2 },
  { day: 'Tuesday', value: 3 },
  { day: 'Wednesday', value: 4 },
  { day: 'Thursday', value: 3 },
  { day: 'Friday', value: 5 },
];

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 120 } });
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);
  const y = interpolate(enter, [0, 1], [46, 0]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity }}>
      <div style={{ transform: `translateY(${y}px)`, textAlign: 'center' }}>
        <div style={{ color: palette.secondary, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 28 }}>Illustrative data</div>
        <div style={{ color: palette.foreground, fontSize: 104, fontWeight: 700, lineHeight: 1.04, maxWidth: 1500 }}>A week with more focus</div>
      </div>
    </AbsoluteFill>
  );
};

const Bars: React.FC = () => {
  const frame = useCurrentFrame();
  const baseline = 860;
  const chartTop = 340;
  const chartHeight = 520;
  const max = 5;
  const startX = 360;
  const step = 300;
  const barWidth = 180;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, fontFamily: 'Archivo' }}>
        <text x={120} y={178} fill={palette.foreground} fontSize={58} fontWeight={700}>Focus hours</text>
        <text x={120} y={232} fill={palette.muted} fontSize={30}>Common zero baseline, linear scale</text>
        {[1, 2, 3, 4, 5].map((tick) => {
          const y = baseline - (tick / max) * chartHeight;
          return (
            <g key={tick}>
              <line x1={300} x2={1760} y1={y} y2={y} stroke={palette.muted} strokeOpacity={0.18} strokeWidth={1} />
              <text x={246} y={y + 10} fill={palette.muted} fontSize={26} textAnchor="end">{tick}</text>
            </g>
          );
        })}
        <line x1={300} x2={1760} y1={baseline} y2={baseline} stroke={palette.foreground} strokeOpacity={0.72} strokeWidth={3} />
        {DAYS.map((item, index) => {
          const delay = index * 8;
          const target = (item.value / max) * chartHeight;
          const height = interpolate(frame, [delay, delay + 38], [0, target], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const labelOpacity = interpolate(frame, [delay + 30, delay + 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const x = startX + index * step;
          const y = baseline - height;
          return (
            <g key={item.day} opacity={labelOpacity}>
              <rect x={x} y={y} width={barWidth} height={height} rx={14} fill={index === 4 ? palette.secondary : palette.accent} />
              <text x={x + barWidth / 2} y={y - 28} fill={palette.foreground} fontSize={42} fontWeight={700} textAnchor="middle">{item.value}</text>
              <text x={x + barWidth / 2} y={912} fill={palette.foreground} fontSize={34} textAnchor="middle">{item.day}</text>
            </g>
          );
        })}
        <line x1={300} x2={300} y1={chartTop} y2={baseline} stroke={palette.muted} strokeOpacity={0.35} strokeWidth={2} />
      </svg>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 130 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(enter, [0, 1], [34, 0]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity }}>
      <div style={{ transform: `translateY(${y}px)`, textAlign: 'center' }}>
        <div style={{ color: palette.foreground, fontSize: 92, fontWeight: 700, lineHeight: 1.08, marginBottom: 42 }}>17 hours of focused work</div>
        <div style={{ color: palette.accent, fontSize: 132, fontWeight: 800, letterSpacing: 1 }}>Relay</div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily: 'Archivo' }}>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Bars />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Final />
      </Sequence>
    </AbsoluteFill>
  );
};