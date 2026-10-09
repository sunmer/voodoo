import type {TemplateMeta} from '../vocab.ts';

export const chrome3dMeta: TemplateMeta = {
  id: 'chrome3d',
  name: 'Chrome 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 120,
  motion: ['Orbit', 'Parallax', 'Zoom', 'Mask reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 104, roles: ['brand', 'headline']},
    {type: 'end-screen', from: 100, duration: 80, focus: 26, roles: ['cta']},
  ],
};
