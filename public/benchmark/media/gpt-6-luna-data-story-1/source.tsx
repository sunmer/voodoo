import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame } from "remotion";
import { palette } from "./contract";

const DAYS = [
  { day: "Monday", value: 2 },
  { day: "Tuesday", value: 3 },
  { day: "Wednesday", value: 4 },
  { day: "Thursday", value: 3 },
  { day: "Friday", value: 5 },
];

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const BrandMark = ({ large = false }: { large?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, color: palette.foreground }}>
    <div
      style={{
        width: large ? 25 : 20,
        height: large ? 25 : 20,
        borderRadius: large ? 8 : 6,
        backgroundColor: palette.accent,
        transform: "rotate(-8deg)",
      }}
    />
    <span style={{ fontSize: large ? 38 : 30, fontWeight: 700, letterSpacing: "-0.04em" }}>Relay</span>
  </div>
);

const Backdrop = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 77% 40%, rgba(120,185,237,0.075) 0%, rgba(16,17,20,0) 34%), radial-gradient(ellipse at 18% 88%, rgba(184,243,107,0.055) 0%, rgba(16,17,20,0) 32%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: "rgba(245,245,242,0.08)",
      }}
    />
  </>
);

const Intro = () => {
  const frame = useCurrentFrame();
  const reveal = spring({ frame, fps: 30, config: { damping: 22, stiffness: 90, mass: 1 } });
  const opacity = interpolate(reveal, [0, 1], [0, 1], clamp);
  const lift = interpolate(reveal, [0, 1], [34, 0], clamp);
  const orbit = spring({ frame: Math.max(0, frame - 9), fps: 30, config: { damping: 18, stiffness: 72 } });

  return (
    <AbsoluteFill style={{ color: palette.foreground }}>
      <div style={{ position: "absolute", left: 150, top: 92 }}>
        <BrandMark />
      </div>

      <div
        style={{
          position: "absolute",
          left: 150,
          top: 305,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 18px",
          borderRadius: 999,
          border: "1px solid rgba(184,243,107,0.32)",
          backgroundColor: "rgba(184,243,107,0.08)",
          color: palette.accent,
          fontSize: 19,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity,
          transform: `translateY(${lift}px)`,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: palette.accent }} />
        Illustrative data
      </div>

      <div
        style={{
          position: "absolute",
          left: 150,
          top: 395,
          maxWidth: 1120,
          fontSize: 112,
          lineHeight: 1.02,
          fontWeight: 700,
          letterSpacing: "-0.065em",
          opacity,
          transform: `translateY(${lift}px)`,
        }}
      >
        A week with more
        <br />
        <span style={{ color: palette.accent }}>focus</span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 220,
          top: 300,
          width: 430,
          height: 430,
          borderRadius: "50%",
          border: "1px solid rgba(245,245,242,0.12)",
          opacity: 0.5,
          transform: `scale(${0.88 + orbit * 0.12})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            borderRadius: "50%",
            border: "1px solid rgba(120,185,237,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 29,
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: palette.secondary,
            boxShadow: "0 0 34px rgba(120,185,237,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 88,
            left: 42,
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: palette.accent,
            boxShadow: "0 0 28px rgba(184,243,107,0.5)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 100,
          width: 64,
          height: 5,
          borderRadius: 5,
          backgroundColor: palette.accent,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

const FocusChart = () => {
  const frame = useCurrentFrame();
  const headerOpacity = interpolate(frame, [0, 18], [0, 1], clamp);
  const baseline = 790;
  const plotHeight = 360;
  const centers = [400, 690, 980, 1270, 1560];

  return (
    <AbsoluteFill style={{ color: palette.foreground }}>
      <div style={{ position: "absolute", left: 150, top: 78 }}>
        <BrandMark />
      </div>

      <div style={{ position: "absolute", left: 150, top: 152, opacity: headerOpacity }}>
        <div style={{ fontSize: 58, lineHeight: 1, fontWeight: 700, letterSpacing: "-0.05em" }}>Focus hours</div>
        <div
          style={{
            marginTop: 17,
            color: palette.muted,
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Hours · illustrative data
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 280,
          top: baseline - plotHeight,
          width: 1410,
          height: plotHeight,
        }}
      >
        {Array.from({ length: 6 }, (_, tick) => {
          const y = plotHeight - (tick / 5) * plotHeight;
          return (
            <div key={tick}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: y,
                  width: "100%",
                  height: tick === 0 ? 2 : 1,
                  backgroundColor: tick === 0 ? "rgba(245,245,242,0.48)" : "rgba(245,245,242,0.105)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -48,
                  top: y - 14,
                  width: 30,
                  textAlign: "right",
                  color: palette.muted,
                  fontSize: 18,
                  lineHeight: "28px",
                  fontWeight: 500,
                }}
              >
                {tick}
              </div>
            </div>
          );
        })}
      </div>

      {DAYS.map((item, index) => {
        const raw = spring({
          frame: Math.max(0, frame - index * 5),
          fps: 30,
          durationInFrames: 42,
          config: { damping: 20, stiffness: 120, mass: 0.8 },
        });
        const progress = interpolate(raw, [0, 1], [0, 1], clamp);
        const barHeight = (item.value / 5) * plotHeight;
        const left = centers[index] - 75;
        const valueOpacity = interpolate(progress, [0.25, 0.78], [0, 1], clamp);
        const labelOpacity = interpolate(progress, [0.25, 0.8], [0, 1], clamp);

        return (
          <div key={item.day}>
            <div
              style={{
                position: "absolute",
                left,
                top: baseline - barHeight * progress,
                width: 150,
                height: Math.max(0, barHeight * progress),
                borderRadius: "16px 16px 3px 3px",
                background: "linear-gradient(180deg, #B8F36B 0%, rgba(184,243,107,0.83) 100%)",
                boxShadow: "0 0 38px rgba(184,243,107,0.11)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: left - 10,
                top: baseline - barHeight * progress - 61,
                width: 170,
                textAlign: "center",
                color: palette.foreground,
                fontSize: 36,
                lineHeight: "44px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                opacity: valueOpacity,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                position: "absolute",
                left: left - 24,
                top: baseline + 25,
                width: 198,
                textAlign: "center",
                color: palette.muted,
                fontSize: 23,
                lineHeight: "32px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                opacity: labelOpacity,
              }}
            >
              {item.day}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Finale = () => {
  const frame = useCurrentFrame();
  const revealRaw = spring({ frame, fps: 30, durationInFrames: 22, config: { damping: 20, stiffness: 100 } });
  const reveal = interpolate(revealRaw, [0, 1], [0, 1], clamp);
  const opacity = interpolate(reveal, [0, 1], [0, 1], clamp);
  const rise = interpolate(reveal, [0, 1], [26, 0], clamp);

  return (
    <AbsoluteFill style={{ color: palette.foreground }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 92,
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        <BrandMark />
      </div>

      <div
        style={{
          position: "absolute",
          right: 150,
          top: 96,
          padding: "12px 18px",
          borderRadius: 999,
          border: "1px solid rgba(184,243,107,0.32)",
          color: palette.accent,
          backgroundColor: "rgba(184,243,107,0.08)",
          fontSize: 18,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity,
        }}
      >
        Illustrative data
      </div>

      <div
        style={{
          position: "absolute",
          left: 170,
          top: 260,
          width: 1580,
          height: 585,
          borderRadius: 34,
          border: "1px solid rgba(245,245,242,0.12)",
          background: "linear-gradient(135deg, rgba(245,245,242,0.045), rgba(245,245,242,0.012))",
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 96,
            width: 6,
            height: 340,
            borderRadius: 6,
            backgroundColor: palette.accent,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 155,
            top: 100,
            color: palette.accent,
            fontSize: 250,
            lineHeight: 0.95,
            fontWeight: 700,
            letterSpacing: "-0.09em",
          }}
        >
          17
        </div>
        <div
          style={{
            position: "absolute",
            left: 575,
            top: 150,
            fontSize: 72,
            lineHeight: 1.15,
            fontWeight: 600,
            letterSpacing: "-0.055em",
          }}
        >
          hours of
          <br />
          focused work
        </div>
        <div
          style={{
            position: "absolute",
            left: 575,
            top: 370,
            width: 780,
            height: 1,
            backgroundColor: "rgba(245,245,242,0.16)",
          }}
        />
        <div style={{ position: "absolute", left: 575, top: 405 }}>
          <BrandMark large />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BenchmarkVideo = () => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.background,
      color: palette.foreground,
      fontFamily: "Archivo",
      overflow: "hidden",
    }}
  >
    <Backdrop />
    <Sequence from={0} durationInFrames={90}>
      <Intro />
    </Sequence>
    <Sequence from={90} durationInFrames={180}>
      <FocusChart />
    </Sequence>
    <Sequence from={270} durationInFrames={90}>
      <Finale />
    </Sequence>
  </AbsoluteFill>
);