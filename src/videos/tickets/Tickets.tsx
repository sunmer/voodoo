import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {formatNumber, parseNumber} from '../shared/data';
import {ticketsMeta} from './meta';
import type {TicketsProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const TW = 820;
type P = SceneProps<TicketsProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Ticket outline with half-circle notches on both sides of the tear line.
const notch = (y: number) => `radial-gradient(circle at 0 ${y}px, transparent 36px, black 37px) left / 51% 100% no-repeat, radial-gradient(circle at 100% ${y}px, transparent 36px, black 37px) right / 51% 100% no-repeat`;

const SceneTicket: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const stamp = spring({frame: frame - 44, fps, config: {damping: 8, stiffness: 200}});
  const tear = 820;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: `repeating-linear-gradient(90deg, ${theme.surface} 0 3px, transparent 3px 60px)`, opacity: 0.6}} />
      <div style={{position: 'relative', width: TW, height: 1340, background: theme.foreground, color: theme.background, WebkitMask: notch(tear), mask: notch(tear),
        transform: `translateY(${(1 - slide) * 1500}px) rotate(${(1 - slide) * 10 - 2}deg)`}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 70, display: 'flex', justifyContent: 'space-between', fontFamily: MONO_FONT, fontWeight: 700, fontSize: 30}}>
          <span style={{fontSize: fit(texts.brand, 34, 480, 0.62), textTransform: 'uppercase'}}><Role role="brand">{texts.brand}</Role></span>
          <span style={{color: theme.accent}}>ADMIT ONE</span>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 200, fontFamily: DISPLAY, fontWeight: 900, fontSize: wrapFit(texts.headline.toUpperCase(), 140, TW - 120, 4, 0.8, 48),
          lineHeight: 0.95, textTransform: 'uppercase'}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: tear - 140, fontFamily: MONO_FONT, fontWeight: 700, fontSize: fit(texts.date, 46, TW - 120, 0.62), color: theme.accent}}>
          <Role role="date">{texts.date}</Role>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: tear, borderTop: `5px dashed ${theme.background}55`}} />
        <div style={{position: 'absolute', left: 60, right: 60, top: tear + 90, height: 220, display: 'flex', gap: 8}}>
          {Array.from({length: 46}, (_, i) => <div key={i} style={{flex: (i * 7) % 3 + 1, background: i % 2 ? 'transparent' : theme.background}} />)}
        </div>
        <div style={{position: 'absolute', right: 70, top: tear + 30, width: 300, height: 300, borderRadius: '50%', border: `10px solid ${theme.accent2}`, color: theme.accent2,
          display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, lineHeight: 0.9, textAlign: 'center',
          transform: `scale(${interpolate(stamp, [0, 1], [2.5, 1])}) rotate(-16deg)`, opacity: Math.min(1, stamp * 3), background: `${theme.foreground}dd`}}>ON<br />SALE</div>
      </div>
    </AbsoluteFill>
  );
};

const FlapDigit: React.FC<{ch: string; delay: number; theme: TicketsProps['theme']; size: number}> = ({ch, delay, theme, size}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 8], [0, 1], clamp);
  return (
    <div style={{position: 'relative', width: size * 0.66, height: size * 1.2, borderRadius: 8, background: theme.surface, color: theme.foreground, display: 'grid', placeItems: 'center',
      fontFamily: MONO_FONT, fontWeight: 800, fontSize: size, transform: `rotateX(${(1 - t) * 90}deg)`, overflow: 'hidden'}}>
      {ch}
      <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 4, background: theme.background}} />
    </div>
  );
};

const ScenePrice: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = parseNumber(texts.price);
  const shown = formatNumber(n, interpolate(frame, [4, 40], [0, 1], {...clamp, easing: easeOut}));
  const chars = [...texts.price];
  const size = Math.min(170, (W - 160) / (chars.length * 0.74));
  const cta = spring({frame: frame - 40, fps, config: {damping: 12, stiffness: 150}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 90, perspective: 1200}}>
      <div style={{fontFamily: MONO_FONT, fontSize: 40, fontWeight: 700, color: theme.accent, textTransform: 'uppercase'}}>From</div>
      <div style={{display: 'flex', gap: 10}}>
        <Role role="price">{(frame < 42 ? [...shown.padStart(chars.length, ' ')] : chars).map((c, i) => <FlapDigit key={i} ch={c} delay={i * 3} theme={theme} size={size} />)}</Role>
      </div>
      <div style={{height: 130, display: 'flex', alignItems: 'center', gap: 24, padding: '0 60px', borderRadius: 65, background: theme.accent2, color: theme.background,
        fontSize: fit(texts.cta, 56, 760, 0.56), fontWeight: 850, transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={50} />
      </div>
    </AbsoluteFill>
  );
};

export const Tickets: React.FC<TicketsProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={ticketsMeta} scenes={[SceneTicket, ScenePrice]} props={props} />
  </AbsoluteFill>
);
