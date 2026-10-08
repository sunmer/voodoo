import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {anniversaryMeta} from './meta';
import type {AnniversaryProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<AnniversaryProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Confetti: React.FC<{frame: number; colors: string[]}> = ({frame, colors}) => (
  <>
    {Array.from({length: 70}, (_, i) => {
      const t = frame - 70 - random(`d${i}`) * 20;
      if (t < 0) return null;
      const x = random(`x${i}`) * W + Math.sin(t / 10 + i) * 30;
      const y = -40 + t * (6 + random(`v${i}`) * 6);
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 18, height: 30, background: colors[i % colors.length],
        transform: `rotate(${t * (4 + random(`r${i}`) * 8)}deg)`, borderRadius: 3}} />;
    })}
  </>
);

// A laurel of rays rotates behind a count-up of the anniversary number.
const SceneYears: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = parseNumber(texts.stat);
  const t = interpolate(frame, [10, 70], [0, 1], {...clamp, easing: easeOut});
  const ring = spring({frame: frame - 4, fps, config: {damping: 16, stiffness: 80}});
  const head = interpolate(frame, [64, 86], [0, 1], {...clamp, easing: easeOut});
  const size = fit(texts.stat, 300, 520, 0.5);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 110, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 36, W - PAD * 2, 0.62), fontWeight: 700, color: theme.accent,
        textTransform: 'uppercase'}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', top: 210, width: 780, height: 780, display: 'grid', placeItems: 'center', transform: `scale(${ring}) rotate(${frame * 0.3}deg)`}}>
        {Array.from({length: 36}, (_, i) => (
          <div key={i} style={{position: 'absolute', width: 14, height: 390, top: 0, left: 383, transformOrigin: '7px 390px', transform: `rotate(${i * 10}deg)`}}>
            <div style={{width: 14, height: i % 2 ? 60 : 110, borderRadius: 7, background: i % 2 ? theme.accent2 : theme.accent}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 600 - size / 2, width: 520, textAlign: 'center', fontFamily: FLEX_FONT, fontStretch: '80%', fontSize: size, lineHeight: 1,
        fontWeight: 900, color: theme.foreground, whiteSpace: 'nowrap'}}>
        <Role role="stat">{formatNumber(n, t)}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 1060, textAlign: 'center', fontFamily: SERIF_FONT, fontSize: wrapFit(texts.headline, 100, W - PAD * 2, 2, 0.5, 44),
        lineHeight: 1.02, fontStyle: 'italic', fontWeight: 600, color: theme.foreground, clipPath: `inset(0 ${(1 - head) * 50}% 0 ${(1 - head) * 50}%)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <Confetti frame={frame} colors={[theme.accent, theme.accent2, theme.surface]} />
    </AbsoluteFill>
  );
};

const SceneThanks: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame, fps, config: {damping: 15, stiffness: 120}});
  const cta = spring({frame: frame - 22, fps, config: {damping: 13, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: theme.accent, alignItems: 'center', justifyContent: 'center', gap: 80, padding: PAD}}>
      <div style={{width: W - PAD * 2, padding: '60px 40px', border: `4px solid ${theme.background}`, borderRadius: 24, textAlign: 'center', transform: `scale(${0.8 + card * 0.2})`, opacity: card}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 14}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 14, height: 14, transform: 'rotate(45deg)', background: theme.background, opacity: 0.4 + i * 0.3}} />)}
        </div>
        <div style={{marginTop: 30, fontFamily: SERIF_FONT, fontSize: fit(texts.date, 96, W - PAD * 2 - 80, 0.52), fontWeight: 600, color: theme.background, whiteSpace: 'nowrap'}}>
          <Role role="date">{texts.date}</Role>
        </div>
      </div>
      <div style={{height: 120, display: 'flex', alignItems: 'center', gap: 22, padding: '0 54px', borderRadius: 60, background: theme.background, color: theme.foreground,
        fontSize: fit(texts.cta, 50, 700, 0.56), fontWeight: 800, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={44} />
      </div>
    </AbsoluteFill>
  );
};

export const Anniversary: React.FC<AnniversaryProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={anniversaryMeta} scenes={[SceneYears, SceneThanks]} props={props} />
  </AbsoluteFill>
);
