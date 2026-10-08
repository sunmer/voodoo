import type {TemplateMeta} from '../vocab.ts';

export const featureMeta: TemplateMeta = {
  id: 'feature',
  name: 'New Feature',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 60,
  motion: ['Stamp', 'Zoom', 'Stagger list'],
  scenes: [
    {type: 'announcement', from: 0, duration: 100, focus: 56, roles: ['brand', 'headline', 'date']},
    {type: 'steps', from: 100, duration: 130, focus: 96, roles: ['items']},
    {type: 'end-screen', from: 230, duration: 70, focus: 36, roles: ['cta', 'brand']},
  ],
};
