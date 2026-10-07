import type {TemplateMeta} from '../vocab.ts';

export const pulseMeta: TemplateMeta = {
  id: 'pulse',
  name: 'Pulse',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 150,
  motion: ['Line draw', 'Bar chart', 'Mask reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 84, focus: 60, roles: ['brand', 'headline', 'subhead']},
    {type: 'chart', from: 84, duration: 86, focus: 66, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 50, roles: ['brand', 'cta']},
  ],
};
