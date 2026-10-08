import React from "react";
import {
  AbsoluteFill,
  Easing,
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

const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const SceneOne: React.FC = () => {
  const frame = useCurrentFrame();
  let counter = 0;
  const words = ["Less", "noise."].map((w) =>
    w.split("").map((ch) => ({ ch, idx: counter++ })),
  );

  const exitOp = interpolate(frame, [82, 90], [1, 0], CLAMP);
  const exitY = interpolate(frame, [82, 90], [0, -34], CLAMP);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOp,
        transform: `translateY(${exitY}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 44 }}>
        {words.map((word, wi) => (
          <div key={wi} style={{ display: "flex", whiteSpace: "nowrap" }}>
            {word.map(({ ch, idx }) => {
              const start = idx * 1.1;
              const p = interpolate(frame, [start, start + 22], [0, 1], {
                ...CLAMP,
                easing: Easing.out(Easing.cubic),
              });
              const inv = 1 - p;
              const x = (hash(idx) - 0.5) * 720 * inv;
              const y = (hash(idx + 40) - 0.5) * 520 * inv;
              const rot = (hash(idx + 80) - 0.5) * 110 * inv;
              const blur = 10 * inv;
              return (
                <span
                  key={idx}
                  style={{
                    display: "inline-block",
                    fontSize: 170,
                    fontWeight: 800,
                    color: palette.foreground,
                    opacity: 0.15 + 0.85 * p,
                    transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                    filter: `blur(${blur}px)`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneTwo: React.FC = () => {
  const frame = useCurrentFrame();

  const focus = interpolate(frame, [2, 28], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const blur = (1 - focus) * 26;
  const scale = 1.16 - focus * 0.16;
  const opIn = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const exitOp = interpolate(frame, [82, 90], [1, 0], CLAMP);
  const exitBlur = interpolate(frame, [82, 90], [0, 18], CLAMP);
  const ringP = interpolate(frame, [0, 26], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 560,
          height: 560,
          borderRadius: 280,
          border: `2px solid ${palette.secondary}`,
          opacity: (1 - ringP) * 0.5,
          transform: `translate(-50%, -50%) scale(${1.7 - ringP * 0.7})`,
        }}
      />
      <div
        style={{
          fontSize: 190,
          fontWeight: 800,
          color: palette.foreground,
          opacity: opIn,
          filter: `blur(${blur + exitBlur}px)`,
          transform: `scale(${scale})`,
          whiteSpace: "nowrap",
        }}
      >
        More focus.
      </div>
    </AbsoluteFill>
  );
};

const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = spring({
    frame: frame - 2,
    fps,
    config: { damping: 22, stiffness: 170, mass: 0.9 },
  });
  const s2 = spring({
    frame: frame - 8,
    fps,
    config: { damping: 22, stiffness: 170, mass: 0.9 },
  });

  const exitP = interpolate(frame, [82, 90], [0, 1], CLAMP);
  const x1 = (1 - s1) * -720 + exitP * -280;
  const x2 = (1 - s2) * 720 + exitP * 280;
  const opIn = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const exitOp = interpolate(frame, [82, 90], [1, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 14,
        opacity: exitOp,
      }}
    >
      <div
        style={{
          fontSize: 122,
          fontWeight: 800,
          color: palette.foreground,
          opacity: opIn,
          transform: `translateX(${x1}px)`,
          whiteSpace: "nowrap",
          lineHeight: 1.05,
        }}
      >
        Better work,
      </div>
      <div
        style={{
          fontSize: 122,
          fontWeight: 800,
          color: palette.secondary,
          opacity: opIn,
          transform: `translateX(${x2}px)`,
          whiteSpace: "nowrap",
          lineHeight: 1.05,
        }}
      >
        together.
      </div>
    </AbsoluteFill>
  );
};

const SceneFour: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brand = spring({
    frame: frame - 4,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });
  const brandScale = 0.82 + brand * 0.18;
  const brandOp = interpolate(frame, [4, 14], [0, 1], CLAMP);
  const barP = interpolate(frame, [16, 32], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const words = ["Make", "room", "for", "what", "matters."];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: 230,
          fontWeight: 800,
          color: palette.accent,
          letterSpacing: -6,
          lineHeight: 1,
          opacity: brandOp,
          transform: `scale(${brandScale})`,
        }}
      >
        Relay
      </div>
      <div
        style={{
          marginTop: 30,
          width: 220 * barP,
          height: 8,
          borderRadius: 4,
          backgroundColor: palette.accent,
        }}
      />
      <div style={{ display: "flex", gap: 22, marginTop: 36 }}>
        {words.map((w, i) => {
          const start = 10 + i * 3;
          const p = interpolate(frame, [start, start + 16], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <span
              key={i}
              style={{
                fontSize: 54,
                fontWeight: 500,
                color: palette.muted,
                opacity: p,
                transform: `translateY(${(1 - p) * 34}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(3, Math.floor(frame / 90));
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {[0, 1, 2, 3].map((i) => {
        const t =
          i === active
            ? interpolate(frame, [i * 90, i * 90 + 14], [0, 1], CLAMP)
            : 0;
        const width = i === active ? 10 + t * 26 : 10;
        return (
          <div
            key={i}
            style={{
              width,
              height: 10,
              borderRadius: 5,
              backgroundColor:
                i === active ? palette.accent : `${palette.muted}59`,
            }}
          />
        );
      })}
    </div>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.38) 100%)",
        }}
      />
      <Sequence durationInFrames={90}>
        <SceneOne />
      </Sequence>
      <Sequence from={82} durationInFrames={90}>
        <SceneTwo />
      </Sequence>
      <Sequence from={164} durationInFrames={90}>
        <SceneThree />
      </Sequence>
      <Sequence from={246} durationInFrames={114}>
        <SceneFour />
      </Sequence>
      <Progress />
    </AbsoluteFill>
  );
};