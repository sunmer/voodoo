import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { palette } from "./contract";

const DATA = [
  { day: "Monday", hours: 2 },
  { day: "Tuesday", hours: 3 },
  { day: "Wednesday", hours: 4 },
  { day: "Thursday", hours: 3 },
  { day: "Friday", hours: 5 },
];

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Scene 1: Frames 0 to 90 (0 to 3s)
  const s1Opacity = interpolate(frame, [0, 18, 72, 88], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1TranslateY = interpolate(frame, [0, 18, 72, 88], [24, 0, 0, -16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2: Frames 86 to 275 (3s to 9s)
  const s2Opacity = interpolate(frame, [86, 100, 264, 274], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2TranslateY = interpolate(frame, [86, 100], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 3: Frames 270 to 360 (9s to 12s)
  // Reaches steady-state by frame 290 and remains stable through frame 360 (70 frames = 2.33s)
  const s3Opacity = interpolate(frame, [272, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s3TranslateY = interpolate(frame, [272, 290], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s3Scale = interpolate(frame, [272, 290], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar chart geometric parameters
  const plotWidth = 1260;
  const plotHeight = 420; // 0 to 6 linear scale => 70px per hour
  const maxHours = 6;
  const hourStepHeight = plotHeight / maxHours; // 70px

  const barWidth = 140;
  const barCount = DATA.length;
  const totalBarsWidth = barCount * barWidth; // 700px
  const availableSpacing = plotWidth - totalBarsWidth; // 560px
  const barGap = availableSpacing / (barCount - 1); // 140px

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: "Archivo, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background visual depth */}
      <div
        style={{
          position: "absolute",
          top: -240,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1300,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(184, 243, 107, 0.07) 0%, rgba(16, 17, 20, 0) 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Persistent top bar within safe margin */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: palette.accent,
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: palette.foreground,
            }}
          >
            RELAY
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: palette.muted,
            textTransform: "uppercase",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          Focus Benchmark
        </div>
      </div>

      {/* SCENE 1: Introduction (Frames 0 to 90) */}
      {frame < 92 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: s1Opacity,
            transform: `translateY(${s1TranslateY}px)`,
            padding: 80,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 24,
              backgroundColor: "rgba(184, 243, 107, 0.1)",
              border: `1px solid rgba(184, 243, 107, 0.3)`,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: palette.accent,
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: palette.accent,
                textTransform: "uppercase",
              }}
            >
              Relay
            </span>
          </div>

          <h1
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.1,
              textAlign: "center",
              margin: "0 0 24px 0",
              letterSpacing: "-0.02em",
              maxWidth: 1100,
              color: palette.foreground,
            }}
          >
            A week with more focus
          </h1>

          <p
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: palette.muted,
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Illustrative data
          </p>
        </div>
      )}

      {/* SCENE 2: Bar Chart (Frames 86 to 275) */}
      {frame >= 86 && frame < 276 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: s2Opacity,
            transform: `translateY(${s2TranslateY}px)`,
            padding: "100px 80px 80px 80px",
          }}
        >
          <div
            style={{
              width: 1540,
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 28,
              padding: "40px 50px 45px 50px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
              position: "relative",
            }}
          >
            {/* Header info row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 44,
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                paddingBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: palette.secondary,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Focus Hours by Day
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    color: palette.foreground,
                  }}
                >
                  A week with more focus
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 16,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: palette.muted }}>
                    Scale:
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: palette.foreground }}>
                    Linear (0–6 hrs)
                  </span>
                </div>

                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: 16,
                    backgroundColor: "rgba(184, 243, 107, 0.08)",
                    border: `1px solid rgba(184, 243, 107, 0.25)`,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: palette.accent }}>
                    Illustrative data
                  </span>
                </div>
              </div>
            </div>

            {/* Plot Area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: plotHeight + 70,
                display: "flex",
              }}
            >
              {/* Y-Axis Column */}
              <div
                style={{
                  width: 60,
                  height: plotHeight,
                  position: "relative",
                  marginRight: 24,
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((tick) => {
                  const yPos = plotHeight - tick * hourStepHeight;
                  return (
                    <div
                      key={tick}
                      style={{
                        position: "absolute",
                        top: yPos - 11,
                        right: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        color: tick === 0 ? palette.foreground : palette.muted,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {tick}h
                    </div>
                  );
                })}
              </div>

              {/* Main Chart Canvas */}
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  height: plotHeight,
                }}
              >
                {/* Horizontal Gridlines & Common Zero Baseline */}
                {[0, 1, 2, 3, 4, 5, 6].map((tick) => {
                  const yPos = plotHeight - tick * hourStepHeight;
                  const isBaseline = tick === 0;
                  return (
                    <div
                      key={tick}
                      style={{
                        position: "absolute",
                        top: yPos,
                        left: 0,
                        right: 0,
                        height: isBaseline ? 2 : 1,
                        backgroundColor: isBaseline
                          ? "rgba(245, 245, 242, 0.45)"
                          : "rgba(177, 180, 188, 0.12)",
                        zIndex: 1,
                      }}
                    />
                  );
                })}

                {/* Bars, Values, and Day Labels */}
                {DATA.map((item, index) => {
                  const xPos = index * (barWidth + barGap);
                  const targetHeight = item.hours * hourStepHeight;

                  // Staggered Spring: starts at frame 98 + index*6. All bars fully settle by ~146.
                  // Static readability holds from frame 146 to 264 (>3.9 seconds, well over 2s requirement).
                  const barStartFrame = 98 + index * 6;
                  const barProgress =
                    frame < barStartFrame
                      ? 0
                      : spring({
                          frame: frame - barStartFrame,
                          fps,
                          config: {
                            damping: 18,
                            mass: 0.8,
                            stiffness: 120,
                          },
                        });

                  const currentHeight = targetHeight * barProgress;
                  const isFriday = item.day === "Friday";

                  return (
                    <React.Fragment key={item.day}>
                      {/* The Bar */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: xPos,
                          width: barWidth,
                          height: currentHeight,
                          background: isFriday
                            ? `linear-gradient(180deg, ${palette.accent} 0%, rgba(184, 243, 107, 0.65) 100%)`
                            : `linear-gradient(180deg, ${palette.secondary} 0%, rgba(120, 185, 237, 0.6) 100%)`,
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          boxShadow: isFriday
                            ? "0 0 30px rgba(184, 243, 107, 0.2)"
                            : "0 0 20px rgba(120, 185, 237, 0.15)",
                          zIndex: 2,
                        }}
                      >
                        {/* Crisp top cap */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            backgroundColor: isFriday ? "#D8FFA8" : "#A3D4FF",
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                          }}
                        />
                      </div>

                      {/* Exact Value Badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: currentHeight + 14,
                          left: xPos + (barWidth - 110) / 2,
                          width: 110,
                          height: 38,
                          borderRadius: 19,
                          backgroundColor: "rgba(16, 17, 20, 0.95)",
                          border: `1px solid ${
                            isFriday
                              ? "rgba(184, 243, 107, 0.45)"
                              : "rgba(120, 185, 237, 0.4)"
                          }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          opacity: interpolate(barProgress, [0, 0.4, 1], [0, 0.8, 1], {
                            extrapolateRight: "clamp",
                          }),
                          zIndex: 3,
                          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: isFriday ? palette.accent : palette.secondary,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {item.hours}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: palette.muted,
                          }}
                        >
                          hrs
                        </span>
                      </div>

                      {/* Day Label (Below baseline) */}
                      <div
                        style={{
                          position: "absolute",
                          top: plotHeight + 20,
                          left: xPos - 20,
                          width: barWidth + 40,
                          textAlign: "center",
                          fontSize: 22,
                          fontWeight: 700,
                          color: palette.foreground,
                          letterSpacing: "0.01em",
                          zIndex: 2,
                        }}
                      >
                        {item.day}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 3: Final Statement (Frames 270 to 360) */}
      {/* Settles by frame 290 and remains completely readable through frame 360 (>2 seconds) */}
      {frame >= 270 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: s3Opacity,
            transform: `translateY(${s3TranslateY}px) scale(${s3Scale})`,
            padding: 80,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: 30,
              backgroundColor: "rgba(184, 243, 107, 0.12)",
              border: `1px solid rgba(184, 243, 107, 0.35)`,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: palette.accent,
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: palette.accent,
                textTransform: "uppercase",
              }}
            >
              Weekly Total
            </span>
          </div>

          <h1
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.15,
              textAlign: "center",
              margin: "0 0 44px 0",
              letterSpacing: "-0.025em",
              maxWidth: 1200,
              color: palette.foreground,
            }}
          >
            <span style={{ color: palette.accent }}>17 hours</span> of focused work
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "16px 36px",
              borderRadius: 24,
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                backgroundColor: palette.accent,
                transform: "rotate(45deg)",
              }}
            />
            <span
              style={{
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "0.22em",
                color: palette.foreground,
              }}
            >
              Relay
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
