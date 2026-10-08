import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, LITE, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {collageMeta} from './meta';
import type {CollageProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 72;

// Paper scrap with a torn bottom edge, dropped in with a spring and a slight tilt.
const Scrap: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  delay: number;
  bg: string;
  seed: string;
  tape?: string;
  children?: React.ReactNode;
}> = ({x, y, w, h, rot, delay, bg, seed, tape, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 140}});
  const teeth = 18;
  // Torn bottom edge, traced right to left so the polygon stays closed and convex at the top.
  const edge = Array.from({length: teeth + 1}, (_, i) => `${100 - (i / teeth) * 100}% ${100 - random(`${seed}${i}`) * 5}%`).join(',');
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot + (1 - s) * 18}deg) scale(${interpolate(s, [0, 1], [1.5, 1])})`, opacity: Math.min(1, s * 2)}}>
      <div style={{position: 'absolute', inset: 0, background: bg, clipPath: `polygon(0 0, 100% 0, ${edge})`, filter: LITE ? undefined : 'drop-shadow(0 18px 24px rgba(0,0,0,0.25))'}}>{children}</div>
      {tape && <div style={{position: 'absolute', left: '50%', top: -22, width: 160, height: 46, marginLeft: -80, background: `${tape}cc`, transform: `rotate(${-rot * 2 - 4}deg)`}} />}
    </div>
  );
};

// Hand-drawn loop or underline that draws itself on.
const Scribble: React.FC<{d: string; color: string; delay: number; width?: number; style?: React.CSSProperties; w: number; h: number}> = ({d, color, delay, width = 10, style, w, h}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 18], [0, 1], {...clamp, easing: easeInOut});
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', overflow: 'visible', ...style}}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Sticker: React.FC<{theme: Theme; text: string; delay: number; x: number; y: number; rot: number}> = ({theme, text, delay, x, y, rot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 8, stiffness: 180}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 230, height: 230, borderRadius: 115, background: theme.accent2, color: theme.background, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24, boxSizing: 'border-box', fontFamily: DISPLAY, fontSize: fit(text, 44, 180, 0.62), fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', transform: `rotate(${rot}deg) scale(${s})`, boxShadow: '0 14px 30px rgba(0,0,0,0.25)'}}>
      {text}
    </div>
  );
};

const SceneCover: React.FC<CollageProps> = ({texts, theme}) => {
  const words = texts.headline.split(' ');
  const half = Math.ceil(words.length / 2);
  const lines = words.length > 1 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : [texts.headline];
  const size = Math.min(170, ...lines.map((l) => (W - PAD * 2 - 150) / (l.length * 0.74)));
  return (
    <AbsoluteFill>
      <Scrap x={PAD} y={170} w={W - PAD * 2} h={140} rot={-2} delay={2} bg={theme.foreground} seed="a">
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', fontFamily: MONO_FONT, fontSize: 30, fontWeight: 700, color: theme.background, textTransform: 'uppercase'}}>
          <span><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></span>
          <span>{'zine 26'}</span>
        </div>
      </Scrap>
      <span data-text-role="headline" style={{display: 'contents'}}>{lines.map((l, i) => (
        <Scrap key={i} x={PAD + (i ? 60 : 0)} y={420 + i * 300} w={W - PAD * 2 - 60} h={270} rot={i ? 3 : -3} delay={10 + i * 8} bg={i ? theme.accent : theme.surface} seed={`h${i}`} tape={i ? undefined : theme.accent2}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 44px', fontFamily: i ? SERIF_FONT : DISPLAY, fontStyle: i ? 'italic' : 'normal', fontSize: size, fontWeight: i ? 600 : 900, lineHeight: 1, textTransform: i ? 'none' : 'uppercase', color: i ? theme.background : theme.foreground, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        </Scrap>
      ))}</span>
      <Scribble d="M40 60 C 260 10, 560 0, 820 40 S 900 120, 600 130 S 80 140, 40 60" color={theme.accent2} delay={34} w={900} h={160} style={{left: PAD + 20, top: 1080}} />
      <span data-text-role={"brand"} style={{display: 'contents'}}><Sticker theme={theme} text={texts.brand} delay={40} x={W - PAD - 250} y={1300} rot={12} /></span>
      <Scrap x={PAD + 30} y={1380} w={480} h={300} rot={-5} delay={26} bg={theme.surface} seed="p">
        <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, ${theme.foreground}22 0 2px, transparent 2px 46px)`}} />
        <div style={{position: 'absolute', inset: 36, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 50, lineHeight: 1.1, color: theme.foreground}}>{'cut, paste, repeat.'}</div>
      </Scrap>
    </AbsoluteFill>
  );
};

