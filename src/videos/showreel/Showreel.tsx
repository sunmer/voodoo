import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, FONT, Grain, KineticLine, Vignette, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {showreelMeta} from './meta';
import type {ShowreelProps} from './schema';

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const shift = (frame * 2.4) % 120;
  const glowX = interpolate(frame, [0, 300], [28, 72]);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% 38%, ${theme.surface} 0%, ${theme.background} 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-50%',
          right: '-50%',
          top: '48%',
          height: '110%',
          transform: 'perspective(700px) rotateX(70deg)',
          transformOrigin: '50% 0%',
          backgroundImage: `linear-gradient(${theme.foreground}1f 2px, transparent 2px), linear-gradient(90deg, ${theme.foreground}1f 2px, transparent 2px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: `0 ${shift}px`,
          maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 55%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 25%, black 55%, transparent)',
        }}
      />
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const panel = (lag: number, color: string) => {
    const x = interpolate(frame - lag, [0, 24], [-130, 130], {...clamp, easing: easeInOut});
    return (
      <div
        style={{
          position: 'absolute',
          inset: '-20% -10%',
          background: color,
          transform: `translateX(${x}%) skewX(-14deg)`,
        }}
      />
    );
  };
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {panel(0, theme.accent2)}
      {panel(4, theme.accent)}
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<ShowreelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = fit(texts.headline, 210, 1600, 0.6);
  const line = interpolate(frame, [2, 22], [0, 140], {...clamp, easing: easeOut});
  const label = interpolate(frame, [10, 28], [0, 1], {...clamp, easing: easeOut});
  const bar = interpolate(frame, [24, 50], [0, 100], {...clamp, easing: easeOut});
  const exit = interpolate(frame, [70, 88], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateY(${exit * -90}px) scale(${1 + exit * 0.08})`,
        opacity: 1 - exit,
        filter: `blur(${exit * 10}px)`,
      }}
    >
      <div style={{position: 'absolute', top: 110, left: 140, display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: line, height: 4, background: theme.accent}} />
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: theme.foreground,
            opacity: label,
            transform: `translateX(${(1 - label) * -30}px)`,
          }}
        >
          {texts.brand}
        </div>
      </div>
      <KineticLine text={texts.headline} size={size} color={theme.foreground} delay={8} />
      <div style={{width: Math.min(1600, size * texts.headline.length * 0.6), marginTop: 30}}>
        <div
          style={{
            width: `${bar}%`,
            height: 16,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const ScenePillars: React.FC<ShowreelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 60,
          whiteSpace: 'nowrap',
          fontSize: 260,
          fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: `2px ${theme.foreground}26`,
          transform: `translateX(${200 - frame * 7}px)`,
        }}
      >
        {`${texts.brand} ${texts.brand} ${texts.brand} ${texts.brand}`}
      </div>
      <div style={{display: 'flex', gap: 48, perspective: 1600, marginTop: 120}}>
        {lines.map((text, i) => {
          const color = i === 1 ? theme.accent2 : theme.accent;
          const s = spring({frame: frame - 4 - i * 7, fps, config: {damping: 16, stiffness: 90}});
          const out = interpolate(frame, [70 + i * 3, 88 + i * 3], [0, 1], {...clamp, easing: easeIn});
          const progress = interpolate(frame, [18 + i * 7, 60 + i * 7], [0, 100], {...clamp, easing: easeOut});
          const count = Math.round(interpolate(frame, [10 + i * 7, 45 + i * 7], [0, (i + 1) * 33], clamp));
          return (
            <div
              key={i}
              style={{
                width: 460,
                height: 520,
                borderRadius: 28,
                background: theme.surface,
                border: `1px solid ${theme.foreground}22`,
                borderTop: `4px solid ${color}`,
                padding: 44,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
                opacity: Math.min(1, s * 1.4),
                transform: `translateY(${interpolate(s, [0, 1], [220, 0]) - out * 1300}px) rotateY(${interpolate(s, [0, 1], [-70, 0])}deg) rotateZ(${out * (i - 1) * 8}deg)`,
              }}
            >
              <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 30, color}}>0{i + 1}</div>
              <div>
                <div style={{fontSize: 140, fontWeight: 850, color: theme.foreground, opacity: 0.12, lineHeight: 1}}>
                  {count}
                </div>
                <div style={{fontSize: fit(text, 64, 370, 0.58), fontWeight: 800, color: theme.foreground, lineHeight: 1.1}}>
                  {text}
                </div>
                <div style={{height: 6, background: `${theme.foreground}1a`, borderRadius: 3, marginTop: 28}}>
                  <div style={{width: `${progress}%`, height: '100%', borderRadius: 3, background: color}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneOrbit: React.FC<ShowreelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 45], [1.35, 1], {...clamp, easing: easeOut});
  const rings = [260, 370, 480];
  const words = texts.subhead.split(' ');
  const size = Math.min(84, 2400 / Math.max(texts.subhead.length, 1));
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${push})`}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}} viewBox="-960 -540 1920 1080">
        {rings.map((r, i) => {
          const c = 2 * Math.PI * r;
          const draw = interpolate(frame, [i * 5, 30 + i * 5], [c, 0], {...clamp, easing: easeOut});
          const angle = (((frame * (i % 2 ? -1.2 : 0.9)) + i * 70) * Math.PI) / 180;
          return (
            <g key={r}>
              <circle
                r={r}
                fill="none"
                stroke={`${theme.foreground}2e`}
                strokeWidth={2}
                strokeDasharray={c}
                strokeDashoffset={draw}
                transform={`rotate(${-90 + i * 40})`}
              />
              <circle
                cx={Math.cos(angle) * r}
                cy={Math.sin(angle) * r}
                r={i === 1 ? 16 : 11}
                fill={i === 1 ? theme.accent2 : theme.accent}
                opacity={interpolate(frame, [20 + i * 5, 30 + i * 5], [0, 1], clamp)}
              />
            </g>
          );
        })}
      </svg>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, gap: `0 ${size * 0.28}px`}}>
        {words.map((w, i) => {
          const y = interpolate(frame, [10 + i * 3, 30 + i * 3], [110, 0], {...clamp, easing: easeOut});
          return (
            <span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: 6}}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: size,
                  fontWeight: 750,
                  lineHeight: 1.15,
                  color: i === words.length - 1 ? theme.accent : theme.foreground,
                  transform: `translateY(${y}%)`,
                }}
              >
                {w}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<ShowreelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, 22], [0, 150], {...clamp, easing: easeInOut});
  const pill = spring({frame: frame - 30, fps, config: {damping: 12, stiffness: 140}});
  const size = fit(texts.brand, 230, 1500, 0.62);
  return (
    <AbsoluteFill style={{clipPath: `circle(${reveal}% at 50% 50%)`, background: theme.accent}}>
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame - 14 - i * 8, [0, 40], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 600,
              height: 600,
              marginLeft: -300,
              marginTop: -300,
              borderRadius: '50%',
              border: `3px solid ${theme.background}`,
              transform: `scale(${0.6 + p * 2.4})`,
              opacity: (1 - p) * 0.35,
            }}
          />
        );
      })}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50}}>
        <KineticLine text={texts.brand} size={size} color={theme.background} delay={12} stagger={1.4} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '24px 44px',
            borderRadius: 999,
            background: theme.background,
            color: theme.accent,
            fontSize: 44,
            fontWeight: 750,
            transform: `scale(${pill})`,
            opacity: Math.min(1, pill * 2),
          }}
        >
          {texts.cta}
          <ArrowIcon size={40} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene timing lives in meta.ts so the taxonomy and the render never disagree.
const SCENES: React.FC<ShowreelProps>[] = [
  SceneTitle,
  ({theme}) => <Wipe theme={theme} />,
  ScenePillars,
  SceneOrbit,
  SceneLockup,
];

export const Showreel: React.FC<ShowreelProps> = (props) => (
  <AbsoluteFill style={{background: props.theme.background, fontFamily: FONT, overflow: 'hidden'}}>
    <Backdrop theme={props.theme} />
    {showreelMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
