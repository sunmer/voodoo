import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame } from "remotion";
import { palette } from "./contract";

const C = palette as unknown as {
  background: string;
  foreground: string;
  accent: string;
  secondary: string;
  muted: string;
};
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const text: React.CSSProperties = { fontFamily: "Archivo", color: C.foreground, margin: 0 };

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.background, backgroundImage: `radial-gradient(ellipse at 78% 45%, ${C.secondary}19, transparent 38%), radial-gradient(ellipse at 16% 88%, ${C.accent}13, transparent 36%), linear-gradient(rgba(245,245,242,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,242,.025) 1px, transparent 1px)`, backgroundSize: "auto, auto, 72px 72px, 72px 72px" }} />
);

const Mark: React.FC<{ size?: number }> = ({ size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.27, background: C.accent, display: "flex", flexDirection: "column", justifyContent: "center", gap: size * 0.1, padding: size * 0.22, boxSizing: "border-box", flexShrink: 0 }}>
    <div style={{ height: Math.max(2, size * 0.08), width: "100%", borderRadius: 8, background: C.background }} />
    <div style={{ height: Math.max(2, size * 0.08), width: "68%", borderRadius: 8, background: C.background }} />
  </div>
);

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 8, 82, 96], [0, 1, 1, 0], clamp);
  const enter = spring({ frame: Math.max(0, f - 5), fps: 30, config: { damping: 21, stiffness: 95 } });
  const artEnter = spring({ frame: Math.max(0, f - 10), fps: 30, config: { damping: 20, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", left: 150, top: 105, display: "flex", alignItems: "center", gap: 14 }}><Mark size={43} /><span style={{ ...text, fontSize: 30, fontWeight: 700 }}>Relay</span></div>
      <div style={{ position: "absolute", left: 150, top: 350, width: 820, opacity: enter, transform: `translateY(${(1 - enter) * 28}px)` }}>
        <h1 style={{ ...text, fontSize: 82, lineHeight: 1.08, letterSpacing: -4, fontWeight: 680 }}>Make room for<br />focused work</h1>
        <div style={{ width: 124, height: 5, background: C.accent, borderRadius: 6, marginTop: 36, transform: `scaleX(${interpolate(f, [15, 34], [0.1, 1], clamp)})`, transformOrigin: "left" }} />
      </div>
      <div style={{ position: "absolute", top: 205, right: 168, width: 650, height: 640, opacity: artEnter, transform: `translateY(${(1 - artEnter) * 38}px) rotate(${interpolate(f, [0, 90], [1.3, 0], clamp)}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "rgba(24,26,30,.95)", border: "1px solid rgba(245,245,242,.14)", padding: 29, boxSizing: "border-box", boxShadow: "0 34px 100px rgba(0,0,0,.35)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}><span style={{ ...text, fontWeight: 650, fontSize: 21 }}>Your week</span><span style={{ color: C.muted, fontFamily: "Archivo", fontSize: 13 }}>MAY 12 – 16</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 9, marginBottom: 15 }}>
            {["MON", "TUE", "WED", "THU", "FRI"].map((day, i) => <div key={day} style={{ textAlign: "center", borderRadius: 11, background: i === 1 ? `${C.accent}19` : "rgba(245,245,242,.035)", padding: "11px 0" }}><div style={{ color: i === 1 ? C.accent : C.muted, fontFamily: "Archivo", fontSize: 11, fontWeight: 650 }}>{day}</div><div style={{ ...text, fontSize: 18, fontWeight: 600, marginTop: 7 }}>{12 + i}</div></div>)}
          </div>
          <div style={{ display: "grid", gap: 11 }}>
            {[["10:00", "Design review", C.secondary], ["11:30", "Focus block", C.accent], ["14:00", "Team sync", C.secondary], ["15:30", "Weekly review", C.accent]].map(([time, title, color], i) => <div key={title as string} style={{ height: 78, borderRadius: 14, border: "1px solid rgba(245,245,242,.08)", background: "rgba(245,245,242,.025)", display: "flex", alignItems: "center", padding: "0 17px", gap: 16 }}><span style={{ color: C.muted, fontFamily: "Archivo", fontSize: 13, width: 48 }}>{time}</span><div style={{ height: 47, width: ["78%", "91%", "66%", "83%"][i], maxWidth: 350, borderRadius: 10, background: `${color}20`, borderLeft: `3px solid ${color}`, display: "flex", alignItems: "center", paddingLeft: 14, boxSizing: "border-box" }}><span style={{ ...text, fontSize: 16, fontWeight: 600 }}>{title}</span></div><div style={{ display: "flex", marginLeft: "auto" }}><div style={{ width: 23, height: 23, borderRadius: 99, background: C.accent, border: "2px solid #181a1e" }} /><div style={{ width: 23, height: 23, borderRadius: 99, background: C.secondary, border: "2px solid #181a1e", marginLeft: -7 }} /></div></div>)}
          </div>
        </div>
        <div style={{ position: "absolute", right: -25, bottom: 45, width: 115, height: 115, borderRadius: 27, background: C.accent, color: C.background, display: "grid", placeItems: "center", boxShadow: "0 18px 50px rgba(184,243,107,.18)", transform: "rotate(5deg)" }}><div style={{ textAlign: "center", fontFamily: "Archivo" }}><div style={{ fontSize: 38, fontWeight: 700 }}>↗</div><div style={{ fontSize: 13, fontWeight: 650 }}>Your plan</div></div></div>
      </div>
      <div style={{ position: "absolute", left: 150, bottom: 91, width: 490, height: 1, background: "rgba(245,245,242,.13)" }} />
      <div style={{ position: "absolute", left: 150, bottom: 77, width: 122, height: 3, borderRadius: 4, background: C.accent }} />
    </AbsoluteFill>
  );
};

const Avatar: React.FC<{ initials: string; color: string; size?: number }> = ({ initials, color, size = 29 }) => (
  <div style={{ width: size, height: size, borderRadius: 99, background: color, color: C.background, fontFamily: "Archivo", fontSize: size * 0.35, fontWeight: 700, display: "grid", placeItems: "center", border: "2px solid #191b1f", boxSizing: "border-box" }}>{initials}</div>
);

const Task: React.FC<{ label: string; color: string; initials: string; frame: number; delay: number }> = ({ label, color, initials, frame, delay }) => {
  const show = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping: 19, stiffness: 115 } });
  return <div style={{ opacity: show, transform: `translateY(${(1 - show) * 12}px)`, minHeight: 73, borderRadius: 11, padding: "11px 9px 9px", background: `${color}14`, border: `1px solid ${color}28`, borderLeft: `3px solid ${color}`, boxSizing: "border-box" }}><div style={{ ...text, fontSize: 13, lineHeight: 1.25, fontWeight: 600 }}>{label}</div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}><div style={{ width: 28, height: 3, background: color, borderRadius: 4 }} /><Avatar initials={initials} color={color} size={21} /></div></div>;
};

const Product: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 12, 177, 192], [0, 1, 1, 0], clamp);
  const enter = spring({ frame: Math.max(0, f - 2), fps: 30, config: { damping: 22, stiffness: 100 } });
  const columns = [
    { day: "MON", date: "12", a: "Draft brief", ac: C.accent, ai: "AL", b: "Team sync", bc: C.secondary, bi: "JM" },
    { day: "TUE", date: "13", a: "Design review", ac: C.secondary, ai: "SK", b: "Focus block", bc: C.accent, bi: "AL" },
    { day: "WED", date: "14", a: "Project notes", ac: C.accent, ai: "JM", b: "Team sync", bc: C.secondary, bi: "SK" },
    { day: "THU", date: "15", a: "Review plan", ac: C.secondary, ai: "AL", b: "Focus block", bc: C.accent, bi: "JM" },
    { day: "FRI", date: "16", a: "Weekly review", ac: C.accent, ai: "SK", b: "Wrap up", bc: C.secondary, bi: "AL" },
  ];
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", left: 125, right: 125, top: 90, bottom: 75, borderRadius: 26, overflow: "hidden", border: "1px solid rgba(245,245,242,.14)", background: "rgba(23,25,29,.97)", boxShadow: "0 30px 100px rgba(0,0,0,.35)", opacity: enter, transform: `translateY(${(1 - enter) * 22}px)` }}>
        <div style={{ height: 72, borderBottom: "1px solid rgba(245,245,242,.09)", display: "flex", alignItems: "center", padding: "0 26px", gap: 12, boxSizing: "border-box" }}><Mark size={34} /><span style={{ ...text, fontSize: 21, fontWeight: 700 }}>Relay</span><div style={{ height: 24, width: 1, background: "rgba(245,245,242,.13)", margin: "0 6px" }} /><span style={{ color: C.muted, fontFamily: "Archivo", fontSize: 14 }}>Team workspace</span><div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 15 }}><div style={{ display: "flex" }}><Avatar initials="AL" color={C.accent} /><div style={{ marginLeft: -8 }}><Avatar initials="JM" color={C.secondary} /></div><div style={{ marginLeft: -8 }}><Avatar initials="SK" color="#D6B5EA" /></div></div><div style={{ border: "1px solid rgba(245,245,242,.13)", borderRadius: 9, padding: "8px 12px", color: C.foreground, fontFamily: "Archivo", fontSize: 13 }}>Share week</div></div></div>
        <div style={{ display: "flex", height: "calc(100% - 72px)" }}>
          <div style={{ width: 205, flexShrink: 0, borderRight: "1px solid rgba(245,245,242,.08)", padding: "24px 14px", boxSizing: "border-box" }}>
            <div style={{ ...text, color: C.muted, fontSize: 11, fontWeight: 650, letterSpacing: 1.2, padding: "0 11px", marginBottom: 13 }}>WORKSPACE</div>
            {["▦  My week", "◫  Team board", "◉  Focus"].map((item, i) => <div key={item} style={{ height: 42, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 9, background: i === 0 ? `${C.accent}19` : "transparent", marginBottom: 4, color: i === 0 ? C.foreground : C.muted, fontFamily: "Archivo", fontSize: 14 }}>{item}</div>)}
            <div style={{ height: 1, background: "rgba(245,245,242,.09)", margin: "18px 8px" }} /><div style={{ ...text, color: C.muted, fontSize: 11, fontWeight: 650, letterSpacing: 1.2, padding: "0 11px", marginBottom: 12 }}>YOUR TEAM</div>
            {[["Design", C.secondary], ["Product", C.accent], ["Operations", "#D6B5EA"]].map(([name, color]) => <div key={name as string} style={{ height: 38, display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}><div style={{ width: 8, height: 8, borderRadius: 99, background: color as string }} /><span style={{ color: C.muted, fontFamily: "Archivo", fontSize: 13 }}>{name}</span></div>)}
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: "26px 20px 20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}><div><div style={{ ...text, color: C.muted, fontSize: 11, fontWeight: 650, letterSpacing: 1.5, marginBottom: 7 }}>WEEKLY PLAN</div><h2 style={{ ...text, fontSize: 36, lineHeight: 1.05, letterSpacing: -1.4, fontWeight: 680 }}>Plan together</h2></div><div style={{ border: "1px solid rgba(245,245,242,.12)", borderRadius: 9, padding: "9px 11px", color: C.muted, fontFamily: "Archivo", fontSize: 12 }}>←　<span style={{ color: C.foreground }}>May 12 – 16</span>　→</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 9, height: "calc(100% - 79px)" }}>
              {columns.map((day, i) => <div key={day.day} style={{ minWidth: 0, borderRadius: 11, background: "rgba(245,245,242,.025)", border: "1px solid rgba(245,245,242,.07)", padding: "12px 8px", boxSizing: "border-box" }}><div style={{ display: "flex", justifyContent: "space-between", margin: "0 2px 13px" }}><span style={{ color: C.muted, fontFamily: "Archivo", fontSize: 10, fontWeight: 650 }}>{day.day}</span><span style={{ color: i === 1 ? C.accent : C.foreground, fontFamily: "Archivo", fontSize: 12, fontWeight: 650 }}>{day.date}</span></div><div style={{ display: "grid", gap: 8 }}><Task label={day.a} color={day.ac} initials={day.ai} frame={f} delay={10 + i * 4} /><Task label={day.b} color={day.bc} initials={day.bi} frame={f} delay={16 + i * 4} />{i === 2 && <div style={{ height: 43, borderRadius: 10, border: "1px dashed rgba(245,245,242,.16)", display: "grid", placeItems: "center", color: C.muted, fontFamily: "Archivo", fontSize: 11 }}>+ Add plan</div>}</div></div>)}
            </div>
          </div>
          <div style={{ width: 335, flexShrink: 0, borderLeft: "1px solid rgba(245,245,242,.08)", padding: "25px 19px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 15 }}>
            <div style={{ borderRadius: 14, padding: "18px 17px", background: `${C.secondary}16`, border: `1px solid ${C.secondary}30`, opacity: interpolate(f, [18, 34], [0, 1], clamp), transform: `translateY(${interpolate(f, [18, 34], [12, 0], clamp)}px)` }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}><span style={{ ...text, fontSize: 19, letterSpacing: -0.3, fontWeight: 650 }}>Protect focus time</span><span style={{ color: C.secondary, fontFamily: "Archivo", fontSize: 21 }}>◌</span></div><div style={{ height: 1, background: "rgba(245,245,242,.11)", marginBottom: 14 }} /><div style={{ display: "flex", alignItems: "center", gap: 11 }}><div style={{ width: 41, height: 41, borderRadius: 12, background: `${C.secondary}25`, display: "grid", placeItems: "center", color: C.secondary, fontFamily: "Archivo", fontSize: 21 }}>◷</div><div><div style={{ ...text, fontSize: 13, fontWeight: 600 }}>Focus block</div><div style={{ color: C.muted, fontFamily: "Archivo", fontSize: 11, marginTop: 4 }}>9:00 – 11:00</div></div></div><div style={{ height: 5, borderRadius: 8, background: "rgba(245,245,242,.1)", marginTop: 15, overflow: "hidden" }}><div style={{ height: "100%", width: `${interpolate(f, [28, 78], [4, 73], clamp)}%`, background: C.secondary, borderRadius: 8 }} /></div></div>
            <div style={{ flex: 1, minHeight: 230, borderRadius: 14, padding: "18px 17px", background: "rgba(245,245,242,.035)", border: "1px solid rgba(245,245,242,.08)", opacity: interpolate(f, [35, 52], [0, 1], clamp), transform: `translateY(${interpolate(f, [35, 52], [12, 0], clamp)}px)` }}><div style={{ ...text, fontSize: 19, letterSpacing: -0.3, fontWeight: 650 }}>See progress</div><div style={{ display: "flex", alignItems: "center", gap: 15, marginTop: 19 }}><div style={{ width: 83, height: 83, flexShrink: 0, borderRadius: 99, background: `conic-gradient(${C.accent} ${interpolate(f, [48, 92], [5, 76], clamp)}%, rgba(245,245,242,.1) 0)`, display: "grid", placeItems: "center" }}><div style={{ width: 61, height: 61, borderRadius: 99, background: "#1b1d21", display: "grid", placeItems: "center", color: C.foreground, fontFamily: "Archivo", fontSize: 11, fontWeight: 650 }}>WEEK</div></div><div style={{ flex: 1, display: "grid", gap: 9 }}>{[C.accent, C.secondary, "rgba(245,245,242,.48)"].map((color, i) => <div key={i} style={{ height: 6, borderRadius: 8, background: "rgba(245,245,242,.08)", overflow: "hidden" }}><div style={{ height: "100%", width: `${interpolate(f, [48 + i * 5, 100 + i * 5], [8, [82, 61, 45][i]], clamp)}%`, background: color, borderRadius: 8 }} /></div>)}</div></div><div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 61, marginTop: 20 }}>{[38, 60, 45, 83, 66, 93, 72].map((height, i) => <div key={i} style={{ flex: 1, height: `${height}%`, borderRadius: 4, background: i === 5 ? C.accent : i % 2 ? `${C.secondary}a6` : "rgba(245,245,242,.18)", transform: `scaleY(${interpolate(f, [55 + i * 3, 78 + i * 3], [0.08, 1], clamp)})`, transformOrigin: "bottom" }} />)}</div><div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: C.muted, fontFamily: "Archivo", fontSize: 9 }}><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span></div></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 29, textAlign: "center", color: "rgba(245,245,242,.48)", fontFamily: "Archivo", fontSize: 11, letterSpacing: 1.4 }}>A SHARED WEEK, AT A GLANCE</div>
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: Math.max(0, f - 1), fps: 30, config: { damping: 22, stiffness: 85 } });
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 15], [0, 1], clamp) }}><div style={{ position: "absolute", left: 0, right: 0, top: 266, display: "flex", flexDirection: "column", alignItems: "center", opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}><Mark size={54} /><h1 style={{ ...text, fontSize: 76, lineHeight: 1.12, letterSpacing: -3.5, fontWeight: 680, textAlign: "center", marginTop: 29 }}>Start your next week<br />with <span style={{ color: C.accent }}>Relay</span></h1><div style={{ width: 78, height: 4, borderRadius: 6, background: C.accent, marginTop: 35, transform: `scaleX(${interpolate(f, [12, 28], [0.2, 1], clamp)})` }} /></div><div style={{ position: "absolute", left: 150, right: 150, bottom: 90, height: 1, background: "rgba(245,245,242,.12)" }} /><div style={{ position: "absolute", left: 150, bottom: 66, display: "flex", alignItems: "center", gap: 9 }}><Mark size={24} /><span style={{ ...text, fontSize: 16, fontWeight: 650 }}>Relay</span></div></AbsoluteFill>;
};

export const BenchmarkVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.background, fontFamily: "Archivo" }}>
    <Backdrop />
    <Sequence from={0} durationInFrames={96}><Intro /></Sequence>
    <Sequence from={84} durationInFrames={192}><Product /></Sequence>
    <Sequence from={264} durationInFrames={96}><Closing /></Sequence>
  </AbsoluteFill>
);
