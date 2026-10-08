import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {palette} from "./contract";

const days = [
  {name: "Monday", value: 2},
  {name: "Tuesday", value: 3},
  {name: "Wednesday", value: 4},
  {name: "Thursday", value: 3},
  {name: "Friday", value: 5},
];

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Header: React.FC<{final?: boolean}> = ({final = false}) => (
  <>
    <div style={{position: "absolute", left: 112, top: 88, height: 40, display: "flex", alignItems: "center", gap: 17}}>
      <div style={{display: "flex", alignItems: "flex-end", gap: 5, height: 29}}>
        {[15, 22, 29].map((height, i) => (
          <div key={i} style={{width: 7, height, background: palette.accent, borderRadius: 2}} />
        ))}
      </div>
      {!final && <div style={{fontSize: 32, fontWeight: 650, letterSpacing: -1}}>Relay</div>}
    </div>
    <div style={{position: "absolute", right: 112, top: 87, padding: "10px 18px", border: `1px solid ${palette.muted}45`, borderRadius: 25, color: palette.muted, fontSize: 23, lineHeight: "28px"}}>
      Illustrative data
    </div>
    <div style={{position: "absolute", left: 112, right: 112, top: 151, height: 1, background: palette.muted, opacity: 0.19}} />
  </>
);

const ChapterTrack: React.FC<{active: number}> = ({active}) => (
  <div style={{position: "absolute", left: 112, bottom: 88, display: "flex", gap: 9}}>
    {[0, 1, 2].map((i) => <div key={i} style={{width: 58, height: 4, borderRadius: 2, background: i === active ? palette.accent : palette.muted, opacity: i === active ? 1 : 0.22}} />)}
  </div>
);

