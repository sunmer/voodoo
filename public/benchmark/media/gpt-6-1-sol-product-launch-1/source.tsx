import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from "remotion";
import {palette} from "./contract";

const C = palette;
const a = (hex: string, opacity: number) => {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${opacity})`;
};
const ramp = (frame: number, start: number, end: number) => interpolate(frame, [start, end], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const ease = (frame: number, delay = 0) => spring({frame: Math.max(0, frame - delay), fps: 30, config: {damping: 22, stiffness: 145, mass: 0.9}});

const Mark: React.FC<{size?: number; color?: string}> = ({size = 48, color = C.accent}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M14 39V23C14 17 17 14 23 14H40" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 25V41C50 47 47 50 41 50H24" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 39L39 25" stroke={color} strokeWidth="10" strokeLinecap="round" />
  </svg>
);

const Check: React.FC<{size?: number; color?: string}> = ({size = 24, color = C.background}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: C.background}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 83% 27%, ${a(C.secondary, 0.075)}, transparent 48%), radial-gradient(ellipse at 25% 94%, ${a(C.accent, 0.045)}, transparent 44%)`}} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} style={{position: "absolute", left: 120 + i * 186, top: 0, height: 1080, width: 1, background: a(C.foreground, 0.025)}} />)}
    <div style={{position: "absolute", left: 120, right: 120, top: 161, height: 1, background: a(C.foreground, 0.1)}} />
  </AbsoluteFill>
);

const Header: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{position: "absolute", left: 120, right: 120, top: 80, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20}}>
    <div style={{display: "flex", alignItems: "center", gap: 16}}><Mark size={46} /><span style={{fontSize: 34, fontWeight: 650, letterSpacing: -1.2}}>Relay</span></div>
    <div style={{display: "flex", gap: 9, alignItems: "center"}}>
      {[0, 1, 2].map(i => <div key={i} style={{width: 62, height: 4, borderRadius: 4, overflow: "hidden", background: a(C.foreground, 0.12)}}><div style={{height: "100%", width: `${ramp(f, i * 120, (i + 1) * 120 - 1) * 100}%`, background: C.accent}} /></div>)}
    </div>
  </div>;
};

