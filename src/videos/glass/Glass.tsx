import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {glassMeta} from './meta';
import type {GlassProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 80;

// Slowly flowing color field drawn with gradients only (no filters), so it stays light on phones.
const Liquid: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const p = (ax: number, ay: number, sp: number, ph: number) => [50 + Math.sin(t * sp + ph) * ax, 50 + Math.cos(t * sp * 0.8 + ph) * ay];
  const [a, b, c] = [p(30, 28, 0.7, 0), p(34, 30, 0.55, 2), p(26, 34, 0.9, 4)];
  return (
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(circle at ${a[0]}% ${a[1]}%, ${theme.accent} 0%, transparent 42%)`,
          `radial-gradient(circle at ${b[0]}% ${b[1]}%, ${theme.accent2} 0%, transparent 46%)`,
          `radial-gradient(circle at ${c[0]}% ${c[1]}%, ${theme.surface} 0%, transparent 50%)`,
          theme.background,
        ].join(','),
      }}
    />
  );
};

// A glass panel: translucent fill, bright top edge, inner highlight.
const glass = (theme: Theme, radius: number): React.CSSProperties => ({
  borderRadius: radius,
  background: `linear-gradient(160deg, ${theme.foreground}38, ${theme.foreground}12 45%, ${theme.foreground}1f)`,
  border: `2px solid ${theme.foreground}55`,
  boxShadow: `inset 0 2px 0 ${theme.foreground}88, inset 0 -30px 60px ${theme.background}22, 0 40px 90px rgba(0,0,0,0.25)`,
});

const SceneHero: React.FC<GlassProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 4, fps, config: {damping: 16, stiffness: 90}});
  const line = (d: number) => interpolate(frame - d, [0, 22], [0, 1], {...clamp, easing: easeOut});
  const words = texts.headline.split(' ');
  const size = Math.min(150, ...words.map((w) => (W - PAD * 2 - 120) / (Math.max(w.length, 3) * 0.58)));
  const sheen = interpolate(frame, [20, 60], [-120, 220], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <div style={{...glass(theme, 64), position: 'relative', overflow: 'hidden', padding: '80px 64px', transform: `translateY(${(1 - card) * 400}px) rotate(${(1 - card) * -6}deg)`, opacity: card}}>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${sheen}%`, width: '30%', background: `linear-gradient(100deg, transparent, ${theme.foreground}30, transparent)`, transform: 'skewX(-18deg)'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 650, color: theme.foreground, opacity: line(10)}}>
          <span style={{width: 44, height: 44, borderRadius: 22, background: theme.foreground, color: theme.background, display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800}}>{texts.brand[0]}</span>
          {texts.brand}
        </div>
        <div style={{marginTop: 70, fontSize: size, fontWeight: 760, lineHeight: 1, color: theme.foreground}}>
          {words.map((w, i) => (
            <div key={i} style={{overflow: 'hidden', paddingBottom: 8}}>
              <div style={{transform: `translateY(${(1 - line(16 + i * 5)) * 110}%)`}}>{w}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 44, fontSize: 40, lineHeight: 1.3, color: `${theme.foreground}cc`, opacity: line(34)}}>{texts.subhead}</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneNotify: React.FC<GlassProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  const clock = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, paddingTop: 220}}>
      <div style={{textAlign: 'center', color: theme.foreground, opacity: clock}}>
        <div style={{fontSize: 34, fontWeight: 600, opacity: 0.8}}>{texts.brand}</div>
        <div style={{fontSize: 210, fontWeight: 300, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums'}}>{'9:41'}</div>
      </div>
      <div style={{marginTop: 120, display: 'flex', flexDirection: 'column', gap: 30}}>
        {items.map((t, i) => {
          const s = spring({frame: frame - 14 - i * 12, fps, config: {damping: 15, stiffness: 130}});
          return (
            <div key={i} style={{...glass(theme, 44), display: 'flex', alignItems: 'center', gap: 32, padding: '36px 40px', opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * -160}px) scale(${0.9 + s * 0.1})`}}>
              <div style={{width: 96, height: 96, flex: 'none', borderRadius: 26, background: i === 1 ? theme.accent2 : theme.accent, display: 'grid', placeItems: 'center'}}>
                <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={theme.background} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d={['M5 12l4 4L19 6', 'M12 6v6l4 2', 'M13 2L4 14h7l-1 8 9-12h-7z'][i]} />
                </svg>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, color: `${theme.foreground}aa`, fontWeight: 600}}>
                  <span>{texts.brand}</span>
                  <span>{i === 0 ? 'now' : `${i * 2}m ago`}</span>
                </div>
                <div style={{marginTop: 8, fontSize: fit(t, 54, 640, 0.56), fontWeight: 700, color: theme.foreground, whiteSpace: 'nowrap'}}>{t}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneOrb: React.FC<GlassProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 80}});
  const btn = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 140}});
  const wobble = Math.sin(frame / 8) * 4;
  const d = 640;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          ...glass(theme, d),
          width: d + wobble,
          height: d - wobble,
          display: 'grid',
          placeItems: 'center',
          transform: `scale(${s})`,
          marginBottom: 260,
        }}
      >
        <div style={{fontSize: fit(texts.brand, 120, d - 140, 0.58), fontWeight: 800, color: theme.foreground, textAlign: 'center', lineHeight: 1}}>{texts.brand}</div>
      </div>
      <div
        style={{
          ...glass(theme, 60),
          position: 'absolute',
          bottom: 380,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          height: 120,
          padding: '0 60px',
          fontSize: fit(texts.cta, 52, 760, 0.55),
          fontWeight: 750,
          color: theme.foreground,
          whiteSpace: 'nowrap',
          opacity: btn,
          transform: `translateY(${(1 - btn) * 80}px)`,
        }}
      >
        {texts.cta}
        <ArrowIcon size={46} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<GlassProps>[] = [SceneHero, SceneNotify, SceneOrb];

const Melt: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const exit = last ? 0 : interpolate(frame, [duration - 14, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{opacity: 1 - exit, transform: `translateY(${exit * -120}px) scale(${1 + exit * 0.05})`}}>{children}</AbsoluteFill>;
};

export const Glass: React.FC<GlassProps> = (props) => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden', background: props.theme.background}}>
      <AbsoluteFill style={{opacity: intro}}>
        <Liquid theme={props.theme} />
      </AbsoluteFill>
      {glassMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Melt duration={s.duration} last={i === glassMeta.scenes.length - 1}>
              <Scene {...props} />
            </Melt>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
