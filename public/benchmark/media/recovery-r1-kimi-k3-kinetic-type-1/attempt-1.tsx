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
import {palette} from "./contract";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const easeOut = {...clamp, easing: Easing.out(Easing.cubic)};

const PhraseOne: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = "Less noise.";
  const exit = interpolate(frame, [80, 90], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{justifyContent: "center", alignItems: "center", opacity: 1 - exit}}
    >
      <div style={{display: "flex", transform: `translateY(${-36 * exit}px)`}}>
        {text.split("").map((c, i) => {
          const seed = i * 7.13;
          const dx = Math.sin(seed) * 170;
          const dy = Math.cos(seed * 1.7) * 120;
          const rot = Math.sin(seed * 2.3) * 42;
          const s = spring({
            frame: frame - i * 1.2,
            fps,
            config: {damping: 18, stiffness: 220, mass: 0.9},
          });
          const inv = 1 - s;
          return (
            <span
              key={i}
              style={{
                fontFamily: "Archivo",
                fontWeight: 800,
                fontSize: 132,
                color: c === "." ? palette.accent : palette.foreground,
                transform: `translate(${dx * inv}px, ${dy * inv}px) rotate(${rot * inv}deg)`,
                opacity: s,
                display: "inline-block",
              }}
            >
              {c === " " ? "\u00A0" : c}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PhraseTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = interpolate(frame, [80, 90], [0, 1], clamp);
  const bracketSpring = spring({
    frame: frame - 2,
    fps,
    config: {damping: 15, stiffness: 120},
  });
  const bracketScale = interpolate(bracketSpring, [0, 1], [1.18, 1]);
  const bracketOpacity = interpolate(frame, [6, 14], [0, 0.9], clamp) * (1 - exit);

  const word = (t: string, delay: number, color: string) => {
    const blur = interpolate(frame, [4 + delay, 26 + delay], [16, 0], clamp);
    const o = interpolate(frame, [4 + delay, 16 + delay], [0, 1], clamp);
    const ls = interpolate(frame, [4 + delay, 28 + delay], [26, 3], clamp);
    return (
      <span
        style={{
          fontFamily: "Archivo",
          fontSize: 128,
          fontWeight: 800,
          color,
          filter: `blur(${blur}px)`,
          opacity: o,
          letterSpacing: ls,
        }}
      >
        {t}
      </span>
    );
  };

  const corner = (style: React.CSSProperties, borders: string) => (
    <div
      style={{
        position: "absolute",
        width: 56,
        height: 56,
        borderColor: palette.accent,
        borderStyle: "solid",
        borderWidth: borders,
        ...style,
      }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: 1 - exit,
        filter: `blur(${exit * 12}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1080,
          height: 330,
          opacity: bracketOpacity,
          transform: `translate(-50%, -50%) scale(${bracketScale})`,
        }}
      >
        {corner({top: 0, left: 0}, "3px 0 0 3px")}
        {corner({top: 0, right: 0}, "3px 3px 0 0")}
        {corner({bottom: 0, left: 0}, "0 0 3px 3px")}
        {corner({bottom: 0, right: 0}, "0 3px 3px 0")}
      </div>
      <div style={{display: "flex", gap: 36}}>
        {word("More", 0, palette.foreground)}
        {word("focus.", 8, palette.secondary)}
      </div>
    </AbsoluteFill>
  );
};

const PhraseThree: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 16, stiffness: 150}});
  const s2 = spring({frame: frame - 5, fps, config: {damping: 16, stiffness: 150}});
  const s3 = spring({frame: frame - 14, fps, config: {damping: 20, stiffness: 160}});
  const x1 = interpolate(s1, [0, 1], [-760, 0]);
  const x2 = interpolate(s2, [0, 1], [760, 0]);
  const exit = interpolate(frame, [80, 90], [0, 1], clamp);

  const lineStyle: React.CSSProperties = {
    fontFamily: "Archivo",
    fontSize: 112,
    fontWeight: 800,
    lineHeight: 1.1,
  };

  return (
    <AbsoluteFill
      style={{justifyContent: "center", alignItems: "center", opacity: 1 - exit}}
    >
      <div
        style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}
      >
        <div
          style={{
            ...lineStyle,
            color: palette.foreground,
            transform: `translateX(${x1 - 160 * exit}px)`,
          }}
        >
          Better work,
        </div>
        <div
          style={{
            width: 640,
            height: 6,
            borderRadius: 3,
            backgroundColor: palette.accent,
            transform: `scaleX(${s3})`,
            transformOrigin: "center",
          }}
        />
        <div
          style={{
            ...lineStyle,
            color: palette.secondary,
            transform: `translateX(${x2 + 160 * exit}px)`,
          }}
        >
          together.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PhraseFour: React.FC = () => {
  const frame = useCurrentFrame();
  const tagOpacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const tagY = interpolate(frame, [0, 20], [26, 0], easeOut);
  const relayOpacity = interpolate(frame, [8, 20], [0, 1], clamp);
  const relayY = interpolate(frame, [8, 26], [34, 0], easeOut);
  const relayScale = interpolate(frame, [8, 26], [0.96, 1], easeOut);
  const lineWidth = interpolate(frame, [16, 30], [0, 440], easeOut);

  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div
        style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 44}}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontSize: 56,
            fontWeight: 600,
            color: palette.muted,
            letterSpacing: 1,
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          Make room for what matters.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: relayOpacity,
            transform: `translateY(${relayY}px) scale(${relayScale})`,
          }}
        >
          <div
            style={{
              fontFamily: "Archivo",
              fontSize: 190,
              fontWeight: 800,
              color: palette.foreground,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            Relay
          </div>
          <div
            style={{
              width: lineWidth,
              height: 8,
              borderRadius: 4,
              backgroundColor: palette.accent,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 359], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{backgroundColor: palette.background, fontFamily: "Archivo"}}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, rgba(184,243,107,0.06), rgba(16,17,20,0) 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(177,180,188,0.14)",
          borderRadius: 4,
          pointerEvents: "none",
        }}
      />
      <Sequence from={0} durationInFrames={90}>
        <PhraseOne />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <PhraseTwo />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <PhraseThree />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <PhraseFour />
      </Sequence>
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 48,
          width: 1760,
          height: 4,
          borderRadius: 2,
          backgroundColor: "rgba(177,180,188,0.18)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 2,
            backgroundColor: palette.accent,
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};