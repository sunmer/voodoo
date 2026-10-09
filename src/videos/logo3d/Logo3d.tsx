import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, random, useCurrentFrame} from 'remotion';
import {LITE, clamp, easeInOut, easeOut, fit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import {logo3dMeta} from './meta';
import type {Logo3dProps} from './schema';

loadTemplateFonts();

type Theme = Logo3dProps['theme'];

const LOCK = 100;
const EMBLEM_Y = 1.4;
const FLOOR_Y = -0.6;
const snap = Easing.bezier(0.5, 0, 0.85, 0.6);

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

type Piece = {
  kind: 'box' | 'tetra' | 'core';
  target: [number, number, number];
  targetRot: [number, number, number];
  accent2: boolean;
};

// Emblem layout: a faceted core, an inner ring of tetrahedrons, an outer ring of thin plates.
const PIECES: Piece[] = (() => {
  const list: Piece[] = [{kind: 'core', target: [0, 0, 0], targetRot: [0.3, 0.5, 0], accent2: true}];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    list.push({kind: 'tetra', target: [Math.cos(a) * 0.98, Math.sin(a) * 0.98, 0], targetRot: [0.62, 0.78, a], accent2: i % 2 === 1});
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    list.push({kind: 'box', target: [Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0], targetRot: [0, 0, a + Math.PI / 2], accent2: i % 3 === 0});
  }
  return list;
})();

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Emblem: React.FC<{theme: Theme; ghost?: boolean}> = ({theme, ghost}) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [LOCK - 4, LOCK, LOCK + 24], [0, 1, 0], clamp);
  const spinY = interpolate(frame, [0, LOCK, 180], [0.7, 0.22, 0], {...clamp, easing: easeOut});
  const ring = interpolate(frame, [LOCK, LOCK + 26], [0, 1], {...clamp, easing: easeOut});
  const base = ghost ? 0.16 : 1;
  return (
    <group position={[0, EMBLEM_Y, 0]} rotation={[0, spinY, 0]} scale={1 + punch * 0.07}>
      {PIECES.map((p, i) => {
        const sx = (random(`l3-x-${i}`) - 0.5) * 15;
        const sy = (random(`l3-y-${i}`) - 0.5) * 8;
        const sz = -2 - random(`l3-z-${i}`) * 9;
        const phase = random(`l3-p-${i}`) * Math.PI * 2;
        const start = 22 + random(`l3-d-${i}`) * 26;
        const t = interpolate(frame, [start, LOCK], [0, 1], {...clamp, easing: snap});
        const drift = Math.sin(frame * 0.035 + phase) * 0.35 * (1 - t);
        const pos: [number, number, number] = [
          lerp(sx + drift, p.target[0], t),
          lerp(sy + Math.cos(frame * 0.03 + phase) * 0.3 * (1 - t), p.target[1], t),
          lerp(sz, p.target[2], t),
        ];
        const rot: [number, number, number] = [0, 1, 2].map((k) => {
          const r0 = random(`l3-r${k}-${i}`) * Math.PI * 2 + frame * 0.02 * (k + 1);
          return lerp(r0, p.targetRot[k], t);
        }) as [number, number, number];
        const color = p.accent2 ? theme.accent2 : theme.accent;
        return (
          <mesh key={i} position={pos} rotation={rot}>
            {p.kind === 'core' && <icosahedronGeometry args={[0.56, 0]} />}
            {p.kind === 'tetra' && <tetrahedronGeometry args={[0.44, 0]} />}
            {p.kind === 'box' && <boxGeometry args={[0.76, 0.24, 0.12]} />}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.08 + punch * 0.35}
              metalness={0.35}
              roughness={0.18}
              flatShading
              transparent={ghost}
              opacity={base}
              depthWrite={!ghost}
            />
          </mesh>
        );
      })}
      <mesh scale={0.7 + ring * 0.3}>
        <torusGeometry args={[2.0, 0.014, 8, 180]} />
        <meshStandardMaterial
          color={theme.foreground}
          emissive={theme.foreground}
          emissiveIntensity={0.6}
          transparent
          opacity={ring * 0.7 * base}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const World: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const orbit = interpolate(frame, [0, 180], [-Math.PI / 6, 0], {...clamp, easing: easeInOut});
  const dolly = interpolate(frame, [0, 180], [-7, 0], {...clamp, easing: easeInOut});
  const sweepX = interpolate(frame, [94, 124], [-5.5, 5.5], clamp);
  const sweepI = interpolate(frame, [94, 104, 124], [0, 46, 0], clamp);
  return (
    <>
      <hemisphereLight args={[theme.foreground, theme.background, 0.9]} />
      <directionalLight position={[3, 5, 7]} intensity={2.4} />
      <directionalLight position={[-6, 2, -3]} intensity={1.6} color={theme.accent2} />
      <directionalLight position={[5, -3, 2]} intensity={0.9} color={theme.accent} />
      <group position={[0, 0, dolly]} rotation={[0.05, orbit, 0]}>
        <pointLight position={[sweepX, EMBLEM_Y + 0.4, 2.4]} intensity={sweepI} decay={2} color={theme.foreground} />
        <Emblem theme={theme} />
        <group position={[0, FLOOR_Y * 2, 0]} scale={[1, -1, 1]}>
          <Emblem theme={theme} ghost />
        </group>
      </group>
    </>
  );
};