const MiniBars: React.FC<{frame: number; left: number; top: number; scale?: number}> = ({frame, left, top, scale = 1}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: "absolute", left, top, width: 376 * scale, height: 260 * scale}}>
      {days.map((day, i) => {
        const elapsed = Math.max(0, frame - i * 3);
        const progress = elapsed >= 24 ? 1 : spring({frame: elapsed, fps, durationInFrames: 24, config: {damping: 24, stiffness: 150, mass: 0.8, overshootClamping: true}});
        return <div key={day.name} style={{position: "absolute", left: i * 78 * scale, bottom: 0, width: 52 * scale, height: day.value * 46 * scale * progress, borderRadius: `${5 * scale}px ${5 * scale}px 0 0`, background: i === 4 ? palette.accent : palette.secondary, opacity: i === 4 ? 1 : 0.65}} />;
      })}
      <div style={{position: "absolute", left: -10 * scale, right: -4 * scale, bottom: 0, height: 1, background: palette.muted, opacity: 0.4}} />
    </div>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = frame >= 25 ? 1 : spring({frame, fps, durationInFrames: 25, config: {damping: 25, stiffness: 150, mass: 0.8, overshootClamping: true}});
  const opacity = interpolate(frame, [0, 12, 84, 89], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Header />
      <div style={{position: "absolute", left: 112, top: 302, opacity, transform: `translateY(${(1 - enter) * 35}px)`}}>
        <div style={{fontSize: 132, lineHeight: 1.08, fontWeight: 650, letterSpacing: -6}}>A week with</div>
        <div style={{fontSize: 142, lineHeight: 1.08, fontWeight: 650, letterSpacing: -6, color: palette.accent}}>more focus</div>
        <div style={{width: interpolate(frame, [14, 42], [0, 780], clamp), height: 5, marginTop: 40, background: palette.accent}} />
      </div>
      <div style={{opacity}}><MiniBars frame={Math.max(0, frame - 10)} left={1392} top={382} /></div>
      <ChapterTrack active={0} />
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appearance = interpolate(frame, [0, 12], [0, 1], clamp);
  const baseline = 824;
  const unit = 94;
  const centers = [426, 731, 1036, 1341, 1646];
  return (
    <AbsoluteFill>
      <Header />
      <div style={{opacity: appearance}}>
        <div style={{position: "absolute", left: 112, top: 189, fontSize: 62, lineHeight: 1.1, fontWeight: 650, letterSpacing: -2.5}}>Focus hours</div>
        {[0, 1, 2, 3, 4, 5].map((tick) => {
          const y = baseline - tick * unit;
          return (
            <React.Fragment key={tick}>
              <div style={{position: "absolute", left: 168, top: y - 17, width: 44, textAlign: "right", color: palette.muted, fontSize: 25, lineHeight: "34px", fontVariantNumeric: "tabular-nums"}}>{tick}</div>
              <div style={{position: "absolute", left: 252, right: 112, top: y, height: tick === 0 ? 2 : 1, background: palette.muted, opacity: tick === 0 ? 0.7 : 0.16}} />
            </React.Fragment>
          );
        })}
        {days.map((day, i) => {
          const delay = 12 + i * 5;
          const elapsed = Math.max(0, frame - delay);
          const progress = elapsed >= 28 ? 1 : spring({frame: elapsed, fps, durationInFrames: 28, config: {damping: 25, stiffness: 150, mass: 0.85, overshootClamping: true}});
          const height = day.value * unit * progress;
          const valueOpacity = interpolate(frame, [delay + 8, delay + 28], [0, 1], clamp);
          const color = i === 4 ? palette.accent : palette.secondary;
          return (
            <React.Fragment key={day.name}>
              <div style={{position: "absolute", left: centers[i] - 76, top: baseline - height, width: 152, height, borderRadius: "8px 8px 0 0", background: color}} />
              <div style={{position: "absolute", left: centers[i] - 90, top: baseline - height - 66, width: 180, textAlign: "center", fontSize: 44, fontWeight: 650, lineHeight: "54px", color: i === 4 ? palette.accent : palette.foreground, opacity: valueOpacity, fontVariantNumeric: "tabular-nums"}}>{day.value}</div>
              <div style={{position: "absolute", left: centers[i] - 143, top: 852, width: 286, textAlign: "center", fontSize: 30, lineHeight: "42px", fontWeight: 500, letterSpacing: -0.5}}>{day.name}</div>
            </React.Fragment>
          );
        })}
      </div>
      <ChapterTrack active={1} />
    </AbsoluteFill>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = frame >= 20 ? 1 : spring({frame, fps, durationInFrames: 20, config: {damping: 25, stiffness: 170, mass: 0.75, overshootClamping: true}});
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Header final />
      <div style={{position: "absolute", left: 112, top: 280, opacity, transform: `translateY(${(1 - progress) * 28}px)`}}>
        <div style={{fontSize: 174, lineHeight: 1.05, fontWeight: 700, letterSpacing: -8, color: palette.accent}}>17 hours</div>
        <div style={{fontSize: 98, lineHeight: 1.15, fontWeight: 550, letterSpacing: -4, marginTop: 12}}>of focused work</div>
        <div style={{width: 94, height: 4, background: palette.accent, marginTop: 68, marginBottom: 25}} />
        <div style={{fontSize: 54, lineHeight: 1.1, fontWeight: 650, letterSpacing: -1.5}}>Relay</div>
      </div>
      <div style={{opacity}}><MiniBars frame={frame} left={1458} top={323} scale={0.82} /></div>
      <ChapterTrack active={2} />
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const ambientOpacity = interpolate(frame, [0, 45, 270, 300], [0.025, 0.045, 0.045, 0.06], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: palette.background, color: palette.foreground, fontFamily: "Archivo", overflow: "hidden"}}>
      <div style={{position: "absolute", right: 0, top: 0, width: 660, height: 1080, background: `linear-gradient(90deg, ${palette.background}, ${palette.secondary})`, opacity: ambientOpacity}} />
      <Sequence from={0} durationInFrames={90}><Intro /></Sequence>
      <Sequence from={90} durationInFrames={180}><Chart /></Sequence>
      <Sequence from={270} durationInFrames={90}><Finale /></Sequence>
    </AbsoluteFill>
  );
};