import type {TemplateMeta} from '../vocab.ts';

export const terminalMeta: TemplateMeta = {
  id: 'terminal',
  name: 'Terminal',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 90,
  motion: ['Typewriter', 'Glitch'],
  scenes: [
    {type: 'typing', from: 0, duration: 100, focus: 85, roles: ['brand', 'headline']},
    {type: 'list', from: 100, duration: 90, focus: 85, roles: ['point1', 'point2', 'point3', 'subhead']},
    {type: 'logo-lockup', from: 190, duration: 80, focus: 60, roles: ['brand', 'cta']},
  ],
};
