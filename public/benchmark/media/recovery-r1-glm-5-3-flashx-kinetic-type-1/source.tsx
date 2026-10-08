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

const FONT: React.CSSProperties = {
  fontFamily: "Archivo, sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Deterministic per-character offset (no Math.random)
const charOffset = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 3.7) * 520;
  const y = Math.cos(i * 78.233 + salt * 9.1) * 340;
  const r = Math.sin(i * 43.123 + salt * 1.7) * 50;
  return { x, y, r };
};

// ---------------------------------------------------------------
// Phrase 1 (frames 0-89): "Less noise." — scattered chars converge
// ---------------------------------------------------------------
const PhraseLessNoise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = "Less noise.";

  const exit = interpolate(frame, [78, 90], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `translateX(${exit * -160}px)`,
      }}
    >
      <div style={{ ...FONT, fontSize: 190, color: palette.foreground, display: "flex" }}>
        {text.split("").map((ch, i) => {
          const entrance = spring({
            frame: frame - i * 2,
            fps,
            config: { damping: 14, mass: 0.9, stiffness: 120 },
          });
          const off = charOffset(i, 1);
          const jitter = 1 - entrance;
          const jx = Math.sin(frame * 0.55 + i * 7.3) * 26 * jitter;
          const jy = Math.cos(frame * 0.48 + i * 5.1) * 18 * jitter;
          const x = off.x * (1 - entrance) + jx;
          const y = off.y * (1 - entrance) + jy;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: Math.min(entrance * 1.6, 1),
                transform: `translate(${x}px, ${y}px) rotate(${off.r * (1 - entrance)}deg)`,
                color: ch === "." ? palette.accent : palette.foreground,
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------
// Phrase 2 (frames 90-179): "More focus." — focus pull from huge/blurry
// ---------------------------------------------------------------
const PhraseMoreFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pull = spring({ frame, fps, config: { damping: 200, stiffness: 90, mass: 1 } });
  const scale = interpolate(pull, [0, 1], [2.4, 1]);
  const blur = interpolate(pull, [0, 1], [26, 0]);
  const spacing = interpolate(pull, [0, 1], [42, -2]);
  const opacity = interpolate(frame, [0, 10], [0, 1], clamp);
  const exit = interpolate(frame, [80, 90], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: opacity * (1 - exit),
      }}
    >
      <div
        style={{
          ...FONT,
          fontSize: 190,
          color: palette.foreground,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          letterSpacing: `${spacing}px`,
        }}
      >
        More foc<span style={{ color: palette.accent }}>u</span>s.
      </div>
      <div
        style={{
          position: "absolute",
          width: interpolate(pull, [0, 1], [1600, 980]),
          height: interpolate(pull, [0, 1], [900, 340]),
          border: `2px solid ${palette.secondary}${Math.round(pull * 120)
            .toString(16)
            .padStart(2, "0")}`,
          borderRadius: 24,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------
// Phrase 3 (frames 180-269): "Better work, together." — words converge
// ---------------------------------------------------------------
const PhraseTogether: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = interpolate(frame, [80, 90], [0, 1], clamp);

  const p0 = spring({ frame, fps, config: { damping: 16, mass: 1, stiffness: 110 } });
  const p1 = spring({ frame: frame - 6, fps, config: { damping: 16, mass: 1, stiffness: 110 } });
  const p2 = spring({ frame: frame - 14, fps, config: { damping: 16, mass: 1, stiffness: 110 } });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `translateY(${exit * -180}px)`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: "36px", justifyContent: "center" }}>
          <span
            style={{
              ...FONT,
              fontSize: 170,
              color: palette.foreground,
              display: "inline-block",
              transform: `translateX(${-900 * (1 - p0)}px)`,
              opacity: Math.min(p0 * 1.8, 1),
            }}
          >
            Better
          </span>
          <span
            style={{
              ...FONT,
              fontSize: 170,
              color: palette.foreground,
              display: "inline-block",
              transform: `translateX(${900 * (1 - p1)}px)`,
              opacity: Math.min(p1 * 1.8, 1),
            }}
          >
            work,
          </span>
        </div>
        <div
          style={{
            ...FONT,
            fontSize: 170,
            color: palette.secondary,
            transform: `translateX(${900 * (1 - p2)}px)`,
            opacity: Math.min(p2 * 1.8, 1),
            marginTop: 10,
          }}
        >
          together.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------
// Phrase 4 (frames 270-359): "Make room for what matters." + "Relay"
// settles early — completely still for the last two seconds.
// ---------------------------------------------------------------
const PhraseRelay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineP = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
  const relayP = spring({
    frame: frame - 12,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 120 },
  });
  const ruleP = spring({ frame: frame - 16, fps, config: { damping: 200, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            ...FONT,
            fontSize: 88,
            fontWeight: 600,
            color: palette.muted,
            letterSpacing: "0.01em",
            opacity: lineP,
            transform: `translateY(${30 * (1 - lineP)}px)`,
          }}
        >
          Make room for what matters.
        </div>
        <div
          style={{
            ...FONT,
            fontSize: 220,
            color: palette.accent,
            marginTop: 28,
            opacity: relayP,
            transform: `translateY(${60 * (1 - relayP)}px) scale(${interpolate(relayP, [0, 1], [0.85, 1])})`,
          }}
        >
          Relay
        </div>
        <div
          style={{
            width: interpolate(ruleP, [0, 1], [0, 420]),
            height: 6,
            backgroundColor: palette.secondary,
            margin: "26px auto 0",
            borderRadius: 3,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------
// Root composition: 360 frames @ 30fps = 12 seconds
// ---------------------------------------------------------------
export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <Sequence from={0} durationInFrames={90} name="less-noise">
        <PhraseLessNoise />
      </Sequence>
      <Sequence from={90} durationInFrames={90} name="more-focus">
        <PhraseMoreFocus />
      </Sequence>
      <Sequence from={180} durationInFrames={90} name="together">
        <PhraseTogether />
      </Sequence>
      <Sequence from={270} durationInFrames={90} name="relay">
        <PhraseRelay />
      </Sequence>
    </AbsoluteFill>
  );
};