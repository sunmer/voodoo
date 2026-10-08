import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo';
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const rgba = (hex: string, alpha: number): string => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const ease = (frame: number, from: number, to: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [from, to], CLAMP);

const fade = (frame: number, inStart: number, inEnd: number, outStart: number, outEnd: number): number =>
  Math.min(ease(frame, 0, 1, inStart, inEnd), ease(frame, 1, 0, outStart, outEnd));

const captions = [
  { text: 'Plan together', start: 0, end: 60 },
  { text: 'Protect focus time', start: 60, end: 120 },
  { text: 'See progress', start: 120, end: 180 },
];

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

const blocks = [
  { c: 0, r: 0, t: 'Kickoff' },
  { c: 0, r: 1, t: 'Roadmap' },
  { c: 1, r: 0, t: 'Design review' },
  { c: 2, r: 0, t: 'Build sprint' },
  { c: 3, r: 0, t: 'Client sync' },
  { c: 4, r: 0, t: 'Retro' },
  { c: 1, r: 1, t: 'Handoff' },
  { c: 3, r: 1, t: 'Hiring' },
];

const meters = [
  { label: 'Scope', value: 72, color: palette.accent },
  { label: 'Reviews', value: 48, color: palette.secondary },
  { label: 'Launch', value: 90, color: palette.accent },
];

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const gx = ease(frame, 30, 70, 0, 360);
  const gy = ease(frame, 35, 65, 0, 360);
  const line = rgba(palette.foreground, 0.035);
  return (
    <AbsoluteFill style={{ background: palette.background, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${gx}% ${gy}%, ${rgba(palette.accent, 0.14)}, transparent 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 200 } });
  const rule = ease(frame, 0, 180, 20, 48);
  const tag = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 200 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fade(frame, 0, 10, 74, 89),
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 240,
          lineHeight: 1,
          letterSpacing: -8,
          color: palette.foreground,
          opacity: title,
          transform: `translateY(${(1 - title) * 60}px)`,
        }}
      >
        Relay
      </div>
      <div
        style={{
          width: rule,
          height: 8,
          borderRadius: 4,
          background: palette.accent,
          margin: '36px 0 40px',
        }}
      />
      <div
        style={{
          fontWeight: 500,
          fontSize: 60,
          color: palette.muted,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 24}px)`,
        }}
      >
        Make room for focused work
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ frame: number }> = ({ frame }) => {
  const active = frame < 60 ? 0 : frame < 120 ? 1 : 2;
  return (
    <>
      {captions.map((c, i) => {
        const o = fade(frame, c.start, c.start + 12, c.end - 10, c.end);
        const y = ease(frame, 28, 0, c.start, c.start + 12);
        return (
          <div
            key={c.text}
            style={{
              position: 'absolute',
              left: 120,
              top: 290,
              width: 600,
              fontFamily: FONT,
              opacity: o,
              transform: `translateY(${y}px)`,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 28, color: palette.accent, letterSpacing: 3, marginBottom: 14 }}>
              {`0${i + 1}`}
            </div>
            <div style={{ fontWeight: 700, fontSize: 72, lineHeight: 1.05, letterSpacing: -1.5, color: palette.foreground }}>
              {c.text}
            </div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 120, top: 560, display: 'flex', gap: 12 }}>
        {captions.map((c, i) => (
          <div
            key={c.text}
            style={{
              width: i === active ? 56 : 16,
              height: 6,
              borderRadius: 3,
              background: i === active ? palette.accent : rgba(palette.muted, 0.35),
            }}
          />
        ))}
      </div>
    </>
  );
};

const Interface: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const focusH = ease(frame, 0, 190, 62, 92);
  const focusO = ease(frame, 0, 1, 60, 66);
  const focusTextO = ease(frame, 0, 1, 84, 100);
  const panelO = ease(frame, 0, 1, 112, 124);
  return (
    <div
      style={{
        position: 'absolute',
        left: 740,
        top: 200,
        width: 1100,
        height: 680,
        boxSizing: 'border-box',
        borderRadius: 28,
        overflow: 'hidden',
        background: rgba(palette.foreground, 0.04),
        border: `2px solid ${rgba(palette.foreground, 0.12)}`,
        opacity: enter,
        transform: `translateX(${(1 - enter) * 90}px) scale(${0.97 + 0.03 * enter})`,
        fontFamily: FONT,
        color: palette.foreground,
      }}
    >
      <div style={{ position: 'absolute', left: 40, top: 28, fontSize: 34, fontWeight: 700 }}>This week</div>
      <div style={{ position: 'absolute', right: 40, top: 30, display: 'flex' }}>
        {[palette.accent, palette.secondary, palette.muted].map((col, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              boxSizing: 'border-box',
              borderRadius: 20,
              background: col,
              marginLeft: i === 0 ? 0 : -10,
              border: `3px solid ${palette.background}`,
            }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, height: 2, background: rgba(palette.foreground, 0.08) }} />

      {days.map((d, i) => (
        <div
          key={d}
          style={{
            position: 'absolute',
            left: 40 + i * 204,
            top: 124,
            width: 180,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
            color: palette.muted,
          }}
        >
          {d}
        </div>
      ))}

      {blocks.map((b, k) => {
        const p = spring({ frame: Math.max(0, frame - (6 + k * 6)), fps, config: { damping: 200 } });
        return (
          <div
            key={b.t}
            style={{
              position: 'absolute',
              left: 40 + b.c * 204,
              top: 176 + b.r * 96,
              width: 180,
              height: 78,
              boxSizing: 'border-box',
              borderRadius: 14,
              background: rgba(palette.foreground, 0.07),
              border: `1px solid ${rgba(palette.foreground, 0.1)}`,
              padding: '0 18px 0 24px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.15,
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 6, borderRadius: 3, background: palette.secondary }} />
            {b.t}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 40 + 2 * 204,
          top: 272,
          width: 180,
          height: focusH,
          boxSizing: 'border-box',
          borderRadius: 14,
          background: rgba(palette.accent, 0.14),
          border: `2px solid ${rgba(palette.accent, 0.7)}`,
          opacity: focusO,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 16,
            fontSize: 26,
            fontWeight: 700,
            color: palette.accent,
            opacity: focusTextO,
            whiteSpace: 'nowrap',
          }}
        >
          Focus time
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 500,
          width: 1020,
          height: 140,
          boxSizing: 'border-box',
          borderRadius: 20,
          background: rgba(palette.foreground, 0.04),
          border: `1px solid ${rgba(palette.foreground, 0.1)}`,
          padding: '26px 32px',
          display: 'flex',
          gap: 32,
          opacity: panelO,
        }}
      >
        {meters.map((m, i) => {
          const p = ease(frame, 0, 1, 118 + i * 10, 168 + i * 10);
          const pct = Math.round(m.value * p);
          return (
            <div key={m.label} style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 26,
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                <span>{m.label}</span>
                <span>{`${pct}%`}</span>
              </div>
              <div style={{ height: 12, borderRadius: 6, background: rgba(palette.foreground, 0.1), overflow: 'hidden' }}>
                <div style={{ width: `${m.value * p}%`, height: '100%', borderRadius: 6, background: m.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: fade(frame, 0, 12, 166, 179), fontFamily: FONT }}>
      <Captions frame={frame} />
      <Interface frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 200 } });
  const s2 = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 200 } });
  const opacity = ease(frame, 0, 1, 0, 12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity, fontFamily: FONT }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1.08,
            letterSpacing: -3,
            color: palette.foreground,
            opacity: s1,
            transform: `translateY(${(1 - s1) * 36}px)`,
          }}
        >
          Start your next week
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1.08,
            letterSpacing: -3,
            color: palette.accent,
            opacity: s2,
            transform: `translateY(${(1 - s2) * 36}px)`,
          }}
        >
          with Relay
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: 120,
          fontWeight: 700,
          fontSize: 36,
          color: palette.muted,
          opacity: s2,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <ProductScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
