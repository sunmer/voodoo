import type {TemplateMeta} from '../vocab.ts';

export const apppromoMeta: TemplateMeta = {
  id: 'apppromo',
  name: 'App Promo',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 150,
  motion: ['Parallax', 'Stagger list', 'Counter'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 90, focus: 50, roles: ['brand', 'headline']},
    {type: 'list', from: 90, duration: 100, focus: 70, roles: ['items']},
    {type: 'price-reveal', from: 190, duration: 80, focus: 50, roles: ['price', 'cta']},
  ],
};
