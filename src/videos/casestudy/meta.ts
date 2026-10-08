import type {TemplateMeta} from '../vocab.ts';

export const casestudyMeta: TemplateMeta = {
  id: 'casestudy',
  name: 'Case Study',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 330,
  posterFrame: 130,
  motion: ['Mask reveal', 'Counter', 'Progress bar'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 80, focus: 44, roles: ['brand', 'headline']},
    {type: 'counter', from: 80, duration: 90, focus: 60, roles: ['stat']},
    {type: 'quote', from: 170, duration: 100, focus: 60, roles: ['quote', 'attribution']},
    {type: 'end-screen', from: 270, duration: 60, focus: 30, roles: ['cta']},
  ],
};
