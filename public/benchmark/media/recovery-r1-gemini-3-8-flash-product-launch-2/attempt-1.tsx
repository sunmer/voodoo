import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "./contract";

const FONT = "'Archivo', sans-serif";

const TEAM = [
  { initials: "AM", color: palette.accent },
  { initials: "SK", color: palette.secondary },
  { initials: "DR", color: palette.muted },
  { initials: "ET", color: palette.foreground },
];

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Transitions between acts
  // Act 1: 0 - 90 (0s - 3s)
  const act1Opacity = interpolate(frame, [0, 15, 75, 88], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act1Scale = interpolate(frame, [0, 20], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Act 2: 90 - 270 (3s - 9s)
  const act2Opacity = interpolate(frame, [88, 98, 262, 270], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stage in Act 2
  const stage = frame < 150 ? 0 : frame < 210 ? 1 : 2;

  // Act 2 spring transitions per stage
  const stage0Spring = spring({ frame: frame - 92, fps, config: { damping: 14 } });
  const stage1Spring = spring({ frame: frame - 150, fps, config: { damping: 14 } });
  const stage2Spring = spring({ frame: frame - 210, fps, config: { damping: 14 } });

  // Progress counter in stage 2
  const progressPercent = interpolate(frame, [212, 252], [35, 96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Act 3: 270 - 360 (9s - 12s)
  // Reaches full opacity by frame 286 (leaving 74 frames / 2.46s static and fully readable)
  const act3Opacity = interpolate(frame, [270, 286], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act3Spring = spring({
    frame: frame - 270,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(177, 180, 188, 0.1) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px",
          opacity: 0.6,
        }}
      />

      {/* Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 800,
          height: 500,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${
            stage === 1 && frame >= 90 && frame < 270
              ? "rgba(184, 243, 107, 0.12)"
              : "rgba(120, 185, 237, 0.08)"
          } 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* ACT 1: INTRO (0 - 3s) */}
      {frame < 90 && (
        <div
          style={{
            position: "absolute",
            inset: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: act1Opacity,
            transform: `scale(${act1Scale})`,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                backgroundColor: palette.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(184, 243, 107, 0.3)",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
                <rect x="7" y="6" width="9" height="24" rx="4.5" fill={palette.background} />
                <rect x="20" y="11" width="9" height="19" rx="4.5" fill={palette.background} />
              </svg>
            </div>
            <span
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: palette.foreground,
              }}
            >
              Relay
            </span>
          </div>

          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              textAlign: "center",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 1100,
            }}
          >
            Make room for{" "}
            <span style={{ color: palette.accent }}>focused work</span>
          </h1>
        </div>
      )}

      {/* ACT 2: PRODUCT INTERFACE (3s - 9s) */}
      {frame >= 86 && frame < 272 && (
        <div
          style={{
            position: "absolute",
            inset: 80,
            display: "flex",
            flexDirection: "column",
            opacity: act2Opacity,
          }}
        >
          {/* Top Bar inside safe margin */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              height: 48,
            }}
          >\n            {/* App Identifier */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: palette.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                  <rect x="7" y="6" width="9" height="24" rx="4.5" fill={palette.background} />
                  <rect x="20" y="11" width="9" height="19" rx="4.5" fill={palette.background} />
                </svg>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700 }}>Relay</span>
            </div>

            {/* Stages Nav / Pill Bar */}
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(245, 245, 242, 0.05)",
                border: "1px solid rgba(177, 180, 188, 0.2)",
                borderRadius: 30,
                padding: 4,
                gap: 6,
              }}
            >
              {[
                { title: "Plan together", idx: 0 },
                { title: "Protect focus time", idx: 1 },
                { title: "See progress", idx: 2 },
              ].map((item) => {
                const active = stage === item.idx;
                return (
                  <div
                    key={item.title}
                    style={{
                      padding: "8px 24px",
                      borderRadius: 24,
                      fontSize: 16,
                      fontWeight: active ? 700 : 500,
                      backgroundColor: active ? palette.foreground : "transparent",
                      color: active ? palette.background : palette.muted,
                    }}
                  >
                    {item.title}
                  </div>
                );
              })}
            </div>

            {/* Team Presence */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {TEAM.map((m, i) => (
                <div
                  key={m.initials}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: m.color,
                    color: palette.background,
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${palette.background}`,
                    marginLeft: i > 0 ? -8 : 0,
                  }}
                >
                  {m.initials}
                </div>
              ))}
            </div>
          </div>

          {/* Product Canvas Card */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(20, 22, 27, 0.9)",
              border: "1px solid rgba(177, 180, 188, 0.16)",
              borderRadius: 20,
              padding: 36,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            {/* STAGE 1: Plan together */}
            {stage === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  opacity: stage0Spring,
                  transform: `translateY(${interpolate(stage0Spring, [0, 1], [16, 0])}px)`,
                }}
              >
                <div>
                  <div style={{ color: palette.secondary, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>
                    COLLABORATIVE PLANNING
                  </div>
                  <h2 style={{ fontSize: 38, fontWeight: 700, margin: "6px 0 0 0" }}>Plan together</h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 18,
                    margin: "24px 0",
                  }}
                >
                  {[
                    { day: "Mon", task: "Architecture Sync", by: "Alex M.", color: palette.secondary },
                    { day: "Tue", task: "Interface Specs", by: "Sarah K.", color: palette.accent },
                    { day: "Wed", task: "Backend Deployment", by: "Dev R.", color: palette.foreground },
                    { day: "Thu", task: "Customer Feedback", by: "Elena T.", color: palette.secondary },
                  ].map((item) => (
                    <div
                      key={item.day}
                      style={{
                        backgroundColor: "rgba(245, 245, 242, 0.04)",
                        borderRadius: 14,
                        border: "1px solid rgba(177, 180, 188, 0.12)",
                        padding: 20,
                      }}
                    >
                      <div style={{ fontSize: 13, color: palette.muted, fontWeight: 700, marginBottom: 12 }}>
                        {item.day}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: palette.foreground }}>
                        {item.task}
                      </div>
                      <div style={{ fontSize: 13, color: item.color, fontWeight: 600 }}>
                        ● {item.by}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    backgroundColor: "rgba(120, 185, 237, 0.1)",
                    border: `1px solid ${palette.secondary}`,
                    color: palette.secondary,
                    fontSize: 15,
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  Synchronized across 4 calendars in real time
                </div>
              </div>
            )}

            {/* STAGE 2: Protect focus time */}
            {stage === 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  opacity: stage1Spring,
                  transform: `translateY(${interpolate(stage1Spring, [0, 1], [16, 0])}px)`,
                }}
              >
                <div>
                  <div style={{ color: palette.accent, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>
                    DEEP WORK AUTOMATION
                  </div>
                  <h2 style={{ fontSize: 38, fontWeight: 700, margin: "6px 0 0 0" }}>Protect focus time</h2>
                </div>

                <div
                  style={{
                    flex: 1,
                    margin: "24px 0",
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1.2fr",
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 16,
                      backgroundColor: "rgba(184, 243, 107, 0.08)",
                      border: `2px solid ${palette.accent}`,
                      padding: 28,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 10px 30px rgba(184, 243, 107, 0.15)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: 6,
                          backgroundColor: palette.accent,
                          color: palette.background,
                          fontSize: 12,
                          fontWeight: 800,
                          marginBottom: 16,
                        }}
                      >
                        SHIELD ON
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
                        Uninterrupted Focus Window
                      </div>
                      <div style={{ color: palette.muted, fontSize: 16 }}>
                        09:30 AM — 01:30 PM • 4 consecutive deep-work hours
                      </div>
                    </div>
                    <div style={{ color: palette.accent, fontSize: 15, fontWeight: 600 }}>
                      ✓ 3 meeting invites automatically rescheduled
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: 16,
                      backgroundColor: "rgba(245, 245, 242, 0.04)",
                      border: "1px solid rgba(177, 180, 188, 0.12)",
                      padding: 28,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, color: palette.muted }}>Protected Focus Hours</div>
                      <div style={{ fontSize: 46, fontWeight: 800, color: palette.accent }}>+6.5 hrs</div>
                      <div style={{ fontSize: 12, color: palette.muted }}>per engineer / week</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: palette.muted }}>Disruptions Blocked</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: palette.secondary }}>-74%</div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 14, color: palette.muted }}>
                  Active policy: Automatic no-meeting blocks during peak cognitive flow
                </div>
              </div>
            )}

            {/* STAGE 3: See progress */}
            {stage === 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  opacity: stage2Spring,
                  transform: `translateY(${interpolate(stage2Spring, [0, 1], [16, 0])}px)`,
                }}
              >
                <div>
                  <div style={{ color: palette.foreground, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>
                    TEAM MOMENTUM
                  </div>
                  <h2 style={{ fontSize: 38, fontWeight: 700, margin: "6px 0 0 0" }}>See progress</h2>
                </div>

                <div
                  style={{
                    flex: 1,
                    margin: "24px 0",
                    display: "grid",
                    gridTemplateColumns: "1fr 1.6fr",
                    gap: 24,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(245, 245, 242, 0.04)",
                      border: "1px solid rgba(177, 180, 188, 0.12)",
                      borderRadius: 16,
                      padding: 32,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ fontSize: 72, fontWeight: 900, color: palette.accent, lineHeight: 1 }}>
                      {Math.round(progressPercent)}%
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8, color: palette.foreground }}>
                      Sprint Goal Completed
                    </div>
                    <div style={{ fontSize: 13, color: palette.muted, marginTop: 4 }}>
                      Ahead of schedule by 1.5 days
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { item: "Distributed cache implementation", status: "Done", color: palette.accent },
                      { item: "Client latency benchmarks", status: "Done", color: palette.accent },
                      { item: "Production rollout checklist", status: "Done", color: palette.accent },
                      { item: "API version 2 deprecation notices", status: "In review", color: palette.secondary },
                    ].map((row) => (
                      <div
                        key={row.item}
                        style={{
                          backgroundColor: "rgba(245, 245, 242, 0.03)",
                          border: "1px solid rgba(177, 180, 188, 0.08)",
                          borderRadius: 10,
                          padding: "14px 18px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 500, color: palette.foreground }}>
                          {row.item}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: row.color,
                            backgroundColor: "rgba(245, 245, 242, 0.06)",
                            padding: "4px 10px",
                            borderRadius: 6,
                          }}
                        >
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: 14, color: palette.muted }}>
                  Real-time sprint velocity calculated from completed deliverables
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACT 3: OUTRO (9s - 12s / frames 270 - 360) */}
      {/* Settles quickly so message is fully readable for over 2 seconds */}
      {frame >= 268 && (
        <div
          style={{
            position: "absolute",
            inset: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: act3Opacity,
            transform: `scale(${interpolate(act3Spring, [0, 1], [0.94, 1])})`,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              backgroundColor: palette.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 36,
              boxShadow: "0 14px 34px rgba(184, 243, 107, 0.3)",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
              <rect x="7" y="6" width="9" height="24" rx="4.5" fill={palette.background} />
              <rect x="20" y="11" width="9" height="19" rx="4.5" fill={palette.background} />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              textAlign: "center",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 1100,
              color: palette.foreground,
            }}
          >
            Start your next week with <span style={{ color: palette.accent }}>Relay</span>
          </h2>

          <div
            style={{
              marginTop: 40,
              backgroundColor: palette.accent,
              color: palette.background,
              fontSize: 18,
              fontWeight: 700,
              padding: "16px 36px",
              borderRadius: 30,
              letterSpacing: "-0.01em",
            }}
          >
            relay.app
          </div>
        </div>
      )}
    </div>
  );
};