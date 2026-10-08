import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const days = [
  {day: 'Monday', value: 2},
  {day: 'Tuesday', value: 3},
  {day: 'Wednesday', value: 4},
  {day: 'Thursday', value: 3},
  {day: 'Friday', value: 5},
];

const text: React.CSSProperties = {
  fontFamily: 'Archivo, sans-serif',
  color: palette.foreground,
  margin: 0,
  fontVariantNumeric: 'tabular-nums',
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 16, 72, 90], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = interpolate(frame, [0, 24], [26, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line = spring({frame: frame - 12, fps: 30, config: {damping: 120}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity}}>
      <div style={{transform: `translateY(${rise}px)`, textAlign: 'center'}}>
        <div style={{...text, color: palette.secondary, fontSize: 34, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase'}}>Illustrative data</div>
        <div style={{width: 640, height: 6, margin: '34px auto', background: palette.accent, transform: `scaleX(${line})`, borderRadius: 999}} />
        <h1 style={{...text, fontSize: 92, lineHeight: 1.02, fontWeight: 800}}>A week with more focus</h1>
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [166, 180], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const baselineY = 860;
  const maxH = 560;
  const left = 265;
  const barW = 170;
  const gap = 135;

  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <div style={{position: 'absolute', left: 120, top: 92, opacity: headerOpacity}}>
        <div style={{...text, color: palette.muted, fontSize: 28, fontWeight: 600, letterSpacing: 2}}>ILLUSTRATIVE DATA</div>
        <div style={{...text, fontSize: 58, fontWeight: 800, marginTop: 8}}>Focus hours by day</div>
      </div>

      {[0, 1, 2, 3, 4, 5].map((n) => {
        const y = baselineY - (n / 5) * maxH;
        return (
          <div key={n}>
            <div style={{position: 'absolute', left: 220, top: y, width: 1480, height: n === 0 ? 4 : 2, background: n === 0 ? palette.foreground : `${palette.muted}55`}} />
            {n > 0 && (
              <div style={{...text, position: 'absolute', left: 150, top: y - 18, width: 54, textAlign: 'right', color: palette.muted, fontSize: 24, fontWeight: 600, opacity: headerOpacity}}>{n}</div>
            )}
          </div>
        );
      })}

      {days.map((d, i) => {
        const x = left + i * (barW + gap);
        const h = (d.value / 5) * maxH;
        const s = spring({frame: frame - (10 + i * 8), fps, config: {damping: 160, stiffness: 120}});
        const valueOpacity = interpolate(frame, [48 + i * 5, 76 + i * 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const labelOpacity = interpolate(frame, [8 + i * 5, 28 + i * 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={d.day}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: baselineY - h,
                width: barW,
                height: h,
                background: i === 4 ? palette.secondary : palette.accent,
                borderRadius: '18px 18px 0 0',
                transform: `scaleY(${s})`,
                transformOrigin: 'bottom',
                boxShadow: `0 0 44px ${i === 4 ? palette.secondary : palette.accent}33`,
              }}
            />
            <div style={{...text, position: 'absolute', left: x, top: baselineY - h - 58, width: barW, textAlign: 'center', fontSize: 42, fontWeight: 800, opacity: valueOpacity}}>{d.value}</div>
            <div style={{...text, position: 'absolute', left: x - 35, top: 896, width: barW + 70, textAlign: 'center', color: palette.foreground, fontSize: 34, fontWeight: 700, opacity: labelOpacity}}>{d.day}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = spring({frame, fps: 30, config: {damping: 140}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity}}>
      <div style={{textAlign: 'center', transform: `scale(${0.96 + scale * 0.04})`}}>
        <div style={{...text, fontSize: 86, lineHeight: 1.05, fontWeight: 800}}>17 hours of focused work</div>
        <div style={{...text, marginTop: 42, color: palette.accent, fontSize: 120, lineHeight: 1, fontWeight: 900, letterSpacing: -3}}>Relay</div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: palette.background}}>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Final />
      </Sequence>
    </AbsoluteFill>
  );
};
