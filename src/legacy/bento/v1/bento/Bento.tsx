import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {bentoMeta} from './meta';
import type {BentoProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
const PAD = 72;
const GAP = 24;

const Tile: React.FC<{
  theme: Theme;
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  bg?: string;
  children?: React.ReactNode;
}> = ({theme, x, y, w, h, delay, bg, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 17, stiffness: 120}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 36,
        background: bg ?? theme.surface,
        border: `1.5px solid ${theme.foreground}14`,
        overflow: 'hidden',
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${(1 - s) * 70}px) scale(${0.9 + s * 0.1})`,
      }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
  <div style={{fontFamily: MONO_FONT, fontSize: 22, fontWeight: 600, color, textTransform: 'uppercase'}}>{children}</div>
);

const SceneHero: React.FC<BentoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.headline.split(' ');
  const size = fit(texts.headline, 190, W - PAD * 4, 0.55);
  const pill = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 46}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          height: 60,
          padding: '0 28px',
          borderRadius: 30,
          background: theme.surface,
          border: `1.5px solid ${theme.foreground}1a`,
          fontSize: 26,
          fontWeight: 650,
          color: theme.foreground,
          opacity: pill,
          transform: `translateY(${(1 - pill) * 20}px)`,
        }}
      >
        <span style={{width: 12, height: 12, borderRadius: 6, background: theme.accent}} />
        <span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26, maxWidth: W - PAD * 3}}>
        <span data-text-role={"headline"} style={{display: 'contents'}}>{words.map((w, i) => {
          const t = interpolate(frame - 8 - i * 5, [0, 24], [0, 1], {...clamp, easing: easeOut});
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontSize: size,
                lineHeight: 1,
                fontWeight: interpolate(t, [0, 1], [300, 800]),
                color: i === words.length - 1 ? theme.accent : theme.foreground,
                opacity: t,
                transform: `translateY(${(1 - t) * 60}px)`,
              }}
            >
              {w}
            </span>
          );
        })}</span>
      </div>
    </AbsoluteFill>
  );
};

const Spark: React.FC<{theme: Theme; progress: number; w: number; h: number}> = ({theme, progress, w, h}) => {
  const vals = [0.2, 0.32, 0.28, 0.45, 0.4, 0.58, 0.55, 0.72, 0.68, 0.9];
  const d = vals.map((v, i) => `${i ? 'L' : 'M'}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - v * h).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <path d={d} fill="none" stroke={theme.background} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1600} strokeDashoffset={1600 * (1 - progress)} />
    </svg>
  );
};

