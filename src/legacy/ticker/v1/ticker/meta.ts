import type {TemplateMeta} from '../vocab.ts';

export const tickerMeta: TemplateMeta = {
  id: 'ticker',
  name: 'Ticker',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 70,
  motion: ['Marquee', 'Split-flap', 'Kinetic type'],
  scenes: [
    {type: 'marquee', from: 0, duration: 90, focus: 60, roles: ['brand', 'headline']},
    {type: 'list', from: 90, duration: 80, focus: 60, roles: ['brand', 'point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 50, roles: ['brand', 'cta']},
  ],
};
