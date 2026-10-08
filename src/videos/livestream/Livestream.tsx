import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticLine, clamp, easeOut, fit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {livestreamMeta} from './meta';
import type {LivestreamProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
type P = SceneProps<LivestreamProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// The progress bar spans the whole video, so a looped screen reads as continuous waiting.
const Progress: React.FC<{theme: LivestreamProps['theme']; offset: number}> = ({theme, offset}) => {
  const frame = useCurrentFrame() + offset;
  const t = frame / livestreamMeta.durationInFrames;
  return (
    <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 90, height: 10, borderRadius: 5, background: `${theme.foreground}1f`, overflow: 'hidden'}}>
      <div style={{width: `${t * 100}%`, height: '100%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`}} />
    </div>
  );
};

const SceneWait: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const size = fit(texts.headline, 190, W - PAD * 2 - 320, 0.6);
  const date = interpolate(frame, [30, 48], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 34, 700, 0.62), fontWeight: 700, color: theme.foreground}}>
        <div style={{position: 'relative', width: 26, height: 26}}>
          {[0, 1, 2].map((i) => {
            const p = ((frame + i * 20) % 60) / 60;
            return <div key={i} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${theme.accent}`, transform: `scale(${1 + p * 2.4})`, opacity: 1 - p}} />;
          })}
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: theme.accent}} />
        </div>
        <Role role="brand">{texts.brand}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, top: 330}}>
        <Role role="headline"><KineticLine text={texts.headline} size={size} color={theme.foreground} delay={4} stagger={1.4} /></Role>
      </div>
      <div style={{position: 'absolute', left: PAD, top: 360 + size * 1.1, display: 'flex', alignItems: 'center', gap: 20, opacity: date, transform: `translateY(${(1 - date) * 24}px)`}}>
        <div style={{width: 60, height: 4, background: theme.accent2}} />
        <span style={{fontFamily: MONO_FONT, fontSize: fit(texts.date, 48, 1100, 0.62), fontWeight: 700, color: theme.accent2}}><Role role="date">{texts.date}</Role></span>
      </div>
      <Progress theme={theme} offset={0} />
    </AbsoluteFill>
  );
};

const SceneTopics: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = parseList(texts.items);
  const cols = items.length <= 3 ? items.length : Math.ceil(items.length / 2);
  const cell = (W - PAD * 2 - (cols - 1) * 32) / cols;
  const longest = items.reduce((a, w) => (w.length > a.length ? w : a), '');
  const size = fit(longest, 54, cell - 70, 0.56);
  const cta = interpolate(frame, [26, 44], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap: 32}}>
        <Role role="items">{items.map((item, i) => {
          const s = spring({frame: frame - i * 5, fps, config: {damping: 15, stiffness: 140}});
          return (
            <div key={i} style={{height: 210, borderRadius: 8, background: theme.surface, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transform: `translateY(${(1 - s) * 80}px)`, opacity: s, borderTop: `6px solid ${i % 2 ? theme.accent2 : theme.accent}`}}>
              <span style={{fontFamily: MONO_FONT, fontSize: 26, fontWeight: 700, color: `${theme.foreground}88`}}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{fontFamily: DISPLAY, fontSize: size, fontWeight: 800, color: theme.foreground, whiteSpace: 'nowrap'}}>{item}</span>
            </div>
          );
        })}</Role>
      </div>
      <div style={{marginTop: 70, fontSize: fit(texts.cta, 52, 1200, 0.56), fontWeight: 750, color: theme.foreground, opacity: cta}}>
        <Role role="cta">{texts.cta}</Role>
      </div>
      <Progress theme={theme} offset={livestreamMeta.scenes[1].from} />
    </AbsoluteFill>
  );
};

export const Livestream: React.FC<LivestreamProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={livestreamMeta} scenes={[SceneWait, SceneTopics]} props={props} />
  </AbsoluteFill>
);
