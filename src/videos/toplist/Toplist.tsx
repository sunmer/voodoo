import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {toplistMeta} from './meta';
import type {ToplistProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 80;
type P = SceneProps<ToplistProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = parseList(texts.items).length;
  const zoom = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const t = interpolate(frame, [10, 30], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', fontFamily: FLEX_FONT, fontStretch: '125%', fontSize: 1300, lineHeight: 1, fontWeight: 900, color: theme.accent,
        transform: `scale(${interpolate(zoom, [0, 1], [3, 1])})`, opacity: Math.min(1, zoom * 1.4)}}>{n}</div>
      <div style={{position: 'relative', textAlign: 'center', opacity: t, transform: `translateY(${(1 - t) * 50}px)`}}>
        <div style={{fontFamily: FLEX_FONT, fontStretch: '80%', fontSize: wrapFit(texts.headline.toUpperCase(), 170, W - PAD * 2, 3, 0.5, 60), lineHeight: 0.95, fontWeight: 900,
          color: theme.foreground, textTransform: 'uppercase', textShadow: `0 8px 0 ${theme.background}`}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
        <div style={{marginTop: 40, display: 'inline-block', padding: '14px 30px', background: theme.background, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 40, 700, 0.62), fontWeight: 700, color: theme.foreground, textTransform: 'uppercase'}}>
          <Role role="brand">{texts.brand}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Counts down: the last list entry appears first as the highest rank, entry 1 lands last as number one.
const SceneRanks: React.FC<P> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = parseList(texts.items);
  const n = items.length;
  const slot = (duration - 40) / n;
  const rowH = Math.min(260, 1500 / n);
  const top = (H - rowH * n) / 2 + 40;
  const textW = W - PAD * 2 - 300;
  const longestWord = (s: string) => s.split(/\s+/).reduce((a, w) => (w.length > a.length ? w : a), '');
  const listSize = Math.min(rowH * 0.3, ...items.map((s) => Math.min(wrapFit(s, 80, textW, 2, 0.6, 24), fit(longestWord(s), 80, textW, 0.68))));
  return (
    <AbsoluteFill>
      <Role role="items">{items.map((item, i) => {
        const order = n - 1 - i; // reveal order
        const local = frame - order * slot;
        const enter = spring({frame: local, fps, config: {damping: 15, stiffness: 120}});
        // Each entry first fills the screen, then shrinks into its row.
        const settle = interpolate(local, [slot * 0.45, slot * 0.95], [0, 1], {...clamp, easing: easeInOut});
        const big = 1 - settle;
        const first = i === 0;
        const rowY = top + i * rowH;
        const bigY = H / 2 - rowH / 2;
        const y = interpolate(settle, [0, 1], [bigY, rowY]);
        const scale = interpolate(settle, [0, 1], [first ? 1.5 : 1.3, 1]);
        if (local < 0) return null;
        // Settled rows dim while a new entry is in its big state, so the two never read on top of each other.
        const next = order + 1 < n ? interpolate(frame - (order + 1) * slot, [0, slot * 0.2, slot * 0.45, slot * 0.95], [0, 1, 1, 0], clamp) : 0;
        return (
          <div key={i} style={{position: 'absolute', left: PAD, right: PAD, top: y, height: rowH, display: 'flex', alignItems: 'center', gap: 36,
            transform: `scale(${scale * enter})`, transformOrigin: '50% 50%', opacity: Math.min(1, enter * 2) * (1 - next * 0.85), zIndex: order}}>
            <div style={{width: 190, flex: 'none', textAlign: 'right', fontFamily: FLEX_FONT, fontStretch: '70%', fontSize: rowH * 0.82, lineHeight: 1, fontWeight: 900,
              color: first ? theme.accent : theme.accent2}}>{i + 1}</div>
            <div style={{flex: 1, minWidth: 0, height: rowH * 0.7, display: 'flex', alignItems: 'center', padding: '0 34px', borderRadius: 8, overflowWrap: 'anywhere',
              background: first ? theme.accent : big > 0.5 ? theme.surface : 'transparent', borderBottom: `4px solid ${theme.foreground}22`,
              fontSize: listSize, lineHeight: 1.08, fontWeight: 800, color: first ? theme.background : theme.foreground}}>{item}</div>
          </div>
        );
      })}</Role>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeInOut});
  const cta = spring({frame: frame - 10, fps, config: {damping: 12, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`, justifyContent: 'center', alignItems: 'center', padding: PAD}}>
      <div style={{height: 150, display: 'flex', alignItems: 'center', gap: 26, padding: '0 64px', borderRadius: 75, background: theme.background, color: theme.foreground,
        fontSize: fit(texts.cta, 64, W - PAD * 2 - 220, 0.62), fontWeight: 850, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={56} />
      </div>
    </AbsoluteFill>
  );
};

export const Toplist: React.FC<ToplistProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={toplistMeta} scenes={[SceneTitle, SceneRanks, SceneEnd]} props={props} />
  </AbsoluteFill>
);
