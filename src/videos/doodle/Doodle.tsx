import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../contract';
import {clamp, easeIn, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, SANS_FONT, SERIF_FONT, loadTemplateFonts} from '../shared/fonts';
import {doodleMeta} from './meta';
import type {DoodleProps} from './schema';

const W = 1920;
const H = 1080;

type Pt = [number, number];
type SceneP = DoodleProps & {duration: number};

const f = (n: number) => n.toFixed(1);
const jitter = (seed: string, i: number, amp: number) => (random(`${seed}:${i}`) - 0.5) * 2 * amp;

// Smooth a point list into a marker-like path using midpoint quadratics.
function smooth(pts: Pt[]): string {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${f(x)} ${f(y)} ${f((x + nx) / 2)} ${f((y + ny) / 2)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${f(last[0])} ${f(last[1])}`;
}

// A wobbly hand-drawn line with an optional bow.
function line(x1: number, y1: number, x2: number, y2: number, seed: string, amp = 3, bow = 0): string {
  const pts: Pt[] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x1 + (x2 - x1) * t + jitter(seed + 'x', i, amp * 0.5), y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * bow + jitter(seed, i, amp)]);
  }
  return smooth(pts);
}

// A loop that overshoots its start, like a quick marker circle.
function loop(cx: number, cy: number, rx: number, ry: number, seed: string): string {
  const pts: Pt[] = [];
  const n = 56;
  const phase = random(seed + 'p') * Math.PI * 2;
  const start = -Math.PI * 0.62 + (random(seed + 's') - 0.5) * 0.4;
  const turns = 1.13;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + t * turns * Math.PI * 2;
    const drift = 1 + 0.05 * Math.sin(a * 2 + phase) + jitter(seed, i, 0.014) + t * 0.07;
    pts.push([cx + Math.cos(a) * rx * drift, cy + Math.sin(a) * ry * drift]);
  }
  return smooth(pts);
}

// Curved arrow: shaft along a quadratic bezier, plus a two-stroke head.
function arrow(a: Pt, c: Pt, b: Pt, seed: string, head = 30): {shaft: string; head: string} {
  const pts: Pt[] = [];
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const wob = i === 0 || i === n ? 0 : 2.5;
    pts.push([
      u * u * a[0] + 2 * u * t * c[0] + t * t * b[0] + jitter(seed + 'x', i, wob),
      u * u * a[1] + 2 * u * t * c[1] + t * t * b[1] + jitter(seed + 'y', i, wob),
    ]);
  }
  const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
  const h1: Pt = [b[0] + Math.cos(ang + 2.6) * head, b[1] + Math.sin(ang + 2.6) * head];
  const h2: Pt = [b[0] + Math.cos(ang - 2.6) * head, b[1] + Math.sin(ang - 2.6) * head];
  return {
    shaft: smooth(pts),
    head: `M${f(h1[0] + jitter(seed, 90, 2))} ${f(h1[1])} L${f(b[0])} ${f(b[1])} L${f(h2[0])} ${f(h2[1] + jitter(seed, 91, 2))}`,
  };
}

// Sketchy five-point star drawn in straight strokes.
function star(cx: number, cy: number, r: number, seed: string): string {
  const pts: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = (i % 2 ? r * 0.45 : r) * (1 + jitter(seed, i, 0.08));
    pts.push(`${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`);
  }
  return pts.join(' ');
}

// Line boil: every few frames swap between three wobble variants.
const useBoil = () => Math.floor(useCurrentFrame() / 4) % 3;

const Ink: React.FC<{d: string; color: string; width: number; p: number; opacity?: number}> = ({d, color, width, p, opacity = 1}) =>
  p <= 0 ? null : (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, p)}
      opacity={opacity}
    />
  );

const prog = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], {...clamp, easing: easeInOut});

const Paper: React.FC<{theme: Theme}> = ({theme}) => (
  <AbsoluteFill
    style={{
      background: theme.background,
      backgroundImage: `radial-gradient(${theme.foreground}26 1.6px, transparent 1.8px)`,
      backgroundSize: '40px 40px',
      backgroundPosition: '20px 20px',
    }}
  >
    <div style={{position: 'absolute', left: 120, top: 0, bottom: 0, width: 3, background: `${theme.accent}40`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.08) 100%)'}} />
  </AbsoluteFill>
);

const STARS_1: [number, number, number][] = [
  [330, 290, 34],
  [1620, 300, 42],
  [1560, 820, 28],
];

const SceneTitle: React.FC<SceneP> = ({texts, theme, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boil = useBoil();
  const size = fit(texts.headline, 170, 1560, 0.55);
  const w = Math.min(1600, texts.headline.length * size * 0.5);
  const uy = 540 + size * 0.66;

  const variants = useMemo(
    () =>
      [0, 1, 2].map((b) => ({
        u1: line(960 - w / 2 - 20, uy, 960 + w / 2 + 30, uy - 8, `t-u1-${b}`, 3, 10),
        u2: line(960 - w / 2 + 50, uy + 28, 960 + w / 2 - 70, uy + 24, `t-u2-${b}`, 3, -6),
        curl: arrow([300, 900], [230, uy + 40], [960 - w / 2 - 50, uy + 6], `t-ar-${b}`, 26),
        stars: STARS_1.map(([x, y, r], i) => star(x, y, r, `t-s-${i}-${b}`)),
      })),
    [w, uy],
  );
  const v = variants[boil];

  const write = interpolate(frame, [6, 40], [0, 1], {...clamp, easing: easeInOut});
  const exit = interpolate(frame, [duration - 12, duration], [0, 1], {...clamp, easing: easeIn});

  return (
    <AbsoluteFill style={{opacity: 1 - exit, transform: `translateY(${exit * -40}px)`}}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontStyle: 'italic',
            fontWeight: 760,
            fontSize: size,
            lineHeight: 1.1,
            color: theme.foreground,
            whiteSpace: 'nowrap',
            transform: 'rotate(-1.5deg)',
            clipPath: `inset(-30% ${(1 - write) * 100}% -30% -2%)`,
          }}
        >
          <span data-text-role={'headline'} style={{display: 'contents'}}>
            {texts.headline}
          </span>
        </div>
      </AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <Ink d={v.u1} color={theme.foreground} width={9} p={prog(frame, 36, 54)} />
        <Ink d={v.u2} color={theme.accent} width={7} p={prog(frame, 46, 62)} />
        <Ink d={v.curl.shaft} color={theme.accent2} width={6} p={prog(frame, 52, 66)} />
        <Ink d={v.curl.head} color={theme.accent2} width={6} p={prog(frame, 64, 70)} />
        {v.stars.map((d, i) => {
          const [x, y] = STARS_1[i];
          const s = spring({frame: frame - 50 - i * 5, fps, config: {damping: 10, stiffness: 160}});
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${0.6 + s * 0.4}) translate(${-x} ${-y})`}>
              <Ink d={d} color={i === 1 ? theme.accent : theme.accent2} width={5} p={prog(frame, 50 + i * 5, 64 + i * 5)} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const CX = [340, 960, 1580];
const CY = 610;
const RX = 215;
const RY = 145;
const TEXT_W = 300;
const STARS_2: [number, number, number][] = [
  [200, 330, 30],
  [1760, 350, 36],
  [960, 900, 26],
  [1690, 880, 30],
  [250, 890, 24],
];

const SceneSteps: React.FC<SceneP> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boil = useBoil();
  const points = [texts.point1, texts.point2, texts.point3];
  const hSize = fit(texts.headline, 92, 1400, 0.55);
  const hw = Math.min(1400, texts.headline.length * hSize * 0.5);
  const hy = 170;
  const uy = hy + hSize * 0.62;

  const variants = useMemo(
    () =>
      [0, 1, 2].map((b) => ({
        under: line(960 - hw / 2 - 16, uy, 960 + hw / 2 + 20, uy - 5, `s-u-${b}`, 2.5, 7),
        loops: CX.map((x, i) => loop(x, CY, RX, RY, `s-l-${i}-${b}`)),
        arrows: [0, 1].map((i) =>
          arrow([CX[i] + RX - 30, CY - RY + 10], [(CX[i] + CX[i + 1]) / 2, CY - RY - 110], [CX[i + 1] - RX + 30, CY - RY + 10], `s-a-${i}-${b}`),
        ),
        stars: STARS_2.map(([x, y, r], i) => star(x, y, r, `s-s-${i}-${b}`)),
      })),
    [hw, uy],
  );
  const v = variants[boil];
  const headIn = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeOut});

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: hy,
          transform: `translateY(-50%) rotate(-1deg) translateY(${(1 - headIn) * 20}px)`,
          textAlign: 'center',
          fontFamily: SERIF_FONT,
          fontStyle: 'italic',
          fontWeight: 760,
          fontSize: hSize,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          color: theme.foreground,
          opacity: headIn,
        }}
      >
        <span data-text-role={'headline'} style={{display: 'contents'}}>
          {texts.headline}
        </span>
      </div>

      {points.map((text, i) => {
        const base = 14 + i * 26;
        const size = wrapFit(text, 72, TEXT_W, 2, 0.6, 30);
        const pop = spring({frame: frame - base, fps, config: {damping: 12, stiffness: 150}});
        const mark = interpolate(frame, [base + 6, base + 18], [0, 1], {...clamp, easing: easeOut});
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: CX[i] - TEXT_W / 2,
                top: CY,
                width: TEXT_W,
                textAlign: 'center',
                fontFamily: DISPLAY,
                fontWeight: 820,
                fontSize: size,
                lineHeight: 1.15,
                color: theme.foreground,
                opacity: Math.min(1, pop * 1.4),
                transform: `translateY(-50%) scale(${0.7 + pop * 0.3}) rotate(${(i - 1) * 1.5}deg)`,
              }}
            >
              <span data-text-role={`point${i + 1}`} style={{display: 'contents'}}>
                <span
                  style={{
                    backgroundImage: `linear-gradient(transparent 58%, ${theme.accent}66 58%, ${theme.accent}66 92%, transparent 92%)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${mark * 100}% 100%`,
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    padding: '0 6px',
                  }}
                >
                  {text}
                </span>
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                left: CX[i] - RX - 10,
                top: CY - RY - 40,
                fontFamily: SERIF_FONT,
                fontStyle: 'italic',
                fontWeight: 800,
                fontSize: 64,
                color: theme.accent2,
                opacity: interpolate(frame, [base + 10, base + 18], [0, 1], clamp),
                transform: 'rotate(-10deg)',
              }}
            >
              {i + 1}
            </div>
          </React.Fragment>
        );
      })}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <Ink d={v.under} color={theme.accent} width={7} p={prog(frame, 4, 20)} />
        {v.loops.map((d, i) => (
          <Ink key={i} d={d} color={theme.foreground} width={7} p={prog(frame, 14 + i * 26, 36 + i * 26)} />
        ))}
        {v.arrows.map((a, i) => {
          const base = 14 + i * 26;
          return (
            <g key={i}>
              <Ink d={a.shaft} color={theme.accent} width={6} p={prog(frame, base + 20, base + 32)} />
              <Ink d={a.head} color={theme.accent} width={6} p={prog(frame, base + 31, base + 37)} />
            </g>
          );
        })}
        {v.stars.map((d, i) => {
          const [x, y] = STARS_2[i];
          const start = 84 + i * 4;
          const s = spring({frame: frame - start, fps, config: {damping: 9, stiffness: 170}});
          const spin = interpolate(frame, [start, 138], [0, 18 * (i % 2 ? -1 : 1)], clamp);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${spin}) scale(${0.5 + s * 0.5}) translate(${-x} ${-y})`}>
              <Ink d={d} color={i % 2 ? theme.accent : theme.accent2} width={5} p={prog(frame, start, start + 12)} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Scene timing lives in meta.ts so the taxonomy and the render never disagree.
const SCENES: React.FC<SceneP>[] = [SceneTitle, SceneSteps];

export const Doodle: React.FC<DoodleProps> = (props) => {
  loadTemplateFonts();
  return (
    <AbsoluteFill style={{fontFamily: SANS_FONT, overflow: 'hidden'}}>
      <Paper theme={props.theme} />
      {doodleMeta.scenes.map((s, i) => {
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
