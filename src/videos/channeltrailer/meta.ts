import type {TemplateMeta} from '../vocab.ts';

export const channeltrailerMeta: TemplateMeta = {
  id: 'channeltrailer',
  name: 'Channel Trailer',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 60,
  motion: ['Zoom', 'Flip cards', 'Pulse rings'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 100, focus: 56, roles: ['brand', 'headline']},
    {type: 'grid', from: 100, duration: 110, focus: 70, roles: ['items']},
    {type: 'end-screen', from: 210, duration: 90, focus: 44, roles: ['date', 'cta']},
  ],
};
