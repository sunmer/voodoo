import React from "react";
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {palette} from "./contract";

const FONT = "Archivo";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const rand = (i: number, seed: number): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const NoiseField: React.FC<{frame: number}> = ({frame}) => {
  const t = interpolate(frame, [0, 34], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const fade = 1 - t;
  if (fade <= 0) return null;
  return (
    <AbsoluteFill>
      {Array.from({length: 64}, (_, i) => {
        const x0 = 100 + rand(i, 4) * 1720;
        const y0 = 120 + rand(i, 5) * 840;
        const x = x0 + (960 - x0) * t * 0.7;
        const y = y0 + (540 - y0) * t * 0.7;
        const h = 16 + Math.abs(Math.sin(frame * 0.9 + i * 2.3)) * 110 * (0.3 + rand(i, 6));
        const w = 2 + rand(i, 7) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y - h / 2,
              width: w,
              height: h * (1 - t * 0.6),
              background: i % 3 === 0 ? palette.secondary : palette.muted,
              opacity: fade * 0.5 * (0.4 + rand(i, 8) * 0.6),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SceneOne: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = "Less noise.";
  const exit = interpolate(frame, [80, 90], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <NoiseField frame={frame} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          display: "flex",
          opacity: 1 - exit,
          transform: `translateY(${-exit * 50}px)`,
          filter: `blur(${exit * 10}px)`,
        }}
      >
        {text.split("").map((ch, i) => {
          if (ch === " ") {
            return <span key={i} style={{display: "inline-block", width: "0.24em"}} />;
          }
          const p = spring({frame: frame - i, fps, config: {damping: 15, stiffness: 120}, durationInFrames: 22});
          const inv = 1 - p;
          const dx = (rand(i, 1) - 0.5) * 640 * inv + Math.sin(frame * 1.7 + i * 3) * 18 * inv;
          const dy = (rand(i, 2) - 0.5) * 520 * inv + Math.cos(frame * 1.3 + i * 5) * 14 * inv;
          const rot = (rand(i, 3) - 0.5) * 80 * inv;
          const color = ch === "." ? palette.accent : i < 4 ? palette.foreground : palette.muted;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color,
                opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
                transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                filter: `blur(${inv * 12}px)`,
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

const SceneTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const inO = interpolate(frame, [0, 8], [0, 1], clamp);
  const exit = interpolate(frame, [80, 90], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const blur = (1 - e) * 22 + exit * 14;
  const scale = 1.08 - 0.08 * e - exit * 0.04;
  const spacing = 0.1 * (1 - e) - 0.02;
  const cornerIn = interpolate(frame, [4, 30], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const offset = (1 - cornerIn) * 140 - exit * 40;
  const cornerOpacity = interpolate(frame, [4, 14], [0, 1], clamp) * (1 - exit);
  const size = 64;
  const stroke = 6;
  const corners = [
    {top: 0, left: 0, bt: true, bl: true, tx: -1, ty: -1},
    {top: 0, right: 0, bt: true, br: true, tx: 1, ty: -1},
    {bottom: 0, left: 0, bb: true, bl: true, tx: -1, ty: 1},
    {bottom: 0, right: 0, bb: true, br: true, tx: 1, ty: 1},
  ];
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div style={{position: "relative", width: 1500, height: 360, display: "flex", justifyContent: "center", alignItems: "center"}}>
        {corners.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              width: size,
              height: size,
              borderTop: c.bt ? `${stroke}px solid ${palette.secondary}` : undefined,
              borderBottom: c.bb ? `${stroke}px solid ${palette.secondary}` : undefined,
              borderLeft: c.bl ? `${stroke}px solid ${palette.secondary}` : undefined,
              borderRight: c.br ? `${stroke}px solid ${palette.secondary}` : undefined,
              opacity: cornerOpacity,
              transform: `translate(${c.tx * offset}px, ${c.ty * offset * 0.5}px)`,
            }}
          />
        ))}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 190,
            fontWeight: 800,
            lineHeight: 1,
            whiteSpace: "nowrap",
            letterSpacing: `${spacing}em`,
            color: palette.foreground,
            opacity: inO * (1 - exit),
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          More <span style={{color: palette.accent}}>focus.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MaskWord: React.FC<{progress: number; exit: number; color: string; children: React.ReactNode}> = ({progress, exit, color, children}) => (
  <span style={{display: "inline-block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", verticalAlign: "top"}}>
    <span style={{display: "inline-block", color, transform: `translateY(${(1 - progress) * 115 - exit * 115}%)`}}>{children}</span>
  </span>
);

const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = {damping: 18, stiffness: 140};
  const p1 = spring({frame, fps, config: cfg, durationInFrames: 20});
  const p2 = spring({frame: frame - 4, fps, config: cfg, durationInFrames: 20});
  const p3 = spring({frame: frame - 8, fps, config: cfg, durationInFrames: 20});
  const exitA = interpolate(frame, [80, 88], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const exitB = interpolate(frame, [82, 90], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const barIn = interpolate(frame, [12, 32], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const barOut = interpolate(frame, [78, 88], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const indent = 240;
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", fontFamily: FONT, fontSize: 170, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", whiteSpace: "nowrap"}}>
        <div>
          <MaskWord progress={p1} exit={exitA} color={palette.foreground}>Better</MaskWord>
          <span style={{display: "inline-block", width: "0.24em"}} />
          <MaskWord progress={p2} exit={exitA} color={palette.foreground}>work,</MaskWord>
        </div>
        <div style={{marginLeft: indent}}>
          <MaskWord progress={p3} exit={exitB} color={palette.accent}>together.</MaskWord>
        </div>
        <div
          style={{
            marginLeft: indent,
            marginTop: 22,
            width: 560,
            height: 10,
            background: palette.secondary,
            transformOrigin: barOut > 0 ? "right center" : "left center",
            transform: `scaleX(${barIn * (1 - barOut)})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SceneFour: React.FC = () => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [0, 28], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const inO = interpolate(frame, [0, 10], [0, 1], clamp);
  const relayE = interpolate(frame, [10, 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const lineE = interpolate(frame, [6, 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const words = ["Make", "room", "for", "what", "matters."];
  const gap = interpolate(e, [0, 1], [0, 28]);
  const tracking = interpolate(e, [0, 1], [-0.07, -0.015]);
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT}}>
        <div
          style={{
            display: "flex",
            gap,
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: `${tracking}em`,
            whiteSpace: "nowrap",
            opacity: inO,
          }}
        >
          {words.map((w, i) => (
            <span key={i} style={{color: i === words.length - 1 ? palette.accent : palette.foreground}}>{w}</span>
          ))}
        </div>
        <div style={{marginTop: 56, width: 1100 * lineE, height: 3, background: palette.muted, opacity: 0.45}} />
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: relayE,
            transform: `translateY(${(1 - relayE) * 30}px)`,
          }}
        >
          <div style={{width: 22, height: 22, background: palette.secondary}} />
          <span style={{fontSize: 84, fontWeight: 800, lineHeight: 1, color: palette.foreground, letterSpacing: `${0.3 * (1 - relayE) + 0.01}em`}}>Relay</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 80, bottom: 80, display: "flex", gap: 12}}>
      {[0, 1, 2, 3].map((i) => {
        const end = i === 3 ? i * 90 + 30 : i * 90 + 90;
        const fill = interpolate(frame, [i * 90, end], [0, 1], clamp);
        return (
          <div key={i} style={{width: 64, height: 4, background: `${palette.muted}33`, overflow: "hidden"}}>
            <div style={{width: 64 * fill, height: 4, background: palette.accent}} />
          </div>
        );
      })}
    </div>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.background, fontFamily: FONT}}>
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
      <Progress />
    </AbsoluteFill>
  );
};
