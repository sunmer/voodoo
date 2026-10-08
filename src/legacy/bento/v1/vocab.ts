// Shared vocabularies. Plain data with no imports, so Node scripts can read it too.

// `kit: false` roles hold per-video content, so the shared brand kit skips them.
export const ROLES = {
  brand: {label: 'Brand', max: 18, kit: true},
  headline: {label: 'Headline', max: 24, kit: true},
  subhead: {label: 'Subhead', max: 52, kit: true},
  point1: {label: 'Point 1', max: 16, kit: true},
  point2: {label: 'Point 2', max: 16, kit: true},
  point3: {label: 'Point 3', max: 16, kit: true},
  cta: {label: 'Call to action', max: 20, kit: true},
  quote: {label: 'Quote', max: 140, kit: false},
  author: {label: 'Author', max: 40, kit: false},
} as const;

export type Role = keyof typeof ROLES;
export const ROLE_KEYS = Object.keys(ROLES) as Role[];
export const KIT_ROLE_KEYS = ROLE_KEYS.filter((role) => ROLES[role].kit);

export const THEME_ROLES = ['background', 'surface', 'foreground', 'accent', 'accent2'] as const;
export type ThemeRole = (typeof THEME_ROLES)[number];
export const THEME_LABELS: Record<ThemeRole, string> = {
  background: 'Background',
  surface: 'Surface',
  foreground: 'Text',
  accent: 'Accent',
  accent2: 'Accent 2',
};

export type Theme = Record<ThemeRole, string>;
export type VideoProps = {
  texts: Partial<Record<Role, string>>;
  theme: Theme;
};

export const SCENE_TYPES = {
  'title-reveal': 'Title reveal',
  'stat-cards': 'Stat cards',
  list: 'List',
  tagline: 'Tagline',
  'logo-lockup': 'Logo lockup',
  marquee: 'Marquee',
  typing: 'Typing',
  chart: 'Chart',
  quote: 'Quote',
  grid: 'Bento grid',
  'lower-third': 'Lower third',
  'end-screen': 'End screen',
  countdown: 'Countdown',
  byline: 'Byline',
  transition: 'Transition',
} as const;
export type SceneType = keyof typeof SCENE_TYPES;

export const MOTION = [
  'Kinetic type',
  '3D cards',
  'Mask reveal',
  'Slide-in',
  'Wipes',
  'Orbit',
  'Circle reveal',
  'Split-flap',
  'Marquee',
  'Typewriter',
  'Glitch',
  'Line draw',
  'Bar chart',
  'Bento grid',
  'Liquid glass',
  'Variable type',
  'Halftone',
  'Scramble',
  'Collage',
  'Draw-on',
  'Cursor',
  'Spotlight',
  'Slice',
  'Swiss grid',
  'Lower thirds',
  'Countdown timer',
  'Waveform',
] as const;
export type Motion = (typeof MOTION)[number];

export type SceneDef = {
  type: SceneType;
  from: number;
  duration: number;
  /** Frame offset within the scene where its content is fully on screen. */
  focus: number;
  roles: Role[];
};

// Technical facts about a template. These come from code, never from tagging.
export type TemplateMeta = {
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  posterFrame: number;
  motion: Motion[];
  scenes: SceneDef[];
};