const IntroArt: React.FC<{frame: number}> = ({frame}) => {
  const p = ease(frame, 6);
  const tile = ease(frame, 18);
  return <div style={{position: "absolute", left: 1090, top: 249, width: 660, height: 650, opacity: p, transform: `translateY(${(1 - p) * 65}px) rotate(-6deg)`}}>
    <div style={{position: "absolute", left: 21, top: 74, width: 615, height: 467, borderRadius: 28, background: C.background, border: `1px solid ${a(C.foreground, 0.18)}`, boxShadow: `0 32px 80px ${a(C.background, 0.65)}`, overflow: "hidden"}}>
      <div style={{height: 74, borderBottom: `1px solid ${a(C.foreground, 0.13)}`, display: "flex"}}>
        {["M", "T", "W", "T", "F"].map((d, i) => <div key={i} style={{width: 123, textAlign: "center", paddingTop: 25, color: C.muted, fontSize: 24, fontWeight: 500}}>{d}</div>)}
      </div>
      {[1, 2, 3, 4].map(i => <div key={i} style={{position: "absolute", top: 74, bottom: 0, left: i * 123, width: 1, background: a(C.foreground, 0.09)}} />)}
      {[0, 1, 2].map(i => <div key={i} style={{position: "absolute", top: 170 + i * 111, left: 0, right: 0, height: 1, background: a(C.foreground, 0.07)}} />)}
      <div style={{position: "absolute", left: 15, top: 288, width: 94, height: 128, background: a(C.secondary, 0.18), border: `1px solid ${a(C.secondary, 0.4)}`, borderRadius: 15}}><div style={{margin: 18, width: 36, height: 5, borderRadius: 5, background: C.secondary}} /></div>
      <div style={{position: "absolute", left: 508, top: 99, width: 91, height: 137, background: a(C.accent, 0.13), border: `1px solid ${a(C.accent, 0.35)}`, borderRadius: 15}}><div style={{margin: 18, width: 36, height: 5, borderRadius: 5, background: C.accent}} /></div>
      <div style={{position: "absolute", left: 145, top: 169, width: 323, height: 183, borderRadius: 22, background: C.accent, transform: `translateY(${(1 - tile) * 55}px) scale(${0.86 + tile * 0.14})`, boxShadow: `0 16px 40px ${a(C.background, 0.3)}`, display: "flex", alignItems: "center", justifyContent: "center"}}><Mark size={89} color={C.background} /></div>
    </div>
    <div style={{position: "absolute", left: 48, top: 16, width: 202, height: 86, background: C.background, border: `1px solid ${a(C.foreground, 0.19)}`, borderRadius: 21, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${(1 - ease(frame, 26)) * -38}px)`, opacity: ease(frame, 26)}}>
      {["A", "J", "M"].map((v, i) => <div key={v} style={{width: 47, height: 47, marginLeft: i === 0 ? 0 : -6, borderRadius: 50, border: `3px solid ${C.background}`, background: i === 1 ? C.secondary : i === 2 ? C.foreground : C.accent, color: C.background, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700}}>{v}</div>)}
    </div>
    <div style={{position: "absolute", left: 221, top: 515, width: 374, height: 93, borderRadius: 20, background: C.background, border: `1px solid ${a(C.foreground, 0.19)}`, display: "flex", alignItems: "center", gap: 22, padding: "0 25px", boxSizing: "border-box", opacity: ease(frame, 30), transform: `translateY(${(1 - ease(frame, 30)) * 35}px)`}}>
      <div style={{width: 39, height: 39, borderRadius: 50, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center"}}><Check /></div>
      <div style={{height: 8, width: 224, borderRadius: 6, background: a(C.foreground, 0.13)}}><div style={{width: `${tile * 76}%`, height: "100%", background: C.accent, borderRadius: 6}} /></div>
    </div>
  </div>;
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const exit = ramp(f, 78, 89);
  const p = ease(f, 2);
  const q = ease(f, 12);
  return <AbsoluteFill style={{opacity: 1 - exit, transform: `translateY(${-exit * 22}px)`}}>
    <div style={{position: "absolute", left: 120, top: 286, opacity: p, transform: `translateY(${(1 - p) * 35}px)`}}>
      <div style={{fontSize: 190, lineHeight: 1, fontWeight: 650, letterSpacing: -11}}>Relay<span style={{color: C.accent}}>.</span></div>
    </div>
    <div style={{position: "absolute", left: 129, top: 524, fontSize: 66, lineHeight: 1.14, fontWeight: 450, letterSpacing: -2.6, opacity: q, transform: `translateY(${(1 - q) * 32}px)`}}>
      Make room for<br /><span style={{position: "relative"}}>focused work<span style={{position: "absolute", left: 0, bottom: -20, width: `${ramp(f, 28, 49) * 100}%`, height: 5, borderRadius: 5, background: C.accent}} /></span>
    </div>
    <IntroArt frame={f} />
  </AbsoluteFill>;
};

const FeatureGlyph: React.FC<{index: number}> = ({index}) => <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
  {index === 0 ? <><rect x="10" y="18" width="68" height="58" rx="12" stroke={C.accent} strokeWidth="2" /><path d="M10 37H78M29 12V24M59 12V24" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />{[0, 1, 2].map(i => <rect key={i} x={23 + i * 17} y="49" width="9" height="9" rx="2" fill={i === 1 ? C.accent : a(C.accent, 0.25)} />)}</> : index === 1 ? <><circle cx="44" cy="44" r="32" stroke={a(C.accent, 0.4)} strokeWidth="2" /><path d="M44 12A32 32 0 0 1 76 44" stroke={C.accent} strokeWidth="4" strokeLinecap="round" /><path d="M44 27V45L55 52" stroke={C.accent} strokeWidth="3" strokeLinecap="round" /><circle cx="44" cy="44" r="4" fill={C.accent} /></> : <><path d="M12 74H78" stroke={a(C.accent, 0.4)} strokeWidth="2" /><rect x="17" y="48" width="12" height="20" rx="4" fill={a(C.accent, 0.35)} /><rect x="38" y="32" width="12" height="36" rx="4" fill={a(C.accent, 0.65)} /><rect x="59" y="14" width="12" height="54" rx="4" fill={C.accent} /></>}
</svg>;

const FeatureTitle: React.FC<{index: number}> = ({index}) => {
  const f = useCurrentFrame();
  const p = ease(f);
  const out = ramp(f, 52, 59);
  const lines = [["Plan", "together"], ["Protect", "focus time"], ["See", "progress"]][index];
  return <div style={{position: "absolute", left: 120, top: 292, width: 455, opacity: p * (1 - out), transform: `translateY(${(1 - p) * 28 - out * 16}px)`}}>
    <div style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 37}}><div style={{width: 39, height: 2, background: C.accent}} /><span style={{fontSize: 23, fontWeight: 500, color: C.accent, letterSpacing: 2}}>0{index + 1}</span><span style={{fontSize: 23, color: a(C.muted, 0.6)}}>/ 03</span></div>
    <div style={{fontSize: 82, lineHeight: 1.035, fontWeight: 550, letterSpacing: -4.6}}>{lines[0]}<br />{lines[1]}</div>
    <div style={{marginTop: 58}}><FeatureGlyph index={index} /></div>
  </div>;
};

const Avatar: React.FC<{letter: string; color: string; size?: number}> = ({letter, color, size = 32}) => <div style={{width: size, height: size, borderRadius: "50%", background: a(color, 0.2), color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 650, flexShrink: 0}}>{letter}</div>;

const TaskCard: React.FC<{x: number; y: number; title: string; time: string; color: string; person: string; height?: number; opacity?: number}> = ({x, y, title, time, color, person, height = 106, opacity = 1}) => <div style={{position: "absolute", left: x, top: y, width: 207, height, boxSizing: "border-box", padding: "15px 15px 12px 18px", borderRadius: 13, background: a(color, 0.12), border: `1px solid ${a(color, 0.3)}`, overflow: "hidden", opacity}}>
  <div style={{position: "absolute", left: 0, top: 16, bottom: 16, width: 3, background: color, borderRadius: 3}} />
  <div style={{fontSize: 21, fontWeight: 550, letterSpacing: -0.5, color: C.foreground, whiteSpace: "nowrap"}}>{title}</div>
  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14}}><span style={{fontSize: 17, color: C.muted}}>{time}</span><Avatar letter={person} color={color} size={28} /></div>
</div>;

const Calendar: React.FC<{frame: number}> = ({frame}) => {
  const focus = ease(frame, 63);
  const show = 1 - ramp(frame, 119, 132);
  return <div style={{position: "absolute", inset: 0, opacity: show, transform: `translateY(${-ramp(frame, 119, 132) * 15}px)`}}>
    {["Mon", "Tue", "Wed", "Thu"].map((day, i) => <React.Fragment key={day}>
      <div style={{position: "absolute", left: 232 + i * 235, top: 108, width: 235, textAlign: "center", fontSize: 20, color: C.muted}}>{day}<span style={{display: "inline-flex", marginLeft: 11, width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", color: i === 1 ? C.background : C.foreground, background: i === 1 ? C.accent : "transparent", fontWeight: 650}}>{19 + i}</span></div>
      <div style={{position: "absolute", left: 232 + i * 235, top: 162, bottom: 29, width: 1, background: a(C.foreground, 0.09)}} />
    </React.Fragment>)}
    {["09:00", "11:00", "13:00", "15:00"].map((time, i) => <React.Fragment key={time}><span style={{position: "absolute", left: 180, top: 179 + i * 126, fontSize: 14, color: a(C.muted, 0.65)}}>{time}</span><div style={{position: "absolute", left: 232, right: 25, top: 185 + i * 126, height: 1, background: a(C.foreground, 0.08)}} /></React.Fragment>)}
    <TaskCard x={246} y={196} title="Sprint plan" time="09:00–10:00" color={C.accent} person="A" opacity={1 - focus * 0.2} />
    <TaskCard x={246} y={432} title="Design review" time="13:00–14:00" color={C.foreground} person="J" opacity={1 - focus * 0.25} />
    <TaskCard x={481} y={323 + focus * 194} title="Build" time={focus > 0.5 ? "14:00–15:00" : "11:00–12:00"} color={C.secondary} person="M" height={101} />
    <TaskCard x={716} y={323 + focus * 194} title="Write brief" time={focus > 0.5 ? "14:00–15:00" : "11:00–12:00"} color={C.secondary} person="A" height={101} />
    <TaskCard x={951} y={196} title="Team sync" time="09:00–10:00" color={C.foreground} person="J" opacity={1 - focus * 0.25} />
    <TaskCard x={951} y={463} title="Research" time="13:00–14:00" color={C.accent} person="M" opacity={1 - focus * 0.2} />
    {[0, 1].map(i => <div key={i} style={{position: "absolute", left: 481 + i * 235, top: 314, width: 207, height: 182, boxSizing: "border-box", borderRadius: 14, padding: "23px 18px", border: `1px solid ${a(C.accent, 0.6)}`, background: `repeating-linear-gradient(135deg, ${a(C.accent, 0.025)} 0px, ${a(C.accent, 0.025)} 6px, ${a(C.accent, 0.085)} 6px, ${a(C.accent, 0.085)} 8px), ${C.background}`, opacity: focus, transform: `scale(${0.94 + focus * 0.06})`}}>
      <svg width="27" height="27" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke={C.accent} strokeWidth="2" /><path d="M14 7V14L19 17" stroke={C.accent} strokeWidth="2" strokeLinecap="round" /></svg>
      <div style={{fontSize: 25, color: C.accent, fontWeight: 550, marginTop: 16, letterSpacing: -0.7}}>Focus time</div><div style={{fontSize: 17, color: C.muted, marginTop: 9}}>11:00–13:00</div>
    </div>)}
  </div>;
};

const Progress: React.FC<{frame: number}> = ({frame}) => {
  const p = ease(frame, 126);
  const growth = ease(frame, 136);
  return <div style={{position: "absolute", left: 208, top: 108, width: 952, opacity: p, transform: `translateY(${(1 - p) * 28}px)`}}>
    <div style={{fontSize: 29, fontWeight: 550, letterSpacing: -0.8, marginBottom: 25}}>This week</div>
    <div style={{display: "flex", gap: 18}}>
      {[{name: "Design", progress: 100, color: C.accent}, {name: "Build", progress: 75, color: C.secondary}, {name: "Launch", progress: 50, color: C.foreground}].map(item => <div key={item.name} style={{width: 305, height: 150, boxSizing: "border-box", border: `1px solid ${a(C.foreground, 0.12)}`, borderRadius: 17, background: a(C.foreground, 0.025), padding: 21}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}><span style={{fontSize: 22, color: C.muted}}>{item.name}</span><div style={{width: 7, height: 7, borderRadius: 10, background: item.color}} /></div>
        <div style={{fontSize: 38, letterSpacing: -1.8, marginTop: 14, fontWeight: 550}}>{Math.round(item.progress * Math.min(1, growth))}<span style={{fontSize: 23, color: C.muted, marginLeft: 3}}>%</span></div>
        <div style={{marginTop: 12, height: 5, background: a(C.foreground, 0.09), borderRadius: 4, overflow: "hidden"}}><div style={{width: `${item.progress * growth}%`, height: "100%", background: item.color, borderRadius: 4}} /></div>
      </div>)}
    </div>
    <div style={{marginTop: 24, height: 300, boxSizing: "border-box", border: `1px solid ${a(C.foreground, 0.12)}`, borderRadius: 18, padding: "23px 25px", background: a(C.foreground, 0.018)}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15}}><span style={{fontSize: 23, fontWeight: 550}}>Tasks</span><span style={{fontSize: 17, color: C.muted}}>Status</span></div>
      {[{name: "Sprint plan", owner: "A", done: true}, {name: "Design review", owner: "J", done: true}, {name: "Build", owner: "M", done: false}].map((item, i) => {
        const q = ease(frame, 139 + i * 5);
        return <div key={item.name} style={{height: 65, borderTop: `1px solid ${a(C.foreground, 0.085)}`, display: "flex", alignItems: "center", gap: 17, opacity: q, transform: `translateX(${(1 - q) * 18}px)`}}>
          <div style={{width: 26, height: 26, borderRadius: 8, border: `1px solid ${item.done ? C.accent : a(C.secondary, 0.7)}`, background: item.done ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center"}}>{item.done ? <Check size={18} /> : <div style={{width: 7, height: 7, background: C.secondary, borderRadius: 5}} />}</div>
          <span style={{fontSize: 22, flex: 1}}>{item.name}</span><Avatar letter={item.owner} color={item.done ? C.accent : C.secondary} size={30} />
          <div style={{width: 126, textAlign: "center", marginLeft: 20, padding: "7px 0", borderRadius: 8, background: a(item.done ? C.accent : C.secondary, 0.1), color: item.done ? C.accent : C.secondary, fontSize: 17}}>{item.done ? "Done" : "In progress"}</div>
        </div>;
      })}
    </div>
  </div>;
};

const Product: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f);
  const out = ramp(f, 171, 179);
  const progress = f >= 125;
  return <AbsoluteFill>
    {[0, 1, 2].map(i => <Sequence key={i} from={i * 60} durationInFrames={60} layout="none"><FeatureTitle index={i} /></Sequence>)}
    <div style={{position: "absolute", left: 595, top: 239, width: 1205, height: 699, borderRadius: 25, background: C.background, border: `1px solid ${a(C.foreground, 0.18)}`, boxShadow: `0 32px 85px ${a(C.background, 0.7)}`, overflow: "hidden", opacity: p * (1 - out), transform: `translateY(${(1 - p) * 54 - out * 16}px) scale(${0.975 + p * 0.025})`}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 81, borderBottom: `1px solid ${a(C.foreground, 0.12)}`, background: a(C.foreground, 0.025), display: "flex", alignItems: "center", padding: "0 25px", boxSizing: "border-box"}}>
        <Mark size={32} /><span style={{fontSize: 23, fontWeight: 600, letterSpacing: -0.8, marginLeft: 11}}>Relay</span>
        <span style={{marginLeft: 62, fontSize: 23, fontWeight: 500, letterSpacing: -0.4}}>{progress ? "Progress" : "Week of May 19"}</span>
        <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, background: a(C.foreground, 0.05), borderRadius: 10, padding: 5}}>
          {["Calendar", "Progress"].map((v, i) => <div key={v} style={{fontSize: 16, padding: "9px 15px", borderRadius: 7, background: (i === 1) === progress ? a(C.foreground, 0.11) : "transparent", color: (i === 1) === progress ? C.foreground : C.muted}}>{v}</div>)}
        </div>
        <div style={{display: "flex", gap: 6, marginLeft: 24}}>{["A", "J", "M"].map((letter, i) => <Avatar key={letter} letter={letter} color={i === 1 ? C.secondary : i === 2 ? C.foreground : C.accent} size={32} />)}</div>
      </div>
      <div style={{position: "absolute", left: 0, top: 82, bottom: 0, width: 167, borderRight: `1px solid ${a(C.foreground, 0.1)}`, background: a(C.foreground, 0.015)}}>
        <div style={{fontSize: 12, letterSpacing: 1.7, color: C.muted, margin: "32px 19px 22px"}}>WORKSPACE</div>
        {["Week plan", "Team", "Projects"].map((label, i) => <div key={label} style={{margin: "9px 12px", padding: "13px 12px", borderRadius: 9, background: i === 0 ? a(C.accent, 0.1) : "transparent", color: i === 0 ? C.accent : C.muted, fontSize: 18, fontWeight: i === 0 ? 550 : 400, display: "flex", alignItems: "center", gap: 11}}><div style={{width: 7, height: 7, borderRadius: i === 1 ? 7 : 2, background: i === 0 ? C.accent : a(C.muted, 0.5)}} />{label}</div>)}
        <div style={{position: "absolute", bottom: 24, left: 20, display: "flex", alignItems: "center", gap: 11}}><Avatar letter="A" color={C.accent} size={29} /><span style={{fontSize: 17, color: C.muted}}>Alex</span></div>
      </div>
      <Calendar frame={f} /><Progress frame={f} />
      <div style={{position: "absolute", bottom: 0, left: 168, right: 0, height: 28, borderTop: `1px solid ${a(C.foreground, 0.07)}`, background: a(C.foreground, 0.015)}} />
    </div>
  </AbsoluteFill>;
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 0, 12);
  const y = (1 - ramp(f, 0, 15)) * 27;
  const mark = ease(f);
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 860, top: 229, width: 200, height: 141, display: "flex", justifyContent: "center", alignItems: "center", opacity: mark, transform: `scale(${0.85 + mark * 0.15})`}}><Mark size={112} /></div>
    <div style={{position: "absolute", left: 200, right: 200, top: 410, textAlign: "center", opacity: p, transform: `translateY(${y}px)`, fontSize: 110, lineHeight: 1.13, fontWeight: 550, letterSpacing: -5.5}}>
      Start your next week<br />with <span style={{color: C.accent}}>Relay</span>
    </div>
    <div style={{position: "absolute", left: 760, top: 721, width: 400, height: 5, borderRadius: 6, overflow: "hidden", background: a(C.accent, 0.12), opacity: p}}><div style={{height: "100%", background: C.accent, width: `${ramp(f, 10, 24) * 100}%`}} /></div>
    <div style={{position: "absolute", left: 585, top: 846, width: 750, height: 74, display: "flex", gap: 15, opacity: ramp(f, 7, 20)}}>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{flex: 1, borderTop: `1px solid ${a(C.foreground, 0.16)}`, paddingTop: 16}}><div style={{height: 9, width: [65, 100, 83, 113, 75][i], borderRadius: 3, background: i === 2 ? C.accent : a(i % 2 ? C.secondary : C.foreground, 0.17), transform: `scaleX(${ease(f, 12 + i * 2)})`, transformOrigin: "left"}} /></div>)}
    </div>
  </AbsoluteFill>;
};

export const BenchmarkVideo: React.FC = () => {
  return <AbsoluteFill style={{fontFamily: "Archivo", color: C.foreground, background: C.background, overflow: "hidden"}}>
    <Backdrop />
    <Sequence from={0} durationInFrames={90} layout="none"><Intro /></Sequence>
    <Sequence from={90} durationInFrames={180} layout="none"><Product /></Sequence>
    <Sequence from={270} durationInFrames={90} layout="none"><Outro /></Sequence>
    <Header />
  </AbsoluteFill>;
};