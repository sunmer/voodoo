import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./contract";

const FONT = "Archivo";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const io = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], clamp);

const Glow: React.FC<{ color: string; size: number; x: string; y: string }> = ({
  color,
  size,
  x,
  y,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity: 0.16,
    }}
  />
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const bar = io(frame, 22, 58);
  const sub = io(frame, 32, 58);
  const out = io(frame, 76, 90);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - out,
      }}
    >
      <Glow color={palette.accent} size={1100} x="50%" y="52%" />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 156,
          fontWeight: 800,
          letterSpacing: -5,
          color: palette.foreground,
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [26, 0])}px) scale(${interpolate(
            pop,
            [0, 1],
            [0.94, 1],
          )})`,
        }}
      >
        Relay
      </div>
      <div
        style={{
          width: 300 * bar,
          height: 6,
          borderRadius: 3,
          background: palette.accent,
          marginTop: 30,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 500,
          color: palette.muted,
          marginTop: 30,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 16}px)`,
        }}
      >
        Make room for focused work
      </div>
    </AbsoluteFill>
  );
};

const TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const TILE_W = 155;
const TILE_H = 84;
const GAP = 12;

const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const win = io(frame, 0, 18);
  const focus = io(frame, 68, 92);
  const progress = io(frame, 128, 166);

  return (
    <div
      style={{
        width: 880,
        borderRadius: 26,
        background: "#181A1F",
        border: `1px solid ${palette.muted}33`,
        padding: 28,
        opacity: win,
        transform: `translateY(${(1 - win) * 30}px)`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        {[palette.muted, palette.muted, palette.muted].map((c, i) => (
          <div
            key={i}
            style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.6 }}
          />
        ))}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 500,
            color: palette.muted,
            marginLeft: 14,
            letterSpacing: 1,
          }}
        >
          WEEK 32
        </div>
      </div>

      <div style={{ position: "relative", width: TILE_W * 5 + GAP * 4, height: TILE_H * 3 + GAP * 2 }}>
        {TILES.map((i) => {
          const a = io(frame, 8 + i * 3, 24 + i * 3);
          const col = i % 5;
          const row = Math.floor(i / 5);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: col * (TILE_W + GAP),
                top: row * (TILE_H + GAP),
                width: TILE_W,
                height: TILE_H,
                borderRadius: 12,
                background: "#22252C",
                border: `1px solid ${palette.muted}22`,
                opacity: a,
                transform: `scale(${interpolate(a, [0, 1], [0.9, 1])})`,
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: TILE_W + GAP,
            top: 0,
            width: TILE_W,
            height: TILE_H * 2 + GAP,
            borderRadius: 12,
            background: `${palette.accent}2E`,
            border: `2px solid ${palette.accent}`,
            opacity: focus,
            transform: `scale(${interpolate(focus, [0, 1], [0.94, 1])})`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 12,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 600,
              color: palette.accent,
              opacity: focus,
            }}
          >
            Focus time
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 26 }}>
        <div style={{ fontFamily: FONT, fontSize: 22, color: palette.muted, fontWeight: 500 }}>
          Progress
        </div>
        <div
          style={{
            flex: 1,
            height: 10,
            borderRadius: 5,
            background: "#2A2E36",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 72}%`,
              height: "100%",
              borderRadius: 5,
              background: palette.secondary,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 600,
            color: palette.secondary,
            width: 70,
            textAlign: "right",
            opacity: progress,
          }}
        >
          {Math.round(progress * 72)}%
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{
  title: string;
  color: string;
  frame: number;
  start: number;
}> = ({ title, color, frame, start }) => {
  const a = io(frame, start, start + 18);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: a,
        transform: `translateX(${(1 - a) * -34}px)`,
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: 8, background: color }} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 56,
          fontWeight: 600,
          color: palette.foreground,
        }}
      >
        {title}
      </div>
    </div>
  );
};

const Product: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        padding: 80,
        flexDirection: "row",
        alignItems: "center",
        gap: 70,
        boxSizing: "border-box",
        opacity: interpolate(enter, [0, 1], [0, 1]),
      }}
    >
      <div style={{ width: 660 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 4,
            color: palette.accent,
            marginBottom: 34,
          }}
        >
          RELAY
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 42 }}>
          <Feature title="Plan together" color={palette.accent} frame={frame} start={12} />
          <Feature title="Protect focus time" color={palette.accent} frame={frame} start={72} />
          <Feature title="See progress" color={palette.secondary} frame={frame} start={132} />
        </div>
      </div>
      <Panel />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const title = io(frame, 0, 24);
  const bar = io(frame, 16, 44);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Glow color={palette.accent} size={1200} x="50%" y="50%" />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2,
          color: palette.foreground,
          textAlign: "center",
          padding: "0 80px",
          opacity: title,
          transform: `translateY(${(1 - title) * 26}px)`,
        }}
      >
        Start your next week with{" "}
        <span style={{ color: palette.accent }}>Relay</span>
      </div>
      <div
        style={{
          width: 160 * bar,
          height: 6,
          borderRadius: 3,
          background: palette.accent,
          marginTop: 40,
        }}
      />
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: palette.background }}>
      <Sequence durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Product />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};