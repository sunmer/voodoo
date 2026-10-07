import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {folioMeta} from './meta';
import type {FolioProps} from './schema';

const SERIF = '"Playfair Display", "Iowan Old Style", "Times New Roman", Georgia, serif';
const SANS = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
const W = 1920;
const PAD = 140;

const Rule: React.FC<{theme: Theme; delay: number; top: number; color?: string}> = ({theme, delay, top, color}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 30], [0, 1], {...clamp, easing: easeInOut});
  return <div style={{position: 'absolute', left: PAD, top, height: 2, width: (W - PAD * 2) * w, background: color ?? theme.foreground}} />;
};

const Masthead: React.FC<FolioProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [8, 24], [0, 1], clamp);
  return (
    <>
      <Rule theme={theme} delay={0} top={110} />
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 64, display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontSize: 24, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.foreground, opacity: o}}>
        <span>{texts.brand}</span>
        <span style={{color: theme.accent}}>{'No. 01'}</span>
      </div>
    </>
  );
};

// Each line slides up from behind its own mask.
const Line: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame - delay, [0, 26], [105, 0], {...clamp, easing: easeOut});
  return (
    <div style={{overflow: 'hidden', paddingBottom: 8}}>
      <div style={{transform: `translateY(${y}%)`}}>{children}</div>
    </div>
  );
};

const SceneCover: React.FC<FolioProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const words = texts.headline.split(' ');
  const half = Math.ceil(words.length / 2);
  const lines = words.length > 2 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : [texts.headline];
  const longest = Math.max(...lines.map((l) => l.length));
  const size = fit('x'.repeat(longest), 230, W - PAD * 2 - 300, 0.5);
  const block = interpolate(frame, [20, 50], [0, 1], {...clamp, easing: easeInOut});
  const exit = interpolate(frame, [74, 86], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{opacity: 1 - exit}}>
      <Masthead {...props} />
      <div style={{position: 'absolute', right: PAD, top: 180, width: 260, height: 700 * block, background: theme.accent}} />
      <div style={{position: 'absolute', left: PAD, top: 220, fontFamily: SERIF, color: theme.foreground}}>
        {lines.map((l, i) => (
          <Line key={i} delay={10 + i * 8}>
            <div style={{fontSize: size, lineHeight: 1.02, fontWeight: 600, fontStyle: i === lines.length - 1 ? 'italic' : 'normal'}}>{l}</div>
          </Line>
        ))}
      </div>
      <Rule theme={theme} delay={36} top={940} />
    </AbsoluteFill>
  );
};

const SceneQuote: React.FC<FolioProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const words = texts.subhead.split(' ');
  const exit = interpolate(frame, [64, 76], [0, 1], {...clamp, easing: easeIn});
  const mark = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{opacity: 1 - exit, background: theme.surface}}>
      <div style={{position: 'absolute', left: PAD - 20, top: 60, fontFamily: SERIF, fontSize: 520, lineHeight: 1, color: theme.accent, opacity: mark, transform: `translateY(${(1 - mark) * 60}px)`}}>
        {'\u201C'}
      </div>
      <div style={{position: 'absolute', left: PAD + 260, right: PAD + 100, top: 330, display: 'flex', flexWrap: 'wrap', gap: '0 24px', fontFamily: SERIF, fontSize: fit(texts.subhead, 96, 1300 * 2.2, 0.48), lineHeight: 1.18, fontStyle: 'italic', color: theme.foreground}}>
        {words.map((w, i) => (
          <span key={i} style={{opacity: interpolate(frame - 10 - i * 2.5, [0, 12], [0, 1], clamp)}}>
            {w}
          </span>
        ))}
      </div>
      <div style={{position: 'absolute', left: PAD + 260, bottom: 160, fontFamily: SANS, fontSize: 28, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.accent2, opacity: interpolate(frame, [36, 50], [0, 1], clamp)}}>
        {`\u2014 ${texts.brand}`}
      </div>
    </AbsoluteFill>
  );
};

const SceneIndex: React.FC<FolioProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  const cta = interpolate(frame, [40, 56], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <Masthead {...props} />
      {items.map((t, i) => {
        const top = 210 + i * 220;
        const x = interpolate(frame - 6 - i * 8, [0, 24], [80, 0], {...clamp, easing: easeOut});
        const o = interpolate(frame - 6 - i * 8, [0, 16], [0, 1], clamp);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: PAD, top, display: 'flex', alignItems: 'baseline', gap: 60, transform: `translateX(${x}px)`, opacity: o}}>
              <span style={{fontFamily: SANS, fontSize: 34, fontWeight: 700, color: theme.accent}}>{`0${i + 1}`}</span>
              <span style={{fontFamily: SERIF, fontSize: 130, fontWeight: 600, color: theme.foreground}}>{t}</span>
            </div>
            <Rule theme={theme} delay={10 + i * 8} top={top + 190} color={`${theme.foreground}40`} />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', right: PAD, bottom: 70, display: 'flex', alignItems: 'center', gap: 18, fontFamily: SANS, fontSize: 40, fontWeight: 700, color: theme.background, background: theme.foreground, padding: '22px 40px', opacity: cta, transform: `translateY(${(1 - cta) * 30}px)`}}>
        {texts.cta}
        <ArrowIcon size={38} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<FolioProps>[] = [SceneCover, SceneQuote, SceneIndex];

export const Folio: React.FC<FolioProps> = (props) => (
  <AbsoluteFill style={{overflow: 'hidden', background: props.theme.background}}>
    {folioMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
