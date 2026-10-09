import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Backdrop, labelShadow} from '../media/Backdrop';
import {beforeafterphotoAssets} from './assets';
import {beforeafterphotoFiles} from './assets/files';
import {beforeafterphotoMeta} from './meta';
import type {BeforeafterphotoProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
// Only the headline gets a scrim; the rest of both photos stays vivid.
const HEADLINE_ZONES = [[0.2, 0.04, 0.8, 0.22]] as const;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const assetOf = (id: string) => beforeafterphotoAssets.find((a) => a.id === id)!;

// Divider position as a fraction of the width: sweep in, nudge right, settle at center.
function dividerAt(frame: number) {
  if (frame < 120) return interpolate(frame, [30, 100], [0, 0.5], {...clamp, easing: easeInOut});
  if (frame < 150) return interpolate(frame, [120, 150], [0.5, 0.6], {...clamp, easing: easeInOut});
  return interpolate(frame, [150, 185], [0.6, 0.5], {...clamp, easing: easeInOut});
}

const Chevrons: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
  </svg>
);

const Chip: React.FC<{text: string; role: string; dot: string; bg: string; color: string; t: number; fromRight?: boolean}> = ({
  text, role, dot, bg, color, t, fromRight,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '20px 34px',
      borderRadius: 14,
      background: bg,
      color,
      fontFamily: SANS_FONT,
      fontWeight: 700,
      fontSize: fit(text, 40, 400, 0.6),
      whiteSpace: 'nowrap',
      boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
      opacity: t,
      transform: `translateX(${(1 - t) * (fromRight ? 120 : -120)}px)`,
    }}
  >
    <div style={{width: 16, height: 16, borderRadius: 4, background: dot, transform: `rotate(${45 * t}deg)`}} />
    <Role role={role}>{text}</Role>
  </div>
);

const Comparison: React.FC<BeforeafterphotoProps> = ({texts, theme, media}) => {
  const frame = useCurrentFrame();
  const x = dividerAt(frame);
  const px = x * W;
  const fg = [theme.foreground];
  const beforeZoom = interpolate(frame, [0, 240], [1.07, 1.0], clamp);
  const afterZoom = interpolate(frame, [30, 240], [1.1, 1.02], clamp);
  const line = interpolate(frame, [26, 36], [0, 1], clamp);
  const handle = interpolate(frame, [40, 62], [0, 1], {...clamp, easing: easeOut});
  const head = interpolate(frame, [8, 44], [0, 1], {...clamp, easing: easeOut});
  const chip1 = interpolate(frame, [16, 40], [0, 1], {...clamp, easing: easeOut});
  const chip2 = interpolate(frame, [92, 118], [0, 1], {...clamp, easing: easeOut});
  const headSize = wrapFit(texts.headline, 92, 1040, 2, 0.6, 44);

  return (
    <AbsoluteFill>
      {/* Before photo fills the frame */}
      <Backdrop src={beforeafterphotoFiles[media.before]} asset={assetOf(media.before)} background={theme.background}
        foreground={fg} zones={HEADLINE_ZONES} motion={`scale(${beforeZoom})`} />
      <div style={{position: 'absolute', right: 96, top: 820}}>
        <Chip text={texts.point1} role="point1" dot={theme.accent2} bg={theme.surface} color={theme.foreground} t={chip1} fromRight />
      </div>

      {/* After photo, revealed on the left of the divider */}
      <AbsoluteFill style={{clipPath: `inset(0 ${(1 - x) * 100}% 0 0)`}}>
        <Backdrop src={beforeafterphotoFiles[media.after]} asset={assetOf(media.after)} background={theme.background}
          foreground={fg} zones={HEADLINE_ZONES} motion={`scale(${afterZoom})`} />
        <div style={{position: 'absolute', left: 96, top: 820}}>
          <Chip text={texts.point2} role="point2" dot={theme.accent} bg={theme.surface} color={theme.foreground} t={chip2} />
        </div>
      </AbsoluteFill>

      {/* Divider and handle */}
      <div style={{position: 'absolute', left: px - 3, top: 0, width: 6, height: H, background: theme.foreground, opacity: line,
        boxShadow: '0 0 24px rgba(0,0,0,0.45)'}} />
      <div
        style={{
          position: 'absolute',
          left: px - 52,
          top: H / 2 - 52,
          width: 104,
          height: 104,
          borderRadius: '50%',
          background: theme.accent,
          border: `6px solid ${theme.foreground}`,
          color: theme.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
          transform: `scale(${handle})`,
        }}
      >
        <Chevrons size={52} />
      </div>

      {/* Headline at top center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 58, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1080,
            textAlign: 'center',
            fontFamily: DISPLAY,
            fontWeight: 850,
            fontSize: headSize,
            lineHeight: 1.0,
            color: theme.foreground,
            letterSpacing: `${(1 - head) * 0.12}em`,
            clipPath: `inset(0 ${(1 - head) * 50}% 0 ${(1 - head) * 50}%)`,
            opacity: Math.min(1, head * 1.4),
          }}
        >
          <Role role="headline">{texts.headline}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Byline: React.FC<BeforeafterphotoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: fit(texts.brand, 28, 640, 0.95),
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.foreground,
          textShadow: labelShadow(theme.background),
          opacity: t,
          transform: `translateY(${(1 - t) * 24}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        <Role role="brand">{texts.brand}</Role>
      </div>
    </div>
  );
};

const SCENES: React.FC<BeforeafterphotoProps>[] = [Comparison, Byline];

export const Beforeafterphoto: React.FC<BeforeafterphotoProps> = (props) => (
  <AbsoluteFill style={{background: props.theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
    {beforeafterphotoMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Scene {...props} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
