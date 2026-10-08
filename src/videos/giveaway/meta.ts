import type {TemplateMeta} from '../vocab.ts';

export const giveawayMeta: TemplateMeta = {
  id: 'giveaway',
  name: 'Giveaway',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 60,
  motion: ['Stamp', 'Stagger list', 'Confetti'],
  scenes: [
    {type: 'announcement', from: 0, duration: 100, focus: 60, roles: ['brand', 'headline']},
    {type: 'steps', from: 100, duration: 90, focus: 62, roles: ['items']},
    {type: 'date-card', from: 190, duration: 80, focus: 40, roles: ['date', 'cta']},
  ],
};
