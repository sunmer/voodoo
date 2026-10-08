import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
} from "remotion";
import { palette } from "./contract";

const FPS = 30;
const FONT = "Archivo";

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const fade = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const enterSpring = (frame: number, delay = 0): number =>
  clamp01(
    spring({
      frame: Math.max(0, frame - delay),
      fps: FPS,
      config: { mass: 1, damping: 22, stiffness: 120 },
    })
  );

const DAYS: { label: string; value: number }[] = [
  { label: "Monday", value: 2 },
  { label: "Tuesday", value: 3 },
  { label: "Wednesday", value: 4 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 5 },
];

const PLOT_LEFT = 360;
const PLOT_RIGHT = 1800;
const BASELINE_Y = 880;
const PX_PER_HOUR = 100;
const SLOT = (PLOT_RIGHT - PLOT_LEFT) / DAYS.length;
const BAR_W = 180;
const TICKS = [0, 1, 2, 3, 4, 5, 6];

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 14;
  const drift2 = Math.cos(frame / 110) * 12;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 1180 + drift,
          top: -420 + drift2,
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.accent}16 0%, ${palette.accent}00 72%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -320 + drift2,
          top: 620 + drift,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.secondary}14 0%, ${palette.secondary}00 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const out = 1 - fade(frame, 74, 90);
  const ruleIn = enterSpring(frame, 4);
  const titleIn = enterSpring(frame, 0);
  const subIn = enterSpring(frame, 14);

  return (
    <AbsoluteFill style={{ opacity: out, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 420,
          width: 132 * ruleIn,
          height: 8,
          borderRadius: 4,
          backgroundColor: palette.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 468,
          fontSize: 104,
          fontWeight: 700,
          color: palette.foreground,
          letterSpacing: -2.5,
          lineHeight: 1.06,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 26}px)`,
        }}
      >
        A week with more focus
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 612,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 14}px)`,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: palette.secondary,
          }}
        />
        <span
          style={{
            fontSize: 30,
            letterSpacing: 4,
            color: palette.muted,
          }}
        >
          Illustrative data
        </span>
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();

  const inOpacity = fade(frame, 0, 10);
  const outOpacity = 1 - fade(frame, 168, 180);
  const opacity = inOpacity * outOpacity;

  const headIn = enterSpring(frame, 0);
  const capIn = enterSpring(frame, 6);

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: PLOT_LEFT,
          top: 116,
          fontSize: 44,
          fontWeight: 700,
          color: palette.foreground,
          letterSpacing: -0.8,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 16}px)`,
        }}
      >
        Focus hours per day
      </div>
      <div
        style={{
          position: "absolute",
          left: PLOT_LEFT,
          top: 134,
          width: PLOT_RIGHT - PLOT_LEFT,
          textAlign: "right",
          fontSize: 26,
          letterSpacing: 4,
          color: palette.muted,
          opacity: capIn,
        }}
      >
        Illustrative data
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          width: 250,
          top: 232,
          textAlign: "right",
          fontSize: 22,
          letterSpacing: 3,
          color: palette.muted,
          opacity: capIn,
        }}
      >
        hours
      </div>

      {TICKS.map((tick) => {
        const y = BASELINE_Y - tick * PX_PER_HOUR;
        return (
          <React.Fragment key={`tick-${tick}`}>
            <div
              style={{
                position: "absolute",
                left: PLOT_LEFT,
                top: y,
                width: PLOT_RIGHT - PLOT_LEFT,
                height: tick === 0 ? 2 : 1,
                backgroundColor: palette.foreground,
                opacity: tick === 0 ? 0.32 : 0.08,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 90,
                width: 250,
                top: y,
                textAlign: "right",
                fontSize: 26,
                color: palette.muted,
                transform: "translateY(-50%)",
              }}
            >
              {tick}
            </div>
          </React.Fragment>
        );
      })}

      {DAYS.map((day, i) => {
        const grow = enterSpring(frame, 6 + i * 5);
        const height = day.value * PX_PER_HOUR * grow;
        const center = PLOT_LEFT + SLOT * (i + 0.5);
        const barLeft = center - BAR_W / 2;
        const valueOpacity = fade(frame, 40 + i * 4, 54 + i * 4);
        const dayOpacity = fade(frame, 2 + i * 3, 16 + i * 3);
        const valueTop = BASELINE_Y - day.value * PX_PER_HOUR - 82;

        return (
          <React.Fragment key={day.label}>
            <div
              style={{
                position: "absolute",
                left: barLeft,
                top: BASELINE_Y - height,
                width: BAR_W,
                height: Math.max(0, height),
                background: `linear-gradient(180deg, ${palette.accent} 0%, ${palette.accent}B3 100%)`,
                borderRadius: "12px 12px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: barLeft,
                top: valueTop,
                width: BAR_W,
                height: 62,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                fontSize: 42,
                fontWeight: 700,
                color: palette.accent,
                opacity: valueOpacity,
                transform: `translateY(${(1 - valueOpacity) * 10}px)`,
              }}
            >
              {day.value}
            </div>
            <div
              style={{
                position: "absolute",
                left: center - 160,
                top: 914,
                width: 320,
                textAlign: "center",
                fontSize: 30,
                color: palette.foreground,
                opacity: dayOpacity,
              }}
            >
              {day.label}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();

  const ruleIn = enterSpring(frame, 0);
  const headIn = enterSpring(frame, 4);
  const brandIn = enterSpring(frame, 12);
  const noteIn = enterSpring(frame, 18);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 342,
          width: 132 * ruleIn,
          height: 8,
          borderRadius: 4,
          backgroundColor: palette.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 386,
          fontSize: 96,
          fontWeight: 700,
          color: palette.foreground,
          letterSpacing: -2,
          lineHeight: 1.1,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 24}px)`,
        }}
      >
        17 hours of focused work
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 542,
          width: 720 * brandIn,
          height: 2,
          backgroundColor: palette.foreground,
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 576,
          fontSize: 58,
          fontWeight: 700,
          color: palette.accent,
          letterSpacing: 0.5,
          opacity: brandIn,
          transform: `translateY(${(1 - brandIn) * 18}px)`,
        }}
      >
        Relay
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 678,
          fontSize: 26,
          letterSpacing: 4,
          color: palette.muted,
          opacity: noteIn,
        }}
      >
        Illustrative data
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 748,
          display: "flex",
          gap: 10,
        }}
      >
        {Array.from({ length: 17 }, (_, i) => (
          <div
            key={`hour-${i}`}
            style={{
              width: 28,
              height: 12,
              borderRadius: 6,
              backgroundColor: palette.accent,
              opacity: 0.14 + 0.86 * fade(frame, 12 + i * 2, 24 + i * 2),
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.background, fontFamily: FONT }}
    >
      <Backdrop />
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Finale />
      </Sequence>
    </AbsoluteFill>
  );
};
