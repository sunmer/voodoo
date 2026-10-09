FILE: meta.ts
```ts
import type {TemplateMeta} from '../contract';

export const glitchMeta: TemplateMeta = {
  id: 'glitch',
  name: 'Glitch',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 150,
  motion: ['Glitch', 'Scramble', 'Slice', 'Typewriter'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 60, roles: ['brand', 'headline']},
    {type: 'date-card', from: 70, duration: 110, focus: 50, roles: ['date']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const glitchSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date'] as const),
  theme: themeSchema,
});

export type GlitchProps = z.infer<typeof glitchSchema>;
```

FILE: Glitch.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, useCurrentFrame} from 'remotion';
import type {Theme} from '../contract';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, loadTemplateFonts} from '../shared/fonts';
import {glitchMeta} from './meta';
import type {GlitchProps} from './schema';

const W = 1920;
const H = 1080;
const BOX = 1560;
const CHARS = 'ABCDEFGHJKLMNPRSTUVXYZ0123456789#%&@$/<>';
const pick = (seed: string) => CHARS[Math.floor(random(seed) * CHARS.length)];

// Deterministic, irregular burst windows. The last one ends well before the final frame.
type Burst = {start: number; len: number; power: number};
const BURSTS: Burst[] = [
  {start: 10, len: 14, power: 1},
  ...Array.from({length: 6}, (_, k) => {
    const i = k + 1;
    return {
      start: 26 + (i - 1) * 17 + Math.floor(random(`glitch-start-${i}`) * 9),
      len: 2 + Math.floor(random(`glitch-len-${i}`) * 5),
      power: 0.9 - i * 0.1,
    };
  }),
];

function amp(g: number) {
  for (const b of BURSTS) {
    if (g >= b.start && g < b.start + b.len) {
      const decay = 1 - ((g - b.start) / b.len) * 0.5;
      const flick = random(`flick-${g}`) > 0.2 ? 1 : 0.4;
      return b.power * decay * flick;
    }
  }
  return 0;
}

function scramble(text: string, g: number, seed: string, start: number, a: number) {
  const step = Math.floor(g / 2);
  return [...text]
    .map((ch, i) => {
      if (ch === ' ') return ch;
      const settle = start + 4 + i * 0.9 + random(`${seed}-settle-${i}`) * 14;
      if (g < settle) return pick(`${seed}-${i}-${step}`);
      if (a > 0.35 && random(`${seed}-burst-${i}-${step}`) < a * 0.35) return pick(`${seed}-b-${i}-${step}`);
      return ch;
    })
    .join('');
}

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => {
  const g = useCurrentFrame();
  const scanY = ((g * 9) % 1400) - 200;
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 48%, ${theme.accent2}26 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-80px 0 0 0',
          transform: `translateY(${(g * 0.6) % 80}px)`,
          backgroundImage: `linear-gradient(${theme.foreground}12 1px, transparent 1px), linear-gradient(90deg, ${theme.foreground}12 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 160,
          background: `linear-gradient(180deg, transparent, ${theme.accent}1f 70%, ${theme.accent}55 98%, transparent)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 4px)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

const Corner: React.FC<{color: string; pos: React.CSSProperties; sides: string[]}> = ({color, pos, sides}) => (
  <div
    style={{
      position: 'absolute',
      width: 72,
      height: 72,
      ...pos,
      ...Object.fromEntries(sides.map((s) => [`border${s}`, `3px solid ${color}`])),
    }}
  />
);

