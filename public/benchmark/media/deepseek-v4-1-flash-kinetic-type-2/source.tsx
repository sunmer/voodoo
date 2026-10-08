import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./contract";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const enter = (
  frame: number,
  fps: number,
  delay: number,
  durationInFrames: number,
  damping = 22,
  stiffness = 95,
  mass = 0.9,
) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping, stiffness, mass },
    durationInFrames,
  });

const exitFade = (frame: number) =>
  interpolate(frame, [82, 90], [1, 0], CLAMP);

/* ------------------------------------------------------------------ */
/* 0s - 3s  ·  "Less noise."                                           */
/* Two halves converge from opposite sides and lock onto a centre line. */
/* ------------------------------------------------------------------ */

const SceneOne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pLeft = enter(frame, fps, 0, 22, 18, 110, 0.9);
  const pRight = enter(frame, fps, 5, 22, 18, 110, 0.9);

  const xLeft = interpolate(pLeft, [0, 1], [-360, 0]);
  const xRight = interpolate(pRight, [0, 1], [360, 0]);
  const scaleRight = interpolate(pRight, [0, 1], [1.16, 1]);

  const oLeft = interpolate(frame, [0, 7], [0, 1], CLAMP);
  const oRight = interpolate(frame, [5, 13], [0, 1], CLAMP);

  const ruleProgress = enter(frame, fps, 20, 26, 26, 60, 1);
  const drift = interpolate(frame, [82, 90], [0, -46], CLAMP);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitFade(frame),
        transform: `translateY(${drift}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily: "Archivo",
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: palette.foreground,
        }}
      >
        <span
          style={{
            display: "inline-block",
            opacity: oLeft,
            transform: `translateX(${xLeft}px)`,
          }}
        >
          Less
        </span>
        <span style={{ display: "inline-block", width: "0.32em" }} />
        <span
          style={{
            display: "inline-block",
            color: palette.muted,
            opacity: oRight,
            transform: `translateX(${xRight}px) scale(${scaleRight})`,
            transformOrigin: "center",
          }}
        >
          noise<span style={{ color: palette.accent }}>.</span>
        </span>
      </div>

      <div
        style={{
          marginTop: 54,
          width: 660,
          height: 4,
          borderRadius: 2,
          backgroundColor: palette.accent,
          opacity: 0.75,
          transform: `scaleX(${interpolate(ruleProgress, [0, 1], [0, 1])})`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3s - 6s  ·  "More focus."                                           */
/* Letter-by-letter rise out of a blur; the second word snaps in sharp. */
/* ------------------------------------------------------------------ */

const SceneTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "More", color: palette.foreground },
    { text: "focus.", color: palette.accent },
  ];

  const zoom = interpolate(frame, [82, 90], [1, 1.04], CLAMP);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitFade(frame),
        transform: `scale(${zoom})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily: "Archivo",
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {words.map((word, wi) => (
          <React.Fragment key={`word-${wi}`}>
            {wi > 0 ? (
              <span style={{ display: "inline-block", width: "0.32em" }} />
            ) : null}
            <span
              style={{
                display: "inline-block",
                color: word.color,
                whiteSpace: "pre",
              }}
            >
              {word.text.split("").map((ch, ci) => {
                const p = enter(frame, fps, wi * 4 + ci * 1.5, 18, 22, 130, 0.7);
                const y = interpolate(p, [0, 1], [120, 0]);
                const o = interpolate(p, [0, 0.4], [0, 1], CLAMP);
                const blur = interpolate(p, [0, 1], [18, 0], CLAMP);
                return (
                  <span
                    key={`char-${ci}`}
                    style={{
                      display: "inline-block",
                      opacity: o,
                      transform: `translateY(${y}px)`,
                      filter: `blur(${blur}px)`,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6s - 9s  ·  "Better work, together."                                */
/* Three words swing up one after another and level into a single line. */
/* ------------------------------------------------------------------ */

const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "Better", color: palette.foreground },
    { text: "work,", color: palette.foreground },
    { text: "together.", color: palette.accent },
  ];

  const ruleProgress = enter(frame, fps, 24, 24, 28, 55, 1);
  const drift = interpolate(frame, [82, 90], [0, -40], CLAMP);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitFade(frame),
        transform: `translateY(${drift}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily: "Archivo",
          fontWeight: 800,
          fontSize: 106,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {words.map((word, i) => {
          const p = enter(frame, fps, i * 5, 22, 18, 100, 0.9);
          const y = interpolate(p, [0, 1], [150, 0]);
          const rot = interpolate(p, [0, 1], [i % 2 === 0 ? -5 : 5, 0]);
          const o = interpolate(p, [0, 0.5], [0, 1], CLAMP);
          return (
            <React.Fragment key={`word-${i}`}>
              {i > 0 ? (
                <span style={{ display: "inline-block", width: "0.3em" }} />
              ) : null}
              <span
                style={{
                  display: "inline-block",
                  color: word.color,
                  opacity: o,
                  transform: `translateY(${y}px) rotate(${rot}deg)`,
                }}
              >
                {word.text}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 48,
          width: 900,
          height: 4,
          borderRadius: 2,
          backgroundColor: palette.secondary,
          opacity: 0.7,
          transform: `scaleX(${interpolate(ruleProgress, [0, 1], [0, 1])})`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9s - 12s  ·  "Make room for what matters." + "Relay"                */
/* Everything locks up by frame 28 and holds perfectly still after.     */
/* ------------------------------------------------------------------ */

const SceneFour: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const l1 = enter(frame, fps, 0, 20, 26, 90, 0.9);
  const l2 = enter(frame, fps, 4, 20, 26, 90, 0.9);
  const mark = enter(frame, fps, 8, 20, 22, 90, 0.9);
  const rule = enter(frame, fps, 12, 16, 28, 60, 1);

  const y1 = interpolate(l1, [0, 1], [44, 0]);
  const y2 = interpolate(l2, [0, 1], [44, 0]);
  const o1 = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const o2 = interpolate(frame, [4, 14], [0, 1], CLAMP);
  const oMark = interpolate(frame, [8, 18], [0, 1], CLAMP);
  const sMark = interpolate(mark, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily: "Archivo",
          fontWeight: 800,
          fontSize: 118,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          textAlign: "center",
          color: palette.foreground,
        }}
      >
        <div style={{ opacity: o1, transform: `translateY(${y1}px)` }}>
          Make room for
        </div>
        <div style={{ opacity: o2, transform: `translateY(${y2}px)` }}>
          what matters.
        </div>
      </div>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: oMark,
          transform: `scale(${sMark})`,
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 62,
            lineHeight: 1,
            letterSpacing: "0.34em",
            textIndent: "0.34em",
            color: palette.accent,
          }}
        >
          Relay
        </div>
        <div
          style={{
            marginTop: 18,
            width: 240,
            height: 3,
            backgroundColor: palette.accent,
            opacity: 0.8,
            transform: `scaleX(${interpolate(rule, [0, 1], [0, 1])})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(120,185,237,0.075) 0%, rgba(16,17,20,0) 64%)",
        }}
      />

      <Sequence from={0} durationInFrames={90}>
        <SceneOne />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <SceneTwo />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <SceneThree />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <SceneFour />
      </Sequence>
    </AbsoluteFill>
  );
};
