import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {newsletterMeta} from './meta';
import type {NewsletterProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
const ENV_W = 860;
const ENV_H = 560;
type P = SceneProps<NewsletterProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// An envelope opens and a letter with the newsletter title slides up out of it.
const SceneEnvelope: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 15, stiffness: 110}});
  const flap = interpolate(frame, [18, 38], [0, 180], {...clamp, easing: easeInOut});
  const rise = interpolate(frame, [34, 66], [0, 1], {...clamp, easing: easeOut});
  const top = 1000;
  const inner = ENV_W - 140;
  return (
    <AbsoluteFill style={{alignItems: 'center', perspective: 2000}}>
      <div style={{position: 'absolute', top: 170, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, W - PAD * 2, 0.62), fontWeight: 700, color: theme.foreground,
        textTransform: 'uppercase', opacity: enter}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', top: top + (1 - enter) * 900, width: ENV_W, height: ENV_H}}>
        <div style={{position: 'absolute', inset: 0, background: theme.accent, borderRadius: 18}} />
        <div style={{position: 'absolute', left: 40, right: 40, top: 40 - rise * 620, height: 760, background: theme.surface, borderRadius: 14, padding: 70,
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)'}}>
          <div style={{height: 8, width: 140, background: theme.accent2}} />
          <div style={{marginTop: 40, fontFamily: SERIF_FONT, fontSize: wrapFit(texts.headline, 96, inner, 3, 0.52, 44), lineHeight: 1.02, fontWeight: 600, color: theme.foreground}}>
            <Role role="headline">{texts.headline}</Role>
          </div>
          {[0, 1, 2].map((i) => <div key={i} style={{marginTop: i ? 22 : 50, height: 14, width: `${90 - i * 18}%`, borderRadius: 7, background: `${theme.foreground}22`}} />)}
        </div>
        <div style={{position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', clipPath: 'polygon(0 22%, 50% 62%, 100% 22%, 100% 100%, 0 100%)', background: theme.accent}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(0,0,0,0.12))'}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: ENV_H * 0.62, transformOrigin: 'top', transform: `rotateX(${flap}deg)`,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: theme.accent2, zIndex: flap > 90 ? -1 : 2}} />
      </div>
    </AbsoluteFill>
  );
};

const SceneIssue: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = parseList(texts.items);
  const row = Math.min(220, 1200 / items.length);
  const width = W - PAD * 2 - 130;
  const size = Math.min(...items.map((item) => wrapFit(item, 72, width, 2, 0.56, 30)), row * 0.3);
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 32, fontWeight: 700, color: theme.accent, opacity: interpolate(frame, [0, 12], [0, 1], clamp)}}>IN EVERY ISSUE</div>
      <div style={{marginTop: 40}}>
        <Role role="items">{items.map((item, i) => {
          const t = interpolate(frame - 8 - i * 9, [0, 20], [0, 1], {...clamp, easing: easeOut});
          const check = interpolate(frame - 20 - i * 9, [0, 12], [0, 1], clamp);
          return (
            <div key={i} style={{minHeight: row, display: 'flex', alignItems: 'center', gap: 40, borderTop: `3px solid ${theme.foreground}22`, opacity: t,
              transform: `translateX(${(1 - t) * -80}px)`}}>
              <div style={{width: 84, height: 84, flex: 'none', borderRadius: 18, border: `4px solid ${theme.accent}`, display: 'grid', placeItems: 'center'}}>
                <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={theme.accent2} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l5 5L20 6" strokeDasharray={24} strokeDashoffset={24 * (1 - check)} />
                </svg>
              </div>
              <span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.05, fontWeight: 850, color: theme.foreground}}>{item}</span>
            </div>
          );
        })}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneSubscribe: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const field = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const typed = 'you@email.com'.slice(0, Math.max(0, Math.floor((frame - 10) / 1.6)));
  const press = spring({frame: frame - 34, fps, config: {damping: 10, stiffness: 180}});
  const icon = spring({frame, fps, config: {damping: 12, stiffness: 140}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 44}}>
      <div style={{alignSelf: 'center', width: 300, height: 220, marginBottom: 60, position: 'relative', transform: `scale(${icon}) rotate(${(1 - icon) * -12}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: theme.accent}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 140, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: theme.accent2}} />
      </div>
      <div style={{height: 170, borderRadius: 26, background: theme.surface, border: `3px solid ${theme.foreground}22`, display: 'flex', alignItems: 'center', padding: '0 50px',
        transform: `scaleX(${field})`, transformOrigin: 'left', fontFamily: MONO_FONT, fontSize: 54, color: `${theme.foreground}99`}}>
        {typed}<span style={{width: 4, height: 60, marginLeft: 6, background: theme.accent, opacity: frame % 20 < 10 ? 1 : 0}} />
      </div>
      <div style={{height: 170, borderRadius: 26, background: theme.accent, color: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
        fontSize: fit(texts.cta, 70, W - PAD * 2 - 160, 0.56), fontWeight: 850, whiteSpace: 'nowrap', transform: `scale(${0.9 + press * 0.1})`, opacity: Math.min(1, press * 1.5)}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={52} />
      </div>
    </AbsoluteFill>
  );
};

export const Newsletter: React.FC<NewsletterProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={newsletterMeta} scenes={[SceneEnvelope, SceneIssue, SceneSubscribe]} props={props} />
  </AbsoluteFill>
);
