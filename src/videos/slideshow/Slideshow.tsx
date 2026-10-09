import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Backdrop, labelShadow} from '../media/Backdrop';
import {slideshowAssets} from './assets';
import {slideshowFiles} from './assets/files';
import {slideshowMeta} from './meta';
import type {SlideshowProps} from './schema';

loadTemplateFonts();

const W = 1920;
const LEFT = 110;
const BOTTOM = 130;
const BLOCK_W = 1080;
const PHOTO_KEYS = ['photo1', 'photo2', 'photo3'] as const;

// Caption areas as [left, top, right, bottom] fractions. The first slide also holds the headline.
const TITLE_ZONES = [[0.04, 0.3, 0.62, 0.93]] as const;
const CAPTION_ZONES = [[0.04, 0.6, 0.62, 0.93]] as const;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const splitItems = (value: string) => {
  const list = value.split(',').map((s) => s.trim()).filter(Boolean);
  return list.length ? list : [value.trim()];
};

type SceneProps = SlideshowProps & {duration: number};

const makeSlide = (index: number, last: boolean): React.FC<SceneProps> => {
  const Slide: React.FC<SceneProps> = ({texts, theme, media, duration}) => {
    const frame = useCurrentFrame();
    const id = media[PHOTO_KEYS[index]];
    const asset = slideshowAssets.find((a) => a.id === id) ?? slideshowAssets[0];
    const src = slideshowFiles[asset.id as keyof typeof slideshowFiles];

    // Ken Burns: alternate push-in / pull-out and pan direction.
    const t = interpolate(frame, [0, duration], [0, 1], clamp);
    const pushIn = index % 2 === 0;
    const scale = pushIn ? 1.04 + 0.14 * t : 1.18 - 0.14 * t;
    const panDir = index % 2 === 0 ? 1 : -1;
    const pan = interpolate(t, [0, 1], [-40 * panDir, 40 * panDir]);
    const rise = interpolate(t, [0, 1], [10, -10]);

    const items = splitItems(texts.items);
    const caption = items[index % items.length];
    const first = index === 0;

    const start = first ? 30 : 14;
    const headIn = interpolate(frame, [8, 40], [0, 1], {...clamp, easing: easeOut});
    const capIn = interpolate(frame, [start, start + 28], [0, 1], {...clamp, easing: easeOut});
    const barIn = interpolate(frame, [start - 6, start + 18], [0, 1], {...clamp, easing: easeInOut});
    const out = last ? 0 : interpolate(frame, [duration - 22, duration - 12], [0, 1], {...clamp, easing: easeIn});

    const capSize = wrapFit(caption, first ? 64 : 84, BLOCK_W - 40, 3, 0.56, 28);
    const headSize = wrapFit(texts.headline, 150, BLOCK_W, 2, 0.6, 60);

    return (
      <AbsoluteFill style={{overflow: 'hidden', background: theme.background}}>
        <Backdrop
          src={src}
          asset={asset}
          background={theme.background}
          foreground={[theme.foreground, theme.accent]}
          zones={first ? TITLE_ZONES : CAPTION_ZONES}
          motion={`scale(${scale}) translate(${pan}px, ${rise}px)`}
        />
        <div
          style={{
            position: 'absolute',
            left: LEFT,
            bottom: BOTTOM,
            width: BLOCK_W,
            display: 'flex',
            flexDirection: 'column',
            opacity: 1 - out,
            transform: `translateY(${out * 24}px)`,
          }}
        >
          {first && (
            <div
              style={{
                fontFamily: FLEX_FONT,
                fontWeight: 850,
                fontStretch: '88%',
                fontSize: headSize,
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                color: theme.foreground,
                marginBottom: 36,
                clipPath: `inset(-10% ${(1 - headIn) * 100}% -10% 0)`,
                transform: `translateX(${(1 - headIn) * -30}px)`,
                overflowWrap: 'anywhere',
              }}
            >
              <Role role="headline">{texts.headline}</Role>
            </div>
          )}
          <div style={{display: 'flex', alignItems: 'stretch', gap: 30}}>
            <div style={{width: 8, background: theme.accent, transformOrigin: 'bottom', transform: `scaleY(${barIn})`, flexShrink: 0}} />
            <div style={{display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0}}>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: theme.accent,
                  opacity: barIn,
                }}
              >
                {String(index + 1).padStart(2, '0')} / {String(PHOTO_KEYS.length).padStart(2, '0')}
              </div>
              <div style={{overflow: 'hidden', paddingBottom: 6}}>
                <div
                  style={{
                    fontFamily: SANS_FONT,
                    fontWeight: 600,
                    fontSize: capSize,
                    lineHeight: 1.14,
                    color: theme.foreground,
                    transform: `translateY(${(1 - capIn) * 105}%)`,
                    opacity: Math.min(1, capIn * 1.6),
                    overflowWrap: 'anywhere',
                  }}
                >
                  <Role role="items">{caption}</Role>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  };
  return Slide;
};

// A wide diagonal band in the accent color with a thin accent2 edge on each side.
const Wipe: React.FC<SceneProps> = ({theme, duration}) => {
  const frame = useCurrentFrame();
  const band = 4000;
  const left = interpolate(frame, [0, duration], [-band - 400, W + 400], clamp);
  const common: React.CSSProperties = {position: 'absolute', top: -100, bottom: -100, transform: 'skewX(-20deg)'};
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div style={{...common, left: left - 80, width: 50, background: theme.accent2}} />
      <div style={{...common, left, width: band, background: theme.accent}} />
      <div style={{...common, left: left + band + 30, width: 50, background: theme.accent2}} />
    </AbsoluteFill>
  );
};

const slideCount = slideshowMeta.scenes.filter((s) => s.type !== 'transition').length;
let slideIndex = 0;
const SCENES: React.FC<SceneProps>[] = slideshowMeta.scenes.map((s) => {
  if (s.type === 'transition') return Wipe;
  const i = slideIndex++;
  return makeSlide(i, i === slideCount - 1);
});

const Progress: React.FC<{color: string; track: string}> = ({color, track}) => {
  const frame = useCurrentFrame();
  const slides = slideshowMeta.scenes.filter((s) => s.type !== 'transition');
  return (
    <div style={{position: 'absolute', left: LEFT, right: LEFT, bottom: 56, display: 'flex', gap: 14}}>
      {slides.map((s, i) => {
        const p = interpolate(frame, [s.from, s.from + s.duration], [0, 1], clamp);
        return (
          <div key={i} style={{flex: 1, height: 5, background: track, overflow: 'hidden', borderRadius: 3}}>
            <div style={{width: '100%', height: '100%', background: color, transformOrigin: 'left', transform: `scaleX(${p})`}} />
          </div>
        );
      })}
    </div>
  );
};

export const Slideshow: React.FC<SlideshowProps> = (props) => {
  const frame = useCurrentFrame();
  const {texts, theme} = props;
  const brandIn = interpolate(frame, [4, 26], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      {slideshowMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration} style={{zIndex: s.type === 'transition' ? 10 : i}}>
            <Scene {...props} duration={s.duration} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{zIndex: 20, pointerEvents: 'none'}}>
        <Progress color={theme.accent} track={`${theme.foreground}40`} />
        <div
          style={{
            position: 'absolute',
            top: 64,
            right: LEFT,
            fontFamily: MONO_FONT,
            fontWeight: 700,
            fontSize: fit(texts.brand, 30, 520, 0.85),
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme.foreground,
            textShadow: labelShadow(theme.background),
            opacity: brandIn,
            transform: `translateY(${(1 - brandIn) * -16}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <Role role="brand">{texts.brand}</Role>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
