import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {beforeafterMeta} from './meta';
import type {BeforeafterProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<BeforeafterProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Mark: React.FC<{good: boolean; size: number}> = ({good, size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    {good ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 6l12 12M18 6L6 18" />}
  </svg>
);

// Slider handle: a ring with two chevrons, as in a before/after image slider.
const Handle: React.FC<{color: string; fill: string; size?: number}> = ({color, fill, size = 120}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: fill, border: `8px solid ${color}`, color, display: 'grid', placeItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4l-4 4 4 4M16 12l4 4-4 4" transform="rotate(90 12 12)" />
    </svg>
  </div>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.headline.split(/\s+/);
  const size = wrapFit(texts.headline, 170, W - PAD * 2, 3, 0.62, 60);
  const bar = interpolate(frame, [18, 52], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.95, fontWeight: 900, color: theme.foreground, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.25}}>
        <Role role="headline">{words.map((w, i) => {
          const t = interpolate(frame - i * 5, [0, 18], [0, 1], {...clamp, easing: easeOut});
          return <span key={i} style={{display: 'inline-block', overflow: 'hidden'}}><span style={{display: 'inline-block', transform: `translateY(${(1 - t) * 105}%)`}}>{w}</span></span>;
        })}</Role>
      </div>
      <div style={{marginTop: 80, position: 'relative', height: 120}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 56, height: 8, borderRadius: 4, background: `${theme.foreground}22`}} />
        <div style={{position: 'absolute', left: 0, top: 56, height: 8, borderRadius: 4, width: `${bar * 100}%`, background: theme.accent}} />
        <div style={{position: 'absolute', top: 0, left: `calc(${bar * 100}% - ${bar * 120}px)`}}><Handle color={theme.accent} fill={theme.background} /></div>
      </div>
    </AbsoluteFill>
  );
};

const SceneSplit: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Divider position from the top, in px: starts at the bottom, drags up past center, settles at center.
  const d = interpolate(frame, [8, 46, 70, 92], [H, H * 0.38, H * 0.56, H * 0.5], {...clamp, easing: easeInOut});
  const strike = interpolate(frame, [96, 116], [0, 1], {...clamp, easing: easeOut});
  const stamp = spring({frame: frame - 100, fps, config: {damping: 9, stiffness: 180}});
  const half = H / 2;
  const s1 = fit(texts.point1.toUpperCase(), 150, W - PAD * 2, 0.7);
  const s2 = fit(texts.point2.toUpperCase(), 150, W - PAD * 2, 0.7);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: theme.accent, top: 0}}>
        <div style={{position: 'absolute', left: PAD, right: PAD, top: half, height: half, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
          <div style={{width: 96, height: 96, borderRadius: '50%', background: theme.background, color: theme.accent, display: 'grid', placeItems: 'center', transform: `scale(${stamp}) rotate(${(1 - stamp) * -60}deg)`}}>
            <Mark good size={60} />
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: s2, lineHeight: 1, fontWeight: 900, color: theme.background, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>
            <Role role="point2">{texts.point2}</Role>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: theme.surface, clipPath: `inset(0 0 ${H - d}px 0)`}}>
        {Array.from({length: 14}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: -200, width: W + 400, top: i * 110 - 40, height: 2, background: `${theme.foreground}10`, transform: 'rotate(-8deg)'}} />
        ))}
        <div style={{position: 'absolute', left: PAD, right: PAD, top: 0, height: half, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
          <div style={{width: 96, height: 96, borderRadius: '50%', border: `6px solid ${theme.foreground}55`, color: `${theme.foreground}88`, display: 'grid', placeItems: 'center'}}>
            <Mark good={false} size={52} />
          </div>
          <div style={{position: 'relative', alignSelf: 'flex-start', fontFamily: DISPLAY, fontSize: s1, lineHeight: 1, fontWeight: 900, color: `${theme.foreground}99`, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>
            <Role role="point1">{texts.point1}</Role>
            <div style={{position: 'absolute', left: -10, top: '52%', height: Math.max(8, s1 * 0.09), width: `calc(${strike * 100}% + ${strike * 20}px)`, background: theme.accent2, borderRadius: 6}} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: d - 5, height: 10, background: theme.background}} />
      <div style={{position: 'absolute', left: W / 2 - 60, top: d - 60}}><Handle color={theme.foreground} fill={theme.background} /></div>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const cta = spring({frame: frame - 12, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: theme.background, justifyContent: 'center', alignItems: 'center', gap: 70, padding: PAD}}>
      <div style={{display: 'flex', width: 360 * t, height: 16, borderRadius: 8, overflow: 'hidden'}}>
        <div style={{flex: 1, background: theme.surface}} /><div style={{flex: 1, background: theme.accent}} />
      </div>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 140, W - PAD * 2, 0.64), fontWeight: 900, color: theme.foreground, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{height: 124, display: 'flex', alignItems: 'center', gap: 22, padding: '0 56px', borderRadius: 62, background: theme.accent, color: theme.background,
        fontSize: fit(texts.cta, 52, 720, 0.62), fontWeight: 800, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={46} />
      </div>
    </AbsoluteFill>
  );
};

export const Beforeafter: React.FC<BeforeafterProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={beforeafterMeta} scenes={[SceneTitle, SceneSplit, SceneEnd]} props={props} />
  </AbsoluteFill>
);
