import React from "react";
import {AbsoluteFill, interpolate, spring, Sequence, useCurrentFrame} from "remotion";
import {palette} from "./contract";

const FPS = 30;
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const alpha = (color: string, opacity: string) => `${color}${opacity}`;

const enter = (frame: number, delay = 0, duration = 22) => {
  if (frame <= delay) return 0;
  if (frame >= delay + duration) return 1;
  return spring({frame: frame - delay, fps: FPS, durationInFrames: duration, config: {damping: 22, stiffness: 180, mass: 0.8}});
};

const exit = (frame: number) => interpolate(frame, [83, 89], [1, 0], clamp);

const RelayMark: React.FC<{size: number; color?: string; secondColor?: string}> = ({size, color = palette.accent, secondColor = palette.secondary}) => (
  <div style={{width: size, height: size, position: "relative"}}>
    <div style={{position: "absolute", left: size * 0.16, top: size * 0.12, width: size * 0.23, height: size * 0.76, background: color, transform: "skewX(-23deg)"}} />
    <div style={{position: "absolute", left: size * 0.59, top: size * 0.12, width: size * 0.23, height: size * 0.76, background: secondColor, transform: "skewX(-23deg)"}} />
  </div>
);

const ResolvingWord: React.FC<{text: string; frame: number; offset: number; color: string}> = ({text, frame, offset, color}) => (
  <span style={{display: "inline-flex", color}}>
    {Array.from(text).map((letter, index) => {
      const p = enter(frame, offset + index * 1.1, 19);
      return <span key={index} style={{display: "inline-block", opacity: interpolate(p, [0, 0.3, 1], [0, 1, 1], clamp), transform: `translate(${(1 - p) * (index % 2 === 0 ? -15 : 15)}px, ${(1 - p) * (index % 2 === 0 ? 100 : -85)}px) rotate(${(1 - p) * (index % 2 === 0 ? -5 : 5)}deg)`}}>{letter}</span>;
    })}
  </span>
);

const LessNoise: React.FC = () => {
  const frame = useCurrentFrame();
  const settle = enter(frame, 3, 30);
  const leaving = exit(frame);
  return <AbsoluteFill style={{opacity: leaving}}>
    {Array.from({length: 20}).map((_, i) => {
      const upper = i < 10;
      const x = 144 + (i % 10) * 168;
      const y = upper ? 262 + (i % 3) * 23 : 778 + (i % 3) * 22;
      return <div key={i} style={{position: "absolute", left: x, top: y, height: i % 4 === 0 ? 5 : 2, width: 26 + (i % 4) * 19, background: i % 4 === 0 ? palette.secondary : palette.muted, opacity: (1 - settle) * 0.42, transform: `translate(${(1 - settle) * ((i % 3) - 1) * 48}px, ${settle * (upper ? 95 : -95)}px)`}} />;
    })}
    <div style={{position: "absolute", left: 144, top: 387, fontSize: 232, fontWeight: 700, lineHeight: 1.08, letterSpacing: -10, whiteSpace: "nowrap", display: "flex", gap: 44, transform: `translateY(${(1 - leaving) * -25}px)`}}>
      <ResolvingWord text="Less" frame={frame} offset={0} color={palette.accent} />
      <ResolvingWord text="noise." frame={frame} offset={7} color={palette.foreground} />
    </div>
    <div style={{position: "absolute", left: 148, top: 725, width: 1628, height: 2, background: alpha(palette.foreground, "16")}} />
    <div style={{position: "absolute", left: 148, top: 719, height: 12, width: interpolate(settle, [0, 1], [8, 172], clamp), background: palette.accent}} />
    <div style={{position: "absolute", left: 1748, top: 715, width: 28, height: 22, borderLeft: `2px solid ${palette.secondary}`, opacity: settle}} />
  </AbsoluteFill>;
};

const MoreFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const p = enter(frame, 0, 24);
  const leaving = exit(frame);
  const tracking = interpolate(frame, [0, 24], [17, -8], clamp);
  const bracketInset = interpolate(p, [0, 1], [0, 108], clamp);
  return <AbsoluteFill style={{opacity: leaving}}>
    <div style={{position: "absolute", left: 144 + bracketInset, top: 344, width: 45, height: 326, borderLeft: `3px solid ${palette.secondary}`, borderTop: `3px solid ${palette.secondary}`, borderBottom: `3px solid ${palette.secondary}`, opacity: interpolate(frame, [0, 9], [0, 0.8], clamp)}} />
    <div style={{position: "absolute", right: 144 + bracketInset, top: 344, width: 45, height: 326, borderRight: `3px solid ${palette.secondary}`, borderTop: `3px solid ${palette.secondary}`, borderBottom: `3px solid ${palette.secondary}`, opacity: interpolate(frame, [0, 9], [0, 0.8], clamp)}} />
    <div style={{position: "absolute", left: 104, right: 104, top: 402, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 42, fontSize: 216, fontWeight: 700, lineHeight: 1.08, letterSpacing: tracking, whiteSpace: "nowrap", opacity: interpolate(frame, [0, 8], [0, 1], clamp), filter: `blur(${interpolate(frame, [0, 18], [9, 0], clamp)}px)`, transform: `scale(${1.065 - p * 0.065}) translateY(${(1 - leaving) * -25}px)`}}>
      <span style={{color: palette.foreground}}>More</span>
      <span style={{color: palette.accent, position: "relative"}}>focus.<span style={{position: "absolute", left: 7, right: 8, bottom: -30, height: 10, background: palette.accent, transformOrigin: "left", transform: `scaleX(${p})`}} /></span>
    </div>
    <div style={{position: "absolute", left: 950, top: 293, width: 20, height: 20, background: palette.secondary, opacity: p}} />
    <div style={{position: "absolute", left: 959, top: 740, width: 2, height: 49, background: alpha(palette.secondary, "80"), transform: `scaleY(${p})`, transformOrigin: "top"}} />
  </AbsoluteFill>;
};

