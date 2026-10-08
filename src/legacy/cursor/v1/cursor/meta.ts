import type {TemplateMeta} from '../vocab.ts';

export const cursorMeta: TemplateMeta = {
  id: 'cursor',
  name: 'Cursor',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 145,
  motion: ['Cursor', 'Slide-in', 'Kinetic type'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 82, focus: 52, roles: ['brand', 'headline', 'subhead']},
    {type: 'list', from: 82, duration: 88, focus: 72, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 48, roles: ['brand', 'cta']},
  ],
};
