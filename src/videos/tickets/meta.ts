import type {TemplateMeta} from '../vocab.ts';

export const ticketsMeta: TemplateMeta = {
  id: 'tickets',
  name: 'Tickets on Sale',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 70,
  motion: ['Ticket stub', 'Split-flap', 'Stamp'],
  scenes: [
    {type: 'announcement', from: 0, duration: 120, focus: 70, roles: ['brand', 'headline', 'date']},
    {type: 'price-reveal', from: 120, duration: 120, focus: 60, roles: ['price', 'cta']},
  ],
};