const BetterTogether: React.FC = () => {
  const frame = useCurrentFrame();
  const first = enter(frame, 0, 22);
  const second = enter(frame, 5, 22);
  const mark = enter(frame, 5, 23);
  const leaving = exit(frame);
  return <AbsoluteFill style={{opacity: leaving}}>
    <div style={{position: "absolute", left: 144, top: 290, width: 1632, overflow: "hidden"}}>
      <div style={{fontSize: 182, fontWeight: 700, letterSpacing: -7, lineHeight: 1.12, whiteSpace: "nowrap", color: palette.foreground, opacity: first, transform: `translateX(${(1 - first) * -190}px)`}}>Better work,</div>
    </div>
    <div style={{position: "absolute", left: 144, top: 492, width: 1290, overflow: "hidden"}}>
      <div style={{fontSize: 228, fontWeight: 700, letterSpacing: -9, lineHeight: 1.12, whiteSpace: "nowrap", color: palette.accent, opacity: second, transform: `translateX(${(1 - second) * 190}px)`}}>together.</div>
    </div>
    <div style={{position: "absolute", left: 1512, top: 490, width: 234, height: 234, opacity: mark}}>
      <div style={{position: "absolute", left: 34, top: 24, width: 55, height: 182, background: palette.accent, transform: `translateX(${(1 - mark) * -100}px) skewX(-23deg)`}} />
      <div style={{position: "absolute", left: 136, top: 24, width: 55, height: 182, background: palette.secondary, transform: `translateX(${(1 - mark) * 100}px) skewX(-23deg)`}} />
    </div>
    <div style={{position: "absolute", left: 148, top: 788, width: 1628, height: 2, background: alpha(palette.foreground, "16")}} />
    <div style={{position: "absolute", left: 148, top: 781, width: 1628, height: 16, display: "flex", justifyContent: "space-between"}}>
      <div style={{width: 96, background: palette.accent, transformOrigin: "left", transform: `scaleX(${second})`}} />
      <div style={{width: 96, background: palette.secondary, transformOrigin: "right", transform: `scaleX(${second})`}} />
    </div>
  </AbsoluteFill>;
};

const MakeRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const first = enter(frame, 0, 21);
  const second = enter(frame, 3, 21);
  const brand = enter(frame, 7, 21);
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 144, top: 274, width: 1435, height: 192, overflow: "hidden"}}>
      <div style={{fontSize: 164, fontWeight: 700, letterSpacing: -6, lineHeight: 1.1, color: palette.foreground, whiteSpace: "nowrap", opacity: first, transform: `translateY(${(1 - first) * 185}px)`}}>Make room for</div>
    </div>
    <div style={{position: "absolute", left: 144, top: 456, width: 1435, height: 192, overflow: "hidden"}}>
      <div style={{fontSize: 164, fontWeight: 700, letterSpacing: -6, lineHeight: 1.1, color: palette.accent, whiteSpace: "nowrap", opacity: second, transform: `translateY(${(1 - second) * 185}px)`}}>what matters.</div>
    </div>
    <div style={{position: "absolute", left: 1581, top: 373, opacity: second, transform: `translateY(${(1 - second) * 36}px)`}}><RelayMark size={184} /></div>
    <div style={{position: "absolute", left: 148, top: 744, width: 1628, height: 2, background: alpha(palette.foreground, "20"), transformOrigin: "left", transform: `scaleX(${second})`}} />
    <div style={{position: "absolute", left: 145, top: 809, display: "flex", gap: 27, alignItems: "center", opacity: brand, transform: `translateY(${(1 - brand) * 25}px)`}}>
      <RelayMark size={77} color={palette.accent} secondColor={palette.accent} />
      <div style={{fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, color: palette.foreground}}>Relay</div>
    </div>
  </AbsoluteFill>;
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 300], [0, 1], clamp);
  const chapter = Math.min(3, Math.floor(frame / 90));
  return <AbsoluteFill style={{backgroundColor: palette.background, color: palette.foreground, fontFamily: "Archivo", overflow: "hidden"}}>
    <div style={{position: "absolute", left: 143, top: 190, bottom: 169, width: 1, background: alpha(palette.muted, "09")}} />
    <div style={{position: "absolute", right: 143, top: 190, bottom: 169, width: 1, background: alpha(palette.muted, "09")}} />
    <div style={{position: "absolute", left: 143, top: 101}}><RelayMark size={58} color={palette.foreground} secondColor={palette.foreground} /></div>
    <div style={{position: "absolute", left: 234, top: 130, width: 1542, height: 1, background: alpha(palette.foreground, "24")}} />
    <div style={{position: "absolute", left: 234, top: 129, width: 1542 * progress, height: 3, background: palette.accent}} />
    <div style={{position: "absolute", left: 230 + 1542 * progress, top: 126, width: 8, height: 8, background: palette.accent}} />
    <Sequence from={0} durationInFrames={90}><LessNoise /></Sequence>
    <Sequence from={90} durationInFrames={90}><MoreFocus /></Sequence>
    <Sequence from={180} durationInFrames={90}><BetterTogether /></Sequence>
    <Sequence from={270} durationInFrames={90}><MakeRoom /></Sequence>
    <div style={{position: "absolute", right: 144, bottom: 128, display: "flex", gap: 14}}>
      {[0, 1, 2, 3].map(i => <div key={i} style={{width: 44, height: 5, background: i <= chapter ? palette.accent : alpha(palette.muted, "36")}} />)}
    </div>
  </AbsoluteFill>;
};