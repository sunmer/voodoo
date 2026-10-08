import type {TemplateMeta} from '../vocab.ts';

export const anniversaryMeta: TemplateMeta = {
  id: 'anniversary',
  name: 'Company Anniversary',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 110,
  motion: ['Counter', 'Confetti', 'Mask reveal'],
  scenes: [
    {type: 'counter', from: 0, duration: 160, focus: 110, roles: ['brand', 'stat', 'headline']},
    {type: 'end-screen', from: 160, duration: 140, focus: 50, roles: ['date', 'cta']},
  ],
};
