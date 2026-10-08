import type {TemplateMeta} from '../vocab.ts';

export const newsletterMeta: TemplateMeta = {
  id: 'newsletter',
  name: 'Newsletter Promo',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 80,
  motion: ['Slide-in', 'Stagger list', 'Typewriter'],
  scenes: [
    {type: 'announcement', from: 0, duration: 110, focus: 70, roles: ['brand', 'headline']},
    {type: 'list', from: 110, duration: 110, focus: 76, roles: ['items']},
    {type: 'end-screen', from: 220, duration: 80, focus: 50, roles: ['cta']},
  ],
};
