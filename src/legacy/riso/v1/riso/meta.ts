import type {TemplateMeta} from '../vocab.ts';

export const risoMeta: TemplateMeta = {
  id: 'riso',
  name: 'Riso',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 56,
  motion: ['Halftone', 'Scramble', 'Mask reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 86, focus: 56, roles: ['brand', 'headline']},
    {type: 'list', from: 86, duration: 84, focus: 60, roles: ['subhead', 'point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 44, roles: ['brand', 'cta']},
  ],
};
