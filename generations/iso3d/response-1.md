FILE: meta.ts
```ts
import type {TemplateMeta} from '../vocab.ts';

export const iso3dMeta: TemplateMeta = {
  id: 'iso3d',
  name: 'Iso 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 240,
  motion: ['Mask reveal', 'Stagger list', 'Line draw', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 270, focus: 36, roles: ['headline']},
    {type: 'steps', from: 36, duration: 234, focus: 120, roles: ['point1', 'point2', 'point3']},
    {type: 'end-screen', from: 200, duration: 70, focus: 30, roles: ['cta']},
  ],
};
```

FILE: schema.ts
```ts
import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const iso3dSchema = z.object({
  texts: textsSchema(['headline', 'point1', 'point2', 'point3', 'cta'] as const),
  theme: themeSchema,
});

export type Iso3dProps = z.infer<typeof iso3dSchema>;
```

FILE: Iso3d.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import {iso3dMeta} from './meta';
import type {Iso3dProps} from './schema';

loadTemplateFonts();

type Theme = Iso3dProps['theme'];

const W = 1920;
const H = 1080;
const D = 60;
const FOV = 12;
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180);
const ALPHA = Math.atan(1 / Math.SQRT2);
const GX = 1.6;
const GY = -2.6;
const HEIGHTS = [1.4, 2.4, 3.4];
const SPACING = 4;
const FLOOR = 11;
const LINE = 64;

const STEPS = iso3dMeta.scenes[1];
const riseStart = (i: number) => STEPS.from + 4 + i * 38;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// World pose shared by the 3D rig and the HTML label projection, so they always line up.
function pose(frame: number) {
  const beta =
    -Math.PI / 4 +
    interpolate(frame, [0, 70], [0.5, 0], {...clamp, easing: easeOut}) +
    interpolate(frame, [70, 270], [0, -0.07], {...clamp, easing: easeInOut});
  const scale = interpolate(frame, [0, 45], [0.86, 1], {...clamp, easing: easeOut});
  return {beta, scale};
}

const blockPos = (i: number): [number, number] => [(i - 1) * SPACING, -(i - 1) * SPACING];

function blockRise(i: number, frame: number, fps: number) {
  return spring({frame: frame - riseStart(i), fps, config: {damping: 13, stiffness: 115, mass: 0.9}});
}

function project(p: [number, number, number], frame: number) {
  const {beta, scale} = pose(frame);
  const [x, y, z] = p.map((v) => v * scale);
  const x1 = x * Math.cos(beta) + z * Math.sin(beta);
  const z1 = -x * Math.sin(beta) + z * Math.cos(beta);
  const y2 = y * Math.cos(ALPHA) - z1 * Math.sin(ALPHA);
  const z2 = y * Math.sin(ALPHA) + z1 * Math.cos(ALPHA);
  const k = H / 2 / ((D - z2) * TAN);
  return {x: W / 2 + (x1 + GX) * k, y: H / 2 - (y2 + GY) * k};
}

const blockColor = (theme: Theme, i: number) => (i === 1 ? theme.accent2 : theme.accent);

