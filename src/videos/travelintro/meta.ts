import type {TemplateMeta} from '../vocab.ts';

export const travelintroMeta: TemplateMeta = {
  id: 'travelintro',
  name: 'Travel Intro',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 150,
  motion: ['Route line', 'Zoom', 'Kinetic type', 'Pulse rings'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 210, focus: 80, roles: ['headline']},
    {type: 'date-card', from: 84, duration: 126, focus: 30, roles: ['date']},
    {type: 'logo-lockup', from: 104, duration: 106, focus: 30, roles: ['brand']},
  ],
};
