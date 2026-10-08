import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, LITE, clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {prismMeta} from './meta';
import type {PrismProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;

const Field: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const r = frame * 0.12;
  return (
    <AbsoluteFill style={{background: theme.background}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: 980 + i * 145, top: -280 + i * 80, width: 560, height: 1500, background: `linear-gradient(90deg, ${[theme.accent, theme.accent2, theme.surface, theme.foreground][i]}${i === 3 ? '24' : '88'}, transparent 78%)`, transform: `rotate(${28 + r + i * 7}deg)`, transformOrigin: '50% 0'}} />
      ))}
      <AbsoluteFill style={{background: `linear-gradient(90deg, ${theme.background} 0%, ${theme.background}e8 38%, transparent 72%)`}} />
    </AbsoluteFill>
  );
};

const panel = (theme: Theme): React.CSSProperties => ({
  background: `linear-gradient(145deg, ${theme.foreground}30, ${theme.foreground}0d 46%, ${theme.surface}88)`,
  border: `2px solid ${theme.foreground}44`,
  boxShadow: `inset 0 2px 0 ${theme.foreground}66, 0 40px 90px rgba(0,0,0,.28)`,
  backdropFilter: LITE ? undefined : 'blur(18px)',
});

const SceneTitle: React.FC<PrismProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.headline.split(' ');
  const size = wrapFit(texts.headline, 140, 980, 3, 0.56);
  const label = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [38, 58], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: '0 150px', justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 26, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', opacity: label}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{marginTop: 32, width: 1060, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.22, fontSize: size, lineHeight: 0.98, fontWeight: 820, color: theme.foreground}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{words.map((word, i) => {
          const t = interpolate(frame - 7 - i * 5, [0, 25], [0, 1], {...clamp, easing: easeOut});
          return <span key={i} style={{display: 'inline-block', opacity: t, transform: `perspective(800px) translateY(${(1 - t) * 70}px) rotateX(${(1 - t) * -70}deg)`}}>{word}</span>;
        })}</span>
      </div>
      <div style={{marginTop: 38, width: 830, fontSize: 38, lineHeight: 1.3, color: `${theme.foreground}bb`, opacity: sub, transform: `translateY(${(1 - sub) * 24}px)`}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneCards: React.FC<PrismProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', perspective: 1500}}>
      <div style={{display: 'flex', gap: 42, transform: `rotateY(${Math.sin(frame / 34) * 4}deg)`}}>
        {items.map((item, i) => {
          const s = spring({frame: frame - i * 8, fps, config: {damping: 15, stiffness: 105}});
          const color = [theme.accent, theme.accent2, theme.foreground][i];
          return (
            <div key={i} style={{...panel(theme), width: 470, height: 610, borderRadius: 34, padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 260}px) rotateY(${(1 - s) * (i - 1) * 32}deg) rotateZ(${(i - 1) * 3}deg)`}}>
              <div style={{width: 112, height: 112, background: color, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'}} />
              <div>
                <div style={{fontFamily: MONO_FONT, fontSize: 24, fontWeight: 700, color, marginBottom: 20}}>0{i + 1}</div>
                <div style={{fontSize: fit(item, 58, 380, 0.56), lineHeight: 1, fontWeight: 820, color: theme.foreground, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{item}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<PrismProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const cta = spring({frame: frame - 20, fps, config: {damping: 13, stiffness: 140}});
  const spin = interpolate(frame, [0, 70], [-20, 18], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{...panel(theme), position: 'absolute', width: 720, height: 720, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)', transform: `scale(${s}) rotate(${spin}deg)`}} />
      <div style={{zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64}}>
        <div style={{fontSize: fit(texts.brand, 150, 1100, 0.62), lineHeight: 1, fontWeight: 860, color: theme.foreground, opacity: s}}><span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span></div>
        <div style={{height: 112, display: 'flex', alignItems: 'center', gap: 20, padding: '0 52px', borderRadius: 56, background: theme.foreground, color: theme.background, fontSize: fit(texts.cta, 46, 650, 0.55), fontWeight: 800, transform: `translateY(${(1 - cta) * 60}px)`, opacity: cta}}>
          <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={42} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<PrismProps>[] = [SceneTitle, SceneCards, SceneLockup];

const Exit: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const t = last ? 0 : interpolate(frame, [duration - 14, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{opacity: 1 - t, transform: `scale(${1 + t * 0.05})`}}>{children}</AbsoluteFill>;
};

export const Prism: React.FC<PrismProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <Field theme={props.theme} />
    {prismMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}><Exit duration={s.duration} last={i === SCENES.length - 1}><Scene {...props} /></Exit></Sequence>;
    })}
  </AbsoluteFill>
);
