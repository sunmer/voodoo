import type {Theme} from '../videos/vocab';

export const PRESETS: {name: string; colors: Theme}[] = [
  {name: 'Ember', colors: {background: '#07070b', surface: '#15151f', foreground: '#f4f2ee', accent: '#ff4d2e', accent2: '#3dd6c6'}},
  {name: 'Paper', colors: {background: '#f3f4f6', surface: '#ffffff', foreground: '#111827', accent: '#2563eb', accent2: '#16a34a'}},
  {name: 'Neon', colors: {background: '#0b0420', surface: '#1c0d3d', foreground: '#fdf4ff', accent: '#ff2bd6', accent2: '#facc15'}},
  {name: 'Forest', colors: {background: '#0f1f17', surface: '#183427', foreground: '#eef5ec', accent: '#9be15d', accent2: '#f2c14e'}},
  {name: 'Volt', colors: {background: '#111111', surface: '#1f1f1f', foreground: '#ffffff', accent: '#d4ff3a', accent2: '#ff5c39'}},
  {name: 'Linen', colors: {background: '#f5efe6', surface: '#ffffff', foreground: '#1d1b19', accent: '#c2410c', accent2: '#0f766e'}},
  {name: 'Ocean', colors: {background: '#04131f', surface: '#0b2536', foreground: '#e6f4ff', accent: '#38bdf8', accent2: '#fb7185'}},
  {name: 'Sorbet', colors: {background: '#fff1f2', surface: '#ffffff', foreground: '#3b0a1a', accent: '#e11d48', accent2: '#7c3aed'}},
];

// Original palette first, then curated presets that differ from it.
export function derivePalettes(original: Theme) {
  const same = (a: Theme) => JSON.stringify(a) === JSON.stringify(original);
  return [{name: 'Original', colors: original}, ...PRESETS.filter((p) => !same(p.colors))];
}
