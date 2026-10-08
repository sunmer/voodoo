import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {gamingintroMeta} from './meta';
import type {GamingintroProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<GamingintroProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneSlam: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = texts.brand.toUpperCase();
  const size = fit(brand, 250, 1560, 0.74);
  const slam = spring({frame: frame - 14, fps, config: {damping: 9, stiffness: 220}});
  // Glitch decays to zero before the focus frame.
  const glitch = interpolate(frame, [14, 44], [1, 0], clamp);
  const jx = (random(`jx${frame}`) - 0.5) * 60 * glitch;
  const band = random(`band${frame}`) * 80;
  const bars = [theme.accent, theme.accent2, theme.surface];
  const layer = (color: string, dx: number): React.CSSProperties => ({position: 'absolute', inset: 0, color, transform: `translateX(${dx}px)`, mixBlendMode: 'screen'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {bars.map((c, i) => {
        const t = interpolate(frame - i * 5, [0, 18], [0, 1], {...clamp, easing: easeOut});
        return <div key={i} style={{position: 'absolute', left: -300, width: W + 600, top: 140 + i * 280, height: 200, background: c, opacity: 0.9 - i * 0.2,
          transform: `skewY(-8deg) translateX(${(1 - t) * (i % 2 ? 1 : -1) * 2400}px)`}} />;
      })}
      <div style={{position: 'relative', fontFamily: DISPLAY, fontWeight: 900, fontStyle: 'italic', fontSize: size, lineHeight: 1, color: theme.foreground, whiteSpace: 'nowrap',
        transform: `skewX(-10deg) scale(${interpolate(slam, [0, 1], [2.4, 1])})`, opacity: Math.min(1, slam * 2)}}>
        <div aria-hidden style={layer(theme.accent, -14 - jx)}>{brand}</div>
        <div aria-hidden style={layer(theme.accent2, 14 + jx)}>{brand}</div>
        <div style={{position: 'relative', clipPath: glitch > 0.05 ? `inset(${band}% 0 ${Math.max(0, 70 - band)}% 0)` : undefined}}><Role role="brand">{brand}</Role></div>
        {glitch > 0.05 && <div aria-hidden style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${100 - band}% 0)`, transform: `translateX(${jx * 2}px)`}}>{brand}</div>}
        {glitch > 0.05 && <div aria-hidden style={{position: 'absolute', inset: 0, clipPath: `inset(${Math.min(100, band + 30)}% 0 0 0)`, transform: `translateX(${-jx}px)`}}>{brand}</div>}
      </div>
      <div style={{marginTop: 50, padding: '16px 40px', background: theme.foreground, color: theme.background, transform: `skewX(-10deg) translateY(${interpolate(frame, [30, 46], [80, 0], {...clamp, easing: easeOut})}px)`,
        opacity: interpolate(frame, [30, 40], [0, 1], clamp), fontFamily: MONO_FONT, fontWeight: 800, fontSize: fit(texts.headline, 64, 1200, 0.62), textTransform: 'uppercase'}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneHud: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const segs = 14;
  const filled = Math.floor(interpolate(frame, [4, 36], [0, segs], clamp));
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 70}}>
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${theme.accent}22 0 2px, transparent 2px 8px)`, transform: `translateY(${(frame * 2) % 8}px)`}} />
      <div style={{position: 'relative', width: 1500, padding: '60px 80px', textAlign: 'center', clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)',
        background: `${theme.surface}ee`, borderLeft: `10px solid ${theme.accent}`, transform: `scaleX(${interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeOut})})`}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 850, color: theme.foreground, fontSize: wrapFit(texts.subhead, 88, 1340, 2, 0.58, 36), lineHeight: 1.08, textWrap: 'balance',
          opacity: interpolate(frame, [10, 20], [0, 1], clamp)}}>
          <Role role="subhead">{texts.subhead}</Role>
        </div>
      </div>
      <div style={{display: 'flex', gap: 10}}>
        {Array.from({length: segs}, (_, i) => (
          <div key={i} style={{width: 70, height: 34, transform: 'skewX(-20deg)', background: i < filled ? (i > segs - 4 ? theme.accent2 : theme.accent) : `${theme.foreground}22`}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Gamingintro: React.FC<GamingintroProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={gamingintroMeta} scenes={[SceneSlam, SceneHud]} props={props} exit="slide" />
  </AbsoluteFill>
);
