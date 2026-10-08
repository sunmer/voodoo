import React from 'react';
import { useCurrentFrame, interpolate, Sequence, Easing } from 'remotion';
import { palette } from './contract';

const SceneLessNoise: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exit = interpolate(frame, [74, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const noiseDamp = interpolate(frame, [0, 18], [1, 0], {
    extrapolateRight: 'clamp',
  });

  const jitter1X = Math.sin(frame * 2.7) * 22 * noiseDamp;
  const jitter1Y = Math.cos(frame * 3.3) * 12 * noiseDamp;
  const jitter2X = -Math.cos(frame * 3.9) * 18 * noiseDamp;
  const jitter2Y = Math.sin(frame * 2.1) * 9 * noiseDamp;

  const translateY = (1 - enter) * 40 - exit * 50;
  const opacity = enter * (1 - exit);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 140,
        paddingRight: 140,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: palette.foreground,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          Less
        </div>

        <div style={{ position: 'relative' }}>
          {noiseDamp > 0.001 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: 168,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: palette.secondary,
                opacity: noiseDamp * 0.45,
                transform: `translate(${jitter1X}px, ${jitter1Y}px)`,
                fontFamily: 'Archivo, sans-serif',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              noise.
            </div>
          )}

          {noiseDamp > 0.001 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: 168,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: palette.accent,
                opacity: noiseDamp * 0.35,
                transform: `translate(${jitter2X}px, ${jitter2Y}px)`,
                fontFamily: 'Archivo, sans-serif',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              noise.
            </div>
          )}

          <div
            style={{
              fontSize: 168,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: palette.muted,
              fontFamily: 'Archivo, sans-serif',
            }}
          >
            noise.
          </div>
        </div>
      </div>
    </div>
  );
};

const SceneMoreFocus: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exit = interpolate(frame, [74, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const blur = interpolate(enter, [0, 1], [28, 0]);
  const scale = interpolate(enter, [0, 1], [1.14, 1]);
  const tracking = interpolate(enter, [0, 1], [0.12, -0.04]);
  const opacity = enter * (1 - exit);
  const translateY = -exit * 50;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 140,
        paddingRight: 140,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          filter: `blur(${blur}px)`,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: 'left center',
          opacity,
          letterSpacing: `${tracking}em`,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 900,
            lineHeight: 0.95,
            color: palette.foreground,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          More
        </div>
        <div
          style={{
            fontSize: 168,
            fontWeight: 900,
            lineHeight: 0.95,
            color: palette.secondary,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          focus.
        </div>
      </div>
    </div>
  );
};

const SceneBetterWork: React.FC = () => {
  const frame = useCurrentFrame();

  const enter1 = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enter2 = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exit = interpolate(frame, [74, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const translateX1 = (1 - enter1) * -80;
  const translateY2 = (1 - enter2) * 60;
  const exitTranslateY = -exit * 50;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 140,
        paddingRight: 140,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          transform: `translateY(${exitTranslateY}px)`,
          opacity: 1 - exit,
        }}
      >
        <div
          style={{
            fontSize: 136,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: palette.foreground,
            transform: `translateX(${translateX1}px)`,
            opacity: enter1,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          Better work,
        </div>
        <div
          style={{
            fontSize: 136,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: palette.accent,
            transform: `translateY(${translateY2}px)`,
            opacity: enter2,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          together.
        </div>
      </div>
    </div>
  );
};

const SceneFinalRelay: React.FC = () => {
  const frame = useCurrentFrame();

  const enter1 = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enter2 = interpolate(frame, [6, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const translateY1 = (1 - enter1) * 35;
  const translateY2 = (1 - enter2) * 45;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 140,
        paddingRight: 140,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: palette.foreground,
            opacity: enter1,
            transform: `translateY(${translateY1}px)`,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          Make room for what matters.
        </div>
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: palette.accent,
            opacity: enter2,
            transform: `translateY(${translateY2}px)`,
            fontFamily: 'Archivo, sans-serif',
          }}
        >
          Relay
        </div>
      </div>
    </div>
  );
};

export const BenchmarkVideo: React.FC = () => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: 'Archivo, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <SceneLessNoise />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <SceneMoreFocus />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <SceneBetterWork />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <SceneFinalRelay />
      </Sequence>
    </div>
  );
};
