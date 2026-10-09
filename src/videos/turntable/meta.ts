import type {TemplateMeta} from '../vocab.ts';

export const turntableMeta: TemplateMeta = {
  id: 'turntable',
  name: 'Turntable',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 200,
  motion: ['Orbit', 'Zoom', 'Slide-in', 'Spotlight', 'Pulse rings'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 240, focus: 64, roles: ['brand', 'headline']},
    {type: 'price-reveal', from: 96, duration: 144, focus: 26, roles: ['price']},
    {type: 'end-screen', from: 146, duration: 94, focus: 44, roles: ['cta']},
  ],
};
