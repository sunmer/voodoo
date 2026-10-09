import type {TemplateMeta} from '../vocab.ts';

export const iso3dMeta: TemplateMeta = {
  id: 'iso3d',
  name: 'Iso 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 240,
  motion: ['Mask reveal', 'Stagger list', 'Line draw', 'Slide-in'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 270, focus: 36, roles: ['headline']},
    {type: 'steps', from: 36, duration: 234, focus: 120, roles: ['point1', 'point2', 'point3']},
    {type: 'end-screen', from: 200, duration: 70, focus: 30, roles: ['cta']},
  ],
};
