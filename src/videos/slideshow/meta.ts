import type {TemplateMeta} from '../vocab.ts';

// Three photo slides joined by diagonal accent wipes. Each wipe fully covers the frame
// around its midpoint, which is where the next slide begins underneath it.
export const slideshowMeta: TemplateMeta = {
  id: 'slideshow',
  name: 'Slideshow',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 60,
  motion: ['Zoom', 'Wipes', 'Mask reveal', 'Progress bar'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 104, focus: 60, roles: ['headline', 'items', 'brand']},
    {type: 'transition', from: 90, duration: 24, focus: 12, roles: []},
    {type: 'tagline', from: 100, duration: 104, focus: 46, roles: ['items', 'brand']},
    {type: 'transition', from: 190, duration: 24, focus: 12, roles: []},
    {type: 'end-screen', from: 200, duration: 100, focus: 46, roles: ['items', 'brand']},
  ],
};
