import type {TemplateMeta} from '../vocab.ts';

export const portraitcardMeta: TemplateMeta = {
  id: 'portraitcard',
  name: 'Portrait Card',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 130,
  motion: ['Parallax', 'Slide-in', 'Mask reveal', 'Zoom'],
  scenes: [
    {type: 'profile', from: 0, duration: 210, focus: 64, roles: ['brand', 'author', 'attribution']},
    {type: 'quote', from: 62, duration: 148, focus: 44, roles: ['quote']},
  ],
};
