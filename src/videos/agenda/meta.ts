import type {TemplateMeta} from '../vocab.ts';

export const agendaMeta: TemplateMeta = {
  id: 'agenda',
  name: 'Event Agenda',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 160,
  motion: ['Line draw', 'Stagger list', 'Slide-in'],
  scenes: [
    {type: 'date-card', from: 0, duration: 90, focus: 50, roles: ['brand', 'headline', 'date']},
    {type: 'timeline', from: 90, duration: 180, focus: 90, roles: ['items']},
  ],
};
