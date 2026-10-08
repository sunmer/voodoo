## Objective

Make cliphou.se easy to discover in Google and AI search, and make every template free to copy, modify, and share without legal ambiguity.

Positioning: **editable AI-made motion graphics templates**. Remotion is supporting proof. Do not lead with "open-source Canva alternative": US demand is small (`open source canva alternative`: 50/month), and its SERP is about static design tools such as Penpot.

Research: `output/growth-research-2026-10-08/report.md` in the local workspace. Key US monthly searches: `canva video editor` 49,500; `remotion` 12,100; `video templates` 1,600; `canva alternative` 590; `motion graphics templates` 480.

## Current state

Already implemented locally, not yet deployed:

- Homepage title, meta description, Open Graph, Twitter tags, and JSON-LD.
- Static `/about/` page with FAQ and FAQPage JSON-LD.
- `robots.txt`, `sitemap.xml`, and `llms.txt`.

`sitemap.xml` and `llms.txt` are static. They must become generated from `src/catalog/manifest.json`.

## Generation design

Add a build step that reads `src/catalog/manifest.json` on every deploy and generates the SEO pages and discovery files. Publishing a template keeps the current workflow: add the template, add one visible manifest entry with the required metadata, and deploy.

| Surface | Automation | Notes |
|---|---|---|
| Template pages | Fully automatic | Generated for every visible template. |
| Use-case pages | Gallery automatic | New templates appear when their purpose, format, or style matches. Intro and FAQ copy is written once and reused. |
| Remotion and AI-video pages | Partly automatic | Showcase updates automatically. Guide copy is human-written and updated occasionally. |
| Comparison pages | Mostly human-written | Relevant-template blocks can update automatically. Claims require human review because competitor features and prices change. |
| Sitemap, `llms.txt`, and update dates | Fully automatic | Replace the current static files with generated output. |

### Safeguards

1. **Quality metadata per template.** Every visible template must have a unique SEO description and accurate use-case tags. Fail the build when required fields are missing or duplicated.
2. **Thin-page threshold.** Publish a use-case page only when it has at least 3 matching visible templates. Exclude unpublished pages from the sitemap.

## Work

### 1. Indexable template pages

- Generate a static or prerendered page for every visible template at `/templates/<slug>/`.
- Generate the title, meta description, canonical URL, poster, preview video, format, duration, purpose, styles, scenes, editable text roles, and template license from the manifest.
- Add `VideoObject` and breadcrumb JSON-LD.
- Keep existing `/#/v/<variant-id>` links working. Do not index hidden variants.
- Add a short unique SEO description field for each template.

### 2. Use-case landing pages

- Generate pages from manifest facets, starting with:
  - `/motion-graphics-templates/`
  - `/product-launch-video-templates/`
  - `/instagram-reel-templates/`
  - `/youtube-intro-templates/`
  - `/saas-video-templates/`
- Populate each page's gallery automatically when a matching template is published.
- Store reusable intro text and FAQ copy per page.
- Publish a page only when it has at least 3 matching templates.

### 3. Remotion and AI-video pages

- Publish `/remotion-templates/`, with an automatically updated template showcase.
- Publish an honest guide to making motion graphics with Claude, ChatGPT, or another agent plus Remotion.
- Position cliphou.se as the finished gallery, editing layer, and agent handoff surface.

### 4. Comparison pages

- Publish `/canva-video-alternative/` and `/capcut-template-alternative/`.
- Compare discovery, motion quality, editing, export, licensing, and price using verifiable facts.
- Include an automatic block of relevant templates.
- Keep comparison claims human-reviewed and add a "last reviewed" date.

### 5. Open templates, trust, and measurement

**Licensing decision**

- Release all template code, template metadata, starter text, color presets, agent specs, and previews under one permissive license.
- Use **MIT-0** unless legal review recommends an equivalent no-attribution license. It lets anyone use, copy, modify, publish, distribute, sublicense, and sell the work without attribution.
- Put the license in a root `LICENSE` file and expose a simple notice on every template page: "Free to copy, modify, share, and use commercially. No attribution required."
- Do not require users to credit cliphou.se or template creators.
- Avoid a stack of disclaimers. Add one short page, `/license/`, explaining the template license in plain English.
- Call the catalog **open templates** or **free to remix**. Do not call the whole product open source while it depends on Remotion's separate source-available license.

**Remotion**

- cliphou.se must confirm that its own Remotion use qualifies for the free license, or buy a Company License.
- MP4 export on cliphou.se should be the primary path, so most users never need to run Remotion or understand its terms.
- The license page should state once, without legal clutter: "Rendering the code yourself uses Remotion, which has separate terms."
- Before launch, check whether the Remotion 5.0 license changes affect the plan.

**Trust and measurement**

- Show MP4 export status, creator credit as optional context, and template update dates.
- Connect Google Search Console and submit the generated sitemap.
- Track landing page to editor open, text edit, color edit, save, share, MP4 export, and render-command copy.

## Acceptance criteria

- Publishing a visible template automatically creates its template page and adds it to the sitemap, `llms.txt`, and every matching use-case or showcase page.
- Hidden variants remain usable by direct link but are not indexed.
- Every public page has a unique title, meta description, canonical URL, and valid JSON-LD.
- Every template states the same permissive license.
- Search Console receives the generated sitemap.
- Analytics shows conversion from each landing page.
