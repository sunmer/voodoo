import type {TemplateMeta} from '../vocab.ts';

export const gamingintroMeta: TemplateMeta = {
  id: 'gamingintro',
  name: 'Gaming Intro',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 64,
  motion: ['Glitch', 'Slice', 'Progress bar'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 110, focus: 60, roles: ['brand', 'headline']},
    {type: 'tagline', from: 110, duration: 70, focus: 40, roles: ['subhead']},
  ],
};
