import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseList, parseNumber} from '../shared/data';
import {pricingMeta} from './meta';
import type {PricingProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 120;
type P = SceneProps<PricingProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const SceneTitle: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: easeInOut});
  const t = interpolate(frame, [8, 30], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
      <div style={{fontSize: fit(texts.brand, 40, 900, 0.62), fontWeight: 700, letterSpacing: 0, color: theme.accent, opacity: t}}><Role role="brand">{texts.brand}</Role></div>
      <div style={{height: 3, width: (W - PAD * 2) * line, background: theme.foreground, margin: '36px 0 44px'}} />
      <div style={{overflow: 'hidden'}}>
        <div style={{fontFamily: SERIF_FONT, fontSize: wrapFit(texts.headline, 170, W - PAD * 2, 2, 0.5, 70), lineHeight: 1.02, fontWeight: 500, color: theme.foreground, transform: `translateY(${(1 - t) * 105}%)`}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Three plan cards flip up. The middle card holds the editable price and features.
const ScenePlans: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = parseList(texts.items);
  const n = parseNumber(texts.price);
  const count = interpolate(frame, [20, 60], [0, 1], {...clamp, easing: easeOut});
  const cardW = 640;
  const side = 440;
  const featSize = Math.min(34, ...items.map((s) => fit(s, 34, cardW - 170, 0.52)), 320 / items.length / 1.7);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1800}}>
      {[-1, 1].map((d) => {
        const s = spring({frame: frame - 4, fps, config: {damping: 18}});
        return (
          <div key={d} style={{position: 'absolute', left: W / 2 + d * 560 - side / 2, top: 230, width: side, height: 640, borderRadius: 8, background: theme.surface, opacity: 0.7 * s, transform: `rotateY(${(1 - s) * d * -80}deg)`}}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{margin: i ? '0 60px 34px' : '90px 60px 70px', height: i ? 18 : 70, width: i ? 260 - i * 40 : 180, borderRadius: 4, background: `${theme.foreground}22`}} />)}
          </div>
        );
      })}
      {(() => {
        const s = spring({frame: frame - 12, fps, config: {damping: 15, stiffness: 90}});
        return (
          <div style={{position: 'relative', width: cardW, height: 860, borderRadius: 8, background: theme.foreground, color: theme.background, padding: '70px 70px', transform: `rotateX(${(1 - s) * 90}deg)`, transformOrigin: '50% 100%', boxShadow: `0 40px 100px ${theme.accent}44`}}>
            <div style={{height: 14, width: 120, background: theme.accent, borderRadius: 7}} />
            <div style={{marginTop: 40, fontFamily: DISPLAY, fontSize: fit(texts.price, 180, cardW - 140, 0.62), lineHeight: 1, fontWeight: 900}}>
              <Role role="price">{formatNumber(n, count)}</Role>
            </div>
            <div style={{marginTop: 18, fontSize: fit(texts.priceNote, 38, cardW - 140, 0.52), fontWeight: 600, opacity: 0.65}}><Role role="priceNote">{texts.priceNote}</Role></div>
            <div style={{height: 2, background: `${theme.background}22`, margin: '46px 0 40px'}} />
            <Role role="items">
              {items.map((item, i) => {
                const p = interpolate(frame - 40 - i * 8, [0, 16], [0, 1], {...clamp, easing: easeOut});
                return (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: featSize * 0.7, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none'}}>
                      <path d="M5 12l5 5L20 7" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                    </svg>
                    <span style={{fontSize: featSize, fontWeight: 650, whiteSpace: 'nowrap'}}>{item}</span>
                  </div>
                );
              })}
            </Role>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.accent, alignItems: 'center', justifyContent: 'center', gap: 50, clipPath: `circle(${t * 120}% at 50% 50%)`}}>
      <div style={{fontFamily: SERIF_FONT, fontSize: fit(texts.cta, 150, W - PAD * 2, 0.5), fontWeight: 500, color: theme.background}}><Role role="cta">{texts.cta}</Role></div>
      <div style={{fontSize: fit(texts.brand, 44, 900, 0.62), fontWeight: 700, color: theme.background, opacity: 0.75}}><Role role="brand">{texts.brand}</Role></div>
    </AbsoluteFill>
  );
};

export const Pricing: React.FC<PricingProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={pricingMeta} scenes={[SceneTitle, ScenePlans, SceneEnd]} props={props} />
  </AbsoluteFill>
);
