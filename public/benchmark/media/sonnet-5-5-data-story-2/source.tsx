import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const data = [
  {day: 'Monday', value: 2},
  {day: 'Tuesday', value: 3},
  {day: 'Wednesday', value: 4},
  {day: 'Thursday', value: 3},
  {day: 'Friday', value: 5},
];

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t1 = spring({frame, fps, config: {damping: 200}, durationInFrames: 30});
  const t2 = spring({frame: frame - 14, fps, config: {damping: 200}, durationInFrames: 30});
  const line = interpolate(frame, [4, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(frame, [78, 90], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 120, top: 0, bottom: 0, width: 1700, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{height: 8, width: 220 * line, background: palette.accent, borderRadius: 4, marginBottom: 48}} />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 148,
            lineHeight: 1.02,
            letterSpacing: -4,
            color: palette.foreground,
            opacity: t1,
            transform: `translateY(${(1 - t1) * 40}px)`,
          }}
        >
          A week with<br />
          <span style={{color: palette.accent}}>more focus</span>
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 44,
            color: palette.muted,
            letterSpacing: 1,
            opacity: t2,
            transform: `translateY(${(1 - t2) * 24}px)`,
          }}
        >
          Illustrative data
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PLOT_LEFT = 240;
const PLOT_WIDTH = 1520;
const BASELINE = 860;
const PER_HOUR = 108;
const SLOT = PLOT_WIDTH / 5;
const BAR_W = 180;

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], clamp);
  const fadeOut = interpolate(frame, [168, 180], [1, 0], clamp);
  const head = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const ticks = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
      <div style={{position: 'absolute', left: 120, top: 90, opacity: head, transform: `translateY(${(1 - head) * 20}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 64, color: palette.foreground, letterSpacing: -1}}>
          Focus hours by day
        </div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 30, color: palette.muted, marginTop: 8}}>
          Illustrative data · hours
        </div>
      </div>

      {ticks.map((tk) => {
        const y = BASELINE - tk * PER_HOUR;
        return (
          <React.Fragment key={tk}>
            <div
              style={{
                position: 'absolute',
                left: PLOT_LEFT - 20,
                top: y - 1,
                width: PLOT_WIDTH + 40,
                height: tk === 0 ? 3 : 1,
                background: tk === 0 ? palette.foreground : palette.muted,
                opacity: tk === 0 ? 0.9 : 0.22,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 120,
                width: 80,
                top: y - 18,
                textAlign: 'right',
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 28,
                lineHeight: '36px',
                color: palette.muted,
              }}
            >
              {tk}
            </div>
          </React.Fragment>
        );
      })}

      {data.map((d, i) => {
        const start = 15 + i * 10;
        const p = interpolate(frame, [start, start + 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const h = d.value * PER_HOUR * p;
        const cx = PLOT_LEFT + SLOT * i + SLOT / 2;
        const isMax = d.value === 5;
        const labelOp = interpolate(frame, [start + 10, start + 30], [0, 1], clamp);
        const dayOp = interpolate(frame, [start - 5, start + 10], [0, 1], clamp);
        return (
          <React.Fragment key={d.day}>
            <div
              style={{
                position: 'absolute',
                left: cx - BAR_W / 2,
                top: BASELINE - h,
                width: BAR_W,
                height: h,
                background: isMax ? palette.accent : palette.secondary,
                borderRadius: '10px 10px 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx - 100,
                width: 200,
                top: BASELINE - h - 64,
                textAlign: 'center',
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 52,
                lineHeight: '56px',
                color: palette.foreground,
                opacity: labelOp,
              }}
            >
              {d.value}
            </div>
            <div
              style={{
                position: 'absolute',
                left: cx - 140,
                width: 280,
                top: BASELINE + 24,
                textAlign: 'center',
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 36,
                lineHeight: '44px',
                color: palette.foreground,
                opacity: dayOp,
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
  const {fps} = useVideoConfig();
  const bg = interpolate(frame, [0, 12], [0, 1], clamp);
  const a = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});
  const b = spring({frame: frame - 8, fps, config: {damping: 200}, durationInFrames: 18});
  return (
    <AbsoluteFill style={{opacity: bg}}>
      <div style={{position: 'absolute', left: 120, top: 0, bottom: 0, width: 1680, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 140,
            lineHeight: 1.05,
            letterSpacing: -4,
            color: palette.foreground,
            opacity: a,
            transform: `translateY(${(1 - a) * 36}px)`,
          }}
        >
          <span style={{color: palette.accent}}>17</span> hours of<br />focused work
        </div>
        <div style={{display: 'flex', alignItems: 'center', marginTop: 56, opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>
          <div style={{width: 64, height: 8, background: palette.secondary, borderRadius: 4, marginRight: 24}} />
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 64, color: palette.foreground, letterSpacing: 1}}>Relay</div>
        </div>
        <div style={{marginTop: 28, fontFamily: FONT, fontWeight: 500, fontSize: 30, color: palette.muted, opacity: b}}>
          Illustrative data
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: palette.background, fontFamily: FONT}}>
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
