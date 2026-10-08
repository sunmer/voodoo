import type {TemplateMeta} from '../vocab.ts';

export const quotecardMeta: TemplateMeta = {
  id: 'quotecard',
  name: 'Quote Animation',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 160,
  motion: ['Kinetic type', 'Mask reveal', 'Parallax'],
  scenes: [
    {type: 'quote', from: 0, duration: 210, focus: 160, roles: ['headline', 'quote']},
    {type: 'byline', from: 210, duration: 90, focus: 50, roles: ['author', 'attribution', 'brand']},
  ],
};
