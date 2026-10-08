import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo, sans-serif';
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const ci = (
  f: number,
  i: number[],
  o: number[],
  e: (t: number) => number = ease
) =>
  interpolate(f, i, o, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: e,
  });

const useSp = () => {
  const {fps} = useVideoConfig();
  return (f: number, delay = 0, damping = 18) =>
    Math.max(
      0,
      spring({
        frame: f - delay,
        fps,
        config: {damping, stiffness: 120, mass: 0.8},
      })
    );
};

const panelBg = 'rgba(255,255,255,0.05)';
const panelBorder = '1px solid rgba(255,255,255,0.09)';

/* ---------------- Logo mark ---------------- */
const Mark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="26" fill={palette.accent} />
    <path
      d="M26 68 L50 32 L74 68"
      stroke={palette.background}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="68" r="9" fill={palette.background} />
    <circle cx="50" cy="32" r="9" fill={palette.background} />
    <circle cx="74" cy="68" r="9" fill={palette.background} />
  </svg>
);

/* ---------------- Background ---------------- */
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const drift = f * 0.25;
  return (
    <AbsoluteFill style={{backgroundColor: palette.background}}>
      <div
        style={{
          position: 'absolute',
          left: 1100 + Math.sin(f / 60) * 60,
          top: -200 + Math.cos(f / 70) * 40,
          width: 900,
          height: 900,
          borderRadius: 900,
          background: palette.secondary,
          opacity: 0.1,
          filter: 'blur(160px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -250 + Math.cos(f / 80) * 50,
          top: 550 + Math.sin(f / 65) * 40,
          width: 800,
          height: 800,
          borderRadius: 800,
          background: palette.accent,
          opacity: 0.08,
          filter: 'blur(160px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(245,245,242,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,242,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: `${-drift}px ${-drift}px`,
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Intro ---------------- */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const sp = useSp();
  const exit = ci(f, [78, 98], [0, 1], Easing.in(Easing.cubic));

  const nodesX = [240, 620, 1000, 1380, 1760];
  const nodesY = [880, 820, 900, 830, 890];
  const t = ci(f, [6, 80], [0, 4], Easing.inOut(Easing.cubic));
  const dotX = interpolate(t, [0, 1, 2, 3, 4], nodesX);
  const dotY = interpolate(t, [0, 1, 2, 3, 4], nodesY);

  const markP = sp(f, 0);
  const nameP = sp(f, 8);
  const words = ['Make', 'room', 'for', 'focused', 'work'];

  return (
    <AbsoluteFill style={{opacity: 1 - exit}}>
      <svg
        width="1920"
        height="1080"
        style={{position: 'absolute', left: 0, top: 0}}
      >
        <polyline
          points={nodesX.map((x, i) => `${x},${nodesY[i]}`).join(' ')}
          fill="none"
          stroke={palette.muted}
          strokeOpacity={0.3 * ci(f, [10, 40], [0, 1])}
          strokeWidth="2"
          strokeDasharray="6 10"
        />
        {nodesX.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={nodesY[i]}
            r={10}
            fill={palette.background}
            stroke={palette.secondary}
            strokeWidth="3"
            opacity={ci(f, [4 + i * 4, 20 + i * 4], [0, 1])}
          />
        ))}
        <circle cx={dotX} cy={dotY} r={16} fill={palette.accent} opacity={0.25} />
        <circle cx={dotX} cy={dotY} r={9} fill={palette.accent} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 170,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${-exit * 40}px)`,
        }}
      >
        <div
          style={{
            transform: `scale(${markP}) rotate(${(1 - markP) * -30}deg)`,
            opacity: markP,
          }}
        >
          <Mark size={128} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 230,
            letterSpacing: -8,
            lineHeight: 1,
            marginTop: 30,
            color: palette.foreground,
            opacity: nameP,
            transform: `translateY(${(1 - nameP) * 60}px)`,
          }}
        >
          Relay
        </div>
        <div style={{display: 'flex', gap: 18, marginTop: 28}}>
          {words.map((w, i) => {
            const p = ci(f, [26 + i * 4, 44 + i * 4], [0, 1]);
            return (
              <span
                key={i}
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
  );
};

/* ---------------- Cursor ---------------- */
const Cursor: React.FC<{
  x: number;
  y: number;
  label: string;
  color: string;
  opacity?: number;
}> = ({x, y, label, color, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`,
      opacity,
      zIndex: 10,
    }}
  >
    <svg width="26" height="34" viewBox="0 0 22 32">
      <path
        d="M0 0 L0 26 L7 20 L12 31 L17 28 L12 18 L21 18 Z"
        fill={color}
        stroke={palette.background}
        strokeWidth="1.5"
      />
    </svg>
    <div
      style={{
        marginLeft: 18,
        marginTop: -4,
        background: color,
        color: palette.background,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 18,
        padding: '4px 12px',
        borderRadius: 999,
        display: 'inline-block',
      }}
    >
      {label}
    </div>
  </div>
);

