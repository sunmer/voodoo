import type {TemplateMeta} from '../vocab.ts';

export const sliceMeta: TemplateMeta = {
  id: 'slice',
  name: 'Slice',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 54,
  motion: ['Slice', 'Kinetic type', 'Wipes'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 78, focus: 48, roles: ['brand', 'headline']},
    {type: 'list', from: 78, duration: 92, focus: 62, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 170, duration: 70, focus: 46, roles: ['brand', 'cta']},
  ],
};
