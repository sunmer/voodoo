import type {TemplateMeta} from '../vocab.ts';

export const birthdayMeta: TemplateMeta = {
  id: 'birthday',
  name: 'Birthday Greeting',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 205,
  motion: ['Confetti', 'Stamp', 'Kinetic type'],
  scenes: [
    {type: 'greeting', from: 0, duration: 150, focus: 90, roles: ['headline', 'author']},
    {type: 'date-card', from: 150, duration: 120, focus: 55, roles: ['date', 'subhead']},
  ],
};
