import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './contract';

const FONT = 'Archivo';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const baseText: React.CSSProperties = {
  fontFamily: FONT,
  color: palette.foreground,
  fontWeight: 800,
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

const centered: React.CSSProperties = {justifyContent: 'center', alignItems: 'center'};

const NoiseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = 'Less noise.';
  const exit = interpolate(frame, [80, 90], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const noiseFade = interpolate(frame, [0, 30], [1, 0], clamp);
  const bars = new Array(28).fill(0).map((_, i) => {
    const y = 90 + hash(i + 100) * 900;
    const w = 80 + hash(i + 200) * 420;
    const x = hash(i + 300) * 1920 - w / 2 + Math.sin(frame * 0.9 + i * 1.7) * 90;
    const h = 2 + Math.floor(hash(i + 400) * 5);
    const flick = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.7 + i * 2.3));
    const color = i % 5 === 0 ? palette.accent : i % 3 === 0 ? palette.secondary : palette.muted;
    return (
      <div
        key={i}
        style={{position: 'absolute', left: x, top: y, width: w, height: h, backgroundColor: color, opacity: noiseFade * flick * 0.45}}
      />
    );
  });
  return (
    <AbsoluteFill style={centered}>
      {bars}
      <div
        style={{
          ...baseText,
          display: 'flex',
          fontSize: 210,
          letterSpacing: '-0.03em',
          opacity: 1 - exit,
          transform: `translateY(${-exit * 40}px)`,
        }}
      >
        {text.split('').map((c, i) => {
          const local = frame - i * 1.2;
          const s = spring({frame: local, fps, config: {damping: 16, stiffness: 140, mass: 0.6}, durationInFrames: 20});
          const r = Math.max(0, 1 - s);
          const jx = (hash(i) - 0.5) * 560 * r + Math.sin(frame * 1.3 + i * 2) * 22 * r;
          const jy = (hash(i + 20) - 0.5) * 380 * r + Math.cos(frame * 1.7 + i) * 22 * r;
          const rot = (hash(i + 40) - 0.5) * 80 * r;
          const op = interpolate(local, [0, 6], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                transform: `translate(${jx}px, ${jy}px) rotate(${rot}deg)`,
                opacity: op,
                color: c === '.' ? palette.accent : palette.foreground,
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Corner: React.FC<{pos: 'tl' | 'tr' | 'bl' | 'br'; opacity: number}> = ({pos, opacity}) => {
  const size = 64;
  const t = 6;
  const style: React.CSSProperties = {position: 'absolute', width: size, height: size, opacity, borderColor: palette.secondary, borderStyle: 'solid', borderWidth: 0};
  if (pos === 'tl') Object.assign(style, {left: 0, top: 0, borderTopWidth: t, borderLeftWidth: t});
  if (pos === 'tr') Object.assign(style, {right: 0, top: 0, borderTopWidth: t, borderRightWidth: t});
  if (pos === 'bl') Object.assign(style, {left: 0, bottom: 0, borderBottomWidth: t, borderLeftWidth: t});
  if (pos === 'br') Object.assign(style, {right: 0, bottom: 0, borderBottomWidth: t, borderRightWidth: t});
  return <div style={style} />;
};

const FocusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const exit = interpolate(frame, [80, 90], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const blur = (1 - t) * 24 + exit * 16;
  const spacing = interpolate(t, [0, 1], [0.15, -0.02]);
  const scale = (0.92 + 0.08 * t) * (1 - exit * 0.04);
  const opacity = interpolate(frame, [0, 8], [0, 1], clamp) * (1 - exit);
  const b = interpolate(frame, [2, 30], [0, 1], {...clamp, easing: Easing.out(Easing.exp)});
  const off = (1 - b) * 160;
  const bracketOpacity = interpolate(frame, [0, 10], [0, 1], clamp) * (1 - exit);
  const boxW = 1480 + off * 2;
  const boxH = 340 + off * 2;
  return (
    <AbsoluteFill style={centered}>
      <div style={{position: 'absolute', width: boxW, height: boxH, left: (1920 - boxW) / 2, top: (1080 - boxH) / 2}}>
        <Corner pos='tl' opacity={bracketOpacity} />
        <Corner pos='tr' opacity={bracketOpacity} />
        <Corner pos='bl' opacity={bracketOpacity} />
        <Corner pos='br' opacity={bracketOpacity} />
      </div>
      <div
        style={{
          ...baseText,
          fontSize: 200,
          letterSpacing: `${spacing}em`,
          filter: `blur(${blur}px)`,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        More focus<span style={{color: palette.accent}}>.</span>
      </div>
    </AbsoluteFill>
  );
};

const TogetherScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 200}, durationInFrames: 26});
  const s2 = spring({frame: frame - 5, fps, config: {damping: 200}, durationInFrames: 26});
  const rule = interpolate(frame, [10, 32], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const exit = interpolate(frame, [80, 90], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const mask: React.CSSProperties = {overflow: 'hidden', paddingBottom: 18, paddingTop: 6};
  return (
    <AbsoluteFill style={centered}>
      <div
        style={{
          width: 1500,
          display: 'flex',
          flexDirection: 'column',
          opacity: 1 - exit,
          transform: `translateY(${-exit * 50}px)`,
        }}
      >
        <div style={{...mask, alignSelf: 'flex-start'}}>
          <div
            style={{
              ...baseText,
              fontSize: 170,
              letterSpacing: '-0.03em',
              transform: `translate(${(s1 - 1) * 120}px, ${(1 - s1) * 110}%)`,
            }}
          >
            Better work<span style={{color: palette.accent}}>,</span>
          </div>
        </div>
        <div style={{height: 4, width: '100%', backgroundColor: palette.secondary, opacity: 0.8, transform: `scaleX(${rule})`, margin: '18px 0'}} />
        <div style={{...mask, alignSelf: 'flex-end'}}>
          <div
            style={{
              ...baseText,
              fontSize: 170,
              letterSpacing: '-0.03em',
              transform: `translate(${(1 - s2) * 120}px, ${(s2 - 1) * 110}%)`,
            }}
          >
            together<span style={{color: palette.accent}}>.</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ['Make', 'room', 'for', 'what', 'matters.'];
  const gap = interpolate(frame, [6, 28], [0.06, 0.28], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const bar = interpolate(frame, [12, 28], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const relayOp = interpolate(frame, [14, 30], [0, 1], clamp);
  const relayY = interpolate(frame, [14, 30], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={centered}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...baseText, fontSize: 100, letterSpacing: '-0.02em', display: 'flex', columnGap: `${gap}em`}}>
          {words.map((w, i) => {
            const p = interpolate(frame, [i * 3, i * 3 + 16], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
            return (
              <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.14em', paddingTop: '0.04em'}}>
                <span style={{display: 'inline-block', transform: `translateY(${p * 115}%)`}}>
                  {w.endsWith('.') ? (
                    <>
                      {w.slice(0, -1)}
                      <span style={{color: palette.accent}}>.</span>
                    </>
                  ) : (
                    w
                  )}
                </span>
              </span>
            );
          })}
        </div>
        <div style={{display: 'flex', alignItems: 'center', marginTop: 80, gap: 22}}>
          <div style={{width: 64, height: 10, backgroundColor: palette.accent, transform: `scaleX(${bar})`, transformOrigin: 'right center'}} />
          <div
            style={{
              ...baseText,
              fontSize: 72,
              letterSpacing: '-0.01em',
              color: palette.accent,
              opacity: relayOp,
              transform: `translateY(${relayY}px)`,
            }}
          >
            Relay
          </div>
          <div style={{width: 64, height: 10, backgroundColor: palette.secondary, transform: `scaleX(${bar})`, transformOrigin: 'left center'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.background, fontFamily: FONT}}>
      <Sequence from={0} durationInFrames={90}>
        <NoiseScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <FocusScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <TogetherScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
