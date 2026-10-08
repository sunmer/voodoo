import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { palette } from "./contract";

const RelayLogo: React.FC<{ size?: number; glow?: boolean }> = ({
  size = 44,
  glow = false,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: -6,
            background: palette.accent,
            filter: "blur(18px)",
            opacity: 0.35,
            borderRadius: "50%",
          }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        style={{ position: "relative", display: "block" }}
      >
        <rect
          x="8"
          y="22"
          width="24"
          height="8"
          rx="4"
          transform="rotate(-32 8 22)"
          fill={palette.secondary}
        />
        <rect
          x="20"
          y="33"
          width="24"
          height="8"
          rx="4"
          transform="rotate(-32 20 33)"
          fill={palette.accent}
        />
        <circle cx="27" cy="20" r="3.5" fill={palette.foreground} />
      </svg>
    </div>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Background ambient subtle radial shifts
  const ambientGlowY = interpolate(frame, [0, 359], [30, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ================= SCENE 1: INTRO (0 - 90) =================
  const introLogoSpring = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
  });
  const introTitleSpring = spring({
    frame: frame - 6,
    fps: 30,
    config: { damping: 14, stiffness: 110 },
  });
  const introSubtitleSpring = spring({
    frame: frame - 18,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });
  const introExit = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const introOpacity = Math.max(0, 1 - introExit);
  const introScale = 1 - introExit * 0.08;

  // ================= SCENE 2: INTERFACE (82 - 275) =================
  const uiEnterProgress = spring({
    frame: frame - 80,
    fps: 30,
    config: { damping: 16, stiffness: 110 },
  });
  const uiFadeIn = interpolate(frame, [80, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const uiFadeOut = interpolate(frame, [260, 274], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const uiOpacity = uiFadeIn * uiFadeOut;
  const uiScale = interpolate(uiEnterProgress, [0, 1], [0.94, 1]);

  // Current Active Pillar
  // Pillar 1: frames 90 - 150 ("Plan together")
  // Pillar 2: frames 150 - 210 ("Protect focus time")
  // Pillar 3: frames 210 - 270 ("See progress")
  const isPhase1 = frame >= 80 && frame < 150;
  const isPhase2 = frame >= 150 && frame < 210;
  const isPhase3 = frame >= 210 && frame < 280;

  // Phase 1 Card drag transition
  const cardMoveSpring = spring({
    frame: frame - 104,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
  });
  const movingCardX = interpolate(cardMoveSpring, [0, 1], [0, 360]);

  // Phase 2 Focus Shield expansion
  const shieldSpring = spring({
    frame: frame - 156,
    fps: 30,
    config: { damping: 14, stiffness: 110 },
  });
  const shieldWidth = interpolate(shieldSpring, [0, 1], [30, 100]);
  const shieldOpacity = interpolate(shieldSpring, [0, 1], [0, 1]);

  // Phase 3 Metrics fill & bars
  const metricsSpring = spring({
    frame: frame - 215,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });
  const focusPercent = Math.round(
    interpolate(metricsSpring, [0, 1], [24, 94])
  );
  const bar1 = interpolate(metricsSpring, [0, 1], [0, 58]);
  const bar2 = interpolate(metricsSpring, [0, 1], [0, 74]);
  const bar3 = interpolate(metricsSpring, [0, 1], [0, 88]);
  const bar4 = interpolate(metricsSpring, [0, 1], [0, 96]);

  // ================= SCENE 3: OUTRO (268 - 360) =================
  const outroSpring = spring({
    frame: frame - 270,
    fps: 30,
    config: { damping: 16, stiffness: 110 },
  });
  const outroOpacity = interpolate(frame, [270, 284], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outroScale = interpolate(outroSpring, [0, 1], [0.95, 1]);

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
      {/* Ambient background light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle 900px at 50% ${ambientGlowY}%, rgba(184, 243, 107, 0.05) 0%, rgba(120, 185, 237, 0.03) 45%, transparent 75%)`,
          pointerEvents: "none",
        }}
      />

      {/* Background architectural grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245, 245, 242, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 242, 0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* ==================== SCENE 1: INTRO ==================== */}
      {frame < 92 && (
        <div
          style={{
            position: "absolute",
            inset: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: introOpacity,
            transform: `scale(${introScale})`,
          }}
        >
          {/* Category pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 30,
              background: "rgba(245, 245, 242, 0.05)",
              border: "1px solid rgba(245, 245, 242, 0.1)",
              marginBottom: 32,
              opacity: Math.max(0, introLogoSpring),
              transform: `translateY(${interpolate(
                introLogoSpring,
                [0, 1],
                [20, 0]
              )}px)`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: palette.accent,
                boxShadow: `0 0 10px ${palette.accent}`,
              }}
            />
            <span
              style={{
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: palette.muted,
              }}
            >
              Next-Gen Team Planning
            </span>
          </div>

          {/* Brand Logo & Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              marginBottom: 20,
              opacity: Math.max(0, introTitleSpring),
              transform: `translateY(${interpolate(
                introTitleSpring,
                [0, 1],
                [30, 0]
              )}px)`,
            }}
          >
            <RelayLogo size={76} glow />
            <h1
              style={{
                fontSize: 108,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: 0,
                lineHeight: 1,
                color: palette.foreground,
              }}
            >
              Relay
            </h1>
          </div>

          {/* Subtitle / Core Hook */}
          <p
            style={{
              fontSize: 34,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: palette.muted,
              margin: 0,
              opacity: Math.max(0, introSubtitleSpring),
              transform: `translateY(${interpolate(
                introSubtitleSpring,
                [0, 1],
                [24, 0]
              )}px)`,
            }}
          >
            Make room for focused work
          </p>
        </div>
      )}

      {/* ==================== SCENE 2: PRODUCT INTERFACE ==================== */}
      {frame >= 80 && frame <= 275 && (
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 120,
            width: 1560,
            height: 840,
            opacity: uiOpacity,
            transform: `scale(${uiScale})`,
            borderRadius: 24,
            backgroundColor: "#14161B",
            border: "1px solid rgba(245, 245, 242, 0.1)",
            boxShadow:
              "0 32px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top Interface Bar */}
          <div
            style={{
              height: 70,
              padding: "0 28px",
              borderBottom: "1px solid rgba(245, 245, 242, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#111216",
            }}
          >
            {/* App Branding */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <RelayLogo size={28} />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: palette.foreground,
                }}
              >
                Relay
              </span>
              <span style={{ color: "rgba(245, 245, 242, 0.2)" }}>/</span>
              <span
                style={{
                  fontSize: 13,
                  color: palette.muted,
                  fontWeight: 500,
                }}
              >
                Core Engineering Sprint 42
              </span>
            </div>

            {/* Feature Tabs (The 3 Requirements) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0, 0, 0, 0.35)",
                padding: 5,
                borderRadius: 14,
                border: "1px solid rgba(245, 245, 242, 0.06)",
              }}
            >
              {/* Step 1 */}
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  transition: "all 0.2s ease",
                  backgroundColor: isPhase1
                    ? "rgba(120, 185, 237, 0.16)"
                    : "transparent",
                  color: isPhase1 ? palette.secondary : palette.muted,
                  border: isPhase1
                    ? `1px solid ${palette.secondary}`
                    : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: isPhase1
                      ? palette.secondary
                      : "transparent",
                  }}
                />
                Plan together
              </div>

              {/* Step 2 */}
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  backgroundColor: isPhase2
                    ? "rgba(184, 243, 107, 0.18)"
                    : "transparent",
                  color: isPhase2 ? palette.accent : palette.muted,
                  border: isPhase2
                    ? `1px solid ${palette.accent}`
                    : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: isPhase2 ? palette.accent : "transparent",
                  }}
                />
                Protect focus time
              </div>

              {/* Step 3 */}
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  backgroundColor: isPhase3
                    ? "rgba(245, 245, 242, 0.14)"
                    : "transparent",
                  color: isPhase3 ? palette.foreground : palette.muted,
                  border: isPhase3
                    ? "1px solid rgba(245, 245, 242, 0.4)"
                    : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: isPhase3
                      ? palette.foreground
                      : "transparent",
                  }}
                />
                See progress
              </div>
            </div>

            {/* Team Presence Avatars */}
            <div style={{ display: "flex", alignItems: "center", gap: -6 }}>
              {["Elena", "Marcus", "Tara"].map((name, i) => (
                <div
                  key={name}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: [
                      palette.secondary,
                      palette.accent,
                      palette.foreground,
                    ][i],
                    color: "#101114",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #111216",
                    marginLeft: i > 0 ? -8 : 0,
                  }}
                >
                  {name[0]}
                </div>
              ))}
              <span
                style={{
                  fontSize: 12,
                  color: palette.muted,
                  marginLeft: 10,
                  fontWeight: 500,
                }}
              >
                6 active
              </span>
            </div>
          </div>

          {/* Main Working Canvas */}
          <div
            style={{
              flex: 1,
              padding: 36,
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ================= VIEW 1: PLAN TOGETHER (90 - 150) ================= */}
            {isPhase1 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: palette.secondary,
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      Collaborative Workspace
                    </div>
                    <h2
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      Plan together across teams in real-time
                    </h2>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: palette.muted,
                      background: "rgba(255, 255, 255, 0.04)",
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    Live Sync · 12ms latency
                  </div>
                </div>

                {/* Kanban 3-Column Plan Board */}
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 20,
                  }}
                >
                  {/* Column 1: Backlog */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 16,
                      padding: 20,
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: palette.muted,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      PROPOSED FOCUS · 2
                    </div>

                    <div
                      style={{
                        background: "#1B1E24",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        Sync Engine Latency Audit
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            color: palette.secondary,
                            background: "rgba(120, 185, 237, 0.15)",
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          Performance
                        </span>
                        <span style={{ fontSize: 11, color: palette.muted }}>
                          4h estimate
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: In Sprint (Target for dynamic card) */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 16,
                      padding: 20,
                      border: "1px solid rgba(120, 185, 237, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: palette.secondary,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      THIS SPRINT · COMMITTED
                    </div>

                    {/* Moving Card animated across columns */}
                    <div
                      style={{
                        background: "#20242D",
                        padding: 18,
                        borderRadius: 12,
                        border: `1.5px solid ${palette.secondary}`,
                        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.4)",
                        transform: `translateX(${interpolate(
                          cardMoveSpring,
                          [0, 1],
                          [-320, 0]
                        )}px)`,
                        opacity: interpolate(cardMoveSpring, [0, 0.2], [0, 1]),
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: palette.accent,
                            background: "rgba(184, 243, 107, 0.15)",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontWeight: 600,
                          }}
                        >
                          High Impact
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: palette.muted,
                          }}
                        >
                          Assigned to Marcus
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginBottom: 10,
                        }}
                      >
                        Unified Workspace Collaboration
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: palette.muted,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: palette.secondary,
                          }}
                        />
                        Aligned with Product Roadmap
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Ready to Focus */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 16,
                      padding: 20,
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: palette.muted,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      PROTECTED QUEUE · 1
                    </div>
                    <div
                      style={{
                        background: "#1B1E24",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        Database Sharding Architecture
                      </div>
                      <div style={{ fontSize: 11, color: palette.muted }}>
                        Scheduled for Thursday block
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= VIEW 2: PROTECT FOCUS TIME (150 - 210) ================= */}
            {isPhase2 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: palette.accent,
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      Calendar Defense
                    </div>
                    <h2
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      Protect focus time automatically across schedules
                    </h2>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: palette.accent,
                      background: "rgba(184, 243, 107, 0.12)",
                      border: `1px solid ${palette.accent}`,
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    Shield Active · 0 Meeting Collisions
                  </div>
                </div>

                {/* Week Schedule Visual Grid */}
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 16,
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Days of week header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px repeat(5, 1fr)",
                      gap: 12,
                      fontSize: 13,
                      fontWeight: 600,
                      color: palette.muted,
                      paddingBottom: 12,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div>TIME</div>
                    <div>MON</div>
                    <div style={{ color: palette.accent }}>TUE (SHIELDED)</div>
                    <div style={{ color: palette.accent }}>WED (SHIELDED)</div>
                    <div style={{ color: palette.accent }}>THU (SHIELDED)</div>
                    <div>FRI</div>
                  </div>

                  {/* 09:00 AM Row (Standup condensed) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px repeat(5, 1fr)",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: palette.muted }}>
                      09:00 AM
                    </span>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      Team Kickoff
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      15m Sync
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      15m Sync
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      15m Sync
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      Demo Prep
                    </div>
                  </div>

                  {/* 10:00 AM - 02:00 PM Massive Protected Focus Block */}
                  <div
                    style={{
                      flex: 1,
                      display: "grid",
                      gridTemplateColumns: "120px 1fr 3fr 1fr",
                      gap: 12,
                      alignItems: "stretch",
                      paddingTop: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: palette.muted,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <span>10:00 AM</span>
                      <span style={{ margin: "12px 0", opacity: 0.3 }}>↓</span>
                      <span>02:00 PM</span>
                    </div>

                    {/* Monday Open slot */}
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 12,
                        border: "1px dashed rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      Open Schedule
                    </div>

                    {/* Tue-Thu Protected Focus Zone */}
                    <div
                      style={{
                        borderRadius: 16,
                        background:
                          "linear-gradient(135deg, rgba(184, 243, 107, 0.18) 0%, rgba(184, 243, 107, 0.06) 100%)",
                        border: `1.5px solid ${palette.accent}`,
                        padding: "24px 32px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        boxShadow: "0 10px 30px rgba(184, 243, 107, 0.08)",
                        opacity: shieldOpacity,
                        clipPath: `inset(0 ${100 - shieldWidth}% 0 0)`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            background: palette.accent,
                            color: "#101114",
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                          }}
                        >
                          PROTECTED FOCUS BLOCK
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: palette.foreground,
                            fontWeight: 600,
                          }}
                        >
                          4.0 Hours Uninterrupted
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: palette.foreground,
                          marginBottom: 6,
                        }}
                      >
                        Deep Engineering & Architecture Focus
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: palette.muted,
                        }}
                      >
                        Auto-declines ad-hoc meetings · Slack DND synchronized
                        for 8 team members
                      </div>
                    </div>

                    {/* Friday Open slot */}
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 12,
                        border: "1px dashed rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: palette.muted,
                      }}
                    >
                      Design Review
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= VIEW 3: SEE PROGRESS (210 - 270) ================= */}
            {isPhase3 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: palette.foreground,
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      Performance Analytics
                    </div>
                    <h2
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      See progress in real time as goals finish faster
                    </h2>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: palette.accent,
                      background: "rgba(184, 243, 107, 0.12)",
                      border: `1px solid ${palette.accent}`,
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    Sprint on Track · +28% Focus Efficiency
                  </div>
                </div>

                {/* 3 Metric Insight Panels */}
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1.2fr 1fr",
                    gap: 20,
                  }}
                >
                  {/* Metric 1: Focus Goal Completion */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 16,
                      padding: 24,
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: palette.muted,
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        WEEKLY FOCUS TARGET
                      </div>
                      <div
                        style={{
                          fontSize: 48,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: palette.accent,
                          lineHeight: 1,
                          marginBottom: 10,
                        }}
                      >
                        {focusPercent}%
                      </div>
                      <div style={{ fontSize: 13, color: palette.muted }}>
                        37.6 hrs of deep focused work logged
                      </div>
                    </div>

                    {/* Glowing Progress Track */}
                    <div
                      style={{
                        width: "100%",
                        height: 12,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: 6,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${focusPercent}%`,
                          height: "100%",
                          backgroundColor: palette.accent,
                          borderRadius: 6,
                          boxShadow: `0 0 16px ${palette.accent}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metric 2: Velocity Bar Chart */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 16,
                      padding: 24,
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: palette.muted,
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        TEAM VELOCITY BOOST
                      </div>
                      <div
                        style={{
                          fontSize: 48,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: palette.secondary,
                          lineHeight: 1,
                          marginBottom: 10,
                        }}
                      >
                        +24%
                      </div>
                      <div style={{ fontSize: 13, color: palette.muted }}>
                        Faster sprint execution vs baseline
                      </div>
                    </div>

                    {/* 4 Animated Bars */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 16,
                        height: 70,
                      }}
                    >
                      {[bar1, bar2, bar3, bar4].map((heightVal, idx) => (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            height: `${heightVal}%`,
                            backgroundColor:
                              idx === 3 ? palette.accent : palette.secondary,
                            borderRadius: 6,
                            opacity: idx === 3 ? 1 : 0.6 + idx * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Metric 3: Live Deliverables list */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 16,
                      padding: 24,
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: palette.muted,
                        fontWeight: 600,
                      }}
                    >
                      COMPLETED OBJECTIVES
                    </div>
                    {[
                      "Core Sync Protocol",
                      "Focus Guard System",
                      "Sprint 42 Deliverables",
                    ].map((item, idx) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          background: "#1B1E24",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: palette.accent,
                            color: "#101114",
                            fontSize: 10,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SCENE 3: OUTRO (270 - 360) ==================== */}
      {/* Text reaches final state by frame 292, completely stable through 359 (>= 2 full seconds) */}
      {frame >= 268 && (
        <div
          style={{
            position: "absolute",
            inset: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: outroOpacity,
            transform: `scale(${outroScale})`,
          }}
        >
          {/* Top Logo Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <RelayLogo size={58} glow />
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: palette.foreground,
              }}
            >
              Relay
            </span>
          </div>

          {/* Mandatory Outro Headline */}
          <h1
            style={{
              fontSize: 70,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: palette.foreground,
              textAlign: "center",
              margin: 0,
              marginBottom: 28,
              lineHeight: 1.15,
              maxWidth: 1100,
            }}
          >
            Start your next week with Relay
          </h1>

          {/* 3 Pillar Summary badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 44,
            }}
          >
            {[
              { label: "Plan together", color: palette.secondary },
              { label: "Protect focus time", color: palette.accent },
              { label: "See progress", color: palette.foreground },
            ].map((pillar) => (
              <div
                key={pillar.label}
                style={{
                  padding: "8px 20px",
                  borderRadius: 30,
                  background: "rgba(245, 245, 242, 0.04)",
                  border: "1px solid rgba(245, 245, 242, 0.1)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: pillar.color,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: pillar.color,
                  }}
                />
                {pillar.label}
              </div>
            ))}
          </div>

          {/* Call to action button pill */}
          <div
            style={{
              padding: "16px 36px",
              borderRadius: 40,
              backgroundColor: palette.accent,
              color: "#101114",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              boxShadow: `0 12px 36px rgba(184, 243, 107, 0.25)`,
            }}
          >
            Get started — relay.app
          </div>
        </div>
      )}
    </div>
  );
};
