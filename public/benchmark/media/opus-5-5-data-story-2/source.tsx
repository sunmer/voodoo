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

const FONT = "Archivo";

const DATA: { day: string; hours: number }[] = [
  { day: "Monday", hours: 2 },
  { day: "Tuesday", hours: 3 },
  { day: "Wednesday", hours: 4 },
  { day: "Thursday", hours: 3 },
  { day: "Friday", hours: 5 },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const subEnter = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const lineW = interpolate(frame, [6, 40], [0, 240], clamp);
  const out = interpolate(frame, [76, 90], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 200,
        paddingRight: 200,
        opacity: out,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: lineW,
          height: 10,
          backgroundColor: palette.accent,
          borderRadius: 5,
          marginBottom: 48,
        }}
      />
      <div
        style={{
          color: palette.foreground,
          fontSize: 128,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.05,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        A week with more focus
      </div>
      <div
        style={{
          color: palette.muted,
          fontSize: 44,
          fontWeight: 500,
          marginTop: 36,
          opacity: subEnter,
          transform: `translateY(${(1 - subEnter) * 24}px)`,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: palette.secondary,
            display: "inline-block",
          }}
        />
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

const CHART_LEFT = 260;
const CHART_RIGHT = 1700;
const BASELINE = 850;
const PX_PER_HOUR = 108;
const MAX_HOURS = 5;
const BAR_W = 168;

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [165, 180], [1, 0], clamp);
  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const gridIn = interpolate(frame, [4, 24], [0, 1], clamp);
  const colW = (CHART_RIGHT - CHART_LEFT) / DATA.length;
  const ticks = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 100,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 20}px)`,
        }}
      >
        <div
          style={{
            color: palette.foreground,
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          Focus hours per day
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 122,
          color: palette.muted,
          fontSize: 32,
          fontWeight: 500,
          opacity: titleIn,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: palette.secondary,
            display: "inline-block",
          }}
        />
        Illustrative data
      </div>

      {ticks.map((t) => {
        const y = BASELINE - t * PX_PER_HOUR;
        return (
          <React.Fragment key={t}>
            <div
              style={{
                position: "absolute",
                left: CHART_LEFT,
                width: CHART_RIGHT - CHART_LEFT,
                top: y - (t === 0 ? 2 : 1),
                height: t === 0 ? 4 : 2,
                backgroundColor:
                  t === 0 ? palette.muted : "rgba(177,180,188,0.18)",
                opacity: gridIn,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 140,
                width: 90,
                top: y - 18,
                textAlign: "right",
                color: palette.muted,
                fontSize: 28,
                fontWeight: 500,
                opacity: gridIn,
              }}
            >
              {t}
            </div>
          </React.Fragment>
        );
      })}

      {DATA.map((d, i) => {
        const delay = 14 + i * 8;
        const grow = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
          durationInFrames: 32,
        });
        const h = d.hours * PX_PER_HOUR * grow;
        const cx = CHART_LEFT + colW * i + colW / 2;
        const valueIn = interpolate(frame, [delay + 22, delay + 34], [0, 1], clamp);
        const labelIn = interpolate(frame, [6 + i * 4, 22 + i * 4], [0, 1], clamp);
        const isMax = d.hours === MAX_HOURS;
        return (
          <React.Fragment key={d.day}>
            <div
              style={{
                position: "absolute",
                left: cx - BAR_W / 2,
                width: BAR_W,
                top: BASELINE - h,
                height: h,
                backgroundColor: isMax ? palette.accent : palette.secondary,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: cx - 120,
                width: 240,
                top: BASELINE - d.hours * PX_PER_HOUR - 84,
                textAlign: "center",
                color: palette.foreground,
                fontSize: 60,
                fontWeight: 800,
                opacity: valueIn,
                transform: `translateY(${(1 - valueIn) * 12}px)`,
              }}
            >
              {d.hours}
            </div>
            <div
              style={{
                position: "absolute",
                left: cx - colW / 2,
                width: colW,
                top: BASELINE + 26,
                textAlign: "center",
                color: palette.foreground,
                fontSize: 36,
                fontWeight: 600,
                opacity: labelIn,
              }}
            >
              {d.day}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], clamp);
  const main = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const brand = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 20 });
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          color: palette.foreground,
          fontSize: 112,
          fontWeight: 800,
          letterSpacing: -2,
          textAlign: "center",
          opacity: main,
          transform: `translateY(${(1 - main) * 30}px)`,
        }}
      >
        <span style={{ color: palette.accent }}>17 hours</span> of focused work
      </div>
      <div
        style={{
          marginTop: 64,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: brand,
          transform: `translateY(${(1 - brand) * 20}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
          {[18, 28, 38].map((hh, k) => (
            <div
              key={k}
              style={{
                width: 10,
                height: hh,
                borderRadius: 3,
                backgroundColor: k === 2 ? palette.accent : palette.secondary,
              }}
            />
          ))}
        </div>
        <div
          style={{
            color: palette.foreground,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Relay
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          color: palette.muted,
          fontSize: 28,
          fontWeight: 500,
          opacity: brand,
        }}
      >
        Illustrative data
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
