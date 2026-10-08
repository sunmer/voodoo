import React from "react";
import { useCurrentFrame, interpolate, spring, Sequence, useVideoConfig } from "remotion";
import { palette } from "./contract";

const { background, foreground, accent, secondary, muted } = palette;

function IntroSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [25, 45], [30, 0], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: exitOpacity }}>
      <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, fontSize: 120, fontWeight: 800, fontFamily: "Archivo", color: foreground, letterSpacing: -3 }}>
        Relay
      </div>
      <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)`, fontSize: 36, fontWeight: 400, fontFamily: "Archivo", color: muted, marginTop: 24 }}>
        Make room for focused work
      </div>
      <div style={{ position: "absolute", bottom: 120, width: 80, height: 4, borderRadius: 2, backgroundColor: accent, opacity: taglineOpacity }} />
    </div>
  );
}

function FeatureCard({ title, icon, delay, color }: { title: string; icon: React.ReactNode; delay: number; color: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 100 } });
  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 32px", borderRadius: 20, backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, width: 380 }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: `${color}22`, border: `2px solid ${color}44` }}>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, fontFamily: "Archivo", color: foreground, textAlign: "center" }}>{title}</div>
    </div>
  );
}

function ProductInterface() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerScale = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const containerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const barWidth1 = interpolate(frame, [30, 60], [0, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barWidth2 = interpolate(frame, [45, 75], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barWidth3 = interpolate(frame, [60, 90], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const checkPop = spring({ frame: frame - 70, fps, config: { damping: 10, stiffness: 120 } });

  return (
    <div style={{ transform: `scale(${containerScale})`, opacity: containerOpacity, width: 700, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: 40, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: accent }} />
        <div style={{ fontSize: 18, fontFamily: "Archivo", color: muted, fontWeight: 500 }}>This week</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: barWidth1, height: 14, borderRadius: 7, backgroundColor: secondary, opacity: 0.8 }} />
          <div style={{ fontSize: 14, fontFamily: "Archivo", color: muted }}>Mon</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: barWidth2, height: 14, borderRadius: 7, backgroundColor: accent, opacity: 0.8 }} />
          <div style={{ fontSize: 14, fontFamily: "Archivo", color: muted }}>Wed</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: barWidth3, height: 14, borderRadius: 7, backgroundColor: secondary, opacity: 0.6 }} />
          <div style={{ fontSize: 14, fontFamily: "Archivo", color: muted }}>Fri</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, opacity: checkPop, transform: `scale(${checkPop})` }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: `${accent}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 3.5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 16, fontFamily: "Archivo", color: accent, fontWeight: 500 }}>On track</span>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48, opacity: exitOpacity }}>
      <ProductInterface />
      <div style={{ display: "flex", gap: 32 }}>
        <FeatureCard title="Plan together" color={secondary} delay={20} icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="6" width="20" height="20" rx="4" stroke={secondary} strokeWidth="2" />
            <line x1="6" y1="12" x2="26" y2="12" stroke={secondary} strokeWidth="2" />
            <line x1="12" y1="12" x2="12" y2="26" stroke={secondary} strokeWidth="1.5" />
          </svg>
        } />
        <FeatureCard title="Protect focus time" color={accent} delay={40} icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="10" stroke={accent} strokeWidth="2" />
            <path d="M16 10V16L20 20" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        } />
        <FeatureCard title="See progress" color={muted} delay={60} icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 24L14 16L19 20L26 10" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        } />
      </div>
    </div>
  );
}

function OutroSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textSpring = spring({ frame, fps, config: { damping: 14, stiffness: 70 } });
  const textOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [20, 40], [20, 0], { extrapolateRight: "clamp" });
  const glowOpacity = interpolate(frame, [10, 30], [0, 0.15], { extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`, opacity: glowOpacity }} />
      <div style={{ transform: `scale(${textSpring})`, opacity: textOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 64, fontWeight: 700, fontFamily: "Archivo", color: foreground, textAlign: "center", lineHeight: 1.2 }}>
          Start your next week
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, fontFamily: "Archivo", color: accent, textAlign: "center", lineHeight: 1.2 }}>
          with Relay
        </div>
      </div>
      <div style={{ opacity: subOpacity, transform: `translateY(${subY}px)`, marginTop: 40, display: "flex", alignItems: "center", gap: 12, padding: "14px 32px", borderRadius: 40, border: `1px solid ${accent}55`, backgroundColor: `${accent}11` }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: accent }} />
        <span style={{ fontSize: 22, fontFamily: "Archivo", color: foreground, fontWeight: 500 }}>Team planning, simplified</span>
      </div>
    </div>
  );
}

export function BenchmarkVideo() {
  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: background, position: "relative", overflow: "hidden", fontFamily: "Archivo" }}>
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