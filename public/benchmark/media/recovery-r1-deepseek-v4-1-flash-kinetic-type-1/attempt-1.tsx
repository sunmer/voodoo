import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./contract";

const SAFE = 80;
const BLOCK = 90;
const OUT = 12;

const base: React.CSSProperties = {
  fontFamily: "Archivo",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
  whiteSpace: "nowrap",
  margin: 0,
  color: palette.foreground,
};

const spr = (frame: number, fps: number, delay = 0, stiffness = 130) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness, mass: 0.9 },
  });

const fadeOut = (frame: number) =>
  interpolate(frame, [BLOCK - OUT, BLOCK], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

const lift = (frame: number) =>
  interpolate(frame, [BLOCK - OUT, BLOCK], [0, -26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

const Stage: React.FC<{ children: React.ReactNode; exit?: boolean }> = ({
  children,
  exit = true,
}) => {
  const frame = useCurrentFrame();
  const o = exit ? fadeOut(frame) : 1;
  const y = exit ? lift(frame) : 0;

  return (
    <AbsoluteFill
      style={{
        boxSizing: "border-box",
        padding: SAFE,
        justifyContent: "center",
        alignItems: "center",
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = 0.05 + t * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1000px 660px at 50% 48%, rgba(184, 243, 107, ${glow}) 0%, rgba(16, 17, 20, 0) 68%)`,
      }}
    />
  );
};

const Phrase1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spr(frame, fps, 0);
  const b = spr(frame, fps, 6);
  const strike = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "baseline", gap: 38 }}>
        <span
          style={{
            ...base,
            fontSize: 176,
            display: "inline-block",
            opacity: Math.min(1, a * 1.6),
            transform: `translateY(${(1 - a) * 90}px)`,
          }}
        >
          Less
        </span>
        <span
          style={{
            ...base,
            fontSize: 176,
            display: "inline-block",
            position: "relative",
            color: palette.muted,
            opacity: Math.min(1, b * 1.6),
            transform: `translateY(${(1 - b) * 90}px)`,
          }}
        >
          noise.
          <span
            style={{
              position: "absolute",
              left: "-2%",
              right: "-2%",
              top: "54%",
              height: 10,
              borderRadius: 6,
              background: palette.accent,
              transform: `scaleX(${strike})`,
              transformOrigin: "left center",
            }}
          />
        </span>
      </div>
    </Stage>
  );
};

const Phrase2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spr(frame, fps, 0, 120);
  const b = spr(frame, fps, 8, 120);
  const bar = interpolate(frame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "baseline", gap: 36 }}>
        <span
          style={{
            ...base,
            fontSize: 176,
            display: "inline-block",
            opacity: Math.min(1, a * 1.6),
            transform: `translateY(${(1 - a) * 70}px) scale(${0.94 + a * 0.06})`,
          }}
        >
          More
        </span>
        <span
          style={{
            ...base,
            fontSize: 176,
            display: "inline-block",
            position: "relative",
            color: palette.secondary,
            opacity: Math.min(1, b * 1.6),
            transform: `translateY(${(1 - b) * 70}px) scale(${0.94 + b * 0.06})`,
          }}
        >
          focus.
          <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -28,
              height: 12,
              borderRadius: 6,
              background: palette.accent,
              transform: `scaleX(${bar})`,
              transformOrigin: "left center",
            }}
          />
        </span>
      </div>
    </Stage>
  );
};

const Phrase3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ["Better", "work,", "together."];

  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "baseline", gap: 38 }}>
        {words.map((word, i) => {
          const p = spr(frame, fps, i * 6, 140);
          return (
            <span
              key={word}
              style={{
                ...base,
                fontSize: 132,
                display: "inline-block",
                opacity: Math.min(1, p * 1.6),
                transform: `translateX(${(1 - p) * -70}px)`,
                color: i === 2 ? palette.accent : palette.foreground,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </Stage>
  );
};

const Phrase4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = spr(frame, fps, 0, 120);
  const mark = spr(frame, fps, 10, 110);

  return (
    <Stage exit={false}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
        }}
      >
        <span
          style={{
            ...base,
            fontSize: 96,
            fontWeight: 500,
            display: "inline-block",
            opacity: Math.min(1, line * 1.6),
            transform: `translateY(${(1 - line) * 40}px)`,
          }}
        >
          Make room for what matters.
        </span>
        <span
          style={{
            ...base,
            fontSize: 220,
            letterSpacing: "-0.03em",
            color: palette.accent,
            display: "inline-block",
            opacity: Math.min(1, mark * 1.6),
            transform: `translateY(${(1 - mark) * 50}px) scale(${0.96 + mark * 0.04})`,
          }}
        >
          Relay
        </span>
      </div>
    </Stage>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.background, fontFamily: "Archivo" }}
    >
      <Backdrop />
      <Sequence from={0} durationInFrames={BLOCK}>
        <Phrase1 />
      </Sequence>
      <Sequence from={BLOCK} durationInFrames={BLOCK}>
        <Phrase2 />
      </Sequence>
      <Sequence from={BLOCK * 2} durationInFrames={BLOCK}>
        <Phrase3 />
      </Sequence>
      <Sequence from={BLOCK * 3} durationInFrames={BLOCK}>
        <Phrase4 />
      </Sequence>
    </AbsoluteFill>
  );
};