import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {quotecardMeta} from './meta';
import type {QuotecardProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 100;
type P = SceneProps<QuotecardProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Oversized quote marks drift behind the text.
const Marks: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  return (
    <div aria-hidden style={{position: 'absolute', left: 40, top: 120 - frame * 0.4, fontFamily: SERIF_FONT, fontSize: 900, lineHeight: 1, fontWeight: 800, color}}>&ldquo;</div>
  );
};

// Words rise one at a time, so the quote reads like spoken text.
const SceneQuote: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = texts.quote.split(/\s+/);
  const size = wrapFit(texts.quote, 104, W - PAD * 2, 9, 0.47, 44);
  const step = Math.min(5, 130 / words.length);
  const kicker = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <Marks color={`${theme.accent}40`} />
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, opacity: kicker}}>
        <div style={{flex: 'none', width: 60 * kicker, height: 6, background: theme.accent}} />
        <span style={{fontSize: fit(texts.headline, 44, W - PAD * 2 - 90, 0.56), fontWeight: 700, color: theme.accent2}}><Role role="headline">{texts.headline}</Role></span>
      </div>
      <div style={{position: 'relative', marginTop: 70, fontFamily: SERIF_FONT, fontSize: size, lineHeight: 1.16, fontWeight: 500, color: theme.foreground}}>
        <Role role="quote">
          {words.map((w, i) => {
            const s = spring({frame: frame - 8 - i * step, fps, config: {damping: 18, stiffness: 110}});
            return (
              <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: size * 0.12}}>
                <span style={{display: 'inline-block', transform: `translateY(${(1 - s) * 110}%)`, color: i === words.length - 1 ? theme.accent : undefined}}>{w}&nbsp;</span>
              </span>
            );
          })}
        </Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneByline: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: easeOut});
  const t = interpolate(frame, [14, 36], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.accent, padding: PAD, justifyContent: 'center', clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)`}}>
      <div style={{width: 140, height: 10, background: theme.background, marginBottom: 60, transform: `scaleX(${t})`, transformOrigin: '0 50%'}} />
      <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: wrapFit(texts.author, 110, W - PAD * 2, 2, 0.5, 48), lineHeight: 1.05, fontWeight: 600, color: theme.background, opacity: t, transform: `translateY(${(1 - t) * 40}px)`}}>
        <Role role="author">{texts.author}</Role>
      </div>
      <div style={{marginTop: 34, fontSize: wrapFit(texts.attribution, 44, W - PAD * 2, 2, 0.52, 28), lineHeight: 1.25, fontWeight: 600, color: `${theme.background}cc`, opacity: t}}>
        <Role role="attribution">{texts.attribution}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, top: PAD + 120, fontSize: fit(texts.brand, 40, W - PAD * 2, 0.62), fontWeight: 800, color: theme.background, opacity: interpolate(frame, [30, 46], [0, 1], clamp)}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
    </AbsoluteFill>
  );
};

export const Quotecard: React.FC<QuotecardProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={quotecardMeta} scenes={[SceneQuote, SceneByline]} props={props} />
  </AbsoluteFill>
);
