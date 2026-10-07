import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, Grain, clamp, easeIn, easeInOut, easeOut, fit} from '../shared/motion';
import {SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {folioMeta} from './meta';
import type {FolioProps} from './schema';

loadTemplateFonts();

const SERIF = SERIF_FONT;
const SANS = SANS_FONT;
const W = 1920;
const H = 1080;
const PAD = 128;

const Rule: React.FC<{delay: number; top: number; color: string; left?: number; width?: number}> = ({delay, top, color, left = PAD, width = W - PAD * 2}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 30], [0, 1], {...clamp, easing: easeInOut});
  return <div style={{position: 'absolute', left, top, height: 2, width: width * w, background: color}} />;
};

const Masthead: React.FC<FolioProps & {section: string}> = ({texts, theme, section}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [6, 22], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 58, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontFamily: SANS, fontSize: 21, fontWeight: 600, textTransform: 'uppercase', color: theme.foreground, opacity: o}}>
        <span><span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span></span>
        <span style={{fontFamily: SERIF, fontSize: 30, fontStyle: 'italic', fontWeight: 500, textTransform: 'none', color: theme.accent}}>{section}</span>
        <span style={{textAlign: 'right'}}>{'Vol. 01'}</span>
      </div>
      <Rule delay={0} top={110} color={theme.foreground} />
    </>
  );
};

// Each line slides up from behind its own mask.
const Line: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame - delay, [0, 28], [108, 0], {...clamp, easing: easeOut});
  return (
    <div style={{overflow: 'hidden', paddingBottom: 14}}>
      <div style={{transform: `translateY(${y}%)`}}>{children}</div>
    </div>
  );
};

