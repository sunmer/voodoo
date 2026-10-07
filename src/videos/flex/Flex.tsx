import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, loadTemplateFonts} from '../shared/fonts';
import {flexMeta} from './meta';
import type {FlexProps} from './schema';

loadTemplateFonts();

const S = 1080;
const PAD = 64;

// Estimates establish the composition; measured glyph bounds prevent clipping.
const MIN = 68;
const charW = (stretch: number) => 0.5 + (stretch - MIN) * 0.0064;
const fitStretch = (text: string, width: number, size: number) => {
  for (let s = 125; s >= MIN; s -= 1) if (text.length * size * charW(s) <= width) return s;
  return MIN;
};
// Largest size where the text fits at the narrowest width.
const fitSize = (text: string, width: number, max: number) => Math.min(max, width / (Math.max(text.length, 1) * charW(MIN)));

const FittedType: React.FC<{text: string; width: number; style: React.CSSProperties}> = ({text, width, style}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);
  const {fontSize, fontWeight, fontStretch} = style;
  useLayoutEffect(() => {
    let active = true;
    const measure = () => {
      if (active && ref.current) setScale(Math.min(1, width / Math.max(1, ref.current.offsetWidth)));
    };
    measure();
    void document.fonts.ready.then(measure);
    return () => { active = false; };
  }, [text, width, fontSize, fontWeight, fontStretch]);
  return (
    <span data-fitted-type style={{display: 'block', width, flexShrink: 0, ...style}}>
      <span ref={ref} style={{display: 'inline-block', width: 'max-content', transform: `scaleX(${scale})`, transformOrigin: 'left center'}}>
        {text}
      </span>
    </span>
  );
};

// One word that breathes between condensed and expanded while filling the frame width.
const Breath: React.FC<{text: string; size: number; delay: number; color: string; phase?: number}> = ({text, size, delay, color, phase = 0}) => {
  const frame = useCurrentFrame();
  const max = fitStretch(text, S - PAD * 2, size);
  const t = interpolate(frame - delay, [0, 26], [0, 1], {...clamp, easing: easeOut});
  const breathe = (Math.sin((frame - delay) / 9 + phase) + 1) / 2;
  const stretch = interpolate(t, [0, 1], [MIN, MIN + (max - MIN) * (0.5 + breathe * 0.5)]);
  const weight = interpolate(t, [0, 1], [200, 850]);
  return (
    <div style={{overflow: 'hidden', height: size * 0.9}}>
      <FittedType
        text={text}
        width={S - PAD * 2}
        style={{
          fontFamily: FLEX_FONT,
          fontSize: size,
          lineHeight: 0.9,
          fontWeight: weight,
          fontStretch: `${stretch}%`,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          color,
          transform: `translateY(${(1 - t) * 100}%)`,
        }}
      />
    </div>
  );
};

const Corner: React.FC<{theme: Theme; left: string; right: string}> = ({theme, left, right}) => (
  <div style={{position: 'absolute', left: PAD, right: PAD, bottom: 44, display: 'flex', justifyContent: 'space-between', fontFamily: MONO_FONT, fontSize: 22, fontWeight: 600, color: theme.foreground, textTransform: 'uppercase'}}>
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

const SceneTitle: React.FC<FlexProps> = ({texts, theme}) => {
  const words = texts.headline.split(' ');
  const lines = words.length > 4 ? [words.slice(0, 2).join(' '), words.slice(2, 4).join(' '), words.slice(4).join(' ')] : words;
  const size = Math.min((S - PAD * 2 - 60) / (lines.length * 0.9), ...lines.map((l) => fitSize(l, S - PAD * 2, 300)));
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: `0 ${PAD}px`}}>
      {lines.map((l, i) => (
        <Breath key={i} text={l} size={size} delay={4 + i * 6} phase={i * 1.4} color={i === lines.length - 1 ? theme.accent : theme.foreground} />
      ))}
      <Corner theme={theme} left="01 / 03" right="2026" />
    </AbsoluteFill>
  );
};

const SceneList: React.FC<FlexProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  // The active row expands while the others compress.
  const active = Math.min(2, Math.floor(interpolate(frame, [10, 88], [0, 3], clamp)));
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: `0 ${PAD}px`, gap: 14}}>
      {items.map((t, i) => {
        const on = i === active;
        const enter = interpolate(frame - i * 5, [0, 20], [0, 1], {...clamp, easing: easeOut});
        const size = Math.min(...items.map((x) => fitSize(x, S - PAD * 2 - 120, 190)));
        const target = on ? fitStretch(t, S - PAD * 2 - 120, size) : MIN;
        const k = interpolate(frame % 26, [0, 12], [0, 1], {...clamp, easing: easeInOut});
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, height: 230, borderTop: `3px solid ${theme.foreground}`, opacity: enter, transform: `translateX(${(1 - enter) * 80}px)`}}>
            <span style={{width: 92, flexShrink: 0, fontFamily: MONO_FONT, fontSize: 30, fontWeight: 700, color: on ? theme.accent : `${theme.foreground}77`}}>{`0${i + 1}`}</span>
            <FittedType
              text={t}
              width={S - PAD * 2 - 120}
              style={{
                fontFamily: FLEX_FONT,
                fontSize: size,
                lineHeight: 1,
                fontWeight: on ? 850 : 300,
                fontStretch: `${on ? interpolate(k, [0, 1], [MIN, target]) : MIN}%`,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: on ? theme.foreground : `${theme.foreground}55`,
              }}
            />
          </div>
        );
      })}
      <Corner theme={theme} left="02 / 03" right={texts.brand} />
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<FlexProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wipe = interpolate(frame, [0, 16], [0, 100], {...clamp, easing: easeInOut});
  const btn = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 150}});
  const size = fitSize(texts.brand, S - PAD * 2, 240);
  const max = fitStretch(texts.brand, S - PAD * 2, size);
  const stretch = interpolate(frame, [6, 40], [MIN, max], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `circle(${wipe * 0.75}% at 50% 50%)`, justifyContent: 'center', alignItems: 'center', gap: 70}}>
      <FittedType text={texts.brand} width={S - PAD * 2} style={{fontFamily: FLEX_FONT, fontSize: size, fontWeight: 850, fontStretch: `${stretch}%`, lineHeight: 0.9, textTransform: 'uppercase', whiteSpace: 'nowrap', color: theme.background}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 18, height: 100, padding: '0 50px', border: `4px solid ${theme.background}`, borderRadius: 50, fontFamily: FLEX_FONT, fontSize: 46, fontWeight: 800, fontStretch: '110%', textTransform: 'uppercase', whiteSpace: 'nowrap', color: theme.background, opacity: btn, transform: `scale(${0.7 + btn * 0.3})`}}>
        <FittedType text={texts.cta} width={Math.min(620, texts.cta.length * 32)} style={{}} />
        <ArrowIcon size={44} />
      </div>
      <Corner theme={{...theme, foreground: theme.background}} left="03 / 03" right={texts.headline} />
    </AbsoluteFill>
  );
};

const SCENES: React.FC<FlexProps>[] = [SceneTitle, SceneList, SceneLockup];

const Out: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const exit = last ? 0 : interpolate(frame, [duration - 10, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{transform: `translateY(${exit * -100}%)`}}>{children}</AbsoluteFill>;
};

export const Flex: React.FC<FlexProps> = (props) => (
  <AbsoluteFill style={{overflow: 'hidden', background: props.theme.background}}>
    {flexMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return (
        <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
          <Out duration={s.duration} last={i === flexMeta.scenes.length - 1}>
            <Scene {...props} />
          </Out>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
