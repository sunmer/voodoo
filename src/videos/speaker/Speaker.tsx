import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {speakerMeta} from './meta';
import type {SpeakerProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<SpeakerProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const SceneIntro: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const weight = interpolate(frame, [0, 34], [200, 800], {...clamp, easing: easeOut});
  const line = interpolate(frame, [6, 30], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 34, W - PAD * 2, 0.62), fontWeight: 600, color: theme.accent, letterSpacing: 0, opacity: interpolate(frame, [0, 12], [0, 1], clamp)}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{margin: '40px 0', height: 4, width: `${line * 100}%`, background: theme.foreground}} />
      <div style={{fontFamily: SERIF_FONT, fontWeight: weight, fontSize: wrapFit(texts.headline, 150, W - PAD * 2, 3, 0.55, 56), lineHeight: 1.02, color: theme.foreground}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneProfile: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const circle = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: easeInOut});
  const spin = frame * 0.6;
  const name = interpolate(frame - 22, [0, 20], [0, 1], {...clamp, easing: easeOut});
  const role = interpolate(frame - 34, [0, 20], [0, 1], {...clamp, easing: easeOut});
  const date = interpolate(frame - 46, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const R = 250;
  return (
    <AbsoluteFill style={{padding: PAD, paddingTop: 110}}>
      <div style={{position: 'relative', width: R * 2, height: R * 2, alignSelf: 'center'}}>
        <svg width={R * 2 + 80} height={R * 2 + 80} viewBox={`0 0 ${R * 2 + 80} ${R * 2 + 80}`} style={{position: 'absolute', left: -40, top: -40, transform: `rotate(${spin}deg)`}}>
          <circle cx={R + 40} cy={R + 40} r={R + 26} fill="none" stroke={theme.accent2} strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round" opacity={circle} />
        </svg>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', clipPath: `circle(${circle * 50}% at 50% 50%)`,
          background: `radial-gradient(circle at 50% 38%, ${theme.surface} 0 26%, transparent 26.5%), radial-gradient(ellipse at 50% 100%, ${theme.surface} 0 46%, transparent 46.5%), ${theme.accent}`}} />
        <div style={{position: 'absolute', right: -10, top: 20, width: 130, height: 130, borderRadius: '50%', background: theme.foreground, color: theme.background, border: `6px solid ${theme.background}`,
          display: 'grid', placeItems: 'center', fontFamily: SERIF_FONT, fontWeight: 700, fontSize: 50, transform: `scale(${interpolate(frame - 20, [0, 12], [0, 1], {...clamp, easing: easeOut})})`}}>{initials(texts.author)}</div>
      </div>
      <div style={{marginTop: 70, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF_FONT, fontWeight: 700, fontSize: wrapFit(texts.author, 92, W - PAD * 2, 2, 0.52, 40), lineHeight: 1.05, color: theme.foreground,
          opacity: name, transform: `translateY(${(1 - name) * 40}px)`}}>
          <Role role="author">{texts.author}</Role>
        </div>
        <div style={{marginTop: 22, fontSize: wrapFit(texts.attribution, 40, W - PAD * 2, 2, 0.52, 24), lineHeight: 1.25, fontWeight: 500, color: `${theme.foreground}bb`,
          opacity: role, transform: `translateY(${(1 - role) * 30}px)`}}>
          <Role role="attribution">{texts.attribution}</Role>
        </div>
        <div style={{display: 'inline-block', marginTop: 44, padding: '16px 32px', border: `3px solid ${theme.accent}`, borderRadius: 8, fontFamily: MONO_FONT, fontWeight: 700,
          fontSize: fit(texts.date, 36, W - PAD * 2 - 70, 0.62), color: theme.accent, opacity: date, transform: `translateX(${(1 - date) * -60}px)`}}>
          <Role role="date">{texts.date}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Speaker: React.FC<SpeakerProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={speakerMeta} scenes={[SceneIntro, SceneProfile]} props={props} />
  </AbsoluteFill>
);
