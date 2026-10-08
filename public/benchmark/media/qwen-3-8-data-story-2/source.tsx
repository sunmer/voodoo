import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
} from "remotion";
import { palette } from "./contract";

const BAR_DATA = [
  { label: "Monday", value: 2 },
  { label: "Tuesday", value: 3 },
  { label: "Wednesday", value: 4 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 5 },
];

const MAX_VALUE = 5;
const CHART_TOP = 220;
const CHART_BOTTOM = 800;
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;
const BAR_WIDTH = 140;
const SAFE = 80;

function barCenterX(index: number): number {
  const usable = 1920 - SAFE * 2;
  return SAFE + usable * ((index + 0.5) / BAR_DATA.length);
}

const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame: frame - 10, fps: 30, config: { damping: 18, stiffness: 80 } });
  const subtitleOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = spring({ frame: frame - 35, fps: 30, config: { damping: 18, stiffness: 80 } });
  const fadeOut = interpolate(frame, [75, 89], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 72,
          fontWeight: 700,
          color: palette.foreground,
          opacity: titleOpacity,
          transform: `translateY(${(1 - titleY) * 40}px)`,
          textAlign: "center",
          padding: `0 ${SAFE}px`,
        }}
      >
        A week with more focus
      </div>
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 32,
          fontWeight: 400,
          color: palette.muted,
          opacity: subtitleOpacity,
          transform: `translateY(${(1 - subtitleY) * 24}px)`,
          marginTop: 28,
          textAlign: "center",
          padding: `0 ${SAFE}px`,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const ChartSection: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [168, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 100,
          left: SAFE,
          right: SAFE,
          fontFamily: "Archivo",
          fontSize: 44,
          fontWeight: 700,
          color: palette.foreground,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        Focus hours per day
      </div>

      {/* Baseline */}
      <div
        style={{
          position: "absolute",
          left: SAFE,
          right: SAFE,
          top: CHART_BOTTOM,
          height: 2,
          backgroundColor: palette.muted,
          opacity: 0.4,
        }}
      />

      {/* Bars */}
      {BAR_DATA.map((d, i) => {
        const delay = 15 + i * 10;
        const progress = spring({
          frame: frame - delay,
          fps: 30,
          config: { damping: 20, stiffness: 60, mass: 1 },
        });
        const barH = (d.value / MAX_VALUE) * CHART_HEIGHT * progress;
        const cx = barCenterX(i);
        const valueOpacity = interpolate(frame, [delay + 20, delay + 35], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <React.Fragment key={d.label}>
            {/* Bar */}
            <div
              style={{
                position: "absolute",
                left: cx - BAR_WIDTH / 2,
                top: CHART_BOTTOM - barH,
                width: BAR_WIDTH,
                height: barH,
                backgroundColor: palette.accent,
                borderRadius: 6,
              }}
            />
            {/* Value label */}
            <div
              style={{
                position: "absolute",
                left: cx - BAR_WIDTH / 2,
                top: CHART_BOTTOM - barH - 44,
                width: BAR_WIDTH,
                textAlign: "center",
                fontFamily: "Archivo",
                fontSize: 34,
                fontWeight: 700,
                color: palette.accent,
                opacity: valueOpacity,
              }}
            >
              {d.value}
            </div>
            {/* Day label */}
            <div
              style={{
                position: "absolute",
                left: cx - BAR_WIDTH / 2 - 20,
                top: CHART_BOTTOM + 18,
                width: BAR_WIDTH + 40,
                textAlign: "center",
                fontFamily: "Archivo",
                fontSize: 26,
                fontWeight: 500,
                color: palette.foreground,
              }}
            >
              {d.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* Y-axis labels */}
      {[0, 1, 2, 3, 4, 5].map((v) => {
        const y = CHART_BOTTOM - (v / MAX_VALUE) * CHART_HEIGHT;
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: SAFE - 50,
              top: y - 12,
              width: 40,
              textAlign: "right",
              fontFamily: "Archivo",
              fontSize: 22,
              color: palette.muted,
              opacity: 0.7,
            }}
          >
            {v}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const OutroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const mainOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainScale = spring({
    frame: frame - 5,
    fps: 30,
    config: { damping: 16, stiffness: 70 },
  });
  const brandOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandY = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 18, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 64,
          fontWeight: 700,
          color: palette.foreground,
          opacity: mainOpacity,
          transform: `scale(${0.9 + 0.1 * mainScale})`,
          textAlign: "center",
          padding: `0 ${SAFE}px`,
        }}
      >
        17 hours of focused work
      </div>
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: 48,
          fontWeight: 700,
          color: palette.secondary,
          opacity: brandOpacity,
          transform: `translateY(${(1 - brandY) * 20}px)`,
          marginTop: 36,
          textAlign: "center",
          letterSpacing: 4,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <Sequence from={0} durationInFrames={90}>
        <IntroSection />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <ChartSection />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <OutroSection />
      </Sequence>
    </AbsoluteFill>
  );
};