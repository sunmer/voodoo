import type {TemplateMeta} from '../vocab.ts';

export const hiringMeta: TemplateMeta = {
  id: 'hiring',
  name: 'Hiring',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 64,
  motion: ['Mask reveal', 'Stagger list', 'Stamp'],
  scenes: [
    {type: 'announcement', from: 0, duration: 100, focus: 64, roles: ['brand', 'headline']},
    {type: 'list', from: 100, duration: 110, focus: 70, roles: ['subhead', 'items']},
    {type: 'end-screen', from: 210, duration: 90, focus: 40, roles: ['date', 'cta']},
  ],
};
