import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {comparisonMeta} from './meta';
import type {ComparisonProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
const COL = 420;
type P = SceneProps<ComparisonProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Check and cross marks drawn on with a stroke dash.
const Mark: React.FC<{good: boolean; t: number; color: string}> = ({good, t, color}) => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    {good
      ? <path d="M4.5 12.5l5 5L19.5 6.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      : <path d="M6 6l12 12M18 6L6 18" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />}
  </svg>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: easeOut});
  const g = interpolate(frame, [4, 40], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: PAD, right: PAD, top: 200 + i * 220, height: 2, background: `${theme.foreground}18`, transform: `scaleX(${g})`, transformOrigin: '0 50%'}} />
      ))}
      <div style={{fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 190, W - PAD * 2, 2, 0.6, 60), lineHeight: 1, fontWeight: 900, color: theme.foreground,
        opacity: t, transform: `translateY(${(1 - t) * 50}px)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneTable: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = parseList(texts.items);
  const n = items.length;
  const headH = 170;
  const top = 110;
  const rowH = Math.min(170, (H - top - headH - 70) / n);
  const labelW = W - PAD * 2 - COL * 2 - 40;
  const textW = labelW - 90;
  const longestWord = (s: string) => s.split(/\s+/).reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(rowH * 0.4, ...items.map((s) => Math.min(wrapFit(s, 64, textW, 2, 0.58, 24), fit(longestWord(s), 64, textW, 0.66))));
  const head = spring({frame, fps, config: {damping: 14, stiffness: 130}});
  const ours = interpolate(frame, [10, 34], [0, 1], {...clamp, easing: easeOut});
  // Headers wrap to two lines before they shrink.
  const headSize = (s: string) => Math.min(wrapFit(s.toUpperCase(), 64, COL - 60, 2, 0.72, 24), fit(longestWord(s.toUpperCase()), 64, COL - 60, 0.76));
  const colX = (i: number) => W - PAD - COL * (2 - i);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: colX(1), top: top - 20, width: COL, height: headH + rowH * n + 40, borderRadius: 8, background: theme.accent,
        transform: `scaleY(${ours})`, transformOrigin: '50% 0%'}} />
      {[texts.point1, texts.point2].map((label, i) => (
        <div key={i} style={{position: 'absolute', left: colX(i), top, width: COL, height: headH, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1, padding: '0 30px',
          fontFamily: DISPLAY, fontSize: headSize(label), fontWeight: 900, textTransform: 'uppercase', color: i ? theme.background : `${theme.foreground}99`,
          opacity: head, transform: `translateY(${(1 - head) * -40}px)`}}>
          <Role role={i ? 'point2' : 'point1'}>{label}</Role>
        </div>
      ))}
      <Role role="items">{items.map((item, r) => {
        const t = interpolate(frame - 20 - r * 12, [0, 18], [0, 1], {...clamp, easing: easeOut});
        const m1 = interpolate(frame - 30 - r * 12, [0, 14], [0, 1], clamp);
        const m2 = interpolate(frame - 36 - r * 12, [0, 14], [0, 1], clamp);
        const y = top + headH + r * rowH;
        return (
          <React.Fragment key={r}>
            <div style={{position: 'absolute', left: PAD, top: y, width: W - PAD * 2, height: 2, background: `${theme.foreground}22`, transform: `scaleX(${t})`, transformOrigin: '0 50%'}} />
            <div style={{position: 'absolute', left: PAD, top: y, width: labelW, height: rowH, display: 'flex', alignItems: 'center', gap: 28, opacity: t, transform: `translateX(${(1 - t) * -50}px)`}}>
              <span style={{fontFamily: MONO_FONT, fontSize: 34, fontWeight: 700, color: theme.accent2, flex: 'none'}}>{String(r + 1).padStart(2, '0')}</span>
              <span style={{fontSize: size, lineHeight: 1.1, fontWeight: 700, color: theme.foreground}}>{item}</span>
            </div>
            <div style={{position: 'absolute', left: colX(0), top: y, width: COL, height: rowH, display: 'grid', placeItems: 'center'}}><Mark good={false} t={m1} color={`${theme.foreground}66`} /></div>
            <div style={{position: 'absolute', left: colX(1), top: y, width: COL, height: rowH, display: 'grid', placeItems: 'center'}}><Mark good t={m2} color={theme.background} /></div>
          </React.Fragment>
        );
      })}</Role>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeInOut});
  const cta = spring({frame: frame - 12, fps, config: {damping: 12, stiffness: 150}});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `inset(0 ${(1 - t) * (W - PAD - COL) / W * 100}% 0 ${(1 - t) * (W - PAD - COL) / W * 100}%)`, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{height: 150, display: 'flex', alignItems: 'center', gap: 28, padding: '0 70px', borderRadius: 75, background: theme.background, color: theme.foreground,
        fontSize: fit(texts.cta, 68, 1000, 0.62), fontWeight: 850, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={58} />
      </div>
    </AbsoluteFill>
  );
};

export const Comparison: React.FC<ComparisonProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={comparisonMeta} scenes={[SceneTitle, SceneTable, SceneEnd]} props={props} />
  </AbsoluteFill>
);
