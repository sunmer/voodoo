import type {TemplateMeta} from '../vocab.ts';

export const bentoMeta: TemplateMeta = {
  id: 'bento',
  name: 'Bento',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 150,
  motion: ['Bento grid', 'Kinetic type', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 80, focus: 50, roles: ['brand', 'headline']},
    {type: 'grid', from: 80, duration: 100, focus: 70, roles: ['subhead', 'point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 180, duration: 60, focus: 40, roles: ['brand', 'cta']},
  ],
};
