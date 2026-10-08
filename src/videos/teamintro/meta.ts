import type {TemplateMeta} from '../vocab.ts';

export const teamintroMeta: TemplateMeta = {
  id: 'teamintro',
  name: 'Meet the Team',
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 80,
  motion: ['Flip cards', 'Slide-in', 'Stamp'],
  scenes: [
    {type: 'profile', from: 0, duration: 150, focus: 80, roles: ['brand', 'headline', 'author', 'attribution']},
    {type: 'quote', from: 150, duration: 150, focus: 90, roles: ['quote']},
  ],
};
