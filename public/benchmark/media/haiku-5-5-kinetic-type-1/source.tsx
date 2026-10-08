import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SOFT = {damping: 200};

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.background,
      color: palette.foreground,
      fontFamily: FONT,
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);

const Center: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      flex: 1,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

// Scene 1 (0-3s): "Less noise." slides in from opposite sides, blurs into focus, then tracks open and fades.
const LessNoise: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = interpolate(frame, [72, 88], [0, 1], CLAMP);
  const words = ['Less', 'noise.'];

  return (
    <Stage>
      <Center>
        <div
          style={{
            display: 'flex',
            gap: 44,
            fontSize: 200,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -6 + exit * 18,
            opacity: 1 - exit,
          }}
        >
          {words.map((word, i) => {
            const p = spring({frame: frame - i * 7, fps, config: SOFT});
            const from = i === 0 ? -160 : 160;
            return (
              <span
                key={word}
                style={{
                  display: 'inline-block',
                  transform: `translateX(${(1 - p) * from}px)`,
                  opacity: p,
                  filter: `blur(${(1 - p) * 14}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </Center>
    </Stage>
  );
};

// Scene 2 (3-6s): "More focus." resolves from a zoom and blur, an accent rule draws beneath, then the frame compresses away.
const MoreFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: SOFT, durationInFrames: 30});
  const rule = interpolate(frame, [24, 50], [0, 1], CLAMP);
  const exit = interpolate(frame, [72, 88], [0, 1], CLAMP);

  return (
    <Stage>
      <Center>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            transform: `scaleY(${1 - exit * 0.94})`,
            opacity: 1 - exit,
          }}
        >
          <div
            style={{
              fontSize: 220,
              fontWeight: 800,
              lineHeight: 1,
              transform: `scale(${1.18 - 0.18 * p})`,
              filter: `blur(${(1 - p) * 18}px)`,
              opacity: p,
              transformOrigin: 'left center',
            }}
          >
            More focus.
          </div>
          <div
            style={{
              marginTop: 36,
              width: 1180,
              height: 10,
              backgroundColor: palette.secondary,
              transform: `scaleX(${rule})`,
              transformOrigin: 'left center',
            }}
          />
        </div>
      </Center>
    </Stage>
  );
};

// Word that rises from behind a mask edge.
const Reveal: React.FC<{word: string; delay: number; color: string}> = ({word, delay, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: SOFT});
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        paddingBottom: '0.12em',
        marginRight: '0.24em',
        verticalAlign: 'top',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${(1 - p) * 110}%)`,
          color,
        }}
      >
        {word}
      </span>
    </span>
  );
};

// Scene 3 (6-9s): "Better work, together." rises word by word in two lines; "together." takes the accent. Exits by lifting away.
const BetterWork: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [72, 88], [0, 1], CLAMP);

  return (
    <Stage>
      <Center>
        <div
          style={{
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: 'left',
            opacity: 1 - exit,
            transform: `translateY(${-exit * 140}px)`,
          }}
        >
          <div>
            <Reveal word="Better" delay={0} color={palette.foreground} />
            <Reveal word="work," delay={6} color={palette.foreground} />
          </div>
          <div>
            <Reveal word="together." delay={14} color={palette.accent} />
          </div>
        </div>
      </Center>
    </Stage>
  );
};

// Scene 4 (9-12s): "Make room for what matters." settles into a still frame, with the "Relay" wordmark arriving at the top-left.
// All motion completes within 36 frames so the final two seconds are static.
const MakeRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lineA = spring({frame, fps, config: SOFT, durationInFrames: 36});
  const lineB = spring({frame: frame - 6, fps, config: SOFT, durationInFrames: 36});
  const relayOpacity = interpolate(frame, [10, 34], [0, 1], CLAMP);
  const relayShift = interpolate(frame, [10, 34], [12, 0], CLAMP);

  return (
    <Stage>
      <Center>
        <div style={{position: 'absolute', top: 0, left: 0, opacity: relayOpacity, transform: `translateY(${relayShift}px)`}}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: palette.accent,
              lineHeight: 1,
            }}
          >
            Relay
          </div>
        </div>
        <div style={{fontSize: 150, fontWeight: 800, lineHeight: 1.1, display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              transform: `translateX(${(1 - lineA) * -180}px)`,
              opacity: lineA,
            }}
          >
            Make room for
          </div>
          <div
            style={{
              transform: `translateX(${(1 - lineB) * 180}px)`,
              opacity: lineB,
              color: palette.secondary,
            }}
          >
            what matters.
          </div>
        </div>
      </Center>
    </Stage>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.background}}>
      <Sequence from={0} durationInFrames={90}>
        <LessNoise />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <MoreFocus />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <BetterWork />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <MakeRoom />
      </Sequence>
    </AbsoluteFill>
  );
};
