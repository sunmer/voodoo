# voodoo

voodoo is a gallery of AI-generated Remotion videos. Users can find videos with faceted filters and change their text and colors in the browser without an AI call.

The live site is at https://sunmer.github.io/voodoo/. Each push to `main` deploys it through GitHub Pages.

## Run

```bash
npm install
npm run dev                 # http://localhost:5180/voodoo/
npm run studio              # Remotion Studio
node scripts/previews.mjs   # rebuild gallery posters and MP4 loops in public/previews
```

## Taxonomy

The catalog uses three levels:

- **Template:** code in `src/videos/<id>/`. It sets the scenes, motion, and timing. Its technical facts, such as size, fps, duration, scenes, and motion, are in `meta.ts`.
- **Variant:** an entry in `manifest.json`. It is a template plus preset text and theme values, plus curated facets: purpose, style, energy, and keywords. Users browse variants.
- **Remix:** a user's edit of a variant. A downloaded props file records its `template` and `parent`.

Facets come from different sources:

| Facet | Source |
|---|---|
| Format, duration, placement | Template size and fps |
| Scenes, motion | Template `meta.ts`. The timeline reads the same data. |
| Tone (dark or light) | Brightness of the theme background |
| Purpose, style, energy | Curated in `manifest.json`, using only `vocab` terms |

## Shared Roles

All templates use the text roles in `src/videos/vocab.ts`: `brand`, `headline`, `subhead`, `point1` to `point3`, and `cta`. All templates also use the same five theme roles. Because of this, the **brand kit** can apply one set of values to every video. Each card then shows one static Remotion frame with the user's text, but only while the card is on screen.

## Add A Template

1. Generate a composition that reads all text from `props.texts` with shared roles, and all color from `props.theme`.
2. Add `meta.ts` with its scenes. Each scene has `from`, `duration`, `focus`, and `roles`. Map the components to scenes in the same order.
3. Add the schema with `textsSchema([...roles])` and `themeSchema`, and register the template in `src/videos/registry.ts` and `src/videos/meta.ts`.
4. Add the template and its variants to `manifest.json`. Then run `node scripts/previews.mjs`.

## Notes

- Preset gallery cards autoplay muted MP4s when at least 35% visible. Scrolling away or hiding the page unloads them. Reduced-motion settings keep the poster, as does a rejected autoplay request.
- iPhone/iPad live compositions skip costly grain, blur, and selected 3D layers. Exported videos retain the full effects. Browser emulation cannot prove stability on every physical iPhone.
- The five additional families are Bento, Glass, Flex, Riso, and Collage, with two presets each. Flex measures glyph bounds to fit variable-width text.

## Verify

```bash
npm run build
node scripts/smoke.cjs
node scripts/smoke-ios.cjs
node scripts/smoke-media.cjs
node scripts/smoke-media.cjs --ios
```

Run the browser checks against the dev server, or set `URL` to the deployed site. Media checks cover viewport autoplay, background cleanup, blocked autoplay, reduced motion, complete editor loops, and Flex text fitting. Screenshots are viewport-sized and written under `/tmp/voodoo-*`.

Design reference: [Adobe's 2026 design trends](https://www.adobe.com/express/learn/blog/design-trends-2026), including tactile collage and playful typography. Playback reference: [WebKit's inline autoplay policies](https://webkit.org/blog/6784/new-video-policies-for-ios/).

## Rendering

- Remotion's downloaded headless Chrome hangs on this machine. `remotion.config.ts` and the preview script use Playwright's cached headless shell instead. To use another browser, set `REMOTION_BROWSER`.
- Remotion needs a company license above a small team size. See remotion.dev/license.
