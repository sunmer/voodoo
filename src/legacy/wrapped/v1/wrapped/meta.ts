import type {TemplateMeta} from '../vocab.ts';

export const wrappedMeta: TemplateMeta = {
  id: 'wrapped',
  name: 'Wrapped',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 60,
  motion: ['Kinetic type', 'Collage', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 84, focus: 60, roles: ['brand', 'headline']},
    {type: 'stat-cards', from: 84, duration: 136, focus: 120, roles: ['subhead', 'point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 220, duration: 80, focus: 46, roles: ['brand', 'cta']},
  ],
};
