import type React from 'react';
import type {TemplateMeta, VideoSchema} from './contract';
import {templateMeta} from './meta';
import {Showreel} from './showreel/Showreel';
import {showreelSchema} from './showreel/schema';
import {Stack} from './stack/Stack';
import {stackSchema} from './stack/schema';
import {Ticker} from './ticker/Ticker';
import {tickerSchema} from './ticker/schema';
import {Terminal} from './terminal/Terminal';
import {terminalSchema} from './terminal/schema';
import {Pulse} from './pulse/Pulse';
import {pulseSchema} from './pulse/schema';
import {Folio} from './folio/Folio';
import {folioSchema} from './folio/schema';

import {Bento} from './bento/Bento';
import {bentoSchema} from './bento/schema';

import {Glass} from './glass/Glass';
import {glassSchema} from './glass/schema';

import {Flex} from './flex/Flex';
import {flexSchema} from './flex/schema';

import {Riso} from './riso/Riso';
import {risoSchema} from './riso/schema';

import {Collage} from './collage/Collage';
import {collageSchema} from './collage/schema';

export type CompositionDef = TemplateMeta & {
  component: React.FC<any>;
  schema: VideoSchema;
};

// One entry per template. Catalog variants reference these by id.
export const compositions: Record<string, CompositionDef> = {
  showreel: {...templateMeta.showreel, component: Showreel, schema: showreelSchema as unknown as VideoSchema},
  stack: {...templateMeta.stack, component: Stack, schema: stackSchema as unknown as VideoSchema},
  ticker: {...templateMeta.ticker, component: Ticker, schema: tickerSchema as unknown as VideoSchema},
  terminal: {...templateMeta.terminal, component: Terminal, schema: terminalSchema as unknown as VideoSchema},
  pulse: {...templateMeta.pulse, component: Pulse, schema: pulseSchema as unknown as VideoSchema},
  folio: {...templateMeta.folio, component: Folio, schema: folioSchema as unknown as VideoSchema},
  bento: {...templateMeta.bento, component: Bento, schema: bentoSchema as unknown as VideoSchema},
  glass: {...templateMeta.glass, component: Glass, schema: glassSchema as unknown as VideoSchema},
  flex: {...templateMeta.flex, component: Flex, schema: flexSchema as unknown as VideoSchema},
  riso: {...templateMeta.riso, component: Riso, schema: risoSchema as unknown as VideoSchema},
  collage: {...templateMeta.collage, component: Collage, schema: collageSchema as unknown as VideoSchema},
};
