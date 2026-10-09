FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const chrome3dMeta: TemplateMeta = {
  id: 'chrome3d',
  name: 'Chrome 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 120,
  motion: ['Orbit', 'Parallax', 'Zoom', 'Mask reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 104, roles: ['brand', 'headline']},
    {type: 'end-screen', from: 100, duration: 80, focus: 26, roles: ['cta']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const chrome3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'cta'] as const),
  theme: themeSchema,
});

export type Chrome3dProps = z.infer<typeof chrome3dSchema>;
```

FILE: Chrome3d.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, Grain, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import {chrome3dMeta} from './meta';
import type {Chrome3dProps} from './schema';

loadTemplateFonts();

type Theme = Chrome3dProps['theme'];
type Vec = [number, number, number];

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

type Kind = 'torus' | 'sphere' | 'capsule' | 'cone';
const SHAPES: {kind: Kind; start: Vec; end: Vec; scale: number; spin: Vec; phase: number}[] = [
  {kind: 'torus', start: [-1.3, 0.7, 0], end: [-5.4, 2.3, -1], scale: 1.15, spin: [0.9, 1.3, 0.2], phase: 0},
  {kind: 'sphere', start: [1.1, 0.9, 0.6], end: [5.5, 2.4, -0.6], scale: 1, spin: [0.2, 0.6, 0], phase: 1.4},
  {kind: 'capsule', start: [1.3, -0.8, 0.2], end: [5.1, -2.5, 0.4], scale: 1, spin: [1.1, 0.4, 0.8], phase: 2.6},
  {kind: 'cone', start: [-1.0, -1.0, 0.4], end: [-5.2, -2.4, 0.2], scale: 1, spin: [0.6, 1.0, 0.5], phase: 3.7},
  {kind: 'sphere', start: [0.1, 0.1, 1.2], end: [2.6, -3.5, 1.6], scale: 0.38, spin: [0, 0.4, 0], phase: 4.4},
  {kind: 'torus', start: [-0.2, 0.3, -1.2], end: [-2.3, 3.4, -2], scale: 0.42, spin: [1.4, 0.7, 0.3], phase: 5.2},
];

const Geometry: React.FC<{kind: Kind}> = ({kind}) => {
  if (kind === 'torus') return <torusGeometry args={[0.9, 0.34, 64, 160]} />;
  if (kind === 'sphere') return <sphereGeometry args={[0.85, 64, 64]} />;
  if (kind === 'capsule') return <capsuleGeometry args={[0.48, 1.1, 24, 64]} />;
  return <coneGeometry args={[0.78, 1.6, 96]} />;
};

// Polished metal cluster that turns in place, then parts to the frame edges.
const ChromeRig: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const part = interpolate(frame, [26, 112], [0, 1], {...clamp, easing: easeInOut});
  const sweep = frame * 0.035;
  const groupSpin = interpolate(frame, [0, 180], [-0.35, 0.25]);
  const dolly = interpolate(frame, [0, 180], [-1.2, 0.4], {...clamp, easing: easeOut});
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 8]} intensity={2.4} color={theme.foreground} />
      <directionalLight position={[-6, -4, 3]} intensity={1.1} color={theme.accent2} />
      <pointLight position={[Math.cos(sweep) * 7, 3.5, 5 + Math.sin(sweep) * 2]} intensity={60} decay={1.6} color={theme.accent} />
      <pointLight position={[Math.cos(sweep + Math.PI) * 7, -3, 5 + Math.sin(sweep + Math.PI) * 2]} intensity={60} decay={1.6} color={theme.accent2} />
      <pointLight position={[0, 0, 9]} intensity={25} decay={1.6} color={theme.foreground} />
      <group position={[0, 0, dolly]} rotation={[0, groupSpin * (1 - part * 0.7), 0]}>
        {SHAPES.map((s, i) => {
          const bob = Math.sin(frame * 0.05 + s.phase) * 0.16;
          const pos: Vec = [
            interpolate(part, [0, 1], [s.start[0], s.end[0]]),
            interpolate(part, [0, 1], [s.start[1], s.end[1]]) + bob,
            interpolate(part, [0, 1], [s.start[2], s.end[2]]),
          ];
          const r = frame * 0.014;
          const grow = interpolate(frame, [i * 3, i * 3 + 30], [0.6, 1], {...clamp, easing: easeOut});
          return (
            <mesh
              key={i}
              position={pos}
              scale={s.scale * grow}
              rotation={[s.phase + r * s.spin[0], s.phase * 0.5 + r * s.spin[1], r * s.spin[2]]}
            >
              <Geometry kind={s.kind} />
              <meshPhysicalMaterial
                color={theme.foreground}
                metalness={1}
                roughness={0.16}
                clearcoat={1}
                clearcoatRoughness={0.05}
                emissive={theme.surface}
                emissiveIntensity={0.22}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

const Studio: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 180], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 60% at 50% 46%, ${theme.surface} 0%, ${theme.background} 78%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${20 + glow * 10}% 18%, ${theme.accent}40, transparent 42%), radial-gradient(circle at ${82 - glow * 10}% 84%, ${theme.accent2}40, transparent 44%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 380,
          background: `linear-gradient(180deg, transparent, ${theme.background}aa)`,
        }}
      />
    </AbsoluteFill>
  );
};

const chromeFill = (theme: Theme, shift: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${theme.foreground} 0%, ${theme.foreground} 30%, ${theme.accent} 42%, ${theme.foreground} 50%, ${theme.accent2} 60%, ${theme.foreground} 72%, ${theme.foreground} 100%)`,
  backgroundSize: '260% 100%',
  backgroundPosition: `${shift}% 50%`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
});