const SceneGrid: React.FC<BentoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const colW = (W - PAD * 2 - GAP * 3) / 4;
  const rowH = (H - PAD * 2 - GAP) / 2;
  const col = (i: number) => PAD + i * (colW + GAP);
  const row = (i: number) => PAD + i * (rowH + GAP);
  const count = Math.round(interpolate(frame, [20, 70], [0, 99], {...clamp, easing: easeOut}));
  const spark = interpolate(frame, [26, 80], [0, 1], {...clamp, easing: easeInOut});
  const ring = interpolate(frame, [30, 80], [0, 0.82], {...clamp, easing: easeInOut});
  const r = 92;
  const c = 2 * Math.PI * r;
  const points = [texts.point1, texts.point2, texts.point3];
  return (
    <AbsoluteFill>
      <Tile theme={theme} x={col(0)} y={row(0)} w={colW * 2 + GAP} h={rowH} delay={0}>
        <div style={{position: 'absolute', inset: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <Label color={theme.accent}><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></Label>
          <div style={{fontSize: fit(texts.headline, 92, colW * 2 - 80, 0.55), fontWeight: 800, lineHeight: 1.02, color: theme.foreground}}><span data-text-role={"headline"} style={{display: 'contents'}}>{texts.headline}</span></div>
          <div style={{fontSize: 34, lineHeight: 1.3, color: `${theme.foreground}99`, maxWidth: colW * 2 - 120}}><span data-text-role={"subhead"} style={{display: 'contents'}}>{texts.subhead}</span></div>
        </div>
      </Tile>
      <Tile theme={theme} x={col(2)} y={row(0)} w={colW} h={rowH} delay={6} bg={theme.accent}>
        <div style={{position: 'absolute', inset: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: theme.background}}>
          <Label color={theme.background}>{'Score'}</Label>
          <div style={{fontSize: 190, fontWeight: 850, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums'}}>{count}</div>
          <Spark theme={theme} progress={spark} w={colW - 80} h={70} />
        </div>
      </Tile>
      <Tile theme={theme} x={col(3)} y={row(0)} w={colW} h={rowH} delay={10}>
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
          <svg width={240} height={240} style={{transform: 'rotate(-90deg)'}}>
            <circle cx={120} cy={120} r={r} fill="none" stroke={theme.foreground} strokeOpacity={0.1} strokeWidth={24} />
            <circle cx={120} cy={120} r={r} fill="none" stroke={theme.accent2} strokeWidth={24} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ring)} />
          </svg>
          <div style={{position: 'absolute', fontSize: 56, fontWeight: 800, color: theme.foreground, fontVariantNumeric: 'tabular-nums'}}>{`${Math.round(ring * 100)}%`}</div>
        </div>
        <div style={{position: 'absolute', left: 40, bottom: 34}}>
          <Label color={`${theme.foreground}88`}>{'Adoption'}</Label>
        </div>
      </Tile>
      {points.map((p, i) => {
        const icons = ['M5 12l4 4L19 6', 'M12 3v18M3 12h18', 'M4 17l6-6 4 4 6-8'];
        const accent = i === 1 ? theme.accent2 : theme.accent;
        return (
          <Tile key={i} theme={theme} x={col(i)} y={row(1)} w={i === 2 ? colW * 2 + GAP : colW} h={rowH} delay={14 + i * 5}>
            <div style={{position: 'absolute', inset: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div style={{width: 84, height: 84, borderRadius: 24, background: `${accent}22`, display: 'grid', placeItems: 'center'}}>
                <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d={icons[i]} />
                </svg>
              </div>
              <div style={{fontSize: fit(p, i === 2 ? 76 : 54, (i === 2 ? colW * 2 : colW) - 80, 0.56), fontWeight: 750, lineHeight: 1.05, color: theme.foreground}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{p}</span></div>
            </div>
          </Tile>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<BentoProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeInOut});
  const btn = spring({frame: frame - 16, fps, config: {damping: 14, stiffness: 140}});
  const w = interpolate(grow, [0, 1], [460, W - PAD * 2]);
  const h = interpolate(grow, [0, 1], [460, H - PAD * 2]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 48,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 56,
          overflow: 'hidden',
        }}
      >
        <div style={{fontSize: fit(texts.brand, 240, 1500, 0.6), fontWeight: 850, lineHeight: 1, color: theme.background, opacity: grow, whiteSpace: 'nowrap'}}><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            height: 96,
            padding: '0 48px',
            borderRadius: 48,
            background: theme.background,
            color: theme.foreground,
            fontSize: fit(texts.cta, 42, 700, 0.55),
            fontWeight: 700,
            whiteSpace: 'nowrap',
            opacity: btn,
            transform: `translateY(${(1 - btn) * 40}px)`,
          }}
        >
          <span data-text-role={"cta"} style={{display: 'contents'}}>{texts.cta}</span>
          <ArrowIcon size={38} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<BentoProps>[] = [SceneHero, SceneGrid, SceneLockup];

// Each scene fades and lifts out before the next one assembles.
const Fade: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const exit = last ? 0 : interpolate(frame, [duration - 12, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 - exit * 0.04})`}}>{children}</AbsoluteFill>;
};

export const Bento: React.FC<BentoProps> = (props) => {
  const {theme} = props;
  return (
    <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden', background: theme.background}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.foreground}14 2px, transparent 2px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {bentoMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Fade duration={s.duration} last={i === bentoMeta.scenes.length - 1}>
              <Scene {...props} />
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
