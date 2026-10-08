import type {TemplateMeta} from '../vocab.ts';

export const grandopeningMeta: TemplateMeta = {
  id: 'grandopening',
  name: 'Grand Opening',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 100,
  motion: ['Slice', 'Spotlight', 'Stamp'],
  scenes: [
    {type: 'announcement', from: 0, duration: 160, focus: 100, roles: ['brand', 'headline']},
    {type: 'date-card', from: 160, duration: 140, focus: 60, roles: ['date', 'attribution', 'cta']},
  ],
};