const SceneTitle: React.FC<Chrome3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const brand = interpolate(frame, [58, 88], [0, 1], {...clamp, easing: easeOut});
  const reveal = interpolate(frame, [70, 104], [0, 1], {...clamp, easing: easeOut});
  const shimmer = interpolate(frame, [80, 170], [100, 0], {...clamp, easing: easeInOut});
  const size = wrapFit(texts.headline, 230, 1500, 2, 0.7, 90);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 210px'}}>
      <div
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: fit(texts.brand, 34, 1000, 1.0),
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: theme.foreground,
          opacity: brand,
          transform: `translateY(${(1 - brand) * -24}px)`,
          marginBottom: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
        }}
      >
        <span style={{width: 56 * brand, height: 2, background: theme.accent}} />
        <Role role="brand">{texts.brand}</Role>
        <span style={{width: 56 * brand, height: 2, background: theme.accent2}} />
      </div>
      <div
        style={{
          fontFamily: FLEX_FONT,
          fontWeight: 850,
          fontStretch: '115%',
          fontSize: size,
          lineHeight: 0.96,
          letterSpacing: `${interpolate(reveal, [0, 1], [-0.06, -0.015])}em`,
          maxWidth: 1500,
          paddingBottom: size * 0.06,
          ...chromeFill(theme, shimmer),
          clipPath: `inset(${(1 - reveal) * 100}% -5% -10% -5%)`,
          transform: `translateY(${(1 - reveal) * 60}px) scale(${1.14 - reveal * 0.14})`,
          filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.35))',
        }}
      >
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<Chrome3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 130}});
  const gleam = interpolate(frame, [14, 50], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120}}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '20px 40px',
          borderRadius: 999,
          fontFamily: SANS_FONT,
          fontWeight: 700,
          fontSize: fit(texts.cta, 32, 520, 0.62),
          color: theme.foreground,
          background: `linear-gradient(180deg, ${theme.surface}, ${theme.background})`,
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 14px 40px rgba(0,0,0,0.35), inset 0 2px 0 ${theme.foreground}33`,
          opacity: Math.min(1, pop * 1.4),
          transform: `translateY(${(1 - pop) * 40}px) scale(${0.85 + pop * 0.15})`,
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${gleam}%`,
            width: '30%',
            background: `linear-gradient(100deg, transparent, ${theme.foreground}40, transparent)`,
          }}
        />
        <Role role="cta">{texts.cta}</Role>
        <span style={{display: 'flex', color: theme.accent2}}>
          <ArrowIcon size={30} />
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<Chrome3dProps>[] = [SceneTitle, SceneCta];

export const Chrome3d: React.FC<Chrome3dProps> = (props) => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [0, 180], [1.08, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <Studio theme={props.theme} />
      <AbsoluteFill style={{transform: `scale(${pull})`}}>
        <Scene3D camera={{position: [0, 0, 13], fov: 36}}>
          <ChromeRig theme={props.theme} />
        </Scene3D>
      </AbsoluteFill>
      {chrome3dMeta.scenes.map((s, i) => {
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
};
```