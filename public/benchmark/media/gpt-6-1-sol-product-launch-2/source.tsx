import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from "remotion";
import {palette} from "./contract";

const C = palette;
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const a = (hex: string, opacity: number) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${opacity})`;
const ease = (frame: number, delay = 0) => spring({frame: frame - delay, fps: 30, config: {damping: 22, stiffness: 130, mass: 1}});

const Mark: React.FC<{size?: number; color?: string}> = ({size = 48, color = C.accent}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M12 17H39C46.2 17 52 22.8 52 30C52 37.2 46.2 43 39 43H25" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <path d="M12 31V47M25 31V47" stroke={color} strokeWidth="9" strokeLinecap="round"/>
  </svg>
);

const Lock: React.FC<{size?: number; color?: string}> = ({size = 22, color = C.background}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 10V7A5 5 0 0 1 17 7V10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="10" width="16" height="12" rx="3" stroke={color} strokeWidth="2"/>
    <path d="M12 15V18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Check: React.FC<{size?: number; color?: string}> = ({size = 20, color = C.accent}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const Brand: React.FC = () => (
  <div style={{position: "absolute", left: 112, top: 88, display: "flex", alignItems: "center", gap: 15}}>
    <Mark size={48}/><span style={{fontSize: 32, fontWeight: 650, letterSpacing: -1}}>Relay</span>
  </div>
);

const Background: React.FC = () => (
  <AbsoluteFill style={{background: C.background}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 78% 36%, ${a(C.secondary, 0.075)}, ${a(C.background, 0)} 55%), radial-gradient(ellipse at 16% 83%, ${a(C.accent, 0.035)}, ${a(C.background, 0)} 48%)`}}/>
    <div style={{position: "absolute", top: 0, bottom: 0, left: 1040, width: 1, background: a(C.foreground, 0.035)}}/>
    <div style={{position: "absolute", top: 172, left: 0, right: 0, height: 1, background: a(C.foreground, 0.035)}}/>
  </AbsoluteFill>
);

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const title = ease(f, 4);
  const subtitle = ease(f, 17);
  const art = ease(f, 13);
  const out = interpolate(f, [78, 89], [1, 0], clamp);
  const line = ease(f, 36);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: "absolute", left: 112, top: 88}}><Mark size={56}/></div>
      <div style={{position: "absolute", left: 106, top: 307, fontSize: 184, fontWeight: 700, letterSpacing: -11, lineHeight: 1, opacity: title, transform: `translateY(${(1 - title) * 55}px)`}}>Relay</div>
      <div style={{position: "absolute", left: 112, top: 537, width: 900, fontSize: 66, fontWeight: 450, lineHeight: 1.12, letterSpacing: -2.5, opacity: subtitle, transform: `translateY(${(1 - subtitle) * 32}px)`}}>
        Make room for<br/><span style={{color: C.accent}}>focused work</span>
      </div>
      <div style={{position: "absolute", left: 1112, top: 266, width: 654, height: 552, borderRadius: 30, border: `1px solid ${a(C.foreground, 0.16)}`, background: C.background, boxShadow: `0 32px 90px ${a(C.background, 0.7)}`, overflow: "hidden", opacity: art, transform: `translateY(${(1 - art) * 65}px) rotate(${(1 - art) * 5}deg)`}}>
        <div style={{height: 74, borderBottom: `1px solid ${a(C.foreground, 0.12)}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 9}}>
          {[0, 1, 2].map(i => <div key={i} style={{width: 8, height: 8, borderRadius: 8, background: a(C.muted, 0.55)}}/>)}
          <div style={{marginLeft: "auto", width: 76, height: 8, borderRadius: 8, background: a(C.foreground, 0.12)}}/>
        </div>
        {[0, 1, 2, 3].map(i => <div key={i} style={{position: "absolute", left: 30 + i * 151, top: 99, width: 138, height: 424, borderRadius: 14, background: a(C.foreground, 0.025), border: `1px solid ${a(C.foreground, 0.05)}`}}>
          <div style={{width: 40, height: 7, borderRadius: 8, background: a(C.muted, 0.28), margin: "19px auto"}}/>
        </div>)}
        <div style={{position: "absolute", left: 49, top: 161, width: 241, height: 91, borderRadius: 14, background: a(C.secondary, 0.17), border: `1px solid ${a(C.secondary, 0.4)}`, padding: 22}}>
          <div style={{width: 105, height: 9, borderRadius: 9, background: C.secondary}}/>
          <div style={{width: 65, height: 7, borderRadius: 9, background: a(C.secondary, 0.35), marginTop: 14}}/>
        </div>
        <div style={{position: "absolute", left: 205, top: 288, width: 397 * line, height: 114, borderRadius: 16, background: C.accent, overflow: "hidden", boxShadow: `0 10px 40px ${a(C.accent, 0.1)}`}}>
          <div style={{position: "absolute", left: 24, top: 30}}><Lock size={26}/></div>
          <div style={{position: "absolute", left: 73, top: 32, width: 155, height: 12, borderRadius: 8, background: a(C.background, 0.8)}}/>
          <div style={{position: "absolute", left: 73, top: 57, width: 96, height: 8, borderRadius: 8, background: a(C.background, 0.3)}}/>
        </div>
        <div style={{position: "absolute", left: 48, top: 439, width: 243, height: 49, borderRadius: 12, border: `1px solid ${a(C.foreground, 0.13)}`, display: "flex", alignItems: "center", paddingLeft: 18, gap: 14}}>
          <Check size={19}/><div style={{width: 140, height: 7, background: a(C.foreground, 0.25), borderRadius: 8}}/>
        </div>
      </div>
      <div style={{position: "absolute", left: 113, top: 832, height: 4, width: 102 * subtitle, borderRadius: 4, background: C.accent}}/>
    </AbsoluteFill>
  );
};

const FeatureTitle: React.FC<{index: number; lines: string[]}> = ({index, lines}) => {
  const f = useCurrentFrame();
  const p = ease(f, 2);
  const opacity = interpolate(f, [0, 10, 50, 59], [0, 1, 1, 0], clamp);
  return <div style={{position: "absolute", left: 112, top: 283, width: 405, opacity, transform: `translateY(${(1 - p) * 25}px)`}}>
    <div style={{fontSize: 19, color: C.accent, letterSpacing: 3, marginBottom: 25}}>0{index + 1}</div>
    <div style={{fontSize: 62, fontWeight: 600, lineHeight: 1.06, letterSpacing: -2.8}}>{lines.map((line, i) => <React.Fragment key={line}>{i > 0 && <br/>}{line}</React.Fragment>)}</div>
    <div style={{marginTop: 35, width: 63, height: 4, borderRadius: 4, background: index === 2 ? C.secondary : C.accent}}/>
  </div>;
};

const TaskCard: React.FC<{frame: number; delay: number; top: number; title: string; color: string}> = ({frame, delay, top, title, color}) => {
  const p = ease(frame, delay);
  return <div style={{position: "absolute", left: 13, right: 13, top, height: 104, padding: "19px 18px", boxSizing: "border-box", borderRadius: 13, background: a(color, 0.13), border: `1px solid ${a(color, 0.25)}`, opacity: p, transform: `translateY(${(1 - p) * 28}px)`}}>
    <div style={{display: "flex", gap: 9, alignItems: "center", fontSize: 22, fontWeight: 550, letterSpacing: -0.45}}><div style={{width: 6, height: 6, flexShrink: 0, borderRadius: 6, background: color}}/>{title}</div>
    <div style={{display: "flex", gap: 6, marginTop: 17}}>{[0, 1].map(i => <div key={i} style={{width: 23, height: 23, borderRadius: 30, background: a(color, i === 0 ? 0.35 : 0.14), border: `1px solid ${a(color, 0.3)}`}}/>)}</div>
  </div>;
};

const FocusCard: React.FC<{frame: number; delay: number; top: number}> = ({frame, delay, top}) => {
  const p = ease(frame, delay);
  return <div style={{position: "absolute", left: 13, right: 13, top, height: 138, borderRadius: 13, background: C.accent, color: C.background, padding: "20px 18px", boxSizing: "border-box", transformOrigin: "50% 0%", transform: `scaleY(${Math.max(0, p)})`, opacity: interpolate(frame, [delay, delay + 8], [0, 1], clamp), overflow: "hidden"}}>
    <div style={{display: "flex", alignItems: "center", gap: 10, fontSize: 23, fontWeight: 650, letterSpacing: -0.6}}><Lock size={21}/>Focus time</div>
    <div style={{position: "absolute", left: 19, right: 19, bottom: 23, height: 19, display: "flex", gap: 5}}>{Array.from({length: 19}, (_, i) => <div key={i} style={{flex: 1, borderRadius: 2, background: a(C.background, 0.12)}}/>)}</div>
  </div>;
};

const Cursor: React.FC<{x: number; y: number; name: string; color: string; opacity: number}> = ({x, y, name, color, opacity}) => (
  <div style={{position: "absolute", left: x, top: y, opacity, zIndex: 8}}>
    <svg width="27" height="32" viewBox="0 0 27 32"><path d="M2 2L24 18L14 20L9 29Z" fill={color} stroke={C.background} strokeWidth="2" strokeLinejoin="round"/></svg>
    <div style={{position: "absolute", top: 25, left: 18, borderRadius: 7, padding: "6px 12px", background: color, color: C.background, fontSize: 16, fontWeight: 600}}>{name}</div>
  </div>
);

const Planner: React.FC<{frame: number}> = ({frame}) => {
  const fade = interpolate(frame, [118, 132], [1, 0], clamp);
  const focus = interpolate(frame, [61, 82], [0, 1], clamp);
  const cursorFade = interpolate(frame, [12, 22, 48, 60], [0, 1, 1, 0], clamp);
  const move = interpolate(frame, [20, 47], [0, 1], clamp);
  return <div style={{position: "absolute", inset: 0, opacity: fade, pointerEvents: "none"}}>
    <div style={{position: "absolute", top: 104, left: 34, fontSize: 30, fontWeight: 600, letterSpacing: -1}}>Week plan</div>
    <div style={{position: "absolute", right: 35, top: 112, display: "flex", alignItems: "center", gap: 20}}>
      <span style={{fontSize: 18, color: C.muted}}>Mon – Thu</span>
      <div style={{display: "flex", paddingLeft: 9}}>{["A", "J", "M"].map((letter, i) => <div key={letter} style={{width: 34, height: 34, borderRadius: 34, marginLeft: -9, border: `3px solid ${C.background}`, display: "flex", alignItems: "center", justifyContent: "center", background: i === 1 ? C.secondary : i === 2 ? C.accent : C.muted, color: C.background, fontSize: 13, fontWeight: 700}}>{letter}</div>)}</div>
    </div>
    <div style={{position: "absolute", left: 32, top: 180, right: 32, height: 429, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14}}>
      {["Mon", "Tue", "Wed", "Thu"].map((day, i) => <div key={day} style={{position: "relative", borderRadius: 17, background: a(C.foreground, 0.028), border: `1px solid ${a(C.foreground, 0.085)}`, overflow: "hidden"}}>
        <div style={{height: 53, boxSizing: "border-box", padding: "15px 19px", color: C.muted, fontSize: 18, fontWeight: 500, borderBottom: `1px solid ${a(C.foreground, 0.07)}`}}>{day}</div>
        {[106, 206, 306, 406].map(y => <div key={y} style={{position: "absolute", top: y, left: 0, right: 0, height: 1, background: a(C.foreground, 0.035)}}/>)}
        <div style={{position: "absolute", top: i % 2 === 0 ? 216 : 77, left: 13, right: 13, height: 138, borderRadius: 13, border: `1px dashed ${a(C.muted, 0.19)}`, opacity: 1 - focus}}/>
        <TaskCard frame={frame} delay={10 + i * 7} top={i % 2 === 0 ? 77 : 249} title={["Sprint plan", "Design review", "Project notes", "Team sync"][i]} color={i === 2 ? C.muted : C.secondary}/>
        <FocusCard frame={frame} delay={63 + i * 5} top={i % 2 === 0 ? 216 : 77}/>
      </div>)}
    </div>
    <div style={{position: "absolute", left: 34, right: 34, bottom: 31, height: 62, borderRadius: 14, border: `1px solid ${a(C.foreground, 0.09)}`, background: a(C.foreground, 0.025), display: "flex", alignItems: "center", padding: "0 20px", boxSizing: "border-box"}}>
      <div style={{display: "flex", gap: 8, alignItems: "center", color: C.muted, fontSize: 19}}><div style={{width: 8, height: 8, borderRadius: 8, background: C.accent}}/>Week plan</div>
      <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, color: focus > 0.5 ? C.accent : C.muted, fontSize: 18, opacity: focus}}><Lock size={18} color={C.accent}/>Focus time</div>
    </div>
    <Cursor x={370 + 125 * move} y={259 + 77 * move} name="Alex" color={C.secondary} opacity={cursorFade}/>
    <Cursor x={873 - 68 * move} y={427 - 22 * move} name="Sam" color={C.accent} opacity={cursorFade}/>
  </div>;
};

const Progress: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(frame, [122, 136], [0, 1], clamp);
  const grow = ease(frame, 131);
  const labels = ["Sprint plan", "Design review", "Project notes"];
  return <div style={{position: "absolute", inset: 0, opacity, transform: `translateY(${(1 - grow) * 16}px)`, pointerEvents: "none"}}>
    <div style={{position: "absolute", left: 34, top: 104, fontSize: 30, fontWeight: 600, letterSpacing: -1}}>See progress</div>
    <div style={{position: "absolute", left: 34, right: 34, top: 176, display: "flex", gap: 18}}>
      {labels.map((label, i) => {
        const p = ease(frame, 134 + i * 6);
        const amount = [1, 0.72, 0.48][i];
        return <div key={label} style={{flex: 1, height: 180, borderRadius: 18, border: `1px solid ${a(i === 0 ? C.accent : C.foreground, i === 0 ? 0.3 : 0.11)}`, background: a(i === 0 ? C.accent : C.foreground, i === 0 ? 0.06 : 0.025), padding: 24, boxSizing: "border-box"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", color: i === 0 ? C.accent : C.secondary}}><div style={{fontSize: 15, fontWeight: 550}}>{i === 0 ? "Done" : "In progress"}</div>{i === 0 ? <Check size={21}/> : <div style={{height: 12, width: 12, borderRadius: 12, border: `2px solid ${C.secondary}`}}/>}</div>
          <div style={{fontSize: 26, fontWeight: 550, marginTop: 20, letterSpacing: -0.7}}>{label}</div>
          <div style={{marginTop: 25, height: 7, borderRadius: 8, background: a(C.foreground, 0.1), overflow: "hidden"}}><div style={{height: "100%", width: `${p * amount * 100}%`, borderRadius: 8, background: i === 0 ? C.accent : C.secondary}}/></div>
        </div>;
      })}
    </div>
    <div style={{position: "absolute", left: 34, right: 34, top: 389, height: 274, borderRadius: 18, border: `1px solid ${a(C.foreground, 0.1)}`, overflow: "hidden"}}>
      {["Sprint plan", "Design review", "Project notes", "Team sync"].map((label, i) => {
        const p = ease(frame, 137 + i * 7);
        const checked = i < 2;
        return <div key={label} style={{height: 68.5, boxSizing: "border-box", borderBottom: i < 3 ? `1px solid ${a(C.foreground, 0.075)}` : undefined, display: "flex", alignItems: "center", padding: "0 25px", gap: 18}}>
          <div style={{width: 25, height: 25, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${a(checked ? C.accent : C.muted, checked ? 0.5 : 0.3)}`, background: checked ? a(C.accent, 0.12 * p) : "transparent"}}>{checked && <div style={{opacity: p, transform: `scale(${p})`}}><Check size={17}/></div>}</div>
          <span style={{fontSize: 22, color: checked ? C.foreground : C.muted}}>{label}</span>
          <div style={{marginLeft: "auto", width: 203, height: 5, borderRadius: 5, background: a(C.foreground, 0.08), overflow: "hidden"}}><div style={{width: `${p * [100, 78, 48, 30][i]}%`, height: "100%", borderRadius: 5, background: checked ? C.accent : C.secondary}}/></div>
          <div style={{width: 83, marginLeft: 21, fontSize: 15, color: checked ? C.accent : C.muted}}>{checked ? "Done" : "In progress"}</div>
        </div>;
      })}
    </div>
  </div>;
};

