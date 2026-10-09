import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ThemeRole} from '../contract';
import {Grain, LITE, clamp, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack} from '../shared/scenes';
import type {SceneProps} from '../shared/scenes';
import {papercutMeta} from './meta';
import type {PapercutProps} from './schema';

const W = 1920;
const H = 1080;
const HILL_W = 2240;
const HILL_H = 470;

// Torn top edge for a hill: two layered sine waves plus small deterministic jitter.
function hillEdge(seed: string, base: number, amp: number, waves: number, phase: number) {
  const pts: string[] = [];
  for (let i = 0, x = 0; x <= HILL_W; i++, x += 16) {
    const t = x / HILL_W;
    const y =
      base +
      amp * Math.sin(t * Math.PI * waves + phase) +
      amp * 0.28 * Math.sin(t * Math.PI * waves * 2.7 + phase * 1.9) +
      (random(`${seed}-${i}`) - 0.5) * 11;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}

// Lumpy torn blob for clouds and the sun.
function blob(seed: string, rx: number, ry: number, bumps: number, flat: boolean) {
  const cx = rx * 1.25;
  const cy = ry * 1.35;
  const phase = random(seed) * 6;
  const n = 84;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.11 * Math.sin(a * bumps + phase) + 0.05 * Math.sin(a * bumps * 2.3 + phase) + (random(`${seed}-${i}`) - 0.5) * 0.05;
    const x = cx + Math.cos(a) * rx * k;
    let y = cy + Math.sin(a) * ry * k;
    if (flat) y = Math.min(y, cy + ry * 0.5 + (random(`${seed}-f${i}`) - 0.5) * 5);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return {d: `M${pts.join(' L')} Z`, w: cx * 2, h: cy * 2};
}

// Rough paper edge as a clip-path polygon.
function tornClip(seed: string, jag = 1.6) {
  const pts: string[] = [];
  const r = (k: string) => random(`${seed}-${k}`) * jag;
  for (let i = 0; i <= 25; i++) pts.push(`${i * 4}% ${r(`t${i}`).toFixed(2)}%`);
  for (let i = 1; i < 5; i++) pts.push(`${(100 - r(`r${i}`) * 0.4).toFixed(2)}% ${i * 20}%`);
  for (let i = 25; i >= 0; i--) pts.push(`${i * 4}% ${(100 - r(`b${i}`)).toFixed(2)}%`);
  for (let i = 4; i > 0; i--) pts.push(`${(r(`l${i}`) * 0.4).toFixed(2)}% ${i * 20}%`);
  return `polygon(${pts.join(', ')})`;
}

type HillDef = {seed: string; base: number; amp: number; waves: number; phase: number; color: ThemeRole; delay: number; depth: number};
const HILLS: (HillDef & {edge: string})[] = (
  [
    {seed: 'h0', base: 70, amp: 52, waves: 2.1, phase: 0.4, color: 'surface', delay: 0, depth: 0.3},
    {seed: 'h1', base: 170, amp: 46, waves: 2.8, phase: 2.2, color: 'accent2', delay: 6, depth: 0.6},
    {seed: 'h2', base: 260, amp: 40, waves: 1.7, phase: 4.1, color: 'accent', delay: 12, depth: 1},
    {seed: 'h3', base: 360, amp: 26, waves: 3.3, phase: 1.1, color: 'foreground', delay: 18, depth: 1.4},
  ] as HillDef[]
).map((h) => ({...h, edge: hillEdge(h.seed, h.base, h.amp, h.waves, h.phase)}));

type CloudDef = {seed: string; x: number; y: number; rx: number; ry: number; bumps: number; flat: boolean; color: ThemeRole; delay: number; depth: number};
const SKY: (CloudDef & ReturnType<typeof blob>)[] = (
  [
    {seed: 'sun', x: 1400, y: 10, rx: 120, ry: 120, bumps: 9, flat: false, color: 'accent', delay: 4, depth: -0.2},
    {seed: 'c0', x: 40, y: 50, rx: 230, ry: 78, bumps: 5, flat: true, color: 'surface', delay: 10, depth: -0.5},
    {seed: 'c1', x: 1300, y: 170, rx: 200, ry: 66, bumps: 6, flat: true, color: 'surface', delay: 16, depth: -0.8},
    {seed: 'c2', x: 1620, y: 30, rx: 160, ry: 56, bumps: 4, flat: true, color: 'surface', delay: 22, depth: -0.4},
    {seed: 'c3', x: 430, y: 220, rx: 105, ry: 38, bumps: 4, flat: true, color: 'surface', delay: 26, depth: -1},
  ] as CloudDef[]
).map((c) => ({...c, ...blob(c.seed, c.rx, c.ry, c.bumps, c.flat)}));

const LABEL_CLIP = tornClip('label', 1.8);
const SUB_CLIP = tornClip('sub', 3);

const PAPER_SHADOW = LITE ? undefined : 'drop-shadow(0 -6px 14px rgba(0,0,0,0.28)) drop-shadow(0 -2px 2px rgba(0,0,0,0.12))';
const CLOUD_SHADOW = LITE ? undefined : 'drop-shadow(0 10px 14px rgba(0,0,0,0.22))';

// Slides a paper layer in with a small bounce, then drifts it for parallax.
const Layer: React.FC<{delay: number; from: number; depth: number; style: React.CSSProperties; children: React.ReactNode}> = ({
  delay,
  from,
  depth,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 70, mass: 1.1}});
  const drift = interpolate(frame, [0, 210], [0, -depth * 70]);
  const bob = Math.sin((frame + delay * 7) / 38) * Math.abs(depth) * 4;
  return <div style={{position: 'absolute', ...style, transform: `translate(${drift}px, ${(1 - s) * from + bob}px)`}}>{children}</div>;
};