const SceneBoard: React.FC<CollageProps> = ({texts, theme}) => {
  const items = [texts.point1, texts.point2, texts.point3];
  const colors = [theme.accent, theme.surface, theme.accent2];
  return (
    <AbsoluteFill>
      <Scrap x={PAD} y={150} w={W - PAD * 2} h={360} rot={1.5} delay={0} bg={theme.foreground} seed="s" tape={theme.accent}>
        <div style={{position: 'absolute', inset: 50, display: 'flex', alignItems: 'center', fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: fit(texts.subhead, 74, (W - PAD * 2 - 100) * 2.3, 0.48), lineHeight: 1.12, color: theme.background}}><span data-text-role={"subhead"} style={{display: 'contents'}}>{`\u201C${texts.subhead}\u201D`}</span></div>
      </Scrap>
      {items.map((t, i) => {
        const y = 640 + i * 350;
        const rot = [-4, 3, -2][i];
        const fg = i === 1 ? theme.foreground : theme.background;
        return (
          <React.Fragment key={i}>
            <Scrap x={PAD + [0, 90, 30][i]} y={y} w={W - PAD * 2 - 120} h={290} rot={rot} delay={12 + i * 9} bg={colors[i]} seed={`p${i}`} tape={i === 1 ? theme.accent : undefined}>
              <div style={{position: 'absolute', left: 44, top: 34, fontFamily: MONO_FONT, fontSize: 28, fontWeight: 700, color: fg}}>{`no.${i + 1}`}</div>
              <div style={{position: 'absolute', left: 44, right: 44, bottom: 40, fontFamily: DISPLAY, fontSize: fit(t, 120, W - PAD * 2 - 210, 0.68), fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', color: fg}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{t}</span></div>
            </Scrap>
            <Scribble d="M10 30 L 60 70 L 150 0" color={theme.foreground} delay={24 + i * 9} width={14} w={160} h={80} style={{left: W - PAD - 150, top: y + 90}} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<CollageProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const btn = spring({frame: frame - 18, fps, config: {damping: 10, stiffness: 160}});
  return (
    <AbsoluteFill>
      <Scrap x={PAD - 20} y={520} w={W - PAD * 2 + 40} h={420} rot={-3} delay={0} bg={theme.accent} seed="e" tape={theme.foreground}>
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontSize: fit(texts.brand, 190, W - PAD * 2 - 80, 0.68), fontWeight: 900, textTransform: 'uppercase', color: theme.background, whiteSpace: 'nowrap'}}><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></div>
      </Scrap>
      <Scribble d="M20 40 C 200 0, 560 0, 860 30" color={theme.foreground} delay={10} width={14} w={880} h={60} style={{left: PAD + 20, top: 980}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1120, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, height: 120, padding: '0 56px', borderRadius: 60, background: theme.foreground, color: theme.background, fontFamily: DISPLAY, fontSize: fit(texts.cta, 52, 700, 0.66), fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap', transform: `rotate(${(1 - btn) * 10 + 2}deg) scale(${btn})`}}>
          <span data-text-role={"cta"} style={{display: 'contents'}}>{texts.cta}</span>
          <ArrowIcon size={46} />
        </div>
      </div>
      <span data-text-role={"point1"} style={{display: 'contents'}}><Sticker theme={theme} text={texts.point1} delay={26} x={W - PAD - 260} y={300} rot={-10} /></span>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<CollageProps>[] = [SceneCover, SceneBoard, SceneEnd];

const Shuffle: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const exit = last ? 0 : interpolate(frame, [duration - 12, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{transform: `translateX(${exit * -110}%) rotate(${exit * -8}deg)`}}>{children}</AbsoluteFill>;
};

export const Collage: React.FC<CollageProps> = (props) => {
  const {theme} = props;
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: theme.background}}>
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${theme.foreground}10 2px, transparent 2px), linear-gradient(90deg, ${theme.foreground}10 2px, transparent 2px)`, backgroundSize: '60px 60px', backgroundPosition: `0 ${frame * 0.4}px`}} />
      {collageMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Shuffle duration={s.duration} last={i === collageMeta.scenes.length - 1}>
              <Scene {...props} />
            </Shuffle>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
