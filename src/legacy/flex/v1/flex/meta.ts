import type {TemplateMeta} from '../vocab.ts';

export const flexMeta: TemplateMeta = {
  id: 'flex',
  name: 'Flex',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 48,
  motion: ['Variable type', 'Kinetic type', 'Wipes'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 84, focus: 48, roles: ['headline']},
    {type: 'list', from: 84, duration: 96, focus: 84, roles: ['point1', 'point2', 'point3']},
    {type: 'logo-lockup', from: 180, duration: 60, focus: 40, roles: ['brand', 'cta']},
  ],
};
