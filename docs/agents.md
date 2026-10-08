# Agent Specs And Source Packages

Every cliphou.se video is deterministic code plus props. An agent can read it, edit it, and return it to cliphou.se or continue in its own project.

## Light Path: Text And Colors

- `/templates/<variant>/agent.json` is a static file. `/s/<share-id>/agent.json` comes from the share service. Neither needs JavaScript.
- Each spec has the template version, source hash, generation model and effort, current props, text roles and limits, color roles, scenes, format, a JSON Schema generated from zod, a handoff URL, and the source package link.
- Every catalog template must define `generation.model`, `generation.modelId`, `generation.provider`, and `generation.effort`. The build rejects missing values and agent names such as `Codex`.
- The handoff URL is `/#/v/<variant>?props=<url-encoded JSON>`. Older versions add `&v=<version>`. Encoded props are limited to 8,000 characters.
- The editor validates handoff props against the exact template schema. Unknown keys, missing keys, long text, blank text, control characters, and invalid colors are rejected with a message. Rejected props are not loaded, saved, published, or rendered. The handoff path never runs code.
- The editor's Copy agent link action copies the spec URL and the current edit as a handoff URL.

## Heavy Path: Source Packages

- `/source/<template>/v<version>.tar.gz` is a standalone Remotion project. It contains the component, schema, metadata, shared helpers, exact dependency versions, a lockfile, `props.json`, a README, and the MIT-0 license.
- Fonts install from pinned Fontsource packages. Templates use no network assets and no unseeded randomness.
- Render with `npm ci && npx remotion render src/index.ts <template> out/video.mp4 --props=props.json`.
- `npm run test:source-render -- <template>` extracts a package, installs it, and checks that its frame is byte-identical to the repository render.

## Versioning

- `src/videos/versions.json` lists the versions of each template. Packages in `public/source` are immutable.
- After a template or shared helper changes, run `npm run sources` and commit the result. The build fails when a package is out of date.
- `npm run sources` copies the superseded version into `src/legacy/` and regenerates `src/videos/legacy.ts` and `legacy-schemas.ts`. The editor, Remotion root (`<template>-v<version>`), and share server use those files, so existing saved and shared videos keep their original code.
- Drafts and shares store `templateVersion`. Records made before versioning use v1.

## License

Templates, presets, specs, and source packages use MIT-0. Remotion is a dependency with separate terms: https://remotion.dev/license
