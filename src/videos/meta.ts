import type {TemplateMeta} from './vocab.ts';
import {showreelMeta} from './showreel/meta.ts';
import {stackMeta} from './stack/meta.ts';
import {tickerMeta} from './ticker/meta.ts';
import {terminalMeta} from './terminal/meta.ts';
import {pulseMeta} from './pulse/meta.ts';
import {folioMeta} from './folio/meta.ts';
import {bentoMeta} from './bento/meta.ts';
import {glassMeta} from './glass/meta.ts';
import {flexMeta} from './flex/meta.ts';
import {risoMeta} from './riso/meta.ts';
import {collageMeta} from './collage/meta.ts';
import {cursorMeta} from './cursor/meta.ts';
import {spotlightMeta} from './spotlight/meta.ts';
import {sliceMeta} from './slice/meta.ts';
import {swissMeta} from './swiss/meta.ts';
import {prismMeta} from './prism/meta.ts';

export const templateMeta: Record<string, TemplateMeta> = {
  [showreelMeta.id]: showreelMeta,
  [stackMeta.id]: stackMeta,
  [tickerMeta.id]: tickerMeta,
  [terminalMeta.id]: terminalMeta,
  [pulseMeta.id]: pulseMeta,
  [folioMeta.id]: folioMeta,
  [bentoMeta.id]: bentoMeta,
  [glassMeta.id]: glassMeta,
  [flexMeta.id]: flexMeta,
  [risoMeta.id]: risoMeta,
  [collageMeta.id]: collageMeta,
  [cursorMeta.id]: cursorMeta,
  [spotlightMeta.id]: spotlightMeta,
  [sliceMeta.id]: sliceMeta,
  [swissMeta.id]: swissMeta,
  [prismMeta.id]: prismMeta,
};
