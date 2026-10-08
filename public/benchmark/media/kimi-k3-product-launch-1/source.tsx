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

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const withAlpha = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: "block" }}>
    <rect width="96" height="96" rx="24" fill={palette.accent} />
    <path d="M27 29 L45 48 L27 67" fill="none" stroke={palette.background} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M51 29 L69 48 L51 67" fill="none" stroke={palette.background} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
  </svg>
);

const PulseRings: React.FC<{ base: number; color: string }> = ({ base, color }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 22].map((off) => {
        const t = (frame + off) % 44;
        const scale = interpolate(t, [0, 44], [0.8, 1.6]);
        const op = interpolate(t, [0, 32, 44], [0.4, 0.1, 0], CLAMP);
        return (
          <div
            key={off}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: base,
              height: base,
              borderRadius: base / 2,
              border: `2px solid ${color}`,
              opacity: op,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          />
        );
      })}
    </>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOp = interpolate(frame, [74, 89], [1, 0], CLAMP);
  const logoS = spring({ frame, fps, delay: 2, config: { damping: 13, stiffness: 170 } });
  const logoScale = interpolate(logoS, [0, 1], [0.4, 1]);
  const logoOp = interpolate(logoS, [0, 0.4], [0, 1], CLAMP);
  const titleS = spring({ frame, fps, delay: 9, config: { damping: 16, stiffness: 120 } });
  const titleY = interpolate(titleS, [0, 1], [48, 0]);
  const titleOp = interpolate(titleS, [0, 0.5], [0, 1], CLAMP);
  const subOp = interpolate(frame, [30, 46], [0, 1], CLAMP);
  const subY = interpolate(frame, [30, 48], [22, 0], CLAMP);
  const lineW = interpolate(frame, [38, 60], [0, 230], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOp }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 44%, ${withAlpha(palette.accent, 0.09)}, transparent 55%)`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 112, height: 112, marginBottom: 42 }}>
          <PulseRings base={190} color={withAlpha(palette.accent, 0.55)} />
          <div style={{ opacity: logoOp, transform: `scale(${logoScale})` }}>
            <LogoMark size={112} />
          </div>
        </div>
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            color: palette.foreground,
            fontSize: 148,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          Relay
        </div>
        <div style={{ marginTop: 34, height: 5, width: lineW, borderRadius: 3, backgroundColor: palette.accent }} />
        <div
          style={{
            marginTop: 32,
            opacity: subOp,
            transform: `translateY(${subY}px)`,
            color: palette.muted,
            fontSize: 37,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          Make room for focused work
        </div>
      </div>
    </AbsoluteFill>
  );
};

type CardSpec = {
  chip: number;
  color: string;
  lines: number[];
  avatars: number;
  done: boolean;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const AV = [palette.accent, palette.secondary, palette.muted];
const PROGRESS = [0.72, 0.9, 0.55, 0.8, 0.64];

const BOARD: CardSpec[][] = [
  [
    { chip: 0.8, color: palette.secondary, lines: [0.85, 0.55], avatars: 2, done: true },
    { chip: 0.6, color: palette.accent, lines: [0.7], avatars: 1, done: false },
    { chip: 0.5, color: palette.muted, lines: [0.6], avatars: 1, done: false },
  ],
  [
    { chip: 0.7, color: palette.accent, lines: [0.8, 0.5], avatars: 2, done: true },
    { chip: 0.55, color: palette.secondary, lines: [0.65], avatars: 2, done: false },
  ],
  [
    { chip: 0.9, color: palette.secondary, lines: [0.6], avatars: 3, done: false },
    { chip: 0.5, color: palette.muted, lines: [0.75, 0.4], avatars: 1, done: true },
  ],
  [
    { chip: 0.65, color: palette.muted, lines: [0.8], avatars: 1, done: false },
    { chip: 0.8, color: palette.secondary, lines: [0.55, 0.7], avatars: 2, done: true },
  ],
  [
    { chip: 0.75, color: palette.accent, lines: [0.7, 0.45], avatars: 2, done: false },
    { chip: 0.5, color: palette.secondary, lines: [0.6], avatars: 1, done: true },
  ],
];

const FEATURES = ["Plan together", "Protect focus time", "See progress"];

const BoardCard: React.FC<{ card: CardSpec; ci: number; ri: number; frame: number; fps: number }> = ({
  card,
  ci,
  ri,
  frame,
  fps,
}) => {
  const d = 8 + ci * 5 + ri * 7;
  const s = spring({ frame, fps, delay: d, config: { damping: 16, stiffness: 150 } });
  const op = interpolate(s, [0, 0.5], [0, 1], CLAMP);
  const sc = interpolate(s, [0, 1], [0.7, 1]);
  const cd = 128 + ci * 4 + ri * 6;
  const cs = spring({ frame, fps, delay: cd, config: { damping: 12, stiffness: 220 } });

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        backgroundColor: withAlpha(palette.foreground, 0.045),
        border: `1px solid ${withAlpha(palette.foreground, 0.09)}`,
        opacity: op,
        transform: `scale(${sc})`,
      }}
    >
      <div style={{ height: 6, width: `${card.chip * 100}%`, borderRadius: 3, backgroundColor: card.color, marginBottom: 10 }} />
      {card.lines.map((w, li) => (
        <div
          key={li}
          style={{
            height: 5,
            width: `${w * 100}%`,
            borderRadius: 3,
            backgroundColor: withAlpha(palette.muted, 0.35),
            marginBottom: 7,
          }}
        />
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4, height: 18 }}>
        {Array.from({ length: card.avatars }).map((_, ai) => {
          const avS = spring({ frame, fps, delay: d + 16 + ai * 4, config: { damping: 11, stiffness: 220 } });
          const avOp = interpolate(avS, [0, 0.5], [0, 1], CLAMP);
          return (
            <div
              key={ai}
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: AV[(ci + ri + ai) % 3],
                border: `2px solid ${palette.background}`,
                marginLeft: ai === 0 ? 0 : -6,
                opacity: avOp,
                transform: `scale(${avS})`,
              }}
            />
          );
        })}
      </div>
      {card.done ? (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: palette.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${cs})`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 18 18">
            <path d="M4 9.5 L8 13 L14 5" fill="none" stroke={palette.background} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

