import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Sequence,
  Easing,
} from "remotion";
import { palette } from "./contract";

const SAFE_AREA_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 80,
  left: 80,
  right: 80,
  bottom: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  fontFamily: "'Archivo', sans-serif",
  boxSizing: "border-box",
};

const Background: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: palette.background,
        backgroundImage: `radial-gradient(${palette.muted}15 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }}
    />
  );
};

/* =========================================================================
   SCENE 1: "Less noise." (Frames 0 - 90 / 0-3s)
   Readable hold: Frame 22 to 72 (50 frames = 1.67s)
   ========================================================================= */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const enterProgress = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const jitterAmp = Math.max(0, 1 - frame / 20);
  const jitterX = Math.sin(frame * 1.7) * 22 * jitterAmp;
  const jitterY = Math.cos(frame * 2.3) * 12 * jitterAmp;

  const waveAmp = Math.max(0, 1 - frame / 24) * 20;
  const points = [
    [0, 20],
    [80, 20 + Math.sin(frame * 0.45) * waveAmp],
    [160, 20 - Math.cos(frame * 0.5) * waveAmp],
    [240, 20 + Math.sin(frame * 0.6) * waveAmp],
    [320, 20 - Math.sin(frame * 0.4) * waveAmp],
    [400, 20],
  ];
  const pathD =
    `M ${points[0][0]} ${points[0][1]} ` +
    points.slice(1).map((p) => `L ${p[0]} ${p[1]}`).join(" ");

  const opacity = enterProgress * (1 - exitProgress);
  const translateY = (1 - enterProgress) * 40 - exitProgress * 40;

  return (
    <div style={SAFE_AREA_STYLE}>
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            display: "flex",
            alignItems: "baseline",
            gap: 36,
          }}
        >
          <span style={{ color: palette.foreground }}>Less</span>
          <span
            style={{
              color: palette.foreground,
              transform: `translate(${jitterX}px, ${jitterY}px)`,
              display: "inline-block",
            }}
          >
            noise
            <span style={{ color: palette.accent }}>.</span>
          </span>
        </div>

        <svg width="400" height="40" viewBox="0 0 400 40" style={{ overflow: "visible" }}>
          <path
            d={pathD}
            fill="none"
            stroke={palette.accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.85 }}
          />
        </svg>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 2: "More focus." (Frames 90 - 180 / 3-6s)
   Readable hold: Frame 22 to 72 (50 frames = 1.67s)
   ========================================================================= */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const enterProgress = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const blur = (1 - enterProgress) * 24;
  const letterSpacing = interpolate(enterProgress, [0, 1], [30, -3]);
  const scale = interpolate(enterProgress, [0, 1], [1.14, 1]) * (1 - exitProgress * 0.1);
  const opacity = enterProgress * (1 - exitProgress);
  const reticlePadding = interpolate(enterProgress, [0, 1], [60, 24]);

  return (
    <div style={SAFE_AREA_STYLE}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: `${reticlePadding}px ${reticlePadding + 20}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 28,
            height: 28,
            borderTop: `3px solid ${palette.secondary}`,
            borderLeft: `3px solid ${palette.secondary}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 28,
            height: 28,
            borderTop: `3px solid ${palette.secondary}`,
            borderRight: `3px solid ${palette.secondary}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 28,
            height: 28,
            borderBottom: `3px solid ${palette.secondary}`,
            borderLeft: `3px solid ${palette.secondary}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            borderBottom: `3px solid ${palette.secondary}`,
            borderRight: `3px solid ${palette.secondary}`,
          }}
        />

        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: `${letterSpacing}px`,
            filter: `blur(${blur}px)`,
            display: "flex",
            alignItems: "baseline",
            gap: 36,
          }}
        >
          <span style={{ color: palette.foreground }}>More</span>
          <span style={{ color: palette.secondary }}>focus.</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 3: "Better work, together." (Frames 180 - 270 / 6-9s)
   Readable hold: Frame 25 to 72 (47 frames = 1.57s)
   ========================================================================= */
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const p1 = interpolate(frame, [0, 16], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const p2 = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const p3 = interpolate(frame, [12, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  const exitProgress = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const exitY = -exitProgress * 50;
  const exitOpacity = 1 - exitProgress;

  return (
    <div style={SAFE_AREA_STYLE}>
      <div
        style={{
          opacity: exitOpacity,
          transform: `translateY(${exitY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              color: palette.foreground,
              opacity: p1,
              transform: `translateX(${(1 - p1) * -50}px)`,
              display: "inline-block",
            }}
          >
            Better
          </span>
          <span
            style={{
              color: palette.foreground,
              opacity: p2,
              transform: `translateY(${(1 - p2) * -40}px)`,
              display: "inline-block",
            }}
          >
            work,
          </span>
        </div>

        <div
          style={{
            opacity: p3,
            transform: `translateY(${(1 - p3) * 40}px) scale(${0.92 + 0.08 * p3})`,
            fontSize: 130,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: palette.accent,
            display: "inline-block",
          }}
        >
          together.
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 4: "Make room for what matters." with "Relay" (Frames 270 - 360 / 9-12s)
   Motion strictly settles by frame 25.
   Still and readable for the last 2 seconds (Frames 30 - 90 = 2.0s).
   ========================================================================= */
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const introHeadline = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const introBrand = interpolate(frame, [6, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const dividerWidth = interpolate(frame, [4, 24], [0, 480], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const headlineY = (1 - introHeadline) * 25;
  const brandY = (1 - introBrand) * 25;

  return (
    <div style={SAFE_AREA_STYLE}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: introHeadline,
            transform: `translateY(${headlineY}px)`,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: palette.foreground,
            lineHeight: 1.2,
            marginBottom: 36,
          }}
        >
          Make room for what matters.
        </div>

        <div
          style={{
            width: `${dividerWidth}px`,
            height: 2,
            backgroundColor: `${palette.muted}33`,
            marginBottom: 44,
          }}
        />

        <div
          style={{
            opacity: introBrand,
            transform: `translateY(${brandY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect
              x="8"
              y="16"
              width="36"
              height="12"
              rx="6"
              fill={palette.accent}
            />
            <rect
              x="20"
              y="36"
              width="36"
              height="12"
              rx="6"
              fill={palette.secondary}
            />
          </svg>

          <div
            style={{
              fontSize: 104,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: palette.foreground,
              lineHeight: 1,
            }}
          >
            Relay
          </div>
        </div>
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
        position: "relative",
        backgroundColor: palette.background,
        overflow: "hidden",
      }}
    >
      <Background />

      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <Scene2 />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <Scene3 />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <Scene4 />
      </Sequence>
    </div>
  );
};