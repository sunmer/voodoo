import React from "react";
import { useCurrentFrame, interpolate, spring, Sequence, AbsoluteFill } from "remotion";
import { palette } from "./contract";

const { background, foreground, accent, secondary, muted } = palette;

const SAFE = 80;

function PhraseOne({ frame }: { frame: number }) {
  const text = "Less noise.";
  const letters = text.split("");
  const entryEnd = 30;
  const exitStart = 70;
  const exitEnd = 89;

  const exitOpacity = interpolate(frame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [exitStart, exitEnd], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        transform: `translateY(${exitY}px)`,
      }}
    >
      <div style={{ display: "flex", overflow: "hidden" }}>
        {letters.map((ch, i) => {
          const delay = i * 2;
          const progress = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 14, stiffness: 120 },
          });
          const x = interpolate(progress, [0, 1], [-120, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);
          return (
            <span
              key={i}
              style={{
                fontFamily: "Archivo",
                fontSize: 120,
                fontWeight: 700,
                color: foreground,
                transform: `translateX(${x}px)`,
                opacity,
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function PhraseTwo({ frame }: { frame: number }) {
  const localFrame = frame;
  const entryEnd = 30;
  const exitStart = 70;
  const exitEnd = 89;

  const scale = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  });

  const exitOpacity = interpolate(localFrame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(localFrame, [exitStart, exitEnd], [1, 1.15], {
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
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 120,
          fontWeight: 700,
          color: secondary,
          transform: `scale(${scale * exitScale})`,
          opacity: scale,
        }}
      >
        More focus.
      </div>
    </AbsoluteFill>
  );
}

function PhraseThree({ frame }: { frame: number }) {
  const words = ["Better", "work,", "together."];
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
      <div style={{ display: "flex", gap: 24 }}>
        {words.map((word, i) => {
          const delay = i * 10;
          const progress = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 13, stiffness: 100 },
          });
          const y = interpolate(progress, [0, 1], [80, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);
          return (
            <span
              key={i}
              style={{
                fontFamily: "Archivo",
                fontSize: 100,
                fontWeight: 600,
                color: i === 2 ? accent : foreground,
                transform: `translateY(${y}px)`,
                opacity,
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
}

function PhraseFour({ frame }: { frame: number }) {
  const entryDuration = 30;
  const progress = interpolate(frame, [0, entryDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  const relayDelay = 12;
  const relayProgress = interpolate(
    frame,
    [relayDelay, relayDelay + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const relayOpacity = relayProgress;
  const relayY = interpolate(relayProgress, [0, 1], [20, 0]);

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
          opacity,
          transform: `translateY(${y}px)`,
          textAlign: "center",
          padding: `0 ${SAFE}px`,
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
          transform: `translateY(${relayY}px)`,
          letterSpacing: "-2px",
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
}

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        padding: SAFE,
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <PhraseOne frame={frame} />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <PhraseTwo frame={frame - 90} />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <PhraseThree frame={frame - 180} />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <PhraseFour frame={frame - 270} />
      </Sequence>
    </AbsoluteFill>
  );
};