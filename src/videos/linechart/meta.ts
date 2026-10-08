import type {TemplateMeta} from '../vocab.ts';

export const linechartMeta: TemplateMeta = {
  id: 'linechart',
  name: 'Line Chart',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 180,
  motion: ['Line chart', 'Line draw', 'Counter'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 70, focus: 36, roles: ['headline', 'subhead']},
    {type: 'chart', from: 70, duration: 150, focus: 110, roles: ['chart', 'headline']},
    {type: 'tagline', from: 220, duration: 50, focus: 26, roles: ['attribution']},
  ],
};
