import type {TemplateMeta} from '../vocab.ts';

export const collageMeta: TemplateMeta = {
  id: 'collage',
  name: 'Collage',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 62,
  motion: ['Collage', 'Draw-on', 'Kinetic type'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 86, focus: 58, roles: ['brand', 'headline']},
    {type: 'list', from: 86, duration: 86, focus: 62, roles: ['subhead', 'point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 172, duration: 68, focus: 44, roles: ['brand', 'cta']},
  ],
};
