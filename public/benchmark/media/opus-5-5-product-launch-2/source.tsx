import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo, sans-serif';

const hexA = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return hex;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const ci = (f: number, input: number[], output: number[], easing?: (t: number) => number): number =>
  interpolate(
    f,
    input,
    output,
    easing
      ? { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
      : { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 28 + Math.sin(frame / 80) * 8;
  const y = 30 + Math.cos(frame / 95) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${hexA(palette.foreground, 0.06)} 1.5px, transparent 1.6px)`,
          backgroundSize: '48px 48px',
          backgroundPosition: `${frame * 0.15}px ${frame * 0.1}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x}% ${y}%, ${hexA(palette.secondary, 0.14)}, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${100 - x}% 88%, ${hexA(palette.accent, 0.09)}, transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Mark: React.FC<{ size: number; frame: number; delay?: number }> = ({ size, frame, delay = 0 }) => {
  const { fps } = useVideoConfig();
  const bars = [
    { w: 1, c: palette.accent, x: 0 },
    { w: 0.72, c: palette.secondary, x: 0.28 },
    { w: 0.44, c: palette.foreground, x: 0.56 },
  ];
  const h = size * 0.18;
  const gap = size * 0.1;
  return (
    <div style={{ position: 'relative', width: size, height: 3 * h + 2 * gap, flexShrink: 0 }}>
      {bars.map((b, i) => {
        const s = spring({ frame: frame - delay - i * 5, fps, config: { damping: 16, stiffness: 120 } });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x * size,
              top: i * (h + gap),
              width: b.w * size,
              height: h,
              borderRadius: h / 2,
              background: b.c,
              transform: `scaleX(${s})`,
              transformOrigin: 'left center',
            }}
          />
        );
      })}
    </div>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitO = ci(f, [80, 98], [1, 0]);
  const exitY = ci(f, [80, 98], [0, -50], Easing.in(Easing.cubic));
  const tagO = ci(f, [28, 46], [0, 1]);
  const tagY = ci(f, [28, 46], [24, 0], Easing.out(Easing.cubic));
  const lineW = ci(f, [42, 66], [0, 1], Easing.inOut(Easing.cubic));
  const letters = 'Relay'.split('');
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 52 }}>
        <Mark size={150} frame={f} delay={0} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 210,
            fontWeight: 800,
            color: palette.foreground,
            letterSpacing: -6,
            lineHeight: 1,
          }}
        >
          {letters.map((l, i) => {
            const d = f - 6 - i * 3;
            const s = spring({ frame: d, fps, config: { damping: 14, stiffness: 140 } });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: ci(d, [0, 8], [0, 1]),
                  transform: `translateY(${(1 - s) * 80}px)`,
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
          marginTop: 56,
          fontFamily: FONT,
          fontSize: 60,
          fontWeight: 500,
          color: palette.muted,
          opacity: tagO,
          transform: `translateY(${tagY}px)`,
        }}
      >
        Make room for{' '}
        <span style={{ color: palette.foreground, position: 'relative', display: 'inline-block' }}>
          focused work
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: -10,
              height: 6,
              width: `${lineW * 100}%`,
              borderRadius: 3,
              background: palette.accent,
            }}
          />
        </span>
      </div>
    </AbsoluteFill>
  );
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DONE: number[][] = [
  [1, 1, 0],
  [1, 1],
  [1, 0, 0],
  [1, 1],
  [1, 0, 0],
];
const FEATURES = ['Plan together', 'Protect focus time', 'See progress'];
const STARTS = [0, 66, 126];
const ENDS = [66, 126, 10000];
const WIDTHS = [0.9, 0.62, 0.8, 0.7, 0.95];

type Card = { c: number; r: number; d: boolean; order: number };
const CARDS: Card[] = [];
{
  let idx = 0;
  DONE.forEach((col, c) => {
    col.forEach((d, r) => {
      CARDS.push({ c, r, d: d === 1, order: d === 1 ? idx++ : -1 });
    });
  });
}
const TOTAL = CARDS.length;
const TOTAL_DONE = CARDS.filter((k) => k.d).length;

const WX = 760;
const WY = 160;
const WW = 1060;
const WH = 760;
const PAD = 32;
const GAP = 16;
const COLW = (WW - PAD * 2 - GAP * 4) / 5;

