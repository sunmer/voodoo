# voodoo

voodoo is a local prototype for a gallery of AI-generated Remotion videos. Users can find videos and change their text and colors in the browser without an AI call.

## Run

```bash
npm install
npm run dev        # gallery + editor at http://localhost:5180
npm run studio     # Remotion Studio for the compositions
```

To export an edited video, open a video and click **Render command**. Then run the copied command in this folder. The MP4 goes to `out/`.

## Structure

- `src/videos/contract.ts`: the editing contract. All text comes from `props.texts`. All colors come from `props.theme`. The `zod` schema creates the editor fields.
- `src/videos/showreel/`: one composition generated in the style of Claude output, with a schema.
- `src/videos/registry.ts`: maps composition IDs to their component, schema, size, fps, and duration.
- `src/catalog/manifest.json`: entries for discovery. Each entry is a composition with default props and metadata. Several entries can use the same composition.
- `src/catalog/catalog.ts`: gets the format and duration from the composition. Nobody enters these technical values by hand.
- `src/ui/`: the gallery, with search, filters, and sort, and the editor, with live Player, text, theme, undo and redo, and local autosave.

## Add A Video

1. Generate a composition that follows the contract. Its props must use the `{texts, theme}` shape, and it must have no hard-coded copy or colors.
2. Add the composition to `registry.ts`.
3. Add one or more entries to `manifest.json`. For `useCase`, `style`, and `mood`, use only `vocab` terms.

## Notes

- Remotion's downloaded headless Chrome hangs on this machine. `remotion.config.ts` uses Playwright's cached headless shell instead. To use another browser, set `REMOTION_BROWSER`.
- Gallery thumbnails use live paused Players. For thousands of videos, use MP4 loops rendered in advance.
- Remotion needs a company license above a small team size. See remotion.dev/license.
