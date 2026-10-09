import type {TemplateMeta} from '../vocab.ts';

export const beforeafterphotoMeta: TemplateMeta = {
  id: 'beforeafterphoto',
  name: 'Before After Photo',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 200,
  motion: ['Split screen', 'Wipes', 'Slide-in', 'Zoom'],
  scenes: [
    {type: 'comparison', from: 0, duration: 240, focus: 110, roles: ['headline', 'point1', 'point2']},
    {type: 'byline', from: 30, duration: 210, focus: 30, roles: ['brand']},
  ],
};
