import React from "react";
import { useCurrentFrame, interpolate, spring, Sequence, AbsoluteFill } from "remotion";
import { palette } from "./contract";

const FPS = 30;
const { background, foreground, accent, secondary, muted } = palette;

const LessNoise: React.FC<{ frame: number }> = ({ frame }) => {
  const text = "Less noise.";
  const chars = text.split("");
  const entryStart = 5;
  const charStagger = 3;
  const exitStart = 70;
  const exitEnd = 89;

  const exitOpacity = interpolate(frame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <div style={{ display: "flex" }}>
        {chars.map((char: string, i: number) => {
          const charStart = entryStart + i * charStagger;
          const progress = spring({
            frame: frame - charStart,
            fps: FPS,
            config: { damping: 14, stiffness: 120, mass: 0.8 },
          });
          const y = interpolate(progress, [0, 1], [40, 0]);
          const charOpacity = interpolate(progress, [0, 1], [0, 1]);
          return (
            <span
              key={i}
              style={{
                fontFamily: "Archivo",
                fontSize: 120,
                fontWeight: 700,
                color: foreground,
                transform: `translateY(${y}px)`,
                opacity: charOpacity,
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const MoreFocus: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 90;
  const entryDuration = 25;
  const exitStart = 70;
  const exitEnd = 89;

  const scale = interpolate(localFrame, [0, entryDuration], [2.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localFrame, [0, entryDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(localFrame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(localFrame, [0, entryDuration], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: opacity * exitOpacity,
      }}
    >
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 120,
          fontWeight: 700,
          color: secondary,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
        }}
      >
        More focus.
      </div>
    </AbsoluteFill>
  );
};

const BetterWork: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 180;
  const words = ["Better", "work,", "together."];
  const exitStart = 70;
  const exitEnd = 89;

  const exitOpacity = interpolate(localFrame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <div style={{ display: "flex", gap: 24 }}>
        {words.map((word: string, i: number) => {
          const wordStart = 5 + i * 10;
          const progress = spring({
            frame: localFrame - wordStart,
            fps: FPS,
            config: { damping: 16, stiffness: 100, mass: 1 },
          });
          const x = interpolate(progress, [0, 1], [80, 0]);
          const wordOpacity = interpolate(progress, [0, 1], [0, 1]);
          return (
            <span
              key={i}
              style={{
                fontFamily: "Archivo",
                fontSize: 100,
                fontWeight: 600,
                color: i === 2 ? accent : foreground,
                transform: `translateX(${x}px)`,
                opacity: wordOpacity,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FinalMessage: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 270;
  const entryDuration = 28;

  const taglineOpacity = interpolate(localFrame, [0, entryDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(localFrame, [0, entryDuration], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const relayDelay = 12;
  const relayDuration = 20;
  const relayOpacity = interpolate(
    localFrame,
    [relayDelay, relayDelay + relayDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const relayScale = interpolate(
    localFrame,
    [relayDelay, relayDelay + relayDuration],
    [0.9, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 72,
          fontWeight: 500,
          color: muted,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Make room for what matters.
      </div>
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 140,
          fontWeight: 800,
          color: accent,
          opacity: relayOpacity,
          transform: `scale(${relayScale})`,
          letterSpacing: 4,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        overflow: "hidden",
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <LessNoise frame={frame} />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <MoreFocus frame={frame} />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <BetterWork frame={frame} />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <FinalMessage frame={frame} />
      </Sequence>
    </AbsoluteFill>
  );
};