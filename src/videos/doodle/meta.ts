import type {TemplateMeta} from '../vocab.ts';

export const doodleMeta: TemplateMeta = {
  id: 'doodle',
  name: 'Doodle',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 180,
  motion: ['Draw-on', 'Line draw', 'Typewriter', 'Stagger list'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 84, focus: 64, roles: ['headline']},
    {type: 'steps', from: 72, duration: 138, focus: 104, roles: ['headline', 'point1', 'point2', 'point3']},
  ],
};
