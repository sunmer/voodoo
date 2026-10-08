import type {TemplateMeta} from '../vocab.ts';

export const toplistMeta: TemplateMeta = {
  id: 'toplist',
  name: 'Top 5 Ranking',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 360,
  posterFrame: 250,
  motion: ['Zoom', 'Stagger list', 'Kinetic type'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 70, focus: 40, roles: ['headline', 'brand']},
    {type: 'list', from: 70, duration: 220, focus: 210, roles: ['items']},
    {type: 'end-screen', from: 290, duration: 70, focus: 36, roles: ['cta']},
  ],
};
