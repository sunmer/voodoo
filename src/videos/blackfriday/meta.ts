import type {TemplateMeta} from '../vocab.ts';

export const blackfridayMeta: TemplateMeta = {
  id: 'blackfriday',
  name: 'Black Friday',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 62,
  motion: ['Kinetic type', 'Marquee', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 92, focus: 62, roles: ['headline', 'subhead']},
    {type: 'stat-cards', from: 92, duration: 92, focus: 64, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 184, duration: 86, focus: 54, roles: ['brand', 'cta']},
  ],
};
