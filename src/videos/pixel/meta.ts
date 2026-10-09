import type {TemplateMeta} from '../vocab.ts';

export const pixelMeta: TemplateMeta = {
  id: 'pixel',
  name: 'Pixel',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 150,
  motion: ['Draw-on', 'Typewriter', 'Parallax', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 70, roles: ['headline']},
    {type: 'typing', from: 66, duration: 114, focus: 66, roles: ['subhead']},
    {type: 'end-screen', from: 112, duration: 68, focus: 16, roles: ['cta']},
  ],
};
