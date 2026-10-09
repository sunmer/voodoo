import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {overlayFor, zoneTones, type AssetRecord} from './catalog';

/** A text area as [left, top, right, bottom] fractions of the frame. */
export type Zone = readonly [number, number, number, number];

const hex = (a: number) => Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16).padStart(2, '0');

/**
 * A full-frame photo with theme-colored scrims behind each text zone. Each scrim is as light as
 * possible while keeping `foreground` colors readable over the photo under it, for any theme.
 * Scrims ease out around each zone, so the rest of the photo stays vivid. Pass one zone per
 * large text block. For small labels (brand, date) use labelShadow() on the text instead of a zone.
 * `motion` moves only the photo (for push-ins and drifts); the scrims stay fixed under the text.
 */
export const Backdrop: React.FC<{
  src: string; asset: AssetRecord; background: string; foreground: string | string[];
  zones: readonly Zone[]; motion?: string; style?: React.CSSProperties; position?: string;
}> = ({src, asset, background, foreground, zones, motion, style, position = 'center'}) => (
  <AbsoluteFill style={style}>
    <AbsoluteFill style={{transform: motion}}>
      <Img src={src} alt={asset.label} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, display: 'block'}} />
    </AbsoluteFill>
    {zones.map((zone, i) => {
      const alpha = overlayFor(zoneTones(asset.tones, zone), background, foreground);
      const [l, t, r, b] = zone.map((v) => v * 100);
      const color = `${background}${hex(alpha)}`;
      // Full strength across the zone, easing to clear over a band that scales with the zone, on both axes.
      const fx = Math.max(10, (r - l) * 0.35);
      const fy = Math.max(10, (b - t) * 0.35);
      const x = `linear-gradient(90deg, transparent ${l - fx}%, #000 ${l}%, #000 ${r}%, transparent ${r + fx}%)`;
      const y = `linear-gradient(180deg, transparent ${t - fy}%, #000 ${t}%, #000 ${b}%, transparent ${b + fy}%)`;
      return (
        <AbsoluteFill key={i} style={{maskImage: y, WebkitMaskImage: y}}>
          <AbsoluteFill style={{background: color, maskImage: x, WebkitMaskImage: x}} />
        </AbsoluteFill>
      );
    })}
  </AbsoluteFill>
);

/** A soft halo that keeps a small label readable on any photo, without a visible box. */
export const labelShadow = (background: string) => `0 0 18px ${background}, 0 0 6px ${background}, 0 1px 2px ${background}`;
