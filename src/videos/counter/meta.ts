import type {TemplateMeta} from '../vocab.ts';

export const counterMeta: TemplateMeta = {
  id: 'counter',
  name: 'Stat Counter',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 100,
  motion: ['Counter', 'Line draw', 'Kinetic type'],
  scenes: [
    {type: 'counter', from: 0, duration: 140, focus: 90, roles: ['headline', 'stat']},
    {type: 'tagline', from: 140, duration: 100, focus: 44, roles: ['subhead', 'attribution', 'brand', 'cta']},
  ],
};
