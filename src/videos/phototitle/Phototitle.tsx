import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Backdrop} from '../media/Backdrop';
import {phototitleAssets} from './assets';
import {phototitleFiles} from './assets/files';
import type {PhototitleProps} from './schema';

loadTemplateFonts();

// Where the title sits, as [left, top, right, bottom] fractions of the frame. The backdrop keeps it readable.
const TEXT_ZONE = [0, 0.2, 0.55, 0.8] as const;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// Full-bleed photo with a slow push-in, a theme-colored panel wipe, and a left-aligned title.
export const Phototitle: React.FC<PhototitleProps> = ({texts, theme, media}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 180], [1.16, 1.02], clamp);
  const drift = interpolate(frame, [0, 180], [-30, 10], clamp);
  const wipe = interpolate(frame, [18, 52], [0, 1], {...clamp, easing: easeInOut});
  const title = interpolate(frame, [44, 84], [0, 1], {...clamp, easing: easeOut});
  const rest = interpolate(frame, [70, 104], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${drift}px)`}}>
        <Backdrop src={phototitleFiles[media.background]} asset={phototitleAssets.find((a) => a.id === media.background)!}
          background={theme.background} foreground={[theme.foreground, theme.accent]} zone={TEXT_ZONE} fade="left" />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 0, bottom: 0, width: 10, background: theme.accent, transformOrigin: 'top', transform: `scaleY(${wipe})`}} />
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 0 0 180px', width: 1180}}>
        <div style={{fontFamily: MONO_FONT, fontSize: fit(texts.brand, 28, 900, 0.62), color: theme.accent, textTransform: 'uppercase', opacity: rest, marginBottom: 26}}>
          <Role role="brand">{texts.brand}</Role>
        </div>
        <div style={{clipPath: `inset(0 ${(1 - title) * 100}% 0 0)`, fontFamily: FLEX_FONT, fontWeight: 850, fontSize: wrapFit(texts.headline, 140, 980, 2, 0.6, 60), lineHeight: 0.98, color: theme.foreground}}>
          <Role role="headline">{texts.headline}</Role>
        </div>
        <div style={{marginTop: 30, width: 760, fontSize: wrapFit(texts.subhead, 38, 760, 3, 0.52, 24), lineHeight: 1.3, color: theme.foreground, opacity: rest * 0.86,
          transform: `translateY(${(1 - rest) * 20}px)`}}>
          <Role role="subhead">{texts.subhead}</Role>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
