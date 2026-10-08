import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, fit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {flashsaleMeta} from './meta';
import type {FlashsaleProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 80;
type P = SceneProps<FlashsaleProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Bolt: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
);

// Diagonal hazard stripes that scroll, used as the sale's top and bottom bands.
const Stripes: React.FC<{a: string; b: string; y: number}> = ({a, b, y}) => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 70, backgroundImage: `repeating-linear-gradient(-45deg, ${a} 0 36px, ${b} 36px 72px)`, backgroundPosition: `${frame * 4}px 0`}} />;
};

// Headline splits along a diagonal slash, then the two halves slam together.
const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 6, fps, config: {damping: 13, stiffness: 140}});
  const words = texts.headline.toUpperCase().split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 250, W - PAD * 2, 0.62), 760 / (words.length * 0.9));
  const text = <Role role="headline">{words.map((w, i) => <div key={i}>{w}</div>)}</Role>;
  const half = (clip: string, dx: number, role: boolean) => (
    <div aria-hidden={!role} style={{position: role ? 'relative' : 'absolute', inset: 0, clipPath: clip, transform: `translateX(${dx}px)`}}>{role ? text : words.map((w, i) => <div key={i}>{w}</div>)}</div>
  );
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <Stripes a={theme.accent} b={theme.background} y={0} />
      <div style={{marginTop: 120, display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, W - PAD * 2 - 80, 0.62), fontWeight: 800, color: theme.accent, opacity: s}}>
        <Bolt size={52} color={theme.accent} />
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 80, fontFamily: FLEX_FONT, fontStretch: '70%', fontSize: size, lineHeight: 0.92, fontWeight: 900, fontStyle: 'italic', color: theme.foreground}}>
        {half('polygon(0 0, 62% 0, 38% 100%, 0 100%)', (1 - s) * -700, true)}
        {half('polygon(62% 0, 100% 0, 100% 100%, 38% 100%)', (1 - s) * 700, false)}
      </div>
      <Stripes a={theme.accent} b={theme.background} y={H - 70} />
    </AbsoluteFill>
  );
};

const ScenePrice: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 4, fps, config: {damping: 10, stiffness: 170}});
  const note = spring({frame: frame - 18, fps, config: {damping: 14}});
  const date = interpolate(frame, [26, 42], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.accent, alignItems: 'center', justifyContent: 'center', padding: PAD}}>
      {[0, 1, 2].map((i) => {
        const r = ((frame + i * 20) % 60) / 60;
        return <div key={i} style={{position: 'absolute', left: W / 2 - 460, top: H / 2 - 520, width: 920, height: 920, borderRadius: '50%', border: `8px solid ${theme.background}`, opacity: (1 - r) * 0.25, transform: `scale(${0.4 + r * 0.8})`}} />;
      })}
      <div style={{position: 'relative', fontFamily: FLEX_FONT, fontStretch: '80%', fontSize: fit(texts.price, 330, W - PAD * 2, 0.56), fontWeight: 900, lineHeight: 1, color: theme.background, transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(-4deg)`, opacity: Math.min(1, stamp * 2)}}>
        <Role role="price">{texts.price}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 40, padding: '14px 34px', background: theme.background, color: theme.foreground, fontSize: fit(texts.priceNote, 52, W - PAD * 2 - 70, 0.56), fontWeight: 800, transform: `rotate(3deg) scale(${note})`}}>
        <Role role="priceNote">{texts.priceNote}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 110, textAlign: 'center', fontFamily: MONO_FONT, fontSize: fit(texts.date, 44, W - PAD * 2, 0.62), fontWeight: 700, color: theme.background, opacity: date}}>
        <Role role="date">{texts.date}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12}});
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 60}}>
      <Stripes a={theme.accent2} b={theme.background} y={0} />
      <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '40px 64px', background: theme.accent2, color: theme.background, transform: `scale(${s * pulse}) skewX(-8deg)`}}>
        <Bolt size={70} color={theme.background} />
        <span style={{fontFamily: FLEX_FONT, fontStretch: '80%', fontSize: fit(texts.cta.toUpperCase(), 100, W - PAD * 2 - 230, 0.56), fontWeight: 900}}><Role role="cta">{texts.cta.toUpperCase()}</Role></span>
      </div>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 44, W - PAD * 2, 0.62), fontWeight: 800, color: theme.foreground, opacity: s}}><Role role="brand">{texts.brand}</Role></div>
      <Stripes a={theme.accent2} b={theme.background} y={H - 70} />
    </AbsoluteFill>
  );
};

export const Flashsale: React.FC<FlashsaleProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={flashsaleMeta} scenes={[SceneTitle, ScenePrice, SceneEnd]} props={props} />
  </AbsoluteFill>
);
