import type {TemplateMeta} from '../vocab.ts';

export const magazineMeta: TemplateMeta = {
  id: 'magazine',
  name: 'Magazine',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 210,
  motion: ['Mask reveal', 'Slide-in', 'Line draw', 'Halftone', 'Parallax'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 240, focus: 66, roles: ['brand', 'date']},
    {type: 'transition', from: 40, duration: 200, focus: 36, roles: []},
    {type: 'tagline', from: 88, duration: 152, focus: 56, roles: ['headline', 'subhead']},
    {type: 'end-screen', from: 150, duration: 90, focus: 34, roles: []},
  ],
};
