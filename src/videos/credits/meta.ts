import type {TemplateMeta} from '../vocab.ts';

export const creditsMeta: TemplateMeta = {
  id: 'credits',
  name: 'End Credits',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 360,
  posterFrame: 150,
  motion: ['Rolling credits', 'Parallax'],
  scenes: [
    {type: 'credits', from: 0, duration: 270, focus: 150, roles: ['headline', 'items']},
    {type: 'end-screen', from: 270, duration: 90, focus: 40, roles: ['brand', 'cta']},
  ],
};
