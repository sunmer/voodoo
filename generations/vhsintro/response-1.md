FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const vhsintroMeta: TemplateMeta = {
  id: 'vhsintro',
  name: 'VHS Intro',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 160,
  motion: ['Glitch', 'Slice'],
  scenes: [
    {type: 'transition', from: 0, duration: 40, focus: 12, roles: []},
    {type: 'date-card', from: 24, duration: 156, focus: 24, roles: ['date']},
    {type: 'title-reveal', from: 54, duration: 126, focus: 70, roles: ['headline']},
    {type: 'logo-lockup', from: 84, duration: 96, focus: 30, roles: ['brand']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const vhsintroSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date'] as const),
  theme: themeSchema,
});

export type VhsintroProps = z.infer<typeof vhsintroSchema>;
```

FILE: Vhsintro.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, useCurrentFrame} from 'remotion';
import type {Theme} from '../contract';
import {Grain, Vignette, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, loadTemplateFonts} from '../shared/fonts';
import {vhsintroMeta} from './meta';
import type {VhsintroProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
// Global frame after which nothing jitters (final second is stable).
const STABLE = 150;
const SHADOW = '3px 3px 0 rgba(0,0,0,0.55)';

type SP = VhsintroProps & {from: number};

const pad = (n: number) => String(n).padStart(2, '0');
const timecode = (g: number) => `0:00:${pad(Math.floor(g / 30))}:${pad(g % 30)}`;

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => (
  <AbsoluteFill
    style={{background: `radial-gradient(ellipse at 50% 55%, ${theme.surface} 0%, ${theme.background} 72%)`}}
  />
);

// Scene 1: tracking noise and rolling horizontal bands.
const SceneTracking: React.FC<SP> = ({theme}) => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 2);
  const fade = interpolate(frame, [22, 40], [1, 0], clamp);
  const bars = Array.from({length: 56}, (_, i) => {
    const r = (k: string) => random(`trk-${tick}-${i}-${k}`);
    return {
      y: r('y') * H,
      h: 1 + r('h') ** 2 * 26,
      x: r('x') * W - 300,
      w: 120 + r('w') * 1400,
      o: 0.15 + r('o') * 0.75,
      c: r('c'),
    };
  });
  const bands = [0, 1, 2].map((i) => ((frame * 34 + i * 480) % 1500) - 300);
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <AbsoluteFill style={{background: theme.background}} />
      {bands.map((y, i) => (
        <div
          key={`b${i}`}
          style={{
            position: 'absolute',
            left: -40,
            right: -40,
            top: y,
            height: 160 + i * 40,
            background: `linear-gradient(180deg, transparent, ${theme.foreground}33 40%, ${theme.foreground}55 52%, transparent)`,
            transform: `skewY(${i % 2 ? -0.6 : 0.4}deg)`,
          }}
        />
      ))}
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            opacity: b.o,
            background: b.c > 0.92 ? theme.accent : b.c > 0.84 ? theme.accent2 : theme.foreground,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: -80,
          right: -80,
          top: H - 170 + Math.sin(frame * 0.7) * 40,
          height: 70,
          background: `repeating-linear-gradient(90deg, ${theme.foreground}66 0 3px, transparent 3px 9px)`,
          transform: `translateX(${(random(`tear-${tick}`) - 0.5) * 120}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const PlayIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.55))'}}>
    <path d="M5 3l16 9-16 9z" fill={color} />
  </svg>
);