const Demo: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ease(f);
  const opacity = interpolate(f, [0, 10, 168, 179], [0, 1, 1, 0], clamp);
  const active = Math.min(2, Math.floor(f / 60));
  return <AbsoluteFill style={{opacity}}>
    <Brand/>
    <Sequence from={0} durationInFrames={60}><FeatureTitle index={0} lines={["Plan", "together"]}/></Sequence>
    <Sequence from={60} durationInFrames={60}><FeatureTitle index={1} lines={["Protect", "focus time"]}/></Sequence>
    <Sequence from={120} durationInFrames={60}><FeatureTitle index={2} lines={["See", "progress"]}/></Sequence>
    <div style={{position: "absolute", left: 112, top: 698, width: 352}}>
      {["Plan together", "Protect focus time", "See progress"].map((label, i) => <div key={label} style={{height: 54, display: "flex", alignItems: "center", gap: 16, color: active === i ? C.foreground : a(C.muted, 0.5), fontSize: 21, fontWeight: active === i ? 550 : 400}}>
        <div style={{width: 20, height: 3, borderRadius: 3, background: active === i ? C.accent : a(C.muted, 0.2)}}/>{label}
      </div>)}
    </div>
    <div style={{position: "absolute", left: 550, top: 179, width: 1256, height: 744, borderRadius: 25, overflow: "hidden", background: C.background, border: `1px solid ${a(C.foreground, 0.17)}`, boxShadow: `0 28px 95px ${a(C.background, 0.8)}`, transform: `translateY(${(1 - enter) * 32}px)`}}>
      <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 77, borderBottom: `1px solid ${a(C.foreground, 0.1)}`, display: "flex", alignItems: "center", padding: "0 29px", boxSizing: "border-box", gap: 12, background: a(C.foreground, 0.025)}}>
        <Mark size={31}/><span style={{fontSize: 24, fontWeight: 650, letterSpacing: -0.8}}>Relay</span>
        <div style={{marginLeft: "auto", display: "flex", gap: 8, fontSize: 16}}>
          {["Week plan", "Progress"].map((label, i) => <div key={label} style={{padding: "10px 17px", borderRadius: 8, color: (active === 2 ? i === 1 : i === 0) ? C.accent : C.muted, background: (active === 2 ? i === 1 : i === 0) ? a(C.accent, 0.1) : "transparent"}}>{label}</div>)}
        </div>
      </div>
      <Planner frame={f}/><Progress frame={f}/>
    </div>
  </AbsoluteFill>;
};

