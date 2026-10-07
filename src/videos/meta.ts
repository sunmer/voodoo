import type {TemplateMeta} from './vocab.ts';
import {showreelMeta} from './showreel/meta.ts';
import {stackMeta} from './stack/meta.ts';
import {tickerMeta} from './ticker/meta.ts';
import {terminalMeta} from './terminal/meta.ts';
import {pulseMeta} from './pulse/meta.ts';
import {folioMeta} from './folio/meta.ts';

export const templateMeta: Record<string, TemplateMeta> = {
  [showreelMeta.id]: showreelMeta,
  [stackMeta.id]: stackMeta,
  [tickerMeta.id]: tickerMeta,
  [terminalMeta.id]: terminalMeta,
  [pulseMeta.id]: pulseMeta,
  [folioMeta.id]: folioMeta,
};
