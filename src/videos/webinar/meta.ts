import type {TemplateMeta} from '../vocab.ts';

export const webinarMeta: TemplateMeta = {
  id: 'webinar',
  name: 'Webinar Invite',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 70,
  motion: ['Cursor', 'Slide-in', 'Typewriter'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 130, focus: 70, roles: ['brand', 'headline', 'author']},
    {type: 'date-card', from: 130, duration: 140, focus: 70, roles: ['date', 'cta']},
  ],
};