const Tape: React.FC<{color: string; style: React.CSSProperties}> = ({color, style}) => (
  <div
    style={{
      position: 'absolute',
      width: 170,
      height: 44,
      background: color,
      clipPath: 'polygon(0 8%, 4% 0, 96% 6%, 100% 0, 98% 50%, 100% 100%, 95% 92%, 5% 100%, 0 94%, 3% 50%)',
      ...style,
    }}
  />
);

const SceneTitle: React.FC<SceneProps<PapercutProps>> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const hs = wrapFit(texts.headline, 150, 1220, 2, 0.6, 56);
  const ss = wrapFit(texts.subhead, 46, 1040, 2, 0.54, 26);
  const bs = fit(texts.brand.toUpperCase(), 36, 360, 0.78);

  const lab = spring({frame: frame - 40, fps, config: {damping: 12, stiffness: 130, mass: 0.8}});
  const labRot = interpolate(lab, [0, 1], [-14, -2.4]);
  const labScale = interpolate(lab, [0, 1], [0.4, 1]);

  const sub = spring({frame: frame - 64, fps, config: {damping: 14, stiffness: 120}});

  const tagIn = spring({frame: frame - 84, fps, config: {damping: 14, stiffness: 90}});
  const tt = Math.max(0, frame - 84);
  const swing = 13 * Math.sin(tt * 0.2) * Math.exp(-tt / 24) + Math.sin(frame / 30) * 1.2;

  return (
    <AbsoluteFill>
      {SKY.map((c) => (
        <Layer key={c.seed} delay={c.delay} from={-480} depth={c.depth} style={{left: c.x, top: c.y}}>
          <svg width={c.w} height={c.h} viewBox={`0 0 ${c.w} ${c.h}`} style={{overflow: 'visible', filter: CLOUD_SHADOW}}>
            <path d={c.d} fill={theme[c.color]} stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinejoin="round" />
          </svg>
        </Layer>
      ))}

      {HILLS.map((h) => (
        <Layer key={h.seed} delay={h.delay} from={560} depth={h.depth} style={{left: -140, top: H - HILL_H}}>
          <svg width={HILL_W} height={HILL_H + 60} viewBox={`0 0 ${HILL_W} ${HILL_H + 60}`} style={{overflow: 'visible', filter: PAPER_SHADOW}}>
            <path d={`${h.edge} L${HILL_W},${HILL_H + 60} L0,${HILL_H + 60} Z`} fill={theme[h.color]} />
            <path d={h.edge} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={5} strokeLinejoin="round" />
          </svg>
        </Layer>
      ))}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, paddingTop: 150, paddingBottom: 300}}>
        <div
          style={{
            position: 'relative',
            opacity: interpolate(lab, [0, 0.25], [0, 1], clamp),
            transform: `rotate(${labRot}deg) scale(${labScale})`,
            filter: LITE ? undefined : 'drop-shadow(0 20px 22px rgba(0,0,0,0.28)) drop-shadow(7px 8px 0 rgba(0,0,0,0.14))',
          }}
        >
          <div
            style={{
              background: theme.surface,
              clipPath: LABEL_CLIP,
              padding: '48px 84px 54px',
              maxWidth: 1400,
              textAlign: 'center',
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: hs,
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
              color: theme.foreground,
            }}
          >
            <span data-text-role={'headline'} style={{display: 'contents'}}>
              {texts.headline}
            </span>
          </div>
          <Tape color={`${theme.accent2}d9`} style={{top: -20, left: 30, transform: 'rotate(-9deg)'}} />
          <Tape color={`${theme.accent2}d9`} style={{bottom: -18, right: 34, transform: 'rotate(-6deg)'}} />
        </div>

        <div
          style={{
            opacity: interpolate(sub, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - sub) * 70}px) rotate(${interpolate(sub, [0, 1], [5, 1.6])}deg)`,
            filter: LITE ? undefined : 'drop-shadow(0 12px 14px rgba(0,0,0,0.25))',
          }}
        >
          <div
            style={{
              background: theme.foreground,
              color: theme.background,
              clipPath: SUB_CLIP,
              padding: '22px 48px',
              maxWidth: 1140,
              textAlign: 'center',
              fontFamily: SANS_FONT,
              fontWeight: 600,
              fontSize: ss,
              lineHeight: 1.2,
            }}
          >
            <span data-text-role={'subhead'} style={{display: 'contents'}}>
              {texts.subhead}
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: W / 2, top: 18, transform: `translateY(${(1 - tagIn) * -340}px)`}}>
        <div style={{transformOrigin: '0 0', transform: `rotate(${swing}deg)`}}>
          <div style={{position: 'absolute', left: -1.5, top: 0, width: 3, height: 64, background: `${theme.foreground}aa`}} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 60,
              transform: 'translateX(-50%)',
              filter: LITE ? undefined : 'drop-shadow(0 10px 10px rgba(0,0,0,0.25))',
            }}
          >
            <div
              style={{
                position: 'relative',
                background: theme.surface,
                clipPath: 'polygon(20% 0, 80% 0, 100% 26%, 100% 100%, 0 100%, 0 26%)',
                padding: '44px 40px 22px',
                minWidth: 160,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: bs,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.foreground,
                borderBottom: `8px solid ${theme.accent2}`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 12,
                  width: 16,
                  height: 16,
                  marginLeft: -8,
                  borderRadius: 99,
                  background: theme.background,
                  border: `3px solid ${theme.accent}`,
                }}
              />
              <span data-text-role={'brand'} style={{display: 'contents'}}>
                {texts.brand}
              </span>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: -15,
              top: -15,
              width: 30,
              height: 30,
              borderRadius: 99,
              background: theme.accent,
              boxShadow: '0 4px 6px rgba(0,0,0,0.35), inset -4px -4px 0 rgba(0,0,0,0.18)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC<SceneProps<PapercutProps>>[] = [SceneTitle];

export const Papercut: React.FC<PapercutProps> = (props) => {
  loadTemplateFonts();
  const {theme} = props;
  return (
    <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden', background: theme.background}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${theme.surface}66, transparent 62%)`}} />
      <SceneTrack meta={papercutMeta} scenes={SCENES} props={props} exit="none" />
      <Grain />
    </AbsoluteFill>
  );
};
