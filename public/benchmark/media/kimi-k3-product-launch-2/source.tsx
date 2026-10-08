import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {palette} from "./contract";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(ellipse at 50% 42%, ${palette.secondary}16, transparent 62%), linear-gradient(${palette.foreground}07 1px, transparent 1px), linear-gradient(90deg, ${palette.foreground}07 1px, transparent 1px)`,
      backgroundSize: "100% 100%, 96px 96px, 96px 96px",
    }}
  />
);

const LogoMark: React.FC<{size: number; scale: number}> = ({size, scale}) => (
  <div
    style={{
      transform: `scale(${scale})`,
      width: size,
      height: size,
      borderRadius: size * 0.29,
      background: palette.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: palette.background,
      fontSize: size * 0.62,
      fontWeight: 800,
      boxShadow: `0 0 ${size * 0.8}px ${palette.accent}55`,
    }}
  >
    R
  </div>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame, fps, config: {damping: 13, stiffness: 140}});
  const titleOpacity = interpolate(frame, [10, 28], [0, 1], clamp);
  const titleY = interpolate(frame, [10, 32], [46, 0], clamp);
  const tagOpacity = interpolate(frame, [28, 46], [0, 1], clamp);
  const tagY = interpolate(frame, [28, 46], [26, 0], clamp);
  const exit = interpolate(frame, [76, 89], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{alignItems: "center", justifyContent: "center", opacity: exit, padding: 80}}
    >
      <LogoMark size={104} scale={mark} />
      <div
        style={{
          marginTop: 38,
          fontSize: 128,
          fontWeight: 800,
          color: palette.foreground,
          letterSpacing: -4,
          lineHeight: 1,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Relay
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 38,
          fontWeight: 500,
          color: palette.muted,
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
        }}
      >
        Make room for focused work
      </div>
    </AbsoluteFill>
  );
};

const Window: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      background: `${palette.foreground}08`,
      border: `1px solid ${palette.foreground}1A`,
      borderRadius: 22,
      padding: 26,
      height: 560,
      boxShadow: "0 28px 90px rgba(0,0,0,0.5)",
    }}
  >
    <div style={{display: "flex", gap: 9, marginBottom: 24}}>
      {[palette.muted, palette.secondary, palette.accent].map((c, i) => (
        <div key={i} style={{width: 13, height: 13, borderRadius: 7, background: c}} />
      ))}
    </div>
    {children}
  </div>
);

const BoardCard: React.FC<{delay: number; h: number; tag: string; avatars?: boolean}> = ({
  delay,
  h,
  tag,
  avatars,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 17, stiffness: 140}});
  return (
    <div
      style={{
        height: h,
        background: `${palette.foreground}0F`,
        border: `1px solid ${palette.foreground}14`,
        borderRadius: 12,
        marginBottom: 14,
        padding: 14,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
      }}
    >
      <div style={{width: 42, height: 7, borderRadius: 4, background: tag}} />
      <div style={{marginTop: 12, width: "78%", height: 9, borderRadius: 5, background: `${palette.foreground}24`}} />
      <div style={{marginTop: 9, width: "52%", height: 9, borderRadius: 5, background: `${palette.foreground}16`}} />
      {avatars ? (
        <div style={{display: "flex", marginTop: 14}}>
          {[palette.accent, palette.secondary, palette.muted].map((c, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: c,
                border: `3px solid ${palette.background}`,
                marginLeft: i === 0 ? 0 : -10,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const PlanBoard: React.FC = () => {
  const columns = [
    {label: "To do", tint: palette.muted, cards: [{h: 96, tag: palette.secondary}, {h: 78, tag: palette.muted}]},
    {label: "Doing", tint: palette.secondary, cards: [{h: 128, tag: palette.accent}, {h: 84, tag: palette.secondary}]},
    {label: "Done", tint: palette.accent, cards: [{h: 88, tag: palette.accent}, {h: 100, tag: palette.accent}]},
  ];
  return (
    <div style={{display: "flex", gap: 18, height: 436}}>
      {columns.map((col, ci) => (
        <div key={col.label} style={{flex: 1, background: `${palette.foreground}06`, borderRadius: 14, padding: 14}}>
          <div style={{display: "flex", alignItems: "center", gap: 9, marginBottom: 16}}>
            <div style={{width: 10, height: 10, borderRadius: 5, background: col.tint}} />
            <div style={{color: palette.muted, fontSize: 18, fontWeight: 600}}>{col.label}</div>
          </div>
          {col.cards.map((c, ri) => (
            <BoardCard
              key={ri}
              delay={6 + ci * 5 + ri * 4}
              h={c.h}
              tag={c.tag}
              avatars={ci === 1 && ri === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const CalBlock: React.FC<{
  delay: number;
  top: number;
  height: number;
  color: string;
  label?: string;
  labelDelay?: number;
}> = ({delay, top, height, color, label, labelDelay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 16, stiffness: 110}});
  const labelOpacity = label ? interpolate(frame, [delay + labelDelay, delay + labelDelay + 10], [0, 1], clamp) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 10,
        right: 10,
        top,
        height: height * s,
        borderRadius: 10,
        background: `${color}33`,
        border: `1.5px solid ${color}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label ? (
        <div style={{color, fontSize: 20, fontWeight: 700, opacity: labelOpacity}}>{label}</div>
      ) : null}
    </div>
  );
};

