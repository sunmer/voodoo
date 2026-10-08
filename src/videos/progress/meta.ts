import type {TemplateMeta} from '../vocab.ts';

export const progressMeta: TemplateMeta = {
  id: 'progress',
  name: 'Progress Bar',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 190,
  motion: ['Progress bar', 'Counter', 'Confetti'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 60, focus: 30, roles: ['headline', 'brand']},
    {type: 'counter', from: 60, duration: 140, focus: 120, roles: ['stat', 'subhead']},
    {type: 'tagline', from: 200, duration: 70, focus: 34, roles: ['brand']},
  ],
};
