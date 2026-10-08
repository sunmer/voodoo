import type {TemplateMeta} from '../vocab.ts';

export const timelineMeta: TemplateMeta = {
  id: 'timeline',
  name: 'Animated Timeline',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 330,
  posterFrame: 215,
  motion: ['Route line', 'Parallax', 'Stagger list'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 60, focus: 32, roles: ['headline']},
    {type: 'timeline', from: 60, duration: 200, focus: 155, roles: ['items']},
    {type: 'byline', from: 260, duration: 70, focus: 36, roles: ['brand', 'attribution']},
  ],
};
