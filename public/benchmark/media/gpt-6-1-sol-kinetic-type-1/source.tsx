import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from "remotion";
import {palette} from "./contract";

const C = palette;
const alpha = (color: string, opacity: string) => `${color}${opacity}`;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const type: React.CSSProperties = {fontFamily: "Archivo", fontWeight: 700, letterSpacing: -8, lineHeight: 1.12, whiteSpace: "nowrap"};

function settle(frame: number, delay = 0, end = 28) {
  if (frame >= end) return 1;
  return spring({frame: Math.max(0, frame - delay), fps: 30, config: {damping: 24, stiffness: 210, mass: 0.8}});
}

function exit(frame: number) {
  return interpolate(frame, [83, 89], [1, 0], clamp);
}

function LinkMark({width = 112}: {width?: number}) {
  return <svg width={width} height={width * 0.75} viewBox="0 0 112 84" fill="none">
    <path d="M65 17H24C15 17 10 22 10 31V47C10 56 15 61 24 61H47" stroke={C.accent} strokeWidth="9" strokeLinecap="square" />
    <path d="M47 67H88C97 67 102 62 102 53V37C102 28 97 23 88 23H65" stroke={C.secondary} strokeWidth="9" strokeLinecap="square" />
    <path d="M43 42H69" stroke={C.foreground} strokeWidth="9" />
  </svg>;
}

function Furniture({step}: {step: number}) {
  return <AbsoluteFill style={{pointerEvents: "none"}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <path d="M180 120V950M1740 120V950" stroke={alpha(C.muted, "0D")} strokeWidth="1" />
      <path d="M180 918H1740" stroke={alpha(C.muted, "27")} strokeWidth="1" />
      <path d="M180 166H242" stroke={C.accent} strokeWidth="5" />
      <path d="M255 166H277" stroke={alpha(C.muted, "78")} strokeWidth="5" />
      <path d="M1728 156V176M1718 166H1738" stroke={alpha(C.muted, "70")} strokeWidth="2" />
      <path d="M180 946H202M212 946H221" stroke={alpha(C.muted, "65")} strokeWidth="3" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={1614 + i * 34} y={938} width="24" height="8" fill={i === step ? C.accent : alpha(C.muted, "35")} />)}
    </svg>
  </AbsoluteFill>;
}

function LessNoise() {
  const frame = useCurrentFrame();
  const p = settle(frame, 0, 28);
  const out = exit(frame);
  const letters = Array.from("noise.");
  return <AbsoluteFill>
    <Furniture step={0} />
    <div style={{position: "absolute", left: 180, top: 383, display: "flex", alignItems: "baseline", gap: 52, ...type, fontSize: 224, opacity: out, transform: `translateX(${(1 - p) * -60 - (1 - out) * 28}px)`}}>
      <span style={{color: C.foreground, opacity: interpolate(frame, [0, 12], [0, 1], clamp)}}>Less</span>
      <span style={{display: "inline-flex", color: C.muted}}>
        {letters.map((letter, i) => {
          const q = settle(frame, i * 1.5, 30);
          const direction = i % 2 === 0 ? -1 : 1;
          return <span key={i} style={{display: "inline-block", color: letter === "." ? C.accent : C.muted, opacity: interpolate(frame, [i * 1.5, 13 + i * 1.5], [0, 1], clamp), transform: `translate(${(1 - q) * (i - 2) * 17}px, ${(1 - q) * direction * (35 + i * 6)}px) rotate(${(1 - q) * direction * 8}deg)`}}>{letter}</span>;
        })}
      </span>
    </div>
    <div style={{position: "absolute", left: 180, top: 685, height: 6, width: 400 * p, backgroundColor: C.accent, opacity: out}} />
    <svg width="1920" height="1080" style={{position: "absolute", inset: 0, opacity: out}}>
      {Array.from({length: 21}, (_, i) => {
        const startX = 1460 + ((i * 41) % 150);
        const startY = 294 + i * 22;
        const endY = 436 + (i % 3) * 70;
        const x = startX + (1515 - startX) * p;
        const y = startY + (endY - startY) * p;
        const length = 28 + ((i * 37) % 144);
        const w = length + (166 - length) * p;
        const opacity = i < 3 ? 0.55 + p * 0.35 : (1 - p) * 0.5;
        return <rect key={i} x={x} y={y} width={w} height={4 + p * 9} fill={i % 3 === 0 ? C.accent : i % 3 === 1 ? C.secondary : C.muted} opacity={opacity} />;
      })}
    </svg>
  </AbsoluteFill>;
}

