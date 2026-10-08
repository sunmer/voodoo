## Objective

Build the next templates around measured search demand. Mix high-volume, low-competition video types with niche types that have high commercial value.

## Research

Google Ads Keyword Planner, United States, English, September 2025 to August 2026: 89 keywords in 20 video-type clusters. Top organic results were checked with SerpApi to confirm template intent. Competition index ranges from 0 to 100.

Full tables and raw data: `output/growth-research-2026-10-08/report.md`, section "Video types to target".

The current catalog leans toward product launch videos, which have low search volume. Most measurable demand with low competition is in types the catalog does not have yet.

## Do not target these false positives

| Term | Monthly searches | Actual intent |
|---|---:|---|
| `slideshow template` | 90,500 | PowerPoint and Google Slides templates |
| `audiogram` | 12,100 | Hearing tests |
| `launch countdown` | 1,300 | Organizations named Launch |
| `opening titles` | 1,600 | Songs and TV title sequences |

## Build list

### Volume plays

| Template | Key queries, monthly searches | Competition | Contract fit |
|---|---|---:|---|
| Lower thirds pack | `lower thirds` 4,400; `lower third template` 390 | 8 / 41 | Current text roles work. |
| Kinetic typography | `kinetic typography` 1,600; `title animation` 260, rising | 17 / 11 | Current text roles work. |
| YouTube end screen and outro | `youtube end screen template` 720; `youtube outro template` 720 | 8 / 8 | Current text roles work. |
| Wordmark logo reveal | `logo animation` 4,400; `logo reveal` 320; `logo intro` 260 | 34 / 26 / 14 | A text wordmark works now. Image logo upload needs a new field. |
| YouTube intro | `youtube intro template` 590; `intro video template` 320 | 31 / 53 | Current text roles work. |
| Countdown | `countdown video` 480; `countdown timer video` 210 | 15 / 17 | Needs a numeric countdown field or derived timer. |
| Podcast intro | `podcast intro` 880 | 33 | Visual only. Audio is out of scope. |

### Niche plays

| Template | Key queries, monthly searches | Top-of-page bid | Contract fit |
|---|---|---:|---|
| Customer testimonial | `customer testimonial video` 210; `testimonial video template` 40 | $430 to $490 | Needs quote and author fields, or a documented mapping to existing roles. |
| Hiring announcement | `hiring video` 70 | $117 | Current text roles work. |

### Seasonal plays

| Template | Demand | Timing |
|---|---|---|
| Black Friday sale | `black friday video` 260, low competition | Build and publish before November. |
| Year in review or Wrapped | `wrapped template` 170; `year in review video` 90 | Build in November. Demand peaks in December. |

## Position existing templates

No new templates are needed for these types. Add tags and landing pages under issue #1.

- Reels, TikTok, and Shorts: `instagram reel templates` 2,400; `tiktok templates` 1,900; `youtube shorts template` 390. Position Stack, Glass, Collage, and Spotlight.
- Product and SaaS demos: `product launch video` 260; `product demo video` 170; `saas demo video` 50. Position Cursor, Bento, Glass, and Prism.

## Skip for now

- Wedding invitations and save-the-date videos: competition index 100.
- Lyric videos: these need audio sync.
- Real estate listings: these need photo upload.
- Stream overlays, transition packs, restaurant menus, and webinar promos: high competition or near-zero volume.

## Build order

1. Lower thirds pack
2. Kinetic typography
3. YouTube end screen and outro
4. Black Friday sale, before November
5. Wordmark logo reveal
6. Customer testimonial
7. YouTube intro
8. Year in review or Wrapped, in November
9. Countdown
10. Podcast intro

## Acceptance criteria

- Each new template is a standalone design with one visible gallery preset.
- Each template has an SEO description and purpose, format, and style tags that match its target queries.
- Each template passes typecheck, preset validation, inline editing, and preview rendering.
- Contract changes, such as countdown, quote, author, or logo image fields, are designed before the dependent template.
- The Black Friday template is live before November.
