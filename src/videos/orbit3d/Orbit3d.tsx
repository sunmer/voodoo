import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Scene3D} from '../three/Scene3D';
import type {Orbit3dProps} from './schema';

loadTemplateFonts();

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// A ring of glossy blocks that spins up, then settles around the title.
const Rig: React.FC<{theme: Orbit3dProps['theme']}> = ({theme}) => {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [0, 120], [0, 1], {...clamp, easing: easeOut});
  const spin = settle * Math.PI * 2.4 + frame * 0.004;
  const tilt = interpolate(frame, [0, 120], [1.1, 0.42], {...clamp, easing: easeInOut});
  const radius = interpolate(frame, [0, 110], [1.2, 4.3], {...clamp, easing: easeOut});
  const blocks = Array.from({length: 14}, (_, i) => i);
  return (
    <>
      <hemisphereLight args={[theme.foreground, theme.background, 1.4]} />
      <directionalLight position={[4, 6, 8]} intensity={2.6} />
      <directionalLight position={[-6, -3, 2]} intensity={1.2} color={theme.accent} />
      <group rotation={[tilt, spin, 0]}>
        {blocks.map((i) => {
          const a = (i / blocks.length) * Math.PI * 2;
          const s = 0.28 + random(`orbit-size-${i}`) * 0.32;
          const y = (random(`orbit-y-${i}`) - 0.5) * 0.9;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, y, Math.sin(a) * radius]} rotation={[a, a * 1.7 + frame * 0.02, 0]}>
              <boxGeometry args={[s, s, s]} />
              <meshStandardMaterial color={i % 3 === 0 ? theme.accent2 : theme.accent} metalness={0.15} roughness={0.32} />
            </mesh>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.018, 8, 160]} />
          <meshStandardMaterial color={theme.foreground} emissive={theme.foreground} emissiveIntensity={0.4} />
        </mesh>
      </group>
    </>
  );
};

export const Orbit3d: React.FC<Orbit3dProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [70, 120], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [100, 132], [0, 1], {...clamp, easing: easeOut});
  const brand = interpolate(frame, [20, 60], [0, 1], clamp);
  const pull = interpolate(frame, [0, 210], [1.06, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${theme.surface}, ${theme.background} 72%)`, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${pull})`}}>
        <Scene3D camera={{position: [0, 0, 11], fov: 42}}>
          <Rig theme={theme} />
        </Scene3D>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 160px'}}>
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 30, 800, 0.62), letterSpacing: 0, color: theme.accent, textTransform: 'uppercase', opacity: brand, marginBottom: 28}}>
          <Role role="brand">{texts.brand}</Role>
        </div>
        <div style={{fontFamily: FLEX_FONT, fontWeight: 850, fontSize: wrapFit(texts.headline, 150, 1400, 2, 0.62, 64), lineHeight: 1, color: theme.foreground,
          opacity: title, transform: `translateY(${(1 - title) * 40}px) scale(${0.92 + title * 0.08})`, textShadow: `0 12px 50px ${theme.background}`}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
        <div style={{marginTop: 34, maxWidth: 1100, fontSize: wrapFit(texts.subhead, 40, 1100, 2, 0.52, 26), lineHeight: 1.3, color: `${theme.foreground}d1`, opacity: sub,
          transform: `translateY(${(1 - sub) * 18}px)`}}>
          <Role role="subhead">{texts.subhead}</Role>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
