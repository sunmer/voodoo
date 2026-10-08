import type {VideoSchema} from './contract.ts';
import {bentoSchema} from './bento/schema.ts';
import {blackfridaySchema} from './blackfriday/schema.ts';
import {collageSchema} from './collage/schema.ts';
import {countdownSchema} from './countdown/schema.ts';
import {cursorSchema} from './cursor/schema.ts';
import {endscreenSchema} from './endscreen/schema.ts';
import {flexSchema} from './flex/schema.ts';
import {folioSchema} from './folio/schema.ts';
import {glassSchema} from './glass/schema.ts';
import {kineticSchema} from './kinetic/schema.ts';
import {lowerthirdSchema} from './lowerthird/schema.ts';
import {podcastSchema} from './podcast/schema.ts';
import {prismSchema} from './prism/schema.ts';
import {pulseSchema} from './pulse/schema.ts';
import {risoSchema} from './riso/schema.ts';
import {showreelSchema} from './showreel/schema.ts';
import {sliceSchema} from './slice/schema.ts';
import {spotlightSchema} from './spotlight/schema.ts';
import {stackSchema} from './stack/schema.ts';
import {swissSchema} from './swiss/schema.ts';
import {terminalSchema} from './terminal/schema.ts';
import {testimonialSchema} from './testimonial/schema.ts';
import {tickerSchema} from './ticker/schema.ts';
import {wordmarkSchema} from './wordmark/schema.ts';
import {wrappedSchema} from './wrapped/schema.ts';
import {ytintroSchema} from './ytintro/schema.ts';
import {hiringSchema} from './hiring/schema.ts';
import {livestreamSchema} from './livestream/schema.ts';
import {barchartSchema} from './barchart/schema.ts';
import {counterSchema} from './counter/schema.ts';
import {cybermondaySchema} from './cybermonday/schema.ts';

// Schemas without React components, so build scripts and the share server can validate props.
export const schemas = {
  bento: bentoSchema, blackfriday: blackfridaySchema, collage: collageSchema, countdown: countdownSchema,
  cursor: cursorSchema, endscreen: endscreenSchema, flex: flexSchema, folio: folioSchema, glass: glassSchema,
  kinetic: kineticSchema, lowerthird: lowerthirdSchema, podcast: podcastSchema, prism: prismSchema,
  pulse: pulseSchema, riso: risoSchema, showreel: showreelSchema, slice: sliceSchema, spotlight: spotlightSchema,
  stack: stackSchema, swiss: swissSchema, terminal: terminalSchema, testimonial: testimonialSchema,
  ticker: tickerSchema, wordmark: wordmarkSchema, wrapped: wrappedSchema, ytintro: ytintroSchema,
  hiring: hiringSchema, livestream: livestreamSchema, barchart: barchartSchema, counter: counterSchema, cybermonday: cybermondaySchema,
} as unknown as Record<string, VideoSchema>;
