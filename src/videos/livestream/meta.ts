import type {TemplateMeta} from '../vocab.ts';

export const livestreamMeta: TemplateMeta = {
  id: 'livestream',
  name: 'Starting Soon',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 70,
  motion: ['Pulse rings', 'Progress bar', 'Kinetic type'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 70, roles: ['brand', 'headline', 'date']},
    {type: 'list', from: 180, duration: 120, focus: 60, roles: ['items', 'cta']},
  ],
};