const Ending: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f, 1);
  const opacity = interpolate(f, [0, 13], [0, 1], clamp);
  return <AbsoluteFill style={{opacity}}>
    <div style={{position: "absolute", left: 190, top: 280, width: 1540, height: 548, borderRadius: 70, background: `radial-gradient(ellipse at center, ${a(C.accent, 0.055)}, ${a(C.background, 0)} 68%)`}}/>
    <div style={{position: "absolute", left: 916, top: 261, transform: `translateY(${(1 - p) * 15}px)`}}><Mark size={88}/></div>
    <div style={{position: "absolute", top: 409, left: 120, right: 120, textAlign: "center", fontSize: 102, fontWeight: 600, lineHeight: 1.12, letterSpacing: -4.2, transform: `translateY(${(1 - p) * 27}px)`}}>
      Start your next week<br/>with <span style={{color: C.accent}}>Relay</span>
    </div>
    <div style={{position: "absolute", left: 900, top: 715, width: 120, height: 5, borderRadius: 5, background: C.accent, transform: `scaleX(${p})`}}/>
    <div style={{position: "absolute", left: 234, top: 346, width: 88, height: 1, background: a(C.muted, 0.16)}}/>
    <div style={{position: "absolute", right: 234, top: 746, width: 88, height: 1, background: a(C.muted, 0.16)}}/>
  </AbsoluteFill>;
};

export const BenchmarkVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{fontFamily: "Archivo", color: C.foreground, overflow: "hidden", WebkitFontSmoothing: "antialiased"}}>
    <Background/>
    <Sequence from={0} durationInFrames={90}><Intro/></Sequence>
    <Sequence from={90} durationInFrames={180}><Demo/></Sequence>
    <Sequence from={270} durationInFrames={90}><Ending/></Sequence>
    <div style={{position: "absolute", left: 112, right: 112, top: 988, height: 2, borderRadius: 2, background: a(C.foreground, 0.1)}}><div style={{width: `${interpolate(frame, [0, 359], [0, 100], clamp)}%`, height: "100%", background: a(C.accent, 0.6), borderRadius: 2}}/></div>
  </AbsoluteFill>;
};