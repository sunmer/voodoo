import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { palette } from './contract';

const C = {
  background: palette?.background ?? '#101114',
  foreground: palette?.foreground ?? '#F5F5F2',
  accent: palette?.accent ?? '#B8F36B',
  secondary: palette?.secondary ?? '#78B9ED',
  muted: palette?.muted ?? '#B1B4BC',
};

const FONT = 'Archivo';
const HAIRLINE = 'rgba(245, 245, 242, 0.12)';
const GRID = 'rgba(245, 245, 242, 0.07)';
const SURFACE = 'rgba(245, 245, 242, 0.05)';
const LANE = 'rgba(245, 245, 242, 0.03)';
const CARD = 'rgba(245, 245, 242, 0.08)';
const GLOW = 'rgba(184, 243, 107, 0.10)';

const ramp = (frame: number, from: number, to: number, out: [number, number] = [0, 1]) =>
  interpolate(frame, [from, to], out, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const pop = (frame: number, fps: number, delay: number, duration = 28) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: duration });

const lerp = (a: number, b: number, p: number) => interpolate(p, [0, 1], [a, b]);

const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 78% 16%, ${GLOW}, rgba(16, 17, 20, 0) 48%), ${C.background}`,
    }}
  />
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordmark = pop(frame, fps, 6, 32);
  const tagline = pop(frame, fps, 34, 30);
  const rule = ramp(frame, 22, 52);
  const exit = ramp(frame, 74, 90, [1, 0]);

  return (
    <AbsoluteFill
      style={{ alignItems: 'center', justifyContent: 'center', opacity: exit, fontFamily: FONT }}
    >
      <div
        style={{
          fontSize: 264,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.045em',
          color: C.foreground,
          opacity: wordmark,
          transform: `translateY(${(1 - wordmark) * 48}px)`,
        }}
      >
        Relay
      </div>
      <div
        style={{
          width: 240 * rule,
          height: 6,
          borderRadius: 3,
          background: C.accent,
          margin: '44px 0 40px',
        }}
      />
      <div
        style={{
          fontSize: 60,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: C.foreground,
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 28}px)`,
        }}
      >
        Make room for focused work
      </div>
    </AbsoluteFill>
  );
};

const FEATURES = [
  { index: '01', title: 'Plan together', header: 'Team plan' },
  { index: '02', title: 'Protect focus time', header: 'Focus week' },
  { index: '03', title: 'See progress', header: 'Progress' },
];

const Shell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, 4, 30);
  return (
    <div
      style={{
        position: 'absolute',
        left: 880,
        top: 220,
        width: 960,
        height: 640,
        borderRadius: 24,
        border: `1px solid ${HAIRLINE}`,
        background: SURFACE,
        overflow: 'hidden',
        boxShadow: '0 40px 120px rgba(0, 0, 0, 0.45)',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 32}px)`,
      }}
    >
      <div
        style={{
          height: 64,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 28px',
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: C.accent }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: 'rgba(245, 245, 242, 0.2)' }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: 'rgba(245, 245, 242, 0.2)' }} />
        <div style={{ marginLeft: 18, fontSize: 22, fontWeight: 600, color: C.foreground }}>{title}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 64, width: 960, height: 576 }}>{children}</div>
    </div>
  );
};

const ProgressDots: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: 'absolute', left: 80, top: 760, display: 'flex', gap: 12 }}>
    {FEATURES.map((f, i) => (
      <div
        key={f.index}
        style={{
          width: i === active ? 64 : 24,
          height: 6,
          borderRadius: 3,
          background: i === active ? C.accent : 'rgba(245, 245, 242, 0.2)',
        }}
      />
    ))}
  </div>
);

const TaskCard: React.FC<{ x: number; y: number; label: string; tint: string; delay: number }> = ({
  x,
  y,
  label,
  tint,
  delay,
}) => {
  const frame = useCurrentFrame();
  const o = ramp(frame, delay, delay + 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 256,
        height: 96,
        boxSizing: 'border-box',
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${HAIRLINE}`,
        background: CARD,
        opacity: o,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 600, color: C.foreground }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: tint }} />
        <div style={{ width: 96, height: 8, borderRadius: 4, background: 'rgba(245, 245, 242, 0.14)' }} />
      </div>
    </div>
  );
};

const COLUMNS = [32, 336, 640];
const COLUMN_LABELS = ['To do', 'In progress', 'Done'];

const PlanBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const moveA = pop(frame, fps, 14, 28);
  const moveB = pop(frame, fps, 30, 28);
  return (
    <>
      {COLUMNS.map((left, i) => (
        <div
          key={left}
          style={{
            position: 'absolute',
            left,
            top: 32,
            width: 288,
            height: 512,
            boxSizing: 'border-box',
            borderRadius: 16,
            background: LANE,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              fontSize: 20,
              fontWeight: 600,
              color: i === 2 ? C.accent : C.muted,
            }}
          >
            {COLUMN_LABELS[i]}
          </div>
        </div>
      ))}
      <TaskCard x={352} y={104} label="Onboarding flow" tint={C.secondary} delay={0} />
      <TaskCard x={48} y={328} label="Sprint goals" tint={C.muted} delay={4} />
      <TaskCard
        x={lerp(48, 352, moveA)}
        y={lerp(104, 216, moveA)}
        label="Q3 roadmap"
        tint={C.accent}
        delay={8}
      />
      <TaskCard
        x={lerp(48, 656, moveB)}
        y={lerp(216, 104, moveB)}
        label="Design review"
        tint={C.secondary}
        delay={12}
      />
    </>
  );
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const FOCUS_BLOCKS = [
  { d: 0, r: 2, s: 2 },
  { d: 1, r: 0, s: 3 },
  { d: 2, r: 3, s: 2 },
  { d: 3, r: 1, s: 3 },
  { d: 4, r: 0, s: 2 },
];

const FocusBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {DAY_LABELS.map((d, i) => (
        <div
          key={d}
          style={{
            position: 'absolute',
            left: 120 + i * 160,
            top: 40,
            width: 160,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 600,
            color: C.muted,
          }}
        >
          {d}
        </div>
      ))}
      {Array.from({ length: 9 }, (_, r) => (
        <div
          key={`h${r}`}
          style={{ position: 'absolute', left: 120, top: 96 + r * 56, width: 800, height: 1, background: GRID }}
        />
      ))}
      {Array.from({ length: 6 }, (_, c) => (
        <div
          key={`v${c}`}
          style={{ position: 'absolute', left: 120 + c * 160, top: 96, width: 1, height: 448, background: GRID }}
        />
      ))}
      {FOCUS_BLOCKS.map((b, i) => {
        const delay = 6 + i * 8;
        const p = pop(frame, fps, delay, 26);
        return (
          <div
            key={`f${i}`}
            style={{
              position: 'absolute',
              left: 128 + b.d * 160,
              top: 96 + b.r * 56 + 4,
              width: 144,
              height: b.s * 56 - 8,
              boxSizing: 'border-box',
              borderRadius: 12,
              background: C.accent,
              padding: '12px 14px',
              fontSize: 24,
              fontWeight: 700,
              color: C.background,
              transform: `scaleY(${p})`,
              transformOrigin: 'top',
              opacity: ramp(frame, delay, delay + 8),
            }}
          >
            Focus
          </div>
        );
      })}
    </>
  );
};

const BAR_TARGETS = [140, 210, 170, 250, 320];
const BASELINE = 460;

const ProgressBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <div style={{ position: 'absolute', left: 48, top: 36, fontSize: 32, fontWeight: 600, color: C.foreground }}>
        Tasks completed
      </div>
      <div style={{ position: 'absolute', left: 48, top: 80, fontSize: 22, color: C.muted }}>This week</div>
      {BAR_TARGETS.map((h, i) => {
        const p = pop(frame, fps, 8 + i * 6, 30);
        const last = i === BAR_TARGETS.length - 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 120 + i * 152,
              top: BASELINE - h * p,
              width: 96,
              height: h * p,
              borderRadius: 12,
              background: last ? C.accent : C.secondary,
            }}
          />
        );
      })}
      <div style={{ position: 'absolute', left: 96, top: BASELINE, width: 768, height: 1, background: HAIRLINE }} />
      {DAY_LABELS.map((d, i) => (
        <div
          key={d}
          style={{
            position: 'absolute',
            left: 120 + i * 152,
            top: BASELINE + 16,
            width: 96,
            textAlign: 'center',
            fontSize: 22,
            color: C.muted,
          }}
        >
          {d}
        </div>
      ))}
    </>
  );
};

const FeatureScene: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const feature = FEATURES[index];
  const fade = ramp(frame, 0, 10) * ramp(frame, 50, 60, [1, 0]);
  const caption = pop(frame, fps, 2, 24);
  const heading = pop(frame, fps, 6, 26);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: fade }}>
      <div style={{ position: 'absolute', left: 80, top: 396, width: 680 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: C.accent,
            opacity: caption,
            transform: `translateY(${(1 - caption) * 20}px)`,
          }}
        >
          {feature.index} / 03
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            color: C.foreground,
            opacity: heading,
            transform: `translateY(${(1 - heading) * 36}px)`,
          }}
        >
          {feature.title}
        </div>
      </div>
      <ProgressDots active={index} />
      <Shell title={feature.header}>
        {index === 0 && <PlanBoard />}
        {index === 1 && <FocusBoard />}
        {index === 2 && <ProgressBoard />}
      </Shell>
    </AbsoluteFill>
  );
};

const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line1 = pop(frame, fps, 0, 28);
  const line2 = pop(frame, fps, 8, 28);
  const rule = ramp(frame, 18, 40);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 80,
        textAlign: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontSize: 112,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          color: C.foreground,
          opacity: line1,
          transform: `translateY(${(1 - line1) * 40}px)`,
        }}
      >
        Start your next week
      </div>
      <div
        style={{
          fontSize: 112,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          color: C.accent,
          opacity: line2,
          transform: `translateY(${(1 - line2) * 40}px)`,
        }}
      >
        with Relay
      </div>
      <div
        style={{
          width: 240 * rule,
          height: 6,
          borderRadius: 3,
          background: C.secondary,
          margin: '48px 0 0',
        }}
      />
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        color: C.foreground,
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <Backdrop />
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <FeatureScene index={0} />
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <FeatureScene index={1} />
      </Sequence>
      <Sequence from={210} durationInFrames={60}>
        <FeatureScene index={2} />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <CloseScene />
      </Sequence>
    </AbsoluteFill>
  );
};