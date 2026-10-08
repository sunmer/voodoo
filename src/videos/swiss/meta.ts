import type {TemplateMeta} from '../vocab.ts';

export const swissMeta: TemplateMeta = {
  id: 'swiss',
  name: 'Swiss',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 58,
  motion: ['Swiss grid', 'Line draw', 'Mask reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 82, focus: 58, roles: ['brand', 'headline', 'subhead']},
    {type: 'grid', from: 82, duration: 88, focus: 64, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 48, roles: ['brand', 'cta']},
  ],
};
