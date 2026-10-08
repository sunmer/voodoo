import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {sliceMeta} from './meta';
import type {SliceProps} from './schema';

loadTemplateFonts();

const S = 1080;
const PAD = 82;

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: theme.background}}>
      {[0, 1, 2].map((i) => {
        const x = interpolate(frame + i * 32, [0, 240], [-500, 460]);
        return <div key={i} style={{position: 'absolute', left: x + i * 240, top: -260, width: 92, height: 1600, background: i === 1 ? `${theme.accent2}26` : `${theme.foreground}0d`, transform: 'rotate(28deg)'}} />;
      })}
    </AbsoluteFill>
  );
};

const Cut: React.FC<{theme: Theme; color: string; delay: number; index: number}> = ({theme, color, delay, index}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 20], [0, 1], {...clamp, easing: easeOut});
  return <div style={{position: 'absolute', left: -220, top: 110 + index * 170, width: 1520, height: 118, background: color, transform: `translateX(${(1 - t) * (index % 2 ? 1200 : -1200)}px) rotate(-12deg)`, boxShadow: `0 20px 50px ${theme.background}44`}} />;
};

const SceneTitle: React.FC<SliceProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = wrapFit(texts.headline, 166, S - PAD * 2, 3, 0.62);
  const words = texts.headline.split(' ');
  const tag = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <Cut theme={theme} color={theme.accent} delay={0} index={0} />
      <Cut theme={theme} color={theme.surface} delay={7} index={2} />
      <Cut theme={theme} color={theme.accent2} delay={14} index={4} />
      <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
        <div style={{alignSelf: 'flex-start', padding: '12px 20px', background: theme.foreground, color: theme.background, fontFamily: MONO_FONT, fontSize: 25, fontWeight: 750, textTransform: 'uppercase', opacity: tag, transform: `translateY(${(1 - tag) * -30}px)`}}>
          <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
        </div>
        <div style={{marginTop: 42, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.2, fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, fontWeight: 900, color: theme.foreground}}>
          <span data-text-role="headline" style={{display: 'contents'}}>{words.map((word, i) => {
            const t = interpolate(frame - 12 - i * 6, [0, 22], [0, 1], {...clamp, easing: easeOut});
            return <span key={i} style={{display: 'inline-block', clipPath: `polygon(0 0, ${t * 120}% 0, ${t * 100}% 100%, 0 100%)`, transform: `translateX(${(1 - t) * 50}px) skewX(${(1 - t) * -12}deg)`}}>{word}</span>;
          })}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneList: React.FC<SliceProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill style={{justifyContent: 'center', gap: 34}}>
      {items.map((item, i) => {
        const s = spring({frame: frame - i * 10, fps, config: {damping: 15, stiffness: 120}});
        const color = [theme.accent, theme.surface, theme.accent2][i];
        const text = theme.background;
        return (
          <div key={i} style={{height: 210, marginLeft: i % 2 ? 150 : -50, marginRight: i % 2 ? -50 : 150, display: 'flex', alignItems: 'center', gap: 34, padding: i % 2 ? '0 80px 0 70px' : '0 70px 0 130px', background: color, color: text, clipPath: 'polygon(7% 0, 100% 0, 93% 100%, 0 100%)', transform: `translateX(${(1 - s) * (i % 2 ? 1100 : -1100)}px)`}}>
            <span style={{fontFamily: MONO_FONT, fontSize: 30, fontWeight: 800}}>0{i + 1}</span>
            <span style={{fontFamily: DISPLAY, fontSize: fit(item, 82, 620, 0.62), fontWeight: 900, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{item}</span></span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<SliceProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const split = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: easeInOut});
  const brand = spring({frame: frame - 12, fps, config: {damping: 15, stiffness: 110}});
  const cta = spring({frame: frame - 25, fps, config: {damping: 13, stiffness: 140}});
  return (
    <AbsoluteFill style={{background: theme.foreground}}>
      <div style={{position: 'absolute', inset: 0, background: theme.accent, clipPath: `polygon(0 0, ${split * 78}% 0, ${split * 48}% 100%, 0 100%)`}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 70, padding: PAD}}>
        <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 150, S - PAD * 2, 0.64), lineHeight: 1, fontWeight: 900, color: theme.background, opacity: brand, transform: `translateY(${(1 - brand) * 70}px)`}}>
          <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
        </div>
        <div style={{height: 112, display: 'flex', alignItems: 'center', gap: 20, padding: '0 50px', background: theme.background, color: theme.foreground, fontSize: fit(texts.cta, 48, 680, 0.56), fontWeight: 820, transform: `scale(${cta})`, clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)'}}>
          <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={42} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<SliceProps>[] = [SceneTitle, SceneList, SceneLockup];

const Exit: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const t = last ? 0 : interpolate(frame, [duration - 12, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{clipPath: `polygon(${t * 100}% 0, 100% 0, 100% 100%, ${t * 60}% 100%)`}}>{children}</AbsoluteFill>;
};

export const Slice: React.FC<SliceProps> = (props) => (
  <AbsoluteFill style={{width: S, height: S, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <Backdrop theme={props.theme} />
    {sliceMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}><Exit duration={s.duration} last={i === SCENES.length - 1}><Scene {...props} /></Exit></Sequence>;
    })}
  </AbsoluteFill>
);
