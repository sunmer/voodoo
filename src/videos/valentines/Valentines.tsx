import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit} from '../shared/motion';
import {MONO_FONT, SERIF_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {valentinesMeta} from './meta';
import type {ValentinesProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<ValentinesProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Heart: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 21s-8-4.8-9.4-10.2C1.7 7 4 4 7.2 4c2 0 3.4 1.1 4.8 2.8C13.4 5.1 14.8 4 16.8 4 20 4 22.3 7 21.4 10.8 20 16.2 12 21 12 21z" fill={color} /></svg>
);

const SceneLove: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = 1 + Math.max(0, Math.sin(frame * 0.32)) * 0.07;
  const heart = spring({frame, fps, config: {damping: 11, stiffness: 110}});
  const words = texts.headline.split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(fit(longest, 150, 760, 0.55), 520 / (words.length * 1.02));
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div style={{position: 'absolute', transform: `scale(${heart * beat})`}}><Heart size={1040} color={theme.accent} /></div>
      <div style={{position: 'absolute', top: 120, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 34, W - PAD * 2, 0.62), fontWeight: 700, color: theme.foreground, textTransform: 'uppercase'}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'relative', marginTop: -30, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: size, lineHeight: 0.98, fontWeight: 700, color: theme.background,
        opacity: interpolate(frame, [18, 36], [0, 1], clamp)}}>
        <Role role="headline">{words.map((w, i) => <div key={i}>{w}</div>)}</Role>
      </div>
    </AbsoluteFill>
  );
};

const ScenePrice: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [4, 42], [0, 1], {...clamp, easing: easeOut});
  const n = parseNumber(texts.price);
  const stamp = spring({frame: frame - 36, fps, config: {damping: 9, stiffness: 190}});
  return (
    <AbsoluteFill style={{background: theme.surface, justifyContent: 'center', alignItems: 'center', padding: PAD}}>
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: 80 + i * 170, top: 160 + (i % 2) * 920, opacity: 0.35}}><Heart size={74} color={theme.accent2} /></div>)}
      <div style={{fontFamily: SERIF_FONT, fontSize: fit(texts.price, 330, W - PAD * 2, 0.58), fontWeight: 800, color: theme.accent, lineHeight: 1, whiteSpace: 'nowrap'}}>
        <Role role="price">{formatNumber(n, t)}</Role>
      </div>
      <div style={{marginTop: 46, padding: '20px 46px', borderRadius: 8, border: `4px solid ${theme.foreground}`, color: theme.foreground, fontFamily: MONO_FONT,
        fontSize: fit(texts.priceNote, 42, W - PAD * 2 - 110, 0.62), fontWeight: 800, textTransform: 'uppercase', transform: `scale(${stamp}) rotate(4deg)`}}>
        <Role role="priceNote">{texts.priceNote}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneDate: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: easeInOut});
  const cta = spring({frame: frame - 18, fps, config: {damping: 12, stiffness: 160}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: PAD, gap: 82}}>
      <div style={{position: 'relative', width: W - PAD * 2, height: 330, borderRadius: 8, background: theme.foreground, color: theme.background, display: 'grid', placeItems: 'center',
        clipPath: `inset(${(1 - open) * 50}% 0 ${(1 - open) * 50}% 0)`}}>
        <div style={{position: 'absolute', left: -38, top: 127, width: 76, height: 76, borderRadius: '50%', background: theme.background}} />
        <div style={{position: 'absolute', right: -38, top: 127, width: 76, height: 76, borderRadius: '50%', background: theme.background}} />
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.date, 66, W - PAD * 2 - 160, 0.62), fontWeight: 800, textTransform: 'uppercase'}}><Role role="date">{texts.date}</Role></div>
      </div>
      <div style={{height: 118, display: 'flex', alignItems: 'center', gap: 20, padding: '0 54px', borderRadius: 59, background: theme.accent, color: theme.background,
        fontSize: fit(texts.cta, 50, 700, 0.56), fontWeight: 850, transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={44} />
      </div>
    </AbsoluteFill>
  );
};

export const Valentines: React.FC<ValentinesProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={valentinesMeta} scenes={[SceneLove, ScenePrice, SceneDate]} props={props} />
  </AbsoluteFill>
);
