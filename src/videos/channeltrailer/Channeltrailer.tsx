import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {channeltrailerMeta} from './meta';
import type {ChanneltrailerProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<ChanneltrailerProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const Corner: React.FC<{inset: number; color: string; rot: number}> = ({inset, color, rot}) => {
  const pos = [{left: inset, top: inset}, {right: inset, top: inset}, {right: inset, bottom: inset}, {left: inset, bottom: inset}][rot];
  return <div style={{position: 'absolute', ...pos, width: 90, height: 90, borderLeft: `8px solid ${color}`, borderTop: `8px solid ${color}`, transform: `rotate(${rot * 90}deg)`}} />;
};

const SceneOpen: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const inset = interpolate(frame, [0, 26], [-120, 70], {...clamp, easing: easeOut});
  const zoom = interpolate(frame, [8, 46], [1.5, 1], {...clamp, easing: easeOut});
  const tc = `00:00:${String(Math.floor(frame / 30)).padStart(2, '0')}:${String(frame % 30).padStart(2, '0')}`;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${theme.surface}55 0 2px, transparent 2px 6px)`}} />
      {[0, 1, 2, 3].map((r) => <Corner key={r} inset={inset} color={theme.foreground} rot={r} />)}
      <div style={{position: 'absolute', left: 130, top: 120, display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO_FONT, fontSize: 34, fontWeight: 700, color: theme.foreground}}>
        <div style={{width: 26, height: 26, borderRadius: '50%', background: theme.accent, opacity: Math.floor(frame / 12) % 2 ? 0.25 : 1}} />{tc}
      </div>
      <div style={{position: 'absolute', right: 130, top: 116, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 38, 700, 0.62), fontWeight: 700, color: theme.accent2, textTransform: 'uppercase'}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{width: 1500, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 900, lineHeight: 0.95, color: theme.foreground, fontSize: wrapFit(texts.headline.toUpperCase(), 210, 1500, 2, 0.66, 70),
        textTransform: 'uppercase', transform: `scale(${zoom})`, opacity: interpolate(frame, [8, 20], [0, 1], clamp)}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneGrid: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = parseList(texts.items);
  const n = items.length;
  const cols = n <= 3 ? n : n === 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const gap = 40;
  const tileW = (1680 - gap * (cols - 1)) / cols;
  const tileH = Math.min(tileW * 0.5625 + 110, (880 - gap * (rows - 1)) / rows);
  const longest = items.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = Math.min(wrapFit(longest, 48, tileW - 40, 2, 0.55, 20), tileH * 0.11);
  const fills = [theme.accent, theme.accent2, theme.surface];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', perspective: 1600}}>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tileW}px)`, gap}}>
        <Role role="items">{items.map((item, i) => {
          const t = interpolate(frame - 4 - i * 7, [0, 22], [0, 1], {...clamp, easing: easeInOut});
          return (
            <div key={i} style={{height: tileH, display: 'flex', flexDirection: 'column', gap: 16, transform: `rotateY(${(1 - t) * -90}deg)`, opacity: t > 0 ? 1 : 0}}>
              <div style={{flex: 1, minHeight: 0, borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'grid', placeItems: 'center',
                background: `repeating-linear-gradient(135deg, ${fills[i % 3]} 0 40px, ${fills[i % 3]}cc 40px 80px)`}}>
                <div style={{width: 96, height: 96, borderRadius: '50%', background: theme.background, display: 'grid', placeItems: 'center'}}>
                  <div style={{marginLeft: 8, width: 0, height: 0, borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderLeft: `32px solid ${theme.foreground}`}} />
                </div>
                <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${interpolate(frame - 30 - i * 7, [0, 40], [0, 70 - i * 8], clamp)}%`, background: theme.foreground}} />
              </div>
              <div style={{fontSize: size, lineHeight: 1.15, fontWeight: 750, color: theme.foreground, overflowWrap: 'anywhere'}}>{item}</div>
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
  const pop = spring({frame: frame - 12, fps, config: {damping: 11, stiffness: 160}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 80}}>
      <div style={{fontFamily: DISPLAY, fontWeight: 850, color: theme.foreground, fontSize: wrapFit(texts.date, 110, 1600, 1, 0.58, 50), whiteSpace: 'nowrap',
        transform: `translateY(${interpolate(frame, [0, 18], [60, 0], {...clamp, easing: easeOut})}px)`, opacity: interpolate(frame, [0, 12], [0, 1], clamp)}}>
        <Role role="date">{texts.date}</Role>
      </div>
      <div style={{position: 'relative'}}>
        {[0, 1].map((k) => {
          const p = ((frame + k * 20) % 40) / 40;
          return <div key={k} style={{position: 'absolute', inset: -10, borderRadius: 80, border: `4px solid ${theme.accent}`, transform: `scale(${1 + p * 0.35})`, opacity: frame > 20 ? 1 - p : 0}} />;
        })}
        <div style={{height: 140, display: 'flex', alignItems: 'center', gap: 26, padding: '0 64px', borderRadius: 70, background: theme.accent, color: theme.background,
          fontSize: fit(texts.cta, 60, 760, 0.56), fontWeight: 850, transform: `scale(${pop})`}}>
          <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <Role role="cta">{texts.cta}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Channeltrailer: React.FC<ChanneltrailerProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={channeltrailerMeta} scenes={[SceneOpen, SceneGrid, SceneSubscribe]} props={props} />
  </AbsoluteFill>
);
