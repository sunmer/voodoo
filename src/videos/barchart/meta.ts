import type {TemplateMeta} from '../vocab.ts';

export const barchartMeta: TemplateMeta = {
  id: 'barchart',
  name: 'Bar Chart',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 160,
  motion: ['Bar chart', 'Counter', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 70, focus: 36, roles: ['headline', 'subhead']},
    {type: 'chart', from: 70, duration: 130, focus: 90, roles: ['chart']},
    {type: 'tagline', from: 200, duration: 70, focus: 34, roles: ['brand', 'attribution']},
  ],
};
