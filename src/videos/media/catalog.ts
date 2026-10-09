import {z} from 'zod';

// Template image assets. Each template keeps its own images and records in src/videos/<id>/assets/.
// This file is plain data and zod, so Node scripts and the share server can read it.

/** Relative luminance (0-1) of the darkest and brightest tones in one cell of a 4x4 grid. */
export type ToneCell = {lo: number; hi: number};
export type AssetRecord = {
  id: string;
  label: string;
  file: string;
  width: number;
  height: number;
  sha256: string;
  model: string;
  prompt: string;
  size: string;
  quality: string;
  createdAt: string;
  /** Row-major 4x4 grid over the image, measured when the asset is generated. */
  tones: ToneCell[];
};

// An image choice for a template, for example assetSchema(records). Only the template's own IDs validate.
export function assetSchema(records: readonly AssetRecord[]) {
  const ids = records.map((r) => r.id) as [string, ...string[]];
  return z.enum(ids).meta({kind: 'image', options: records.map((r) => ({id: r.id, label: r.label}))});
}

type SchemaWithMedia = {shape: {media?: {shape: Record<string, {options?: readonly string[]; meta?: () => unknown}>}}};
export const mediaSlots = (schema: unknown) => Object.keys((schema as SchemaWithMedia).shape.media?.shape ?? {});
/** Choices for one image slot, with labels, read from the schema. */
export function slotOptions(schema: unknown, slot: string): {id: string; label: string}[] {
  const field = (schema as SchemaWithMedia).shape.media?.shape[slot];
  const meta = field?.meta?.() as {options?: {id: string; label: string}[]} | undefined;
  return meta?.options ?? (field?.options ?? []).map((id) => ({id, label: id}));
}
export type Media = Record<string, string>;
export const mediaOf = (props: object): Media | undefined => (props as {media?: Media}).media;

// Contrast helpers shared by the Backdrop component and the build checks.
export function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Grid cells covered by a zone given as [left, top, right, bottom] fractions of the image. */
export function zoneTones(tones: ToneCell[], zone: readonly [number, number, number, number]): ToneCell {
  const [l, t, r, b] = zone;
  let lo = 1;
  let hi = 0;
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    if ((x + 1) / 4 <= l || x / 4 >= r || (y + 1) / 4 <= t || y / 4 >= b) continue;
    lo = Math.min(lo, tones[y * 4 + x].lo);
    hi = Math.max(hi, tones[y * 4 + x].hi);
  }
  return {lo, hi};
}

/**
 * Smallest overlay opacity of the background color that keeps the foreground readable over
 * every tone in the zone. Blending is approximated in linear light, which matches CSS closely
 * enough for a contrast floor. Returns at least `floor` and at most 0.94.
 */
export function overlayFor(tones: ToneCell, background: string, foreground: string | string[], target = 4.5, floor = 0.25) {
  const bg = luminance(background);
  // Each color is held to the target, but never above what it reaches on the solid background.
  const fgs = (Array.isArray(foreground) ? foreground : [foreground]).map(luminance).map((l) => [l, Math.min(target, contrast(l, bg) * 0.92)] as const);
  const ok = (a: number) => [tones.lo, tones.hi].every((t) => fgs.every(([l, need]) => contrast(l, a * bg + (1 - a) * t) >= need));
  for (let a = floor; a < 0.94; a += 0.01) if (ok(a)) return Math.round(a * 100) / 100;
  return 0.94;
}
