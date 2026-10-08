import type {TemplateMeta} from '../vocab.ts';

export const quizMeta: TemplateMeta = {
  id: 'quiz',
  name: 'Quiz',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 330,
  posterFrame: 230,
  motion: ['Flip cards', 'Countdown timer', 'Stamp'],
  scenes: [
    {type: 'question', from: 0, duration: 90, focus: 50, roles: ['headline', 'quote']},
    {type: 'list', from: 90, duration: 170, focus: 140, roles: ['items']},
    {type: 'end-screen', from: 260, duration: 70, focus: 36, roles: ['cta']},
  ],
};
