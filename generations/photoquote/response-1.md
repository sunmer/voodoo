FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const photoquoteMeta: TemplateMeta = {
  id: 'photoquote',
  name: 'Photo Quote',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 150,
  motion: ['Zoom', 'Parallax', 'Draw-on', 'Mask reveal', 'Line draw'],
  scenes: [
    {type: 'quote', from: 0, duration: 240, focus: 112, roles: ['brand', 'quote']},
    {type: 'byline', from: 100, duration: 140, focus: 40, roles: ['author']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {photoquoteAssets} from './assets';

export const photoquoteSchema = z.object({
  texts: textsSchema(['quote', 'author', 'brand'] as const),
  theme: themeSchema,
  media: z.object({background: assetSchema(photoquoteAssets)}).strict(),
});

export type PhotoquoteProps = z.infer<typeof photoquoteSchema>;
```

FILE: Photoquote.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {Backdrop} from '../media/Backdrop';
import {photoquoteAssets} from './assets';
import {photoquoteFiles} from './assets/files';
import {photoquoteMeta} from './meta';
import type {PhotoquoteProps} from './schema';

loadTemplateFonts();

// Brand at the top plus the quote and byline in the lower half, as [left, top, right, bottom] fractions.
const TEXT_ZONE = [0, 0, 1, 0.92] as const;

const W = 1080;
const PAD = 100;
const TEXT_W = W - PAD * 2;
const RATIO = 0.5;
const LINE_H = 1.14;
const BYLINE_BOTTOM = 250;
const QUOTE_BOTTOM = BYLINE_BOTTOM + 160;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Break words into rows using the same per-line estimate as wrapFit.
function wrapLines(text: string, size: number, width: number, ratio: number) {
  const perLine = Math.max(1, Math.floor(width / (size * ratio)));
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current && current.length + 1 + word.length > perLine) {
      lines.push(current);
      current = word;
    } else current = current ? `${current} ${word}` : word;
  }
  if (current) lines.push(current);
  return lines;
}

const MARK =
  'M50 20 C25 28 12 48 12 70 C12 84 22 92 33 92 C44 92 52 84 52 73 C52 62 44 55 34 55 C30 55 27 56 25 57 C28 42 38 32 54 26 Z';

const QuoteMark: React.FC<{color: string; size: number}> = ({color, size}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [8, 50], [0, 1], {...clamp, easing: easeInOut});
  const fill = interpolate(frame, [40, 64], [0, 1], {...clamp, easing: easeOut});
  return (
    <svg width={size * 1.2} height={size} viewBox="0 0 120 100" style={{overflow: 'visible', marginBottom: 18, marginLeft: -6}}>
      {[0, 58].map((dx) => (
        <path
          key={dx}
          d={MARK}
          transform={`translate(${dx} 0)`}
          pathLength={1}
          fill={color}
          fillOpacity={fill}
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      ))}
    </svg>
  );
};

const SceneQuote: React.FC<PhotoquoteProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = wrapFit(texts.quote, 100, TEXT_W, 6, RATIO, 50);
  const lines = wrapLines(texts.quote, size, TEXT_W, RATIO);
  const brand = interpolate(frame, [6, 34], [0, 1], {...clamp, easing: easeOut});
  const brandRule = interpolate(frame, [14, 46], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          opacity: brand,
          transform: `translateY(${(1 - brand) * -14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: fit(texts.brand, 28, 640, 0.78),
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: theme.accent,
            whiteSpace: 'nowrap',
          }}
        >
          <Role role="brand">{texts.brand}</Role>
        </div>
        <div style={{width: 64, height: 2, background: theme.foreground, opacity: 0.5, transform: `scaleX(${brandRule})`}} />
      </div>

      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: QUOTE_BOTTOM, display: 'flex', flexDirection: 'column'}}>
        <QuoteMark color={theme.accent} size={Math.max(96, size * 1.25)} />
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontWeight: 380,
            fontStyle: 'italic',
            fontSize: size,
            lineHeight: LINE_H,
            color: theme.foreground,
            letterSpacing: '-0.01em',
            overflowWrap: 'anywhere',
          }}
        >
          <Role role="quote">
            {lines.map((line, i) => {
              const t = interpolate(frame - 36 - i * 11, [0, 30], [0, 1], {...clamp, easing: easeOut});
              return (
                <div key={i} style={{overflow: 'hidden', paddingBottom: size * 0.08, marginBottom: -size * 0.08}}>
                  <div style={{transform: `translateY(${(1 - t) * 105}%)`, opacity: 0.2 + t * 0.8}}>{line}</div>
                </div>
              );
            })}
          </Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneByline: React.FC<PhotoquoteProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: easeInOut});
  const name = interpolate(frame, [14, 42], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: BYLINE_BOTTOM, display: 'flex', flexDirection: 'column', gap: 30}}>
        <div style={{width: 180, height: 3, background: theme.accent, transformOrigin: 'left', transform: `scaleX(${rule})`}} />
        <div
          style={{
            fontFamily: SANS_FONT,
            fontWeight: 600,
            fontSize: fit(texts.author, 40, TEXT_W, 0.56),
            letterSpacing: '0.02em',
            color: theme.foreground,
            whiteSpace: 'nowrap',
            opacity: name,
            transform: `translateX(${(1 - name) * 24}px)`,
          }}
        >
          <Role role="author">{texts.author}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<PhotoquoteProps>[] = [SceneQuote, SceneByline];

// Full-frame photo drifting upward with a slow zoom, an editorial serif quote in the lower half.
export const Photoquote: React.FC<PhotoquoteProps> = (props) => {
  const {theme, media} = props;
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 240], [1.08, 1.15], clamp);
  const lift = interpolate(frame, [0, 240], [40, -60], clamp);
  const asset = photoquoteAssets.find((a) => a.id === media.background)!;
  return (
    <AbsoluteFill style={{background: theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateY(${lift}px) scale(${zoom})`}}>
        <Backdrop
          src={photoquoteFiles[media.background]}
          asset={asset}
          background={theme.background}
          foreground={[theme.foreground, theme.accent]}
          zone={TEXT_ZONE}
          fade="bottom"
        />
      </AbsoluteFill>
      {photoquoteMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```