const Icon: React.FC<{i: number; color: string; frame: number}> = ({i, color, frame}) => {
  const spin = frame * 0.04;
  if (i === 0)
    return (
      <mesh>
        <sphereGeometry args={[0.44, 40, 28]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
    );
  if (i === 1)
    return (
      <mesh rotation={[0, spin, 0]}>
        <coneGeometry args={[0.48, 0.9, 40]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
    );
  return (
    <mesh rotation={[0, spin + Math.PI / 4, 0]}>
      <torusGeometry args={[0.38, 0.13, 20, 60]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
    </mesh>
  );
};

const Block: React.FC<{i: number; theme: Theme}> = ({i, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = blockRise(i, frame, fps);
  const h = 0.03 + Math.max(0, s) * HEIGHTS[i];
  const pop = spring({frame: frame - riseStart(i) - 12, fps, config: {damping: 10, stiffness: 140}});
  const bob = Math.sin(frame * 0.08 + i * 1.7) * 0.07;
  const [x, z] = blockPos(i);
  const color = blockColor(theme, i);
  const iconY = h + 0.12 + 0.5 + bob;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0.35, 0.012, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 2.3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.14 * Math.min(1, s * 1.2)} />
      </mesh>
      <mesh position={[0, h / 2, 0]} scale={[1, h, 1]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, h + 0.06, 0]}>
        <boxGeometry args={[2.04, 0.12, 2.04]} />
        <meshStandardMaterial color={theme.surface} roughness={0.5} />
      </mesh>
      <group position={[0, iconY, 0]} scale={Math.max(0.0001, pop)}>
        <Icon i={i} color={color} frame={frame} />
      </group>
    </group>
  );
};

const Floor: React.FC<{theme: Theme}> = ({theme}) => {
  const lines = Array.from({length: FLOOR + 1}, (_, k) => k - FLOOR / 2);
  return (
    <>
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[FLOOR, 0.5, FLOOR]} />
        <meshStandardMaterial color={theme.surface} roughness={0.8} />
      </mesh>
      {lines.map((k) => (
        <React.Fragment key={k}>
          <mesh position={[0, 0.006, k]}>
            <boxGeometry args={[FLOOR, 0.008, 0.035]} />
            <meshBasicMaterial color={theme.foreground} transparent opacity={0.13} />
          </mesh>
          <mesh position={[k, 0.006, 0]}>
            <boxGeometry args={[0.035, 0.008, FLOOR]} />
            <meshBasicMaterial color={theme.foreground} transparent opacity={0.13} />
          </mesh>
        </React.Fragment>
      ))}
    </>
  );
};

const Motes: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 12}, (_, i) => {
        const x = (random(`iso-x-${i}`) - 0.5) * (FLOOR - 1);
        const z = (random(`iso-z-${i}`) - 0.5) * (FLOOR - 1);
        const y = (random(`iso-y-${i}`) * 5 + frame * 0.012) % 5;
        const fade = Math.sin((y / 5) * Math.PI);
        return (
          <mesh key={i} position={[x, 0.3 + y, z]} rotation={[frame * 0.03 + i, frame * 0.02, 0]} scale={0.12 * fade + 0.0001}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={i % 2 ? theme.accent2 : theme.accent} />
          </mesh>
        );
      })}
    </>
  );
};

const Rig: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const {beta, scale} = pose(frame);
  return (
    <>
      <hemisphereLight args={[theme.foreground, theme.background, 1.1]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-8, 12, 10]} intensity={2.4} />
      <directionalLight position={[10, 2, 6]} intensity={0.7} />
      <group position={[GX, GY, 0]} rotation={[ALPHA, beta, 0]} scale={scale}>
        <Floor theme={theme} />
        {[0, 1, 2].map((i) => (
          <Block key={i} i={i} theme={theme} />
        ))}
        <Motes theme={theme} />
      </group>
    </>
  );
};

