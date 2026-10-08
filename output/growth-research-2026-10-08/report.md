# cliphou.se positioning and on-site SEO research

Checked 8 October 2026 for the United States and English. Google Ads Keyword Planner data covers September 2025 to August 2026. Google Trends data covers five years through SerpApi. Organic SERPs were collected through SerpApi because the BrightData `serp_api2` jobs were accepted but remained pending.

## Recommendation

Position cliphou.se as **editable motion graphics templates**, with **AI-made** and **Remotion-based** as supporting proof. Do not use "open-source Canva alternative" as the main promise.

Recommended homepage message:

> Browse AI-made motion graphics templates for launches, reels, and ads. Edit text and colors in your browser, then share or render with Remotion.

## Evidence

| Query | US avg monthly searches | Competition | Interpretation |
|---|---:|---|---|
| `ai video generator` | 246,000 | Medium | Large but dominated by generative-video tools; poor product fit. |
| `capcut templates` | 110,000 | Low | Large template-discovery demand, but brand/platform-specific. |
| `canva video editor` | 49,500 | Low | Strong Canva video intent; better as a comparison page than core positioning. |
| `remotion` | 12,100 | Low | Strong developer ecosystem demand, rising sharply in Trends. |
| `video templates` | 1,600 | Low | Directly relevant category demand. |
| `canva video templates` | 880 | Low | Relevant comparison/template demand. |
| `canva alternative` | 590 | Low | Useful comparison intent, but mostly static design tools. |
| `motion graphics templates` | 480 | Medium | Exact category fit; SERP is winnable with a strong gallery. |
| `ai motion graphics` | 480 | Medium | Emerging category fit. |
| `remotion templates` | 140 | Low | Small, high-fit developer intent. |
| `claude video generator` | 90 | Medium | Small; confirms some intent but not a primary keyword. |
| `open source canva alternative` | 50 | Low | Too small and mismatched. |
| `canva open source alternative` | 30 | Low | Too small and mismatched. |

Google Trends, five years, US, compares each term's last 12 months with the previous 12 months:

- `remotion`: very strong growth from a low base.
- `ai motion graphics`: strong growth.
- `canva video templates`: strong growth.
- `canva alternative`: moderate growth.
- `motion graphics templates`: modest growth.

Trends values are relative indexes, so they show direction rather than search volume.

## SERP pattern

- `open source canva alternative` returns Penpot, Graphite, GitHub projects, Reddit, and FOSS lists. Searchers expect static graphic design or prototyping tools.
- `canva alternative` returns broad listicles and design tools such as Polotno, Moda, Snappa, and Zapier comparisons.
- `motion graphics templates` returns Jitter, Motion Array, LottieLab, Envato, Uppbeat, Canva, and Adobe Stock.
- `remotion templates` returns Remotion's official templates, React Video Editor, GitHub collections, and small template sites.
- `claude video generator` returns MCP and Claude Code tools, YouTube, Reddit, and AI video generators. Google's AI Overview states that Claude lacks native video generation but can use external tools.

## Market gap

Your hypothesis has evidence. People ask how Claude can make videos, and Remotion demand is rising, but SERPs mostly show raw tools, prompts, starters, and generators. There are few visual galleries of finished, editable, code-generated motion graphics. The gap is discovery plus no-code editing for AI-made Remotion compositions.

Avoid "open source" claims until the repository has an explicit license, a public source link, and a contributor path. Remotion's company license requirements also make an unqualified open-source promise risky.

## Implemented

- Homepage title, meta description, Open Graph, Twitter text, and WebSite/WebApplication JSON-LD.
- Static `/about/` page with crawlable FAQ content and FAQPage JSON-LD.
- `robots.txt`, `sitemap.xml`, and `llms.txt`.
- A hidden gallery H1 for accessible page structure.

## Top five next on-site actions

1. **Make each template indexable.** Hash routes such as `/#/v/stack-kicklab` are weak SEO URLs. Create static or prerendered `/templates/<slug>/` pages with unique titles, descriptions, poster images, video previews, use cases, formats, scenes, editable text roles, and VideoObject JSON-LD. This is the highest-impact fix.
2. **Build use-case landing pages.** Start with `/motion-graphics-templates/`, `/product-launch-video-templates/`, `/instagram-reel-templates/`, `/youtube-intro-templates/`, and `/saas-video-templates/`. Each page needs a filtered gallery, short buying guidance, and an FAQ.
3. **Own Remotion and AI-video intent.** Publish `/remotion-templates/` and an honest guide to generating motion graphics with Claude or ChatGPT plus Remotion. Show cliphou.se as the finished-gallery and editing layer.
4. **Publish comparison pages carefully.** Create `/canva-video-alternative/` and `/capcut-template-alternative/`. Compare discovery, motion quality, editing, export, licensing, and pricing factually. Avoid unsupported "open source" or "better than" claims.
5. **Add trust and measurement.** Add a clear license and commercial-use page, MP4 export status, creator credits, and template update dates. Connect Search Console, submit the sitemap, and track editor opens, edits, saves, shares, and render-command copies by landing page.

