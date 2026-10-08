import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame } from 'remotion';
import { palette } from './contract';

const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.background,
      backgroundImage: 'radial-gradient(ellipse at 50% 48%, rgba(120,185,237,0.075), transparent 60%)',
    }}
  />
);

const LessNoise: React.FC = () => {
  const frame = useCurrentFrame();
  const entrance = spring({ frame, fps: 30, config: { damping: 19, stiffness: 105 } });
  const opacity = interpolate(frame, [0, 8, 82, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tracesOpacity = interpolate(frame, [0, 4, 26, 38], [0, 0.48, 0.25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: i < 4 ? 250 + i * 64 : 1375 + (i - 4) * 64,
            top: 370 + (i % 4) * 42,
            width: 26 + (i % 3) * 15,
            height: 2,
            borderRadius: 2,
            backgroundColor: i % 2 === 0 ? palette.secondary : palette.muted,
            opacity: tracesOpacity,
            transform: `translateX(${i < 4 ? frame * 2.5 : -frame * 2.5}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: `translateY(${(1 - entrance) * 34}px) scale(${0.94 + entrance * 0.06})`,
        }}
      >
        <div
          style={{
            color: palette.foreground,
            fontFamily: 'Archivo',
            fontSize: 156,
            fontWeight: 700,
            letterSpacing: '-6px',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Less noise.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 238,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(177,180,188,0.25), transparent)',
          opacity: tracesOpacity * 0.65,
        }}
      />
    </AbsoluteFill>
  );
};

const MoreFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const leftSpring = spring({ frame, fps: 30, config: { damping: 20, stiffness: 90 } });
  const rightSpring = spring({ frame, fps: 30, config: { damping: 20, stiffness: 90 } });
  const opacity = interpolate(frame, [0, 10, 84, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringScale = interpolate(frame, [0, 24, 50], [0.78, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          left: 700,
          top: 280,
          borderRadius: '50%',
          border: `1px solid ${palette.secondary}30`,
          transform: `scale(${ringScale})`,
          opacity: interpolate(frame, [0, 18, 72, 90], [0, 0.5, 0.5, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 38,
          opacity,
        }}
      >
        <span
          style={{
            color: palette.foreground,
            fontFamily: 'Archivo',
            fontSize: 150,
            fontWeight: 600,
            letterSpacing: '-5px',
            transform: `translateX(${(1 - leftSpring) * 180}px)`,
          }}
        >
          More
        </span>
        <span
          style={{
            color: palette.accent,
            fontFamily: 'Archivo',
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: '-5px',
            transform: `translateX(${(1 - rightSpring) * -180}px)`,
          }}
        >
          focus.
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 774,
          left: 800,
          width: 320,
          height: 3,
          backgroundColor: palette.accent,
          borderRadius: 3,
          transform: `scaleX(${interpolate(frame, [8, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          transformOrigin: 'center',
          opacity: opacity * 0.8,
        }}
      />
    </AbsoluteFill>
  );
};

const BetterTogether: React.FC = () => {
  const frame = useCurrentFrame();
  const firstSpring = spring({ frame, fps: 30, config: { damping: 18, stiffness: 100 } });
  const secondSpring = spring({ frame: Math.max(0, frame - 7), fps: 30, config: { damping: 18, stiffness: 100 } });
  const exitOpacity = interpolate(frame, [0, 82, 90], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underline = interpolate(frame, [12, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          opacity: exitOpacity,
        }}
      >
        <div
          style={{
            color: palette.foreground,
            fontFamily: 'Archivo',
            fontSize: 128,
            lineHeight: 1.12,
            fontWeight: 600,
            letterSpacing: '-5px',
            transform: `translateY(${(1 - firstSpring) * 52}px)`,
          }}
        >
          Better work,
        </div>
        <div
          style={{
            color: palette.accent,
            fontFamily: 'Archivo',
            fontSize: 128,
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: '-5px',
            transform: `translateY(${(1 - secondSpring) * 52}px)`,
          }}
        >
          together.
        </div>
        <div
          style={{
            width: 360,
            height: 3,
            marginTop: 33,
            borderRadius: 3,
            backgroundColor: palette.secondary,
            transform: `scaleX(${underline})`,
            transformOrigin: 'center',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const FinalMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phraseOpacity = interpolate(frame, [0, 8, 24], [0, 0.65, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const relayOpacity = interpolate(frame, [7, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 18,
        }}
      >
        <div
          style={{
            color: palette.foreground,
            fontFamily: 'Archivo',
            fontSize: 108,
            fontWeight: 600,
            letterSpacing: '-4px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            opacity: phraseOpacity,
            transform: `translateY(${(1 - reveal) * 22}px)`,
          }}
        >
          Make room for what matters.
        </div>
        <div
          style={{
            width: 112,
            height: 3,
            marginTop: 38,
            marginBottom: 28,
            borderRadius: 3,
            backgroundColor: palette.secondary,
            transform: `scaleX(${reveal})`,
          }}
        />
        <div
          style={{
            color: palette.accent,
            fontFamily: 'Archivo',
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '-1px',
            lineHeight: 1,
            opacity: relayOpacity,
            transform: `translateY(${(1 - reveal) * 12}px)`,
          }}
        >
          Relay
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.background, fontFamily: 'Archivo' }}>
    <Backdrop />
    <Sequence from={0} durationInFrames={90}>
      <LessNoise />
    </Sequence>
    <Sequence from={90} durationInFrames={90}>
      <MoreFocus />
    </Sequence>
    <Sequence from={180} durationInFrames={90}>
      <BetterTogether />
    </Sequence>
    <Sequence from={270} durationInFrames={90}>
      <FinalMessage />
    </Sequence>
  </AbsoluteFill>
);
