import type {TemplateMeta} from '../vocab.ts';

export const speakerMeta: TemplateMeta = {
  id: 'speaker',
  name: 'Speaker Card',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 150,
  motion: ['Circle reveal', 'Variable type', 'Slide-in'],
  scenes: [
    {type: 'announcement', from: 0, duration: 80, focus: 40, roles: ['brand', 'headline']},
    {type: 'profile', from: 80, duration: 160, focus: 70, roles: ['author', 'attribution', 'date']},
  ],
};
