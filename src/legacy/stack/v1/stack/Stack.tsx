import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, FONT, Grain, clamp, easeIn, easeInOut, easeOut} from '../shared/motion';
import {stackMeta} from './meta';
import type {StackProps} from './schema';

const W = 1080;
const PAD = 96;

// Find the largest font size where the text wraps into at most `lines` rows.
function wrapFit(text: string, max: number, width: number, lines = 3) {
  const words = text.split(' ');
  for (let size = max; size > 40; size -= 4) {
    const perLine = Math.floor(width / (size * 0.56));
    let rows = 1;
    let len = 0;
    let ok = true;
    for (const w of words) {
      if (w.length > perLine) ok = false;
      if (len && len + 1 + w.length > perLine) {
        rows += 1;
        len = w.length;
      } else len += (len ? 1 : 0) + w.length;
    }
    if (ok && rows <= lines) return size;
  }
  return 40;
}

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 240], [0, -320]);
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <div
        style={{
          position: 'absolute',
          inset: '-20% 0',
          transform: `translateY(${drift}px)`,
          backgroundImage: `repeating-linear-gradient(0deg, ${theme.foreground}12 0 2px, transparent 2px 160px)`,
        }}
      />
      <div style={{position: 'absolute', left: PAD - 40, top: 0, bottom: 0, width: 2, background: `${theme.foreground}1c`}} />
    </AbsoluteFill>
  );
};

// Words rise from behind a mask, one after another.
const MaskWords: React.FC<{text: string; size: number; color: string; accentLast?: string; delay?: number; center?: boolean}> = ({
  text,
  size,
  color,
  accentLast,
  delay = 0,
  center,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start', gap: `0 ${size * 0.26}px`, width: W - PAD * 2}}>
      {words.map((w, i) => {
        const y = interpolate(frame - delay - i * 4, [0, 22], [105, 0], {...clamp, easing: easeOut});
        return (
          <span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: size * 0.06}}>
            <span
              style={{
                display: 'inline-block',
                fontSize: size,
                fontWeight: 850,
                lineHeight: 1.02,
                color: accentLast && i === words.length - 1 ? accentLast : color,
                transform: `translateY(${y}%)`,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const SceneTitle: React.FC<StackProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = wrapFit(texts.headline, 190, W - PAD * 2);
  const tag = interpolate(frame, [4, 22], [0, 1], {...clamp, easing: easeOut});
  const block = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: easeInOut});
  const exit = interpolate(frame, [70, 90], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', transform: `translateY(${exit * -260}px)`, opacity: 1 - exit}}>
      <div style={{position: 'absolute', right: 0, top: 0, width: 300, height: 1920 * block, background: theme.accent2, opacity: 0.9}} />
      <div
        style={{
          alignSelf: 'flex-start',
          padding: '14px 26px',
          borderRadius: 999,
          border: `2px solid ${theme.foreground}`,
          color: theme.foreground,
          fontSize: 34,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          marginBottom: 56,
          opacity: tag,
          transform: `translateX(${(1 - tag) * -40}px)`,
        }}
      >
        <span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <span data-text-role={"headline"} style={{display: 'contents'}}><MaskWords text={texts.headline} size={size} color={theme.foreground} accentLast={theme.accent} delay={10} /></span>
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 20], [100, -100], {...clamp, easing: easeInOut});
  return <AbsoluteFill style={{background: theme.accent, transform: `translateY(${y}%)`}} />;
};

const SceneList: React.FC<StackProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  const exit = interpolate(frame, [68, 84], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 40, opacity: 1 - exit}}>
      {items.map((text, i) => {
        const s = spring({frame: frame - 6 - i * 9, fps, config: {damping: 15, stiffness: 110}});
        const bar = interpolate(frame - 12 - i * 9, [0, 26], [0, 1], {...clamp, easing: easeOut});
        const color = i === 1 ? theme.accent2 : theme.accent;
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              height: 300,
              borderRadius: 24,
              background: theme.surface,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              padding: '0 56px',
              transform: `translateX(${interpolate(s, [0, 1], [i % 2 ? 1100 : -1100, 0]) + exit * (i % 2 ? -1200 : 1200)}px)`,
            }}
          >
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, background: `${color}22`}} />
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: color}} />
            <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 64, fontWeight: 700, color, zIndex: 1}}>0{i + 1}</div>
            <div style={{fontSize: Math.min(92, 700 / (Math.max(text.length, 1) * 0.56)), fontWeight: 800, color: theme.foreground, lineHeight: 1.05, zIndex: 1}}>
              <span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{text}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<StackProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const r = interpolate(frame, [0, 26], [0, 120], {...clamp, easing: easeInOut});
  const size = wrapFit(texts.brand, 200, W - PAD * 2, 2);
  const pill = spring({frame: frame - 26, fps, config: {damping: 12, stiffness: 140}});
  const spin = interpolate(frame, [0, 76], [0, 90]);
  return (
    <AbsoluteFill style={{background: theme.foreground, clipPath: `circle(${r}% at 50% 100%)`}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: 120,
          border: `3px solid ${theme.accent}`,
          transform: `rotate(${spin}deg)`,
          opacity: 0.35,
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 80, padding: PAD}}>
        <span data-text-role={"brand"} style={{display: 'contents'}}><MaskWords text={texts.brand} size={size} color={theme.background} delay={10} center /></span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '34px 60px',
            borderRadius: 999,
            background: theme.accent,
            color: theme.background,
            fontSize: 56,
            fontWeight: 800,
            transform: `scale(${pill})`,
          }}
        >
          <span data-text-role={"cta"} style={{display: 'contents'}}>{texts.cta}</span>
          <ArrowIcon size={52} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene timing lives in meta.ts so the taxonomy and the render never disagree.
const SCENES: React.FC<StackProps>[] = [SceneTitle, ({theme}) => <Wipe theme={theme} />, SceneList, SceneLockup];

export const Stack: React.FC<StackProps> = (props) => (
  <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden'}}>
    <Backdrop theme={props.theme} />
    {stackMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
    <Grain />
  </AbsoluteFill>
);
