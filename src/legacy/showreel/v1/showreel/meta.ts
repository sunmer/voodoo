import type {TemplateMeta} from '../vocab.ts';

export const showreelMeta: TemplateMeta = {
  id: 'showreel',
  name: 'Showreel',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 52,
  motion: ['Kinetic type', '3D cards', 'Wipes', 'Orbit', 'Circle reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 92, focus: 50, roles: ['brand', 'headline']},
    {type: 'transition', from: 68, duration: 28, focus: 12, roles: []},
    {type: 'stat-cards', from: 82, duration: 96, focus: 50, roles: ['point1', 'point2', 'point3']},
    {type: 'tagline', from: 164, duration: 80, focus: 48, roles: ['subhead']},
    {type: 'logo-lockup', from: 228, duration: 72, focus: 55, roles: ['brand', 'cta']},
  ],
};
