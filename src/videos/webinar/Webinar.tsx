import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeInOut, easeOut, fit, wrapFit} from '../shared/motion';
import {MONO_FONT, SANS_FONT, loadTemplateFonts} from '../shared/fonts';
import {SceneTrack, type SceneProps} from '../shared/scenes';
import {webinarMeta} from './meta';
import type {WebinarProps} from './schema';

loadTemplateFonts();

const W = 1920;
const H = 1080;
type P = SceneProps<WebinarProps>;

const Role: React.FC<{role: string; children: React.ReactNode}> = ({role, children}) => (
  <span data-text-role={role} style={{display: 'contents'}}>{children}</span>
);

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// A video-call window: title slide in the main pane, the host in a picture-in-picture tile.
const SceneCall: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const win = spring({frame, fps, config: {damping: 16, stiffness: 110}});
  const typed = Math.round(interpolate(frame, [14, 50], [0, texts.headline.length], clamp));
  const pip = spring({frame: frame - 44, fps, config: {damping: 13, stiffness: 140}});
  const speaking = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <AbsoluteFill style={{padding: 80, background: theme.surface}}>
      <div style={{flex: 1, borderRadius: 8, overflow: 'hidden', background: theme.background, display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        transform: `translateY(${(1 - win) * 120}px) scale(${0.9 + win * 0.1})`, opacity: win}}>
        <div style={{height: 76, display: 'flex', alignItems: 'center', gap: 14, padding: '0 30px', background: `${theme.foreground}12`}}>
          {[theme.accent2, theme.accent, theme.foreground].map((c, i) => <div key={i} style={{width: 20, height: 20, borderRadius: '50%', background: c, opacity: 0.8}} />)}
          <span style={{marginLeft: 20, fontSize: fit(texts.brand, 30, 900, 0.6), fontWeight: 700, color: theme.foreground}}><Role role="brand">{texts.brand}</Role></span>
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 6, background: theme.accent2, color: theme.background,
            fontFamily: MONO_FONT, fontWeight: 800, fontSize: 24}}>
            <span style={{width: 12, height: 12, borderRadius: '50%', background: theme.background, opacity: Math.floor(frame / 15) % 2 ? 0.3 : 1}} />LIVE
          </span>
        </div>
        <div style={{flex: 1, position: 'relative', padding: '90px 100px'}}>
          <div style={{fontFamily: MONO_FONT, fontSize: 30, fontWeight: 700, color: theme.accent}}>WEBINAR</div>
          <div style={{marginTop: 30, width: 1100, fontSize: wrapFit(texts.headline, 120, 1100, 2, 0.55, 50), lineHeight: 1.05, fontWeight: 800, color: theme.foreground}}>
            <Role role="headline">{texts.headline.slice(0, typed)}<span style={{opacity: typed < texts.headline.length || Math.floor(frame / 15) % 2 ? 1 : 0, color: theme.accent}}>|</span></Role>
          </div>
          <div style={{position: 'absolute', right: 60, bottom: 60, width: 420, height: 300, borderRadius: 8, overflow: 'hidden', background: theme.foreground,
            border: `5px solid ${speaking > 0.5 ? theme.accent : 'transparent'}`, transform: `scale(${pip})`, transformOrigin: '100% 100%'}}>
            <div style={{position: 'absolute', left: 145, top: 40, width: 130, height: 130, borderRadius: '50%', background: theme.accent, color: theme.background,
              display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 52}}>{initials(texts.author)}</div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px', background: `${theme.background}e6`, display: 'flex', alignItems: 'center', gap: 12,
              fontSize: fit(texts.author, 28, 330, 0.56), fontWeight: 700, color: theme.foreground, whiteSpace: 'nowrap'}}>
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2.4} strokeLinecap="round" style={{flex: 'none'}}>
                <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
              </svg>
              <Role role="author">{texts.author}</Role>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneRegister: React.FC<P> = ({texts, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: easeOut});
  // Cursor travels to the button, then clicks it.
  const travel = interpolate(frame, [26, 58], [0, 1], {...clamp, easing: easeInOut});
  const press = spring({frame: frame - 60, fps, config: {damping: 10, stiffness: 300}});
  const pressed = frame >= 60 && frame < 68;
  const cx = interpolate(travel, [0, 1], [1500, 1170]);
  const cy = interpolate(travel, [0, 1], [980, 650]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: theme.surface}}>
      <div style={{width: 1300, padding: '80px 100px', borderRadius: 8, background: theme.background, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60,
        opacity: card, transform: `translateY(${(1 - card) * 60}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <svg width={80} height={80} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none'}}>
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span style={{fontSize: fit(texts.date, 76, 1000, 0.55), fontWeight: 800, color: theme.foreground, whiteSpace: 'nowrap'}}><Role role="date">{texts.date}</Role></span>
        </div>
        <div style={{height: 130, display: 'flex', alignItems: 'center', padding: '0 70px', borderRadius: 8, background: theme.accent, color: theme.background,
          fontSize: fit(texts.cta, 56, 900, 0.56), fontWeight: 800, transform: `scale(${pressed ? 0.94 : 1 + 0.03 * (1 - press) * (frame > 60 ? 1 : 0)})`, boxShadow: pressed ? `0 0 0 14px ${theme.accent}44` : 'none'}}>
          <Role role="cta">{texts.cta}</Role>
        </div>
      </div>
      <svg width={60} height={60} viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cy, opacity: interpolate(frame, [20, 28], [0, 1], clamp), transform: `scale(${pressed ? 0.85 : 1})`}}>
        <path d="M4 2l16 9-7 2-3 7z" fill={theme.foreground} stroke={theme.background} strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

export const Webinar: React.FC<WebinarProps> = (props) => (
  <AbsoluteFill style={{width: W, height: H, overflow: 'hidden', background: props.theme.background, fontFamily: SANS_FONT}}>
    <SceneTrack meta={webinarMeta} scenes={[SceneCall, SceneRegister]} props={props} />
  </AbsoluteFill>
);
