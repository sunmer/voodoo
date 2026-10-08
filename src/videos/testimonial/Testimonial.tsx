import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {testimonialMeta} from './meta';
import type {TestimonialProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<TestimonialProps>;

const Stars: React.FC<{theme: Theme; frame: number}> = ({theme, frame}) => (
  <div style={{display: 'flex', gap: 14}}>
    {[0, 1, 2, 3, 4].map((i) => {
      const t = interpolate(frame - i * 4, [0, 12], [0, 1], {...clamp, easing: easeOut});
      return (
        <svg key={i} width={44} height={44} viewBox="0 0 24 24" style={{transform: `scale(${t})`}}>
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill={theme.accent} />
        </svg>
      );
    })}
  </div>
);

const SceneQuote: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.quote.split(' ');
  const size = wrapFit(texts.quote, 76, W - PAD * 2, 7, 0.5, 40);
  const mark = spring({frame, fps: 30, config: {damping: 14, stiffness: 110}});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontFamily: SERIF_FONT, fontSize: 300, lineHeight: 0.6, height: 150, color: theme.accent, transform: `translateY(${(1 - mark) * -80}px)`, opacity: mark}}>“</div>
      <Stars theme={theme} frame={frame - 10} />
      <div style={{marginTop: 44, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.25, fontFamily: SERIF_FONT, fontSize: size, lineHeight: 1.18, fontWeight: 500, color: theme.foreground}}>
        <span data-text-role="quote" style={{display: 'contents'}}>{words.map((w, i) => {
          const t = interpolate(frame - 22 - i * 2.4, [0, 10], [0, 1], {...clamp, easing: easeOut});
          return <span key={i} style={{display: 'inline-block', opacity: 0.12 + t * 0.88}}>{w}</span>;
        })}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneAuthor: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const line = interpolate(frame, [10, 32], [0, 1], {...clamp, easing: easeInOut});
  const stat = interpolate(frame, [22, 40], [0, 1], {...clamp, easing: easeOut});
  const initials = texts.author.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', gap: 70}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, transform: `translateX(${(1 - card) * -500}px)`, opacity: card}}>
        <div style={{width: 170, height: 170, flex: 'none', borderRadius: '50%', display: 'grid', placeItems: 'center', background: theme.accent2, color: theme.background, fontSize: 64, fontWeight: 800}}>{initials}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0}}>
          <span style={{fontSize: fit(texts.author, 62, 640, 0.56), fontWeight: 800, color: theme.foreground, whiteSpace: 'nowrap'}}><span data-text-role="author" style={{display: 'contents'}}>{texts.author}</span></span>
          <span style={{fontSize: fit(texts.headline, 36, 640, 0.55), color: `${theme.foreground}aa`, whiteSpace: 'nowrap'}}><span data-text-role="headline" style={{display: 'contents'}}>{texts.headline}</span></span>
        </div>
      </div>
      <div style={{height: 4, width: (W - PAD * 2) * line, background: theme.accent}} />
      <div style={{padding: '40px 46px', borderRadius: 8, background: theme.surface, opacity: stat, transform: `translateY(${(1 - stat) * 50}px)`}}>
        <div style={{fontFamily: MONO_FONT, fontSize: 26, fontWeight: 700, color: theme.accent, textTransform: 'uppercase'}}>Result</div>
        <div style={{marginTop: 14, fontSize: fit(texts.point1, 92, W - PAD * 2 - 92, 0.58), fontWeight: 850, color: theme.foreground, whiteSpace: 'nowrap'}}><span data-text-role="point1" style={{display: 'contents'}}>{texts.point1}</span></div>
      </div>
    </AbsoluteFill>
  );
};

const SceneBrand: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 15, stiffness: 120}});
  const cta = spring({frame: frame - 14, fps, config: {damping: 13, stiffness: 140}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 60, background: theme.foreground, clipPath: `inset(${(1 - s) * 50}% 0 ${(1 - s) * 50}% 0)`}}>
      <div style={{fontSize: fit(texts.brand, 130, W - PAD * 2, 0.6), fontWeight: 880, color: theme.background}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{height: 104, display: 'flex', alignItems: 'center', gap: 20, padding: '0 44px', borderRadius: 52, background: theme.accent, color: theme.foreground, fontSize: fit(texts.cta, 44, 600, 0.56), fontWeight: 800, transform: `scale(${cta})`}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={40} />
      </div>
    </AbsoluteFill>
  );
};

export const Testimonial: React.FC<TestimonialProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={testimonialMeta} scenes={[SceneQuote, SceneAuthor, SceneBrand]} props={props} />
  </AbsoluteFill>
);
