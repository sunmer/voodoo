import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const Mark: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: palette.accent,
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: size * 0.2,
        top: size * 0.2,
        width: size * 0.2,
        height: size * 0.2,
        borderRadius: '50%',
        background: palette.background,
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: size * 0.2,
        bottom: size * 0.2,
        width: size * 0.2,
        height: size * 0.2,
        borderRadius: '50%',
        background: palette.background,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: size * 0.3,
        top: size * 0.46,
        width: size * 0.4,
        height: size * 0.08,
        borderRadius: size,
        background: palette.background,
        transform: 'rotate(45deg)',
      }}
    />
  </div>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 40;
  const drift2 = Math.cos(frame / 75) * 50;
  const gridShift = (frame * 0.4) % 80;
  return (
    <AbsoluteFill style={{ background: palette.background }}>
      <div
        style={{
          position: 'absolute',
          left: 1100 + drift,
          top: -250 + drift2,
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: palette.secondary,
          opacity: 0.1,
          filter: 'blur(140px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -300 - drift,
          top: 600 - drift2,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: palette.accent,
          opacity: 0.07,
          filter: 'blur(140px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${palette.foreground}0D 1px, transparent 1px), linear-gradient(90deg, ${palette.foreground}0D 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${gridShift}px ${gridShift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Scene 1 ---------- */
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [76, 90], [1, 0], clamp);
  const outY = interpolate(frame, [76, 90], [0, -24], { ...clamp, easing: Easing.in(Easing.cubic) });
  const markS = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const wordP = interpolate(frame, [8, 34], [0, 1], { ...clamp, easing: easeOut });
  const line = interpolate(frame, [22, 60], [0, 1], { ...clamp, easing: easeOut });
  const words = ['Make', 'room', 'for', 'focused', 'work'];
  // baton dot travels along the line
  const dotX = interpolate(frame, [30, 75], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out, transform: `translateY(${outY}px)` }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ transform: `scale(${markS}) rotate(${(1 - markS) * -40}deg)`, marginBottom: 36 }}>
            <Mark size={110} />
          </div>
          <div style={{ overflow: 'hidden', padding: '0 20px' }}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 230,
                lineHeight: 1,
                letterSpacing: -8,
                color: palette.foreground,
                transform: `translateY(${(1 - wordP) * 120}%)`,
                opacity: wordP,
              }}
            >
              Relay
            </div>
          </div>
          <div style={{ position: 'relative', width: 760, height: 6, marginTop: 30, marginBottom: 40 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: 6,
                width: 760 * line,
                borderRadius: 3,
                background: palette.accent,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -9,
                left: dotX * 740,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: palette.secondary,
                opacity: frame > 28 ? 1 : 0,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {words.map((w, i) => {
              const p = interpolate(frame, [30 + i * 5, 46 + i * 5], [0, 1], { ...clamp, easing: easeOut });
              return (
                <span
                  key={w}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 500,
                    fontSize: 58,
                    color: i === 4 ? palette.accent : palette.foreground,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 26}px)`,
                    display: 'inline-block',
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Interface pieces ---------- */
const Cursor: React.FC<{ x: number; y: number; color: string; name: string; opacity?: number }> = ({
  x,
  y,
  color,
  name,
  opacity = 1,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity, zIndex: 10 }}>
    <div
      style={{
        width: 26,
        height: 30,
        background: color,
        clipPath: 'polygon(0 0, 100% 62%, 56% 66%, 36% 100%)',
      }}
    />
    <div
      style={{
        marginLeft: 20,
        marginTop: -2,
        padding: '4px 12px',
        borderRadius: 999,
        background: color,
        color: palette.background,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 20,
        display: 'inline-block',
      }}
    >
      {name}
    </div>
  </div>
);

const Bar: React.FC<{ w: number | string; h?: number; color?: string; style?: React.CSSProperties }> = ({
  w,
  h = 10,
  color = palette.muted,
  style,
}) => (
  <div style={{ width: w, height: h, borderRadius: h, background: color, opacity: 0.45, ...style }} />
);

const PlanPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colX = (c: number) => 28 + c * 234;
  const slotY = (s: number) => 70 + s * 108;
  const heads = ['Ideas', 'This week', 'Next'];
  const cards: { c: number; s: number; accent?: boolean; moving?: boolean; w: number }[] = [
    { c: 0, s: 0, w: 150 },
    { c: 0, s: 1, w: 120 },
    { c: 0, s: 2, w: 160, moving: true },
    { c: 1, s: 0, w: 140 },
    { c: 1, s: 1, w: 170, accent: true },
    { c: 2, s: 0, w: 130 },
  ];
  const moveP = interpolate(frame, [64, 100], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mx = colX(0) + (colX(1) - colX(0)) * moveP;
  const cursorIn = interpolate(frame, [30, 60], [0, 1], { ...clamp, easing: easeOut });
  const c1x = interpolate(cursorIn, [0, 1], [640, colX(0) + 150]) + (colX(1) - colX(0)) * moveP;
  const c1y = interpolate(cursorIn, [0, 1], [420, slotY(2) + 50]);
  const c2x = 520 + Math.sin(frame / 18) * 18;
  const c2y = 330 + Math.cos(frame / 14) * 14;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {heads.map((h, i) => {
        const p = interpolate(frame, [i * 5, i * 5 + 16], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={h}
            style={{
              position: 'absolute',
              left: colX(i),
              top: 20,
              width: 216,
              opacity: p,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 22,
              color: palette.muted,
            }}
          >
            {h}
          </div>
        );
      })}
      {cards.map((cd, i) => {
        const s = spring({ frame: frame - 8 - i * 5, fps, config: { damping: 16, stiffness: 140 } });
        const x = cd.moving ? mx : colX(cd.c);
        const lift = cd.moving ? Math.sin(moveP * Math.PI) : 0;
        const landed = cd.moving && moveP >= 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: slotY(cd.s) - lift * 10,
              width: 216,
              height: 92,
              borderRadius: 16,
              background: palette.foreground + '12',
              border: `2px solid ${cd.accent || landed ? palette.accent : palette.foreground + '1F'}`,
              boxShadow: lift > 0 ? `0 ${20 * lift}px ${40 * lift}px #00000066` : 'none',
              opacity: s,
              transform: `scale(${0.85 + 0.15 * s + lift * 0.04})`,
              padding: 16,
              boxSizing: 'border-box',
            }}
          >
            <Bar w={cd.w} h={12} color={palette.foreground} />
            <Bar w={cd.w * 0.6} h={10} style={{ marginTop: 12 }} />
            <div
              style={{
                position: 'absolute',
                right: 14,
                bottom: 12,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: cd.moving ? palette.accent : palette.secondary,
              }}
            />
          </div>
        );
      })}
      <Cursor x={c1x} y={c1y} color={palette.accent} name="Ana" opacity={cursorIn} />
      <Cursor x={c2x} y={c2y} color={palette.secondary} name="Jo" opacity={interpolate(frame, [40, 60], [0, 1], clamp)} />
    </div>
  );
};

const FocusPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const colW = 127;
  const colX = (i: number) => 28 + i * (colW + 12);
  const meetings = [
    { c: 0, t: 20, h: 80 },
    { c: 1, t: 150, h: 70 },
    { c: 2, t: 20, h: 60 },
    { c: 3, t: 250, h: 90 },
    { c: 4, t: 120, h: 70 },
    { c: 2, t: 330, h: 70 },
  ];
  const focus = [
    { c: 0, t: 130, h: 170 },
    { c: 1, t: 250, h: 170 },
    { c: 2, t: 110, h: 200 },
    { c: 3, t: 20, h: 190 },
    { c: 4, t: 220, h: 190 },
  ];
  const top = 76;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {days.map((d, i) => (
        <div
          key={d}
          style={{
            position: 'absolute',
            left: colX(i),
            top: 20,
            width: colW,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 22,
            color: palette.muted,
          }}
        >
          {d}
        </div>
      ))}
      {days.map((d, i) => (
        <div
          key={d + 'col'}
          style={{
            position: 'absolute',
            left: colX(i),
            top,
            width: colW,
            height: 450,
            borderRadius: 14,
            background: palette.foreground + '08',
            border: `1px solid ${palette.foreground}14`,
          }}
        />
      ))}
      {meetings.map((m, i) => {
        const p = interpolate(frame, [i * 3, i * 3 + 14], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: colX(m.c) + 8,
              top: top + m.t,
              width: colW - 16,
              height: m.h,
              borderRadius: 10,
              background: palette.secondary + '40',
              borderLeft: `5px solid ${palette.secondary}`,
              opacity: p,
              boxSizing: 'border-box',
              padding: 10,
            }}
          >
            <Bar w="70%" h={9} color={palette.secondary} />
          </div>
        );
      })}
      {focus.map((f, i) => {
        const p = interpolate(frame, [24 + i * 7, 24 + i * 7 + 22], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: colX(f.c) + 8,
              top: top + f.t,
              width: colW - 16,
              height: f.h,
              borderRadius: 12,
              background: palette.accent,
              transformOrigin: 'top',
              transform: `scaleY(${p})`,
              opacity: p,
              boxSizing: 'border-box',
              padding: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 22,
                color: palette.background,
                opacity: interpolate(p, [0.6, 1], [0, 1], clamp),
              }}
            >
              Focus
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProgressPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const R = 96;
  const C = 2 * Math.PI * R;
  const ring = interpolate(frame, [6, 56], [0, 0.72], { ...clamp, easing: easeOut });
  const rows = [
    { label: 'Launch plan', v: 0.85, color: palette.accent },
    { label: 'Design review', v: 0.6, color: palette.secondary },
    { label: 'Research', v: 0.95, color: palette.accent },
    { label: 'Handoff', v: 0.35, color: palette.secondary },
  ];
  const ringP = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 40, top: 130, opacity: ringP }}>
        <svg width={240} height={240} viewBox="0 0 240 240">
          <circle cx={120} cy={120} r={R} fill="none" stroke={palette.foreground + '1A'} strokeWidth={22} />
          <circle
            cx={120}
            cy={120}
            r={R}
            fill="none"
            stroke={palette.accent}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - ring)}
            transform="rotate(-90 120 120)"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 30,
            color: palette.foreground,
          }}
        >
          Progress
        </div>
      </div>
      <div style={{ position: 'absolute', left: 330, top: 60, width: 380 }}>
        {rows.map((r, i) => {
          const p = interpolate(frame, [10 + i * 6, 50 + i * 6], [0, 1], { ...clamp, easing: easeOut });
          const e = interpolate(frame, [i * 6, i * 6 + 14], [0, 1], clamp);
          return (
            <div key={r.label} style={{ marginBottom: 54, opacity: e }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 24,
                  color: palette.foreground,
                  marginBottom: 14,
                }}
              >
                {r.label}
              </div>
              <div style={{ height: 18, borderRadius: 9, background: palette.foreground + '1A' }}>
                <div
                  style={{
                    width: `${r.v * p * 100}%`,
                    height: '100%',
                    borderRadius: 9,
                    background: r.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AppWindow: React.FC<{ step: number }> = ({ step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const out = interpolate(frame, [166, 180], [1, 0], clamp);
  const navItems = ['Plan', 'Focus', 'Progress'];
  return (
    <div
      style={{
        position: 'absolute',
        left: 880,
        top: 210,
        width: 920,
        height: 660,
        borderRadius: 28,
        background: '#17191E',
        border: `2px solid ${palette.foreground}1F`,
        boxShadow: '0 40px 120px #000000AA',
        overflow: 'hidden',
        opacity: enter * out,
        transform: `translateX(${(1 - enter) * 160}px) scale(${0.94 + 0.06 * enter})`,
      }}
    >
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 10,
          borderBottom: `1px solid ${palette.foreground}14`,
        }}
      >
        {[palette.muted, palette.muted, palette.muted].map((c, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, opacity: 0.5 }} />
        ))}
        <div style={{ marginLeft: 16, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: palette.muted }}>
          Relay · Week plan
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 60, bottom: 0, width: 180, padding: 20, boxSizing: 'border-box', borderRight: `1px solid ${palette.foreground}14` }}>
        {navItems.map((n, i) => {
          const active = i === step;
          return (
            <div
              key={n}
              style={{
                height: 48,
                borderRadius: 12,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                gap: 10,
                background: active ? palette.accent + '26' : 'transparent',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 21,
                color: active ? palette.accent : palette.muted,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 4, background: active ? palette.accent : palette.muted, opacity: active ? 1 : 0.5 }} />
              {n}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 180, top: 60, width: 740, bottom: 0 }}>
        <Sequence from={0} durationInFrames={60} layout="none">
          <PanelFade>
            <PlanPanel />
          </PanelFade>
        </Sequence>
        <Sequence from={60} durationInFrames={60} layout="none">
          <PanelFade>
            <FocusPanel />
          </PanelFade>
        </Sequence>
        <Sequence from={120} durationInFrames={60} layout="none">
          <PanelFade last>
            <ProgressPanel />
          </PanelFade>
        </Sequence>
      </div>
    </div>
  );
};

const PanelFade: React.FC<{ children: React.ReactNode; last?: boolean }> = ({ children, last }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 8], [0, 1], clamp);
  const b = last ? 1 : interpolate(frame, [52, 60], [1, 0], clamp);
  return <div style={{ position: 'absolute', inset: 0, opacity: a * b }}>{children}</div>;
};

