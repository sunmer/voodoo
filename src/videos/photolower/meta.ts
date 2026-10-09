import type {TemplateMeta} from '../vocab.ts';

export const photolowerMeta: TemplateMeta = {
  id: 'photolower',
  name: 'Photo Lower Third',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 90,
  motion: ['Lower thirds', 'Zoom', 'Wipes', 'Slide-in', 'Mask reveal'],
  scenes: [{type: 'lower-third', from: 0, duration: 180, focus: 70, roles: ['author', 'attribution', 'brand']}],
};
