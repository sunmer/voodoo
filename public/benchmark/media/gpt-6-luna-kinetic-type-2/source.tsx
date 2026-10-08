import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame } from "remotion";
import { palette } from "./contract";

const bounded = (value: number, from: number, to: number) =>
  interpolate(value, [0, 1], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const motion = (frame: number, delay: number, settle: number) => {
  const elapsed = frame - delay;
  if (elapsed <= 0) return 0;
  if (elapsed >= settle) return 1;
  return spring({
    frame: elapsed,
    fps: 30,
    config: { damping: 22, stiffness: 150, mass: 0.8 },
  });
};

const backdropStyle: React.CSSProperties = {
  background: palette.background,
  backgroundImage: `radial-gradient(ellipse at 50% 48%, ${palette.secondary}12 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, ${palette.accent}0A 0%, transparent 48%)`,
};

function LessNoise() {
  const frame = useCurrentFrame();
  const less = motion(frame, 0, 22);
  const noise = motion(frame, 6, 22);
  const underline = motion(frame, 12, 18);

  return (
    <AbsoluteFill style={backdropStyle}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 680, height: 680, transform: "translate(-50%, -50%)", border: `1px solid ${palette.foreground}`, borderRadius: "50%", opacity: 0.055 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 520, height: 520, transform: "translate(-50%, -50%)", border: `1px solid ${palette.secondary}`, borderRadius: "50%", opacity: 0.08 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "baseline", gap: 34, whiteSpace: "nowrap", fontFamily: "Archivo", fontSize: 156, lineHeight: 0.95, fontWeight: 700, letterSpacing: -6 }}>
        <span style={{ display: "inline-block", color: palette.foreground, opacity: bounded(less, 0, 1), transform: `translate3d(0, ${bounded(less, 52, 0)}px, 0) scale(${bounded(less, 0.94, 1)})` }}>Less</span>
        <span style={{ display: "inline-block", color: palette.accent, opacity: bounded(noise, 0, 1), transform: `translate3d(0, ${bounded(noise, 52, 0)}px, 0) scale(${bounded(noise, 0.94, 1)})` }}>noise.</span>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "64%", transform: "translateX(-50%)", width: bounded(underline, 0, 240), height: 4, borderRadius: 4, background: palette.accent, opacity: 0.85 }} />
    </AbsoluteFill>
  );
}

function MoreFocus() {
  const frame = useCurrentFrame();
  const reveal = motion(frame, 0, 24);
  const ring = bounded(reveal, 0.72, 1);

  return (
    <AbsoluteFill style={backdropStyle}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 790, height: 790, transform: `translate(-50%, -50%) scale(${ring})`, border: `1px solid ${palette.secondary}`, borderRadius: "50%", opacity: 0.13 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 650, height: 650, transform: `translate(-50%, -50%) scale(${ring})`, border: `1px solid ${palette.foreground}`, borderRadius: "50%", opacity: 0.055 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 2, height: 250, transform: "translate(-50%, -50%)", background: palette.secondary, opacity: 0.22 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translateY(${bounded(reveal, 30, 0)}px) scale(${bounded(reveal, 0.92, 1)})`, opacity: bounded(reveal, 0, 1), whiteSpace: "nowrap", fontFamily: "Archivo", fontSize: 150, lineHeight: 1, fontWeight: 700, letterSpacing: `${bounded(reveal, 24, -5)}px` }}>
        <span style={{ color: palette.foreground }}>More </span><span style={{ color: palette.accent }}>focus.</span>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "65%", transform: "translateX(-50%)", width: bounded(reveal, 0, 170), height: 3, borderRadius: 3, background: palette.secondary, opacity: 0.8 }} />
    </AbsoluteFill>
  );
}

function BetterTogether() {
  const frame = useCurrentFrame();
  const upper = motion(frame, 0, 22);
  const lower = motion(frame, 7, 22);

  return (
    <AbsoluteFill style={backdropStyle}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 292, height: 1, background: palette.foreground, opacity: 0.08 }} />
      <div style={{ position: "absolute", left: 140, right: 140, bottom: 292, height: 1, background: palette.foreground, opacity: 0.08 }} />
      <div style={{ position: "absolute", left: 140, top: "50%", width: 5, height: 110, transform: "translateY(-50%)", background: palette.accent, opacity: 0.75 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, whiteSpace: "nowrap", fontFamily: "Archivo", fontWeight: 700, lineHeight: 1.04 }}>
        <div style={{ fontSize: 116, color: palette.foreground, opacity: bounded(upper, 0, 1), transform: `translateX(${bounded(upper, -120, 0)}px)` }}>Better work,</div>
        <div style={{ fontSize: 124, color: palette.accent, opacity: bounded(lower, 0, 1), transform: `translateX(${bounded(lower, 120, 0)}px)` }}>together.</div>
      </div>
    </AbsoluteFill>
  );
}

function MakeRoom() {
  const frame = useCurrentFrame();
  const first = motion(frame, 0, 22);
  const second = motion(frame, 4, 22);
  const signature = motion(frame, 7, 18);

  return (
    <AbsoluteFill style={backdropStyle}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 960, height: 620, transform: "translate(-50%, -50%)", borderRadius: 36, border: `1px solid ${palette.foreground}`, opacity: 0.055 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", whiteSpace: "nowrap", fontFamily: "Archivo" }}>
        <div style={{ fontSize: 88, lineHeight: 1.13, fontWeight: 700, letterSpacing: -3, color: palette.foreground, opacity: bounded(first, 0, 1), transform: `translateY(${bounded(first, 34, 0)}px)` }}>Make room for</div>
        <div style={{ fontSize: 88, lineHeight: 1.13, fontWeight: 700, letterSpacing: -3, color: palette.accent, opacity: bounded(second, 0, 1), transform: `translateY(${bounded(second, 34, 0)}px)` }}>what matters.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 17, marginTop: 38, opacity: bounded(signature, 0, 1), transform: `translateY(${bounded(signature, 18, 0)}px)` }}>
          <div style={{ position: "relative", width: 28, height: 28, border: `2px solid ${palette.accent}`, borderRadius: 9, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 5, right: 5, top: 7, height: 2, background: palette.accent, transform: "rotate(35deg)" }} />
            <div style={{ position: "absolute", left: 5, right: 5, bottom: 7, height: 2, background: palette.accent, transform: "rotate(-35deg)" }} />
          </div>
          <span style={{ color: palette.foreground, fontSize: 36, fontWeight: 600, letterSpacing: 3 }}>Relay</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "76%", transform: "translateX(-50%)", width: bounded(signature, 0, 80), height: 2, borderRadius: 2, background: palette.secondary, opacity: 0.65 }} />
    </AbsoluteFill>
  );
}

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const ambient = interpolate(frame, [0, 359], [0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.background, transform: `scale(${ambient})` }}>
      <Sequence from={0} durationInFrames={90}><LessNoise /></Sequence>
      <Sequence from={90} durationInFrames={90}><MoreFocus /></Sequence>
      <Sequence from={180} durationInFrames={90}><BetterTogether /></Sequence>
      <Sequence from={270} durationInFrames={90}><MakeRoom /></Sequence>
    </AbsoluteFill>
  );
};