import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const DATA: {day: string; value: number}[] = [
  {day: 'Monday', value: 2},
  {day: 'Tuesday', value: 3},
  {day: 'Wednesday', value: 4},
  {day: 'Thursday', value: 3},
  {day: 'Friday', value: 5},
];

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = spring({frame, fps, config: {damping: 200}, durationInFrames: 30});
  const subIn = interpolate(frame, [14, 32], [0, 1], clamp);
  const lineW = interpolate(frame, [6, 36], [0, 220], clamp);
  const out = interpolate(frame, [78, 90], [1, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: 160, opacity: out}}>
      <div style={{width: lineW, height: 8, backgroundColor: palette.accent, borderRadius: 4, marginBottom: 48}} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 120,
          fontWeight: 700,
          color: palette.foreground,
          lineHeight: 1.05,
          letterSpacing: -2,
          opacity: rise,
          transform: `translateY(${(1 - rise) * 40}px)`,
        }}
      >
        A week with more focus
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 500,
          color: palette.muted,
          marginTop: 36,
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 20}px)`,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], clamp);
  const fadeOut = interpolate(frame, [168, 180], [1, 0], clamp);

  const left = 240;
  const right = 1680;
  const baseline = 880;
  const maxValue = 5;
  const plotHeight = 540;
  const unit = plotHeight / maxValue;
  const slot = (right - left) / DATA.length;
  const barW = 160;

  return (
    <AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
      <div style={{position: 'absolute', left: 120, top: 100, fontFamily: FONT}}>
        <div style={{fontSize: 60, fontWeight: 700, color: palette.foreground, letterSpacing: -1}}>Focus hours per day</div>
        <div style={{fontSize: 30, fontWeight: 500, color: palette.muted, marginTop: 10}}>Illustrative data</div>
      </div>

      {[0, 1, 2, 3, 4, 5].map((t) => {
        const y = baseline - t * unit;
        return (
          <React.Fragment key={t}>
            <div
              style={{
                position: 'absolute',
                left,
                top: y - (t === 0 ? 2 : 1),
                width: right - left,
                height: t === 0 ? 4 : 2,
                backgroundColor: t === 0 ? palette.muted : 'rgba(177,180,188,0.18)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 120,
                width: 90,
                top: y - 18,
                textAlign: 'right',
                fontFamily: FONT,
                fontSize: 28,
                color: palette.muted,
              }}
            >
              {t}
            </div>
          </React.Fragment>
        );
      })}

      {DATA.map((d, i) => {
        const delay = 12 + i * 8;
        const grow = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 36});
        const h = d.value * unit * grow;
        const cx = left + slot * i + slot / 2;
        const labelIn = interpolate(frame, [delay + 22, delay + 36], [0, 1], clamp);
        const isMax = d.value === maxValue;
        const color = isMax ? palette.accent : palette.secondary;
        const dayIn = interpolate(frame, [delay, delay + 14], [0, 1], clamp);
        return (
          <React.Fragment key={d.day}>
            <div
              style={{
                position: 'absolute',
                left: cx - barW / 2,
                top: baseline - h,
                width: barW,
                height: h,
                backgroundColor: color,
                borderRadius: '10px 10px 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx - 120,
                width: 240,
                top: baseline - d.value * unit - 72,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 52,
                fontWeight: 700,
                color: palette.foreground,
                opacity: labelIn,
                transform: `translateY(${(1 - labelIn) * 12}px)`,
              }}
            >
              {d.value}
            </div>
            <div
              style={{
                position: 'absolute',
                left: cx - 140,
                width: 280,
                top: baseline + 22,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 34,
                fontWeight: 600,
                color: palette.foreground,
                opacity: dayIn,
              }}
            >
              {d.day}
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 124,
          fontFamily: FONT,
          fontSize: 28,
          color: palette.muted,
          textAlign: 'right',
        }}
      >
        Hours
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 200}, durationInFrames: 24});
  const brandIn = interpolate(frame, [10, 26], [0, 1], clamp);
  const noteIn = interpolate(frame, [16, 30], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 120}}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 110,
          fontWeight: 700,
          color: palette.foreground,
          letterSpacing: -2,
          textAlign: 'center',
          opacity: pop,
          transform: `scale(${0.94 + 0.06 * pop})`,
        }}
      >
        <span style={{color: palette.accent}}>17 hours</span> of focused work
      </div>
      <div
        style={{
          marginTop: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          opacity: brandIn,
          transform: `translateY(${(1 - brandIn) * 16}px)`,
        }}
      >
        <div style={{width: 26, height: 26, borderRadius: 13, backgroundColor: palette.accent}} />
        <div style={{fontFamily: FONT, fontSize: 64, fontWeight: 700, color: palette.foreground, letterSpacing: 1}}>Relay</div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          fontFamily: FONT,
          fontSize: 28,
          color: palette.muted,
          opacity: noteIn,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.background, fontFamily: FONT}}>
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
