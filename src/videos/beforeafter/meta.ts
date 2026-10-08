import type {TemplateMeta} from '../vocab.ts';

export const beforeafterMeta: TemplateMeta = {
  id: 'beforeafter',
  name: 'Before and After',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 190,
  motion: ['Split screen', 'Wipes', 'Stamp'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 70, focus: 40, roles: ['headline']},
    {type: 'comparison', from: 70, duration: 160, focus: 120, roles: ['point1', 'point2']},
    {type: 'end-screen', from: 230, duration: 70, focus: 40, roles: ['brand', 'cta']},
  ],
};
