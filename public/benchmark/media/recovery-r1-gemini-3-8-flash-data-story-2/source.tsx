import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { palette } from "./contract";

const DATA = [
  { day: "Monday", value: 2 },
  { day: "Tuesday", value: 3 },
  { day: "Wednesday", value: 4 },
  { day: "Thursday", value: 3 },
  { day: "Friday", value: 5 },
];

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Act 1: 0 - 3s (frames 0 - 90)
  const act1Opacity = interpolate(frame, [0, 18, 72, 88], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act1Y = interpolate(frame, [0, 22], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Act 2: 3 - 9s (frames 90 - 270)
  const act2Opacity = interpolate(frame, [90, 104, 258, 270], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Act 3: 9 - 12s (frames 270 - 360)
  const act3Opacity = interpolate(frame, [270, 284], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act3Scale = interpolate(frame, [270, 288], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Safe chart bounds (>= 80px margins)
  const chartWidth = 1200;
  const chartHeight = 420;
  const chartLeft = (1920 - chartWidth) / 2;
  const chartTop = 290;
  const baselineY = chartTop + chartHeight;
  const barWidth = 120;
  const maxHours = 6;
  const pxPerHour = chartHeight / maxHours;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: "Archivo",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(184, 243, 107, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Act 1: Intro */}
      {frame < 90 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: act1Opacity,
            transform: `translateY(${act1Y}px)`,
            padding: 80,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(177, 180, 188, 0.28)",
              backgroundColor: "rgba(177, 180, 188, 0.08)",
              color: palette.muted,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Illustrative data
          </div>
          <h1
            style={{
              fontSize: 76,
              fontWeight: 800,
              margin: 0,
              letterSpacing: -2,
              color: palette.foreground,
              textAlign: "center",
            }}
          >
            A week with more focus
          </h1>
        </div>
      )}

      {/* Act 2: Bar Chart */}
      {frame >= 88 && frame < 272 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: act2Opacity,
          }}
        >
          {/* Section Header */}
          <div
            style={{
              position: "absolute",
              left: chartLeft,
              top: 130,
              right: chartLeft,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  color: palette.muted,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Focus Hours by Day
              </div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: -1,
                  color: palette.foreground,
                }}
              >
                Daily focus hours
              </div>
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(177, 180, 188, 0.25)",
                backgroundColor: "rgba(177, 180, 188, 0.08)",
                color: palette.muted,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Illustrative data
            </div>
          </div>

          {/* Grid lines and y-axis ticks */}
          {[0, 1, 2, 3, 4, 5, 6].map((tick) => {
            const yPos = baselineY - tick * pxPerHour;
            const isBaseline = tick === 0;
            return (
              <React.Fragment key={tick}>
                <div
                  style={{
                    position: "absolute",
                    left: chartLeft - 60,
                    top: yPos - 10,
                    width: 44,
                    textAlign: "right",
                    fontSize: 15,
                    fontWeight: 600,
                    color: isBaseline ? palette.foreground : palette.muted,
                  }}
                >
                  {tick}h
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: chartLeft,
                    top: yPos,
                    width: chartWidth,
                    height: isBaseline ? 2 : 1,
                    backgroundColor: isBaseline
                      ? "rgba(245, 245, 242, 0.45)"
                      : "rgba(177, 180, 188, 0.12)",
                  }}
                />
              </React.Fragment>
            );
          })}

          {/* Bars and labels */}
          {DATA.map((item, index) => {
            const startFrame = 100 + index * 8;
            const progress = spring({
              frame: frame - startFrame,
              fps: 30,
              config: { damping: 18, stiffness: 110 },
            });
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            const targetHeight = item.value * pxPerHour;
            const currentHeight = targetHeight * clampedProgress;
            const colCenterX = chartLeft + (index + 0.5) * (chartWidth / 5);
            const barX = colCenterX - barWidth / 2;
            const barY = baselineY - currentHeight;

            return (
              <React.Fragment key={item.day}>
                {/* Numeric value label */}
                <div
                  style={{
                    position: "absolute",
                    left: colCenterX - 80,
                    top: barY - 44,
                    width: 160,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 4,
                    opacity: clampedProgress,
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: palette.foreground,
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: palette.muted,
                      lineHeight: 1,
                    }}
                  >
                    hours
                  </span>
                </div>

                {/* Bar */}
                <div
                  style={{
                    position: "absolute",
                    left: barX,
                    top: barY,
                    width: barWidth,
                    height: Math.max(currentHeight, 0),
                    backgroundColor: palette.accent,
                    borderRadius: "10px 10px 0 0",
                    boxShadow: "0 8px 24px rgba(184, 243, 107, 0.18)",
                  }}
                />

                {/* Day label below baseline */}
                <div
                  style={{
                    position: "absolute",
                    left: colCenterX - 80,
                    top: baselineY + 20,
                    width: 160,
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    color: palette.foreground,
                    letterSpacing: -0.2,
                  }}
                >
                  {item.day}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Act 3: Summary */}
      {frame >= 268 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: act3Opacity,
            transform: `scale(${act3Scale})`,
            padding: 80,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "64px 96px",
              borderRadius: 28,
              border: "1px solid rgba(245, 245, 242, 0.12)",
              backgroundColor: "rgba(245, 245, 242, 0.02)",
            }}
          >
            {/* Relay */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  backgroundColor: palette.accent,
                }}
              />
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: -0.8,
                  color: palette.foreground,
                }}
              >
                Relay
              </span>
            </div>

            {/* Final message */}
            <div
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: -2,
                color: palette.foreground,
                textAlign: "center",
                lineHeight: 1.15,
              }}
            >
              <span style={{ color: palette.accent }}>17 hours</span> of focused
              work
            </div>
          </div>
        </div>
      )}
    </div>
  );
};