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
import {Cursor} from './cursor/Cursor';
import {cursorSchema} from './cursor/schema';
import {Spotlight} from './spotlight/Spotlight';
import {spotlightSchema} from './spotlight/schema';
import {Slice} from './slice/Slice';
import {sliceSchema} from './slice/schema';
import {Swiss} from './swiss/Swiss';
import {swissSchema} from './swiss/schema';
import {Prism} from './prism/Prism';
import {prismSchema} from './prism/schema';
import {Lowerthird} from './lowerthird/Lowerthird';
import {lowerthirdSchema} from './lowerthird/schema';
import {Kinetic} from './kinetic/Kinetic';
import {kineticSchema} from './kinetic/schema';
import {Endscreen} from './endscreen/Endscreen';
import {endscreenSchema} from './endscreen/schema';
import {Blackfriday} from './blackfriday/Blackfriday';
import {blackfridaySchema} from './blackfriday/schema';
import {Wordmark} from './wordmark/Wordmark';
import {wordmarkSchema} from './wordmark/schema';
import {Testimonial} from './testimonial/Testimonial';
import {testimonialSchema} from './testimonial/schema';
import {Ytintro} from './ytintro/Ytintro';
import {ytintroSchema} from './ytintro/schema';
import {Wrapped} from './wrapped/Wrapped';
import {wrappedSchema} from './wrapped/schema';
import {Countdown} from './countdown/Countdown';
import {countdownSchema} from './countdown/schema';
import {Podcast} from './podcast/Podcast';
import {podcastSchema} from './podcast/schema';
import {Hiring} from './hiring/Hiring';
import {hiringSchema} from './hiring/schema';
import {Livestream} from './livestream/Livestream';
import {livestreamSchema} from './livestream/schema';
import {Barchart} from './barchart/Barchart';
import {barchartSchema} from './barchart/schema';
import {Counter} from './counter/Counter';
import {counterSchema} from './counter/schema';
import {Cybermonday} from './cybermonday/Cybermonday';
import {cybermondaySchema} from './cybermonday/schema';
import {Comingsoon} from './comingsoon/Comingsoon';
import {comingsoonSchema} from './comingsoon/schema';
import {Announcement} from './announcement/Announcement';
import {announcementSchema} from './announcement/schema';
import {Teamintro} from './teamintro/Teamintro';
import {teamintroSchema} from './teamintro/schema';
import {Partnership} from './partnership/Partnership';
import {partnershipSchema} from './partnership/schema';
import {Newsletter} from './newsletter/Newsletter';
import {newsletterSchema} from './newsletter/schema';
import {Anniversary} from './anniversary/Anniversary';
import {anniversarySchema} from './anniversary/schema';
import {Grandopening} from './grandopening/Grandopening';
import {grandopeningSchema} from './grandopening/schema';
import {Beforeafter} from './beforeafter/Beforeafter';
import {beforeafterSchema} from './beforeafter/schema';
import {Timeline} from './timeline/Timeline';
import {timelineSchema} from './timeline/schema';
import {Quiz} from './quiz/Quiz';
import {quizSchema} from './quiz/schema';
import {Toplist} from './toplist/Toplist';
import {toplistSchema} from './toplist/schema';
import {Poll} from './poll/Poll';
import {pollSchema} from './poll/schema';
import {Progress} from './progress/Progress';
import {progressSchema} from './progress/schema';
import {Comparison} from './comparison/Comparison';
import {comparisonSchema} from './comparison/schema';
import {Newyear} from './newyear/Newyear';
import {newyearSchema} from './newyear/schema';
import {Credits} from './credits/Credits';
import {creditsSchema} from './credits/schema';
import {Titlecard} from './titlecard/Titlecard';
import {titlecardSchema} from './titlecard/schema';
import {Subscribe} from './subscribe/Subscribe';
import {subscribeSchema} from './subscribe/schema';
import {Thankyou} from './thankyou/Thankyou';
import {thankyouSchema} from './thankyou/schema';
import {Birthday} from './birthday/Birthday';
import {birthdaySchema} from './birthday/schema';
import {Valentines} from './valentines/Valentines';
import {valentinesSchema} from './valentines/schema';
import {legacy} from './legacy';
import {currentVersion} from '../agent/versions';
import {Apppromo} from './apppromo/Apppromo';
import {apppromoSchema} from './apppromo/schema';
import {Pricing} from './pricing/Pricing';
import {pricingSchema} from './pricing/schema';
import {Casestudy} from './casestudy/Casestudy';
import {casestudySchema} from './casestudy/schema';
import {Feature} from './feature/Feature';
import {featureSchema} from './feature/schema';
import {Quotecard} from './quotecard/Quotecard';
import {quotecardSchema} from './quotecard/schema';
import {Linechart} from './linechart/Linechart';
import {linechartSchema} from './linechart/schema';
import {Flashsale} from './flashsale/Flashsale';
import {flashsaleSchema} from './flashsale/schema';
import {Giveaway} from './giveaway/Giveaway';
import {giveawaySchema} from './giveaway/schema';
import {Channeltrailer} from './channeltrailer/Channeltrailer';
import {channeltrailerSchema} from './channeltrailer/schema';
import {Gamingintro} from './gamingintro/Gamingintro';
import {gamingintroSchema} from './gamingintro/schema';
import {Speaker} from './speaker/Speaker';
import {speakerSchema} from './speaker/schema';
import {Agenda} from './agenda/Agenda';
import {agendaSchema} from './agenda/schema';
import {Tickets} from './tickets/Tickets';
import {ticketsSchema} from './tickets/schema';
import {Webinar} from './webinar/Webinar';
import {webinarSchema} from './webinar/schema';

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
  cursor: {...templateMeta.cursor, component: Cursor, schema: cursorSchema as unknown as VideoSchema},
  spotlight: {...templateMeta.spotlight, component: Spotlight, schema: spotlightSchema as unknown as VideoSchema},
  slice: {...templateMeta.slice, component: Slice, schema: sliceSchema as unknown as VideoSchema},
  swiss: {...templateMeta.swiss, component: Swiss, schema: swissSchema as unknown as VideoSchema},
  prism: {...templateMeta.prism, component: Prism, schema: prismSchema as unknown as VideoSchema},
  lowerthird: {...templateMeta.lowerthird, component: Lowerthird, schema: lowerthirdSchema as unknown as VideoSchema},
  kinetic: {...templateMeta.kinetic, component: Kinetic, schema: kineticSchema as unknown as VideoSchema},
  endscreen: {...templateMeta.endscreen, component: Endscreen, schema: endscreenSchema as unknown as VideoSchema},
  blackfriday: {...templateMeta.blackfriday, component: Blackfriday, schema: blackfridaySchema as unknown as VideoSchema},
  wordmark: {...templateMeta.wordmark, component: Wordmark, schema: wordmarkSchema as unknown as VideoSchema},
  testimonial: {...templateMeta.testimonial, component: Testimonial, schema: testimonialSchema as unknown as VideoSchema},
  ytintro: {...templateMeta.ytintro, component: Ytintro, schema: ytintroSchema as unknown as VideoSchema},
  wrapped: {...templateMeta.wrapped, component: Wrapped, schema: wrappedSchema as unknown as VideoSchema},
  countdown: {...templateMeta.countdown, component: Countdown, schema: countdownSchema as unknown as VideoSchema},
  podcast: {...templateMeta.podcast, component: Podcast, schema: podcastSchema as unknown as VideoSchema},
  hiring: {...templateMeta.hiring, component: Hiring, schema: hiringSchema as unknown as VideoSchema},
  livestream: {...templateMeta.livestream, component: Livestream, schema: livestreamSchema as unknown as VideoSchema},
  barchart: {...templateMeta.barchart, component: Barchart, schema: barchartSchema as unknown as VideoSchema},
  counter: {...templateMeta.counter, component: Counter, schema: counterSchema as unknown as VideoSchema},
  cybermonday: {...templateMeta.cybermonday, component: Cybermonday, schema: cybermondaySchema as unknown as VideoSchema},
  apppromo: {...templateMeta.apppromo, component: Apppromo, schema: apppromoSchema as unknown as VideoSchema},
  pricing: {...templateMeta.pricing, component: Pricing, schema: pricingSchema as unknown as VideoSchema},
  casestudy: {...templateMeta.casestudy, component: Casestudy, schema: casestudySchema as unknown as VideoSchema},
  feature: {...templateMeta.feature, component: Feature, schema: featureSchema as unknown as VideoSchema},
  quotecard: {...templateMeta.quotecard, component: Quotecard, schema: quotecardSchema as unknown as VideoSchema},
  linechart: {...templateMeta.linechart, component: Linechart, schema: linechartSchema as unknown as VideoSchema},
  flashsale: {...templateMeta.flashsale, component: Flashsale, schema: flashsaleSchema as unknown as VideoSchema},
  comingsoon: {...templateMeta.comingsoon, component: Comingsoon, schema: comingsoonSchema as unknown as VideoSchema},
  announcement: {...templateMeta.announcement, component: Announcement, schema: announcementSchema as unknown as VideoSchema},
  teamintro: {...templateMeta.teamintro, component: Teamintro, schema: teamintroSchema as unknown as VideoSchema},
  partnership: {...templateMeta.partnership, component: Partnership, schema: partnershipSchema as unknown as VideoSchema},
  newsletter: {...templateMeta.newsletter, component: Newsletter, schema: newsletterSchema as unknown as VideoSchema},
  anniversary: {...templateMeta.anniversary, component: Anniversary, schema: anniversarySchema as unknown as VideoSchema},
  grandopening: {...templateMeta.grandopening, component: Grandopening, schema: grandopeningSchema as unknown as VideoSchema},
  beforeafter: {...templateMeta.beforeafter, component: Beforeafter, schema: beforeafterSchema as unknown as VideoSchema},
  timeline: {...templateMeta.timeline, component: Timeline, schema: timelineSchema as unknown as VideoSchema},
  quiz: {...templateMeta.quiz, component: Quiz, schema: quizSchema as unknown as VideoSchema},
  toplist: {...templateMeta.toplist, component: Toplist, schema: toplistSchema as unknown as VideoSchema},
  poll: {...templateMeta.poll, component: Poll, schema: pollSchema as unknown as VideoSchema},
  progress: {...templateMeta.progress, component: Progress, schema: progressSchema as unknown as VideoSchema},
  comparison: {...templateMeta.comparison, component: Comparison, schema: comparisonSchema as unknown as VideoSchema},
  newyear: {...templateMeta.newyear, component: Newyear, schema: newyearSchema as unknown as VideoSchema},
  credits: {...templateMeta.credits, component: Credits, schema: creditsSchema as unknown as VideoSchema},
  titlecard: {...templateMeta.titlecard, component: Titlecard, schema: titlecardSchema as unknown as VideoSchema},
  subscribe: {...templateMeta.subscribe, component: Subscribe, schema: subscribeSchema as unknown as VideoSchema},
  thankyou: {...templateMeta.thankyou, component: Thankyou, schema: thankyouSchema as unknown as VideoSchema},
  birthday: {...templateMeta.birthday, component: Birthday, schema: birthdaySchema as unknown as VideoSchema},
  valentines: {...templateMeta.valentines, component: Valentines, schema: valentinesSchema as unknown as VideoSchema},
  giveaway: {...templateMeta.giveaway, component: Giveaway, schema: giveawaySchema as unknown as VideoSchema},
  channeltrailer: {...templateMeta.channeltrailer, component: Channeltrailer, schema: channeltrailerSchema as unknown as VideoSchema},
  gamingintro: {...templateMeta.gamingintro, component: Gamingintro, schema: gamingintroSchema as unknown as VideoSchema},
  speaker: {...templateMeta.speaker, component: Speaker, schema: speakerSchema as unknown as VideoSchema},
  agenda: {...templateMeta.agenda, component: Agenda, schema: agendaSchema as unknown as VideoSchema},
  tickets: {...templateMeta.tickets, component: Tickets, schema: ticketsSchema as unknown as VideoSchema},
  webinar: {...templateMeta.webinar, component: Webinar, schema: webinarSchema as unknown as VideoSchema},
};

// Saved and shared videos keep the template version they were made with.
export function compositionFor(template: string, version = currentVersion(template)): CompositionDef {
  if (version === currentVersion(template)) return compositions[template];
  const old = legacy[template]?.[version];
  if (!old) throw new Error('This video uses a template version that this site no longer includes.');
  return old;
}
