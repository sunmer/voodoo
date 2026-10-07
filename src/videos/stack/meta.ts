import type {TemplateMeta} from '../vocab.ts';

export const stackMeta: TemplateMeta = {
  id: 'stack',
  name: 'Stack',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 60,
  motion: ['Mask reveal', 'Slide-in', 'Wipes', 'Circle reveal'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 90, focus: 55, roles: ['brand', 'headline']},
    {type: 'transition', from: 76, duration: 22, focus: 10, roles: []},
    {type: 'list', from: 86, duration: 84, focus: 52, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 164, duration: 76, focus: 50, roles: ['brand', 'cta']},
  ],
};
