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

const FONT = "Archivo, sans-serif";

const ci = (
  v: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number
) =>
  interpolate(v, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const alpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const Mark: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = [
    { x: 0, c: palette.accent },
    { x: 0.19, c: palette.secondary },
    { x: 0.38, c: palette.foreground },
  ];
  const h = size * 0.2;
  const gap = size * 0.1;
  return (
    <div style={{ position: "relative", width: size, height: h * 3 + gap * 2 }}>
      {bars.map((b, i) => {
        const p = spring({
          frame: frame - delay - i * 5,
          fps,
          config: { damping: 200, mass: 0.7 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x * size,
              top: i * (h + gap),
              width: 0.62 * size,
              height: h,
              borderRadius: h / 2,
              background: b.c,
              opacity: p,
              transformOrigin: "left center",
              transform: `translateX(${(1 - p) * -size * 0.4}px) scaleX(${p})`,
            }}
          />
        );
      })}
    </div>
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 90) * 60;
  const dy = Math.cos(frame / 110) * 40;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${alpha(palette.foreground, 0.025)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(palette.foreground, 0.025)} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${-frame * 0.3}px 0px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${22 + dx / 40}% ${25 + dy / 30}%, ${alpha(palette.accent, 0.09)}, transparent 45%), radial-gradient(circle at ${80 - dx / 40}% ${78 - dy / 30}%, ${alpha(palette.secondary, 0.1)}, transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = "Relay".split("");
  const tagO = ci(f, [30, 48], [0, 1]);
  const tagY = ci(f, [30, 48], [24, 0], Easing.out(Easing.cubic));
  const line = ci(f, [40, 66], [0, 1], Easing.inOut(Easing.cubic));
  const exitO = ci(f, [76, 90], [1, 0]);
  const exitY = ci(f, [76, 90], [0, -40], Easing.in(Easing.cubic));
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 52 }}>
        <Mark size={150} delay={0} />
        <div style={{ display: "flex", overflow: "hidden", paddingBottom: 24 }}>
          {letters.map((l, i) => {
            const p = spring({ frame: f - 8 - i * 3, fps, config: { damping: 200 } });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: 210,
                  fontWeight: 800,
                  letterSpacing: -6,
                  lineHeight: 1.1,
                  color: palette.foreground,
                  transform: `translateY(${(1 - p) * 120}%)`,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 56,
          fontWeight: 500,
          color: palette.muted,
          opacity: tagO,
          transform: `translateY(${tagY}px)`,
        }}
      >
        Make room for focused work
      </div>
      <div
        style={{
          marginTop: 30,
          height: 6,
          width: 240 * line,
          background: palette.accent,
          borderRadius: 3,
        }}
      />
    </AbsoluteFill>
  );
};

const WIN_W = 1080;
const WIN_H = 780;
const PAD = 36;
const GAP = 16;
const COL_W = (WIN_W - PAD * 2 - GAP * 4) / 5;
const COL_TOP = 176;
const SLOT_Y = [0, 106, 212, 396];
const CARD_H = 92;
const FOCUS_H = 170;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type CardDef = { c: number; s: number; stripe: string; lw: number; done: number };

const CARDS: CardDef[] = [
  { c: 0, s: 0, stripe: palette.secondary, lw: 0.72, done: 0 },
  { c: 0, s: 1, stripe: palette.foreground, lw: 0.55, done: 1 },
  { c: 0, s: 3, stripe: palette.muted, lw: 0.64, done: -1 },
  { c: 1, s: 0, stripe: palette.foreground, lw: 0.6, done: 2 },
  { c: 1, s: 1, stripe: palette.secondary, lw: 0.75, done: 3 },
  { c: 2, s: 0, stripe: palette.secondary, lw: 0.5, done: 4 },
  { c: 2, s: 1, stripe: palette.muted, lw: 0.7, done: 5 },
  { c: 2, s: 3, stripe: palette.foreground, lw: 0.58, done: -1 },
  { c: 3, s: 0, stripe: palette.muted, lw: 0.66, done: 6 },
  { c: 3, s: 1, stripe: palette.secondary, lw: 0.52, done: -1 },
  { c: 3, s: 3, stripe: palette.secondary, lw: 0.7, done: -1 },
  { c: 4, s: 0, stripe: palette.foreground, lw: 0.62, done: -1 },
  { c: 4, s: 1, stripe: palette.muted, lw: 0.48, done: -1 },
  { c: 4, s: 3, stripe: palette.foreground, lw: 0.68, done: -1 },
];