const Caption: React.FC<{ index: number; title: string }> = ({ index, title }) => {
  const frame = useCurrentFrame();
  const last = index === 2;
  const inP = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: easeOut });
  const outP = last ? 1 : interpolate(frame, [50, 60], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 700,
        opacity: inP * outP,
        transform: `translateY(${(1 - inP) * 40 + (1 - outP) * -20}px)`,
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: palette.accent, marginBottom: 18 }}>
        0{index + 1}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 100,
          lineHeight: 1.02,
          letterSpacing: -3,
          color: palette.foreground,
        }}
      >
        {title}
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [166, 180], [1, 0], clamp);
  const titles = ['Plan together', 'Protect focus time', 'See progress'];
  const step = Math.min(2, Math.floor(frame / 60));
  return (
    <AbsoluteFill style={{ opacity: 1 }}>
      <div style={{ position: 'absolute', left: 120, top: 330, width: 700, height: 420, opacity: out }}>
        {titles.map((t, i) => (
          <Sequence key={t} from={i * 60} durationInFrames={60} layout="none">
            <Caption index={i} title={t} />
          </Sequence>
        ))}
        <div style={{ position: 'absolute', left: 0, top: 360, display: 'flex', gap: 12 }}>
          {titles.map((t, i) => {
            const p = interpolate(frame, [i * 60, i * 60 + 60], [0, 1], clamp);
            return (
              <div key={t} style={{ width: 120, height: 8, borderRadius: 4, background: palette.foreground + '26', overflow: 'hidden' }}>
                <div style={{ width: `${p * 100}%`, height: '100%', background: palette.accent }} />
              </div>
            );
          })}
        </div>
      </div>
      <AppWindow step={step} />
    </AbsoluteFill>
  );
};

