import type {TemplateMeta} from '../vocab.ts';

export const vhsintroMeta: TemplateMeta = {
  id: 'vhsintro',
  name: 'VHS Intro',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 160,
  motion: ['Glitch', 'Slice'],
  scenes: [
    {type: 'transition', from: 0, duration: 40, focus: 12, roles: []},
    {type: 'date-card', from: 24, duration: 156, focus: 24, roles: ['date']},
    {type: 'title-reveal', from: 54, duration: 126, focus: 70, roles: ['headline']},
    {type: 'logo-lockup', from: 84, duration: 96, focus: 30, roles: ['brand']},
  ],
};
