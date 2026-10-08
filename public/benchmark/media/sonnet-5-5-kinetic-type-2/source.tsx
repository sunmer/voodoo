import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { palette } from './contract';

const FONT = 'Archivo, sans-serif';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Chars: React.FC<{
  text: string;
  styleFor: (ch: string, i: number) => React.CSSProperties;
}> = ({ text, styleFor }) => (
  <>
    {text.split('').map((ch, i) => (
      <span
        key={i}
        style={{ display: 'inline-block', whiteSpace: 'pre', ...styleFor(ch, i) }}
      >
        {ch}
      </span>
    ))}
  </>
);

const centerStyle: React.CSSProperties = {
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: FONT,
  color: palette.foreground,
};

/* Scene 1: noise resolves into clarity */
const SceneLess: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = 'Less noise.';
  const exit = interpolate(frame, [78, 90], [1, 0], clamp);
  const exitY = interpolate(frame, [78, 90], [0, -40], { ...clamp, easing: Easing.in(Easing.cubic) });

  const progressFor = (i: number) =>
    spring({ frame: frame - i * 1.8, fps, config: { damping: 18, stiffness: 90, mass: 0.8 } });

  const ghosts = [0, 1, 2, 3];
  const quant = Math.floor(frame / 3);

  return (
    <AbsoluteFill style={{ ...centerStyle, opacity: exit, transform: `translateY(${exitY}px)` }}>
      {ghosts.map((g) => (
        <div
          key={g}
          style={{
            position: 'absolute',
            fontSize: 230,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            color: g % 2 === 0 ? palette.muted : palette.secondary,
            opacity: interpolate(frame, [0, 34], [0.28, 0], clamp),
          }}
        >
          <Chars
            text={text}
            styleFor={(_, i) => {
              const k = quant + g * 7;
              return {
                transform: `translate(${(rand(i + k, g + 1) - 0.5) * 110}px, ${(rand(i + k, g + 9) - 0.5) * 130}px) rotate(${(rand(i + k, g + 4) - 0.5) * 30}deg)`,
              };
            }}
          />
        </div>
      ))}
      <div
        style={{
          fontSize: 230,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
        }}
      >
        <Chars
          text={text}
          styleFor={(ch, i) => {
            const p = progressFor(i);
            const inv = 1 - p;
            return {
              color: ch === '.' ? palette.accent : palette.foreground,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              transform: `translate(${(rand(i, 2) - 0.5) * 240 * inv}px, ${(rand(i, 5) - 0.5) * 280 * inv}px) rotate(${(rand(i, 8) - 0.5) * 70 * inv}deg)`,
              filter: `blur(${inv * 10}px)`,
            };
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* Scene 2: focus pulls into sharpness */
const SceneFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [78, 90], [1, 0], clamp);
  const t = interpolate(frame, [0, 34], [0, 1], { ...clamp, easing: ease });
  const spacing = interpolate(t, [0, 1], [0.18, -0.02]);
  const blur = interpolate(t, [0, 1], [26, 0]);
  const scale = interpolate(t, [0, 1], [1.12, 1]);
  const boxW = interpolate(t, [0, 1], [1700, 1400]);
  const boxH = interpolate(t, [0, 1], [560, 340]);
  const bracketOpacity = interpolate(frame, [0, 10], [0, 1], clamp);
  const arm = 56;
  const bw = 6;

  const corner = (pos: React.CSSProperties, borders: React.CSSProperties) => (
    <div
      style={{
        position: 'absolute',
        width: arm,
        height: arm,
        borderColor: palette.accent,
        borderStyle: 'solid',
        borderWidth: 0,
        ...pos,
        ...borders,
      }}
    />
  );

  return (
    <AbsoluteFill style={{ ...centerStyle, opacity: exit, filter: `blur(${interpolate(frame, [78, 90], [0, 8], clamp)}px)` }}>
      <div
        style={{
          position: 'absolute',
          width: boxW,
          height: boxH,
          opacity: bracketOpacity,
        }}
      >
        {corner({ left: 0, top: 0 }, { borderTopWidth: bw, borderLeftWidth: bw })}
        {corner({ right: 0, top: 0 }, { borderTopWidth: bw, borderRightWidth: bw })}
        {corner({ left: 0, bottom: 0 }, { borderBottomWidth: bw, borderLeftWidth: bw })}
        {corner({ right: 0, bottom: 0 }, { borderBottomWidth: bw, borderRightWidth: bw })}
      </div>
      <div
        style={{
          fontSize: 190,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          letterSpacing: `${spacing}em`,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      >
        <span>More </span>
        <span style={{ color: palette.accent }}>focus.</span>
      </div>
    </AbsoluteFill>
  );
};

/* Scene 3: words converge from opposite sides */
const SceneTogether: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [78, 90], [1, 0], clamp);
  const a = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: ease });
  const b = interpolate(frame, [10, 40], [0, 1], { ...clamp, easing: ease });
  const line = interpolate(frame, [30, 56], [0, 1], { ...clamp, easing: ease });
  const exitShift = interpolate(frame, [78, 90], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  return (
    <AbsoluteFill style={{ ...centerStyle, opacity: exit }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            opacity: a,
            transform: `translateX(${(1 - a) * -170 + exitShift * 80}px)`,
          }}
        >
          Better work,
        </div>
        <div
          style={{
            width: 1100 * line,
            height: 8,
            background: palette.secondary,
            margin: '22px 0 14px',
            borderRadius: 4,
          }}
        />
        <div
          style={{
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            color: palette.accent,
            opacity: b,
            transform: `translateX(${(1 - b) * 170 - exitShift * 80}px)`,
          }}
        >
          together.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Scene 4: final message with wordmark, still from frame 300 */
const SceneFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const lineReveal = (delay: number) =>
    interpolate(frame, [delay, delay + 20], [0, 1], { ...clamp, easing: ease });
  const l1 = lineReveal(0);
  const l2 = lineReveal(8);
  const mark = interpolate(frame, [16, 30], [0, 1], { ...clamp, easing: ease });
  const rule = interpolate(frame, [10, 30], [0, 1], { ...clamp, easing: ease });

  const lineStyle = (p: number): React.CSSProperties => ({
    fontSize: 160,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.08,
    whiteSpace: 'nowrap',
    transform: `translateY(${(1 - p) * 110}%)`,
    opacity: p,
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: palette.foreground,
        justifyContent: 'center',
        paddingLeft: 160,
        paddingRight: 160,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: mark, transform: `translateY(${(1 - mark) * 16}px)` }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: palette.accent }} />
        <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: '0.04em', color: palette.accent }}>Relay</div>
      </div>
      <div style={{ width: 1600 * rule, height: 3, background: palette.muted, opacity: 0.4, margin: '36px 0 44px' }} />
      <div style={{ overflow: 'hidden', paddingBottom: 8 }}>
        <div style={lineStyle(l1)}>Make room for</div>
      </div>
      <div style={{ overflow: 'hidden', paddingBottom: 8 }}>
        <div style={lineStyle(l2)}>
          <span style={{ color: palette.secondary }}>what matters.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.min(frame, 300);
  const glowX = 50 + Math.sin(drift / 60) * 12;
  const glowY = 50 + Math.cos(drift / 75) * 10;
  const gridShift = (drift * 0.6) % 80;

  return (
    <AbsoluteFill style={{ background: palette.background, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${palette.secondary}22 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage: `linear-gradient(${palette.foreground} 1px, transparent 1px), linear-gradient(90deg, ${palette.foreground} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${gridShift}px ${gridShift}px`,
        }}
      />

      <Sequence from={0} durationInFrames={90}>
        <SceneLess />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <SceneFocus />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <SceneTogether />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <SceneFinal />
      </Sequence>

      <div
        style={{
          position: 'absolute',
          left: 160,
          bottom: 100,
          display: 'flex',
          gap: 14,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: i === Math.min(3, Math.floor(frame / 90)) ? 48 : 16,
              height: 8,
              borderRadius: 4,
              background: frame >= i * 90 ? palette.accent : palette.muted,
              opacity: frame >= i * 90 ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
