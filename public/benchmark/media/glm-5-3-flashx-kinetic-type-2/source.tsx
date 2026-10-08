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

const FONT = "Archivo, sans-serif";

// Deterministic pseudo-random from an integer seed (no Math.random)
const seeded = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ------------------------------------------------------------------
// Phrase 1 (frames 0-90): "Less noise." — letters fly in from chaos,
// then scatter back out into noise on exit.
// ------------------------------------------------------------------
const Phrase1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = "Less noise.";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {text.split("").map((ch, i) => {
        const delay = i * 1.4;
        const enter = spring({
          frame: frame - delay,
          fps,
          config: { damping: 13, stiffness: 110 },
        });

        const startX = (seeded(i * 3 + 1) - 0.5) * 1600;
        const startY = (seeded(i * 7 + 2) - 0.5) * 900;
        const startRot = (seeded(i * 11 + 3) - 0.5) * 160;

        const exitX = (seeded(i * 5 + 4) - 0.5) * 1300;
        const exitY = (seeded(i * 9 + 5) - 0.5) * 800;
        const exitRot = (seeded(i * 13 + 6) - 0.5) * 140;

        const exit = interpolate(frame, [76, 90], [0, 1], clampOpts);

        const opacity = interpolate(
          frame,
          [delay, delay + 8, 76, 87],
          [0, 1, 1, 0],
          clampOpts
        );

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 168,
              letterSpacing: "-0.02em",
              color: ch === "." ? palette.accent : palette.foreground,
              opacity,
              transform: `translate(${startX * (1 - enter) + exitX * exit}px, ${
                startY * (1 - enter) + exitY * exit
              }px) rotate(${
                startRot * (1 - enter) + exitRot * exit
              }deg) scale(${0.7 + 0.3 * enter})`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Phrase 2 (frames 90-180): "More focus." — a focus pull: letters
// start wide, blurred and faint, then converge and sharpen.
// ------------------------------------------------------------------
const Phrase2: React.FC = () => {
  const frame = useCurrentFrame();
  const text = "More focus.";
  const n = text.length;
  const mid = (n - 1) / 2;

  const exit = interpolate(frame, [78, 90], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {text.split("").map((ch, i) => {
        const p = interpolate(frame, [3, 38], [0, 1], clampOpts);
        const e = Easing.out(Easing.cubic)(p);

        const x = (i - mid) * 95 * (1 - e);
        const blur = 16 * (1 - e);
        const scale = 1.08 - 0.08 * e;

        const opacity =
          interpolate(frame, [0, 12], [0, 1], clampOpts) * (1 - exit);

        const color =
          ch === "."
            ? palette.accent
            : i >= 5
            ? palette.secondary
            : palette.foreground;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 168,
              letterSpacing: "-0.02em",
              color,
              opacity,
              filter: `blur(${blur}px)`,
              transform: `translateX(${x}px) scale(${scale})`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Phrase 3 (frames 180-270): "Better work, together." — words converge
// from opposite directions, like collaborators meeting in the middle.
// ------------------------------------------------------------------
const Phrase3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = interpolate(frame, [76, 90], [0, 1], clampOpts);
  const exitEase = Easing.in(Easing.cubic)(exit);

  const wordStyle = (
    delay: number,
    dx: number,
    dy: number,
    color: string
  ): React.CSSProperties => {
    const enter = spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, stiffness: 100 },
    });
    const opacity =
      interpolate(frame, [delay, delay + 8], [0, 1], clampOpts) *
      (1 - exitEase);
    return {
      display: "inline-block",
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 150,
      letterSpacing: "-0.02em",
      lineHeight: 1.15,
      color,
      opacity,
      transform: `translate(${dx * (1 - enter)}px, ${
        dy * (1 - enter) - 120 * exitEase
      }px)`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <span style={wordStyle(0, -750, 0, palette.foreground)}>
            Better
          </span>
          <span style={{ display: "inline-block", width: 44 }} />
          <span style={wordStyle(6, 750, 0, palette.foreground)}>
            work,
          </span>
        </div>
        <div>
          <span style={wordStyle(14, 0, 320, palette.accent)}>
            together.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Phrase 4 (frames 270-360): "Make room for what matters." with
// "Relay". Everything settles completely by frame 30 of the sequence
// (global frame 300), then holds perfectly still for the final 2s.
// ------------------------------------------------------------------
const Phrase4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subOpacity = interpolate(frame, [0, 14], [0, 1], clampOpts);
  const subY = interpolate(
    frame,
    [0, 14],
    [28, 0],
    { ...clampOpts, easing: Easing.out(Easing.cubic) }
  );

  const relayEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 130 },
  });

  const underline = interpolate(frame, [18, 30], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 74,
            letterSpacing: "0.01em",
            color: palette.muted,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          Make room for what matters.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 195,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: palette.foreground,
              opacity: relayEnter,
              transform: `scale(${0.82 + 0.18 * relayEnter})`,
            }}
          >
            Relay
          </div>
          <div
            style={{
              width: 400,
              height: 10,
              marginTop: 22,
              borderRadius: 5,
              backgroundColor: palette.accent,
              transform: `scaleX(${underline})`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Progress dots: four marks along the bottom, one per phrase.
// ------------------------------------------------------------------
const ProgressDots: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = Math.min(3, Math.floor(frame / 90));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 108,
      }}
    >
      <div style={{ display: "flex", gap: 26 }}>
        {[0, 1, 2, 3].map((i) => {
          const pop = spring({
            frame: frame - 90 * i,
            fps,
            config: { damping: 16, stiffness: 160 },
          });
          const isActive = i === active;
          return (
            <div
              key={i}
              style={{
                width: isActive ? 46 : 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: isActive
                  ? palette.accent
                  : "rgba(177, 180, 188, 0.35)",
                transform: `scale(${0.6 + 0.4 * Math.min(1, pop)})`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Root composition
// ------------------------------------------------------------------
export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        fontFamily: FONT,
      }}
    >
      <Sequence durationInFrames={90}>
        <Phrase1 />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Phrase2 />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <Phrase3 />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Phrase4 />
      </Sequence>
      <ProgressDots />
    </AbsoluteFill>
  );
};