const Product: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 20, stiffness: 90 } });
  const exitO = ci(f, [174, 190], [1, 0]);
  const exitS = ci(f, [174, 190], [1, 0.96]);
  const dim = f < 100 ? ci(f, [66, 80], [1, 0.5]) : ci(f, [120, 134], [0.5, 1]);
  const progT = ci(f, [130, 176], [0, 1], Easing.inOut(Easing.cubic));
  const focusGlow = f < 100 ? ci(f, [80, 96], [0, 1]) : ci(f, [118, 134], [1, 0]);
  const progActive = ci(f, [122, 134], [0, 1]);
  const bg = palette.background;

  return (
    <AbsoluteFill style={{ opacity: exitO, transform: `scale(${exitS})`, fontFamily: FONT }}>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 0,
          height: 1080,
          width: 560,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 60,
        }}
      >
        {FEATURES.map((t, i) => {
          const a = Math.min(
            ci(f, [STARTS[i] - 6, STARTS[i] + 8], [0, 1]),
            ci(f, [ENDS[i] - 6, ENDS[i] + 8], [1, 0])
          );
          const inS = spring({ frame: f - 4 - i * 5, fps, config: { damping: 18, stiffness: 110 } });
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                opacity: inS * (0.3 + 0.7 * a),
                transform: `translateX(${(1 - inS) * -40 + a * 14}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -30,
                  top: 4,
                  bottom: 4,
                  width: 6,
                  borderRadius: 3,
                  background: palette.accent,
                  transform: `scaleY(${a})`,
                }}
              />
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: palette.accent,
                  letterSpacing: 3,
                  marginBottom: 10,
                }}
              >
                {`0${i + 1}`}
              </div>
              <div style={{ fontSize: 54, fontWeight: 700, color: palette.foreground, lineHeight: 1.05 }}>{t}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: WX,
          top: WY,
          width: WW,
          height: WH,
          borderRadius: 28,
          background: `linear-gradient(${hexA(palette.foreground, 0.07)}, ${hexA(palette.foreground, 0.03)}), ${bg}`,
          border: `1px solid ${hexA(palette.foreground, 0.12)}`,
          boxShadow: `0 40px 120px ${hexA('#000000', 0.5)}`,
          opacity: ci(f, [0, 14], [0, 1]),
          transform: `translateY(${(1 - enter) * 90}px)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: WW,
            height: 88,
            borderBottom: `1px solid ${hexA(palette.foreground, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${PAD}px`,
            boxSizing: 'border-box',
          }}
        >
          <Mark size={34} frame={f} delay={6} />
          <div style={{ marginLeft: 14, fontSize: 28, fontWeight: 800, color: palette.foreground }}>Relay</div>
          <div style={{ marginLeft: 36, fontSize: 24, fontWeight: 500, color: palette.muted }}>This week</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex' }}>
            {['A', 'K', 'M', 'S'].map((l, i) => {
              const s = spring({ frame: f - 14 - i * 5, fps, config: { damping: 12, stiffness: 160 } });
              const colors = [palette.accent, palette.secondary, palette.muted, palette.foreground];
              return (
                <div
                  key={i}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    marginLeft: i === 0 ? 0 : -12,
                    background: colors[i],
                    border: `3px solid ${bg}`,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    color: bg,
                    transform: `scale(${s})`,
                  }}
                >
                  {l}
                </div>
              );
            })}
          </div>
        </div>

        {DAYS.map((day, c) => {
          const left = PAD + c * (COLW + GAP);
          const colTotal = DONE[c].length;
          const colDone = DONE[c].filter((d) => d === 1).length;
          const fs = spring({ frame: f - 70 - c * 5, fps, config: { damping: 15, stiffness: 120 } });
          const fContent = ci(f - 70 - c * 5, [8, 16], [0, 1]);
          const slotO = ci(f, [6 + c * 3, 20 + c * 3], [0, 1]);
          return (
            <React.Fragment key={day}>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 106,
                  fontSize: 22,
                  fontWeight: 600,
                  color: palette.muted,
                  opacity: slotO,
                }}
              >
                {day}
              </div>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 142,
                  width: COLW,
                  height: 4,
                  borderRadius: 2,
                  background: hexA(palette.foreground, 0.08),
                  opacity: slotO,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(colDone / colTotal) * progT * 100}%`,
                    height: '100%',
                    background: palette.accent,
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 158,
                  width: COLW,
                  height: 148,
                  borderRadius: 16,
                  border: `2px dashed ${hexA(palette.muted, 0.35)}`,
                  boxSizing: 'border-box',
                  opacity: slotO,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 158,
                  width: COLW,
                  height: 148,
                  borderRadius: 16,
                  background: palette.accent,
                  transform: `scaleY(${fs})`,
                  transformOrigin: 'top center',
                  boxShadow: `0 0 ${40 * focusGlow}px ${hexA(palette.accent, 0.4 * focusGlow)}`,
                  padding: 18,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ position: 'relative', width: 22, height: 26, opacity: fContent }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 3,
                      top: 0,
                      width: 16,
                      height: 14,
                      border: `3px solid ${bg}`,
                      borderBottom: 'none',
                      borderRadius: '8px 8px 0 0',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 11,
                      width: 22,
                      height: 15,
                      borderRadius: 4,
                      background: bg,
                    }}
                  />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: bg, opacity: fContent }}>Focus</div>
              </div>
            </React.Fragment>
          );
        })}

        {CARDS.map((card) => {
          const left = PAD + card.c * (COLW + GAP);
          const top = 326 + card.r * 92;
          const d = f - 8 - card.c * 4 - card.r * 6;
          const sIn = spring({ frame: d, fps, config: { damping: 15, stiffness: 130 } });
          const check = card.d
            ? spring({ frame: f - 130 - card.order * 4, fps, config: { damping: 13, stiffness: 170 } })
            : 0;
          const w = WIDTHS[(card.c * 3 + card.r) % WIDTHS.length];
          const lineArea = COLW - 56 - 16;
          return (
            <div
              key={`${card.c}-${card.r}`}
              style={{
                position: 'absolute',
                left,
                top,
                width: COLW,
                height: 76,
                borderRadius: 14,
                background: hexA(palette.foreground, 0.06),
                border: `1px solid ${hexA(card.d ? palette.accent : palette.foreground, 0.1 + 0.25 * check)}`,
                boxSizing: 'border-box',
                opacity: ci(d, [0, 8], [0, 1]) * dim,
                transform: `translateY(${(1 - sIn) * -40}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 24,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  border: `2px solid ${hexA(palette.muted, 0.5)}`,
                  boxSizing: 'border-box',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 24,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: palette.accent,
                  transform: `scale(${check})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 9,
                    top: 4,
                    width: 7,
                    height: 13,
                    borderRight: `3px solid ${bg}`,
                    borderBottom: `3px solid ${bg}`,
                    transform: 'rotate(45deg)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 56,
                  top: 24,
                  width: lineArea * w,
                  height: 10,
                  borderRadius: 5,
                  background: hexA(palette.foreground, 0.55 - 0.3 * check),
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 56,
                  top: 44,
                  width: lineArea * 0.5,
                  height: 8,
                  borderRadius: 4,
                  background: hexA(palette.secondary, 0.35 - 0.15 * check),
                }}
              />
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: PAD,
            top: 636,
            fontSize: 22,
            fontWeight: 600,
            color: progActive > 0.5 ? palette.foreground : palette.muted,
            opacity: ci(f, [30, 46], [0, 1]) * dim,
          }}
        >
          Week progress
        </div>
        <div
          style={{
            position: 'absolute',
            left: PAD,
            top: 680,
            width: WW - PAD * 2,
            height: 14,
            borderRadius: 7,
            background: hexA(palette.foreground, 0.08),
            overflow: 'hidden',
            opacity: ci(f, [30, 46], [0, 1]) * dim,
          }}
        >
          <div
            style={{
              width: `${(TOTAL_DONE / TOTAL) * progT * 100}%`,
              height: '100%',
              borderRadius: 7,
              background: `linear-gradient(90deg, ${palette.secondary}, ${palette.accent})`,
              boxShadow: `0 0 24px ${hexA(palette.accent, 0.5 * progActive)}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = spring({ frame: f - 4, fps, config: { damping: 18, stiffness: 110 } });
  const l2 = spring({ frame: f - 10, fps, config: { damping: 18, stiffness: 110 } });
  const ul = ci(f, [22, 42], [0, 1], Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontFamily: FONT,
        opacity: ci(f, [0, 10], [0, 1]),
      }}
    >
      <Mark size={96} frame={f} delay={0} />
      <div
        style={{
          marginTop: 60,
          fontSize: 124,
          fontWeight: 800,
          color: palette.foreground,
          letterSpacing: -3,
          lineHeight: 1.08,
          textAlign: 'center',
        }}
      >
        <div style={{ opacity: ci(f - 4, [0, 10], [0, 1]), transform: `translateY(${(1 - l1) * 60}px)` }}>
          Start your next week
        </div>
        <div style={{ opacity: ci(f - 10, [0, 10], [0, 1]), transform: `translateY(${(1 - l2) * 60}px)` }}>
          with{' '}
          <span style={{ color: palette.accent, position: 'relative', display: 'inline-block' }}>
            Relay
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: 4,
                height: 8,
                width: `${ul * 100}%`,
                borderRadius: 4,
                background: hexA(palette.accent, 0.5),
              }}
            />
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, fontFamily: FONT }}>
      <Background />
      <Sequence from={0} durationInFrames={100}>
        <Intro />
      </Sequence>
      <Sequence from={84} durationInFrames={192}>
        <Product />
      </Sequence>
      <Sequence from={266} durationInFrames={94}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
