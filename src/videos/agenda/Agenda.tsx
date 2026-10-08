import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {agendaMeta} from './meta';
import type {AgendaProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 90;
type P = SceneProps<AgendaProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneCover: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const grid = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: easeOut});
  const up = (d: number) => ({opacity: interpolate(frame - d, [0, 14], [0, 1], clamp), transform: `translateY(${interpolate(frame - d, [0, 18], [50, 0], {...clamp, easing: easeOut})}px)`});
  return (
    <AbsoluteFill style={{padding: PAD, paddingTop: 220}}>
      <AbsoluteFill style={{opacity: 0.5 * grid, backgroundImage: `linear-gradient(${theme.surface} 2px, transparent 2px), linear-gradient(90deg, ${theme.surface} 2px, transparent 2px)`,
        backgroundSize: '90px 90px', backgroundPosition: '0 0'}} />
      <div style={{position: 'relative', fontFamily: MONO_FONT, fontWeight: 700, fontSize: fit(texts.brand, 38, W - PAD * 2, 0.62), color: theme.accent, textTransform: 'uppercase', ...up(0)}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'relative', marginTop: 50, fontFamily: DISPLAY, fontWeight: 900, fontSize: wrapFit(texts.headline, 170, W - PAD * 2, 3, 0.6, 64), lineHeight: 0.98, color: theme.foreground, ...up(8)}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 260, display: 'flex', alignItems: 'center', gap: 28, ...up(20)}}>
        <svg width={70} height={70} viewBox="0 0 24 24" fill="none" stroke={theme.accent2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none'}}>
          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span style={{fontSize: fit(texts.date, 58, W - PAD * 2 - 100, 0.56), fontWeight: 750, color: theme.foreground}}><Role role="date">{texts.date}</Role></span>
      </div>
    </AbsoluteFill>
  );
};

// Session times are derived from the slot index, so the list needs no time field.
const slotTime = (i: number) => {
  const m = 9 * 60 + i * 75;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const SceneTimeline: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = parseList(texts.items);
  const top = 200;
  const span = H - top - 220;
  const row = span / items.length;
  const draw = interpolate(frame, [0, 70], [0, 1], {...clamp, easing: easeInOut});
  const longest = items.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(wrapFit(longest, 60, W - PAD - 330, 2, 0.55, 26), row * 0.28);
  const x = PAD + 170;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: x, top: top + row / 2, width: 6, height: (span - row) * draw, background: theme.accent, borderRadius: 3}} />
      <Role role="items">{items.map((item, i) => {
        const at = (i / Math.max(1, items.length - 1)) * 0.86;
        const t = interpolate(draw - at, [0, 0.12], [0, 1], clamp);
        const y = top + row * i;
        return (
          <div key={i} style={{position: 'absolute', left: PAD, right: PAD, top: y, height: row, display: 'flex', alignItems: 'center'}}>
            <span style={{width: 150, fontFamily: MONO_FONT, fontWeight: 700, fontSize: 34, color: theme.accent2, opacity: t}}>{slotTime(i)}</span>
            <div style={{width: 44, height: 44, marginLeft: -2, borderRadius: '50%', flex: 'none', background: theme.background, border: `6px solid ${theme.accent}`, transform: `scale(${t})`}} />
            <div style={{marginLeft: 40, minWidth: 0, flex: 1, padding: '24px 30px', borderRadius: 8, background: theme.surface, opacity: t, transform: `translateX(${(1 - t) * 80}px)`,
              fontSize: size, lineHeight: 1.15, fontWeight: 700, color: theme.foreground, overflowWrap: 'anywhere'}}>{item}</div>
          </div>
        );
      })}</Role>
    </AbsoluteFill>
  );
};

export const Agenda: React.FC<AgendaProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={agendaMeta} scenes={[SceneCover, SceneTimeline]} props={props} exit="slide" />
  </AbsoluteFill>
);
