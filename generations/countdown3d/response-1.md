FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

// Three numerals, 60 frames each, then the title card.
export const countdown3dMeta: TemplateMeta = {
  id: 'countdown3d',
  name: 'Countdown 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 34,
  motion: ['Countdown timer', 'Zoom', 'Mask reveal', 'Progress bar'],
  scenes: [
    {type: 'countdown', from: 0, duration: 190, focus: 30, roles: []},
    {type: 'title-reveal', from: 170, duration: 70, focus: 46, roles: ['brand', 'headline', 'date']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const countdown3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date'] as const),
  theme: themeSchema,
});

export type Countdown3dProps = z.infer<typeof countdown3dSchema>;
```

FILE: Countdown3d.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import {countdown3dMeta} from './meta';
import type {Countdown3dProps} from './schema';

loadTemplateFonts();

type Theme = Countdown3dProps['theme'];

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// 5x7 bitmaps for 3, 2, 1.
const GLYPHS: string[][] = [
  ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
];

const CELLS: [number, number][][] = GLYPHS.map((g) => {
  const out: [number, number][] = [];
  g.forEach((row, r) => {
    [...row].forEach((c, col) => {
      if (c === '1') out.push([col - 2, 3 - r]);
    });
  });
  return out;
});

const SLOT = 60;
const ASSEMBLE = 20;
const SCATTER_AT = 44;

const Numeral: React.FC<{index: number; theme: Theme}> = ({index, theme}) => {
  const frame = useCurrentFrame();
  const t = frame - index * SLOT;
  if (t < -2 || t > 78) return null;
  const swing = interpolate(t, [0, 60], [-0.55, 0.3], {...clamp, easing: easeInOut});
  const tilt = interpolate(t, [0, 40], [0.25, -0.08], {...clamp, easing: easeOut});
  return (
    <group rotation={[tilt, swing, 0]}>
      {CELLS[index].map(([x, y], i) => {
        const seed = `cd-${index}-${i}`;
        const delay = random(`${seed}-d`) * 12;
        const a = interpolate(t - delay, [0, ASSEMBLE], [0, 1], {...clamp, easing: easeOut});
        const sx = x * 3 + (random(`${seed}-x`) - 0.5) * 18;
        const sy = y * 3 + (random(`${seed}-y`) - 0.5) * 12;
        const sz = -42 - random(`${seed}-z`) * 14;
        let px = sx + (x - sx) * a;
        let py = sy + (y - sy) * a;
        let pz = sz * (1 - a);
        const s = interpolate(t - SCATTER_AT - random(`${seed}-s`) * 6, [0, 20], [0, 1], {...clamp, easing: easeIn});
        const len = Math.hypot(x, y) || 1;
        const burst = 12 + random(`${seed}-b`) * 10;
        px += (x / len + (random(`${seed}-bx`) - 0.5) * 0.8) * burst * s;
        py += (y / len + (random(`${seed}-by`) - 0.5) * 0.8) * burst * s;
        pz += (6 + random(`${seed}-bz`) * 8) * s;
        const spin = (1 - a) * Math.PI * 2.5 + s * Math.PI * 1.6;
        const scale = Math.max(0.001, (0.3 + a * 0.7) * (1 - s));
        const color = random(`${seed}-c`) > 0.68 ? theme.accent2 : theme.accent;
        return (
          <mesh key={i} position={[px, py, pz]} rotation={[spin, spin * 0.7, 0]} scale={scale}>
            <boxGeometry args={[0.9, 0.9, 1.5]} />
            <meshStandardMaterial color={color} metalness={0.25} roughness={0.28} />
          </mesh>
        );
      })}
    </group>
  );
};

// Dim cubes deep in the fog give the scene parallax depth.
const Field: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 46}, (_, i) => {
        const x = (random(`f-x-${i}`) - 0.5) * 64 + frame * 0.02 * (random(`f-v-${i}`) - 0.5);
        const y = (random(`f-y-${i}`) - 0.5) * 34;
        const z = -12 - random(`f-z-${i}`) * 36;
        const s = 0.4 + random(`f-s-${i}`) * 1.1;
        const r = frame * (0.004 + random(`f-r-${i}`) * 0.01);
        return (
          <mesh key={i} position={[x, y, z]} rotation={[r + i, r * 1.3, 0]} scale={s}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={theme.surface} roughness={0.6} />
          </mesh>
        );
      })}
    </>
  );
};

const Rig: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 190], [-2, 1.5], clamp);
  return (
    <>
      <fog attach="fog" args={[theme.background, 17, 52]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 12]} intensity={2.4} />
      <pointLight position={[-8, -4, 6]} intensity={60} color={theme.accent2} />
      <pointLight position={[8, 5, 4]} intensity={40} color={theme.accent} />
      <group position={[0, 0, push]}>
        <Field theme={theme} />
        {[0, 1, 2].map((k) => (
          <Numeral key={k} index={k} theme={theme} />
        ))}
      </group>
    </>
  );
};

const SceneCount: React.FC<Countdown3dProps> = ({theme}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const fadeOut = interpolate(frame, [176, 190], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
      <Scene3D camera={{position: [0, 0, 16], fov: 40}}>
        <Rig theme={theme} />
      </Scene3D>
      <div style={{position: 'absolute', left: 760, right: 760, bottom: 80, display: 'flex', gap: 16}}>
        {[0, 1, 2].map((k) => {
          const p = interpolate(frame - k * SLOT, [0, SLOT], [0, 1], clamp);
          return (
            <div key={k} style={{flex: 1, height: 6, borderRadius: 3, background: `${theme.foreground}22`, overflow: 'hidden'}}>
              <div style={{width: `${p * 100}%`, height: '100%', background: k === 1 ? theme.accent2 : theme.accent}} />
            </div>
          );
        })}
      </div>
      {[
        {left: 64, top: 64, b: 'borderLeft', c: 'borderTop'},
        {right: 64, top: 64, b: 'borderRight', c: 'borderTop'},
        {left: 64, bottom: 64, b: 'borderLeft', c: 'borderBottom'},
        {right: 64, bottom: 64, b: 'borderRight', c: 'borderBottom'},
      ].map(({b, c, ...pos}, i) => (
        <div
          key={i}
          style={{position: 'absolute', ...pos, width: 48, height: 48, [b]: `3px solid ${theme.foreground}55`, [c]: `3px solid ${theme.foreground}55`}}
        />
      ))}
    </AbsoluteFill>
  );
};

const MaskWords: React.FC<{text: string; size: number; color: string; accent: string; delay: number}> = ({text, size, color, accent, delay}) => {
  const frame = useCurrentFrame();
  const words = text.trim().split(/\s+/);
  return (
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, textAlign: 'center', width: 1640}}>
      <Role role="headline">
        {words.map((w, i) => {
          const y = interpolate(frame - delay - i * 5, [0, 22], [110, 0], {...clamp, easing: easeOut});
          return (
            <React.Fragment key={i}>
              <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: size * 0.08}}>
                <span style={{display: 'inline-block', transform: `translateY(${y}%)`, color: i === words.length - 1 ? accent : color}}>{w}</span>
              </span>
              {i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        })}
      </Role>
    </div>
  );
};

const SceneTitle: React.FC<Countdown3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 40], [0.4, 1], {...clamp, easing: easeOut});
  const brand = interpolate(frame, [8, 28], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [30, 54], [0, 1], {...clamp, easing: easeInOut});
  const date = interpolate(frame, [34, 54], [0, 1], {...clamp, easing: easeOut});
  const zoom = interpolate(frame, [0, 70], [1.06, 1], {...clamp, easing: easeOut});
  const headSize = wrapFit(texts.headline, 190, 1600, 2, 0.62, 80);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${theme.accent}33 0%, ${theme.surface}55 30%, transparent 65%)`,
          transform: `scale(${glow})`,
          opacity: glow,
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', transform: `scale(${zoom})`}}>
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: fit(texts.brand, 38, 1100, 0.85),
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme.accent2,
            opacity: brand,
            transform: `translateY(${(1 - brand) * -20}px)`,
            marginBottom: 36,
            whiteSpace: 'nowrap',
          }}
        >
          <Role role="brand">{texts.brand}</Role>
        </div>
        <MaskWords text={texts.headline} size={headSize} color={theme.foreground} accent={theme.accent} delay={14} />
        <div style={{width: 520 * line, height: 4, borderRadius: 2, background: theme.accent, margin: '44px 0 36px'}} />
        <div
          style={{
            fontFamily: SANS_FONT,
            fontWeight: 600,
            fontSize: fit(texts.date, 56, 1400, 0.6),
            color: `${theme.foreground}d9`,
            opacity: date,
            transform: `translateY(${(1 - date) * 24}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <Role role="date">{texts.date}</Role>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene timing lives in meta.ts so metadata and render always agree.
const SCENES: React.FC<Countdown3dProps>[] = [SceneCount, SceneTitle];

export const Countdown3d: React.FC<Countdown3dProps> = (props) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 50%, ${props.theme.surface}, ${props.theme.background} 70%)`,
      fontFamily: SANS_FONT,
      overflow: 'hidden',
    }}
  >
    {countdown3dMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
```