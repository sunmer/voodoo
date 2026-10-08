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

const RelayMark: React.FC<{size?: number}> = ({size = 36}) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <rect x="2" y="5" width="22" height="6" rx="3" fill={palette.accent}/>
    <rect x="10" y="15" width="24" height="6" rx="3" fill={palette.accent}/>
    <rect x="2" y="25" width="22" height="6" rx="3" fill={palette.secondary}/>
  </svg>
);

const Brand: React.FC<{large?: boolean}> = ({large = false}) => (
  <div style={{display: "flex", alignItems: "center", gap: large ? 22 : 15}}>
    <RelayMark size={large ? 52 : 36}/>
    <span style={{fontSize: large ? 62 : 38, fontWeight: 650, letterSpacing: large ? -2 : -1, lineHeight: 1.1}}>Relay</span>
  </div>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 359], [0, 35], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: palette.background}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 87% 43%, ${palette.secondary}0D 0%, transparent 57%)`}}/>
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        {[320, 640, 960, 1280, 1600].map(x => <line key={x} x1={x} y1="0" x2={x} y2="1080" stroke={palette.foreground} strokeOpacity="0.025"/>)}
        {[270, 540, 810].map(y => <line key={y} x1="0" y1={y} x2="1920" y2={y} stroke={palette.foreground} strokeOpacity="0.025"/>)}
        <circle cx={1600 + drift} cy="490" r="420" stroke={palette.secondary} strokeOpacity="0.045" fill="none"/>
        <circle cx={1600 + drift} cy="490" r="500" stroke={palette.secondary} strokeOpacity="0.035" fill="none"/>
      </svg>
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {frame < 270 && <div style={{position: "absolute", left: 120, top: 102}}><Brand/></div>}
      <div style={{position: "absolute", right: 120, top: 101, height: 48, padding: "0 22px", border: `1px solid ${palette.muted}35`, borderRadius: 24, display: "flex", alignItems: "center", gap: 12}}>
        <div style={{width: 7, height: 7, borderRadius: "50%", backgroundColor: palette.secondary}}/>
        <span style={{fontSize: 24, lineHeight: 1, color: palette.muted, fontWeight: 450}}>Illustrative data</span>
      </div>
      <div style={{position: "absolute", left: 120, right: 120, top: 177, height: 1, backgroundColor: `${palette.foreground}18`}}/>
    </>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = spring({frame, fps, config: {damping: 200, stiffness: 130, mass: 0.8}});
  const second = spring({frame: frame - 7, fps, config: {damping: 200, stiffness: 130, mass: 0.8}});
  const opacity = interpolate(frame, [0, 12, 77, 90], [0, 1, 1, 0], clamp);
  const lineWidth = interpolate(frame, [16, 58], [0, 1040], clamp);
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{position: "absolute", left: 120, top: 306, transform: `translateY(${(1 - first) * 35}px)`, fontSize: 130, fontWeight: 500, letterSpacing: -7, lineHeight: 1.08}}>A week with</div>
      <div style={{position: "absolute", left: 112, top: 447, transform: `translateY(${(1 - second) * 45}px)`, fontSize: 174, fontWeight: 700, letterSpacing: -9, lineHeight: 1.08, color: palette.accent}}>more focus</div>
      <div style={{position: "absolute", left: 120, top: 683, width: lineWidth, height: 3, backgroundColor: palette.accent}}/>
      <div style={{position: "absolute", left: 120, top: 738, display: "flex", gap: 10, opacity: interpolate(frame, [25, 42], [0, 1], clamp)}}>
        {[0, 1, 2, 3, 4].map(i => <div key={i} style={{width: 48, height: 8, borderRadius: 4, backgroundColor: i === 4 ? palette.secondary : `${palette.accent}80`}}/>)}
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, 172, 180], [0, 1, 1, 0], clamp);
  const baseline = 842;
  const pixelsPerHour = 88;
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{position: "absolute", left: 120, top: 217, fontSize: 72, fontWeight: 600, letterSpacing: -3.5, lineHeight: 1}}>Focus hours</div>
      <div style={{position: "absolute", left: 120, top: 325, width: 1680, height: 638, borderRadius: 26, backgroundColor: `${palette.foreground}03`, border: `1px solid ${palette.foreground}0A`}}/>
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        {[0, 1, 2, 3, 4, 5].map(value => {
          const y = baseline - value * pixelsPerHour;
          return <line key={value} x1="266" x2="1752" y1={y} y2={y} stroke={value === 0 ? palette.secondary : palette.foreground} strokeOpacity={value === 0 ? 0.65 : 0.11} strokeWidth={value === 0 ? 2 : 1}/>;
        })}
      </svg>
      {[0, 1, 2, 3, 4, 5].map(value => (
        <div key={value} style={{position: "absolute", left: 196, top: baseline - value * pixelsPerHour - 16, width: 38, textAlign: "right", fontSize: 26, lineHeight: "32px", fontWeight: 450, color: value === 0 ? palette.secondary : palette.muted, fontVariantNumeric: "tabular-nums"}}>{value}</div>
      ))}
      {days.map((day, index) => {
        const center = 460 + index * 280;
        const height = interpolate(frame, [10 + index * 4, 44 + index * 4], [0, day.value * pixelsPerHour], clamp);
        const top = baseline - height;
        const labelOpacity = interpolate(frame, [20 + index * 4, 34 + index * 4], [0, 1], clamp);
        return (
          <React.Fragment key={day.name}>
            <div style={{position: "absolute", left: center - 83, top, width: 166, height, borderRadius: "13px 13px 0 0", background: `linear-gradient(180deg, ${palette.accent} 0%, ${palette.accent}B8 100%)`, overflow: "hidden"}}>
              <div style={{position: "absolute", top: 0, left: 12, bottom: 0, width: 1, backgroundColor: `${palette.foreground}22`}}/>
            </div>
            <div style={{position: "absolute", left: center - 70, top: top - 64, width: 140, textAlign: "center", opacity: labelOpacity, fontSize: 50, fontWeight: 650, lineHeight: "58px", color: palette.accent, fontVariantNumeric: "tabular-nums", letterSpacing: -1}}>{day.value}</div>
            <div style={{position: "absolute", left: center - 130, top: 880, width: 260, textAlign: "center", fontSize: 31, fontWeight: 500, lineHeight: "40px", letterSpacing: -0.6}}>{day.name}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200, stiffness: 150, mass: 0.8}});
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  const lineWidth = interpolate(frame, [12, 30], [0, 1110], clamp);
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{position: "absolute", left: 117, top: 303, color: palette.accent, fontSize: 332, fontWeight: 700, lineHeight: 0.95, letterSpacing: -22, fontVariantNumeric: "tabular-nums", transform: `translateY(${(1 - enter) * 32}px)`}}>17</div>
      <div style={{position: "absolute", left: 638, top: 337, transform: `translateY(${(1 - enter) * 32}px)`}}>
        <div style={{fontSize: 103, fontWeight: 500, lineHeight: 1.1, letterSpacing: -5}}>hours of</div>
        <div style={{fontSize: 103, fontWeight: 600, lineHeight: 1.13, letterSpacing: -5, marginTop: 10}}>focused work</div>
      </div>
      <div style={{position: "absolute", left: 640, top: 635, height: 2, width: lineWidth, backgroundColor: `${palette.accent}80`}}/>
      <div style={{position: "absolute", left: 640, top: 689, transform: `translateY(${(1 - enter) * 18}px)`}}><Brand large/></div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => (
  <AbsoluteFill style={{fontFamily: "Archivo", color: palette.foreground, backgroundColor: palette.background}}>
    <Background/>
    <Header/>
    <Sequence from={0} durationInFrames={90}><Intro/></Sequence>
    <Sequence from={90} durationInFrames={180}><Chart/></Sequence>
    <Sequence from={270} durationInFrames={90}><Finale/></Sequence>
  </AbsoluteFill>
);
