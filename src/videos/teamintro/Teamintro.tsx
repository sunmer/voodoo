import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {teamintroMeta} from './meta';
import type {TeamintroProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const CARD_W = 720;
const CARD_H = 900;
type P = SceneProps<TeamintroProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

// An ID badge drops in on a lanyard and swings to rest.
const SceneBadge: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 90}});
  const swing = Math.sin(frame / 9) * 7 * Math.exp(-frame / 40);
  const stamp = spring({frame: frame - 52, fps, config: {damping: 9, stiffness: 190}});
  const head = interpolate(frame, [26, 44], [0, 1], {...clamp, easing: easeOut});
  const inner = CARD_W - 120;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 0, left: W / 2 - 14, width: 28, height: 150, background: theme.accent2}} />
      <div style={{position: 'absolute', top: 120 - (1 - drop) * 1300, width: CARD_W, height: CARD_H, transformOrigin: '50% -40px', transform: `rotate(${swing}deg)`,
        background: theme.surface, borderRadius: 36, boxShadow: '0 40px 80px rgba(0,0,0,0.25)', padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: 120, height: 26, borderRadius: 13, background: theme.background}} />
        <div style={{marginTop: 30, width: '100%', display: 'flex', justifyContent: 'space-between', fontFamily: MONO_FONT, fontSize: fit(texts.brand, 30, inner - 140, 0.62),
          fontWeight: 700, color: theme.foreground, textTransform: 'uppercase'}}>
          <Role role="brand">{texts.brand}</Role><span style={{color: theme.accent}}>ID</span>
        </div>
        <div style={{marginTop: 50, width: 300, height: 300, borderRadius: '50%', background: theme.accent, display: 'grid', placeItems: 'center',
          fontFamily: DISPLAY, fontSize: 130, fontWeight: 900, color: theme.background}}>{initials(texts.author)}</div>
        <div style={{marginTop: 56, width: inner, textAlign: 'center', fontFamily: DISPLAY, fontSize: wrapFit(texts.author, 76, inner, 2, 0.6, 36), lineHeight: 1.02,
          fontWeight: 900, color: theme.foreground}}>
          <Role role="author">{texts.author}</Role>
        </div>
        <div style={{marginTop: 22, width: inner, textAlign: 'center', fontSize: wrapFit(texts.attribution, 36, inner, 2, 0.54, 22), lineHeight: 1.2, fontWeight: 600,
          color: `${theme.foreground}aa`}}>
          <Role role="attribution">{texts.attribution}</Role>
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1080, display: 'flex', justifyContent: 'center'}}>
        <div style={{padding: '20px 34px', background: theme.accent2, color: theme.background, borderRadius: 14,
          fontFamily: DISPLAY, fontSize: fit(texts.headline, 60, W - 260, 0.66), fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap',
          transform: `scale(${stamp}) rotate(${-4 - (1 - stamp) * 30}deg)`, opacity: head}}>
        <Role role="headline">{texts.headline}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The badge flips to its back, which carries the new team member's quote.
const SceneQuote: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [0, 30], [90, 0], {...clamp, easing: easeInOut});
  const words = texts.quote.split(/\s+/);
  const inner = CARD_W - 140;
  const size = wrapFit(texts.quote, 84, inner, 8, 0.5, 34);
  return (
    <AbsoluteFill style={{alignItems: 'center', perspective: 1800}}>
      <div style={{position: 'absolute', top: 0, left: W / 2 - 14, width: 28, height: 150, background: theme.accent2}} />
      <div style={{position: 'absolute', top: 120, width: CARD_W, height: CARD_H, background: theme.accent, borderRadius: 36, padding: 70,
        transform: `rotateY(${flip}deg)`, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{position: 'absolute', left: 60, top: 30, fontFamily: SERIF_FONT, fontSize: 260, lineHeight: 1, color: `${theme.background}55`}}>&ldquo;</div>
        <div style={{fontFamily: SERIF_FONT, fontSize: size, lineHeight: 1.18, fontWeight: 500, color: theme.background}}>
          <Role role="quote">{words.map((w, i) => {
            const t = interpolate(frame - 26 - i * 1.6, [0, 12], [0, 1], clamp);
            return <span key={i} style={{opacity: 0.15 + t * 0.85}}>{w} </span>;
          })}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Teamintro: React.FC<TeamintroProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={teamintroMeta} scenes={[SceneBadge, SceneQuote]} props={props} />
  </AbsoluteFill>
);
