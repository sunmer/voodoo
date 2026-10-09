import type {TemplateMeta} from '../vocab.ts';

export const phototitleMeta: TemplateMeta = {
  id: 'phototitle',
  name: 'Photo Title Card',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 110,
  motion: ['Zoom', 'Parallax', 'Mask reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 110, roles: ['brand', 'headline', 'subhead']},
  ],
};