function splitLines(text: string) {
  const words = text.split(' ');
  if (words.length < 3) return [text];
  // Balance the two lines by character count.
  let best = 1;
  let score = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    if (Math.abs(a - b) < score) [best, score] = [i, Math.abs(a - b)];
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

const SceneCover: React.FC<FolioProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const lines = splitLines(texts.headline);
  const longest = Math.max(...lines.map((l) => l.length));
  const textW = W - PAD * 2 - 520;
  const size = Math.min(210, textW / (longest * 0.47));
  const panel = interpolate(frame, [14, 48], [0, 1], {...clamp, easing: easeInOut});
  const drift = interpolate(frame, [0, 90], [0, -24]);
  return (
    <AbsoluteFill>
      <Masthead {...props} section="The Cover" />
      <div style={{position: 'absolute', right: PAD, top: 160, width: 420, height: 760, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: theme.accent, transform: `scaleY(${panel})`, transformOrigin: 'top'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(135deg, ${theme.background}22 0 2px, transparent 2px 22px)`, opacity: panel, transform: `translateY(${drift}px)`}} />
        <div style={{position: 'absolute', left: 36, bottom: 30, fontFamily: SERIF, fontSize: 260, lineHeight: 0.8, fontWeight: 300, color: theme.background, opacity: interpolate(frame, [36, 56], [0, 1], clamp)}}>
          {'01'}
        </div>
        <div style={{position: 'absolute', left: 40, top: 36, fontFamily: SANS, fontSize: 20, fontWeight: 700, textTransform: 'uppercase', color: theme.background, opacity: interpolate(frame, [40, 56], [0, 1], clamp)}}>
          <span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: PAD, top: 220, width: textW, fontFamily: SERIF, color: theme.foreground}}>
        <span data-text-role={"headline"} style={{display: 'contents'}}>{lines.map((l, i) => (
          <Line key={i} delay={10 + i * 8}>
            <div style={{fontSize: size, lineHeight: 0.98, fontWeight: i === lines.length - 1 && lines.length > 1 ? 400 : 560, fontStyle: i === lines.length - 1 && lines.length > 1 ? 'italic' : 'normal', whiteSpace: 'nowrap'}}>
              {l}
            </div>
          </Line>
        ))}</span>
      </div>
      <Rule delay={34} top={920} color={`${theme.foreground}55`} width={W - PAD * 2 - 460} />
      <div style={{position: 'absolute', left: PAD, top: 944, display: 'flex', gap: 48, fontFamily: SANS, fontSize: 22, fontWeight: 600, textTransform: 'uppercase', color: `${theme.foreground}99`, opacity: interpolate(frame, [40, 56], [0, 1], clamp)}}>
        <span style={{color: theme.accent2}}>{'\u2014'}</span>
        <span><span data-text-role={"point1"} style={{display: 'contents'}}>{texts.point1}</span></span>
        <span><span data-text-role={"point2"} style={{display: 'contents'}}>{texts.point2}</span></span>
        <span><span data-text-role={"point3"} style={{display: 'contents'}}>{texts.point3}</span></span>
      </div>
    </AbsoluteFill>
  );
};

const SceneQuote: React.FC<FolioProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const words = texts.subhead.split(' ');
  const mark = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  const boxW = W - PAD * 2 - 420;
  // Aim for about three lines.
  const size = Math.min(104, Math.max(64, (boxW * 3) / (texts.subhead.length * 0.46)));
  return (
    <AbsoluteFill style={{background: theme.surface}}>
      <Masthead {...props} section="In Their Words" />
      <div style={{position: 'absolute', left: PAD - 10, top: 150, fontFamily: SERIF, fontSize: 480, lineHeight: 1, fontWeight: 400, color: theme.accent, opacity: mark, transform: `translateY(${(1 - mark) * 50}px)`}}>
        {'\u201C'}
      </div>
      <div style={{position: 'absolute', left: PAD + 360, width: boxW, top: 300, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.26, fontFamily: SERIF, fontSize: size, lineHeight: 1.12, fontWeight: 400, fontStyle: 'italic', color: theme.foreground}}>
        <span data-text-role={"subhead"} style={{display: 'contents'}}>{words.map((w, i) => {
          const t = interpolate(frame - 8 - i * 2.2, [0, 16], [0, 1], {...clamp, easing: easeOut});
          return (
            <span key={i} style={{opacity: t, transform: `translateY(${(1 - t) * 24}px)`, display: 'inline-block'}}>
              {w}
            </span>
          );
        })}</span>
      </div>
      <Rule delay={30} top={H - 190} left={PAD + 360} width={120} color={theme.accent2} />
      <div style={{position: 'absolute', left: PAD + 360, top: H - 160, fontFamily: SANS, fontSize: 24, fontWeight: 700, textTransform: 'uppercase', color: theme.foreground, opacity: interpolate(frame, [34, 48], [0, 1], clamp)}}>
        <span data-text-role={"brand"} style={{display: 'contents'}}>{texts.brand}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneIndex: React.FC<FolioProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const items = [texts.point1, texts.point2, texts.point3];
  const cta = interpolate(frame, [36, 54], [0, 1], {...clamp, easing: easeOut});
  const size = Math.min(132, ...items.map((t) => 1100 / (t.length * 0.5)));
  return (
    <AbsoluteFill>
      <Masthead {...props} section="Contents" />
      {items.map((t, i) => {
        const top = 170 + i * 210;
        const enter = interpolate(frame - 6 - i * 7, [0, 26], [0, 1], {...clamp, easing: easeOut});
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: PAD, right: PAD, top, height: 190, display: 'flex', alignItems: 'center', gap: 64, transform: `translateX(${(1 - enter) * 90}px)`, opacity: enter}}>
              <span style={{width: 120, fontFamily: SERIF, fontSize: 64, fontStyle: 'italic', color: theme.accent}}>{`0${i + 1}`}</span>
              <span style={{flex: 1, fontFamily: SERIF, fontSize: size, fontWeight: 500, lineHeight: 1, color: theme.foreground, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{t}</span></span>
              <span style={{fontFamily: SANS, fontSize: 22, fontWeight: 600, color: `${theme.foreground}88`}}>{`P. ${String(12 + i * 18).padStart(3, '0')}`}</span>
            </div>
            <Rule delay={10 + i * 7} top={top + 200} color={`${theme.foreground}33`} />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: PAD, bottom: 74, fontFamily: SERIF, fontSize: 40, fontStyle: 'italic', color: `${theme.foreground}aa`, opacity: cta}}><span data-text-role={"headline"} style={{display: 'contents'}}>{texts.headline}</span></div>
      <div
        style={{
          position: 'absolute',
          right: PAD,
          bottom: 62,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          height: 76,
          padding: '0 38px',
          borderRadius: 38,
          fontFamily: SANS,
          fontSize: fit(texts.cta, 32, 420, 0.56),
          fontWeight: 700,
          color: theme.background,
          background: theme.foreground,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 30}px)`,
        }}
      >
        <span data-text-role={"cta"} style={{display: 'contents'}}>{texts.cta}</span>
        <ArrowIcon size={32} />
      </div>
    </AbsoluteFill>
  );
};

// A page of surface color sweeps across each cut.
const PageTurn: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const inX = interpolate(frame, [0, 12], [100, 0], {...clamp, easing: easeInOut});
  const outX = interpolate(frame, [12, 24], [0, -100], {...clamp, easing: easeIn});
  const x = frame < 12 ? inX : outX;
  return (
    <AbsoluteFill style={{transform: `translateX(${x}%)`}}>
      <AbsoluteFill style={{background: theme.accent, right: '82%'}} />
      <AbsoluteFill style={{background: theme.background, left: '18%', boxShadow: '-30px 0 80px rgba(0,0,0,0.25)'}} />
    </AbsoluteFill>
  );
};

const SCENES: React.FC<FolioProps>[] = [SceneCover, SceneQuote, SceneIndex];

export const Folio: React.FC<FolioProps> = (props) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 240], [1, 1.03]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: props.theme.background}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {folioMeta.scenes.map((s, i) => {
          const Scene = SCENES[i];
          return (
            <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
              <Scene {...props} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {folioMeta.scenes.slice(1).map((s) => (
        <Sequence key={s.from} name="transition" from={s.from - 12} durationInFrames={24}>
          <PageTurn theme={props.theme} />
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  );
};