const FocusBlock: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const op =
    interpolate(frame, [62, 74], [0, 1], CLAMP) * interpolate(frame, [112, 124], [1, 0], CLAMP);
  const s = spring({ frame, fps, delay: 62, config: { damping: 14, stiffness: 130 } });
  const sc = interpolate(s, [0, 1], [0.92, 1]);
  const pulse = 1 + 0.018 * Math.sin(Math.max(0, frame - 74) / 5);
  const glow = 0.22 + 0.14 * Math.sin(Math.max(0, frame - 74) / 6);
  if (op <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: "21.5%",
        right: "38.5%",
        top: 116,
        bottom: 48,
        opacity: op,
        transform: `scale(${sc * pulse})`,
        borderRadius: 16,
        border: `2px solid ${palette.accent}`,
        backgroundColor: withAlpha(palette.accent, 0.1),
        boxShadow: `0 0 46px ${withAlpha(palette.accent, glow)}`,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2.5" fill="none" stroke={palette.accent} strokeWidth="2.4" />
          <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" fill="none" stroke={palette.accent} strokeWidth="2.4" />
        </svg>
        <div style={{ color: palette.accent, fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>Focus time</div>
      </div>
      <div style={{ marginTop: 16, height: 6, width: "72%", borderRadius: 3, backgroundColor: withAlpha(palette.accent, 0.5) }} />
      <div style={{ marginTop: 9, height: 6, width: "46%", borderRadius: 3, backgroundColor: withAlpha(palette.accent, 0.35) }} />
    </div>
  );
};

const ProductWindow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const dim = interpolate(frame, [62, 74, 112, 124], [1, 0.4, 0.4, 1], CLAMP);
  const pct = Math.round(interpolate(frame, [126, 158], [0, 68], CLAMP));
  const pillOp = interpolate(frame, [122, 132], [0, 1], CLAMP);
  const trackOp = interpolate(frame, [120, 130], [0, 1], CLAMP);

  return (
    <div
      style={{
        width: 1210,
        height: 700,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${withAlpha(palette.foreground, 0.1)}`,
        backgroundColor: withAlpha(palette.foreground, 0.03),
        boxShadow: `0 32px 90px ${withAlpha(palette.background, 0.7)}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
          borderBottom: `1px solid ${withAlpha(palette.foreground, 0.07)}`,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[withAlpha(palette.muted, 0.5), palette.secondary, palette.accent].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 170,
            height: 26,
            borderRadius: 13,
            backgroundColor: withAlpha(palette.foreground, 0.06),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.muted,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          Team week
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 128,
            height: 28,
            borderRadius: 14,
            backgroundColor: withAlpha(palette.accent, 0.14),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.accent,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.5,
            opacity: pillOp,
          }}
        >
          {`${pct}% this week`}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: 168,
            borderRight: `1px solid ${withAlpha(palette.foreground, 0.07)}`,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <LogoMark size={26} />
            <div style={{ color: palette.foreground, fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>Relay</div>
          </div>
          {[64, 52, 70, 44, 58].map((w, i) => (
            <div
              key={i}
              style={{
                height: 34,
                borderRadius: 9,
                backgroundColor: i === 0 ? withAlpha(palette.accent, 0.12) : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 0 ? palette.accent : withAlpha(palette.muted, 0.4),
                }}
              />
              <div
                style={{
                  height: 6,
                  width: w,
                  borderRadius: 3,
                  backgroundColor: i === 0 ? withAlpha(palette.foreground, 0.65) : withAlpha(palette.muted, 0.28),
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: palette.foreground, letterSpacing: 0.3 }}>This week</div>
            <div style={{ display: "flex" }}>
              {AV.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: c,
                    border: `2px solid ${palette.background}`,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 14, opacity: dim }}>
            {BOARD.map((cards, ci) => {
              const p = interpolate(frame, [126 + ci * 5, 152 + ci * 5], [0, PROGRESS[ci]], CLAMP);
              return (
                <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: withAlpha(palette.muted, 0.9),
                      textTransform: "uppercase",
                      marginBottom: 14,
                      paddingBottom: 10,
                      borderBottom: `1px solid ${withAlpha(palette.foreground, 0.06)}`,
                    }}
                  >
                    {DAYS[ci]}
                  </div>
                  {cards.map((card, ri) => (
                    <BoardCard key={ri} card={card} ci={ci} ri={ri} frame={frame} fps={fps} />
                  ))}
                  <div style={{ flex: 1 }} />
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: withAlpha(palette.foreground, 0.08),
                      overflow: "hidden",
                      opacity: trackOp,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${p * 100}%`,
                        borderRadius: 3,
                        backgroundColor: ci % 2 === 0 ? palette.accent : palette.secondary,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <FocusBlock frame={frame} fps={fps} />
        </div>
      </div>
    </div>
  );
};

const FeaturePanel: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ width: 470, position: "relative" }}>
      <div style={{ position: "relative", height: 300 }}>
        {FEATURES.map((title, i) => {
          const t = frame - i * 60;
          const inOp = interpolate(t, [0, 14], [0, 1], CLAMP);
          const outOp = i < 2 ? interpolate(t, [48, 60], [1, 0], CLAMP) : 1;
          const y =
            interpolate(t, [0, 14], [26, 0], CLAMP) +
            (i < 2 ? interpolate(t, [48, 60], [0, -18], CLAMP) : 0);
          const ulW = interpolate(t, [10, 28], [0, 76], CLAMP);
          return (
            <div
              key={title}
              style={{ position: "absolute", inset: 0, opacity: inOp * outOp, transform: `translateY(${y}px)` }}
            >
              <div style={{ color: palette.accent, fontSize: 20, fontWeight: 700, letterSpacing: 6, marginBottom: 18 }}>
                {`0${i + 1}`}
                <span style={{ color: withAlpha(palette.muted, 0.7), letterSpacing: 3 }}> / 03</span>
              </div>
              <div style={{ color: palette.foreground, fontSize: 58, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1 }}>
                {title}
              </div>
              <div style={{ marginTop: 26, height: 5, width: ulW, borderRadius: 3, backgroundColor: palette.accent }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 46 }}>
        {FEATURES.map((f, i) => {
          const end = i === 2 ? 1 : 0;
          const amt = interpolate(
            frame,
            [i * 60, i * 60 + 10, (i + 1) * 60, (i + 1) * 60 + 10],
            [0, 1, 1, end],
            CLAMP
          );
          return (
            <div
              key={f}
              style={{
                height: 10,
                width: 10 + 22 * amt,
                borderRadius: 5,
                backgroundColor: palette.accent,
                opacity: 0.25 + 0.75 * amt,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const exitOp = interpolate(frame, [166, 179], [1, 0], CLAMP);
  const winS = spring({ frame, fps, delay: 2, config: { damping: 18, stiffness: 90 } });
  const winY = interpolate(winS, [0, 1], [56, 0]);

  return (
    <AbsoluteFill style={{ opacity: enterOp * exitOp }}>
      <div
        style={{
          position: "absolute",
          inset: 80,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 72,
        }}
      >
        <div style={{ transform: `translateY(${winY}px)` }}>
          <ProductWindow frame={frame} fps={fps} />
        </div>
        <FeaturePanel frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoS = spring({ frame, fps, config: { damping: 13, stiffness: 160 } });
  const logoScale = interpolate(logoS, [0, 1], [0.45, 1]);
  const logoOp = interpolate(logoS, [0, 0.4], [0, 1], CLAMP);
  const textS = spring({ frame, fps, delay: 6, config: { damping: 17, stiffness: 110 } });
  const textY = interpolate(textS, [0, 1], [30, 0]);
  const textOp = interpolate(textS, [0, 0.55], [0, 1], CLAMP);
  const lineW = interpolate(frame, [16, 34], [0, 130], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 42%, ${withAlpha(palette.secondary, 0.08)}, transparent 55%)`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 92, height: 92, marginBottom: 44 }}>
          <PulseRings base={170} color={withAlpha(palette.secondary, 0.5)} />
          <div style={{ opacity: logoOp, transform: `scale(${logoScale})` }}>
            <LogoMark size={92} />
          </div>
        </div>
        <div
          style={{
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            color: palette.foreground,
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.12,
            textAlign: "center",
          }}
        >
          Start your next week
          <br />
          with <span style={{ color: palette.accent }}>Relay</span>
        </div>
        <div style={{ marginTop: 40, height: 5, width: lineW, borderRadius: 3, backgroundColor: palette.accent }} />
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${withAlpha(
            palette.foreground,
            0.028
          )} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(palette.foreground, 0.028)} 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
        }}
      />
      <Sequence durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <ProductScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 58%, ${withAlpha(palette.background, 0.5)} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
