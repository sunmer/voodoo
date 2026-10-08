import type {TemplateMeta} from '../vocab.ts';

export const announcementMeta: TemplateMeta = {
  id: 'announcement',
  name: 'Big Announcement',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  posterFrame: 96,
  motion: ['Zoom', 'Kinetic type', 'Pulse rings'],
  scenes: [
    {type: 'announcement', from: 0, duration: 150, focus: 96, roles: ['brand', 'headline']},
    {type: 'tagline', from: 150, duration: 120, focus: 50, roles: ['subhead', 'cta']},
  ],
};
