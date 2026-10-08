import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, Grain, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {blackfridayMeta} from './meta';
import type {BlackfridayProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 84;
type P = SceneProps<BlackfridayProps>;

const Tape: React.FC<{theme: Theme; text: string; top: number; angle: number; speed: number}> = ({theme, text, top, angle, speed}) => {
  const frame = useCurrentFrame();
  const unit = `${text.toUpperCase()}  ✦  `;
  return (
    <div style={{position: 'absolute', left: -200, top, width: W + 400, height: 86, background: theme.accent, color: theme.background, transform: `rotate(${angle}deg)`, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
      <div style={{whiteSpace: 'pre', fontFamily: DISPLAY, fontSize: 46, fontWeight: 900, transform: `translateX(${-((frame * speed) % 600)}px)`}}>{unit.repeat(12)}</div>
    </div>
  );
};

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.headline.split(' ');
  // Each word is its own line, so fit the longest word to the width and all words to the height.
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 230, W - PAD * 2, 0.78), 1040 / (words.length * 0.9));
  const sub = interpolate(frame, [40, 60], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <Tape theme={theme} text={texts.brand} top={170} angle={-6} speed={6} />
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 520, fontFamily: DISPLAY, fontSize: size, lineHeight: 0.9, fontWeight: 900, textTransform: 'uppercase', color: theme.foreground}}>
        <span data-text-role="headline" style={{display: 'contents'}}>{words.map((w, i) => {
          const s = spring({frame: frame - 8 - i * 7, fps, config: {damping: 11, stiffness: 160}});
          return <div key={i} style={{transform: `scale(${0.4 + s * 0.6}) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, opacity: Math.min(1, s * 2), transformOrigin: '0 50%', color: i === words.length - 1 ? theme.accent : theme.foreground}}>{w}</div>;
        })}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 260, fontSize: 48, lineHeight: 1.22, fontWeight: 600, color: `${theme.foreground}cc`, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneDeals: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 40}}>
      {items.map((item, i) => {
        const s = spring({frame: frame - i * 10, fps, config: {damping: 14, stiffness: 140}});
        const hot = i === 0;
        return (
          <div key={i} style={{height: 300, borderRadius: 8, padding: '0 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: hot ? theme.accent : theme.surface, color: hot ? theme.background : theme.foreground, transform: `translateX(${(1 - s) * (i % 2 ? 1 : -1) * 1100}px) rotate(${(i - 1) * -1.5}deg)`}}>
            <span style={{fontFamily: DISPLAY, fontSize: fit(item, 112, 700, 0.76), fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
              <span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{item}</span>
            </span>
            <span style={{fontFamily: MONO_FONT, fontSize: 30, fontWeight: 700}}>0{i + 1}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneShop: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = spring({frame, fps, config: {damping: 15, stiffness: 120}});
  const cta = spring({frame: frame - 18, fps, config: {damping: 10, stiffness: 160}});
  const pulse = 1 + Math.max(0, Math.sin((frame - 30) / 6)) * 0.04;
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <Tape theme={theme} text={texts.cta} top={250} angle={5} speed={-5} />
      <Tape theme={theme} text={texts.cta} top={1560} angle={-5} speed={5} />
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 170, W - PAD * 2, 0.78), lineHeight: 1, fontWeight: 900, textTransform: 'uppercase', color: theme.foreground, transform: `scale(${brand})`}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{marginTop: 70, height: 130, display: 'flex', alignItems: 'center', gap: 24, padding: '0 60px', borderRadius: 65, background: theme.accent2, color: theme.background, fontSize: fit(texts.cta, 56, 700, 0.58), fontWeight: 850, transform: `scale(${cta * pulse})`}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={50} />
      </div>
    </AbsoluteFill>
  );
};

export const Blackfriday: React.FC<BlackfridayProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={blackfridayMeta} scenes={[SceneTitle, SceneDeals, SceneShop]} props={props} exit="slide" />
    <Grain />
  </AbsoluteFill>
);
