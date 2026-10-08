import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
} from "remotion";
import { palette } from "./contract";

const FONT = "Archivo";

const DAYS = [
  { label: "Monday", value: 2 },
  { label: "Tuesday", value: 3 },
  { label: "Wednesday", value: 4 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 5 },
];

const SCALE_MAX = 6; // linear scale, zero baseline, 0..6 hours

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [16, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [16, 40], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ruleWidth = interpolate(frame, [10, 46], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [72, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [72, 88], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        alignItems: "center",
        justifyContent: "center",
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          transform: `translateY(${titleY + exitY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 116,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: palette.foreground,
            opacity: titleOpacity,
            lineHeight: 1.1,
          }}
        >
          A week with more focus
        </div>
        <div
          style={{
            width: ruleWidth,
            height: 4,
            backgroundColor: palette.accent,
            marginTop: 36,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: palette.muted,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          Illustrative data
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [164, 178], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = entrance * exitOpacity;

  const titleOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chart geometry (safe margins: 80px on all sides)
  const baselineY = 920; // common zero baseline
  const chartTop = 300;
  const chartHeight = baselineY - chartTop; // 620px for 6 hours
  const marginX = 80;
  const chartWidth = 1920 - marginX * 2;
  const barWidth = 220;
  const slot = chartWidth / DAYS.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        opacity,
      }}
    >
      {/* Chart title */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: marginX,
          right: marginX,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: palette.foreground,
          }}
        >
          Focus hours per day
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: palette.muted,
            marginTop: 10,
          }}
        >
          Illustrative data
        </div>
      </div>

      {/* Gridlines: 0, 2, 4, 6 */}
      {[0, 2, 4, 6].map((h) => {
        const y = baselineY - (h / SCALE_MAX) * chartHeight;
        const lineOpacity =
          interpolate(frame, [2, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * 0.18;
        return (
          <React.Fragment key={h}>
            <div
              style={{
                position: "absolute",
                left: marginX,
                width: chartWidth,
                top: y,
                height: 2,
                backgroundColor: palette.foreground,
                opacity: lineOpacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: marginX,
                top: y - 16,
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 500,
                color: palette.muted,
                opacity: interpolate(frame, [2, 20], [0, 0.8], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {h}
            </div>
          </React.Fragment>
        );
      })}

      {/* Bars */}
      {DAYS.map((day, i) => {
        const delay = 12 + i * 6;
        const grow = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200, stiffness: 70, mass: 1.1 },
        });
        const targetHeight = (day.value / SCALE_MAX) * chartHeight;
        const barHeight = targetHeight * grow;

        const labelOpacity = interpolate(frame, [delay + 4, delay + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const valueOpacity = interpolate(
          frame,
          [delay + targetHeight / chartHeight * 24, delay + targetHeight / chartHeight * 24 + 14],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const centerX = marginX + slot * i + slot / 2;

        return (
          <React.Fragment key={day.label}>
            <div
              style={{
                position: "absolute",
                left: centerX - barWidth / 2,
                top: baselineY - barHeight,
                width: barWidth,
                height: barHeight,
                backgroundColor:
                  i === DAYS.length - 1 ? palette.accent : palette.secondary,
              }}
            />
            {/* Exact value above the bar */}
            <div
              style={{
                position: "absolute",
                left: centerX - barWidth / 2,
                width: barWidth,
                top: baselineY - barHeight - 58,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 44,
                fontWeight: 700,
                color: palette.foreground,
                opacity: valueOpacity,
              }}
            >
              {day.value}h
            </div>
            {/* Day label below the baseline */}
            <div
              style={{
                position: "absolute",
                left: centerX - barWidth / 2,
                width: barWidth,
                top: baselineY + 26,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 500,
                color: palette.muted,
                opacity: labelOpacity,
              }}
            >
              {day.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* Axis caption */}
      <div
        style={{
          position: "absolute",
          left: marginX,
          top: baselineY + 96,
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: palette.muted,
          opacity: interpolate(frame, [10, 26], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Hours of focused work
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bigSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 70, mass: 1 },
  });
  const bigY = interpolate(bigSpring, [0, 1], [36, 0]);
  const bigOpacity = interpolate(frame, [4, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordmarkOpacity = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordmarkWidth = interpolate(frame, [18, 48], [0, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: palette.foreground,
            opacity: bigOpacity,
            transform: `translateY(${bigY}px)`,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          17 hours of focused work
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 48,
            opacity: wordmarkOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: palette.accent,
            }}
          >
            Relay
          </div>
          <div
            style={{
              width: wordmarkWidth,
              height: 4,
              backgroundColor: palette.secondary,
              marginTop: 20,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        fontFamily: FONT,
        opacity: fadeOut,
      }}
    >
      <Sequence from={0} durationInFrames={90} name="Intro">
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180} name="Chart">
        <Chart />
      </Sequence>
      <Sequence from={270} durationInFrames={90} name="Final">
        <Final />
      </Sequence>
    </AbsoluteFill>
  );
};
