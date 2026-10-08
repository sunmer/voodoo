import type {TemplateMeta} from '../vocab.ts';

export const valentinesMeta: TemplateMeta = {
  id: 'valentines',
  name: "Valentine's Sale",
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 70,
  motion: ['Circle reveal', 'Counter', 'Ticket stub'],
  scenes: [
    {type: 'announcement', from: 0, duration: 110, focus: 70, roles: ['brand', 'headline']},
    {type: 'price-reveal', from: 110, duration: 100, focus: 60, roles: ['price', 'priceNote']},
    {type: 'date-card', from: 210, duration: 90, focus: 46, roles: ['date', 'cta']},
  ],
};
