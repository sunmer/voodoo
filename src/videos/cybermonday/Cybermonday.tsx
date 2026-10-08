import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {cybermondayMeta} from './meta';
import type {CybermondayProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 84;
type P = SceneProps<CybermondayProps>;
type Theme = CybermondayProps['theme'];

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Perspective grid floor, drawn with plain lines so it stays cheap on mobile.
const Floor: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: -900, right: -900, bottom: 0, height: 700, perspective: 700, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: 'rotateX(62deg)', transformOrigin: '50% 100%',
        backgroundImage: `linear-gradient(${theme.accent}88 4px, transparent 4px), linear-gradient(90deg, ${theme.accent}88 4px, transparent 4px)`,
        backgroundSize: '160px 160px', backgroundPosition: `0 ${(frame * 4) % 160}px`, maskImage: 'linear-gradient(transparent, black 60%)'}} />
    </div>
  );
};

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.headline.toUpperCase().split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 210, W - PAD * 2, 0.76), 900 / (words.length * 0.95));
  const jitter = frame < 30 ? (random(`g${frame}`) - 0.5) * 30 : 0;
  const show = interpolate(frame, [0, 6], [0, 1], clamp);
  const lines = (color: string, dx: number, role?: boolean) => (
    <div aria-hidden={!role} style={{position: role ? 'relative' : 'absolute', inset: 0, color, transform: `translateX(${dx}px)`, mixBlendMode: role ? undefined : 'screen'}}>
      {role ? <Role role="headline">{words.map((w, i) => <div key={i}>{w}</div>)}</Role> : words.map((w, i) => <div key={i}>{w}</div>)}
    </div>
  );
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <Floor theme={theme} />
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 36, W - PAD * 2, 0.62), fontWeight: 700, color: theme.accent2, marginTop: 90}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 240, fontFamily: DISPLAY, fontSize: size, lineHeight: 0.95, fontWeight: 900, opacity: show}}>
        {lines(theme.accent, -jitter)}
        {lines(theme.accent2, jitter)}
        {lines(theme.foreground, 0, true)}
      </div>
    </AbsoluteFill>
  );
};

const ScenePrice: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = parseNumber(texts.price);
  const t = interpolate(frame, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const pop = spring({frame: frame - 6, fps, config: {damping: 10, stiffness: 140}});
  const note = spring({frame: frame - 38, fps, config: {damping: 12, stiffness: 180}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div style={{fontSize: wrapFit(texts.subhead, 64, W - PAD * 2, 2, 0.55, 32), lineHeight: 1.15, fontWeight: 750, color: theme.foreground, opacity: interpolate(frame, [0, 14], [0, 1], clamp)}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
      <div style={{marginTop: 40, fontFamily: DISPLAY, fontSize: fit(texts.price, 330, W - PAD * 2, 0.66), lineHeight: 1, fontWeight: 900, color: theme.accent, whiteSpace: 'nowrap',
        transform: `scale(${0.6 + pop * 0.4})`, textShadow: `0 0 60px ${theme.accent}88`}}>
        <Role role="price">{formatNumber(n, t)}</Role>
      </div>
      <div style={{marginTop: 40, padding: '18px 36px', border: `4px solid ${theme.accent2}`, color: theme.accent2, fontFamily: MONO_FONT, fontSize: fit(texts.priceNote, 44, W - PAD * 2 - 80, 0.62),
        fontWeight: 700, textTransform: 'uppercase', transform: `scale(${note}) rotate(-3deg)`}}>
        <Role role="priceNote">{texts.priceNote}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneDate: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const cta = spring({frame: frame - 16, fps, config: {damping: 12, stiffness: 160}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', gap: 90}}>
      <div style={{width: W - PAD * 2, padding: '70px 50px', borderRadius: 8, background: theme.surface, border: `3px dashed ${theme.accent}`, textAlign: 'center',
        transform: `translateY(${(1 - s) * 600}px) rotate(${(1 - s) * 8}deg)`}}>
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.date, 72, W - PAD * 2 - 100, 0.62), fontWeight: 800, color: theme.foreground, textTransform: 'uppercase'}}>
          <Role role="date">{texts.date}</Role>
        </div>
      </div>
      <div style={{height: 120, display: 'flex', alignItems: 'center', gap: 20, padding: '0 52px', borderRadius: 60, background: theme.accent, color: theme.background,
        fontSize: fit(texts.cta, 50, 700, 0.56), fontWeight: 850, transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={44} />
      </div>
    </AbsoluteFill>
  );
};

export const Cybermonday: React.FC<CybermondayProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={cybermondayMeta} scenes={[SceneTitle, ScenePrice, SceneDate]} props={props} />
  </AbsoluteFill>
);
