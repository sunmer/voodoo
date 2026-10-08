import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {progressMeta} from './meta';
import type {ProgressProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 140;
const BAR = W - PAD * 2;
type P = SceneProps<ProgressProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Bar fill fraction: percentages fill to their value; other numbers fill the whole bar.
const fillOf = (stat: string) => {
  const n = parseNumber(stat);
  return n.suffix.trim().startsWith('%') ? Math.min(1, Math.max(0.04, n.value / 100)) : 1;
};

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(frame, [10, 30], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, 900, 0.62), fontWeight: 700, color: theme.accent, textTransform: 'uppercase', opacity: b}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{marginTop: 30, fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 180, BAR, 2, 0.6, 60), lineHeight: 1, fontWeight: 900, color: theme.foreground,
        opacity: t, transform: `translateX(${(1 - t) * -80}px)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, bottom: 200, width: BAR, height: 24, borderRadius: 12, background: `${theme.foreground}14`, transform: `scaleX(${b})`, transformOrigin: '0 50%'}} />
    </AbsoluteFill>
  );
};

const SceneFill: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = parseNumber(texts.stat);
  const goal = fillOf(texts.stat);
  // Fill with a short hold at the first milestone, so the motion reads like real progress.
  const t = interpolate(frame, [6, 40, 52, 104], [0, 0.42, 0.42, 1], {...clamp, easing: easeInOut});
  const w = BAR * goal * t;
  const done = spring({frame: frame - 104, fps, config: {damping: 10, stiffness: 170}});
  const barY = 560;
  const statSize = Math.min(fit(texts.stat, 220, 800, 0.6), 220);
  const labelX = Math.min(Math.max(w, statSize * texts.stat.length * 0.3), BAR - statSize * texts.stat.length * 0.3);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: PAD, top: barY - 40 - statSize, transform: `translateX(${labelX}px) translateX(-50%) scale(${1 + done * 0.08})`, transformOrigin: '50% 100%',
        fontFamily: DISPLAY, fontSize: statSize, lineHeight: 1, fontWeight: 900, color: theme.foreground, whiteSpace: 'nowrap'}}>
        <Role role="stat">{formatNumber(n, t)}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, top: barY, width: BAR, height: 120, borderRadius: 60, background: theme.surface, overflow: 'hidden', border: `6px solid ${theme.foreground}18`}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w, borderRadius: 60, background: theme.accent,
          backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 30px, ${theme.background}22 30px 60px)`, backgroundPosition: `${frame * 3}px 0`}} />
      </div>
      {[0.25, 0.5, 0.75].map((m) => (
        <div key={m} style={{position: 'absolute', left: PAD + BAR * m - 2, top: barY + 140, width: 4, height: 30, background: t * goal >= m ? theme.accent : `${theme.foreground}33`}} />
      ))}
      {Array.from({length: 26}, (_, i) => {
        const a = random(`c${i}`) * Math.PI * 2;
        const r = done * (120 + random(`r${i}`) * 260);
        return <div key={i} style={{position: 'absolute', left: PAD + w + Math.cos(a) * r, top: barY + 60 + Math.sin(a) * r - done * done * 60, width: 18, height: 18,
          background: i % 2 ? theme.accent : theme.accent2, transform: `rotate(${a * 90 + frame * 6}deg)`, opacity: done > 0.02 ? 1 - Math.max(0, done - 0.8) * 3 : 0}} />;
      })}
      <div style={{position: 'absolute', left: PAD, right: PAD, top: barY + 220, fontSize: wrapFit(texts.subhead, 56, BAR, 2, 0.52, 32), lineHeight: 1.2, fontWeight: 600, color: `${theme.foreground}cc`,
        opacity: interpolate(frame, [20, 40], [0, 1], clamp)}}>
        <Role role="subhead">{texts.subhead}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneBrand: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `inset(0 ${(1 - t) * 100}% 0 0 round 0 60px 60px 0)`, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 240, BAR, 0.64), fontWeight: 900, color: theme.background}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Progress: React.FC<ProgressProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={progressMeta} scenes={[SceneTitle, SceneFill, SceneBrand]} props={props} />
  </AbsoluteFill>
);
