# Template expansion: ranked list of 40 (#7)

Data: Google Ads Keyword Planner, United States, English, Google Search, September 2025 to August 2026. 204 keywords in 61 candidate types (`keywords.json`, `raw/google-ads.json`). Intent: SerpApi top 8 organic results for the lead query of each type (`raw/serpapi.json`). Baseline: `output/growth-research-2026-10-08`. Collected October 8, 2026 with `collect.mjs`.

Score: demand (template-intent volume), competition index (lower is better), commercial value (top-of-page bid), and contract fit (current or Phase 1 roles). Volume counts only queries whose results show template or motion intent.

## Excluded

| Type | Reason |
|---|---|
| Save the date, wedding invitation | Competition index 100 (#3) |
| Stream overlay, digital menu board | Competition index 100 / 99 |
| Funding announcement | Results are grant listings |
| Milestone video | Results are Milestone Systems |
| Episode recap | Results are court records (RECAP) |
| Waitlist announcement | Results are college admissions |
| Pricing video, discount video, tips video | Results are tutorials or unrelated sites |
| Animated map | Results are Google Maps and API docs |
| Product review, mission statement, chapter titles | Near-zero volume or no results |
| Slideshow, audiogram, launch countdown, opening titles | False positives documented in #3 |
| Lyric video, real estate listing | Need audio sync or photo upload |
| Back to school, holiday sale video | No measurable volume |

## Ranked list

Pilot templates (Phase 1, merged) are marked P.

| # | Template ID | Name | Lead queries (monthly searches / competition) | Max bid | Contract fields | Batch |
|---:|---|---|---|---:|---|---|
| 1 | `livestream` | Stream Starting Soon | stream starting soon 1,600/16; starting soon screen 1,000/25 | $35 | brand, headline, date, items, cta | P |
| 2 | `cybermonday` | Cyber Monday | cyber monday sale 9,900/6 | - | brand, headline, subhead, price, priceNote, date, cta | P |
| 3 | `counter` | Stat Counter | counter animation 880/1; number animation 140/5 | $51 | brand, headline, stat, subhead, attribution, cta | P |
| 4 | `barchart` | Animated Bar Chart | animated chart 390/8; bar chart race 390/2; animated bar chart 140/4 | $100 | brand, headline, subhead, chart, attribution | P |
| 5 | `hiring` | We Are Hiring | hiring video 70/28; job posting template 720/22 | $1,335 | brand, headline, subhead, items, date, cta | P |
| 6 | `newyear` | New Year Countdown | new year countdown 49,500/0; happy new year video 480/8 | - | brand, headline, date, subhead, cta | 1 |
| 7 | `credits` | End Credits | end credits template 1,900/9; rolling credits 1,600/4 | $549 | headline, items, brand, cta | 1 |
| 8 | `titlecard` | Title Card | title card 5,400/1; title screen 880/0; title card template 110/11 | $54 | brand, headline, subhead | 1 |
| 9 | `subscribe` | Subscribe Button | subscribe animation 390/13; like and subscribe animation 390/15 | $72 | brand, cta, subhead | 1 |
| 10 | `thankyou` | Thank You for Watching | thank you for watching 4,400/0; thank you video 1,000/1 | - | headline, subhead, brand, cta | 1 |
| 11 | `birthday` | Birthday Greeting | birthday animation 720/9; birthday video template 90/38 | $33 | headline, author, date, subhead | 1 |
| 12 | `valentines` | Valentine's Sale | valentines sale 3,600/33; valentines day video 320/5 | - | brand, headline, price, priceNote, date, cta | 1 |
| 13 | `beforeafter` | Before and After | before and after template 590/14; before and after video 140/4 | $28 | headline, point1, point2, brand, cta | 2 |
| 14 | `timeline` | Animated Timeline | animated timeline 390/4; timeline video 320/3 | $122 | headline, items, brand, attribution | 2 |
| 15 | `quiz` | Quiz | quiz video 590/2; trivia video 210/1 | - | headline, quote, items, cta | 2 |
| 16 | `toplist` | Top 5 Ranking | ranking video 320/3; list video 320/4; top 5 video 90/0 | $168 | headline, items, brand, cta | 2 |
| 17 | `poll` | This or That | this or that video 480/0 | - | headline, point1, point2, cta | 2 |
| 18 | `progress` | Progress Bar | progress bar animation 480/2; goal progress video | $96 | headline, stat, subhead, brand | 2 |
| 19 | `comparison` | Comparison | comparison template 210/2; comparison video 140/0 | - | headline, point1, point2, items, cta | 2 |
| 20 | `giveaway` | Giveaway | giveaway post 320/1; giveaway template 210/33 | $72 | brand, headline, items, date, cta | 3 |
| 21 | `channeltrailer` | Channel Trailer | channel trailer 170/3; youtube channel trailer 170/8 | $65 | brand, headline, items, date, cta | 3 |
| 22 | `gamingintro` | Gaming Intro | gaming intro 210/6; twitch intro 50/22 | $39 | brand, headline, subhead | 3 |
| 23 | `speaker` | Speaker Card | speaker announcement 390/55; speaker card 110/0 | $24 | headline, author, attribution, date, brand | 3 |
| 24 | `agenda` | Event Agenda | conference agenda 590/4 | $75 | headline, items, date, brand | 3 |
| 25 | `tickets` | Tickets on Sale | ticket launch 210/16 | $12 | brand, headline, date, price, cta | 3 |
| 26 | `webinar` | Webinar Invite | webinar invitation 140/14; webinar announcement 30/10 | $195 | brand, headline, author, date, cta | 3 |
| 27 | `comingsoon` | Coming Soon | coming soon video 210/10; coming soon template 110/16 | $60 | brand, headline, date, cta | 4 |
| 28 | `announcement` | Big Announcement | announcement template 390/33; announcement video 140/7 | $38 | brand, headline, subhead, cta | 4 |
| 29 | `teamintro` | Meet the Team | new employee announcement 320/4; meet the team video 40/5 | $114 | brand, headline, author, attribution, quote | 4 |
| 30 | `partnership` | Partnership | partnership announcement 210/2; collaboration announcement 50/0 | - | brand, headline, subhead, date, cta | 4 |
| 31 | `newsletter` | Newsletter Promo | newsletter announcement 260/8; subscribe to newsletter 590/40 | $137 | brand, headline, items, cta | 4 |
| 32 | `anniversary` | Company Anniversary | business anniversary 140/17; company anniversary video 30/40 | $130 | brand, headline, stat, date, cta | 4 |
| 33 | `grandopening` | Grand Opening | grand opening announcement 70/10; grand opening video 20/19 | $149 | brand, headline, date, attribution, cta | 4 |
| 34 | `apppromo` | App Promo | app promo video 140/48; mobile app promo 10/35 | $393 | brand, headline, items, price, cta | 5 |
| 35 | `pricing` | Pricing Plans | pricing announcement; price reveal video | $40 | brand, headline, price, priceNote, items, cta | 5 |
| 36 | `casestudy` | Case Study | case study video 110/33 | $189 | brand, headline, stat, quote, attribution, cta | 5 |
| 37 | `feature` | New Feature | new feature announcement 20/0; feature announcement 20/1 | - | brand, headline, items, date, cta | 5 |
| 38 | `quotecard` | Quote Animation | quote animation 260/0; motivational quote video 110/1 | - | quote, author, attribution, brand | 5 |
| 39 | `linechart` | Line Chart | animated graph video 10/29; animated chart 390/8 | $100 | headline, chart, subhead, attribution | 5 |
| 40 | `flashsale` | Flash Sale | flash sale 4,400/29; limited time offer video | $33 | brand, headline, price, priceNote, date, cta | 5 |

Seasonal timing: `cybermonday` (pilot) must ship before November 30. `newyear` must be live by early December. `valentines` must be live by mid January.

## Shared contract (Phase 1)

New text roles in `src/videos/vocab.ts`. All roles have `kit: false`.

| Role | Max | Format |
|---|---:|---|
| `attribution` | 48 | Free text: source, role, or company line |
| `date` | 32 | Free text: "Nov 30, ends midnight", "Today at 7 PM CET" |
| `price` | 12 | Must contain a digit: "$129", "€1,299" |
| `priceNote` | 24 | Free text: "Was $249", "per month" |
| `stat` | 12 | Must contain a digit: "12,480", "98%", "3.4x" |
| `items` | 120 | 2 to 6 comma-separated entries |
| `chart` | 96 | 2 to 6 "Label value" pairs, value suffix k, m, b, or % |

Parsers: `src/videos/shared/data.ts` exports `parseList`, `parseChart`, `parseNumber`, and `formatNumber`. Format rules come from one `roleError` function, which the schema, editor, build validation, and share server all use.

Image and logo upload: not implemented. It needs storage, moderation, share-server rendering, and source-package changes. No Phase 2 template depends on it. Image-based templates (real estate, photo slideshow) stay excluded.
