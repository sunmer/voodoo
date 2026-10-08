import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {swissMeta} from './meta';
import type {SwissProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 76;

const Grid: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 34], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{background: theme.background}}>
      {[1, 2, 3].map((i) => <div key={`v${i}`} style={{position: 'absolute', left: PAD + i * ((W - PAD * 2) / 4), top: PAD, width: 2, height: (H - PAD * 2) * line, background: `${theme.foreground}18`}} />)}
      {[1, 2, 3, 4].map((i) => <div key={`h${i}`} style={{position: 'absolute', left: PAD, top: PAD + i * ((H - PAD * 2) / 5), height: 2, width: (W - PAD * 2) * line, background: `${theme.foreground}14`}} />)}
      <div style={{position: 'absolute', right: PAD, top: PAD + 82, width: 132, height: 132, borderRadius: '50%', background: theme.accent, transform: `scale(${line})`}} />
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<SwissProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = wrapFit(texts.headline, 138, W - PAD * 2, 3, 0.55);
  const words = texts.headline.split(' ');
  const sub = interpolate(frame, [36, 56], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO_FONT, fontSize: 24, fontWeight: 700, color: theme.foreground, textTransform: 'uppercase'}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span><span>01 / 03</span>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 410, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.22, fontSize: size, lineHeight: 0.96, fontWeight: 820, color: theme.foreground}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{words.map((word, i) => {
          const t = interpolate(frame - 10 - i * 5, [0, 22], [0, 1], {...clamp, easing: easeOut});
          return <span key={i} style={{overflow: 'hidden', display: 'inline-block'}}><span style={{display: 'inline-block', transform: `translateY(${(1 - t) * 105}%)`}}>{word}</span></span>;
        })}</span>
      </div>
      <div style={{position: 'absolute', left: PAD + (W - PAD * 2) / 2, right: PAD, bottom: 120, fontSize: 34, lineHeight: 1.25, color: `${theme.foreground}bb`, opacity: sub, transform: `translateY(${(1 - sub) * 24}px)`}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, bottom: 126, width: 240 * sub, height: 10, background: theme.accent2}} />
    </AbsoluteFill>
  );
};

const SceneGrid: React.FC<SwissProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  const cells = [{x: 0, y: 0, w: 2, h: 2}, {x: 2, y: 1, w: 2, h: 2}, {x: 0, y: 3, w: 3, h: 1}];
  const cw = (W - PAD * 2) / 4;
  const ch = (H - PAD * 2) / 5;
  return (
    <AbsoluteFill>
      {items.map((item, i) => {
        const c = cells[i];
        const s = spring({frame: frame - i * 10, fps, config: {damping: 17, stiffness: 115}});
        const bg = [theme.surface, theme.accent, theme.accent2][i];
        const fg = i === 0 ? theme.foreground : theme.background;
        return (
          <div key={i} style={{position: 'absolute', left: PAD + c.x * cw, top: PAD + c.y * ch + 70, width: c.w * cw, height: c.h * ch - 12, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: bg, color: fg, clipPath: `inset(0 ${(1 - s) * 100}% 0 0)`}}>
            <span style={{fontFamily: MONO_FONT, fontSize: 24, fontWeight: 750}}>0{i + 1}</span>
            <span style={{fontSize: fit(item, i === 2 ? 72 : 66, c.w * cw - 70, 0.56), lineHeight: 1, fontWeight: 820, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{item}</span></span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<SwissProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const block = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: easeInOut});
  const cta = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 140}});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H * block, background: theme.foreground}} />
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 430, fontSize: fit(texts.brand, 156, W - PAD * 2, 0.62), lineHeight: 0.95, fontWeight: 860, color: theme.background, opacity: block}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, bottom: PAD + 30, height: 108, display: 'flex', alignItems: 'center', gap: 22, padding: '0 44px', background: theme.accent, color: theme.background, fontSize: fit(texts.cta, 46, 650, 0.55), fontWeight: 820, transform: `translateX(${(1 - cta) * -300}px)`, opacity: cta}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={42} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<SwissProps>[] = [SceneTitle, SceneGrid, SceneLockup];

const Exit: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const t = last ? 0 : interpolate(frame, [duration - 12, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{opacity: 1 - t, transform: `translateX(${t * -80}px)`}}>{children}</AbsoluteFill>;
};

export const Swiss: React.FC<SwissProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <Grid theme={props.theme} />
    {swissMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}><Exit duration={s.duration} last={i === SCENES.length - 1}><Scene {...props} /></Exit></Sequence>;
    })}
  </AbsoluteFill>
);
