FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const turntableMeta: TemplateMeta = {
  id: 'turntable',
  name: 'Turntable',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 200,
  motion: ['Orbit', 'Zoom', 'Slide-in', 'Spotlight', 'Pulse rings'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 240, focus: 64, roles: ['brand', 'headline']},
    {type: 'price-reveal', from: 96, duration: 144, focus: 26, roles: ['price']},
    {type: 'end-screen', from: 146, duration: 94, focus: 44, roles: ['cta']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const turntableSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'price', 'cta'] as const),
  theme: themeSchema,
});

export type TurntableProps = z.infer<typeof turntableSchema>;
```

FILE: Turntable.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, Vignette, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import {turntableMeta} from './meta';
import type {TurntableProps} from './schema';

loadTemplateFonts();

type Theme = TurntableProps['theme'];

const LEFT = 140;
const COL = 780;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// The product and pedestal. `ghost` renders a faint copy used for the floor reflection.
const Model: React.FC<{theme: Theme; ghost?: boolean}> = ({theme, ghost}) => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 70], [0, 1], {...clamp, easing: easeOut});
  const spin = intro * Math.PI * 0.9 + frame * 0.014;
  const bob = Math.sin(frame * 0.045) * 0.06;
  const glow = interpolate(frame, [10, 60], [0, 1], clamp) * (0.85 + Math.sin(frame * 0.08) * 0.15);
  const mat = (o = 1) => ({transparent: !!ghost || o < 1, opacity: ghost ? 0.16 * o : o, side: 2 as const, depthWrite: !ghost});
  return (
    <group>
      {/* pedestal */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[1.9, 2.05, 0.5, 96]} />
        <meshStandardMaterial color={theme.surface} metalness={0.4} roughness={0.28} {...mat()} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 64]} />
        <meshBasicMaterial color="#000000" {...mat(0.3 * intro)} />
      </mesh>
      {/* ring of light */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.92, 0.035, 12, 160]} />
        <meshStandardMaterial color={theme.accent2} emissive={theme.accent2} emissiveIntensity={2.2 * glow} {...mat()} />
      </mesh>
      <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.06, 0.02, 8, 160]} />
        <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={1.4 * glow} {...mat()} />
      </mesh>
      {/* capsule device */}
      <group position={[0, 1.55 + bob, 0]} rotation={[0, spin, 0.12]} scale={0.82 + intro * 0.18}>
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 1.3, 64]} />
          <meshStandardMaterial color={theme.surface} metalness={0.35} roughness={0.22} {...mat()} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.62, 64, 32]} />
          <meshStandardMaterial color={theme.surface} metalness={0.35} roughness={0.22} {...mat()} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.62, 64, 32]} />
          <meshStandardMaterial color={theme.surface} metalness={0.35} roughness={0.22} {...mat()} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.64, 0.07, 24, 120]} />
          <meshStandardMaterial color={theme.accent} metalness={0.6} roughness={0.2} {...mat()} />
        </mesh>
        <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.625, 0.025, 16, 120]} />
          <meshStandardMaterial color={theme.accent2} metalness={0.5} roughness={0.3} {...mat()} />
        </mesh>
        <mesh position={[0, 0.62, 0.55]}>
          <sphereGeometry args={[0.13, 32, 16]} />
          <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={0.9} {...mat()} />
        </mesh>
      </group>
    </group>
  );
};

const Rig: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const orbit = interpolate(frame, [0, 240], [-Math.PI / 8, Math.PI / 8], {...clamp, easing: easeInOut});
  const dolly = interpolate(frame, [0, 240], [-0.6, 2.0], {...clamp, easing: easeInOut});
  const rise = interpolate(frame, [0, 50], [-0.5, 0], {...clamp, easing: easeOut});
  const rim = interpolate(frame, [0, 60], [0.4, 3.2], {...clamp, easing: easeOut});
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[5, 6, 7]} intensity={2.3} />
      <directionalLight position={[-7, 2, 4]} intensity={0.7} color={theme.surface} />
      <directionalLight position={[-3, 4, -7]} intensity={rim} color={theme.accent} />
      <group position={[2.9, -1.0 + rise, dolly]} rotation={[0.2, 0, 0]}>
        <pointLight position={[0, 0.4, 0]} intensity={3} distance={5} color={theme.accent2} />
        <group rotation={[0, orbit, 0]}>
          <Model theme={theme} />
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[7, 96]} />
            <meshStandardMaterial color={theme.background} transparent opacity={0.72} roughness={0.5} metalness={0.2} depthWrite={false} />
          </mesh>
          <group position={[0, -1.0, 0]} scale={[1, -1, 1]}>
            <Model theme={theme} ghost />
          </group>
        </group>
      </group>
    </>
  );
};

const SceneTitle: React.FC<TurntableProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const brand = interpolate(frame, [6, 30], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [14, 44], [0, 1], {...clamp, easing: easeInOut});
  const head = interpolate(frame, [24, 64], [0, 1], {...clamp, easing: easeOut});
  const headSize = wrapFit(texts.headline, 124, COL, 2, 0.62, 56);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: LEFT, top: 290, width: COL, display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{width: 64 * line, height: 3, background: theme.accent}} />
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: fit(texts.brand, 28, COL - 100, 0.85),
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: theme.foreground,
            opacity: brand * 0.85,
            transform: `translateX(${(1 - brand) * -30}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <Role role="brand">{texts.brand}</Role>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: 350,
          width: COL,
          fontFamily: FLEX_FONT,
          fontWeight: 800,
          fontSize: headSize,
          lineHeight: 1.02,
          color: theme.foreground,
          clipPath: `inset(-10% ${(1 - head) * 100}% -10% 0)`,
          transform: `translateX(${(1 - head) * -60}px)`,
          textShadow: '0 10px 40px rgba(0,0,0,0.35)',
        }}
      >
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const ScenePrice: React.FC<TurntableProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const text = interpolate(frame, [8, 28], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: 640,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '16px 34px 16px 24px',
          borderRadius: 999,
          background: `${theme.surface}e6`,
          border: `2px solid ${theme.accent}`,
          boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
          transformOrigin: '0% 50%',
          transform: `translateX(${(1 - s) * -80}px) scaleX(${0.6 + s * 0.4})`,
          opacity: Math.min(1, s * 1.4),
        }}
      >
        <div style={{width: 18, height: 18, borderRadius: 999, background: theme.accent, boxShadow: `0 0 18px ${theme.accent}`}} />
        <div
          style={{
            fontFamily: FLEX_FONT,
            fontWeight: 750,
            fontSize: fit(texts.price, 58, 380, 0.62),
            color: theme.foreground,
            whiteSpace: 'nowrap',
            opacity: text,
            transform: `translateY(${(1 - text) * 20}px)`,
          }}
        >
          <Role role="price">{texts.price}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<TurntableProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 130}});
  const pulse = interpolate(frame, [38, 47, 60], [1, 1.07, 1], {...clamp, easing: easeInOut});
  const ring = interpolate(frame, [40, 72], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: LEFT, top: 770, opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 40}px)`}}>
        <div style={{position: 'relative', display: 'inline-flex'}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              border: `3px solid ${theme.accent}`,
              transform: `scale(${1 + ring * 0.35}, ${1 + ring * 0.9})`,
              opacity: ring > 0 ? (1 - ring) * 0.8 : 0,
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '26px 44px',
              borderRadius: 18,
              background: theme.accent,
              color: theme.background,
              fontFamily: SANS_FONT,
              fontWeight: 750,
              fontSize: fit(texts.cta, 40, 440, 0.6),
              whiteSpace: 'nowrap',
              transform: `scale(${pulse})`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
          >
            <Role role="cta">{texts.cta}</Role>
            <ArrowIcon size={38} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<TurntableProps>[] = [SceneTitle, ScenePrice, SceneCta];

export const Turntable: React.FC<TurntableProps> = (props) => {
  const {theme} = props;
  const frame = useCurrentFrame();
  const spot = interpolate(frame, [0, 60], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(100deg, ${theme.background} 0%, ${theme.background} 38%, ${theme.surface} 100%)`,
        fontFamily: SANS_FONT,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: spot,
          background: `radial-gradient(ellipse 40% 60% at 70% 38%, ${theme.accent2}33, transparent 70%)`,
        }}
      />
      <Scene3D camera={{position: [0, 0, 11], fov: 40}}>
        <Rig theme={theme} />
      </Scene3D>
      <AbsoluteFill style={{background: `linear-gradient(90deg, ${theme.background}d9 0%, ${theme.background}80 32%, transparent 55%)`}} />
      {turntableMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
      <Vignette />
    </AbsoluteFill>
  );
};
```