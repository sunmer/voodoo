import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {overlayFor, zoneTones, type AssetRecord} from './catalog';

type Zone = readonly [number, number, number, number];

/**
 * A full-frame photo with a theme-colored overlay. The overlay is as light as possible while
 * keeping `foreground` text readable over the photo inside `zone`, for any theme colors.
 * `fade` adds a gradient from the text side so the rest of the photo stays vivid.
 */
export const Backdrop: React.FC<{
  src: string; asset: AssetRecord; background: string; foreground: string | string[]; zone: Zone;
  fade?: 'left' | 'right' | 'bottom' | 'none'; style?: React.CSSProperties; position?: string;
}> = ({src, asset, background, foreground, zone, fade = 'none', style, position = 'center'}) => {
  const alpha = overlayFor(zoneTones(asset.tones, zone), background, foreground);
  const hex = (a: number) => Math.round(a * 255).toString(16).padStart(2, '0');
  const dir = {left: '90deg', right: '270deg', bottom: '0deg', none: ''}[fade];
  // Keep the full overlay across the text zone, then let the photo show through beyond it.
  const reach = Math.round(100 * (fade === 'left' ? zone[2] : fade === 'right' ? 1 - zone[0] : 1 - zone[1]));
  const overlay = fade === 'none' ? `${background}${hex(alpha)}`
    : `linear-gradient(${dir}, ${background}${hex(alpha)} 0%, ${background}${hex(alpha)} ${reach}%, ${background}${hex(alpha * 0.25)} ${Math.min(100, reach + 25)}%, ${background}${hex(alpha * 0.15)} 100%)`;
  return (
    <AbsoluteFill style={style}>
      <Img src={src} alt={asset.label} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, display: 'block'}} />
      <AbsoluteFill style={{background: overlay}} />
    </AbsoluteFill>
  );
};
