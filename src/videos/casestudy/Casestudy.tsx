import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {casestudyMeta} from './meta';
import type {CasestudyProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1350;
const PAD = 90;
type P = SceneProps<CasestudyProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Report-style frame: margin rule and page index shared by every scene.
const Page: React.FC<{theme: CasestudyProps['theme']; index: number; children: React.ReactNode}> = ({theme, index, children}) => (
  <AbsoluteFill style={{padding: PAD}}>
    <div style={{position: 'absolute', left: PAD, right: PAD, top: PAD, height: 2, background: `${theme.foreground}33`}} />
    <div style={{position: 'absolute', right: PAD, bottom: PAD - 20, fontFamily: MONO_FONT, fontSize: 26, color: `${theme.foreground}66`}}>0{index} / 04</div>
    {children}
  </AbsoluteFill>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [4, 34], [0, 1], {...clamp, easing: easeInOut});
  return (
    <Page theme={theme} index={1}>
      <div style={{marginTop: 50, fontFamily: MONO_FONT, fontSize: fit(texts.brand, 34, W - PAD * 2, 0.62), fontWeight: 700, color: theme.accent}}><Role role="brand">{texts.brand}</Role></div>
      <div style={{marginTop: 'auto', marginBottom: 120, fontFamily: SERIF_FONT, fontSize: wrapFit(texts.headline, 136, W - PAD * 2, 3, 0.58, 56), lineHeight: 1.04, fontWeight: 600, color: theme.foreground, clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
    </Page>
  );
};

const SceneStat: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [6, 54], [0, 1], {...clamp, easing: easeOut});
  const n = parseNumber(texts.stat);
  return (
    <Page theme={theme} index={2}>
      <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: 560 * t, background: theme.accent}} />
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 330, fontFamily: DISPLAY, fontSize: fit(texts.stat, 330, W - PAD * 2, 0.64), fontWeight: 900, lineHeight: 1, color: theme.foreground}}>
        <Role role="stat">{formatNumber(n, t)}</Role>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 140, height: 18, borderRadius: 9, background: `${theme.background}44`}}>
        <div style={{width: `${t * 100}%`, height: '100%', borderRadius: 9, background: theme.background}} />
      </div>
    </Page>
  );
};

const SceneQuote: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.quote.split(/\s+/);
  const size = wrapFit(texts.quote, 76, W - PAD * 2, 6, 0.48, 36);
  const by = interpolate(frame, [40, 58], [0, 1], {...clamp, easing: easeOut});
  return (
    <Page theme={theme} index={3}>
      <div style={{width: 12, height: 160, background: theme.accent, marginTop: 120}} />
      <div style={{marginTop: 50, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: size, lineHeight: 1.2, color: theme.foreground}}>
        <Role role="quote">
          {words.map((w, i) => (
            <span key={i} style={{opacity: interpolate(frame - i * 1.2, [0, 10], [0.12, 1], clamp)}}>{w} </span>
          ))}
        </Role>
      </div>
      <div style={{marginTop: 50, fontSize: fit(texts.attribution, 34, W - PAD * 2, 0.52), fontWeight: 600, color: `${theme.foreground}aa`, opacity: by}}><Role role="attribution">{texts.attribution}</Role></div>
    </Page>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.foreground, color: theme.background, padding: PAD, justifyContent: 'center', clipPath: `inset(${(1 - t) * 100}% 0 0 0)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
        <div style={{fontFamily: SERIF_FONT, fontSize: fit(texts.cta, 120, W - PAD * 2 - 140, 0.5), fontWeight: 600}}><Role role="cta">{texts.cta}</Role></div>
        <div style={{color: theme.accent, transform: `translateX(${(1 - t) * -40}px)`}}><ArrowIcon size={100} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Casestudy: React.FC<CasestudyProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={casestudyMeta} scenes={[SceneTitle, SceneStat, SceneQuote, SceneEnd]} props={props} />
  </AbsoluteFill>
);
