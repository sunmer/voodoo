import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, fit} from '../shared/motion';
import {MONO_FONT, SERIF_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {creditsMeta} from './meta';
import type {CreditsProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<CreditsProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// "Role: Name" entries split into two columns. Plain entries stay centered.
const split = (item: string) => {
  const i = item.indexOf(':');
  return i > 0 ? [item.slice(0, i).trim(), item.slice(i + 1).trim()] : ['', item];
};

const SceneRoll: React.FC<P> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const items = parseList(texts.items).map(split);
  const y = interpolate(frame, [0, duration], [760, -520], clamp);
  const longest = items.reduce((a, [, n]) => (n.length > a.length ? n : a), '');
  const size = Math.min(58, fit(longest, 58, 760, 0.55));
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${y}px)`, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: fit(texts.headline, 112, 1500, 0.5), fontWeight: 500, color: theme.foreground, marginBottom: 110}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
        <Role role="items">{items.map(([job, name], i) => (
          <div key={i} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, alignItems: 'baseline', marginBottom: 54}}>
            <div style={{textAlign: 'right', fontFamily: MONO_FONT, fontSize: 30, fontWeight: 600, color: theme.accent, textTransform: 'uppercase'}}>{job || ' '}</div>
            <div style={{textAlign: 'left', fontFamily: SERIF_FONT, fontSize: size, fontWeight: 600, color: theme.foreground, whiteSpace: 'nowrap'}}>{name}</div>
          </div>
        ))}</Role>
      </div>
      <AbsoluteFill style={{pointerEvents: 'none', background: `linear-gradient(${theme.background}, transparent 18%, transparent 82%, ${theme.background})`}} />
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 46}}>
      <div style={{width: 520 * t, height: 2, background: theme.accent2}} />
      <div style={{fontFamily: SERIF_FONT, fontSize: fit(texts.brand, 120, 1500, 0.56), fontWeight: 700, color: theme.foreground, opacity: t}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.cta, 38, 1200, 0.62), color: theme.accent, textTransform: 'uppercase', opacity: interpolate(frame, [16, 34], [0, 1], clamp)}}>
        <Role role="cta">{texts.cta}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Credits: React.FC<CreditsProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={creditsMeta} scenes={[SceneRoll, SceneEnd]} props={props} />
  </AbsoluteFill>
);
