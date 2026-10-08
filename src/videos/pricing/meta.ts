import type {TemplateMeta} from '../vocab.ts';

export const pricingMeta: TemplateMeta = {
  id: 'pricing',
  name: 'Pricing Plans',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 150,
  motion: ['Flip cards', 'Counter', 'Line draw'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 80, focus: 40, roles: ['brand', 'headline']},
    {type: 'price-reveal', from: 80, duration: 120, focus: 80, roles: ['price', 'priceNote', 'items']},
    {type: 'end-screen', from: 200, duration: 70, focus: 36, roles: ['cta', 'brand']},
  ],
};
