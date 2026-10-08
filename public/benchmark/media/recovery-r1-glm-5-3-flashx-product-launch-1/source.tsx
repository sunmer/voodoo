import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { palette } from './contract';

const fontFamily = 'Archivo, sans-serif';

const bg = palette.background;
const fg = palette.foreground;
const accent = palette.accent;
const secondary = palette.secondary;
const muted = palette.muted;

const CLAMP = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

const delayedSpring = (
  frame: number,
  fps: number,
  delay: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {}
): number => {
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200, ...config },
  });
};

const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        'linear-gradient(' +
        rgba(fg, 0.035) +
        ' 1px, transparent 1px), linear-gradient(90deg, ' +
        rgba(fg, 0.035) +
        ' 1px, transparent 1px)',
      backgroundSize: '96px 96px',
      backgroundPosition: '48px 48px',
    }}
  />
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = delayedSpring(frame, fps, 0, { damping: 26, stiffness: 110 });
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const subOpacity = interpolate(frame, [26, 44], [0, 1], CLAMP);
  const subRise = interpolate(
    delayedSpring(frame, fps, 26, { damping: 24 }),
    [0, 1],
    [24, 0]
  );
  const exit = interpolate(frame, [76, 89], [1, 0], CLAMP);
  const bars = [accent, secondary, fg];
  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 42,
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            {bars.map((c, i) => {
              const p = delayedSpring(frame, fps, 4 + i * 6, {
                damping: 18,
                stiffness: 130,
              });
              return (
                <div
                  key={i}
                  style={{
                    width: 56,
                    height: 10,
                    borderRadius: 5,
                    background: c,
                    transform: 'scaleX(' + p + ')',
                    transformOrigin: 'center',
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              opacity: titleOpacity,
              transform: 'scale(' + scale + ')',
            }}
          >
            <div
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 190,
                letterSpacing: '-0.03em',
                color: fg,
                display: 'flex',
                alignItems: 'center',
                gap: 30,
              }}
            >
              Relay
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: accent,
                  marginTop: 20,
                }}
              />
            </div>
          </div>
          <div
            style={{
              opacity: subOpacity,
              transform: 'translateY(' + subRise + 'px)',
              fontFamily,
              fontSize: 46,
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: muted,
            }}
          >
            Make room for focused work
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FeatureScene: React.FC<{
  index: string;
  kicker: string;
  title: string;
  panelTitle: string;
  children: React.ReactNode;
}> = ({ index, kicker, title, panelTitle, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = delayedSpring(frame, fps, 0, { damping: 26 });
  const exit = interpolate(frame, [50, 59], [1, 0], CLAMP);
  const textRise = interpolate(enter, [0, 1], [36, 0]);
  const panelSlide = interpolate(enter, [0, 1], [56, 0]);
  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 0,
          bottom: 0,
          width: 640,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: enter,
          transform: 'translateY(' + textRise + 'px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 700,
              color: bg,
              background: accent,
              borderRadius: 999,
              padding: '6px 18px',
            }}
          >
            {index}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 21,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: muted,
            }}
          >
            {kicker}
          </div>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: fg,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 30,
            width: interpolate(enter, [0, 1], [0, 130]),
            height: 6,
            borderRadius: 3,
            background: accent,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 880,
          right: 120,
          top: 150,
          bottom: 150,
          opacity: enter,
          transform: 'translateX(' + panelSlide + 'px)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: rgba(fg, 0.05),
            border: '1px solid ' + rgba(fg, 0.12),
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              height: 58,
              borderBottom: '1px solid ' + rgba(fg, 0.1),
              display: 'flex',
              alignItems: 'center',
              padding: '0 26px',
              gap: 10,
            }}
          >
            {[muted, secondary, accent].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: c,
                }}
              />
            ))}
            <div
              style={{
                marginLeft: 14,
                fontFamily,
                fontSize: 17,
                color: muted,
              }}
            >
              {panelTitle}
            </div>
          </div>
          <div style={{ position: 'relative', height: 'calc(100% - 58px)' }}>
            {children}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Board: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = [
    { name: 'Backlog', x: 0 },
    { name: 'This week', x: 300 },
    { name: 'Done', x: 600 },
  ];
  const cards = [
    {
      label: 'Design review',
      tag: 'Product',
      initials: 'AK',
      from: 0,
      to: 1,
      delay: 10,
      avatar: secondary,
      row: 0,
    },
    {
      label: 'Sprint planning',
      tag: 'Ops',
      initials: 'JM',
      from: 0,
      to: 1,
      delay: 20,
      avatar: accent,
      row: 1,
    },
    {
      label: 'Launch checklist',
      tag: 'Growth',
      initials: 'RS',
      from: 1,
      to: 2,
      delay: 34,
      avatar: secondary,
      row: 2,
    },
  ];
  const highlight = delayedSpring(frame, fps, 10, { damping: 22 });
  return (
    <div style={{ position: 'absolute', inset: 0, padding: 24 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 300,
            width: 272,
            bottom: 0,
            borderRadius: 16,
            background: rgba(accent, 0.07),
            border: '1px solid ' + rgba(accent, 0.08 + 0.2 * highlight),
          }}
        />
        {cols.map((c) => (
          <div
            key={c.name}
            style={{
              position: 'absolute',
              left: c.x,
              top: 8,
              width: 272,
              fontFamily,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: muted,
            }}
          >
            {c.name}
          </div>
        ))}
        {cards.map((card, i) => {
          const move = delayedSpring(frame, fps, card.delay, {
            damping: 28,
            stiffness: 120,
          });
          const x = interpolate(
            move,
            [0, 1],
            [cols[card.from].x, cols[card.to].x]
          );
          const enterP = delayedSpring(frame, fps, 4 + i * 4, { damping: 26 });
          return (
            <div
              key={card.label}
              style={{
                position: 'absolute',
                left: x,
                top: 62 + card.row * 148,
                width: 260,
                padding: '20px 20px 18px 20px',
                borderRadius: 16,
                background: rgba(bg, 0.88),
                border: '1px solid ' + rgba(fg, 0.14),
                opacity: 0.2 + 0.8 * enterP,
                transform: 'translateY(' + (1 - enterP) * 16 + 'px)',
              }}
            >
              <div
                style={{
                  fontFamily,
                  fontSize: 21,
                  fontWeight: 600,
                  color: fg,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontFamily, fontSize: 15, color: muted }}>
                  {card.tag}
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: card.avatar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily,
                    fontSize: 13,
                    fontWeight: 700,
                    color: bg,
                  }}
                >
                  {card.initials}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Schedule: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = delayedSpring(frame, fps, 2, { damping: 26 });
  const focusP = delayedSpring(frame, fps, 10, {
    damping: 24,
    stiffness: 90,
  });
  const focusH = interpolate(focusP, [0, 1], [30, 336]);
  const meetings = [
    { label: 'Standup', time: '9:00 - 9:30', top: 20, height: 64, dismissAt: 999 },
    {
      label: '1:1 with Sam',
      time: '10:00 - 11:00',
      top: 120,
      height: 120,
      dismissAt: 16,
    },
    {
      label: 'Team sync',
      time: '1:00 - 2:00',
      top: 336,
      height: 120,
      dismissAt: 24,
    },
  ];
  const hours = [
    { label: '9 AM', top: 20 },
    { label: '10', top: 104 },
    { label: '11', top: 188 },
    { label: '12', top: 272 },
    { label: '1 PM', top: 356 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, padding: 24 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {hours.map((h) => (
          <div
            key={h.label}
            style={{
              position: 'absolute',
              left: 0,
              top: h.top,
              width: 90,
              fontFamily,
              fontSize: 15,
              color: muted,
              opacity: enter,
            }}
          >
            {h.label}
          </div>
        ))}
        <div style={{ position: 'absolute', left: 110, right: 0, top: 0, bottom: 0 }}>
          {meetings.map((m) => {
            const d =
              m.dismissAt > 100
                ? 0
                : delayedSpring(frame, fps, m.dismissAt, { damping: 26 });
            return (
              <div
                key={m.label}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: m.top,
                  height: m.height,
                  borderRadius: 14,
                  background: rgba(muted, 0.14),
                  border: '1px solid ' + rgba(muted, 0.35),
                  padding: '12px 20px',
                  opacity: (1 - 0.85 * d) * enter,
                  transform: 'scaleY(' + (1 - 0.2 * d) + ')',
                  transformOrigin: 'top center',
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 600,
                    color: fg,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: 15,
                    color: muted,
                    marginTop: 4,
                  }}
                >
                  {m.time}
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 120,
              height: focusH,
              borderRadius: 16,
              background: accent,
              opacity: enter,
              padding: '18px 24px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontFamily,
                  fontSize: 26,
                  fontWeight: 700,
                  color: bg,
                }}
              >
                Deep work
              </div>
              <div
                style={{
                  fontFamily,
                  fontSize: 15,
                  fontWeight: 700,
                  color: accent,
                  background: bg,
                  borderRadius: 999,
                  padding: '6px 14px',
                }}
              >
                Protected
              </div>
            </div>
            <div
              style={{
                fontFamily,
                fontSize: 16,
                color: rgba(bg, 0.7),
                marginTop: 8,
              }}
            >
              10:00 AM - 1:00 PM - Focus time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const values = [0.42, 0.58, 0.5, 0.72, 0.64, 0.86, 1];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const chartH = 330;
  const numberP = delayedSpring(frame, fps, 14, { damping: 30 });
  const value = interpolate(numberP, [0, 1], [0, 18.5]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '30px 32px 26px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <div
          style={{
            fontFamily,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: muted,
          }}
        >
          Focus hours - this week
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 96,
            fontWeight: 700,
            color: accent,
            letterSpacing: '-0.03em',
            marginTop: 6,
            opacity: interpolate(frame, [10, 24], [0, 1], CLAMP),
          }}
        >
          {value.toFixed(1)}h
        </div>
      </div>
      <div style={{ position: 'relative', height: chartH, marginTop: 24 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background: rgba(fg, 0.15),
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {values.map((v, i) => {
            const p = delayedSpring(frame, fps, 6 + i * 5, {
              damping: 20,
              stiffness: 120,
            });
            const h = v * chartH * p;
            const last = i === values.length - 1;
            return (
              <div
                key={i}
                style={{
                  width: 72,
                  height: Math.max(0, h),
                  borderRadius: '12px 12px 4px 4px',
                  background: last ? accent : rgba(secondary, 0.85),
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 12,
        }}
      >
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              width: 72,
              textAlign: 'center',
              fontFamily,
              fontSize: 15,
              color: muted,
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = delayedSpring(frame, fps, 0, { damping: 26 });
  const subOpacity = interpolate(frame, [22, 34], [0, 1], CLAMP);
  const underline = delayedSpring(frame, fps, 10, { damping: 24 });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 42,
          opacity: enter,
          transform: 'translateY(' + interpolate(enter, [0, 1], [30, 0]) + 'px)',
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: bg,
            background: accent,
            borderRadius: 999,
            padding: '10px 28px',
          }}
        >
          Relay
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            color: fg,
            lineHeight: 1.1,
          }}
        >
          Start your next week
          <br />
          with Relay
        </div>
        <div
          style={{
            width: interpolate(underline, [0, 1], [0, 160]),
            height: 8,
            borderRadius: 4,
            background: accent,
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: 30,
            color: muted,
            letterSpacing: '0.04em',
            opacity: subOpacity,
            display: 'flex',
            gap: 26,
            alignItems: 'center',
          }}
        >
          <span>Plan together</span>
          <span style={{ color: accent }}>·</span>
          <span>Protect focus time</span>
          <span style={{ color: accent }}>·</span>
          <span>See progress</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: bg,
        fontFamily,
        color: fg,
      }}
    >
      <Backdrop />
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <FeatureScene
          index='01'
          kicker='Collaborate'
          title='Plan together'
          panelTitle='relay - shared board'
        >
          <Board />
        </FeatureScene>
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <FeatureScene
          index='02'
          kicker='Calendar'
          title='Protect focus time'
          panelTitle='relay - this week'
        >
          <Schedule />
        </FeatureScene>
      </Sequence>
      <Sequence from={210} durationInFrames={60}>
        <FeatureScene
          index='03'
          kicker='Insights'
          title='See progress'
          panelTitle='relay - focus insights'
        >
          <Progress />
        </FeatureScene>
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};