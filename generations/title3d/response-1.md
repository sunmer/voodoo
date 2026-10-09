FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const title3dMeta: TemplateMeta = {
  id: 'title3d',
  name: 'Title 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 130,
  motion: ['Parallax', 'Mask reveal', 'Stagger list'],
  scenes: [{type: 'title-reveal', from: 0, duration: 180, focus: 110, roles: ['brand', 'headline', 'subhead']}],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const title3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type Title3dProps = z.infer<typeof title3dSchema>;
```

FILE: Title3d.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import {title3dMeta} from './meta';
import type {Title3dProps} from './schema';

loadTemplateFonts();

type Theme = Title3dProps['theme'];

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const COUNT = 11;
const GAP = 1.7;
const WIDTH = 1.1;
// Stepped skyline: tallest in the middle, dropping in even steps toward the edges.
const heightFor = (i: number) => {
  const d = Math.abs(i - (COUNT - 1) / 2);
  return 7.2 - Math.round(d) * 0.75;
};

const Pillars: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Camera move: slow sideways track and downward tilt, settled before the final second.
  const move = interpolate(frame, [0, 150], [0, 1], {...clamp, easing: easeInOut});
  const track = interpolate(move, [0, 1], [2.2, -0.2]);
  const tilt = interpolate(move, [0, 1], [0.08, 0.3]);
  const yaw = interpolate(move, [0, 1], [-0.16, 0.04]);
  const lift = interpolate(move, [0, 1], [-4.4, -5.6]);
  return (
    <>
      <hemisphereLight args={[theme.foreground, theme.background, 0.9]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 12, 9]} intensity={2.3} />
      <directionalLight position={[-9, 5, -6]} intensity={0.9} color={theme.accent2} />
      <group position={[track, lift, 0]} rotation={[tilt, yaw, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[80, 60]} />
          <meshStandardMaterial color={theme.background} roughness={1} metalness={0} />
        </mesh>
        {Array.from({length: COUNT}, (_, i) => {
          const s = spring({frame: frame - 8 - i * 5, fps, config: {damping: 15, stiffness: 85, mass: 0.9}});
          const h = Math.max(0.001, heightFor(i) * s);
          const x = (i - (COUNT - 1) / 2) * GAP;
          return (
            <group key={i} position={[x, 0, 0]}>
              <mesh position={[0, h / 2, 0]} scale={[1, h, 1]}>
                <boxGeometry args={[WIDTH, 1, WIDTH]} />
                <meshStandardMaterial color={theme.surface} metalness={0.25} roughness={0.22} />
              </mesh>
              <mesh position={[0, h + 0.09, 0]} scale={[1, s > 0.02 ? 1 : 0.001, 1]}>
                <boxGeometry args={[WIDTH + 0.02, 0.18, WIDTH + 0.02]} />
                <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={0.35} metalness={0.2} roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
};

const TitleScene: React.FC<Title3dProps & {duration: number}> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const brand = interpolate(frame, [52, 80], [0, 1], {...clamp, easing: easeOut});
  const rule = interpolate(frame, [58, 96], [0, 1], {...clamp, easing: easeOut});
  const head = interpolate(frame, [64, 104], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [92, 124], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingTop: 120}}>
      <div
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: fit(texts.brand, 30, 900, 0.62 + 0.28),
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: theme.accent,
          opacity: brand,
          transform: `translateY(${(1 - brand) * -16}px)`,
        }}
      >
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{width: 220 * rule, height: 3, background: theme.accent2, margin: '26px 0 30px', borderRadius: 2}} />
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: wrapFit(texts.headline, 150, 1500, 2, 0.62, 64),
          lineHeight: 1,
          maxWidth: 1600,
          color: theme.foreground,
          clipPath: `inset(${(1 - head) * 100}% -10% -10% -10%)`,
          transform: `translateY(${(1 - head) * 60}px)`,
          textShadow: `0 10px 40px ${theme.background}`,
        }}
      >
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div
        style={{
          fontFamily: SANS_FONT,
          marginTop: 30,
          maxWidth: 1100,
          fontSize: wrapFit(texts.subhead, 40, 1100, 2, 0.52, 26),
          lineHeight: 1.3,
          color: `${theme.foreground}d9`,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
          textShadow: `0 4px 24px ${theme.background}`,
        }}
      >
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<Title3dProps & {duration: number}>[] = [TitleScene];

export const Title3d: React.FC<Title3dProps> = (props) => {
  const {theme} = props;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.surface} 0%, ${theme.background} 62%)`,
        fontFamily: SANS_FONT,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill>
        <Scene3D camera={{position: [0, 0, 16], fov: 40}}>
          <Pillars theme={theme} />
        </Scene3D>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${theme.background}aa 0%, transparent 45%)`, pointerEvents: 'none'}} />
      {title3dMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} duration={s.duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```