import type {TemplateMeta} from '../vocab.ts';

export const subscribeMeta: TemplateMeta = {
  id: 'subscribe',
  name: 'Subscribe Button',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 128,
  motion: ['Cursor', 'Pulse rings', 'Slide-in'],
  scenes: [
    {type: 'end-screen', from: 0, duration: 180, focus: 128, roles: ['headline', 'brand', 'subhead', 'cta']},
  ],
};
