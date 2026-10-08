import type {TemplateMeta} from '../vocab.ts';

export const comingsoonMeta: TemplateMeta = {
  id: 'comingsoon',
  name: 'Coming Soon',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 90,
  motion: ['Wipes', 'Line draw', 'Pulse rings'],
  scenes: [
    {type: 'announcement', from: 0, duration: 130, focus: 80, roles: ['brand', 'headline']},
    {type: 'date-card', from: 130, duration: 170, focus: 80, roles: ['date', 'cta']},
  ],
};