function Corners({p}: {p: number}) {
  const reach = 36 + (1 - p) * 90;
  const color = alpha(C.accent, "B3");
  const common: React.CSSProperties = {position: "absolute", width: 42, height: 42, borderColor: color, borderStyle: "solid", borderWidth: 0};
  return <>
    <div style={{...common, top: -reach, left: -reach, borderTopWidth: 2, borderLeftWidth: 2}} />
    <div style={{...common, top: -reach, right: -reach, borderTopWidth: 2, borderRightWidth: 2}} />
    <div style={{...common, bottom: -reach, left: -reach, borderBottomWidth: 2, borderLeftWidth: 2}} />
    <div style={{...common, bottom: -reach, right: -reach, borderBottomWidth: 2, borderRightWidth: 2}} />
  </>;
}

function MoreFocus() {
  const frame = useCurrentFrame();
  const p = settle(frame, 0, 27);
  const out = exit(frame);
  const reveal = interpolate(frame, [0, 18], [0, 1], clamp);
  return <AbsoluteFill>
    <Furniture step={1} />
    <div style={{position: "absolute", left: 208, top: 390, display: "inline-flex", alignItems: "center", gap: 64, ...type, fontSize: 214, opacity: reveal * out, transform: `translateY(${(1 - p) * 55}px) scale(${0.97 + p * 0.03})`, transformOrigin: "left center"}}>
      <span style={{color: C.foreground, transform: `translateY(${(1 - p) * 35}px)`}}>More</span>
      <span style={{position: "relative", display: "inline-block", padding: "12px 38px 22px", color: C.background, backgroundColor: C.accent, transform: `scale(${1.16 - p * 0.16})`, transformOrigin: "center center", filter: `blur(${interpolate(frame, [0, 19], [12, 0], clamp)}px)`}}>focus.</span>
      <Corners p={p} />
    </div>
    <div style={{position: "absolute", left: 180, top: 789, width: 1560, height: 1, backgroundColor: alpha(C.secondary, "28"), opacity: reveal * out}} />
    <div style={{position: "absolute", left: 180 + 1548 * p, top: 783, width: 12, height: 12, backgroundColor: C.secondary, opacity: reveal * out}} />
  </AbsoluteFill>;
}

function BetterTogether() {
  const frame = useCurrentFrame();
  const p = settle(frame, 0, 28);
  const q = settle(frame, 4, 30);
  const out = exit(frame);
  const visibility = interpolate(frame, [0, 15], [0, 1], clamp) * out;
  return <AbsoluteFill>
    <Furniture step={2} />
    <div style={{position: "absolute", left: 180, top: 258, display: "flex", gap: 42, ...type, fontSize: 174, color: C.foreground, opacity: visibility}}>
      <span style={{transform: `translateX(${(1 - p) * -74}px)`}}>Better</span>
      <span style={{transform: `translateX(${(1 - p) * 92}px)`}}>work,</span>
    </div>
    <div style={{position: "absolute", left: 566, top: 454, ...type, fontSize: 202, color: C.secondary, opacity: visibility, transform: `translateY(${(1 - q) * 80}px)`, letterSpacing: -8 + (1 - q) * 4}}>
      together<span style={{color: C.accent}}>.</span>
    </div>
    <svg width="1920" height="1080" style={{position: "absolute", inset: 0, opacity: visibility}}>
      <path d={`M180 790H${398 + p * 451}`} stroke={alpha(C.accent, "62")} strokeWidth="2" />
      <path d={`M${1522 - p * 451} 790H1740`} stroke={alpha(C.secondary, "62")} strokeWidth="2" />
      <rect x={382 + p * 496} y="771" width="38" height="38" fill={C.accent} opacity={1 - p} />
      <rect x={1503 - p * 499} y="771" width="38" height="38" fill={C.secondary} opacity={1 - p} />
      <circle cx="180" cy="790" r="4" fill={C.accent} />
      <circle cx="1740" cy="790" r="4" fill={C.secondary} />
    </svg>
    <div style={{position: "absolute", left: 904, top: 748, opacity: p * visibility, transform: `scale(${0.82 + 0.18 * p})`}}><LinkMark /></div>
  </AbsoluteFill>;
}

