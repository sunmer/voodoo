import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";
import { palette } from "./contract";

const bg = palette.background;
const fg = palette.foreground;
const accent = palette.accent;
const secondary = palette.secondary;
const muted = palette.muted;

const SAFE = 80;

function IntroSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const taglineDelay = 20;
  const taglineSpring = spring({ frame: frame - taglineDelay, fps, config: { damping: 14, stiffness: 60 } });
  const taglineOpacity = interpolate(taglineSpring, [0, 1], [0, 1]);
  const taglineY = interpolate(taglineSpring, [0, 1], [30, 0]);

  const lineWidth = interpolate(frame, [10, 50], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [70, 89], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontFamily: "Archivo",
          fontWeight: 800,
          color: fg,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          letterSpacing: "-2px",
        }}
      >
        Relay
      </div>
      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: accent,
          borderRadius: 2,
          marginTop: 24,
          marginBottom: 24,
        }}
      />
      <div
        style={{
          fontSize: 36,
          fontFamily: "Archivo",
          fontWeight: 400,
          color: muted,
          transform: `translateY(${taglineY}px)`,
          opacity: taglineOpacity,
        }}
      >
        Make room for focused work
      </div>
    </div>
  );
}

function FeatureCard({
  label,
  icon,
  delay,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  delay: number;
  color: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 70 } });
  const cardY = interpolate(cardSpring, [0, 1], [80, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translateY(${cardY}px)`,
        opacity: cardOpacity,
        width: 320,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: `${color}22`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 28,
          fontFamily: "Archivo",
          fontWeight: 600,
          color: fg,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PlanTogetherUI() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cards = [0, 1, 2, 3, 4];
  const baseDelay = 10;

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
      {cards.map((i) => {
        const s = spring({ frame: frame - baseDelay - i * 6, fps, config: { damping: 12, stiffness: 90 } });
        const h = interpolate(s, [0, 1], [0, 40 + i * 20]);
        return (
          <div
            key={i}
            style={{
              width: 48,
              height: h,
              backgroundColor: i % 2 === 0 ? secondary : accent,
              borderRadius: 8,
              opacity: interpolate(s, [0, 1], [0, 0.85]),
            }}
          />
        );
      })}
    </div>
  );
}

function FocusTimeUI() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 60 } });
  const ringProgress = interpolate(frame, [10, 50], [0, 270], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (ringProgress / 360) * circumference;

  return (
    <div style={{ position: "relative", width: 100, height: 100, transform: `scale(${shieldScale})` }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={44} fill="none" stroke={`${muted}33`} strokeWidth={6} />
        <circle
          cx={50}
          cy={50}
          r={44}
          fill="none"
          stroke={accent}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          color: fg,
          fontFamily: "Archivo",
          fontWeight: 700,
        }}
      >
        ◈
      </div>
    </div>
  );
}

function ProgressUI() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [0.85, 0.6, 0.95, 0.4];
  const colors = [accent, secondary, accent, secondary];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 200 }}>
      {bars.map((target, i) => {
        const progress = interpolate(frame, [10 + i * 8, 50 + i * 8], [0, target], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={i} style={{ height: 14, backgroundColor: `${muted}22`, borderRadius: 7, overflow: "hidden" }}>
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: colors[i],
                borderRadius: 7,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function FeaturesSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [165, 179], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const feature1Spring = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 70 } });
  const feature2Spring = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 70 } });
  const feature3Spring = spring({ frame: frame - 25, fps, config: { damping: 13, stiffness: 70 } });

  const f1y = interpolate(feature1Spring, [0, 1], [60, 0]);
  const f1o = interpolate(feature1Spring, [0, 1], [0, 1]);
  const f2y = interpolate(feature2Spring, [0, 1], [60, 0]);
  const f2o = interpolate(feature2Spring, [0, 1], [0, 1]);
  const f3y = interpolate(feature3Spring, [0, 1], [60, 0]);
  const f3o = interpolate(feature3Spring, [0, 1], [0, 1]);

  const headingSpring = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 80 } });
  const headingOpacity = interpolate(headingSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: SAFE,
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontFamily: "Archivo",
          fontWeight: 500,
          color: muted,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 48,
          opacity: headingOpacity,
        }}
      >
        Built for your team
      </div>

      <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${f1y}px)`, opacity: f1o }}>
          <PlanTogetherUI />
          <div style={{ fontSize: 30, fontFamily: "Archivo", fontWeight: 600, color: fg, textAlign: "center" }}>
            Plan together
          </div>
          <div style={{ fontSize: 18, fontFamily: "Archivo", fontWeight: 400, color: muted, textAlign: "center", maxWidth: 260 }}>
            Align on priorities in one shared space
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${f2y}px)`, opacity: f2o }}>
          <FocusTimeUI />
          <div style={{ fontSize: 30, fontFamily: "Archivo", fontWeight: 600, color: fg, textAlign: "center" }}>
            Protect focus time
          </div>
          <div style={{ fontSize: 18, fontFamily: "Archivo", fontWeight: 400, color: muted, textAlign: "center", maxWidth: 260 }}>
            Guard deep-work blocks automatically
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${f3y}px)`, opacity: f3o }}>
          <ProgressUI />
          <div style={{ fontSize: 30, fontFamily: "Archivo", fontWeight: 600, color: fg, textAlign: "center" }}>
            See progress
          </div>
          <div style={{ fontSize: 18, fontFamily: "Archivo", fontWeight: 400, color: muted, textAlign: "center", maxWidth: 260 }}>
            Track momentum without micromanaging
          </div>
        </div>
      </div>
    </div>
  );
}

function OutroSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subDelay = 15;
  const subSpring = spring({ frame: frame - subDelay, fps, config: { damping: 14, stiffness: 60 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);
  const subY = interpolate(subSpring, [0, 1], [20, 0]);

  const accentWidth = interpolate(frame, [5, 40], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowPulse = interpolate(frame, [30, 60, 90], [0, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: SAFE,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontFamily: "Archivo",
          fontWeight: 700,
          color: fg,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          lineHeight: 1.2,
        }}
      >
        Start your next week
        <br />
        with{" "}
        <span style={{ color: accent }}>Relay</span>
      </div>

      <div
        style={{
          width: accentWidth,
          height: 4,
          backgroundColor: accent,
          borderRadius: 2,
          marginTop: 32,
          marginBottom: 32,
          boxShadow: `0 0 ${glowPulse * 20}px ${accent}`,
        }}
      />

      <div
        style={{
          fontSize: 24,
          fontFamily: "Archivo",
          fontWeight: 400,
          color: muted,
          transform: `translateY(${subY}px)`,
          opacity: subOpacity,
        }}
      >
        relay.app
      </div>
    </div>
  );
}

export function BenchmarkVideo() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const gridOpacity = interpolate(frame, [0, 30], [0, 0.04], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        backgroundColor: bg,
        overflow: "hidden",
        opacity: bgOpacity,
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(${muted} 1px, transparent 1px), linear-gradient(90deg, ${muted} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondary}08 0%, transparent 70%)`,
        }}
      />

      <Sequence from={0} durationInFrames={90}>
        <IntroSection />
      </Sequence>

      <Sequence from={90} durationInFrames={180}>
        <FeaturesSection />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <OutroSection />
      </Sequence>
    </div>
  );
}