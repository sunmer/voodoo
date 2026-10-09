import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grain, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {FLEX_FONT, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {Backdrop, labelShadow} from '../media/Backdrop';
import {travelintroAssets} from './assets';
import {travelintroFiles} from './assets/files';
import {travelintroMeta} from './meta';
import type {TravelintroProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 60;

// One zone for the large headline block in the center. Date sits on its own pill; brand uses a label halo.
const HEAD_TOP = 0.37;
const HEAD_BOTTOM = 0.59;
const TEXT_ZONES = [[0.03, HEAD_TOP, 0.97, HEAD_BOTTOM]] as const;

// Looping route across the upper area, ending at the pin.
const ROUTE = 'M -40 560 C 160 470, 250 220, 430 260 C 610 300, 560 540, 420 500 C 280 460, 430 170, 640 190 C 790 205, 850 270, 860 340';
const PIN = {x: 860, y: 340};

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const RouteLine: React.FC<TravelintroProps> = ({theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [8, 72], [0, 1], {...clamp, easing: easeInOut});
  const drop = spring({frame: frame - 66, fps, config: {damping: 9, stiffness: 160, mass: 0.6}});
  const rings = [0, 1, 2].map((i) => {
    const t = ((frame - 76 - i * 18) % 54) / 54;
    return frame < 76 + i * 18 ? null : t;
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <path d={ROUTE} pathLength={1} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${draw} 2`} transform="translate(0 6)" />
        <path d={ROUTE} pathLength={1} fill="none" stroke={theme.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${draw} 2`} />
        <path d={ROUTE} pathLength={1} fill="none" stroke={theme.surface} strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray="0.012 0.018" opacity={draw > 0 ? 0.9 : 0} style={{clipPath: 'none'}}
          strokeDashoffset={0} mask="url(#routeMask)" />
        <defs>
          <mask id="routeMask">
            <path d={ROUTE} pathLength={1} fill="none" stroke="#fff" strokeWidth={10} strokeDasharray={`${draw} 2`} />
          </mask>
        </defs>
        <circle cx={-40} cy={560} r={0} />
        {rings.map((t, i) =>
          t === null ? null : (
            <circle key={i} cx={PIN.x} cy={PIN.y} r={14 + t * 90} fill="none" stroke={theme.accent2} strokeWidth={5 * (1 - t)} opacity={(1 - t) * 0.9} />
          ),
        )}
        <g transform={`translate(${PIN.x} ${PIN.y - (1 - drop) * 140}) scale(${Math.max(0, drop)})`} opacity={frame >= 66 ? 1 : 0}>
          <ellipse cx={0} cy={4} rx={18} ry={6} fill="rgba(0,0,0,0.3)" />
          <path d="M 0 0 C -12 -26, -42 -46, -42 -78 A 42 42 0 1 1 42 -78 C 42 -46, 12 -26, 0 0 Z" fill={theme.accent2} stroke={theme.surface} strokeWidth={5} />
          <circle cx={0} cy={-80} r={15} fill={theme.surface} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<TravelintroProps> = (props) => {
  const {texts, theme} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = texts.headline.toUpperCase();
  const size = wrapFit(text, 250, W - PAD * 2, 2, 0.52, 60);
  const words = text.trim().split(/\s+/);
  let index = 0;
  return (
    <AbsoluteFill>
      <RouteLine {...props} />
      <div style={{position: 'absolute', left: PAD, right: PAD, top: HEAD_TOP * H, height: (HEAD_BOTTOM - HEAD_TOP) * H,
        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: `0 ${size * 0.22}px`,
          fontFamily: FLEX_FONT, fontWeight: 900, fontStretch: '75%', fontSize: size, lineHeight: 0.92, color: theme.foreground,
          textShadow: '0 6px 24px rgba(0,0,0,0.25)'}}>
          <Role role="headline">
            {words.map((word, w) => (
              <span key={w} style={{display: 'inline-flex', whiteSpace: 'pre'}}>
                {[...word].map((ch) => {
                  const i = index++;
                  const s = spring({frame: frame - 24 - i * 2, fps, config: {damping: 11, stiffness: 150, mass: 0.7}});
                  return (
                    <span key={i} style={{display: 'inline-block', transformOrigin: '50% 100%', opacity: Math.min(1, s * 2),
                      transform: `translateY(${(1 - s) * -size * 0.55}px) scale(${1 + (1 - s) * 0.7}) rotate(${(1 - s) * (i % 2 ? 14 : -14)}deg)`}}>
                      {ch}
                    </span>
                  );
                })}
              </span>
            ))}
          </Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneDate: React.FC<TravelintroProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 140}});
  const reveal = interpolate(frame, [6, 26], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: HEAD_BOTTOM * H + 30, display: 'flex', justifyContent: 'center'}}>
      <div style={{padding: '22px 44px', borderRadius: 999, background: theme.accent, color: theme.background, fontFamily: MONO_FONT,
        fontWeight: 700, fontSize: fit(texts.date, 42, 780, 0.7), letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        boxShadow: '0 10px 30px rgba(0,0,0,0.28)', transform: `scale(${pop})`}}>
        <span style={{display: 'inline-block', clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`}}>
          <Role role="date">{texts.date}</Role>
        </span>
      </div>
    </div>
  );
};

const SceneBrand: React.FC<TravelintroProps> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [8, 34], [0, 1], {...clamp, easing: easeInOut});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
      <div style={{width: 120 * line, height: 5, borderRadius: 3, background: theme.accent2}} />
      <div style={{fontFamily: SANS_FONT, fontWeight: 800, fontSize: fit(texts.brand, 40, 860, 0.95), letterSpacing: `${0.3 - (1 - t) * 0.15}em`,
        textTransform: 'uppercase', whiteSpace: 'nowrap', color: theme.foreground, textShadow: labelShadow(theme.background), opacity: t,
        transform: `translateY(${(1 - t) * 30}px)`}}>
        <Role role="brand">{texts.brand}</Role>
      </div>
    </div>
  );
};

const SCENES: React.FC<TravelintroProps>[] = [SceneTitle, SceneDate, SceneBrand];

export const Travelintro: React.FC<TravelintroProps> = (props) => {
  const {theme, media} = props;
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 210], [1.02, 1.16], clamp);
  const rise = interpolate(frame, [0, 210], [20, -40], clamp);
  return (
    <AbsoluteFill style={{background: theme.background, fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <Backdrop src={travelintroFiles[media.background]} asset={travelintroAssets.find((a) => a.id === media.background)!}
        background={theme.background} foreground={[theme.foreground]} zones={TEXT_ZONES} motion={`scale(${zoom}) translateY(${rise}px)`} />
      {travelintroMeta.scenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={s.type} from={s.from} durationInFrames={s.duration}>
            <Scene {...props} />
          </Sequence>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};
