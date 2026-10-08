import type {TemplateMeta} from '../vocab.ts';

export const newyearMeta: TemplateMeta = {
  id: 'newyear',
  name: 'New Year Countdown',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 230,
  motion: ['Countdown timer', 'Zoom', 'Confetti'],
  scenes: [
    {type: 'countdown', from: 0, duration: 170, focus: 150, roles: ['brand', 'date']},
    {type: 'greeting', from: 170, duration: 130, focus: 60, roles: ['headline', 'subhead', 'cta']},
  ],
};