/* ---------------- View 1: Plan together ---------------- */
const TaskCard: React.FC<{
  x: number;
  y: number;
  pr: number;
  hi?: boolean;
  w1: number;
  tint: string;
  lift?: number;
}> = ({x, y, pr, hi, w1, tint, lift = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 208,
      height: 102,
      borderRadius: 16,
      background: hi ? 'rgba(184,243,107,0.14)' : 'rgba(255,255,255,0.07)',
      border: hi
        ? `2px solid ${palette.accent}`
        : '1px solid rgba(255,255,255,0.1)',
      opacity: pr,
      transform: `translateY(${(1 - pr) * 24 - lift * 8}px) scale(${1 + lift * 0.04}) rotate(${lift * 2}deg)`,
      boxShadow: lift ? '0 24px 40px rgba(0,0,0,0.4)' : 'none',
      padding: 16,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: 36,
        height: 6,
        borderRadius: 4,
        background: tint,
        marginBottom: 12,
      }}
    />
    <div
      style={{
        width: w1,
        height: 10,
        borderRadius: 5,
        background: palette.foreground,
        opacity: 0.8,
      }}
    />
    <div
      style={{
        width: w1 * 0.65,
        height: 8,
        borderRadius: 4,
        background: palette.muted,
        opacity: 0.5,
        marginTop: 10,
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 14,
        bottom: 12,
        width: 22,
        height: 22,
        borderRadius: 22,
        background: tint,
        opacity: 0.85,
      }}
    />
  </div>
);

const PlanView: React.FC<{p: number}> = ({p}) => {
  const sp = useSp();
  const colW = 232;
  const gap = 19;
  const cx = (c: number) => c * (colW + gap) + 12;
  const cy = (r: number) => 66 + r * 118;
  const cards = [
    {c: 0, r: 0, d: 2, w: 150, t: palette.secondary},
    {c: 0, r: 1, d: 7, w: 120, t: palette.accent},
    {c: 1, r: 0, d: 12, w: 140, t: palette.accent},
    {c: 1, r: 1, d: 17, w: 110, t: palette.secondary},
    {c: 2, r: 0, d: 22, w: 130, t: palette.secondary},
  ];
  const heads = ['To do', 'In progress', 'Done'];

  const mv = ci(p, [30, 50], [0, 1], Easing.inOut(Easing.cubic));
  const mx = interpolate(mv, [0, 1], [cx(0), cx(1)]);
  const my = interpolate(mv, [0, 1], [cy(2), cy(2)]) - Math.sin(mv * Math.PI) * 20;
  const lift = Math.sin(mv * Math.PI);
  const mp = sp(p, 12);

  const avaX = ci(p, [0, 26], [mx + 420, cx(0) + 130]) * (p < 30 ? 1 : 0) +
    (p >= 30 ? mx + 130 : 0);
  const avaY = p < 30 ? ci(p, [0, 26], [cy(2) + 260, cy(2) + 60]) : my + 60;

  const jonX = interpolate(p, [10, 30, 46, 60], [620, 540, 520, 480], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const jonY = interpolate(p, [10, 30, 46, 60], [520, 340, 160, 190], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div style={{position: 'relative', width: 734, height: 620}}>
      {heads.map((h, i) => (
        <div
          key={h}
          style={{
            position: 'absolute',
            left: i * (colW + gap),
            top: 0,
            width: colW,
            height: 620,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.03)',
            border: panelBorder,
            opacity: ci(p, [0, 10], [0, 1]),
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 20,
              color: palette.muted,
              padding: '20px 18px',
            }}
          >
            {h}
          </div>
        </div>
      ))}
      {cards.map((c, i) => (
        <TaskCard
          key={i}
          x={cx(c.c)}
          y={cy(c.r)}
          pr={sp(p, c.d)}
          w1={c.w}
          tint={c.t}
        />
      ))}
      <TaskCard
        x={mx}
        y={my}
        pr={mp}
        hi
        w1={150}
        tint={palette.accent}
        lift={lift}
      />
      <Cursor
        x={avaX}
        y={avaY}
        label="Ava"
        color={palette.accent}
        opacity={ci(p, [4, 14], [0, 1])}
      />
      <Cursor
        x={jonX}
        y={jonY}
        label="Jon"
        color={palette.secondary}
        opacity={ci(p, [10, 20], [0, 1])}
      />
    </div>
  );
};