const SceneHeadline: React.FC<Iso3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = wrapFit(texts.headline, 96, 820, 2, 0.58, 48);
  const words = texts.headline.trim().split(/\s+/);
  const bar = interpolate(frame, [18, 50], [0, 1], {...clamp, easing: easeOut});
  const dots = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: '96px 110px'}}>
      <div style={{display: 'flex', gap: 12, marginBottom: 30, opacity: dots, transform: `translateY(${(1 - dots) * 14}px)`}}>
        {[theme.accent, theme.accent2, theme.foreground].map((c, i) => (
          <div key={i} style={{width: 18, height: 18, borderRadius: i === 1 ? 4 : 999, background: c, transform: i === 1 ? 'rotate(45deg)' : undefined}} />
        ))}
      </div>
      <div style={{maxWidth: 860, fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.04, color: theme.foreground, display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.26}px`}}>
        <Role role="headline">
          {words.map((w, i) => {
            const y = interpolate(frame - 6 - i * 5, [0, 22], [110, 0], {...clamp, easing: easeOut});
            return (
              <span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: size * 0.08}}>
                <span style={{display: 'inline-block', transform: `translateY(${y}%)`}}>{w}</span>
              </span>
            );
          })}
        </Role>
      </div>
      <div style={{marginTop: 18, width: 180 * bar, height: 8, borderRadius: 8, background: theme.accent2}} />
    </AbsoluteFill>
  );
};

const SceneSteps: React.FC<Iso3dProps> = ({texts, theme}) => {
  const local = useCurrentFrame();
  const frame = local + STEPS.from;
  const {fps} = useVideoConfig();
  const points = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill>
      {points.map((text, i) => {
        const s = blockRise(i, frame, fps);
        const h = 0.03 + Math.max(0, s) * HEIGHTS[i];
        const [bx, bz] = blockPos(i);
        const a = project([bx, h + 1.4, bz], frame);
        const t0 = riseStart(i) + 12;
        const draw = interpolate(frame, [t0, t0 + 16], [0, 1], {...clamp, easing: easeOut});
        const card = spring({frame: frame - t0 - 8, fps, config: {damping: 14, stiffness: 130}});
        const color = blockColor(theme, i);
        return (
          <div key={i} style={{position: 'absolute', left: a.x, top: a.y, width: 0, height: 0}}>
            <div style={{position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: 999, border: `3px solid ${color}`, background: theme.surface, boxSizing: 'border-box', opacity: draw}} />
            <div style={{position: 'absolute', left: -1.5, top: -LINE * draw - 7, width: 3, height: LINE * draw, borderRadius: 3, background: color}} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: LINE + 10,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 24px 12px 12px',
                borderRadius: 18,
                background: theme.surface,
                boxShadow: '0 14px 34px rgba(0,0,0,0.18)',
                whiteSpace: 'nowrap',
                opacity: Math.min(1, card * 1.4),
                transform: `translateX(-50%) translateY(${(1 - card) * 22}px) scale(${0.9 + card * 0.1})`,
                transformOrigin: '50% 100%',
              }}
            >
              <div style={{width: 42, height: 42, borderRadius: 12, background: color, color: theme.background, fontFamily: MONO_FONT, fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {`0${i + 1}`}
              </div>
              <div style={{fontWeight: 700, fontSize: fit(text, 40, 300, 0.58), color: theme.foreground, lineHeight: 1.1}}>
                <Role role={`point${i + 1}`}>{text}</Role>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<Iso3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 15, stiffness: 120}});
  const arrow = interpolate(frame, [18, 34], [-16, 0], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 110,
          bottom: 92,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '24px 40px',
          borderRadius: 999,
          background: theme.accent,
          color: theme.background,
          fontWeight: 800,
          fontSize: fit(texts.cta, 44, 520, 0.6),
          whiteSpace: 'nowrap',
          boxShadow: '0 18px 40px rgba(0,0,0,0.22)',
          opacity: Math.min(1, s * 1.5),
          transform: `translateX(${(1 - s) * -260}px)`,
        }}
      >
        <Role role="cta">{texts.cta}</Role>
        <span style={{display: 'flex', transform: `translateX(${arrow}px)`}}>
          <ArrowIcon size={42} />
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<Iso3dProps>[] = [SceneHeadline, SceneSteps, SceneCta];

export const Iso3d: React.FC<Iso3dProps> = (props) => {
  const {theme} = props;
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${theme.background} 35%, ${theme.surface} 160%)`, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <AbsoluteFill>
        <Scene3D camera={{position: [0, 0, D], fov: FOV}}>
          <Rig theme={theme} />
        </Scene3D>
      </AbsoluteFill>
      {iso3dMeta.scenes.map((s, i) => {
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