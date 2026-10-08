import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {featureMeta} from './meta';
import type {FeatureProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
type P = SceneProps<FeatureProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Dot grid background that slowly zooms.
const Dots: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{backgroundImage: `radial-gradient(${color} 2.5px, transparent 2.5px)`, backgroundSize: '48px 48px', transform: `scale(${1 + frame * 0.0012})`, opacity: 0.5}} />;
};

const SceneAnnounce: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - 4, fps, config: {damping: 9, stiffness: 160}});
  const head = spring({frame: frame - 16, fps, config: {damping: 16}});
  const meta = interpolate(frame, [30, 46], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'flex-start'}}>
      <Dots color={`${theme.foreground}22`} />
      <div style={{position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 18, padding: '18px 34px', borderRadius: 8, background: theme.accent, color: theme.background, fontFamily: MONO_FONT, fontSize: 40, fontWeight: 800, transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(${interpolate(stamp, [0, 1], [-14, -3])}deg)`, opacity: Math.min(1, stamp * 2), transformOrigin: '0 50%'}}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.6h7.6z" /></svg>
        NEW
      </div>
      <div style={{position: 'relative', marginTop: 50, fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 190, W - PAD * 2, 2, 0.6, 70), lineHeight: 0.98, fontWeight: 900, color: theme.foreground, opacity: head, transform: `translateY(${(1 - head) * 80}px)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 50, display: 'flex', gap: 40, alignItems: 'center', fontFamily: MONO_FONT, fontSize: 38, color: `${theme.foreground}bb`, opacity: meta}}>
        <span style={{fontSize: fit(texts.brand, 38, 700, 0.62), fontWeight: 700, color: theme.accent2}}><Role role="brand">{texts.brand}</Role></span>
        <span style={{width: 10, height: 10, borderRadius: 5, background: `${theme.foreground}66`}} />
        <span style={{fontSize: fit(texts.date, 38, 900, 0.62)}}><Role role="date">{texts.date}</Role></span>
      </div>
    </AbsoluteFill>
  );
};

// Numbered steps connected by a line that draws across the frame.
const SceneSteps: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = parseList(texts.items);
  const colW = (W - PAD * 2) / items.length;
  const line = interpolate(frame, [6, 20 + items.length * 14], [0, 1], {...clamp, easing: easeInOut});
  const size = Math.min(...items.map((s) => wrapFit(s, 54, colW - 50, 3, 0.56, 26)));
  return (
    <AbsoluteFill style={{background: theme.surface}}>
      <div style={{position: 'absolute', left: PAD + colW / 2, top: 420, height: 6, width: (W - PAD * 2 - colW) * line, background: theme.accent}} />
      <Role role="items">
        {items.map((item, i) => {
          const s = spring({frame: frame - 10 - i * 14, fps, config: {damping: 12}});
          return (
            <div key={i} style={{position: 'absolute', left: PAD + i * colW, top: 330, width: colW, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
              <div style={{width: 180, height: 180, borderRadius: '50%', background: i % 2 ? theme.accent2 : theme.accent, color: theme.background, fontFamily: DISPLAY, fontSize: 90, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`}}>{i + 1}</div>
              <div style={{marginTop: 60, padding: '0 25px', fontSize: size, lineHeight: 1.15, fontWeight: 750, color: theme.foreground, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>{item}</div>
            </div>
          );
        })}
      </Role>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 26], [1.6, 1], {...clamp, easing: easeOut});
  const t = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 50, opacity: t}}>
      <Dots color={`${theme.accent}33`} />
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 34, padding: '44px 80px', borderRadius: 8, background: theme.foreground, color: theme.background, transform: `scale(${zoom})`}}>
        <span style={{fontFamily: DISPLAY, fontSize: fit(texts.cta, 96, 1300, 0.6), fontWeight: 900}}><Role role="cta">{texts.cta}</Role></span>
        <ArrowIcon size={90} />
      </div>
      <div style={{position: 'relative', fontFamily: MONO_FONT, fontSize: fit(texts.brand, 44, 900, 0.62), fontWeight: 700, color: theme.foreground}}><Role role="brand">{texts.brand}</Role></div>
    </AbsoluteFill>
  );
};

export const Feature: React.FC<FeatureProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={featureMeta} scenes={[SceneAnnounce, SceneSteps, SceneEnd]} props={props} />
  </AbsoluteFill>
);