/* ---------------- View 2: Protect focus time ---------------- */
const FocusView: React.FC<{p: number}> = ({p}) => {
  const sp = useSp();
  const gutter = 60;
  const colW = 134;
  const head = 48;
  const rowH = 92;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00'];
  const meetings = [
    {d: 0, s: 0.5, n: 1, dl: 2},
    {d: 0, s: 3.5, n: 1.5, dl: 6},
    {d: 1, s: 3, n: 1.5, dl: 4},
    {d: 2, s: 0, n: 1, dl: 8},
    {d: 2, s: 4, n: 1, dl: 10},
    {d: 3, s: 2, n: 1, dl: 5},
    {d: 4, s: 0.5, n: 1.5, dl: 9},
  ];
  const focus = [
    {d: 1, s: 0.5, n: 2.2, dl: 18},
    {d: 2, s: 1.5, n: 2, dl: 25},
    {d: 3, s: 3.5, n: 2, dl: 32},
    {d: 4, s: 3, n: 2.5, dl: 39},
  ];
  return (
    <div style={{position: 'relative', width: 734, height: 620}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 730,
          height: head + rowH * 6,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.03)',
          border: panelBorder,
        }}
      />
      {days.map((d, i) => (
        <div
          key={d}
          style={{
            position: 'absolute',
            left: gutter + i * colW,
            top: 0,
            width: colW,
            height: head,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 20,
            color: palette.muted,
          }}
        >
          {d}
        </div>
      ))}
      {hours.map((h, i) => (
        <React.Fragment key={h}>
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: head + i * rowH + 6,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 16,
              color: palette.muted,
              opacity: 0.8,
            }}
          >
            {h}
          </div>
          <div
            style={{
              position: 'absolute',
              left: gutter,
              top: head + i * rowH,
              width: colW * 5,
              height: 1,
              background: 'rgba(255,255,255,0.07)',
            }}
          />
        </React.Fragment>
      ))}
      {meetings.map((m, i) => {
        const pr = sp(p, m.dl);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: gutter + m.d * colW + 8,
              top: head + m.s * rowH + 4,
              width: colW - 16,
              height: m.n * rowH - 8,
              borderRadius: 12,
              background: 'rgba(120,185,237,0.2)',
              borderLeft: `5px solid ${palette.secondary}`,
              opacity: pr,
              transform: `scale(${0.9 + pr * 0.1})`,
              boxSizing: 'border-box',
              padding: 12,
            }}
          >
            <div
              style={{
                width: '70%',
                height: 9,
                borderRadius: 5,
                background: palette.secondary,
                opacity: 0.7,
              }}
            />
          </div>
        );
      })}
      {focus.map((m, i) => {
        const pr = sp(p, m.dl, 16);
        const glow = ci(p, [m.dl + 6, m.dl + 20, m.dl + 40], [0, 1, 0.35]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: gutter + m.d * colW + 8,
              top: head + m.s * rowH + 4,
              width: colW - 16,
              height: (m.n * rowH - 8) * Math.min(pr, 1.02),
              borderRadius: 12,
              background: palette.accent,
              overflow: 'hidden',
              boxShadow: `0 0 ${40 * glow}px rgba(184,243,107,${0.5 * glow})`,
              boxSizing: 'border-box',
              padding: '12px 12px',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 20,
                color: palette.background,
                whiteSpace: 'nowrap',
                opacity: ci(p, [m.dl + 8, m.dl + 18], [0, 1]),
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

/* ---------------- View 3: See progress ---------------- */
const ProgressView: React.FC<{p: number}> = ({p}) => {
  const sp = useSp();
  const r = 80;
  const circ = 2 * Math.PI * r;
  const prog = ci(p, [6, 46], [0, 0.82], Easing.inOut(Easing.cubic));
  const rows = [
    {l: 'Design', v: 0.92, c: palette.accent, d: 8},
    {l: 'Build', v: 0.68, c: palette.secondary, d: 16},
    {l: 'Launch', v: 0.4, c: palette.accent, d: 24},
  ];
  const bars = [0.4, 0.55, 0.5, 0.7, 0.65, 0.85, 0.95];
  const card = {
    background: panelBg,
    border: panelBorder,
    borderRadius: 20,
    position: 'absolute' as const,
    boxSizing: 'border-box' as const,
  };
  return (
    <div style={{position: 'relative', width: 734, height: 620}}>
      <div
        style={{
          ...card,
          left: 0,
          top: 0,
          width: 300,
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: ci(p, [0, 10], [0, 1]),
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="18"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={palette.accent}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - prog)}
            transform="rotate(-90 100 100)"
          />
          <path
            d="M72 102 L92 122 L130 80"
            fill="none"
            stroke={palette.foreground}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="120"
            strokeDashoffset={120 * (1 - ci(p, [30, 50], [0, 1]))}
          />
        </svg>
      </div>
      <div
        style={{
          ...card,
          left: 318,
          top: 0,
          width: 416,
          height: 280,
          padding: 28,
          opacity: ci(p, [0, 10], [0, 1]),
        }}
      >
        {rows.map((row, i) => (
          <div key={row.l} style={{marginBottom: 26}}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 22,
                color: palette.foreground,
                marginBottom: 10,
              }}
            >
              {row.l}
            </div>
            <div
              style={{
                height: 16,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${ci(p, [row.d, row.d + 28], [0, row.v]) * 100}%`,
                  background: row.c,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          ...card,
          left: 0,
          top: 298,
          width: 734,
          height: 322,
          padding: 28,
          opacity: ci(p, [4, 14], [0, 1]),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 28,
            height: 266,
            borderBottom: '2px solid rgba(255,255,255,0.12)',
          }}
        >
          {bars.map((b, i) => {
            const g = sp(p, 14 + i * 3, 20);
            const last = i === bars.length - 1;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: b * 250 * Math.min(g, 1.03),
                  borderRadius: '10px 10px 0 0',
                  background: last ? palette.accent : palette.secondary,
                  opacity: last ? 1 : 0.6,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------------- View wrapper ---------------- */
const ViewWrap: React.FC<{
  f: number;
  start: number;
  len: number;
  last?: boolean;
  children: (p: number) => React.ReactNode;
}> = ({f, start, len, last, children}) => {
  const p = f - start;
  if (p < -2 || (!last && p > len + 2)) return null;
  const inn = ci(p, [0, 14], [0, 1]);
  const out = last ? 0 : ci(p, [len - 12, len], [0, 1], Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: inn * (1 - out),
        transform: `translateX(${(1 - inn) * 40 - out * 40}px)`,
      }}
    >
      {children(Math.max(0, p))}
    </div>
  );
};

/* ---------------- Product scene ---------------- */
const PHASE_START = [6, 66, 126];
const PHASE_LEN = 60;
const TITLES = ['Plan together', 'Protect focus time', 'See progress'];
const NAV = ['Plan', 'Focus', 'Progress'];

const Product: React.FC = () => {
  const f = useCurrentFrame();
  const sp = useSp();
  const winIn = sp(f, 0, 22);
  const exit = ci(f, [186, 200], [0, 1], Easing.in(Easing.cubic));
  const active = f < PHASE_START[1] ? 0 : f < PHASE_START[2] ? 1 : 2;

  return (
    <AbsoluteFill>
      {/* Caption column */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 0,
          width: 660,
          height: 1080,
          opacity: 1 - exit,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 330,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 26,
            color: palette.accent,
            letterSpacing: 4,
            opacity: ci(f, [0, 16], [0, 1]),
          }}
        >
          {`0${active + 1} / 03`}
        </div>
        {TITLES.map((t, i) => {
          const p = f - PHASE_START[i];
          const inn = ci(p, [0, 16], [0, 1]);
          const out = i < 2 ? ci(p, [PHASE_LEN - 12, PHASE_LEN], [0, 1], Easing.in(Easing.cubic)) : 0;
          if (p < -2 || (i < 2 && p > PHASE_LEN + 2)) return null;
          return (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: 0,
                top: 385,
                width: 660,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 96,
                lineHeight: 1.02,
                letterSpacing: -3,
                color: palette.foreground,
                opacity: inn * (1 - out),
                transform: `translateY(${(1 - inn) * 50 - out * 30}px)`,
              }}
            >
              {t}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, top: 690, display: 'flex', gap: 14}}>
          {TITLES.map((t, i) => {
            const fill = ci(f - PHASE_START[i], [0, PHASE_LEN], [0, 1], (x) => x);
            return (
              <div
                key={t}
                style={{
                  width: 200,
                  height: 6,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.14)',
                  overflow: 'hidden',
                  opacity: ci(f, [4, 20], [0, 1]),
                }}
              >
                <div
                  style={{
                    width: `${fill * 100}%`,
                    height: '100%',
                    background: palette.accent,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Window */}
      <div
        style={{
          position: 'absolute',
          left: 840,
          top: 170,
          width: 980,
          height: 740,
          borderRadius: 32,
          background: '#17181D',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 50px 120px rgba(0,0,0,0.55)',
          overflow: 'hidden',
          opacity: winIn * (1 - exit),
          transform: `translateY(${(1 - winIn) * 70 - exit * 30}px) scale(${0.95 + 0.05 * winIn})`,
        }}
      >
        <div
          style={{
            height: 64,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 26px',
            gap: 10,
          }}
        >
          {[palette.muted, palette.muted, palette.muted].map((c, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 14,
                background: c,
                opacity: 0.4,
              }}
            />
          ))}
          <div
            style={{
              marginLeft: 20,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 22,
              color: palette.muted,
            }}
          >
            This week
          </div>
        </div>
        <div style={{display: 'flex', height: 676}}>
          <div
            style={{
              width: 190,
              borderRight: '1px solid rgba(255,255,255,0.08)',
              padding: '28px 18px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{marginBottom: 28}}>
              <Mark size={44} />
            </div>
            {NAV.map((n, i) => {
              const on = i === active;
              return (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 12px',
                    borderRadius: 12,
                    marginBottom: 8,
                    background: on ? 'rgba(184,243,107,0.14)' : 'transparent',
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 20,
                    color: on ? palette.accent : palette.muted,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: on ? palette.accent : palette.muted,
                      opacity: on ? 1 : 0.5,
                    }}
                  />
                  {n}
                </div>
              );
            })}
          </div>
          <div style={{flex: 1, padding: 28, boxSizing: 'border-box'}}>
            <div style={{position: 'relative', width: 734, height: 620}}>
              <ViewWrap f={f} start={PHASE_START[0]} len={PHASE_LEN}>
                {(p) => <PlanView p={p} />}
              </ViewWrap>
              <ViewWrap f={f} start={PHASE_START[1]} len={PHASE_LEN}>
                {(p) => <FocusView p={p} />}
              </ViewWrap>
              <ViewWrap f={f} start={PHASE_START[2]} len={PHASE_LEN} last>
                {(p) => <ProgressView p={p} />}
              </ViewWrap>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Outro ---------------- */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const sp = useSp();
  const markP = sp(f, 2);
  const lines = ['Start your next week', 'with Relay'];
  const nodesX = [260, 560, 860, 1160, 1460, 1660];
  const lineP = ci(f, [6, 40], [0, 1]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 190,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: ci(f, [0, 10], [0, 1]),
        }}
      >
        <div style={{transform: `scale(${markP})`, opacity: markP}}>
          <Mark size={104} />
        </div>
        <div style={{marginTop: 40, textAlign: 'center'}}>
          {lines.map((l, i) => {
            const p = ci(f, [4 + i * 6, 22 + i * 6], [0, 1]);
            return (
              <div
                key={l}
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 136,
                  lineHeight: 1.04,
                  letterSpacing: -5,
                  color: i === 1 ? palette.accent : palette.foreground,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 50}px)`,
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 56,
            width: 420 * lineP,
            height: 8,
            borderRadius: 4,
            background: palette.secondary,
          }}
        />
      </div>
      <svg
        width="1920"
        height="1080"
        style={{position: 'absolute', left: 0, top: 0}}
      >
        <line
          x1={nodesX[0]}
          y1={900}
          x2={nodesX[0] + (nodesX[5] - nodesX[0]) * lineP}
          y2={900}
          stroke={palette.muted}
          strokeOpacity={0.35}
          strokeWidth="2"
          strokeDasharray="6 10"
        />
        {nodesX.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={900}
            r={10}
            fill={i === 5 ? palette.accent : palette.background}
            stroke={i === 5 ? palette.accent : palette.secondary}
            strokeWidth="3"
            opacity={ci(f, [8 + i * 4, 22 + i * 4], [0, 1])}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- Root ---------------- */
export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{backgroundColor: palette.background, fontFamily: FONT}}
    >
      <Background />
      <Sequence from={0} durationInFrames={100}>
        <Intro />
      </Sequence>
      <Sequence from={84} durationInFrames={200}>
        <Product />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
