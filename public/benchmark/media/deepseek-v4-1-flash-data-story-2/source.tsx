import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./contract";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const FONT_FAMILY = "Archivo";

type Day = {
  label: string;
  value: number;
};

const DAYS: Day[] = [
  { label: "Monday", value: 2 },
  { label: "Tuesday", value: 3 },
  { label: "Wednesday", value: 4 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 5 },
];

// Chart geometry: one shared zero baseline, linear scale, 96px per hour.
const PLOT_LEFT = 280;
const BAR_WIDTH = 160;
const BAR_GAP = 140;
const BASELINE_Y = 850;
const PX_PER_HOUR = 96;
const PLOT_WIDTH = DAYS.length * BAR_WIDTH + (DAYS.length - 1) * BAR_GAP;

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = Math.min(
    1,
    spring({
      frame,
      fps,
      config: { damping: 200, mass: 0.7, stiffness: 110 },
      durationInFrames: 34,
    })
  );

  const rise = interpolate(enter, [0, 1], [34, 0]);
  const exit = interpolate(frame, [76, 90], [1, 0], CLAMP);
  const ruleWidth = interpolate(frame, [16, 40], [0, 180], CLAMP);
  const noteOpacity = interpolate(frame, [26, 46], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.background, fontFamily: FONT_FAMILY }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 80,
          opacity: exit,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -1.4,
            lineHeight: 1.1,
            textAlign: "center",
            color: palette.foreground,
            transform: `translateY(${rise}px)`,
          }}
        >
          A week with <span style={{ color: palette.accent }}>more focus</span>
        </div>
        <div
          style={{
            marginTop: 46,
            width: ruleWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: palette.accent,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            marginTop: 44,
            fontSize: 28,
            letterSpacing: 3,
            color: palette.muted,
            opacity: noteOpacity,
          }}
        >
          Illustrative data
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ChartBar: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const day = DAYS[index];

  const delay = 18 + index * 8;
  const local = frame - delay;

  const rawSpring =
    local <= 0
      ? 0
      : spring({
          frame: local,
          fps,
          config: { damping: 16, mass: 0.7, stiffness: 110 },
          durationInFrames: 34,
        });

  const progress = Math.min(1, Math.max(0, rawSpring));
  const barHeight = day.value * PX_PER_HOUR * progress;
  const valueOpacity = interpolate(progress, [0.45, 0.95], [0, 1], CLAMP);
  const labelOpacity = interpolate(progress, [0, 0.45], [0, 1], CLAMP);

  const left = PLOT_LEFT + index * (BAR_WIDTH + BAR_GAP);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          bottom: 1080 - BASELINE_Y,
          width: BAR_WIDTH,
          height: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: BAR_WIDTH,
            height: barHeight,
            borderRadius: "10px 10px 0 0",
            background: `linear-gradient(180deg, ${palette.accent} 0%, ${palette.accent}CC 100%)`,
            boxShadow: `0 0 40px ${palette.accent}22`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: barHeight + 16,
            width: BAR_WIDTH,
            textAlign: "center",
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1,
            color: palette.foreground,
            opacity: valueOpacity,
          }}
        >
          {day.value}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left,
          top: BASELINE_Y + 34,
          width: BAR_WIDTH,
          textAlign: "center",
          fontSize: 32,
          lineHeight: 1.2,
          color: palette.muted,
          opacity: labelOpacity,
        }}
      >
        {day.label}
      </div>
    </>
  );
};

const ChartScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [4, 22], [0, 1], CLAMP);
  const gridOpacity = interpolate(frame, [6, 26], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.background, fontFamily: FONT_FAMILY }}
    >
      <div
        style={{
          position: "absolute",
          left: PLOT_LEFT,
          top: 134,
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: -0.8,
          color: palette.foreground,
          opacity: headerOpacity,
        }}
      >
        Focus hours per day
      </div>
      <div
        style={{
          position: "absolute",
          left: PLOT_LEFT,
          top: 198,
          fontSize: 26,
          letterSpacing: 3,
          color: palette.muted,
          opacity: headerOpacity * 0.9,
        }}
      >
        Illustrative data
      </div>

      {[1, 2, 3, 4, 5].map((tick) => (
        <div
          key={`grid-${tick}`}
          style={{
            position: "absolute",
            left: PLOT_LEFT,
            top: BASELINE_Y - tick * PX_PER_HOUR,
            width: PLOT_WIDTH,
            height: 1,
            backgroundColor: "rgba(245, 245, 242, 0.10)",
            opacity: gridOpacity,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: PLOT_LEFT - 18,
          top: BASELINE_Y,
          width: PLOT_WIDTH + 18,
          height: 2,
          backgroundColor: "rgba(245, 245, 242, 0.38)",
          opacity: gridOpacity,
        }}
      />

      {[0, 1, 2, 3, 4, 5].map((tick) => (
        <div
          key={`tick-${tick}`}
          style={{
            position: "absolute",
            left: 80,
            top: BASELINE_Y - tick * PX_PER_HOUR - 15,
            width: PLOT_LEFT - 32 - 80,
            textAlign: "right",
            fontSize: 24,
            lineHeight: 1,
            color: palette.muted,
            opacity: gridOpacity * 0.85,
          }}
        >
          {tick}
        </div>
      ))}

      {DAYS.map((day, index) => (
        <ChartBar key={day.label} index={index} />
      ))}
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = Math.min(
    1,
    spring({
      frame,
      fps,
      config: { damping: 200, mass: 0.7, stiffness: 120 },
      durationInFrames: 18,
    })
  );

  const rise = interpolate(enter, [0, 1], [28, 0]);
  const ruleWidth = interpolate(frame, [2, 18], [0, 180], CLAMP);
  const relayOpacity = interpolate(frame, [4, 16], [0, 1], CLAMP);
  const noteOpacity = interpolate(frame, [8, 18], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.background, fontFamily: FONT_FAMILY }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 80,
          opacity: enter,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -1.4,
            lineHeight: 1.1,
            textAlign: "center",
            color: palette.foreground,
            transform: `translateY(${rise}px)`,
          }}
        >
          <span style={{ color: palette.accent }}>17 hours</span> of focused work
        </div>
        <div
          style={{
            marginTop: 46,
            width: ruleWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: palette.accent,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: 10,
            color: palette.foreground,
            opacity: relayOpacity,
          }}
        >
          Relay
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            letterSpacing: 3.5,
            color: palette.muted,
            opacity: noteOpacity * 0.85,
          }}
        >
          Illustrative data
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <Sequence from={0} durationInFrames={90} name="Intro">
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={180} name="FocusChart">
        <ChartScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
