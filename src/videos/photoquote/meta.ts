import type {TemplateMeta} from '../vocab.ts';

export const photoquoteMeta: TemplateMeta = {
  id: 'photoquote',
  name: 'Photo Quote',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 150,
  motion: ['Zoom', 'Parallax', 'Draw-on', 'Mask reveal', 'Line draw'],
  scenes: [
    {type: 'quote', from: 0, duration: 240, focus: 112, roles: ['brand', 'quote']},
    {type: 'byline', from: 100, duration: 140, focus: 40, roles: ['author']},
  ],
};