/* ---------- Final ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markS = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const lines = [
    [{ t: 'Start', a: false }, { t: 'your', a: false }, { t: 'next', a: false }, { t: 'week', a: false }],
    [{ t: 'with', a: false }, { t: 'Relay', a: true }],
  ];
  const line = interpolate(frame, [26, 56], [0, 1], { ...clamp, easing: easeOut });
  let idx = 0;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ transform: `scale(${markS})`, marginBottom: 44 }}>
          <Mark size={96} />
        </div>
        {lines.map((ln, li) => (
          <div key={li} style={{ display: 'flex', gap: 30, overflow: 'hidden', padding: '0 10px 10px' }}>
            {ln.map((w) => {
              const i = idx++;
              const p = interpolate(frame, [4 + i * 4, 24 + i * 4], [0, 1], { ...clamp, easing: easeOut });
              return (
                <span
                  key={w.t}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 138,
                    lineHeight: 1.08,
                    letterSpacing: -4,
                    color: w.a ? palette.accent : palette.foreground,
                    display: 'inline-block',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 90}px)`,
                  }}
                >
                  {w.t}
                </span>
              );
            })}
          </div>
        ))}
        <div style={{ width: 720, height: 6, borderRadius: 3, background: palette.foreground + '1F', marginTop: 40 }}>
          <div style={{ width: `${line * 100}%`, height: '100%', borderRadius: 3, background: palette.accent }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily: FONT }}>
      <Background />
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <Features />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
