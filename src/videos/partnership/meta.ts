import type {TemplateMeta} from '../vocab.ts';

export const partnershipMeta: TemplateMeta = {
  id: 'partnership',
  name: 'Partnership',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
  posterFrame: 96,
  motion: ['Split screen', 'Orbit', 'Line draw'],
  scenes: [
    {type: 'logo-lockup', from: 0, duration: 150, focus: 96, roles: ['brand', 'headline']},
    {type: 'date-card', from: 150, duration: 150, focus: 60, roles: ['subhead', 'date', 'cta']},
  ],
};
