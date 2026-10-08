import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {timelineMeta} from './meta';
import type {TimelineProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
type P = SceneProps<TimelineProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// "2019 Founded in a garage" -> {mark: "2019", label: "Founded in a garage"}. Entries without a leading number get their index.
const splitEntry = (entry: string, i: number) => {
  const m = entry.match(/^(\S*\d\S*)\s+(.+)$/);
  return m ? {mark: m[1], label: m[2]} : {mark: String(i + 1).padStart(2, '0'), label: entry};
};

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [10, 50], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: DISPLAY, fontSize: wrapFit(texts.headline, 170, W - PAD * 2, 2, 0.6, 60), lineHeight: 1, fontWeight: 900, color: theme.foreground,
        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 260, height: 6, width: W * line, background: theme.accent}} />
      <div style={{position: 'absolute', left: W * line - 18, bottom: 248, width: 30, height: 30, borderRadius: '50%', background: theme.accent, opacity: line > 0.02 ? 1 : 0}} />
    </AbsoluteFill>
  );
};

const SceneTrackLine: React.FC<P> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entries = parseList(texts.items).map(splitEntry);
  const n = entries.length;
  const step = 600;
  const lineY = 600;
  const trackW = step * (n - 1);
  const labelW = step - 120;
  // Progress along the route: 0 at the first node, 1 at the last.
  const p = interpolate(frame, [10, duration - 70], [0, 1], {...clamp, easing: easeInOut});
  const head = p * trackW;
  // Camera keeps the head near the center, and stops when the last label fits on screen.
  const camMax = Math.max(0, trackW + PAD * 2 + 80 + labelW - W);
  const cam = Math.max(0, Math.min(head - (W / 2 - PAD - 100), camMax));
  const x0 = PAD + 100 - cam;
  const labelSize = Math.min(64, ...entries.map((e) => wrapFit(e.label, 64, labelW, 2, 0.56, 34)));
  const markSize = Math.min(150, ...entries.map((e) => fit(e.mark, 150, labelW, 0.62)));
  return (
    <AbsoluteFill>
      {Array.from({length: 24}, (_, i) => (
        <div key={i} style={{position: 'absolute', top: 0, bottom: 0, width: 2, left: ((i * 160 - cam * 0.4) % (24 * 160) + 24 * 160) % (24 * 160) - 160, background: `${theme.foreground}0c`}} />
      ))}
      <Role role="items">
        <div style={{position: 'absolute', left: x0, top: lineY - 3, width: trackW, height: 6, background: `${theme.foreground}22`}} />
        <div style={{position: 'absolute', left: x0, top: lineY - 3, width: head, height: 6, background: theme.accent}} />
        {entries.map((e, i) => {
          const at = i * step;
          const hit = interpolate(head - at, [-60, 90], [0, 1], {...clamp, easing: easeOut});
          const reached = head >= at - 1;
          const above = i % 2 === 0;
          // Fade labels that scroll off the left edge, so no clipped text shows.
          const edge = interpolate(x0 + at, [-140, PAD + 20], [0, 1], clamp);
          return (
            <div key={i} style={{position: 'absolute', left: x0 + at, top: 0, height: H, opacity: edge}}>
              <div style={{position: 'absolute', left: -26, top: lineY - 26, width: 52, height: 52, borderRadius: '50%', background: reached ? theme.accent : theme.background,
                border: `6px solid ${reached ? theme.accent : `${theme.foreground}44`}`, transform: `scale(${0.6 + hit * 0.4})`}} />
              <div style={{position: 'absolute', left: -3, width: 6, top: above ? lineY - 120 : lineY + 30, height: 90 * hit, background: `${theme.foreground}33`}} />
              <div style={{position: 'absolute', left: -20, width: labelW, ...(above ? {bottom: H - lineY + 130} : {top: lineY + 130}), opacity: hit, transform: `translateY(${(1 - hit) * (above ? 40 : -40)}px)`}}>
                <div style={{fontFamily: MONO_FONT, fontSize: markSize, lineHeight: 1, fontWeight: 800, color: reached ? theme.accent : theme.foreground, whiteSpace: 'nowrap'}}>{e.mark}</div>
                <div style={{marginTop: 14, fontSize: labelSize, lineHeight: 1.12, fontWeight: 700, color: theme.foreground}}>{e.label}</div>
              </div>
            </div>
          );
        })}
      </Role>
    </AbsoluteFill>
  );
};

const SceneByline: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [10, 28], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.foreground, padding: PAD, justifyContent: 'center', clipPath: `inset(0 0 0 ${(1 - t) * 100}%)`}}>
      <div style={{fontFamily: DISPLAY, fontSize: fit(texts.brand, 200, W - PAD * 2, 0.64), lineHeight: 1, fontWeight: 900, color: theme.background}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 28, opacity: sub}}>
        <div style={{width: 60, height: 6, background: theme.accent, flex: 'none'}} />
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.attribution, 40, W - PAD * 2 - 90, 0.62), color: `${theme.background}cc`}}>
          <Role role="attribution">{texts.attribution}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Timeline: React.FC<TimelineProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={timelineMeta} scenes={[SceneTitle, SceneTrackLine, SceneByline]} props={props} />
  </AbsoluteFill>
);
