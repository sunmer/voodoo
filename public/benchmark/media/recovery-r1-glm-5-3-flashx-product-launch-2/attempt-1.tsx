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

const FONT = "Archivo";

const withAlpha = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const clampedSpring = (frame: number, fps: number, delay: number, duration: number) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200, mass: 1 },
    durationInFrames: duration,
  });

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 87) * 30;
  const driftY = Math.cos(frame / 71) * 22;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        backgroundImage: `radial-gradient(900px 620px at ${72 + driftX / 10}% 18%, ${withAlpha(
          palette.accent,
          0.06
        )}, transparent 70%), radial-gradient(820px 700px at ${18 - driftX / 10}% ${86 + driftY / 12}%, ${withAlpha(
          palette.secondary,
          0.07
        )}, transparent 70%)`,
        backgroundPosition: `${driftX}px ${driftY}px`,
      }}
    />
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = clampedSpring(frame, fps, 0, 34);
  const dot = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 11, mass: 0.7 } });
  const tagline = clampedSpring(frame, fps, 22, 36);
  const exit = interpolate(frame, [80, 90], [1, 0], { easing: Easing.inOut(Easing.ease) });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 14,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [56, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 210,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: palette.foreground,
            }}
          >
            Relay
          </span>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              background: palette.accent,
              display: "inline-block",
              marginBottom: 24,
              transform: `scale(${dot})`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 46,
            color: palette.muted,
            letterSpacing: "0.01em",
            marginTop: 26,
            opacity: tagline,
            transform: `translateY(${interpolate(tagline, [0, 1], [24, 0])}px)`,
          }}
        >
          Make room for focused work
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AppFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = clampedSpring(frame, fps, 2, 30);
  return (
    <div
      style={{
        width: 760,
        height: 560,
        borderRadius: 26,
        background: "#17191E",
        border: `1px solid ${withAlpha(palette.foreground, 0.08)}`,
        boxShadow: `0 30px 80px ${withAlpha("#000000", 0.5)}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
      }}
    >
      <div
        style={{
          height: 58,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 24px",
          borderBottom: `1px solid ${withAlpha(palette.foreground, 0.07)}`,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 6, background: palette.accent }} />
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 18,
            color: palette.foreground,
            letterSpacing: "-0.01em",
          }}
        >
          Relay
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: withAlpha(palette.muted, i === 0 ? 0.5 : 0.25),
              }}
            />
          ))}
        </span>
      </div>
      <div style={{ flex: 1, padding: 26, display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
};

const FeatureSlide: React.FC<{ index: number; title: string; children: React.ReactNode }> = ({
  index,
  title,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = clampedSpring(frame, fps, 0, 30);
  const exit = interpolate(frame, [50, 60], [1, 0], { easing: Easing.in(Easing.ease) });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 0,
          bottom: 0,
          width: 640,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 700,
            color: palette.accent,
            letterSpacing: "0.22em",
            marginBottom: 20,
            opacity: enter,
          }}
        >
          {`0${index + 1}`}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 86,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: palette.foreground,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [36, 0])}px)`,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const TASKS = [
  { title: "Design review", day: "Mon", people: 3, color: palette.secondary },
  { title: "Write launch doc", day: "Tue", people: 2, color: palette.accent },
  { title: "Team sync", day: "Thu", people: 4, color: palette.secondary },
];

const PlanBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AppFrame>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 600,
          color: palette.muted,
          letterSpacing: "0.14em",
          marginBottom: 18,
        }}
      >
        THIS WEEK
      </div>
      {TASKS.map((task, i) => {
        const enter = clampedSpring(frame, fps, 10 + i * 9, 30);
        return (
          <div
            key={task.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "20px 22px",
              marginBottom: 16,
              borderRadius: 16,
              background: withAlpha(palette.foreground, 0.05),
              border: `1px solid ${withAlpha(palette.foreground, 0.08)}`,
              borderLeft: `5px solid ${task.color}`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 24,
                  fontWeight: 700,
                  color: palette.foreground,
                  letterSpacing: "-0.01em",
                }}
              >
                {task.title}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 500,
                  color: palette.muted,
                  marginTop: 6,
                }}
              >
                Shared with team
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {Array.from({ length: task.people }).map((_, p) => (
                <span
                  key={p}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginLeft: p === 0 ? 0 : -10,
                    background:
                      p % 2 === 0 ? withAlpha(palette.secondary, 0.55) : withAlpha(palette.accent, 0.55),
                    border: `2px solid #17191E`,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                color: withAlpha(palette.foreground, 0.8),
                padding: "6px 14px",
                borderRadius: 20,
                background: withAlpha(palette.foreground, 0.08),
              }}
            >
              {task.day}
            </div>
          </div>
        );
      })}
    </AppFrame>
  );
};

const DAYS = [
  {
    day: "Mon",
    blocks: [
      { s: 0.06, w: 0.2, focus: false },
      { s: 0.56, w: 0.28, focus: false },
    ],
  },
  {
    day: "Tue",
    blocks: [
      { s: 0.3, w: 0.42, focus: true },
      { s: 0.8, w: 0.14, focus: false },
    ],
  },
  { day: "Wed", blocks: [{ s: 0.18, w: 0.46, focus: true }] },
  {
    day: "Thu",
    blocks: [
      { s: 0.05, w: 0.15, focus: false },
      { s: 0.34, w: 0.44, focus: true },
    ],
  },
  {
    day: "Fri",
    blocks: [
      { s: 0.1, w: 0.2, focus: false },
      { s: 0.5, w: 0.2, focus: false },
    ],
  },
];

const FocusCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AppFrame>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: palette.accent }} />
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: palette.muted }}>Focus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: withAlpha(palette.secondary, 0.5) }} />
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: palette.muted }}>Meetings</span>
        </div>
      </div>
      {DAYS.map((row, i) => {
        const enter = clampedSpring(frame, fps, 8 + i * 7, 28);
        return (
          <div
            key={row.day}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 14,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
            }}
          >
            <div style={{ width: 48, fontFamily: FONT, fontSize: 16, fontWeight: 700, color: palette.muted }}>
              {row.day}
            </div>
            <div
              style={{
                position: "relative",
                flex: 1,
                height: 62,
                borderRadius: 12,
                background: withAlpha(palette.foreground, 0.04),
                border: `1px solid ${withAlpha(palette.foreground, 0.06)}`,
              }}
            >
              {row.blocks.map((b, bi) => {
                const bEnter = clampedSpring(frame, fps, 14 + i * 7 + bi * 4, 26);
                return (
                  <div
                    key={bi}
                    style={{
                      position: "absolute",
                      top: 8,
                      bottom: 8,
                      left: `${b.s * 100}%`,
                      width: `${b.w * 100}%`,
                      borderRadius: 8,
                      background: b.focus ? palette.accent : withAlpha(palette.secondary, 0.45),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scaleX(${interpolate(bEnter, [0, 1], [0.2, 1])})`,
                      transformOrigin: "left center",
                      opacity: bEnter,
                    }}
                  >
                    {b.focus ? (
                      <span
                        style={{
                          fontFamily: FONT,
                          fontSize: 16,
                          fontWeight: 800,
                          color: palette.background,
                          letterSpacing: "0.04em",
                        }}
                      >
                        Focus
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </AppFrame>
  );
};

const WEEK = [
  { day: "Mon", h: 0.24 },
  { day: "Tue", h: 0.4 },
  { day: "Wed", h: 0.52 },
  { day: "Thu", h: 0.68 },
  { day: "Fri", h: 0.86 },
];

const ProgressChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = clampedSpring(frame, fps, 6, 26);
  return (
    <AppFrame>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 600,
          color: palette.muted,
          letterSpacing: "0.14em",
          marginBottom: 18,
          opacity: label,
        }}
      >
        THIS WEEK
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 30, padding: "0 14px" }}>
        {WEEK.map((col, i) => {
          const enter = clampedSpring(frame, fps, 10 + i * 8, 32);
          const isLast = i === WEEK.length - 1;
          return (
            <div
              key={col.day}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              {isLast ? (
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    background: palette.accent,
                    marginBottom: 12,
                    opacity: enter,
                    transform: `scale(${enter})`,
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "100%",
                  height: `${col.h * 100}%`,
                  borderRadius: "12px 12px 6px 6px",
                  background: isLast ? palette.accent : withAlpha(palette.secondary, 0.55),
                  transform: `scaleY(${enter})`,
                  transformOrigin: "bottom center",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ height: 1, background: withAlpha(palette.foreground, 0.12), margin: "0 14px" }} />
      <div style={{ display: "flex", gap: 30, padding: "14px 14px 0" }}>
        {WEEK.map((col, i) => {
          const enter = clampedSpring(frame, fps, 14 + i * 8, 24);
          return (
            <div
              key={col.day}
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 17,
                fontWeight: 700,
                color: palette.muted,
                opacity: enter,
              }}
            >
              {col.day}
            </div>
          );
        })}
      </div>
    </AppFrame>
  );
};

const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(2, Math.floor(frame / 60));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 88,
        display: "flex",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {[0, 1, 2].map((i) => {
        const local = frame - i * 60;
        const width = local < 0 ? 20 : local >= 60 ? 44 : interpolate(local, [0, 10], [20, 44]);
        return (
          <div
            key={i}
            style={{
              width,
              height: 6,
              borderRadius: 3,
              background: i <= active ? palette.accent : withAlpha(palette.foreground, 0.15),
            }}
          />
        );
      })}
    </div>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = clampedSpring(frame, fps, 0, 24);
  const line = clampedSpring(frame, fps, 10, 30);
  const dot = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 11, mass: 0.7 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: palette.foreground,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [44, 0])}px)`,
          }}
        >
          Start your next week
          <br />
          with <span style={{ color: palette.accent }}>Relay</span>
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: 9,
              background: palette.accent,
              marginLeft: 10,
              transform: `scale(${dot})`,
            }}
          />
        </div>
        <div
          style={{
            height: 5,
            width: interpolate(line, [0, 1], [0, 240]),
            borderRadius: 3,
            background: palette.accent,
            margin: "40px auto 0",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, fontFamily: FONT }}>
      <Backdrop />
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <FeatureSlide index={0} title="Plan together">
          <PlanBoard />
        </FeatureSlide>
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <FeatureSlide index={1} title="Protect focus time">
          <FocusCalendar />
        </FeatureSlide>
      </Sequence>
      <Sequence from={210} durationInFrames={60}>
        <FeatureSlide index={2} title="See progress">
          <ProgressChart />
        </FeatureSlide>
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Steps />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};