const Hud: React.FC<{theme: Theme}> = ({theme}) => {
  const g = useCurrentFrame();
  const intro = interpolate(g, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const sec = Math.floor(g / 30);
  const ff = String(g % 30).padStart(2, '0');
  const m = 48 + (1 - intro) * 40;
  return (
    <AbsoluteFill style={{opacity: intro, fontFamily: MONO_FONT}}>
      <div style={{position: 'absolute', inset: m, border: `1px solid ${theme.foreground}22`}} />
      <Corner color={theme.accent} pos={{left: m, top: m}} sides={['Top', 'Left']} />
      <Corner color={theme.accent} pos={{right: m, top: m}} sides={['Top', 'Right']} />
      <Corner color={theme.accent} pos={{left: m, bottom: m}} sides={['Bottom', 'Left']} />
      <Corner color={theme.accent} pos={{right: m, bottom: m}} sides={['Bottom', 'Right']} />
      <div style={{position: 'absolute', right: 100, top: 96, fontSize: 24, letterSpacing: '0.18em', color: `${theme.foreground}99`}}>
        00:00:0{sec}:{ff}
      </div>
      <div style={{position: 'absolute', right: 100, bottom: 96, display: 'flex', alignItems: 'flex-end', gap: 6, height: 40}}>
        {Array.from({length: 14}, (_, i) => {
          const h = 8 + random(`meter-${i}-${Math.floor(g / 3)}`) * 32;
          return <div key={i} style={{width: 6, height: h, background: i > 10 ? theme.accent : theme.accent2, opacity: 0.8}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 64, top: 300, bottom: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        {Array.from({length: 13}, (_, i) => (
          <div key={i} style={{width: i % 4 === 0 ? 26 : 12, height: 2, background: `${theme.foreground}55`}} />
        ))}
      </div>
      <div style={{position: 'absolute', right: 64, top: 300, bottom: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        {Array.from({length: 13}, (_, i) => (
          <div key={i} style={{width: i % 4 === 0 ? 26 : 12, height: 2, background: `${theme.foreground}55`}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Full-frame burst debris: block noise and tear bars, driven by the global frame.
const Noise: React.FC<{theme: Theme}> = ({theme}) => {
  const g = useCurrentFrame();
  const a = amp(g);
  if (a <= 0) return null;
  const colors = [theme.accent, theme.accent2, theme.foreground];
  const blocks = Math.floor(a * 16);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: blocks}, (_, k) => {
        const r = (s: string) => random(`blk-${s}-${g}-${k}`);
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 110 + r('x') * 1700,
              top: 240 + r('y') * 560,
              width: 40 + r('w') * 280,
              height: 6 + r('h') * 42,
              background: colors[Math.floor(r('c') * 3)],
              opacity: 0.55 + r('o') * 0.4,
            }}
          />
        );
      })}
      {Array.from({length: 3}, (_, k) => (
        <div
          key={`t${k}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: random(`tear-y-${g}-${k}`) * H,
            height: 3 + random(`tear-h-${g}-${k}`) * 18,
            background: k % 2 ? theme.accent2 : theme.accent,
            opacity: a * 0.45,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const BANDS = 9;

const SceneTitle: React.FC<GlitchProps & {offset: number}> = ({texts, theme, offset}) => {
  const g = useCurrentFrame() + offset;
  const a = amp(g);
  const size = wrapFit(texts.headline.toUpperCase(), 200, BOX, 2, 0.72, 40);
  const shown = scramble(texts.headline, g, 'hl', 10, a);
  const visible = g < 10 ? 0 : g < 24 ? (random(`hl-vis-${g}`) > 0.3 ? 1 : 0.25) : 1;

  const layer = (color: string, style: React.CSSProperties = {}) => (
    <div
      style={{
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        textAlign: 'center',
        color,
        width: BOX,
        ...style,
      }}
    >
      {shown}
    </div>
  );

  const split = a * 26;
  const brandChars = Math.floor(interpolate(g, [4, 22], [0, texts.brand.length], clamp));
  const brandSize = fit(texts.brand, 30, 520, 0.82);
  const blink = Math.floor(g / 8) % 2 === 0;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 104, top: 92, display: 'flex', alignItems: 'stretch', opacity: g < 4 ? 0 : 1}}>
        <div style={{width: 10, background: theme.accent}} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '12px 22px',
            background: `${theme.surface}e6`,
            border: `1px solid ${theme.accent}55`,
            borderLeft: 'none',
            fontFamily: MONO_FONT,
            fontSize: brandSize,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme.foreground,
            whiteSpace: 'pre',
          }}
        >
          <div style={{width: 14, height: 14, background: theme.accent2, opacity: blink ? 1 : 0.3}} />
          <span data-text-role="brand" style={{display: 'contents'}}>
            {texts.brand.slice(0, brandChars)}
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 170,
          bottom: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: visible,
        }}
      >
        <span data-text-role="headline" style={{display: 'contents'}}>
          <div style={{position: 'relative', width: BOX}}>
            {layer(theme.foreground, {visibility: 'hidden'})}
            {a > 0 && (
              <>
                <div style={{position: 'absolute', inset: 0, transform: `translateX(${-split}px)`, opacity: 0.85}}>{layer(theme.accent)}</div>
                <div style={{position: 'absolute', inset: 0, transform: `translateX(${split}px) translateY(${a * 4}px)`, opacity: 0.85}}>
                  {layer(theme.accent2)}
                </div>
              </>
            )}
            {Array.from({length: BANDS}, (_, b) => {
              const top = (b / BANDS) * 100;
              const bottom = 100 - ((b + 1) / BANDS) * 100;
              const shift =
                a > 0 && random(`slice-${b}-${g}`) < 0.5 ? (random(`sx-${b}-${g}`) - 0.5) * 2 * a * 150 : 0;
              return (
                <div
                  key={b}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: `inset(${top}% -20% ${bottom}% -20%)`,
                    transform: `translateX(${shift}px)`,
                  }}
                >
                  {layer(theme.foreground)}
                </div>
              );
            })}
          </div>
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SceneDate: React.FC<GlitchProps & {offset: number}> = ({texts, theme, offset}) => {
  const f = useCurrentFrame();
  const g = f + offset;
  const a = amp(g);
  const open = interpolate(f, [0, 10], [0, 1], {...clamp, easing: easeOut});
  const typed = Math.max(0, Math.min(texts.date.length, Math.floor(f - 10)));
  const size = fit(texts.date, 44, 1100, 0.62);
  const cursorOn = Math.floor(f / 9) % 2 === 0;
  const jitter = a > 0 ? (random(`date-j-${g}`) - 0.5) * a * 40 : 0;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 170, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '20px 34px',
            background: `${theme.surface}d9`,
            border: `2px solid ${theme.accent2}88`,
            fontFamily: MONO_FONT,
            fontSize: size,
            fontWeight: 600,
            color: theme.foreground,
            whiteSpace: 'pre',
            transform: `scaleX(${open}) translateX(${jitter}px)`,
            transformOrigin: '50% 50%',
            minHeight: size * 1.3,
          }}
        >
          <span style={{color: theme.accent, fontWeight: 800}}>&gt;</span>
          <span data-text-role="date" style={{display: 'contents'}}>
            {texts.date.slice(0, typed)}
          </span>
          <span style={{display: 'inline-block', width: size * 0.55, height: size * 1.05, background: theme.accent, opacity: cursorOn ? 1 : 0}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<GlitchProps & {offset: number}>[] = [SceneTitle, SceneDate];

export const Glitch: React.FC<GlitchProps> = (props) => {
  loadTemplateFonts();
  const g = useCurrentFrame();
  const a = amp(g);
  const shake = a > 0.5 ? (random(`shake-${g}`) - 0.5) * a * 30 : 0;
  return (
    <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: MONO_FONT}}>
      <Backdrop theme={props.theme} />
      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
        <Hud theme={props.theme} />
        {glitchMeta.scenes.map((s, i) => {
          const Scene = SCENES[i];
          return (
            <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
              <Scene {...props} offset={s.from} />
            </Sequence>
          );
        })}
        <Noise theme={props.theme} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```