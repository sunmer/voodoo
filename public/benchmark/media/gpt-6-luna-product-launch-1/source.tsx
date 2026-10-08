import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame } from 'remotion';
import { palette } from './contract';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const font: React.CSSProperties = { fontFamily: 'Archivo, sans-serif' };

const LogoMark: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox='0 0 64 64' fill='none' aria-hidden='true'>
    <path d='M17 19h14a9 9 0 0 1 9 9v17' stroke={palette.accent} strokeWidth='5' strokeLinecap='round' />
    <path d='M47 45H33a9 9 0 0 1-9-9V19' stroke={palette.secondary} strokeWidth='5' strokeLinecap='round' />
    <circle cx='17' cy='19' r='5' fill={palette.accent} />
    <circle cx='47' cy='45' r='5' fill={palette.secondary} />
  </svg>
);

const Backdrop: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = interpolate(frame, [0, 359], [0, 28], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${72 + drift / 18}% 42%, rgba(120,185,237,0.10), transparent 34%), radial-gradient(ellipse at 24% 70%, rgba(184,243,107,0.07), transparent 31%), ${palette.background}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.17, backgroundImage: 'radial-gradient(rgba(245,245,242,0.18) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'linear-gradient(90deg, transparent, black 18%, black 82%, transparent)' }} />
      <div style={{ position: 'absolute', width: 780, height: 780, right: -280 + drift, top: 125, borderRadius: '50%', border: '1px solid rgba(245,245,242,0.045)' }} />
      <div style={{ position: 'absolute', width: 570, height: 570, right: -175 + drift, top: 230, borderRadius: '50%', border: '1px solid rgba(245,245,242,0.04)' }} />
    </AbsoluteFill>
  );
};

