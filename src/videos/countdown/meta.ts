import type {TemplateMeta} from '../vocab.ts';

// The digits come from the timeline: 5 to 1, one second each.
export const countdownMeta: TemplateMeta = {
  id: 'countdown',
  name: 'Countdown',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 20,
  motion: ['Countdown timer', 'Circle reveal', 'Kinetic type'],
  scenes: [
    {type: 'countdown', from: 0, duration: 150, focus: 20, roles: ['brand', 'headline']},
    {type: 'title-reveal', from: 150, duration: 90, focus: 50, roles: ['subhead', 'cta']},
  ],
};
