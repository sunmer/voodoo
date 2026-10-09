import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack} from '../shared/scenes';
import type {SceneProps} from '../shared/scenes';
import {Scene3D} from '../three/Scene3D';
import {clayMeta} from './meta';
import type {ClayProps} from './schema';

loadTemplateFonts();

type Theme = ClayProps['theme'];

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Blend two 6-digit hex colors.
const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`;
};
const pastel = (c: string) => mix(c, '#ffffff', 0.38);

const FLOOR = -2.2;
const DROP_H = 8;
const FALL = 16;

// Drop from height, then a few decaying bounces with squash on every contact.
function drop(t: number) {
  if (t < 0) return {y: DROP_H, sx: 1, sy: 1, land: 0};
  if (t < FALL) {
    const p = t / FALL;
    const s = 0.22 * p * p;
    return {y: DROP_H * (1 - p * p), sx: 1 - s * 0.45, sy: 1 + s, land: p};
  }
  let u = t - FALL;
  let y = 0;
  let k = 0;
  for (let n = 1; n <= 3; n++) {
    const e = Math.pow(0.3, n);
    const d = 2 * FALL * Math.sqrt(e);
    if (u < d) {
      const q = (2 * u) / d - 1;
      y = DROP_H * e * (1 - q * q);
      break;
    }
    u -= d;
    k = n;
  }
  const amp = 0.42 * Math.pow(0.5, k);
  const sq = amp * Math.exp(-u / 4) * Math.cos(u * 0.8);
  return {y, sx: 1 + sq * 0.5, sy: 1 - sq, land: 1};
}

// A small anticipation-hop-land, used for the playful wave near the end.
function hop(t: number) {
  if (t < 0 || t > 36) return {y: 0, sx: 1, sy: 1};
  if (t < 6) {
    const s = 0.18 * Math.sin((Math.PI * t) / 6);
    return {y: 0, sx: 1 + s * 0.5, sy: 1 - s};
  }
  if (t < 20) {
    const q = (2 * (t - 6)) / 14 - 1;
    const st = 0.12 * Math.abs(q);
    return {y: 0.8 * (1 - q * q), sx: 1 - st * 0.4, sy: 1 + st};
  }
  const u = t - 20;
  const sq = 0.22 * Math.exp(-u / 4) * Math.cos(u * 0.8);
  return {y: 0, sx: 1 + sq * 0.5, sy: 1 - sq};
}

const Mat: React.FC<{color: string}> = ({color}) => <meshStandardMaterial color={color} roughness={0.8} metalness={0} />;

const Capsule: React.FC<{r: number; len: number; color: string}> = ({r, len, color}) => (
  <group>
    <mesh>
      <cylinderGeometry args={[r, r, len, 48]} />
      <Mat color={color} />
    </mesh>
    <mesh position={[0, len / 2, 0]}>
      <sphereGeometry args={[r, 48, 24]} />
      <Mat color={color} />
    </mesh>
    <mesh position={[0, -len / 2, 0]}>
      <sphereGeometry args={[r, 48, 24]} />
      <Mat color={color} />
    </mesh>
  </group>
);

// A rounded box built from boxes, edge cylinders and corner spheres.
const RoundedBox: React.FC<{w: number; h: number; d: number; r: number; color: string}> = ({w, h, d, r, color}) => {
  const x = w / 2 - r;
  const y = h / 2 - r;
  const z = d / 2 - r;
  const signs: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return (
    <group>
      <mesh><boxGeometry args={[w, h - 2 * r, d - 2 * r]} /><Mat color={color} /></mesh>
      <mesh><boxGeometry args={[w - 2 * r, h, d - 2 * r]} /><Mat color={color} /></mesh>
      <mesh><boxGeometry args={[w - 2 * r, h - 2 * r, d]} /><Mat color={color} /></mesh>
      {signs.map(([a, b], i) => (
        <React.Fragment key={i}>
          <mesh position={[x * a, y * b, z]}><sphereGeometry args={[r, 24, 16]} /><Mat color={color} /></mesh>
          <mesh position={[x * a, y * b, -z]}><sphereGeometry args={[r, 24, 16]} /><Mat color={color} /></mesh>
          <mesh position={[0, y * a, z * b]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[r, r, w - 2 * r, 24]} /><Mat color={color} /></mesh>
          <mesh position={[x * a, 0, z * b]}><cylinderGeometry args={[r, r, h - 2 * r, 24]} /><Mat color={color} /></mesh>
          <mesh position={[x * a, y * b, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r, r, d - 2 * r, 24]} /><Mat color={color} /></mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

type Kind = 'sphere' | 'capsule' | 'lying' | 'box';
type ShapeDef = {kind: Kind; x: number; z: number; a: number; b: number; c: number; color: number; delay: number; rot: number};

const SHAPES: ShapeDef[] = [
  {kind: 'sphere', x: -5.5, z: 0.3, a: 0.95, b: 0, c: 0, color: 0, delay: 0, rot: 0},
  {kind: 'box', x: 5.3, z: -0.8, a: 1.5, b: 1.5, c: 1.5, color: 1, delay: 6, rot: 0.55},
  {kind: 'capsule', x: -3.9, z: -2.2, a: 0.55, b: 1.3, c: 0, color: 1, delay: 12, rot: 0},
  {kind: 'sphere', x: 3.9, z: 1.6, a: 0.62, b: 0, c: 0, color: 2, delay: 18, rot: 0},
  {kind: 'lying', x: -4.2, z: 2.4, a: 0.42, b: 1.5, c: 0, color: 3, delay: 24, rot: -0.4},
  {kind: 'capsule', x: 6.7, z: -3.4, a: 0.45, b: 0.9, c: 0, color: 0, delay: 30, rot: 0},
  {kind: 'box', x: -6.6, z: -3.2, a: 1.1, b: 0.8, c: 1.1, color: 2, delay: 36, rot: 0.3},
  {kind: 'sphere', x: 3.0, z: 3.4, a: 0.42, b: 0, c: 0, color: 0, delay: 42, rot: 0},
  {kind: 'sphere', x: -2.6, z: 3.9, a: 0.35, b: 0, c: 0, color: 1, delay: 48, rot: 0},
];

const dims = (s: ShapeDef) => {
  if (s.kind === 'sphere') return {half: s.a, foot: s.a};
  if (s.kind === 'capsule') return {half: s.b / 2 + s.a, foot: s.a};
  if (s.kind === 'lying') return {half: s.a, foot: (s.b / 2 + s.a) * 0.75};
  return {half: s.b / 2, foot: Math.max(s.a, s.c) * 0.62};
};

const Body: React.FC<{s: ShapeDef; color: string}> = ({s, color}) => {
  if (s.kind === 'sphere')
    return (
      <mesh>
        <sphereGeometry args={[s.a, 64, 40]} />
        <Mat color={color} />
      </mesh>
    );
  if (s.kind === 'capsule') return <Capsule r={s.a} len={s.b} color={color} />;
  if (s.kind === 'lying')
    return (
      <group rotation={[0, 0, Math.PI / 2]}>
        <Capsule r={s.a} len={s.b} color={color} />
      </group>
    );
  return <RoundedBox w={s.a} h={s.b} d={s.c} r={Math.min(s.a, s.b, s.c) * 0.24} color={color} />;
};

const ClayShape: React.FC<{s: ShapeDef; i: number; color: string}> = ({s, i, color}) => {
  const frame = useCurrentFrame();
  const t = frame - s.delay;
  const d = drop(t);
  const h = hop(frame - 140 - i * 3);
  const y = d.y + h.y;
  const sx = d.sx * h.sx * (1 + Math.sin(frame * 0.08 + i) * 0.012);
  const sy = d.sy * h.sy;
  const {half, foot} = dims(s);
  const inward = 1 + 0.25 * (1 - d.land);
  const spin = t < FALL ? (1 - Math.max(0, t) / FALL) * 1.2 : 0;
  const idle = Math.sin(frame * 0.03 + i * 1.3) * 0.08 * interpolate(frame, [90, 120], [0, 1], clamp);
  const air = Math.min(1, y / 4);
  const shadowOpacity = t < 0 ? 0 : 0.22 * (1 - air);
  return (
    <group position={[s.x * inward, FLOOR, s.z]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[sx * (1 - air * 0.5), sx * (1 - air * 0.5), 1]}>
        <circleGeometry args={[foot * 1.15, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={shadowOpacity} depthWrite={false} />
      </mesh>
      <group position={[0, y, 0]} scale={[sx, sy, sx]} rotation={[0, s.rot + spin + idle, 0]}>
        <group position={[0, half, 0]}>
          <Body s={s} color={color} />
        </group>
      </group>
    </group>
  );
};

const World: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const palette = [
    pastel(theme.accent),
    pastel(theme.accent2),
    pastel(mix(theme.accent, theme.accent2, 0.5)),
    pastel(mix(theme.accent2, theme.foreground, 0.3)),
  ];
  const sway = Math.sin(frame / 70) * 0.06;
  return (
    <>
      <fog attach="fog" args={[theme.background, 16, 40]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#ffffff', theme.background, 0.9]} />
      <directionalLight position={[5, 8, 6]} intensity={1.6} />
      <directionalLight position={[-6, 3, 4]} intensity={0.5} color={pastel(theme.accent2)} />
      <group rotation={[0.18, sway, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR, -10]}>
          <planeGeometry args={[90, 70]} />
          <meshStandardMaterial color={mix(theme.surface, theme.background, 0.4)} roughness={1} metalness={0} />
        </mesh>
        {SHAPES.map((s, i) => (
          <ClayShape key={i} s={s} i={i} color={palette[s.color]} />
        ))}
      </group>
    </>
  );
};

const TitleScene: React.FC<SceneProps<ClayProps>> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pill = spring({frame: frame - 46, fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
  const sub = interpolate(frame, [92, 118], [0, 1], {...clamp, easing: easeOut});
  const words = texts.headline.trim().split(/\s+/);
  const size = wrapFit(texts.headline, 150, 1200, 2, 0.6, 64);
  const ledge = mix(theme.background, '#000000', 0.22);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingBottom: 140}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 34px',
          borderRadius: 999,
          background: theme.surface,
          color: theme.foreground,
          fontFamily: SANS_FONT,
          fontWeight: 800,
          fontSize: fit(texts.brand, 34, 600, 0.78),
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          boxShadow: `0 8px 0 ${ledge}, 0 18px 30px rgba(0,0,0,0.16)`,
          transform: `scale(${pill}) rotate(${(1 - pill) * -10}deg)`,
          marginBottom: 40,
        }}
      >
        <div style={{width: 18, height: 18, borderRadius: 999, background: pastel(theme.accent)}} />
        <Role role="brand">{texts.brand}</Role>
      </div>
      <Role role="headline">
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.28}px`, maxWidth: 1300}}>
          {words.map((w, i) => {
            const s = spring({frame: frame - 62 - i * 5, fps, config: {damping: 8, stiffness: 160, mass: 0.8}});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: DISPLAY,
                  fontWeight: 900,
                  fontSize: size,
                  lineHeight: 1.04,
                  color: theme.foreground,
                  opacity: Math.min(1, s * 2),
                  transformOrigin: '50% 100%',
                  transform: `translateY(${(1 - s) * 60}px) scale(${s}) rotate(${(1 - s) * (i % 2 ? 9 : -9)}deg)`,
                  textShadow: `0 7px 0 ${ledge}, 0 20px 36px rgba(0,0,0,0.18)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </Role>
      <div
        style={{
          marginTop: 38,
          maxWidth: 1000,
          fontFamily: SANS_FONT,
          fontWeight: 600,
          fontSize: wrapFit(texts.subhead, 40, 1000, 2, 0.52, 26),
          lineHeight: 1.3,
          color: `${theme.foreground}cc`,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 24}px)`,
        }}
      >
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<SceneProps<ClayProps>>[] = [TitleScene];

export const Clay: React.FC<ClayProps> = (props) => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [0, 210], [1.06, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: props.theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${pull})`}}>
        <Scene3D camera={{position: [0, 0, 12], fov: 38}}>
          <World theme={props.theme} />
        </Scene3D>
      </AbsoluteFill>
      <SceneTrack meta={clayMeta} scenes={SCENES} props={props} />
    </AbsoluteFill>
  );
};