function MakeRoom() {
  const frame = useCurrentFrame();
  const p = settle(frame, 0, 30);
  const q = settle(frame, 4, 30);
  const visibility = interpolate(frame, [0, 16], [0, 1], clamp);
  const brandVisibility = interpolate(frame, [5, 23], [0, 1], clamp);
  return <AbsoluteFill>
    <Furniture step={3} />
    <div style={{position: "absolute", left: 180, top: 259, ...type, fontSize: 142, letterSpacing: -6, lineHeight: 1.08, opacity: visibility, transform: `translateY(${(1 - p) * 38}px)`}}>
      <div style={{color: C.foreground}}>Make room for</div>
      <div style={{color: C.accent}}>what matters.</div>
    </div>
    <div style={{position: "absolute", left: 180, top: 701, height: 1, width: 980 * p, backgroundColor: alpha(C.muted, "35"), opacity: visibility}} />
    <div style={{position: "absolute", left: 180, top: 769, display: "flex", alignItems: "center", gap: 30, opacity: brandVisibility, transform: `translateY(${(1 - q) * 28}px)`}}>
      <LinkMark width={98} />
      <div style={{fontFamily: "Archivo", fontSize: 90, lineHeight: 1.1, fontWeight: 700, letterSpacing: -4, color: C.foreground}}>Relay</div>
    </div>
    <svg width="1920" height="1080" style={{position: "absolute", inset: 0, opacity: visibility}}>
      <rect x={1422 - p * 52} y={298 - p * 52} width={261 + p * 104} height={286 + p * 104} fill={alpha(C.secondary, "05")} stroke={alpha(C.muted, "45")} strokeWidth="2" />
      <path d={`M${1370 + (1 - p) * 52} ${365 - p * 119}V${298 - p * 52}H${1500 + (1 - p) * 52}`} fill="none" stroke={C.accent} strokeWidth="5" />
      <path d={`M${1605 - (1 - p) * 52} ${584 + p * 52}H${1683 + p * 52}V${506 + p * 52}`} fill="none" stroke={C.secondary} strokeWidth="5" />
      <rect x="1477" y="353" width="151" height="176" fill={C.secondary} opacity={(1 - p) * 0.16} />
    </svg>
  </AbsoluteFill>;
}

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const opening = interpolate(frame, [0, 8], [0.65, 1], clamp);
  return <AbsoluteFill style={{backgroundColor: C.background, color: C.foreground, fontFamily: "Archivo", overflow: "hidden"}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 78% 28%, ${alpha(C.secondary, "0A")} 0%, ${alpha(C.background, "00")} 65%)`, opacity: opening}} />
    <Sequence from={0} durationInFrames={90}><LessNoise /></Sequence>
    <Sequence from={90} durationInFrames={90}><MoreFocus /></Sequence>
    <Sequence from={180} durationInFrames={90}><BetterTogether /></Sequence>
    <Sequence from={270} durationInFrames={90}><MakeRoom /></Sequence>
  </AbsoluteFill>;
};
