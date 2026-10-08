import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowIcon, clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {DISPLAY, MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {parseList} from '../shared/data';
import {quizMeta} from './meta';
import type {QuizProps} from './schema';

loadTemplateFonts();

const W = 1080;
const H = 1920;
const PAD = 80;
const LETTERS = 'ABCDEF';
const THINK = 90;
type P = SceneProps<QuizProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

// The first list item is the right answer. Show the answers in a stable shuffled order.
function answers(items: string, seed: string) {
  const list = parseList(items).map((text, i) => ({text, correct: i === 0, key: random(`${seed}-${text}-${i}`)}));
  return list.sort((a, b) => a.key - b.key);
}

const SceneQuestion: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 10, stiffness: 170}});
  const card = spring({frame: frame - 14, fps, config: {damping: 15, stiffness: 120}});
  const q = texts.quote;
  return (
    <AbsoluteFill style={{padding: PAD, justifyContent: 'center', alignItems: 'center', gap: 70}}>
      <div style={{padding: '22px 46px', borderRadius: 999, background: theme.accent, color: theme.background, fontFamily: DISPLAY, fontWeight: 900,
        fontSize: fit(texts.headline, 76, W - PAD * 2 - 92, 0.76), whiteSpace: 'nowrap', textTransform: 'uppercase', transform: `scale(${pop}) rotate(${(1 - pop) * -12 - 3}deg)`}}>
        <Role role="headline">{texts.headline}</Role>
      </div>
      <div style={{width: W - PAD * 2, minHeight: 700, borderRadius: 8, background: theme.surface, padding: 70, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        transform: `perspective(1600px) rotateX(${(1 - card) * 70}deg)`, transformOrigin: '50% 0%', opacity: Math.min(1, card * 2), boxShadow: `0 30px 0 ${theme.accent2}`}}>
        <div style={{fontFamily: DISPLAY, fontSize: 200, lineHeight: 0.7, fontWeight: 900, color: theme.accent2}}>?</div>
        <div style={{marginTop: 30, fontSize: wrapFit(q, 92, W - PAD * 2 - 140, 5, 0.54, 44), lineHeight: 1.12, fontWeight: 800, color: theme.foreground}}>
          <Role role="quote">{q}</Role>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAnswers: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const list = answers(texts.items, texts.quote);
  const n = list.length;
  const tileH = Math.min(220, (1240 - (n - 1) * 30) / n);
  const textW = W - PAD * 2 - 220;
  // Wrap to two lines, but also fit the longest single word, which wrapFit cannot break.
  const size = Math.min(tileH * 0.34, ...list.map((x) => Math.min(wrapFit(x.text, 64, textW, 2, 0.6, 24),
    fit(x.text.split(/\s+/).reduce((a, w) => (w.length > a.length ? w : a), ''), 64, textW, 0.68))));
  const timer = interpolate(frame, [20, 20 + THINK], [1, 0], clamp);
  const reveal = spring({frame: frame - 26 - THINK, fps, config: {damping: 12, stiffness: 160}});
  const left = Math.ceil(timer * 3);
  const R = 70;
  const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{padding: PAD}}>
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 180, height: 180, opacity: interpolate(frame, [0, 12, 20 + THINK, 30 + THINK], [0, 1, 1, 0], clamp)}}>
          <svg width={180} height={180} viewBox="0 0 180 180" style={{transform: 'rotate(-90deg)'}}>
            <circle cx={90} cy={90} r={R} fill="none" stroke={`${theme.foreground}22`} strokeWidth={16} />
            <circle cx={90} cy={90} r={R} fill="none" stroke={theme.accent} strokeWidth={16} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - timer)} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: MONO_FONT, fontSize: 80, fontWeight: 800, color: theme.foreground}}>{Math.max(left, 0)}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: PAD, right: PAD, top: 420, display: 'flex', flexDirection: 'column', gap: 30}}>
        <Role role="items">{list.map((a, i) => {
          const t = spring({frame: frame - 6 - i * 6, fps, config: {damping: 14, stiffness: 140}});
          const dim = a.correct ? 0 : reveal;
          const win = a.correct ? reveal : 0;
          return (
            <div key={i} style={{height: tileH, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 36, padding: '0 40px',
              background: win > 0.5 ? theme.accent2 : theme.surface, opacity: 1 - dim * 0.65,
              transform: `translateX(${(1 - t) * (i % 2 ? 1 : -1) * 600}px) scale(${1 + win * 0.04})`,
              border: `5px solid ${win > 0.5 ? theme.accent2 : `${theme.foreground}18`}`}}>
              <div style={{width: 96, height: 96, flex: 'none', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontSize: 52, fontWeight: 900,
                background: win > 0.5 ? theme.background : theme.accent, color: win > 0.5 ? theme.accent2 : theme.background}}>
                {win > 0.5 ? (
                  <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                ) : LETTERS[i]}
              </div>
              <div style={{flex: 1, minWidth: 0, overflowWrap: 'anywhere', fontSize: size, lineHeight: 1.1, fontWeight: 800, color: win > 0.5 ? theme.background : theme.foreground, textDecoration: dim > 0.5 ? 'line-through' : 'none'}}>{a.text}</div>
            </div>
          );
        })}</Role>
      </div>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wipe = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeInOut});
  const cta = spring({frame: frame - 12, fps, config: {damping: 11, stiffness: 150}});
  const t = interpolate(frame, [6, 24], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: theme.accent, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`, justifyContent: 'center', alignItems: 'center', padding: PAD, gap: 60}}>
      <div style={{fontFamily: DISPLAY, fontSize: 360, lineHeight: 0.8, fontWeight: 900, color: theme.background, opacity: t, transform: `rotate(${(1 - t) * 30 - 8}deg)`}}>?</div>
      <div style={{height: 140, display: 'flex', alignItems: 'center', gap: 24, padding: '0 60px', borderRadius: 70, background: theme.background, color: theme.foreground,
        fontSize: fit(texts.cta, 60, W - PAD * 2 - 200, 0.62), fontWeight: 850, whiteSpace: 'nowrap', transform: `scale(${cta})`}}>
        <Role role="cta">{texts.cta}</Role><ArrowIcon size={52} />
      </div>
    </AbsoluteFill>
  );
};

export const Quiz: React.FC<QuizProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={quizMeta} scenes={[SceneQuestion, SceneAnswers, SceneEnd]} props={props} />
  </AbsoluteFill>
);
