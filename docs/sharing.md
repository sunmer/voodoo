# Shared Videos

## Status

The implementation is locally tested. Production publishing is not enabled until the operator approves pay-as-you-go billing and Google sign-in is enabled. An unset `VITE_SHARE_API_ORIGIN` shows an unavailable state instead of generating a broken link.

## Contract

- Gallery cards show Edit and Star controls. Featured uses catalog order; there are no fabricated popularity metrics.
- Publishing requires a verified Google Firebase account. Browsing a shared link requires no account.
- `POST /api/shares` validates the exact text/color schema, then renders an immutable MP4 and JPEG. A retry of the same user's edit and render version reuses the completed link.
- `/s/<random-id>` serves actual HTML Open Graph metadata, not hash-route metadata or a JavaScript redirect.
- MP4 metadata supports Messages inline playback. The JPEG is specific to the published edit. Client apps decide whether to autoplay and can cache previews.
- Video delivery implements byte ranges for Safari. Media is capped below the Messages resource-size guideline.
- `GET /api/shares/<id>` returns public composition data, never account identifiers.
- `DELETE /api/shares/<id>` requires its owner's token. First-party caches expire after one minute; external copies cannot be recalled.
- Published links appear under the account. The newest 20 are shown. Local unpublished drafts remain separate from shared compositions.

## Storage And Limits

`shares/{id}` stores the immutable composition and its owner. `users/{uid}/shares/{id}` stores the owner's private link index. `shareJobs/{digest}` stores retry state. Cloud Storage holds private `shares/{id}/preview.jpg` and `video.mp4` objects. Only the server serves public assets.

The server permits one active render per instance, 10 render attempts per user per UTC day, and 100 per project per day. Firestore transactions enforce the daily limits across instances. Failed attempts count. Ready retries do not. Cloud Run should use two CPUs, 2 GiB memory, zero minimum instances, at most two instances, concurrency eight, and a 300-second timeout. Budget alerts are not a spending cap.

Do not enable public bucket access. Do not grant clients Firestore writes to share collections. Do not allow emulator environment variables in Cloud Run.

## Production Activation

1. Obtain explicit approval for billing and configure a project-filtered budget alert.
2. Validate the active gcloud identity and token. Keep using explicit `--project cliphouse-app`.
3. Link the approved billing account. Enable Cloud Run, Cloud Build, Artifact Registry, and Cloud Storage APIs.
4. Create `cliphouse-app-shares` in `europe-west1` with uniform bucket-level access and public-access prevention. Do not configure a lifecycle that deletes published objects.
5. Create `cliphouse-share@cliphouse-app.iam.gserviceaccount.com`. Grant project `roles/datastore.user` and `roles/firebaseauth.viewer`, plus bucket-scoped `roles/storage.objectUser`. Do not use a service-account key.
6. Grant the existing keyless GitHub deploy identity only the roles needed to build and deploy this service, including service-account-user on the runtime identity. Configure the Cloud Build identity's artifact and logging permissions. Do not widen access to other projects.
7. Build the frontend with `BASE=/` and the Firebase web configuration. Deploy the Dockerfile as `cliphouse-share` in `europe-west1`. Use the resource settings above and environment variables from the workflow. The first deployment establishes the direct Cloud Run HTTPS origin.
8. Set GitHub Actions variable `VITE_SHARE_API_ORIGIN` to that HTTPS origin. This variable activates the conditional share deployment and selects `firebase.sharing.json` on future pushes. Render requests use the direct origin because Firebase Hosting has a 60-second request limit.
9. Rebuild and deploy the frontend and service together so the Vite asset manifest matches. The share page reads `dist/.vite/manifest.json`; the Docker build must include hidden `.vite` files. `.gcloudignore` and `.dockerignore` exclude local secrets.
10. Enable Firebase's Google provider after approval of its public support contact. Verify authorized domains and a real Google login.
11. Test publishing, logged-out viewing, MP4 ranges, account isolation, repeat publishing, and owner deletion on the deployed service. Test an actual iMessage on an iPhone. Check DNS and HTTPS last.

Existing `firebase.json` deliberately retains static-only hosting until activation. Do not deploy that config after enabling sharing: use `firebase.sharing.json` or the conditional workflow.

## Verification

```sh
npm run build
npx tsc -p tsconfig.server.json
npm run test:sharing
npm run test:rules
npm run build:sharing
node scripts/smoke-sharing.cjs
node scripts/smoke-sharing.cjs --ios
```

The browser test defaults to a root-base Vite server on port 5183 with a configured share API origin. `TEST_LOGIN=true` adds Google emulator login, a failed publish, and a successful retry using an intercepted publishing response. API tests and real rendering are separate checks; these mocks do not prove production Cloud Run or iMessage behavior.

Source references:

- https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages
- https://firebase.google.com/docs/hosting/cloud-run
- https://www.remotion.dev/docs/renderer/render-media
