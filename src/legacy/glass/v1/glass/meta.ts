import type {TemplateMeta} from '../vocab.ts';

export const glassMeta: TemplateMeta = {
  id: 'glass',
  name: 'Glass',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 60,
  motion: ['Liquid glass', 'Slide-in', 'Circle reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 84, focus: 56, roles: ['brand', 'headline', 'subhead']},
    {type: 'list', from: 84, duration: 86, focus: 60, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 44, roles: ['brand', 'cta']},
  ],
};