## Video types to target

Second Keyword Planner pass, same scope: 89 keywords in 20 video-type clusters. Search intent was checked with SerpApi organic results.

Four high-volume terms are false positives. Do not target them:

- `slideshow template`, 90,500: the results are PowerPoint and Google Slides templates.
- `audiogram`, 12,100: the results are about hearing tests.
- `launch countdown`, 1,300: the results are organizations named Launch.
- `opening titles`, 1,600: the results are songs and TV title sequences.

### Volume plays: real template intent, low competition, not yet in the catalog

| Template to build | Key queries, monthly US searches | Competition index | Fit with current contract |
|---|---|---:|---|
| Lower thirds pack | `lower thirds` 4,400; `lower third template` 390 | 8 / 41 | Strong: `brand` = name, `headline` = title. 16:9 with transparent-style backgrounds. |
| Logo or wordmark reveal | `logo animation` 4,400; `logo reveal` 320; `logo intro` 260 | 34 / 26 / 14 | Medium: a wordmark reveal works now. Image-logo upload needs a new contract field. |
| Kinetic typography | `kinetic typography` 1,600; `title animation` 260, rising 39% | 17 / 11 | Strong: this is what the templates already do well. |
| YouTube end screen and outro | `youtube end screen template` 720; `youtube outro template` 720 | 8 / 8 | Strong: 16:9 with subscribe CTA and video-slot placeholders. |
| TikTok, Reels, and Shorts template | `instagram reel templates` 2,400; `tiktok templates` 1,900; `youtube shorts template` 390 | 15 / 4 / 3 | Covered partly by Stack, Glass, Collage, and Spotlight. Tag and position them for these terms. |
| YouTube intro | `youtube intro template` 590; `intro video template` 320 | 31 / 53 | Strong: 5 to 8 second 16:9 opener. |
| Countdown | `countdown video` 480; `countdown timer video` 210 | 15 / 17 | Medium: needs a numeric countdown role or derived timer. |
| Podcast intro | `podcast intro` 880 | 33 | Strong visually. Audio is out of scope. |

### Niche plays: low volume, high commercial value

Top-of-page bids show what advertisers pay for these clicks. These terms suit B2B users who also fit Cursor, Bento, and Pulse.

| Template to build | Key queries, searches | Top-of-page bid | Notes |
|---|---|---:|---|
| Customer testimonial or quote | `customer testimonial video` 210; `testimonial video template` 40 | $430 to $490 | No template yet. High value per visitor. Needs `quote` and `author` roles or a mapped role pattern. |
| Product and SaaS demo | `product launch video` 260; `product demo video` 170; `saas demo video` 50 | $187 to $305 | Already covered by Cursor, Bento, Glass, and Prism. Build landing pages, not templates. |
| Hiring announcement | `hiring video` 70 | $117 | Small. Fast to build. Good LinkedIn fit. |
| Real estate listing | `real estate video template` 70; `listing video` 20, rising 75% | $79 to $202 | Needs image slots. Defer until image upload exists. |

### Seasonal plays

- `black friday video`: 260, peaks in November with low competition. Build now so it can rank before the peak.
- `wrapped template` 170 and `year in review video` 90: both peak in December. Build in November.

### Skip for now

- Wedding invitations, save-the-date videos, and invitation makers: competition index 100.
- Lyric videos: `lyric video maker` 3,600, but the results are AI and audio tools. It needs audio sync, which the templates do not support.
- Stream overlays, transitions packs, restaurant menus, and webinar promos: high competition or near-zero volume.

### Build order

1. Lower thirds pack
2. Kinetic typography
3. YouTube end screen and outro
4. Black Friday sale, timed for November
5. Wordmark logo reveal
6. Customer testimonial
7. YouTube intro
8. Year in review or Wrapped, built in November
9. Countdown
10. Podcast intro

The current catalog leans heavily toward product launches, which have low search volume. Lower thirds, logo reveals, kinetic typography, and YouTube templates carry most of the measurable demand with low competition.

## Raw data

- `raw/google-ads.json`: Keyword Planner historical metrics and keyword ideas.
- `keyword-metrics.json`: normalized metrics.
- `raw/google-trends.json`: Google Trends time series.
- `raw/serpapi-serps.json`: organic results, AI Overviews, and related questions.
- `raw/brightdata-serps.json`: BrightData timeout records.
- `raw/video-types-ads.json` and `video-types.json`: video-type keyword metrics.
- `raw/intent-serps.json`: intent checks for high-volume video-type terms.
