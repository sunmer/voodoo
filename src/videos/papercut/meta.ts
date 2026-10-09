import type {TemplateMeta} from '../vocab.ts';

export const papercutMeta: TemplateMeta = {
  id: 'papercut',
  name: 'Papercut',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 130,
  motion: ['Collage', 'Parallax', 'Slide-in', 'Stamp'],
  scenes: [{type: 'title-reveal', from: 0, duration: 210, focus: 120, roles: ['headline', 'subhead', 'brand']}],
};
