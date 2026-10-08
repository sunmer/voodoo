import type {TemplateMeta} from '../vocab.ts';

export const cybermondayMeta: TemplateMeta = {
  id: 'cybermonday',
  name: 'Cyber Monday',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 130,
  motion: ['Glitch', 'Counter', 'Ticket stub'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 80, focus: 40, roles: ['brand', 'headline']},
    {type: 'price-reveal', from: 80, duration: 110, focus: 50, roles: ['subhead', 'price', 'priceNote']},
    {type: 'date-card', from: 190, duration: 80, focus: 36, roles: ['date', 'cta']},
  ],
};
