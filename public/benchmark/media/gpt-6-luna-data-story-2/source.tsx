import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame } from "remotion";
import { palette } from "./contract";

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 4, 18) * (1 - fade(frame, 78, 90));
  const rise = interpolate(frame, [0, 22], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", border: `1px solid ${palette.secondary}`, opacity: 0.08, left: -250, top: 250 }} />
      <div style={{ position: "absolute", width: 430, height: 430, borderRadius: "50%", border: `1px solid ${palette.accent}`, opacity: 0.08, right: -180, bottom: 70 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${rise}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 34, opacity: fade(frame, 8, 23) }}>
          <div style={{ width: 34, height: 3, backgroundColor: palette.accent, borderRadius: 3 }} />
          <div style={{ color: palette.secondary, fontSize: 23, fontWeight: 600, letterSpacing: 1.2 }}>Illustrative data</div>
          <div style={{ width: 34, height: 3, backgroundColor: palette.accent, borderRadius: 3 }} />
        </div>
        <div style={{ color: palette.foreground, fontSize: 82, lineHeight: 1.08, fontWeight: 650, letterSpacing: -2.5, textAlign: "center" }}>
          A week with more focus
        </div>
        <div style={{ width: 112, height: 5, borderRadius: 5, marginTop: 42, background: `linear-gradient(90deg, ${palette.secondary}, ${palette.accent})`, transform: `scaleX(${interpolate(frame, [15, 38], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }} />
      </div>
    </AbsoluteFill>
  );
};

const FocusChart: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = 1 - fade(frame, 168, 180);
  const days = [
    { day: "Monday", value: 2 },
    { day: "Tuesday", value: 3 },
    { day: "Wednesday", value: 4 },
    { day: "Thursday", value: 3 },
    { day: "Friday", value: 5 },
  ];
  const centers = [500, 790, 1080, 1370, 1660];
  const baseY = 760;
  const maxHeight = 400;
  const barWidth = 148;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <div style={{ position: "absolute", top: 88, left: 0, width: "100%", textAlign: "center", opacity: fade(frame, 3, 16) }}>
        <div style={{ fontSize: 55, lineHeight: 1.1, fontWeight: 650, letterSpacing: -1.5, color: palette.foreground }}>Focus hours</div>
        <div style={{ marginTop: 14, fontSize: 22, fontWeight: 500, letterSpacing: 0.7, color: palette.secondary }}>Illustrative data</div>
      </div>

      {[0, 1, 2, 3, 4, 5].map((tick) => {
        const y = baseY - (tick / 5) * maxHeight;
        return (
          <React.Fragment key={`grid-${tick}`}>
            <div style={{ position: "absolute", left: 355, top: y, width: 1385, height: tick === 0 ? 2 : 1, backgroundColor: tick === 0 ? palette.muted : palette.muted, opacity: tick === 0 ? 0.38 : 0.14 }} />
            <div style={{ position: "absolute", left: 292, top: y - 15, width: 40, textAlign: "right", color: palette.muted, fontSize: 19, lineHeight: "30px", opacity: fade(frame, 8, 22) * sceneOpacity }}>{tick}</div>
          </React.Fragment>
        );
      })}

      {days.map(({ day, value }, index) => {
        const progress = Math.max(
          0,
          Math.min(
            1,
            spring({
              frame: Math.max(0, frame - (8 + index * 5)),
              fps: 30,
              config: { damping: 25, stiffness: 105, mass: 0.85 },
            }),
          ),
        );
        const height = (value / 5) * maxHeight * progress;
        const top = baseY - height;
        const labelOpacity = fade(frame, 24, 38) * sceneOpacity;
        return (
          <React.Fragment key={day}>
            <div
              style={{
                position: "absolute",
                left: centers[index] - barWidth / 2,
                top,
                width: barWidth,
                height,
                borderRadius: "13px 13px 4px 4px",
                background: `linear-gradient(180deg, ${palette.accent}, rgba(184, 243, 107, 0.76))`,
                boxShadow: "0 0 36px rgba(184, 243, 107, 0.10)",
              }}
            />
            <div style={{ position: "absolute", left: centers[index] - 100, top: Math.max(284, top - 58), width: 200, textAlign: "center", color: palette.foreground, fontSize: 30, lineHeight: "38px", fontWeight: 650, opacity: labelOpacity }}>
              {value}h
            </div>
            <div style={{ position: "absolute", left: centers[index] - 120, top: 806, width: 240, textAlign: "center", color: palette.foreground, fontSize: 25, lineHeight: "36px", fontWeight: 550, opacity: labelOpacity }}>
              {day}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 2, 16);
  const rise = interpolate(frame, [0, 20], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${rise}px)` }}>
        <div style={{ marginBottom: 34, color: palette.secondary, fontSize: 21, fontWeight: 600, letterSpacing: 1.3 }}>Illustrative data</div>
        <div style={{ color: palette.accent, fontSize: 112, lineHeight: 1.04, fontWeight: 700, letterSpacing: -3 }}>17 hours</div>
        <div style={{ marginTop: 12, color: palette.foreground, fontSize: 58, lineHeight: 1.15, fontWeight: 550, letterSpacing: -1 }}>of focused work</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 58 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 27 }}>
            <div style={{ width: 7, height: 17, borderRadius: 4, backgroundColor: palette.secondary }} />
            <div style={{ width: 7, height: 27, borderRadius: 4, backgroundColor: palette.accent }} />
            <div style={{ width: 7, height: 21, borderRadius: 4, backgroundColor: palette.secondary }} />
          </div>
          <div style={{ color: palette.foreground, fontSize: 31, lineHeight: 1, fontWeight: 650, letterSpacing: 0.2 }}>Relay</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.background,
      color: palette.foreground,
      fontFamily: "Archivo",
      overflow: "hidden",
    }}
  >
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(120, 185, 237, 0.07), transparent 58%)` }} />
    <Sequence from={0} durationInFrames={90}>
      <IntroScene />
    </Sequence>
    <Sequence from={90} durationInFrames={180}>
      <FocusChart />
    </Sequence>
    <Sequence from={270} durationInFrames={90}>
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