const FocusCalendar: React.FC = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const blocks: {top: number; h: number; color: string}[][] = [
    [{top: 120, h: 58, color: palette.secondary}],
    [{top: 80, h: 48, color: palette.muted}, {top: 190, h: 54, color: palette.secondary}],
    [],
    [{top: 150, h: 66, color: palette.secondary}],
    [{top: 100, h: 52, color: palette.muted}],
  ];
  return (
    <div style={{display: "flex", gap: 14, height: 436}}>
      {days.map((d, i) => (
        <div
          key={d}
          style={{
            flex: 1,
            position: "relative",
            background: `${palette.foreground}06`,
            borderRadius: 14,
            border: i === 2 ? `1.5px solid ${palette.accent}55` : "1.5px solid transparent",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: i === 2 ? palette.accent : palette.muted,
              fontSize: 17,
              fontWeight: 700,
              paddingTop: 12,
            }}
          >
            {d}
          </div>
          {blocks[i].map((b, bi) => (
            <CalBlock key={bi} delay={6 + i * 3 + bi * 3} top={b.top} height={b.h} color={b.color} />
          ))}
          {i === 2 ? (
            <CalBlock delay={12} top={90} height={230} color={palette.accent} label="Focus" labelDelay={14} />
          ) : null}
        </div>
      ))}
    </div>
  );
};

const ProgressRow: React.FC<{label: string; target: number; color: string; delay: number}> = ({
  label,
  target,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 22, stiffness: 55}});
  const pct = Math.round(interpolate(s, [0, 1], [0, target], clamp));
  return (
    <div>
      <div style={{display: "flex", justifyContent: "space-between", marginBottom: 14}}>
        <div style={{color: palette.foreground, fontSize: 26, fontWeight: 700}}>{label}</div>
        <div style={{color, fontSize: 26, fontWeight: 700}}>{pct}%</div>
      </div>
      <div style={{height: 18, borderRadius: 9, background: `${palette.foreground}12`, overflow: "hidden"}}>
        <div style={{height: "100%", width: `${pct}%`, background: color, borderRadius: 9}} />
      </div>
    </div>
  );
};

const ProgressPanel: React.FC = () => {
  const rows = [
    {label: "Plan", target: 100, color: palette.accent},
    {label: "Build", target: 72, color: palette.secondary},
    {label: "Ship", target: 45, color: palette.muted},
  ];
  return (
    <div
      style={{
        height: 436,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 52,
        padding: "0 32px",
      }}
    >
      {rows.map((r, i) => (
        <ProgressRow key={r.label} delay={6 + i * 8} label={r.label} target={r.target} color={r.color} />
      ))}
    </div>
  );
};

const Feature: React.FC<{step: string; title: string; tint: string; children: React.ReactNode}> = ({
  step,
  title,
  tint,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 110}});
  const titleY = interpolate(enter, [0, 1], [36, 0]);
  const titleOpacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const lineScale = interpolate(frame, [6, 24], [0, 1], clamp);
  const uiOpacity = interpolate(frame, [6, 20], [0, 1], clamp);
  const uiY = interpolate(frame, [6, 26], [32, 0], clamp);
  const exit = interpolate(frame, [50, 60], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity: exit,
        padding: 80,
        flexDirection: "row",
        alignItems: "center",
        gap: 72,
      }}
    >
      <div style={{width: 560, opacity: titleOpacity, transform: `translateY(${titleY}px)`}}>
        <div style={{color: tint, fontSize: 22, fontWeight: 700, letterSpacing: 8, marginBottom: 22}}>
          {step}
        </div>
        <div
          style={{
            color: palette.foreground,
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 30,
            height: 5,
            width: 130,
            background: tint,
            borderRadius: 3,
            transform: `scaleX(${lineScale})`,
            transformOrigin: "left",
          }}
        />
      </div>
      <div style={{flex: 1, opacity: uiOpacity, transform: `translateY(${uiY}px)`}}>
        <Window>{children}</Window>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame, fps, config: {damping: 14, stiffness: 130}});
  const headlineOpacity = interpolate(frame, [8, 20], [0, 1], clamp);
  const headlineY = interpolate(frame, [8, 24], [30, 0], clamp);
  const lineScale = interpolate(frame, [16, 34], [0, 1], clamp);

  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: 80}}>
      <LogoMark size={88} scale={mark} />
      <div
        style={{
          marginTop: 40,
          fontSize: 80,
          fontWeight: 800,
          lineHeight: 1.14,
          letterSpacing: -2,
          textAlign: "center",
          color: palette.foreground,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        Start your next week
        <br />
        with <span style={{color: palette.accent}}>Relay</span>
      </div>
      <div
        style={{
          marginTop: 38,
          height: 6,
          width: 180,
          borderRadius: 3,
          background: palette.accent,
          transform: `scaleX(${lineScale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: palette.background, fontFamily: "Archivo"}}>
      <Backdrop />
      <Sequence durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <Feature step="01" title="Plan together" tint={palette.accent}>
          <PlanBoard />
        </Feature>
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <Feature step="02" title="Protect focus time" tint={palette.secondary}>
          <FocusCalendar />
        </Feature>
      </Sequence>
      <Sequence from={210} durationInFrames={60}>
        <Feature step="03" title="See progress" tint={palette.accent}>
          <ProgressPanel />
        </Feature>
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
