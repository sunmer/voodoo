import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grain, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {magazineMeta} from './meta';
import type {MagazineProps} from './schema';

loadTemplateFonts();

const W = 1080;
const PAD = 60;
const INNER = W - PAD * 2;
const BLOCK_TOP = 500;
const BLOCK_H = 800;

// Masthead, double rule, and date line.
const SceneMasthead: React.FC<MagazineProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const name = texts.brand.toUpperCase();
  const squeeze = 0.78;
  const size = fit(name, 290, INNER / squeeze, 0.72);
  const wipe = interpolate(frame, [6, 42], [0, 1], {...clamp, easing: easeInOut});
  const settle = interpolate(frame, [6, 70], [1.07, 1], {...clamp, easing: easeOut});
  const rule1 = interpolate(frame, [30, 58], [0, 1], {...clamp, easing: easeInOut});
  const rule2 = interpolate(frame, [38, 66], [0, 1], {...clamp, easing: easeInOut});
  const date = interpolate(frame, [46, 70], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 70,
          width: INNER,
          height: 330,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
        }}
      >
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 0.86,
            letterSpacing: '-0.03em',
            color: theme.foreground,
            whiteSpace: 'nowrap',
            transform: `scale(${squeeze * settle}, ${settle})`,
            transformOrigin: '50% 100%',
          }}
        >
          <span data-text-role={'brand'} style={{display: 'contents'}}>{name}</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 70,
          height: 330,
          left: PAD + INNER * wipe - 6,
          width: 12,
          background: theme.accent,
          opacity: wipe > 0.01 && wipe < 0.99 ? 1 : 0,
        }}
      />
      <div style={{position: 'absolute', left: PAD, top: 416, width: INNER * rule1, height: 5, background: theme.foreground}} />
      <div style={{position: 'absolute', right: PAD, top: 428, width: INNER * rule2, height: 2, background: theme.foreground}} />
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 448,
          width: INNER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: date,
          transform: `translateY(${(1 - date) * 14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: theme.foreground,
            whiteSpace: 'nowrap',
          }}
        >
          <span data-text-role={'date'} style={{display: 'contents'}}>{texts.date}</span>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          {[theme.accent, theme.accent2, theme.foreground].map((c, i) => (
            <div key={i} style={{width: 14, height: 14, background: c, transform: `rotate(${i * 45}deg)`}} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The accent cover image block with halftone, shapes and grain.
const SceneCover: React.FC<MagazineProps> = ({theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = interpolate(frame, [0, 34], [1, 0], {...clamp, easing: easeInOut});
  const pop = spring({frame: frame - 18, fps, config: {damping: 16, stiffness: 90}});
  const pop2 = spring({frame: frame - 28, fps, config: {damping: 14, stiffness: 110}});
  const drift = (k: number) => frame * k;
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        top: BLOCK_TOP,
        width: INNER,
        height: BLOCK_H,
        overflow: 'hidden',
        background: theme.accent,
        transform: `translateX(${slide * (W + 40)}px)`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${slide * -420}px)`}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(${theme.background}40 28%, transparent 31%)`,
            backgroundSize: '22px 22px',
            backgroundPosition: `${drift(0.2)}px 0px`,
            WebkitMaskImage: 'linear-gradient(135deg, transparent 35%, black 95%)',
            maskImage: 'linear-gradient(135deg, transparent 35%, black 95%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -90,
            top: 90 - drift(0.18),
            width: 540,
            height: 540,
            borderRadius: '50%',
            background: theme.accent2,
            transform: `scale(${pop})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -170,
            top: 20 - drift(0.1),
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: `2px solid ${theme.foreground}`,
            opacity: 0.55 * pop,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 360 + drift(0.12),
            width: 300,
            height: 300,
            border: `3px solid ${theme.background}`,
            transform: `rotate(${12 + frame * 0.15}deg) scale(${pop2})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 40,
            bottom: -2,
            width: 380,
            height: 190 * pop2,
            borderRadius: '190px 190px 0 0',
            background: theme.surface,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 470,
            top: 520 - drift(0.25),
            width: 150,
            height: 150,
            background: theme.foreground,
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            transform: `scale(${pop2}) rotate(${-frame * 0.2}deg)`,
          }}
        />
        {[0, 1, 2].map((i) => {
          const h = interpolate(frame - 30 - i * 6, [0, 30], [0, 1], {...clamp, easing: easeOut});
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 70 + i * 22,
                top: 60,
                width: 2,
                height: 260 * h,
                background: theme.foreground,
                opacity: 0.6,
              }}
            />
          );
        })}
      </div>
      <div style={{position: 'absolute', inset: 24, border: `1.5px solid ${theme.background}55`}} />
      <Grain />
    </div>
  );
};

// Serif italic cover line plus a smaller coverline.
const SceneCoverlines: React.FC<MagazineProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const hSize = wrapFit(texts.headline, 150, INNER - 30, 2, 0.54, 60);
  const sSize = wrapFit(texts.subhead, 46, 700, 3, 0.56, 24);
  const words = texts.headline.trim().split(/\s+/);
  const sub = interpolate(frame, [30, 54], [0, 1], {...clamp, easing: easeOut});
  const tick = interpolate(frame, [24, 46], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 1336,
          width: INNER,
          display: 'flex',
          flexWrap: 'wrap',
          gap: `0 ${hSize * 0.24}px`,
          fontFamily: SERIF_FONT,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: hSize,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: theme.foreground,
        }}
      >
        <span data-text-role={'headline'} style={{display: 'contents'}}>
          {words.map((w, i) => {
            const p = interpolate(frame - i * 5, [0, 26], [0, 1], {...clamp, easing: easeOut});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  paddingRight: hSize * 0.08,
                  clipPath: `inset(-20% ${(1 - p) * 100}% -20% -10%)`,
                  transform: `translateX(${(1 - p) * -40}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </span>
      </div>
      <div style={{position: 'absolute', left: PAD, top: 1664, width: 80 * tick, height: 6, background: theme.accent}} />
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 1690,
          width: 700,
          fontFamily: SANS_FONT,
          fontWeight: 600,
          fontSize: sSize,
          lineHeight: 1.18,
          color: theme.foreground,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 24}px)`,
        }}
      >
        <span data-text-role={'subhead'} style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
    </AbsoluteFill>
  );
};

const BARS = Array.from({length: 34}, (_, i) => ({
  w: 1 + Math.floor(random(`mag-bar-w-${i}`) * 4),
  gap: 1 + Math.floor(random(`mag-bar-g-${i}`) * 3),
}));
const DIGITS = Array.from({length: 12}, (_, i) => Math.floor(random(`mag-digit-${i}`) * 10)).join('');

// Barcode stripe block in the bottom corner.
const SceneBarcode: React.FC<MagazineProps> = ({theme}) => {
  const frame = useCurrentFrame();
  const plate = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        position: 'absolute',
        right: PAD,
        bottom: 70,
        width: 200,
        height: 150,
        background: theme.surface,
        padding: '16px 14px 10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: plate,
        transform: `translateY(${(1 - plate) * 20}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'flex-end', height: 96}}>
        {BARS.map((b, i) => {
          const g = interpolate(frame - 6 - i * 0.6, [0, 14], [0, 1], {...clamp, easing: easeOut});
          return (
            <div
              key={i}
              style={{
                width: b.w,
                marginRight: b.gap,
                height: 96 * g,
                background: theme.foreground,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: MONO_FONT,
          fontSize: 14,
          letterSpacing: '0.2em',
          color: theme.foreground,
          opacity: interpolate(frame, [20, 34], [0, 1], clamp),
        }}
      >
        {DIGITS}
      </div>
    </div>
  );
};

const SCENES: React.FC<MagazineProps>[] = [SceneMasthead, SceneCover, SceneCoverlines, SceneBarcode];

export const Magazine: React.FC<MagazineProps> = (props) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 240], [1, 1.025]);
  return (
    <AbsoluteFill style={{background: props.theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 40%'}}>
        {magazineMeta.scenes.map((s, i) => {
          const Scene = SCENES[i];
          return (
            <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
              <Scene {...props} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
