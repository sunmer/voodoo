import type {TemplateMeta} from '../vocab.ts';

export const testimonialMeta: TemplateMeta = {
  id: 'testimonial',
  name: 'Testimonial',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 110,
  motion: ['Typewriter', 'Slide-in', 'Line draw'],
  scenes: [
    {type: 'quote', from: 0, duration: 150, focus: 110, roles: ['quote']},
    {type: 'byline', from: 150, duration: 80, focus: 46, roles: ['author', 'headline', 'point1']},
    {type: 'logo-lockup', from: 230, duration: 70, focus: 42, roles: ['brand', 'cta']},
  ],
};
