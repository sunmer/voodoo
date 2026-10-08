import type {TemplateMeta} from '../vocab.ts';

export const folioMeta: TemplateMeta = {
  id: 'folio',
  name: 'Folio',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 70,
  motion: ['Mask reveal', 'Line draw', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 86, focus: 60, roles: ['brand', 'headline']},
    {type: 'quote', from: 86, duration: 76, focus: 60, roles: ['subhead']},
    {type: 'list', from: 162, duration: 78, focus: 60, roles: ['point1', 'point2', 'point3', 'cta']},
  ],
};
