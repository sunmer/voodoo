import type {TemplateMeta} from '../vocab.ts';

export const prismMeta: TemplateMeta = {
  id: 'prism',
  name: 'Prism',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 55,
  motion: ['3D cards', 'Liquid glass', 'Kinetic type'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 82, focus: 55, roles: ['brand', 'headline', 'subhead']},
    {type: 'stat-cards', from: 82, duration: 88, focus: 62, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 48, roles: ['brand', 'cta']},
  ],
};
