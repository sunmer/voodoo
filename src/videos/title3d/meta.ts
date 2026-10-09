import type {TemplateMeta} from '../vocab.ts';

export const title3dMeta: TemplateMeta = {
  id: 'title3d',
  name: 'Title 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 130,
  motion: ['Parallax', 'Mask reveal', 'Stagger list'],
  scenes: [{type: 'title-reveal', from: 0, duration: 180, focus: 130, roles: ['brand', 'headline', 'subhead']}],
};
