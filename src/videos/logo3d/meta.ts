import type {TemplateMeta} from '../vocab.ts';

export const logo3dMeta: TemplateMeta = {
  id: 'logo3d',
  name: 'Logo 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 190,
  motion: ['Orbit', 'Zoom', 'Spotlight', 'Collage'],
  scenes: [
    {type: 'logo-lockup', from: 0, duration: 210, focus: 140, roles: ['brand']},
    {type: 'tagline', from: 120, duration: 90, focus: 30, roles: ['headline']},
    {type: 'end-screen', from: 150, duration: 60, focus: 28, roles: ['cta']},
  ],
};
