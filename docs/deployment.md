# cliphou.se Deployment

## Architecture

- Firebase Hosting serves the static Vite build, posters, and video loops.
- Firebase Authentication handles Google sign-in.
- Cloud Firestore stores private starred video IDs and server timestamps.
- GA4 loads automatically without a consent banner, as requested by the operator.
- GitHub remains the source repository: `sunmer/voodoo`.

Project ID: `cliphouse-app`. Firestore is in `europe-north1`. GA4 property: `558014868`; web stream: `16063585293`; measurement ID: `G-P7DHJKS5RW`. Use an explicit `--project` argument for every cloud operation. Do not change the global gcloud project or use the existing Autorank backend.

## Launch Gate

Do not switch DNS until all of these checks pass:

1. Firebase is enabled on `cliphouse-app`.
2. The Google sign-in provider is enabled.
3. Firestore exists and `firestore.rules` is deployed.
4. The app has the Firebase web configuration and a real GA4 web measurement ID.
5. The Firebase-hosted URL loads the production build.
6. Google sign-in works from that URL.
7. Two different Google accounts cannot see each other's saved videos.
8. The GA4 web stream has enhanced measurement disabled. Manual page views handle hash routes. Set the property time zone to Europe/Stockholm and review data retention and sharing settings.
9. Both `cliphou.se` and `www.cliphou.se` are added in Firebase Hosting.
10. Google OAuth authorized domains and redirect URIs include the deployed auth domain. Add localhost only for development.
11. The operator has approved a public privacy contact and the privacy notice includes it. The Google login email is not automatically permission to publish it as a contact address.

The web Firebase config is public. Private Google credentials, service-account files, and OAuth secrets must not enter the repository or client bundle.

## Production Build

Populate the values documented in `.env.example`, then run:

```bash
BASE=/ npm run build
firebase deploy --project cliphouse-app --only firestore:rules,hosting
```

Use workload identity federation for GitHub Actions rather than a long-lived service-account key. Scope the identity to this repository and the production branch. Deploy rules and hosting together when their contract changes.

Keep the old GitHub Pages build on `/voodoo/` until the custom-domain site is verified. A root-base build cannot be dropped into a project subdirectory unchanged.

## Loopia

In Loopia Customer Zone, select `cliphou.se`, then open **DNS-editor**.

The Hosting API returned these site-specific records on October 7, 2026:

| Host | Type | Value |
|---|---|---|
| `@` | A | `199.36.158.100` |
| `@` | TXT | `hosting-site=cliphouse-app` |
| `www` | CNAME | `cliphouse-app.web.app` |

Both domains are registered with Firebase Hosting. `www` redirects to the apex. The current Loopia parking addresses, `194.9.94.85` and `194.9.94.86`, must be removed at `@` and `www` when applying these records. Preserve unrelated records.

- Add the ownership TXT record that Firebase supplies under `@`.
- Point `@` to the Firebase-provided A record.
- Add `www.cliphou.se` in Firebase and configure it to redirect to `cliphou.se`.
- Point `www` to the address Firebase supplies for that domain.
- Remove conflicting web A, AAAA, or CNAME records only at the names being moved.
- Keep email MX, SPF, DKIM, DMARC, and other unrelated TXT records.
- Keep Firebase's ownership TXT record after setup.
- Leave the Loopia nameservers in place. DNS records, not web forwarding, route the site.

Wait until Firebase shows **Connected** and both domains pass HTTPS checks. Certificate provisioning can take up to 24 hours after correct DNS propagation. Start the cutover before the public launch.

## Quotas

This is a video gallery, so watch Hosting data transfer as well as Firestore reads. The free Spark plan can stop serving after its allowance is exhausted. Do not assume a social launch will remain inside that allowance. Enabling paid usage is a separate billing decision; configure budget alerts first. Budget alerts are not spending caps.

## Operational Checks

- `npm run build`
- `npm test`
- `npm run test:rules`
- `node scripts/smoke-analytics.cjs` against a test Analytics configuration
- `node scripts/smoke-sync.cjs` against local Firebase emulators
- Existing mobile, iOS, inline-edit, and media smoke tests
- Real iPhone Safari and social in-app browser checks
- Verify Analytics page views and actions in GA4 Realtime after deployment

Review the published privacy notice before launch. Account deletion requests currently require operator handling: delete that user's bookmark documents as well as the Firebase Auth user. Deleting only the Auth user does not automatically delete Firestore documents.

The operator requested automatic Analytics without a consent screen. Google Analytics policies and applicable local laws can still require consent or other controls. This implementation should not be represented as privacy-law compliant without review.

## References

- https://firebase.google.com/docs/hosting/custom-domain
- https://firebase.google.com/docs/hosting/usage-quotas-pricing
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://support.loopia.se/wiki/dnseditorn-a-och-cname/
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
