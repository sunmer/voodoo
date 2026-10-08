import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseList, parseNumber} from '../shared/data';
import {apppromoMeta} from './meta';
import type {ApppromoProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
const PHONE_W = 600;
const PHONE_H = 1180;
type P = SceneProps<ApppromoProps>;
type Theme = ApppromoProps['theme'];

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// A phone outline with a notch. Children render on its screen.
const Phone: React.FC<{theme: Theme; y: number; tilt?: number; children?: React.ReactNode}> = ({theme, y, tilt = 0, children}) => (
  <div style={{position: 'absolute', left: (W - PHONE_W) / 2, top: y, width: PHONE_W, height: PHONE_H, borderRadius: 86, background: theme.foreground, padding: 18, transform: `rotate(${tilt}deg)`, boxShadow: `0 60px 120px ${theme.accent}55`}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 70, background: theme.surface, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: 22, width: 170, height: 44, marginLeft: -85, borderRadius: 22, background: theme.foreground}} />
      {children}
    </div>
  </div>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = spring({frame: frame - 10, fps, config: {damping: 16, stiffness: 90}});
  const t = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{position: 'absolute', left: -200, top: 560 - frame * 0.6, width: 1480, height: 1480, borderRadius: '50%', background: `${theme.accent2}22`}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 70, opacity: t}}>
        <div style={{width: 76, height: 76, borderRadius: 22, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`}} />
        <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 54, W - PAD * 2 - 100, 0.62), fontWeight: 800, color: theme.foreground}}><Role role="brand">{texts.brand}</Role></div>
      </div>
      <div style={{marginTop: 50, fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 132, W - PAD * 2, 2, 0.6, 60), lineHeight: 1, fontWeight: 900, color: theme.foreground, opacity: t, transform: `translateY(${(1 - t) * 60}px)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <Phone theme={theme} y={interpolate(rise, [0, 1], [H, 820])} tilt={interpolate(rise, [0, 1], [12, -4])}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 40, right: 40, top: 120 + i * 190, height: 150, borderRadius: 28, background: i === 0 ? theme.accent : `${theme.foreground}12`}} />
        ))}
      </Phone>
    </AbsoluteFill>
  );
};

const SceneList: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = parseList(texts.items);
  const rowH = Math.min(150, (PHONE_H - 220) / items.length - 18);
  const size = Math.min(...items.map((s) => wrapFit(s, 46, PHONE_W - 230, 2, 0.56, 24)), rowH / 2.6);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${theme.accent}33, transparent 60%)`}} />
      <Phone theme={theme} y={370}>
        <Role role="items">
          {items.map((item, i) => {
            const s = spring({frame: frame - 6 - i * 9, fps, config: {damping: 15, stiffness: 120}});
            return (
              <div key={i} style={{position: 'absolute', left: 36, right: 36, top: 110 + i * (rowH + 18), height: rowH, borderRadius: 28, background: theme.background, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', opacity: s, transform: `translateX(${(1 - s) * 160}px) scale(${0.9 + s * 0.1})`}}>
                <div style={{flex: 'none', width: 64, height: 64, borderRadius: 20, background: i % 2 ? theme.accent2 : theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.background}}>
                  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <span style={{fontSize: size, lineHeight: 1.15, fontWeight: 700, color: theme.foreground}}>{item}</span>
              </div>
            );
          })}
        </Role>
      </Phone>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 110}});
  const count = interpolate(frame, [4, 34], [0, 1], {...clamp, easing: easeOut});
  const btn = spring({frame: frame - 16, fps, config: {damping: 14}});
  const n = parseNumber(texts.price);
  return (
    <AbsoluteFill style={{background: theme.accent, alignItems: 'center', justifyContent: 'center', padding: PAD, gap: 80}}>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.price, 300, W - PAD * 2, 0.62), fontWeight: 900, lineHeight: 1, color: theme.background, transform: `scale(${pop})`}}>
        <Role role="price">{formatNumber(n, count)}</Role>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '38px 64px', borderRadius: 999, background: theme.background, color: theme.foreground, transform: `translateY(${(1 - btn) * 120}px)`, opacity: btn}}>
        <span style={{fontFamily: DISPLAY, fontSize: fit(texts.cta, 64, W - PAD * 2 - 260, 0.6), fontWeight: 800}}><Role role="cta">{texts.cta}</Role></span>
        <ArrowIcon size={60} />
      </div>
    </AbsoluteFill>
  );
};

export const Apppromo: React.FC<ApppromoProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={apppromoMeta} scenes={[SceneTitle, SceneList, SceneEnd]} props={props} />
  </AbsoluteFill>
);
