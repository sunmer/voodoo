FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const pixelMeta: TemplateMeta = {
  id: 'pixel',
  name: 'Pixel',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 150,
  motion: ['Draw-on', 'Typewriter', 'Parallax', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 70, roles: ['headline']},
    {type: 'typing', from: 66, duration: 114, focus: 66, roles: ['subhead']},
    {type: 'end-screen', from: 112, duration: 68, focus: 16, roles: ['cta']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const pixelSchema = z.object({
  texts: textsSchema(['headline', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type PixelProps = z.infer<typeof pixelSchema>;
```

FILE: Pixel.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, random, useCurrentFrame} from 'remotion';
import type {Theme} from '../contract';
import {Vignette, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, loadTemplateFonts} from '../shared/fonts';
import {pixelMeta} from './meta';
import type {PixelProps} from './schema';

const W = 1920;
const H = 1080;
const B = 24; // frame block size
const FX = 144;
const FY = 120;
const NX = 68;
const NY = 35;

// Quantize frames so motion moves in hard 8-bit steps.
const stepped = (frame: number, n = 3) => Math.floor(frame / n) * n;

const STARS = Array.from({length: 170}, (_, i) => ({
  x: Math.floor(random(`pixel-x-${i}`) * (W / 8)) * 8,
  y: random(`pixel-y-${i}`) * (H + 80),
  layer: Math.floor(random(`pixel-l-${i}`) * 3),
  tone: random(`pixel-c-${i}`),
}));

const LAYER = [
  {size: 8, speed: 2, alpha: 0.35},
  {size: 8, speed: 5, alpha: 0.65},
  {size: 16, speed: 10, alpha: 1},
];

const Starfield: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame, 3);
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${theme.foreground}0d 0 2px, transparent 2px 48px), repeating-linear-gradient(90deg, ${theme.foreground}0d 0 2px, transparent 2px 48px)`,
        }}
      />
      {STARS.map((s, i) => {
        const l = LAYER[s.layer];
        const y = Math.floor(((s.y + f * l.speed) % (H + 80)) / 8) * 8 - 40;
        const twinkle = s.layer === 2 && (Math.floor(frame / 6) + i) % 5 === 0;
        const color = s.tone > 0.86 ? theme.accent : s.tone > 0.74 ? theme.accent2 : theme.foreground;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: y,
              width: l.size,
              height: l.size,
              background: color,
              opacity: twinkle ? 0.2 : l.alpha,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const PixelArt: React.FC<{rows: string[]; unit: number; color: string; style?: React.CSSProperties}> = ({rows, unit, color, style}) => (
  <div style={{position: 'relative', width: rows[0].length * unit, height: rows.length * unit, ...style}}>
    {rows.flatMap((row, y) =>
      [...row].map((c, x) =>
        c === 'X' ? (
          <div key={`${x}-${y}`} style={{position: 'absolute', left: x * unit, top: y * unit, width: unit, height: unit, background: color}} />
        ) : null,
      ),
    )}
  </div>
);

const HEART = [' XX XX ', 'XXXXXXX', 'XXXXXXX', ' XXXXX ', '  XXX  ', '   X   '];
const ARROW = ['X   ', 'XX  ', 'XXX ', 'XXXX', 'XXX ', 'XX  ', 'X   '];

// Perimeter of the chunky frame, clockwise from the top-left corner.
const BLOCKS: {x: number; y: number}[] = (() => {
  const out: {x: number; y: number}[] = [];
  for (let i = 0; i < NX; i++) out.push({x: FX + i * B, y: FY});
  for (let j = 1; j < NY; j++) out.push({x: FX + (NX - 1) * B, y: FY + j * B});
  for (let i = NX - 2; i >= 0; i--) out.push({x: FX + i * B, y: FY + (NY - 1) * B});
  for (let j = NY - 2; j >= 1; j--) out.push({x: FX, y: FY + j * B});
  return out;
})();

const PixelFrame: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame, 2);
  const count = Math.max(0, Math.min(BLOCKS.length, Math.floor(((f - 2) / 36) * BLOCKS.length)));
  const hud = frame >= 40;
  const energy = Math.max(0, Math.min(10, Math.floor((frame - 44) / 4)));
  return (
    <AbsoluteFill>
      {BLOCKS.slice(0, count).map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: B,
            height: B,
            background: i === count - 1 && count < BLOCKS.length ? theme.foreground : i % 6 === 0 ? theme.accent2 : theme.accent,
            boxShadow: 'inset -6px -6px 0 rgba(0,0,0,0.35), inset 4px 4px 0 rgba(255,255,255,0.18)',
          }}
        />
      ))}
      {count >= BLOCKS.length ? (
        <div
          style={{
            position: 'absolute',
            left: FX + B + 12,
            top: FY + B + 12,
            width: (NX - 2) * B - 24,
            height: (NY - 2) * B - 24,
            border: `4px dashed ${theme.foreground}33`,
          }}
        />
      ) : null}
      {hud ? (
        <>
          <div style={{position: 'absolute', left: FX + B + 48, top: FY + B + 40, display: 'flex', gap: 14}}>
            {[0, 1, 2].map((i) => (
              <PixelArt key={i} rows={HEART} unit={6} color={theme.accent2} style={{opacity: frame >= 40 + i * 4 ? 1 : 0}} />
            ))}
          </div>
          <div style={{position: 'absolute', right: W - (FX + (NX - 1) * B) + 48, top: FY + B + 40, display: 'flex', gap: 6}}>
            {Array.from({length: 10}, (_, i) => (
              <div key={i} style={{width: 16, height: 36, background: i < energy ? theme.accent : `${theme.foreground}22`}} />
            ))}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<PixelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const text = texts.headline.toUpperCase();
  const size = wrapFit(text, 168, 1400, 2, 0.8, 40);
  const words = text.trim().split(/\s+/);
  const s = Math.max(4, Math.round((size * 0.05) / 4) * 4);
  const bob = frame > 90 ? (Math.floor(frame / 15) % 2) * -6 : 0;
  let k = 0;
  return (
    <AbsoluteFill>
      <PixelFrame theme={theme} />
      <div
        style={{
          position: 'absolute',
          left: (W - 1400) / 2,
          top: 210,
          width: 1400,
          height: 370,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${bob}px)`,
        }}
      >
        <span data-text-role={'headline'} style={{display: 'contents'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.4}px`, width: 1400}}>
            {words.map((word, wi) => (
              <span key={wi} style={{display: 'inline-flex', whiteSpace: 'nowrap'}}>
                {[...word].map((ch, ci) => {
                  const t = frame - 28 - k++ * 2;
                  const progress = t < 0 ? 0 : Math.min(4, Math.floor(t / 2)) / 4;
                  return (
                    <span
                      key={ci}
                      style={{
                        display: 'inline-block',
                        fontFamily: DISPLAY,
                        fontSize: size,
                        fontWeight: 900,
                        lineHeight: 1.05,
                        letterSpacing: '0.04em',
                        color: progress < 0.5 ? theme.accent2 : theme.foreground,
                        opacity: t < 0 ? 0 : 1,
                        transform: `translateY(${Math.round((-size * 0.6 * (1 - progress)) / 8) * 8}px)`,
                        textShadow: `${s}px ${s}px 0 ${theme.accent}, ${s * 2}px ${s * 2}px 0 ${theme.accent2}, ${s * 3}px ${s * 3}px 0 rgba(0,0,0,0.45)`,
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SceneTyping: React.FC<PixelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const text = texts.subhead;
  const BOX = 1240;
  const size = wrapFit(text, 40, BOX - 160, 2, 0.62, 20);
  const slide = Math.min(4, Math.floor(frame / 3)) / 4;
  const y = Math.round(((1 - slide) * 420) / 12) * 12;
  const shown = Math.max(0, Math.min(text.length, stepped(frame - 14, 2)));
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: (W - BOX) / 2,
          top: 600,
          width: BOX,
          padding: '24px 40px',
          background: theme.surface,
          border: `8px solid ${theme.foreground}`,
          boxShadow: `8px 8px 0 ${theme.accent}, 16px 16px 0 rgba(0,0,0,0.4)`,
          transform: `translateY(${y}px)`,
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          fontFamily: MONO_FONT,
          fontSize: size,
          fontWeight: 700,
          lineHeight: 1.3,
          color: theme.foreground,
        }}
      >
        <span style={{color: theme.accent2, flexShrink: 0}}>&gt;</span>
        <div style={{flex: 1, minWidth: 0, wordBreak: 'break-word'}}>
          <span data-text-role={'subhead'} style={{display: 'contents'}}>
            <span>{text.slice(0, shown)}</span>
            <span
              style={{
                display: 'inline-block',
                width: size * 0.6,
                height: size * 1.05,
                verticalAlign: 'text-bottom',
                background: theme.accent2,
                opacity: cursorOn ? 1 : 0,
              }}
            />
            <span style={{color: 'transparent'}}>{text.slice(shown)}</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<PixelProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const text = texts.cta.toUpperCase();
  const size = Math.round(fit(text, 64, 980, 0.78));
  const grow = Math.min(4, Math.floor(frame / 2)) / 4;
  const on = frame < 16 || Math.floor((frame - 16) / 10) % 2 === 0;
  const nudge = (Math.floor(frame / 6) % 2) * 8;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: W,
          top: 812,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          transform: `scale(${grow})`,
        }}
      >
        <PixelArt rows={ARROW} unit={8} color={theme.accent} style={{transform: `translateX(${nudge}px)`}} />
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: size,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: theme.accent2,
            whiteSpace: 'nowrap',
            opacity: on ? 1 : 0,
            textShadow: `4px 4px 0 ${theme.background}, 8px 8px 0 ${theme.accent}`,
          }}
        >
          <span data-text-role={'cta'} style={{display: 'contents'}}>{text}</span>
        </div>
        <PixelArt rows={ARROW} unit={8} color={theme.accent} style={{transform: `translateX(${-nudge}px) scaleX(-1)`}} />
      </div>
    </AbsoluteFill>
  );
};

// Scene timing lives in meta.ts so the taxonomy and the render never disagree.
const SCENES: React.FC<PixelProps>[] = [SceneTitle, SceneTyping, SceneCta];

export const Pixel: React.FC<PixelProps> = (props) => {
  loadTemplateFonts();
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: DISPLAY}}>
      <Starfield theme={props.theme} />
      {pixelMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 6px)',
        }}
      />
      <Vignette />
    </AbsoluteFill>
  );
};
```