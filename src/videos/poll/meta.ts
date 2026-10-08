import type {TemplateMeta} from '../vocab.ts';

export const pollMeta: TemplateMeta = {
  id: 'poll',
  name: 'This or That',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 150,
  motion: ['Split screen', 'Slice', 'Progress bar'],
  scenes: [
    {type: 'question', from: 0, duration: 60, focus: 34, roles: ['headline']},
    {type: 'comparison', from: 60, duration: 140, focus: 90, roles: ['point1', 'point2']},
    {type: 'end-screen', from: 200, duration: 70, focus: 36, roles: ['cta']},
  ],
};
