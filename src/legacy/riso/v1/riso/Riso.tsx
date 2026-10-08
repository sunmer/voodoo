import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {DISPLAY, MONO_FONT, loadTemplateFonts} from '../shared/fonts';
import {risoMeta} from './meta';
import type {RisoProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 72;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?';

// Halftone dots as a repeating radial gradient; size grows with `amount`.
const halftone = (color: string, cell: number, amount: number): React.CSSProperties => ({
  backgroundImage: `radial-gradient(circle, ${color} ${Math.max(0.1, amount * 48)}%, transparent ${Math.max(0.2, amount * 48 + 2)}%)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Text revealed by scrambling glyphs that resolve left to right.
const scramble = (text: string, frame: number, start: number, speed = 1.2) =>
  text
    .split('')
    .map((ch, i) => {
      const t = (frame - start) * speed - i;
      if (t < 0) return '\u00A0';
      if (t > 6 || ch === ' ') return ch;
      return GLYPHS[Math.floor(random(`${text}${i}${frame}`) * GLYPHS.length)];
    })
    .join('');

// Two ink layers, slightly misregistered like a risograph print.
const Ink: React.FC<{text: string; size: number; a: string; b: string; offset: number; weight?: number}> = ({text, size, a, b, offset, weight = 900}) => (
  <div style={{position: 'relative', fontSize: size, fontWeight: weight, lineHeight: 0.92, textTransform: 'uppercase'}}>
    <div style={{color: b, position: 'absolute', left: offset, top: offset * 0.6, opacity: 0.9}}>{text}</div>
    <div style={{color: a, position: 'relative'}}>{text}</div>
  </div>
);

const Paper: React.FC<{theme: Theme}> = ({theme}) => (
  <AbsoluteFill style={{background: theme.background}}>
    <AbsoluteFill style={{...halftone(`${theme.foreground}12`, 10, 0.18)}} />
  </AbsoluteFill>
);

const SceneCover: React.FC<RisoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const dot = interpolate(frame, [0, 50], [0, 1], {...clamp, easing: easeOut});
  const reg = interpolate(frame, [20, 60], [26, 8], {...clamp, easing: easeOut});
  const words = texts.headline.toUpperCase().split(' ');
  const size = Math.min(200, ...words.map((w) => (W - PAD * 2) / (Math.max(w.length, 3) * 0.72)));
  const sun = spring({frame: frame - 6, fps: 30, config: {damping: 18, stiffness: 70}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', right: -160, top: 140, width: 760, height: 760, borderRadius: 380, ...halftone(theme.accent2, 26, dot), transform: `scale(${sun})`}} />
      <div style={{position: 'absolute', left: -120, bottom: 120, width: 620, height: 620, ...halftone(theme.accent, 22, dot * 0.8), transform: `rotate(${frame * 0.2}deg) scale(${sun})`}} />
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 64, display: 'flex', justifyContent: 'space-between', fontFamily: MONO_FONT, fontSize: 24, fontWeight: 700, color: theme.foreground}}>
        <span><span data-text-role={"brand"} style={{display: 'contents'}}>{scramble(texts.brand.toUpperCase(), frame, 2)}</span></span>
        <span>{'ED. 26'}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 150}}>
        <span data-text-role={"headline"} style={{display: 'contents'}}>{words.map((w, i) => (
          <div key={i} style={{overflow: 'hidden', paddingBottom: 6}}>
            <div style={{transform: `translateY(${interpolate(frame - 8 - i * 6, [0, 22], [110, 0], {...clamp, easing: easeOut})}%)`}}>
              <Ink text={w} size={size} a={theme.foreground} b={theme.accent} offset={reg} />
            </div>
          </div>
        ))}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, bottom: 70, fontFamily: MONO_FONT, fontSize: 22, color: theme.foreground, opacity: 0.7}}>{'PRINTED IN TWO COLOURS \u2022 NO. 001'}</div>
    </AbsoluteFill>
  );
};

const SceneList: React.FC<RisoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  const head = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, paddingTop: 110}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 30, lineHeight: 1.4, fontWeight: 600, color: theme.foreground, maxWidth: 800, minHeight: 130}}><span data-text-role={"subhead"} style={{display: 'contents'}}>{scramble(texts.subhead, frame, 0, 2.4)}</span></div>
      <div style={{height: 4, background: theme.foreground, marginTop: 30, width: `${head * 100}%`}} />
      <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 26}}>
        {items.map((t, i) => {
          const d = 12 + i * 10;
          const s = interpolate(frame - d, [0, 22], [0, 1], {...clamp, easing: easeOut});
          const bg = [theme.accent, theme.accent2, theme.foreground][i];
          const fg = i === 2 ? theme.background : theme.foreground;
          return (
            <div key={i} style={{position: 'relative', height: 260, overflow: 'hidden', clipPath: `inset(0 ${(1 - s) * 100}% 0 0)`}}>
              <AbsoluteFill style={{background: bg}} />
              <AbsoluteFill style={{...halftone(`${theme.background}55`, 14, 0.3 + 0.2 * Math.sin(frame / 10 + i))}} />
              <div style={{position: 'absolute', left: 40, top: 30, fontFamily: MONO_FONT, fontSize: 26, fontWeight: 700, color: fg}}>{`(${i + 1})`}</div>
              <div style={{position: 'absolute', left: 40, right: 40, bottom: 26, fontFamily: DISPLAY, fontSize: fit(t, 140, W - PAD * 2 - 80, 0.76), fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', whiteSpace: 'nowrap', color: fg}}>
                <span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{scramble(t.toUpperCase(), frame, d + 4, 1.6)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneStamp: React.FC<RisoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 9, stiffness: 160}});
  const btn = spring({frame: frame - 20, fps, config: {damping: 13, stiffness: 140}});
  const r = 330;
  const ring = `${texts.brand.toUpperCase()} \u2022 ${texts.cta.toUpperCase()} \u2022 `;
  const chars = ring.repeat(Math.max(1, Math.floor(60 / ring.length))).split('');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', width: r * 2.4, height: r * 2.4, borderRadius: r * 1.2, ...halftone(theme.accent2, 24, 0.42), transform: `scale(${s})`, top: H / 2 - r * 1.2 - 120}} />
      <div style={{position: 'absolute', width: r * 2, height: r * 2, top: H / 2 - r - 120, transform: `rotate(${frame * 0.8}deg) scale(${s})`}}>
        {chars.map((ch, i) => (
          <span key={i} style={{position: 'absolute', left: r - 14, top: 0, width: 28, height: r * 2, textAlign: 'center', transform: `rotate(${(i / chars.length) * 360}deg)`, fontFamily: MONO_FONT, fontSize: 32, fontWeight: 800, color: theme.foreground}}>
            {ch}
          </span>
        ))}
      </div>
      <div style={{position: 'absolute', top: H / 2 - 120, transform: `translateY(-50%) rotate(-6deg) scale(${s})`}}>
        <span data-text-role={"brand"} style={{display: 'contents'}}><Ink text={texts.brand} size={fit(texts.brand, 150, 520, 0.72)} a={theme.foreground} b={theme.accent} offset={8} /></span>
      </div>
      <div style={{position: 'absolute', bottom: 150, display: 'flex', alignItems: 'center', gap: 18, height: 104, padding: '0 50px', background: theme.foreground, color: theme.background, fontFamily: DISPLAY, fontSize: fit(texts.cta, 46, 700, 0.66), fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: `10px 10px 0 ${theme.accent}`, opacity: btn, transform: `translateY(${(1 - btn) * 60}px)`}}>
        <span data-text-role={"cta"} style={{display: 'contents'}}>{texts.cta}</span>
        <ArrowIcon size={42} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<RisoProps>[] = [SceneCover, SceneList, SceneStamp];

// Halftone dots swell to cover the cut, then shrink away.
const DotWipe: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const a = frame < 8 ? interpolate(frame, [0, 8], [0, 1.1], {...clamp, easing: easeInOut}) : interpolate(frame, [8, 16], [1.1, 0], {...clamp, easing: easeIn});
  return <AbsoluteFill style={halftone(theme.foreground, 40, a)} />;
};

export const Riso: React.FC<RisoProps> = (props) => (
  <AbsoluteFill style={{fontFamily: DISPLAY, overflow: 'hidden'}}>
    <Paper theme={props.theme} />
    {risoMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
    {risoMeta.scenes.slice(1).map((s) => (
      <Sequence key={s.from} name="transition" from={s.from - 8} durationInFrames={16}>
        <DotWipe theme={props.theme} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
