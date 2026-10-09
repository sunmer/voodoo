import type {TemplateMeta} from '../contract';

export const glitchMeta: TemplateMeta = {
  id: 'glitch',
  name: 'Glitch',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 150,
  motion: ['Glitch', 'Scramble', 'Slice', 'Typewriter'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 60, roles: ['brand', 'headline']},
    {type: 'date-card', from: 70, duration: 110, focus: 50, roles: ['date']},
  ],
};
