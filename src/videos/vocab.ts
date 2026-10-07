// Shared vocabularies. Plain data with no imports, so Node scripts can read it too.

export const ROLES = {
  brand: {label: 'Brand', max: 18},
  headline: {label: 'Headline', max: 24},
  subhead: {label: 'Subhead', max: 52},
  point1: {label: 'Point 1', max: 16},
  point2: {label: 'Point 2', max: 16},
  point3: {label: 'Point 3', max: 16},
  cta: {label: 'Call to action', max: 20},
} as const;

export type Role = keyof typeof ROLES;
export const ROLE_KEYS = Object.keys(ROLES) as Role[];

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
