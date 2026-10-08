import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {ArrowIcon, clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {cursorMeta} from './meta';
import type {CursorProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type Key = [number, number, number];

function along(frame: number, keys: Key[]) {
  if (frame <= keys[0][0]) return {x: keys[0][1], y: keys[0][2]};
  for (let i = 1; i < keys.length; i++) {
    const [f0, x0, y0] = keys[i - 1];
    const [f1, x1, y1] = keys[i];
    if (frame <= f1) {
      const t = interpolate(frame, [f0, f1], [0, 1], {...clamp, easing: easeInOut});
      return {x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t};
    }
  }
  const last = keys[keys.length - 1];
  return {x: last[1], y: last[2]};
}

const Pointer: React.FC<{theme: Theme; keys: Key[]; clicks?: number[]}> = ({theme, keys, clicks = []}) => {
  const frame = useCurrentFrame();
  const p = along(frame, keys);
  const pressed = clicks.some((c) => frame >= c && frame < c + 5);
  return (
    <div style={{position: 'absolute', left: p.x, top: p.y, zIndex: 20, transform: `scale(${pressed ? 0.86 : 1})`, transformOrigin: '8px 6px'}}>
      {clicks.map((c) => {
        const t = interpolate(frame - c, [0, 18], [0, 1], clamp);
        return t > 0 && t < 1 ? <div key={c} style={{position: 'absolute', left: 8 - 45 * t, top: 6 - 45 * t, width: 90 * t, height: 90 * t, borderRadius: '50%', border: `3px solid ${theme.accent}`, opacity: 1 - t}} /> : null;
      })}
      <svg width={54} height={62} viewBox="0 0 24 28" style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,.35))'}}>
        <path d="M2 2v21l6-6 4 9 4-2-4-9h8z" fill={theme.foreground} stroke={theme.background} strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Backdrop: React.FC<{theme: Theme}> = ({theme}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: theme.background}}>
      <AbsoluteFill style={{backgroundImage: `radial-gradient(${theme.foreground}24 1.6px, transparent 1.8px)`, backgroundSize: '36px 36px', backgroundPosition: `${frame * -0.5}px 0`}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`}} />
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<CursorProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const words = texts.headline.split(' ');
  const size = wrapFit(texts.headline, 156, 1400, 2, 0.56);
  const select = interpolate(frame, [42, 58], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [26, 44], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{padding: '0 220px', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO_FONT, fontSize: 28, fontWeight: 650, color: theme.foreground, opacity: sub}}>
        <span style={{width: 18, height: 18, borderRadius: 5, background: theme.accent}} />
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{position: 'relative', alignSelf: 'flex-start', marginTop: 34, padding: '8px 18px', marginLeft: -18}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: `${theme.accent}30`, border: `3px solid ${theme.accent}`, transformOrigin: 'left', transform: `scaleX(${select})`}} />
        <div style={{position: 'relative', display: 'flex', flexWrap: 'wrap', columnGap: size * 0.24, maxWidth: 1460}}>
          <span data-text-role="headline" style={{display: 'contents'}}>{words.map((word, i) => {
            const t = interpolate(frame - 4 - i * 5, [0, 24], [0, 1], {...clamp, easing: easeOut});
            return <span key={i} style={{overflow: 'hidden', display: 'inline-block'}}><span style={{display: 'inline-block', fontSize: size, lineHeight: 1.04, fontWeight: 800, color: theme.foreground, transform: `translateY(${(1 - t) * 110}%)`}}>{word}</span></span>;
          })}</span>
        </div>
      </div>
      <div style={{maxWidth: 1050, marginTop: 34, fontSize: 42, lineHeight: 1.25, color: `${theme.foreground}b8`, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>
        <span data-text-role="subhead" style={{display: 'contents'}}>{texts.subhead}</span>
      </div>
      <Pointer theme={theme} keys={[[0, 1720, 940], [36, 1410, 455], [58, 1580, 470]]} clicks={[40]} />
    </AbsoluteFill>
  );
};

const Toggle: React.FC<{theme: Theme; on: number; color: string}> = ({theme, on, color}) => (
  <div style={{width: 112, height: 60, borderRadius: 30, padding: 6, background: on > 0.5 ? color : `${theme.foreground}22`}}>
    <div style={{width: 48, height: 48, borderRadius: 24, background: theme.foreground, transform: `translateX(${on * 52}px)`}} />
  </div>
);

const SceneApp: React.FC<CursorProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const win = spring({frame, fps, config: {damping: 18, stiffness: 100}});
  const points = [texts.point1, texts.point2, texts.point3];
  const clicks = [24, 42, 60];
  const done = interpolate(frame, [60, 74], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'relative', width: 1460, height: 760, borderRadius: 26, overflow: 'hidden', background: theme.surface, border: `2px solid ${theme.foreground}18`, boxShadow: '0 50px 110px rgba(0,0,0,.28)', opacity: win, transform: `translateY(${(1 - win) * 160}px) scale(${0.92 + win * 0.08})`}}>
        <div style={{height: 70, display: 'flex', alignItems: 'center', gap: 13, padding: '0 28px', borderBottom: `2px solid ${theme.foreground}12`}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{width: 17, height: 17, borderRadius: 9, background: c}} />)}
          <div style={{marginLeft: 22, width: 340, height: 18, borderRadius: 9, background: `${theme.foreground}12`}} />
        </div>
        <div style={{display: 'flex', height: 690}}>
          <div style={{width: 300, padding: 34, borderRight: `2px solid ${theme.foreground}10`}}>
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{height: 22, width: i === 0 ? 170 : 210 - i * 18, borderRadius: 11, marginBottom: 32, background: i === 1 ? theme.accent : `${theme.foreground}${i === 0 ? '35' : '14'}`}} />)}
          </div>
          <div style={{flex: 1, padding: '58px 70px', display: 'flex', flexDirection: 'column', gap: 26}}>
            {points.map((point, i) => {
              const on = interpolate(frame, [clicks[i], clicks[i] + 9], [0, 1], {...clamp, easing: easeOut});
              const row = interpolate(frame - 8 - i * 6, [0, 20], [0, 1], {...clamp, easing: easeOut});
              const color = i === 1 ? theme.accent2 : theme.accent;
              return (
                <div key={i} style={{height: 154, borderRadius: 22, display: 'flex', alignItems: 'center', gap: 34, padding: '0 38px', background: on > 0.5 ? `${color}20` : `${theme.foreground}08`, border: `2px solid ${on > 0.5 ? color : `${theme.foreground}12`}`, opacity: row, transform: `translateX(${(1 - row) * 90}px)`}}>
                  <div style={{width: 70, height: 70, borderRadius: 18, display: 'grid', placeItems: 'center', background: color, color: theme.background, fontFamily: MONO_FONT, fontSize: 25, fontWeight: 800}}>0{i + 1}</div>
                  <div style={{flex: 1, fontSize: fit(point, 52, 610, 0.55), fontWeight: 760, color: theme.foreground, whiteSpace: 'nowrap'}}><span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>{point}</span></div>
                  <Toggle theme={theme} on={on} color={color} />
                </div>
              );
            })}
            <div style={{height: 10, marginTop: 8, borderRadius: 5, background: `${theme.foreground}12`, overflow: 'hidden'}}><div style={{height: '100%', width: `${done * 100}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`}} /></div>
          </div>
        </div>
      </div>
      <Pointer theme={theme} keys={[[0, 1640, 980], [20, 1542, 336], [38, 1542, 516], [56, 1542, 696], [80, 1640, 820]]} clicks={clicks} />
    </AbsoluteFill>
  );
};

const SceneLockup: React.FC<CursorProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = spring({frame, fps, config: {damping: 15, stiffness: 100}});
  const button = spring({frame: frame - 12, fps, config: {damping: 13, stiffness: 140}});
  const press = frame >= 34 && frame < 40 ? 0.94 : 1;
  const flood = interpolate(frame, [36, 58], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 72}}>
      <div style={{position: 'absolute', left: W / 2 - 1200 * flood, top: 650 - 1200 * flood, width: 2400 * flood, height: 2400 * flood, borderRadius: '50%', background: `${theme.accent}18`}} />
      <div style={{fontSize: fit(texts.brand, 190, 1500, 0.62), lineHeight: 1, fontWeight: 850, color: theme.foreground, opacity: brand, transform: `translateY(${(1 - brand) * 70}px)`}}>
        <span data-text-role="brand" style={{display: 'contents'}}>{texts.brand}</span>
      </div>
      <div style={{height: 120, display: 'flex', alignItems: 'center', gap: 22, padding: '0 58px', borderRadius: 24, background: theme.accent, color: theme.background, fontSize: fit(texts.cta, 50, 720, 0.55), fontWeight: 800, transform: `scale(${button * press})`, boxShadow: `0 22px 50px ${theme.accent}55`}}>
        <span data-text-role="cta" style={{display: 'contents'}}>{texts.cta}</span><ArrowIcon size={44} />
      </div>
      <Pointer theme={theme} keys={[[0, 1580, 980], [30, 1050, 660], [70, 1130, 760]]} clicks={[34]} />
    </AbsoluteFill>
  );
};

const SCENES: React.FC<CursorProps>[] = [SceneTitle, SceneApp, SceneLockup];

const Exit: React.FC<{duration: number; last: boolean; children: React.ReactNode}> = ({duration, last, children}) => {
  const frame = useCurrentFrame();
  const t = last ? 0 : interpolate(frame, [duration - 12, duration], [0, 1], {...clamp, easing: easeIn});
  return <AbsoluteFill style={{opacity: 1 - t, transform: `translateY(${t * -70}px)`}}>{children}</AbsoluteFill>;
};

export const Cursor: React.FC<CursorProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', fontFamily: SANS_FONT}}>
    <Backdrop theme={props.theme} />
    {cursorMeta.scenes.map((s, i) => {
      const Scene = SCENES[i];
      return <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}><Exit duration={s.duration} last={i === SCENES.length - 1}><Scene {...props} /></Exit></Sequence>;
    })}
  </AbsoluteFill>
);
