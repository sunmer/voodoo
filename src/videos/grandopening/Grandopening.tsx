import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {grandopeningMeta} from './meta';
import type {GrandopeningProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
const RIBBON_Y = 1020;
type P = SceneProps<GrandopeningProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Curtains part, then a ribbon is cut and the two halves fall away.
const SceneRibbon: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = interpolate(frame, [0, 36], [0, 1], {...clamp, easing: easeInOut});
  const cut = interpolate(frame, [60, 92], [0, 1], {...clamp, easing: easeInOut});
  const head = spring({frame: frame - 64, fps, config: {damping: 12, stiffness: 130}});
  const words = texts.headline.toUpperCase();
  const size = wrapFit(words, 180, W - PAD * 2, 3, 0.66, 60);
  const fold = (side: number) => ({
    position: 'absolute' as const, top: 0, height: H, width: W / 2 + 4, [side < 0 ? 'left' : 'right']: 0,
    background: `repeating-linear-gradient(90deg, ${theme.accent} 0 60px, ${theme.accent}cc 60px 120px)`,
    transform: `translateX(${side * open * 100}%)`,
  });
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 400, top: 200, width: 800, height: 1500, background: `radial-gradient(ellipse at 50% 30%, ${theme.surface}, ${theme.background} 70%)`, opacity: open}} />
      <div style={{position: 'absolute', top: 240, left: PAD, right: PAD, textAlign: 'center', fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, W - PAD * 2, 0.62), fontWeight: 700,
        color: theme.accent2, textTransform: 'uppercase', opacity: open}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 560, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, fontWeight: 900,
        color: theme.foreground, transform: `scale(${0.5 + head * 0.5})`, opacity: head}}>
        <Role role="headline">{words}</Role>
      </div>
      {[-1, 1].map((side) => (
        <div key={side} style={{position: 'absolute', top: RIBBON_Y - 40, height: 80, width: W / 2, [side < 0 ? 'left' : 'right']: 0, background: theme.accent2,
          transformOrigin: side < 0 ? 'left center' : 'right center', transform: `rotate(${side * -cut * 70}deg) translateY(${cut * 300}px)`, opacity: 1 - cut * 0.7}} />
      ))}
      <div style={{position: 'absolute', left: W / 2 - 70, top: RIBBON_Y - 70, width: 140, height: 140, borderRadius: '50%', background: theme.accent2, transform: `scale(${1 - cut})`}} />
      <div style={fold(-1)} />
      <div style={fold(1)} />
    </AbsoluteFill>
  );
};

const SceneVisit: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 170}});
  const pin = interpolate(frame, [20, 44], [0, 1], {...clamp, easing: easeOut});
  const cta = spring({frame: frame - 40, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: PAD, gap: 90}}>
      <div style={{width: W - PAD * 2, padding: '70px 40px', borderRadius: 30, border: `6px double ${theme.accent2}`, textAlign: 'center',
        transform: `scale(${stamp}) rotate(${(1 - stamp) * 12 - 3}deg)`}}>
        <div style={{fontFamily: MONO_FONT, fontSize: 30, fontWeight: 700, color: theme.accent2}}>DOORS OPEN</div>
        <div style={{marginTop: 24, fontFamily: SERIF_FONT, fontSize: fit(texts.date, 110, W - PAD * 2 - 80, 0.5), fontWeight: 600, color: theme.foreground, whiteSpace: 'nowrap'}}>
          <Role role="date">{texts.date}</Role>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, maxWidth: W - PAD * 2, opacity: pin, transform: `translateY(${(1 - pin) * 40}px)`}}>
        <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={theme.accent2} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none'}}>
          <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
        </svg>
        <span style={{fontSize: wrapFit(texts.attribution, 52, W - PAD * 2 - 90, 2, 0.54, 28), lineHeight: 1.15, fontWeight: 700, color: theme.foreground}}>
          <Role role="attribution">{texts.attribution}</Role>
        </span>
      </div>
      <div style={{height: 120, display: 'flex', alignItems: 'center', gap: 22, padding: '0 54px', borderRadius: 60, background: theme.accent2, color: theme.background,
        fontSize: fit(texts.cta, 50, 700, 0.56), fontWeight: 800, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={44} />
      </div>
    </AbsoluteFill>
  );
};

export const Grandopening: React.FC<GrandopeningProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={grandopeningMeta} scenes={[SceneRibbon, SceneVisit]} props={props} />
  </AbsoluteFill>
);
