import type {TemplateMeta} from '../vocab.ts';

export const spotlightMeta: TemplateMeta = {
  id: 'spotlight',
  name: 'Spotlight',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 62,
  motion: ['Spotlight', 'Mask reveal', 'Circle reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 88, focus: 62, roles: ['brand', 'headline', 'subhead']},
    {type: 'stat-cards', from: 88, duration: 82, focus: 58, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 48, roles: ['brand', 'cta']},
  ],
};
