import type {TemplateMeta} from '../vocab.ts';

export const thankyouMeta: TemplateMeta = {
  id: 'thankyou',
  name: 'Thank You for Watching',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 100,
  motion: ['Draw-on', 'Kinetic type', 'Slide-in'],
  scenes: [
    {type: 'greeting', from: 0, duration: 150, focus: 100, roles: ['headline', 'subhead']},
    {type: 'end-screen', from: 150, duration: 90, focus: 42, roles: ['brand', 'cta']},
  ],
};