const Stars: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 180], [1, 1.18], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      {Array.from({length: 90}, (_, i) => {
        const x = random(`l3-sx-${i}`) * 1920;
        const y = random(`l3-sy-${i}`) * 700;
        const s = 1 + random(`l3-ss-${i}`) * 2.4;
        const tw = 0.35 + 0.3 * Math.sin(frame * 0.05 + i);
        return (
          <div
            key={i}
            style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: theme.foreground, opacity: tw * (1 - y / 900)}}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.background} 35%, ${theme.surface} 100%)`}}>
    <Stars theme={theme} />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 560,
        height: 520,
        background: `radial-gradient(ellipse 55% 40% at 50% 10%, ${theme.accent}2e, transparent 70%)`,
      }}
    />
    <div style={{position: 'absolute', left: 260, right: 260, top: 585, height: 1, background: `linear-gradient(90deg, transparent, ${theme.foreground}30, transparent)`}} />
  </AbsoluteFill>
);

const Sweep: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [96, 122], [-500, 2400], {...clamp, easing: easeInOut});
  const o = interpolate(frame, [96, 102, 116, 122], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: LITE ? undefined : 'screen',
        opacity: LITE ? o * 0.5 : o,
        WebkitMaskImage: 'radial-gradient(circle 340px at 50% 340px, #000 55%, transparent 100%)',
        maskImage: 'radial-gradient(circle 340px at 50% 340px, #000 55%, transparent 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: x,
          width: 160,
          height: 1200,
          transform: 'rotate(18deg)',
          background: `linear-gradient(90deg, transparent, ${theme.foreground}99 48%, ${theme.foreground} 50%, ${theme.foreground}99 52%, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneLogo: React.FC<Logo3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [LOCK + 8, LOCK + 38], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [LOCK + 26, LOCK + 60], [0, 1], {...clamp, easing: easeInOut});
  const size = fit(texts.brand, 150, 1500, 0.66);
  return (
    <AbsoluteFill>
      <Scene3D camera={{position: [0, 0, 12], fov: 35}}>
        <World theme={theme} />
      </Scene3D>
      <Sweep theme={theme} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 610, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{overflow: 'hidden', paddingBottom: 8}}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: size,
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              color: theme.foreground,
              whiteSpace: 'nowrap',
              transform: `translateY(${(1 - rise) * 110}%)`,
              textShadow: `0 10px 40px ${theme.background}`,
            }}
          >
            <Role role="brand">{texts.brand}</Role>
          </div>
        </div>
        <div style={{marginTop: 14, width: 360 * line, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`}} />
      </div>
    </AbsoluteFill>
  );
};

const SceneHeadline: React.FC<Logo3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 28], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 818,
          textAlign: 'center',
          fontFamily: SANS_FONT,
          fontWeight: 500,
          fontSize: fit(texts.headline, 50, 1400, 0.55),
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
          color: `${theme.foreground}c4`,
          opacity: t,
          transform: `translateY(${(1 - t) * 24}px)`,
          filter: LITE || t > 0.98 ? undefined : `blur(${(1 - t) * 8}px)`,
        }}
      >
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<Logo3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 926,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 38px',
          borderRadius: 999,
          border: `2px solid ${theme.accent}`,
          background: `${theme.accent}22`,
          color: theme.foreground,
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: fit(texts.cta, 32, 520, 0.62),
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          opacity: t,
          transform: `scale(${0.94 + t * 0.06})`,
        }}
      >
        <div style={{width: 12, height: 12, borderRadius: '50%', background: theme.accent2}} />
        <Role role="cta">{texts.cta}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<Logo3dProps>[] = [SceneLogo, SceneHeadline, SceneCta];

export const Logo3d: React.FC<Logo3dProps> = (props) => (
  <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden'}}>
    <Backdrop theme={props.theme} />
    {logo3dMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
    <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)'}} />
  </AbsoluteFill>
);