const AVATARS = [
  { c: palette.secondary, t: "A" },
  { c: palette.accent, t: "M" },
  { c: palette.foreground, t: "J" },
  { c: palette.muted, t: "K" },
];

const colX = (c: number) => PAD + c * (COL_W + GAP);

const Cursor: React.FC<{ x: number; y: number; color: string; label: string; opacity: number }> = ({
  x,
  y,
  color,
  label,
  opacity,
}) => (
  <div style={{ position: "absolute", left: x, top: y, opacity }}>
    <svg width={30} height={36} viewBox="0 0 24 32">
      <path d="M2 2 L2 26 L8 20 L13 30 L18 28 L13 18 L22 18 Z" fill={color} stroke={palette.background} strokeWidth={1.5} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 26,
        background: color,
        color: palette.background,
        fontSize: 18,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 999,
      }}
    >
      {label}
    </div>
  </div>
);

const Product: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: f, fps, config: { damping: 200 } });
  const exitO = ci(f, [166, 180], [1, 0]);
  const exitS = ci(f, [166, 180], [1, 0.96]);

  const act = [
    ci(f, [52, 68], [1, 0]),
    ci(f, [52, 68, 112, 128], [0, 1, 1, 0]),
    ci(f, [112, 128], [0, 1]),
  ];
  const captions = ["Plan together", "Protect focus time", "See progress"];
  const capIn = ci(f, [4, 22], [0, 1]);

  const dim = ci(f, [62, 76, 116, 130], [1, 0.5, 0.5, 1]);
  const cursorO = ci(f, [14, 24, 50, 60], [0, 1, 1, 0]);
  const cm = ci(f, [14, 52], [0, 1], Easing.inOut(Easing.cubic));
  const progress = ci(f, [124, 168], [0, 0.68], Easing.inOut(Easing.cubic));
  const stripO = ci(f, [112, 128], [0.4, 1]);
  const ringR = 20;
  const ringC = 2 * Math.PI * ringR;

  return (
    <AbsoluteFill style={{ opacity: exitO }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 330,
          width: 620,
          opacity: capIn,
          transform: `translateX(${(1 - capIn) * -30}px)`,
        }}
      >
        {captions.map((c, i) => {
          const a = act[i];
          return (
            <div key={c} style={{ position: "relative", height: 150, paddingLeft: 30 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 8,
                  width: 6,
                  height: 100,
                  borderRadius: 3,
                  background: palette.accent,
                  transformOrigin: "top",
                  transform: `scaleY(${a})`,
                }}
              />
              <div
                style={{
                  transform: `translateX(${a * 12}px)`,
                  opacity: 0.32 + 0.68 * a,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: a > 0.5 ? palette.accent : palette.muted,
                  }}
                >
                  {`0${i + 1}`}
                </div>
                <div
                  style={{
                    fontSize: 54,
                    fontWeight: 700,
                    letterSpacing: -1,
                    color: palette.foreground,
                    marginTop: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 760,
          top: 150,
          width: WIN_W,
          height: WIN_H,
          borderRadius: 28,
          overflow: "hidden",
          background: `linear-gradient(160deg, ${alpha(palette.foreground, 0.06)}, ${alpha(palette.foreground, 0.025)}), ${palette.background}`,
          border: `1px solid ${alpha(palette.foreground, 0.1)}`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.55)`,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 90}px) scale(${exitS})`,
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute",
            left: PAD,
            right: PAD,
            top: PAD,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mark size={40} delay={-40} />
            <div style={{ fontSize: 30, fontWeight: 800, color: palette.foreground }}>Relay</div>
            <div style={{ width: 1, height: 28, background: alpha(palette.foreground, 0.2), marginLeft: 8 }} />
            <div style={{ fontSize: 24, fontWeight: 500, color: palette.muted, marginLeft: 8 }}>This week</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex" }}>
              {AVATARS.map((av, i) => {
                const p = spring({ frame: f - 10 - i * 4, fps, config: { damping: 12, mass: 0.6 } });
                return (
                  <div
                    key={i}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      marginLeft: i === 0 ? 0 : -12,
                      background: av.c,
                      border: `3px solid ${palette.background}`,
                      color: palette.background,
                      fontSize: 19,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${p})`,
                    }}
                  >
                    {av.t}
                  </div>
                );
              })}
            </div>
            <svg width={52} height={52} viewBox="0 0 52 52">
              <circle cx={26} cy={26} r={ringR} fill="none" stroke={alpha(palette.foreground, 0.12)} strokeWidth={6} />
              <circle
                cx={26}
                cy={26}
                r={ringR}
                fill="none"
                stroke={palette.accent}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={`${ringC * progress} ${ringC}`}
                transform="rotate(-90 26 26)"
              />
            </svg>
          </div>
        </div>

        {/* Day labels */}
        {DAYS.map((d, c) => {
          const p = ci(f, [6 + c * 3, 18 + c * 3], [0, 1]);
          return (
            <div
              key={d}
              style={{
                position: "absolute",
                left: colX(c),
                top: 130,
                width: COL_W,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: palette.muted,
                opacity: p,
              }}
            >
              {d}
            </div>
          );
        })}

        {/* Focus slots */}
        {DAYS.map((d, c) => {
          const p = spring({ frame: f - 62 - c * 5, fps, config: { damping: 200 } });
          const glow = ci(f, [70, 90, 120, 140], [0, 1, 1, 0.3]);
          const outlineO = ci(f, [20, 34], [0, 1]);
          return (
            <div key={`focus-${d}`}>
              <div
                style={{
                  position: "absolute",
                  left: colX(c),
                  top: COL_TOP + SLOT_Y[2],
                  width: COL_W,
                  height: FOCUS_H,
                  borderRadius: 14,
                  border: `2px dashed ${alpha(palette.muted, 0.25)}`,
                  boxSizing: "border-box",
                  opacity: outlineO * (1 - p),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: colX(c),
                  top: COL_TOP + SLOT_Y[2],
                  width: COL_W,
                  height: FOCUS_H,
                  borderRadius: 14,
                  boxSizing: "border-box",
                  border: `2px solid ${palette.accent}`,
                  background: `repeating-linear-gradient(135deg, ${alpha(palette.accent, 0.16)} 0px, ${alpha(palette.accent, 0.16)} 12px, ${alpha(palette.accent, 0.08)} 12px, ${alpha(palette.accent, 0.08)} 24px)`,
                  boxShadow: `0 0 ${40 * glow}px ${alpha(palette.accent, 0.3 * glow)}`,
                  transformOrigin: "top",
                  transform: `scaleY(${p})`,
                  opacity: p,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width={24} height={24} viewBox="0 0 24 24">
                    <circle cx={12} cy={12} r={9} fill="none" stroke={palette.accent} strokeWidth={2.5} />
                    <path d="M12 7 L12 12 L15.5 14" fill="none" stroke={palette.accent} strokeWidth={2.5} strokeLinecap="round" />
                  </svg>
                  <div style={{ fontSize: 24, fontWeight: 800, color: palette.accent }}>Focus</div>
                </div>
                <div style={{ height: 8, width: "60%", borderRadius: 4, background: alpha(palette.accent, 0.45) }} />
              </div>
            </div>
          );
        })}

        {/* Cards */}
        {CARDS.map((card, idx) => {
          const delay = 8 + card.c * 4 + (card.s === 3 ? 2 : card.s) * 7;
          const p = spring({ frame: f - delay, fps, config: { damping: 18, mass: 0.6 } });
          const check =
            card.done >= 0
              ? spring({ frame: f - 128 - card.done * 4, fps, config: { damping: 12, mass: 0.5 } })
              : 0;
          const stripe = check > 0.5 ? palette.accent : card.stripe;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: colX(card.c),
                top: COL_TOP + SLOT_Y[card.s],
                width: COL_W,
                height: CARD_H,
                borderRadius: 14,
                boxSizing: "border-box",
                background: alpha(palette.foreground, 0.06),
                border: `1px solid ${alpha(palette.foreground, 0.1)}`,
                opacity: Math.min(1, p) * dim,
                transform: `translateY(${(1 - p) * -40}px) scale(${0.94 + 0.06 * Math.min(1, p)})`,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: stripe }} />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: 22,
                  height: 10,
                  width: (COL_W - 44) * card.lw,
                  borderRadius: 5,
                  background: alpha(palette.foreground, 0.55),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: 42,
                  height: 8,
                  width: (COL_W - 44) * card.lw * 0.6,
                  borderRadius: 4,
                  background: alpha(palette.foreground, 0.2),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  bottom: 14,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: AVATARS[(card.c + card.s) % 4].c,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: 12,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: palette.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${check})`,
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24">
                  <path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke={palette.background} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          );
        })}

        {/* Progress strip */}
        <div
          style={{
            position: "absolute",
            left: PAD,
            right: PAD,
            top: 690,
            height: 54,
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: stripO * ci(f, [20, 36], [0, 1]),
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: palette.muted, letterSpacing: 1, width: 120 }}>Progress</div>
          <div
            style={{
              flex: 1,
              height: 14,
              borderRadius: 7,
              background: alpha(palette.foreground, 0.1),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                borderRadius: 7,
                background: `linear-gradient(90deg, ${palette.secondary}, ${palette.accent})`,
              }}
            />
          </div>
        </div>

        <Cursor
          x={interpolate(cm, [0, 1], [820, 430])}
          y={interpolate(cm, [0, 1], [560, 300])}
          color={palette.secondary}
          label="A"
          opacity={cursorO}
        />
        <Cursor
          x={interpolate(cm, [0, 1], [180, 640])}
          y={interpolate(cm, [0, 1], [620, 480])}
          color={palette.accent}
          label="M"
          opacity={cursorO}
        />
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = spring({ frame: f - 3, fps, config: { damping: 200 } });
  const l2 = spring({ frame: f - 8, fps, config: { damping: 200 } });
  const bar = ci(f, [14, 34], [0, 1], Easing.out(Easing.cubic));
  const inO = ci(f, [0, 10], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inO }}>
      <Mark size={110} delay={0} />
      <div style={{ marginTop: 56, overflow: "hidden", paddingBottom: 20 }}>
        <div
          style={{
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.1,
            color: palette.foreground,
            textAlign: "center",
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - l1) * 120}%)`,
          }}
        >
          Start your next week
        </div>
      </div>
      <div style={{ overflow: "hidden", paddingBottom: 20, marginTop: -16 }}>
        <div
          style={{
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.1,
            color: palette.foreground,
            textAlign: "center",
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - l2) * 120}%)`,
          }}
        >
          with <span style={{ color: palette.accent }}>Relay</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 28,
          height: 6,
          width: 320 * bar,
          borderRadius: 3,
          background: palette.secondary,
        }}
      />
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily: FONT, color: palette.foreground }}>
      <Background />
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Product />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
