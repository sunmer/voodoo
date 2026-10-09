import type {TemplateMeta} from '../vocab.ts';

// Three numerals, 60 frames each, then the title card.
export const countdown3dMeta: TemplateMeta = {
  id: 'countdown3d',
  name: 'Countdown 3D',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 225,
  motion: ['Countdown timer', 'Zoom', 'Mask reveal', 'Progress bar'],
  scenes: [
    {type: 'countdown', from: 0, duration: 190, focus: 30, roles: []},
    {type: 'title-reveal', from: 170, duration: 70, focus: 50, roles: ['brand', 'headline', 'date']},
  ],
};
