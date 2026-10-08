import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./contract";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const FONT = "Archivo";

const Reveal: React.FC<{
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, y = 28, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200, mass: 0.8 },
  });
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
  return (
    <div
      style={{
        ...style,
        opacity,
        transform: `translateY(${(1 - p) * y}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Mark: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      backgroundColor: palette.accent,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: size * 0.11,
      paddingLeft: size * 0.22,
      boxSizing: "border-box",
      flexShrink: 0,
    }}
  >
    {[0.5, 0.32, 0.18].map((w, i) => (
      <div
        key={i}
        style={{
          width: size * w,
          height: size * 0.09,
          borderRadius: size,
          backgroundColor: palette.background,
        }}
      />
    ))}
  </div>
);

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 360) * Math.PI * 2) * 3;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(1200px 900px at ${
            48 + drift
          }% 34%, rgba(184,243,107,0.15), rgba(16,17,20,0) 70%), radial-gradient(1100px 800px at ${
            52 - drift
          }% 72%, rgba(120,185,237,0.13), rgba(16,17,20,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,245,242,0.04) 1px, rgba(0,0,0,0) 1px), linear-gradient(90deg, rgba(245,245,242,0.04) 1px, rgba(0,0,0,0) 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [76, 90], [0, 1], clamp);
  const letters = "Relay".split("");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 80,
        boxSizing: "border-box",
        opacity: 1 - exit,
        transform: `translateY(${-30 * exit}px)`,
      }}
    >
      <Reveal delay={0} y={40} style={{ marginBottom: 40 }}>
        <Mark size={72} />
      </Reveal>
      <div style={{ display: "flex" }}>
        {letters.map((ch, i) => {
          const d = 4 + i * 3;
          const p = spring({
            frame: Math.max(0, frame - d),
            fps,
            config: { damping: 200, mass: 0.8 },
          });
          const opacity = interpolate(frame, [d, d + 10], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: FONT,
                fontSize: 200,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: palette.foreground,
                opacity,
                transform: `translateY(${(1 - p) * 70}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <Reveal delay={26} y={22} style={{ marginTop: 34 }}>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 400,
            color: palette.muted,
          }}
        >
          Make room for focused work
        </span>
      </Reveal>
    </AbsoluteFill>
  );
};

const Panel: React.FC<{
  title: string;
  tone: string;
  delay: number;
  children: React.ReactNode;
}> = ({ title, tone, delay, children }) => (
  <Reveal delay={delay} y={34} style={{ flex: 1, minWidth: 0 }}>
    <div
      style={{
        height: 560,
        borderRadius: 28,
        border: "1px solid rgba(245,245,242,0.10)",
        background: "rgba(245,245,242,0.035)",
        display: "flex",
        flexDirection: "column",
        padding: 32,
        boxSizing: "border-box",
        gap: 26,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            backgroundColor: tone,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 600,
            color: palette.foreground,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {children}
      </div>
    </div>
  </Reveal>
);

const WeekBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const days = ["M", "T", "W", "T", "F"];
  const plan = [2, 3, 2, 2, 3];
  const toneFor = (i: number, j: number) => {
    if ((i * 3 + j) % 5 === 0) return palette.accent;
    if ((i + j) % 4 === 1) return palette.secondary;
    return "rgba(245,245,242,0.16)";
  };
  return (
    <div style={{ display: "flex", gap: 12, height: "100%" }}>
      {days.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 18,
              textAlign: "center",
              color: palette.muted,
            }}
          >
            {d}
          </span>
          {Array.from({ length: plan[i] }).map((_, j) => {
            const delay = 8 + i * 5 + j * 4;
            const opacity = interpolate(frame, [delay, delay + 10], [0, 1], clamp);
            const s = interpolate(frame, [delay, delay + 12], [0.9, 1], clamp);
            return (
              <div
                key={j}
                style={{
                  height: j === 0 ? 60 : 36,
                  borderRadius: 10,
                  backgroundColor: toneFor(i, j),
                  opacity,
                  transform: `scale(${s})`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const FocusTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [12, 42], [0, 1], clamp);
  const rows = 6;
  return (
    <div style={{ display: "flex", height: "100%", gap: 20 }}>
      <div
        style={{
          width: 10,
          borderRadius: 10,
          backgroundColor: "rgba(245,245,242,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "16%",
            height: "46%",
            borderRadius: 10,
            backgroundColor: palette.accent,
            transform: `scaleY(${fill})`,
            transformOrigin: "top",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {Array.from({ length: rows }).map((_, i) => {
          const isFocus = i === 1 || i === 2;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: 12,
                background: isFocus
                  ? "rgba(184,243,107,0.16)"
                  : "rgba(245,245,242,0.07)",
                border: isFocus
                  ? `1px solid ${palette.accent}`
                  : "1px solid rgba(245,245,242,0.08)",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                opacity: interpolate(
                  frame,
                  [6 + i * 4, 16 + i * 4],
                  [0, 1],
                  clamp
                ),
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 19,
                  color: isFocus ? palette.accent : palette.muted,
                }}
              >
                {isFocus ? "Focus" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProgressBars: React.FC = () => {
  const frame = useCurrentFrame();
  const values = [0.45, 0.72, 0.58, 1];
  const labels = ["M", "T", "W", "T"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 22,
        height: "100%",
        paddingBottom: 6,
        boxSizing: "border-box",
      }}
    >
      {values.map((v, i) => {
        const p = interpolate(frame, [10 + i * 6, 34 + i * 6], [0, v], clamp);
        const done = p >= 0.999;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${p * 84}%`,
                borderRadius: 12,
                backgroundColor: done
                  ? palette.secondary
                  : "rgba(120,185,237,0.45)",
              }}
            />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 20,
                color: palette.muted,
              }}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [168, 180], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        boxSizing: "border-box",
        opacity: 1 - exit,
        transform: `translateY(${24 * exit}px)`,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 36,
          alignItems: "stretch",
        }}
      >
        <Panel title="Plan together" tone={palette.accent} delay={4}>
          <WeekBoard />
        </Panel>
        <Panel title="Protect focus time" tone={palette.accent} delay={26}>
          <FocusTimeline />
        </Panel>
        <Panel title="See progress" tone={palette.secondary} delay={48}>
          <ProgressBars />
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = [
    { text: "Start your next week", color: palette.foreground, delay: 4 },
    { text: "with Relay", color: palette.accent, delay: 14 },
  ];
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 80,
        boxSizing: "border-box",
      }}
    >
      <Reveal delay={0} y={30} style={{ marginBottom: 36 }}>
        <Mark size={64} />
      </Reveal>
      {lines.map((l, i) => {
        const p = spring({
          frame: Math.max(0, frame - l.delay),
          fps,
          config: { damping: 200, mass: 0.9 },
        });
        const opacity = interpolate(
          frame,
          [l.delay, l.delay + 12],
          [0, 1],
          clamp
        );
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              color: l.color,
              opacity,
              transform: `translateY(${(1 - p) * 44}px)`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.background, fontFamily: FONT }}
    >
      <Backdrop />
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Demo />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};