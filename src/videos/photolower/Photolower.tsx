import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {Backdrop, labelShadow} from '../media/Backdrop';
import {photolowerAssets} from './assets';
import {photolowerFiles} from './assets/files';
import {photolowerMeta} from './meta';
import type {PhotolowerProps} from './schema';

loadTemplateFonts();

const LEFT = 96;
const BAR_W = 1100;
const BAR_TOP = 770;

// One zone covering only the lower-third block; the rest of the photo stays clear.
const TEXT_ZONES = [[0.04, 0.66, 0.62, 0.86]] as const;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const LowerThird: React.FC<PhotolowerProps & {duration: number}> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [8, 34], [0, 1], {...clamp, easing: easeInOut});
  const author = interpolate(frame, [22, 50], [0, 1], {...clamp, easing: easeOut});
  const attr = interpolate(frame, [36, 62], [0, 1], {...clamp, easing: easeOut});
  const brand = interpolate(frame, [44, 68], [0, 1], {...clamp, easing: easeOut});
  const exit = interpolate(frame, [duration - 20, duration], [0, 1], {...clamp, easing: easeIn});

  const authorSize = fit(texts.author, 86, BAR_W, 0.56);
  const attrSize = fit(texts.attribution, 38, BAR_W, 0.54);
  const brandSize = fit(texts.brand, 24, 340, 0.78);

  return (
    <AbsoluteFill style={{transform: `translateX(${exit * -1400}px)`, opacity: 1 - exit * 0.6}}>
      {/* Accent bar with a slanted end, wiping in from the left */}
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: BAR_TOP,
          width: BAR_W,
          height: 10,
          background: theme.accent,
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
          transformOrigin: 'left',
          transform: `scaleX(${bar})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: BAR_TOP - 16,
          width: 6,
          height: 42,
          background: theme.accent2,
          transformOrigin: 'bottom',
          transform: `scaleY(${bar})`,
        }}
      />
      {/* Brand tag at the right end of the bar */}
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          width: BAR_W,
          top: BAR_TOP - 54,
          display: 'flex',
          justifyContent: 'flex-end',
          opacity: brand,
          transform: `translateY(${(1 - brand) * 14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: brandSize,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: theme.accent,
            textShadow: labelShadow(theme.background),
            whiteSpace: 'nowrap',
            paddingRight: 14,
          }}
        >
          <Role role="brand">{texts.brand}</Role>
        </div>
      </div>
      {/* Author name rising out of a mask */}
      <div style={{position: 'absolute', left: LEFT, top: BAR_TOP + 26, width: BAR_W, overflow: 'hidden', paddingBottom: 8}}>
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontWeight: 800,
            fontSize: authorSize,
            lineHeight: 1.08,
            color: theme.foreground,
            whiteSpace: 'nowrap',
            transform: `translateY(${(1 - author) * 110}%)`,
          }}
        >
          <Role role="author">{texts.author}</Role>
        </div>
      </div>
      {/* Attribution line */}
      <div
        style={{
          position: 'absolute',
          left: LEFT + 4,
          top: BAR_TOP + 40 + authorSize * 1.1,
          width: BAR_W,
          fontFamily: SANS_FONT,
          fontWeight: 500,
          fontSize: attrSize,
          lineHeight: 1.2,
          color: theme.accent2,
          whiteSpace: 'nowrap',
          clipPath: `inset(0 ${(1 - attr) * 100}% 0 0)`,
          transform: `translateX(${(1 - attr) * -30}px)`,
        }}
      >
        <Role role="attribution">{texts.attribution}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<PhotolowerProps & {duration: number}>[] = [LowerThird];

export const Photolower: React.FC<PhotolowerProps> = (props) => {
  const {theme, media} = props;
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 180], [1.03, 1.14], clamp);
  const pan = interpolate(frame, [0, 180], [12, -18], clamp);
  return (
    <AbsoluteFill style={{background: theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <Backdrop
        src={photolowerFiles[media.background]}
        asset={photolowerAssets.find((a) => a.id === media.background)!}
        background={theme.background}
        foreground={[theme.foreground, theme.accent, theme.accent2]}
        zones={TEXT_ZONES}
        motion={`scale(${zoom}) translateY(${pan}px)`}
      />
      {photolowerMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} duration={s.duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
