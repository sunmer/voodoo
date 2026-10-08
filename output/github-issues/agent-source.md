## Objective

Let a user point Claude, ChatGPT, Codex, or another agent at a cliphou.se video URL. The agent must be able to read a deterministic source, modify the video, and return it to cliphou.se or continue in the user's own environment.

## Current state

Each video is reproducible from:

1. Template code: `src/videos/<template>/<Template>.tsx`, `meta.ts`, and `schema.ts`.
2. Props JSON: `{texts, theme}`.

Templates bundle fonts, use no network assets, and use seeded randomness. The same template version and props render the same video.

Current editor URLs use hash routes, such as `/#/v/stack-kicklab`. Agents cannot reliably read them without JavaScript.

## Ship two levels

| | Light: edit spec | Heavy: full source |
|---|---|---|
| Agent reads | Editable text roles, max lengths, color roles, current values, scenes, format, version | Remotion component, schema, meta, shared helpers, fonts, pinned dependencies |
| Agent changes | Text, colors, and template choice | Layout, motion, timing, scenes, and code |
| Result runs | Live editor on cliphou.se | User's Remotion project or coding agent |
| Risk | Low, using existing validation | Higher, requiring version pinning and source packaging |

## Work

### Light edit spec

- Publish crawlable JSON at:
  - `/templates/<slug>/agent.json`
  - `/s/<share-id>/agent.json`
- Generate a JSON Schema from the existing zod schema.
- Include template ID, template version or commit hash, current props, allowed roles, max lengths, color roles, scenes, format, duration, and source license.
- Include short agent instructions: edit only allowed fields, return valid props JSON, and use the handoff URL.
- Add an open link such as `/templates/<slug>/?props=<encoded>` that opens the live editor with validated props.
- Reject invalid or oversized props with a clear error. Never execute agent-provided code in this path.
- Add a "Copy agent link" action on template, saved, and shared video pages.

### Heavy source package

- Publish a pinned source package for each template version.
- Include the component, schema, meta, required shared helpers, bundled fonts, `package.json`, lockfile or exact versions, example props, and one render command.
- Link the package from `agent.json` and the template page.
- Keep the same props compatible with the light spec.
- Include the permissive template license selected in the growth issue.

### Versioning

- Assign every published template an immutable version.
- Store the template version in saved drafts and share links.
- Keep old versions renderable after a template changes.
- Show the version and source commit in both spec and source package.

## Acceptance criteria

- An agent can read `agent.json` without JavaScript.
- An agent can change text and colors and produce a URL that opens the exact result in cliphou.se.
- Invalid agent output cannot be saved, published, or rendered.
- A coding agent can download the pinned source package and render the same video locally.
- Changing a template does not change existing saved or shared videos.
- Tests cover schema export, valid handoff, invalid handoff, version pinning, and deterministic local render.
