import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo';
const CLAMP = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const EASE_OUT = {...CLAMP, easing: Easing.out(Easing.cubic)};

const center: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: FONT,
  color: palette.foreground,
};

// Phrases hold through frames 0-74 of each 90-frame segment, then exit.
const fadeOut = (f: number) => interpolate(f, [74, 88], [1, 0], CLAMP);

const LessNoise: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w1 = spring({frame: Math.max(0, f - 4), fps, config: {damping: 200}});
  const w2 = spring({frame: Math.max(0, f - 12), fps, config: {damping: 200}});
  const tracking = interpolate(f, [0, 40], [60, -6], CLAMP);
  return (
    <AbsoluteFill style={{...center, opacity: fadeOut(f)}}>
      <div style={{fontSize: 210, fontWeight: 800, lineHeight: 1, letterSpacing: tracking}}>
        <span
          style={{
            display: 'inline-block',
            opacity: Math.min(1, w1),
            transform: `translateY(${(1 - w1) * 90}px)`,
          }}
        >
          Less
        </span>{' '}
        <span
          style={{
            display: 'inline-block',
            color: palette.accent,
            opacity: Math.min(1, w2),
            transform: `translateY(${(1 - w2) * 90}px)`,
          }}
        >
          noise.
        </span>
      </div>
    </AbsoluteFill>
  );
};

const MoreFocus: React.FC = () => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [0, 30], [22, 0], EASE_OUT);
  const scale = interpolate(f, [0, 30], [1.12, 1], EASE_OUT);
  const opacity = interpolate(f, [0, 10], [0, 1], CLAMP) * fadeOut(f);
  return (
    <AbsoluteFill style={{...center, opacity}}>
      <div
        style={{
          fontSize: 220,
          fontWeight: 800,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
        }}
      >
        More <span style={{color: palette.accent}}>focus.</span>
      </div>
    </AbsoluteFill>
  );
};

const BetterTogether: React.FC = () => {
  const f = useCurrentFrame();
  const wipe1 = interpolate(f, [0, 22], [0, 1], EASE_OUT);
  const wipe2 = interpolate(f, [14, 36], [0, 1], EASE_OUT);
  const lineStyle: React.CSSProperties = {
    fontSize: 170,
    fontWeight: 800,
    lineHeight: 1.25,
    whiteSpace: 'nowrap',
  };
  return (
    <AbsoluteFill style={{...center, opacity: fadeOut(f)}}>
      <div style={{...lineStyle, clipPath: `inset(0 ${(1 - wipe1) * 100}% 0 0)`}}>
        Better work,
      </div>
      <div
        style={{
          ...lineStyle,
          color: palette.accent,
          clipPath: `inset(0 ${(1 - wipe2) * 100}% 0 0)`,
        }}
      >
        together.
      </div>
    </AbsoluteFill>
  );
};

const MakeRoom: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = interpolate(f, [0, 22], [0, 1], EASE_OUT);
  const rule = interpolate(f, [16, 40], [0, 320], EASE_OUT);
  const relay = Math.min(1, spring({frame: Math.max(0, f - 30), fps, config: {damping: 200}}));
  return (
    <AbsoluteFill style={{...center}}>
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1.2,
          maxWidth: 1600,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        Make room for what matters.
      </div>
      <div style={{width: rule, height: 4, background: palette.secondary, margin: '44px 0 40px'}} />
      <div
        style={{
          fontSize: 240,
          fontWeight: 800,
          lineHeight: 1,
          color: palette.accent,
          opacity: relay,
          transform: `scale(${0.92 + 0.08 * relay})`,
        }}
      >
        Relay
      </div>
    </AbsoluteFill>
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
        <BetterTogether />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <MakeRoom />
      </Sequence>
    </AbsoluteFill>
  );
};
