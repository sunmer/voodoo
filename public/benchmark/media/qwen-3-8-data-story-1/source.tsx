import React from "react";
import { useCurrentFrame, interpolate, spring, Sequence } from "remotion";
import { palette } from "./contract";

const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();

  const titleSpring = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
  });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [30, 50], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: palette.foreground,
          fontFamily: "Archivo",
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
        }}
      >
        A week with more focus
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: palette.muted,
          fontFamily: "Archivo",
          marginTop: 24,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Illustrative data
      </div>
    </div>
  );
};

const BarChartSection: React.FC = () => {
  const frame = useCurrentFrame();

  const days = [
    { label: "Monday", value: 2 },
    { label: "Tuesday", value: 3 },
    { label: "Wednesday", value: 4 },
    { label: "Thursday", value: 3 },
    { label: "Friday", value: 5 },
  ];

  const maxValue = 5;
  const chartHeight = 480;
  const barWidth = 160;
  const gap = 70;
  const totalWidth = days.length * barWidth + (days.length - 1) * gap;

  const chartTitleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: palette.foreground,
          fontFamily: "Archivo",
          marginBottom: 60,
          opacity: chartTitleOpacity,
        }}
      >
        Focus hours per day
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: gap,
          height: chartHeight + 100,
        }}
      >
        {days.map((day, i) => {
          const delay = 10 + i * 8;
          const barProgress = spring({
            frame: Math.max(0, frame - delay),
            fps: 30,
            config: { damping: 16, stiffness: 100 },
          });

          const barHeight = (day.value / maxValue) * chartHeight * barProgress;
          const labelOpacity = interpolate(frame, [delay + 5, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={day.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: chartHeight + 100,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: palette.accent,
                  fontFamily: "Archivo",
                  marginBottom: 10,
                  opacity: labelOpacity,
                }}
              >
                {day.value}
              </div>
              <div
                style={{
                  width: barWidth,
                  height: barHeight,
                  backgroundColor:
                    i % 2 === 0 ? palette.accent : palette.secondary,
                  borderRadius: "6px 6px 0 0",
                }}
              />
              <div
                style={{
                  width: barWidth,
                  height: 2,
                  backgroundColor: palette.muted,
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: palette.foreground,
                  fontFamily: "Archivo",
                  marginTop: 14,
                  opacity: labelOpacity,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {day.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OutroSection: React.FC = () => {
  const frame = useCurrentFrame();

  const mainSpring = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 100 },
  });

  const brandOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brandY = interpolate(frame, [20, 38], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: palette.foreground,
          fontFamily: "Archivo",
          textAlign: "center",
          opacity: mainSpring,
          transform: `translateY(${interpolate(mainSpring, [0, 1], [24, 0])}px)`,
        }}
      >
        17 hours of focused work
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: palette.accent,
          fontFamily: "Archivo",
          marginTop: 32,
          opacity: brandOpacity,
          transform: `translateY(${brandY}px)`,
        }}
      >
        Relay
      </div>
    </div>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: palette.background,
        fontFamily: "Archivo",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <IntroSection />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <BarChartSection />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <OutroSection />
      </Sequence>
    </div>
  );
};