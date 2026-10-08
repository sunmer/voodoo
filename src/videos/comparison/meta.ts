import type {TemplateMeta} from '../vocab.ts';

export const comparisonMeta: TemplateMeta = {
  id: 'comparison',
  name: 'Comparison',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 190,
  motion: ['Draw-on', 'Stagger list', 'Swiss grid'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 60, focus: 30, roles: ['headline']},
    {type: 'comparison', from: 60, duration: 170, focus: 130, roles: ['point1', 'point2', 'items']},
    {type: 'end-screen', from: 230, duration: 70, focus: 36, roles: ['cta']},
  ],
};
