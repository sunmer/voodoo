import type {TemplateMeta} from '../vocab.ts';

export const flashsaleMeta: TemplateMeta = {
  id: 'flashsale',
  name: 'Flash Sale',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 130,
  motion: ['Slice', 'Stamp', 'Pulse rings'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 80, focus: 40, roles: ['brand', 'headline']},
    {type: 'price-reveal', from: 80, duration: 90, focus: 50, roles: ['price', 'priceNote', 'date']},
    {type: 'end-screen', from: 170, duration: 70, focus: 34, roles: ['cta', 'brand']},
  ],
};