// Scene 2: blue-screen flash, then the PLAY overlay with a blinking timecode.
const SceneDate: React.FC<SP> = ({texts, theme, from}) => {
  const frame = useCurrentFrame();
  const g = frame + from;
  const flash = interpolate(frame, [10, 18], [1, 0], clamp);
  const panelIn = interpolate(frame, [4, 14], [0, 1], {...clamp, easing: easeOut});
  const blink = g >= STABLE || Math.floor(frame / 12) % 2 === 0 ? 1 : 0.3;
  const date = texts.date.toUpperCase();
  const dateSize = fit(date, 40, 700, 0.62);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: theme.surface, opacity: flash}} />
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 64,
          maxWidth: 780,
          padding: '22px 30px 24px',
          background: `${theme.surface}d9`,
          borderLeft: `8px solid ${theme.accent}`,
          fontFamily: MONO_FONT,
          color: theme.foreground,
          textShadow: SHADOW,
          opacity: panelIn,
          transform: `translateX(${(1 - panelIn) * -30}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 64, fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1}}>
          <span>PLAY</span>
          <span style={{opacity: blink, display: 'flex'}}>
            <PlayIcon size={54} color={theme.foreground} />
          </span>
        </div>
        <div style={{opacity: blink, display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{fontSize: dateSize, fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap'}}>
            <span data-text-role={'date'} style={{display: 'contents'}}>{date}</span>
          </div>
          <div style={{fontSize: 34, fontWeight: 600, lineHeight: 1.1, color: theme.accent2, whiteSpace: 'nowrap'}}>
            SP {timecode(g)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: chunky italic headline with chromatic aberration, jitter, then stability.
const SceneHeadline: React.FC<SP> = ({texts, theme, from}) => {
  const frame = useCurrentFrame();
  const g = frame + from;
  const text = texts.headline.toUpperCase();
  const width = 1560;
  const size = wrapFit(text, 210, width, 2, 0.7, 60);
  const settle = interpolate(frame, [0, 64], [1, 0], {...clamp, easing: easeOut});
  const spike = frame < 70 && random(`spk-${frame}`) > 0.82 ? 0.5 : 0;
  const amp = g >= STABLE ? 0 : Math.min(1, settle + spike * settle + spike * 0.2 * (frame < 70 ? 1 : 0));
  const jx = (random(`jx-${frame}`) - 0.5) * 2 * 26 * amp;
  const jy = (random(`jy-${frame}`) - 0.5) * 8 * amp;
  const split = 3 + 30 * amp;
  const power = interpolate(frame, [0, 7], [0.02, 1], {...clamp, easing: easeOut});
  const flicker = frame < 10 ? (random(`hf-${frame}`) > 0.4 ? 1 : 0.25) : 1;
  const slice = amp > 0.15 && random(`sl-${frame}`) > 0.45;
  const sTop = random(`st-${frame}`) * 75;
  const sH = 6 + random(`sh-${frame}`) * 18;
  const sShift = (random(`sx-${frame}`) - 0.5) * 180 * amp;
  const bar = interpolate(frame, [56, 90], [0, 1], {...clamp, easing: easeOut});

  const copy = (color: string, extra: React.CSSProperties = {}) => (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.98,
        textAlign: 'center',
        color,
        ...extra,
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 46,
          opacity: flicker,
          transform: `translate(${jx}px, ${jy}px) scaleY(${power})`,
        }}
      >
        <div style={{position: 'relative', width, transform: 'skewX(-11deg)'}}>
          {copy(theme.accent, {transform: `translateX(${-split}px)`, opacity: 0.9, zIndex: 1})}
          {copy(theme.accent2, {transform: `translateX(${split}px)`, opacity: 0.9, zIndex: 1})}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width,
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 0.98,
              textAlign: 'center',
              color: theme.foreground,
            }}
          >
            <span data-text-role={'headline'} style={{display: 'contents'}}>{text}</span>
          </div>
          {slice
            ? copy(theme.foreground, {
                zIndex: 3,
                clipPath: `inset(${sTop}% 0 ${Math.max(0, 100 - sTop - sH)}% 0)`,
                transform: `translateX(${sShift}px)`,
                textShadow: `${-split}px 0 0 ${theme.accent}, ${split}px 0 0 ${theme.accent2}`,
              })
            : null}
        </div>
        <div style={{display: 'flex', gap: 14, transform: 'skewX(-11deg)'}}>
          <div style={{width: 420 * bar, height: 14, background: theme.accent}} />
          <div style={{width: 220 * bar, height: 14, background: theme.accent2}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: brand as a channel bug in the top right.
const SceneBrand: React.FC<SP> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const on = frame < 12 ? (random(`bb-${frame}`) > 0.5 ? 1 : 0.15) : 1;
  const size = fit(texts.brand, 46, 440, 0.66);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '14px 24px',
          border: `3px solid ${theme.foreground}88`,
          borderRadius: 14,
          opacity: on * 0.88,
        }}
      >
        <div style={{width: 18, height: 18, borderRadius: 9, background: theme.accent, boxShadow: `0 0 14px ${theme.accent}`}} />
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1,
            color: theme.foreground,
            textShadow: SHADOW,
            transform: 'skewX(-11deg)',
            whiteSpace: 'nowrap',
          }}
        >
          <span data-text-role={'brand'} style={{display: 'contents'}}>{texts.brand}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WARPS = Array.from({length: 6}, (_, k) => ({
  start: 30 + Math.floor(random(`ws-${k}`) * 96),
  y0: random(`wy-${k}`) * 680,
  len: 14 + Math.floor(random(`wl-${k}`) * 10),
  h: 4 + random(`wh-${k}`) * 10,
  off: (random(`wo-${k}`) - 0.5) * 300,
}));

const WarpLines: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  if (frame >= STABLE) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {WARPS.map((w, k) => {
        const t = (frame - w.start) / w.len;
        if (t < 0 || t > 1) return null;
        const y = w.y0 + t * 380;
        const o = Math.sin(Math.PI * t);
        return (
          <React.Fragment key={k}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: y,
                height: w.h,
                opacity: o,
                background: `linear-gradient(90deg, transparent, ${theme.foreground}aa 30%, ${theme.foreground}66 70%, transparent)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: y + w.h + 3,
                height: Math.max(2, w.h * 0.4),
                opacity: o * 0.8,
                transform: `translateX(${w.off}px)`,
                background: `linear-gradient(90deg, transparent 20%, ${theme.accent2}99 50%, transparent 80%)`,
              }}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// Head-switching noise along the bottom edge; freezes once stable.
const HeadSwitch: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const tick = Math.floor(Math.min(frame, STABLE) / 2);
  const shift = frame >= STABLE ? 0 : (random(`hs-${tick}`) - 0.5) * 60;
  return (
    <div
      style={{
        position: 'absolute',
        left: -60,
        right: -60,
        bottom: 0,
        height: 18,
        opacity: 0.45,
        transform: `translateX(${shift}px)`,
        background: `repeating-linear-gradient(90deg, ${theme.foreground}77 0 2px, transparent 2px 7px, ${theme.foreground}33 7px 11px, transparent 11px 19px)`,
      }}
    />
  );
};

const Scanlines: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = frame >= STABLE ? 0 : (random(`scn-${frame}`) - 0.5) * 0.08;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: 0.85 + flick,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.24) 0 2px, transparent 2px 4px)',
      }}
    />
  );
};

// Scene timing lives in meta.ts so metadata and render always agree.
const SCENES: React.FC<SP>[] = [SceneTracking, SceneDate, SceneHeadline, SceneBrand];

export const Vhsintro: React.FC<VhsintroProps> = (props) => (
  <AbsoluteFill style={{background: props.theme.background, overflow: 'hidden'}}>
    <Backdrop theme={props.theme} />
    {vhsintroMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} from={s.from} />
        </Sequence>
      );
    })}
    <WarpLines theme={props.theme} />
    <HeadSwitch theme={props.theme} />
    <Scanlines />
    <Vignette />
    <Grain />
  </AbsoluteFill>
);
```