const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = spring({ frame: f, fps: 30, durationInFrames: 26, config: { damping: 200 } });
  const float = Math.sin((f / 90) * Math.PI) * 10;
  return (
    <AbsoluteFill style={{ ...font, color: palette.foreground }}>
      <div style={{ position: 'absolute', left: 158, top: 280, opacity: reveal, transform: `translateY(${(1 - reveal) * 24}px)` }}>
        <div style={{ fontSize: 158, lineHeight: 0.98, fontWeight: 700, letterSpacing: '-0.075em' }}>Relay</div>
        <div style={{ marginTop: 31, fontSize: 43, lineHeight: 1.22, fontWeight: 400, letterSpacing: '-0.035em', color: 'rgba(245,245,242,0.82)' }}>Make room for focused work</div>
        <div style={{ marginTop: 43, width: 70, height: 5, borderRadius: 4, background: palette.accent }} />
      </div>
      <div style={{ position: 'absolute', right: 170, top: 192, width: 600, height: 690, transform: `translateY(${float}px)`, opacity: 0.95 }}>
        <svg width='600' height='690' viewBox='0 0 600 690' fill='none' aria-hidden='true' style={{ position: 'absolute', inset: 0 }}>
          <circle cx='306' cy='340' r='232' stroke='rgba(245,245,242,0.10)' strokeWidth='1' />
          <circle cx='306' cy='340' r='174' stroke='rgba(245,245,242,0.08)' strokeWidth='1' strokeDasharray='3 11' />
          <path d='M120 394C188 394 188 274 267 274H339C412 274 401 405 484 405' stroke='rgba(184,243,107,0.62)' strokeWidth='2' />
          <path d='M144 206C205 206 219 339 292 339H368C420 339 434 237 476 237' stroke='rgba(120,185,237,0.55)' strokeWidth='2' />
          <circle cx='120' cy='394' r='7' fill={palette.accent} />
          <circle cx='484' cy='405' r='7' fill={palette.accent} />
          <circle cx='144' cy='206' r='6' fill={palette.secondary} />
          <circle cx='476' cy='237' r='6' fill={palette.secondary} />
          <circle cx='306' cy='340' r='82' fill='rgba(184,243,107,0.08)' stroke='rgba(184,243,107,0.32)' />
        </svg>
        <div style={{ position: 'absolute', left: 189, top: 206, width: 244, padding: 20, borderRadius: 20, background: 'rgba(31,34,40,0.94)', border: '1px solid rgba(245,245,242,0.11)', boxShadow: '0 28px 80px rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 19 }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: palette.accent }} />
            <span style={{ width: 82, height: 7, borderRadius: 4, background: 'rgba(245,245,242,0.68)' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ height: 40, flex: 1, borderRadius: 9, background: 'rgba(120,185,237,0.20)' }} />
            <span style={{ height: 40, flex: 1.2, borderRadius: 9, background: 'rgba(184,243,107,0.22)' }} />
            <span style={{ height: 40, flex: 0.7, borderRadius: 9, background: 'rgba(245,245,242,0.08)' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 70, top: 374, width: 186, height: 130, borderRadius: 18, background: 'rgba(28,31,37,0.94)', border: '1px solid rgba(245,245,242,0.10)', transform: 'rotate(-7deg)', padding: 18, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}><i style={{ width: 23, height: 23, borderRadius: 20, background: palette.secondary }} /><i style={{ width: 23, height: 23, borderRadius: 20, background: palette.accent, marginLeft: -12 }} /><i style={{ width: 23, height: 23, borderRadius: 20, background: '#d994b7', marginLeft: -12 }} /></div>
          <div style={{ width: 112, height: 7, borderRadius: 4, background: 'rgba(245,245,242,0.55)', marginBottom: 10 }} />
          <div style={{ width: 77, height: 6, borderRadius: 4, background: 'rgba(245,245,242,0.18)' }} />
        </div>
        <div style={{ position: 'absolute', right: 49, top: 418, width: 204, height: 154, borderRadius: 18, background: 'rgba(28,31,37,0.96)', border: '1px solid rgba(245,245,242,0.10)', transform: 'rotate(6deg)', padding: 20, boxSizing: 'border-box' }}>
          <div style={{ width: 91, height: 7, borderRadius: 4, background: 'rgba(245,245,242,0.56)', marginBottom: 18 }} />
          {[0, 1, 2].map((item) => <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><span style={{ width: 13, height: 13, borderRadius: 4, border: '1px solid rgba(184,243,107,0.72)' }} /><span style={{ width: 110 - item * 15, height: 6, borderRadius: 4, background: 'rgba(245,245,242,0.25)' }} /></div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type CalendarCardProps = { left: string; top: number; title: string; detail: string; focused?: boolean; focusMix?: number; blue?: boolean };
const CalendarCard: React.FC<CalendarCardProps> = ({ left, top, title, detail, focused = false, focusMix = 0, blue = false }) => (
  <div style={{ position: 'absolute', left, top, width: '16%', minHeight: 67, boxSizing: 'border-box', borderRadius: 9, padding: '9px 10px', background: focused ? `rgba(184,243,107,${0.12 + focusMix * 0.58})` : blue ? 'rgba(120,185,237,0.17)' : 'rgba(245,245,242,0.08)', border: `1px solid ${focused ? 'rgba(184,243,107,0.68)' : blue ? 'rgba(120,185,237,0.26)' : 'rgba(245,245,242,0.11)'}`, color: palette.foreground, overflow: 'hidden' }}>
    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(245,245,242,0.62)' }}>{detail}</div>
  </div>
);

const ProgressCard: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: 'absolute', right: 19, bottom: 18, width: 218, height: 162, padding: 17, boxSizing: 'border-box', borderRadius: 15, background: '#202329', border: '1px solid rgba(245,245,242,0.14)', opacity, transform: `translateY(${(1 - opacity) * 14}px)`, boxShadow: '0 16px 45px rgba(0,0,0,0.28)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>Progress</span><span style={{ fontSize: 12, color: palette.accent }}>12 / 16</span>
    </div>
    <div style={{ fontSize: 11, color: 'rgba(245,245,242,0.56)', marginBottom: 6 }}>Planned</div>
    <div style={{ height: 5, borderRadius: 5, background: 'rgba(245,245,242,0.10)', marginBottom: 12 }}><div style={{ width: '76%', height: 5, borderRadius: 5, background: palette.secondary }} /></div>
    <div style={{ fontSize: 11, color: 'rgba(245,245,242,0.56)', marginBottom: 6 }}>Done</div>
    <div style={{ height: 5, borderRadius: 5, background: 'rgba(245,245,242,0.10)' }}><div style={{ width: '61%', height: 5, borderRadius: 5, background: palette.accent }} /></div>
  </div>
);

const FeatureShowcase: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, durationInFrames: 30, config: { damping: 200 } });
  const collaboration = interpolate(f, [0, 8, 47, 63], [1, 1, 0, 0], clamp);
  const focusMix = interpolate(f, [46, 63, 99, 117], [0, 1, 1, 0], clamp);
  const progressMix = interpolate(f, [106, 123, 180], [0, 1, 1], clamp);
  const titleOne = interpolate(f, [0, 7, 49, 62], [0, 1, 1, 0], clamp);
  const titleTwo = interpolate(f, [53, 66, 108, 122], [0, 1, 1, 0], clamp);
  const titleThree = interpolate(f, [113, 126, 180], [0, 1, 1], clamp);
  const labelStyle = (opacity: number): React.CSSProperties => ({ position: 'absolute', left: 0, top: 0, width: 440, opacity, transform: `translateY(${(1 - opacity) * 16}px)`, fontSize: 56, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.055em' });
  return (
    <AbsoluteFill style={{ ...font, color: palette.foreground }}>
      <div style={{ position: 'absolute', left: 152, top: 82, display: 'flex', gap: 13, alignItems: 'center', opacity: 0.95 }}><LogoMark size={36} /><span style={{ fontSize: 24, fontWeight: 650, letterSpacing: '-0.04em' }}>Relay</span></div>
      <div style={{ position: 'absolute', left: 154, top: 390, width: 445, height: 200 }}>
        <div style={labelStyle(titleOne)}>Plan together</div>
        <div style={labelStyle(titleTwo)}>Protect focus<br />time</div>
        <div style={labelStyle(titleThree)}>See progress</div>
        <div style={{ position: 'absolute', left: 0, top: 150, width: 66, height: 4, borderRadius: 4, background: palette.accent, opacity: Math.max(titleOne, titleTwo, titleThree) }} />
      </div>
      <div style={{ position: 'absolute', left: 630, top: 150, width: 1135, height: 770, transform: `translateY(${(1 - enter) * 28}px) scale(${0.975 + enter * 0.025})`, transformOrigin: 'center center', borderRadius: 27, background: '#1a1c21', border: '1px solid rgba(245,245,242,0.14)', boxShadow: '0 35px 110px rgba(0,0,0,0.42)', overflow: 'hidden' }}>
        <div style={{ height: 70, display: 'flex', alignItems: 'center', padding: '0 23px', boxSizing: 'border-box', borderBottom: '1px solid rgba(245,245,242,0.09)', gap: 12, background: 'rgba(245,245,242,0.015)' }}>
          <div style={{ display: 'flex', gap: 7, marginRight: 10 }}><i style={{ width: 8, height: 8, borderRadius: 8, background: '#ed837d' }} /><i style={{ width: 8, height: 8, borderRadius: 8, background: '#e6c56f' }} /><i style={{ width: 8, height: 8, borderRadius: 8, background: palette.accent }} /></div>
          <LogoMark size={28} /><span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>Relay</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, opacity: collaboration }}>
            <span style={{ width: 25, height: 25, display: 'grid', placeItems: 'center', borderRadius: 20, background: palette.secondary, color: '#101114', fontSize: 10, fontWeight: 700 }}>JM</span>
            <span style={{ width: 25, height: 25, display: 'grid', placeItems: 'center', borderRadius: 20, background: '#d994b7', color: '#101114', fontSize: 10, fontWeight: 700, marginLeft: -12 }}>AK</span>
            <span style={{ width: 25, height: 25, display: 'grid', placeItems: 'center', borderRadius: 20, background: palette.accent, color: '#101114', fontSize: 10, fontWeight: 700, marginLeft: -12 }}>RL</span>
          </div>
          <div style={{ width: 82, height: 31, display: 'grid', placeItems: 'center', marginLeft: 14, borderRadius: 8, background: 'rgba(184,243,107,0.16)', border: '1px solid rgba(184,243,107,0.27)', color: palette.accent, fontSize: 12, fontWeight: 600 }}>Share week</div>
        </div>
        <div style={{ display: 'flex', height: 'calc(100% - 70px)' }}>
          <div style={{ width: 194, flexShrink: 0, padding: '25px 16px', boxSizing: 'border-box', borderRight: '1px solid rgba(245,245,242,0.08)', color: 'rgba(245,245,242,0.72)' }}>
            <div style={{ padding: '0 10px', marginBottom: 15, color: 'rgba(245,245,242,0.37)', fontSize: 10, letterSpacing: '0.12em', fontWeight: 600 }}>WORKSPACE</div>
            {['Week', 'Inbox', 'Projects', 'People'].map((item, index) => <div key={item} style={{ height: 39, padding: '0 11px', marginBottom: 4, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, background: index === 0 ? 'rgba(184,243,107,0.12)' : 'transparent', color: index === 0 ? palette.accent : 'rgba(245,245,242,0.60)', fontSize: 13, fontWeight: index === 0 ? 600 : 400 }}><span style={{ width: 13, height: 13, borderRadius: index === 0 ? 4 : 3, border: `1px solid ${index === 0 ? palette.accent : 'rgba(245,245,242,0.32)'}`, opacity: index === 0 ? 1 : 0.8 }} />{item}</div>)}
            <div style={{ margin: '26px 10px 13px', color: 'rgba(245,245,242,0.37)', fontSize: 10, letterSpacing: '0.12em', fontWeight: 600 }}>YOUR SPACE</div>
            <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 12, color: 'rgba(245,245,242,0.58)' }}><span style={{ width: 7, height: 7, borderRadius: 7, background: palette.secondary }} />Product</div>
            <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 12, color: 'rgba(245,245,242,0.58)' }}><span style={{ width: 7, height: 7, borderRadius: 7, background: '#d994b7' }} />Design</div>
          </div>
          <div style={{ flex: 1, position: 'relative', padding: '25px 25px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em' }}>Team week</div><div style={{ marginTop: 5, fontSize: 12, color: 'rgba(245,245,242,0.48)' }}>October 14 – 18</div></div>
              <div style={{ display: 'flex', gap: 8 }}><div style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(245,245,242,0.13)', fontSize: 11, color: 'rgba(245,245,242,0.72)' }}>Today</div><div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(245,245,242,0.07)', fontSize: 11, color: 'rgba(245,245,242,0.72)' }}>Week⌄</div></div>
            </div>
            <div style={{ position: 'relative', height: 495, marginTop: 8 }}>
              <div style={{ position: 'absolute', top: 4, left: 53, right: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', textAlign: 'center', color: 'rgba(245,245,242,0.53)', fontSize: 11 }}>
                {['MON 14', 'TUE 15', 'WED 16', 'THU 17', 'FRI 18'].map((day, i) => <div key={day} style={{ paddingBottom: 13, color: i === 2 ? palette.accent : undefined, fontWeight: i === 2 ? 600 : 400 }}>{day}</div>)}
              </div>
              <div style={{ position: 'absolute', top: 35, bottom: 0, left: 53, right: 0, borderTop: '1px solid rgba(245,245,242,0.09)', backgroundImage: 'linear-gradient(to right, rgba(245,245,242,0.08) 1px, transparent 1px), repeating-linear-gradient(to bottom, transparent 0, transparent 82px, rgba(245,245,242,0.08) 83px, transparent 84px)', backgroundSize: '20% 100%, 100% 84px' }} />
              <div style={{ position: 'absolute', top: 48, left: 0, display: 'flex', flexDirection: 'column', gap: 62, fontSize: 10, color: 'rgba(245,245,242,0.37)' }}><span>9 AM</span><span>11 AM</span><span>1 PM</span><span>3 PM</span><span>5 PM</span></div>
              <CalendarCard left='4%' top={64} title='Team sync' detail='9:30 · 30 min' blue />
              <CalendarCard left='23%' top={156} title='Design review' detail='11:00 · Studio' />
              <CalendarCard left='43%' top={91} title='Focus time' detail='10:00 · 90 min' focused focusMix={focusMix} />
              <CalendarCard left='63%' top={244} title='Project check-in' detail='1:30 · Product' blue />
              <CalendarCard left='82%' top={127} title='Plan next week' detail='10:30 · Team' />
              <CalendarCard left='23%' top={337} title='Writing block' detail='3:00 · 60 min' focused focusMix={focusMix * 0.75} />
              <CalendarCard left='63%' top={91} title='One to one' detail='10:00 · Alex' />
              <div style={{ position: 'absolute', left: '42%', top: 79, width: 147, height: 26, borderRadius: 7, border: '1px dashed rgba(184,243,107,0.55)', opacity: collaboration * 0.9 }} />
              <div style={{ position: 'absolute', left: '44%', top: 84, fontSize: 10, color: palette.accent, opacity: collaboration }}>JM is planning</div>
            </div>
            <ProgressCard opacity={progressMix} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = spring({ frame: f, fps: 30, durationInFrames: 24, config: { damping: 200 } });
  const opacity = interpolate(f, [0, 9, 22], [0, 1, 1], clamp);
  return (
    <AbsoluteFill style={{ ...font, color: palette.foreground, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity, transform: `translateY(${(1 - reveal) * 22}px) scale(${0.985 + reveal * 0.015})` }}>
        <div style={{ marginBottom: 42 }}><LogoMark size={62} /></div>
        <div style={{ maxWidth: 1350, textAlign: 'center', fontSize: 82, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-0.06em' }}>
          Start your next week<br /><span style={{ color: palette.accent }}>with Relay</span>
        </div>
        <div style={{ width: 78, height: 4, borderRadius: 4, background: palette.secondary, marginTop: 46 }} />
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ ...font, backgroundColor: palette.background, overflow: 'hidden' }}>
      <Backdrop frame={frame} />
      <Sequence from={0} durationInFrames={90}><Opening /></Sequence>
      <Sequence from={90} durationInFrames={180}><FeatureShowcase /></Sequence>
      <Sequence from={270} durationInFrames={90}><Closing /></Sequence>
    </AbsoluteFill>
  );
};