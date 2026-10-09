import type {TemplateMeta} from '../vocab.ts';

export const orbit3dMeta: TemplateMeta = {
  id: 'orbit3d',
  name: '3D Orbit Reveal',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 150,
  motion: ['3D cards', 'Orbit', 'Mask reveal'],
  scenes: [
    {type: 'logo-lockup', from: 0, duration: 210, focus: 150, roles: ['brand', 'headline', 'subhead']},
  ],
};
