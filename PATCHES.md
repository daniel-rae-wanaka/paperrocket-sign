# paperrocket-sign patches

Local changes on top of upstream Documenso. Re-apply on each rebase. Each patch point carries the comment `paperrocket-sign: AI stripped (Daniel, 13 Nov 2026)`.

## AI stripped

No files deleted, no dependencies or schema touched. The `GOOGLE_VERTEX_*` env vars now do nothing.

- `packages/lib/constants/app.ts`: `IS_AI_FEATURES_CONFIGURED()` always returns false (server and client). Every upstream AI gate keys off this.
- `packages/lib/utils/teams.ts`: `extractDerivedTeamSettings` forces `aiFeaturesEnabled = false`. Covers server `team.derivedSettings` and the client `team.preferences` (via `get-organisation-session`), so the `?ai=true` links in the upload button and drop zone are never added.
- `apps/remix/server/api/ai/route.ts`: no sub-routes registered, so `/api/ai/detect-fields` and `/api/ai/detect-recipients` return 404.
- `apps/remix/app/routes/embed+/v2+/authoring+/_layout.tsx`: embed authoring `preferences.aiFeaturesEnabled` set to false (two places).
- `apps/remix/app/components/general/envelope-editor/envelope-editor-fields-page.tsx`: "Detect fields with AI" button and dialogs only render when `IS_AI_FEATURES_CONFIGURED()` (now never). Hides the "enable AI" prompt.
- `apps/remix/app/components/general/envelope-editor/envelope-editor-recipient-form.tsx`: same for the recipient sparkles button and the AI recipient dialog (two places).
- `apps/remix/app/components/general/admin-global-settings-section.tsx`: removed the "AI features" row from the admin settings view.

Already hidden upstream by `IS_AI_FEATURES_CONFIGURED()`: the AI toggle in `document-preferences-form.tsx`.
Left alone (inert): AI docs pages, `.env.example`, `@ai-sdk/google-vertex` dependency, `aiFeaturesEnabled` DB columns and tRPC settings inputs, the unused dialog and server-only AI files.

## Upstream workflows removed

Only `.github/workflows/paperrocket.yml` runs in this fork (security audit, 13 Nov 2026). Deleted: ci, codeql-analysis, deploy, e2e-tests, first-interaction, issue-labeler, issue-opened, pr-labeler, publish, semantic-pull-requests, stale, translations-force-pull, translations-pull, translations-upload. On a rebase, if upstream changes one of these, keep it deleted.

## CI hardening (PAP-1457)

- `.github/actions/node-install/action.yml`: `actions/setup-node` pinned to a commit SHA (v4.4.0) instead of the `v4` tag. Every action in `.github/workflows/paperrocket.yml` is pinned the same way. On a rebase, keep the pins and re-pin when bumping.
- `.github/workflows/paperrocket.yml`: type-check and zoned-time unit test steps, pull requests on `pr/**` bases get CI, and a check step. `scripts/paperrocket/check-no-infra.sh` (ours, a plain grep) fails the build when the files we own, or the lines a PR adds, name a client, a host or a server path. Keep it on a rebase.

## Certificate and audit log

Redrawn to DESIGN.md "Certificate (PDF)" and "Times". The "Signing certificate provided by Documenso" credit is gone whatever `hidePoweredBy` says (the option is accepted and ignored). Branding (logo, `brandingColors.primary`, `brandingCompanyDetails`, organisation name) comes from the team's inherited branding settings, the same ones the emails use.

Upstream files touched:
- `packages/lib/server-only/pdf/render-certificate.ts`: rewritten (letterhead, facts grid, signer blocks, footer, zoned times, no credit).
- `packages/lib/server-only/pdf/render-audit-logs.ts`: rewritten to the same type, colours and header, content and structure kept, zoned times, no credit.
- `packages/lib/server-only/pdf/generate-certificate-pdf.ts`: loads PDF branding instead of the organisation claim, passes title, `documentMeta.timezone`, signing order and branding to the renderer.
- `packages/lib/server-only/pdf/generate-audit-log-pdf.ts`: loads PDF branding instead of the organisation claim, passes it to the renderer.
- `packages/lib/server-only/pdf/helpers.ts`: registers JetBrains Mono in `ensureFontLibrary`.
- `apps/remix/public/fonts/jetbrains-mono-regular.ttf`: added (JetBrains Mono Regular 2.304, OFL).

New files (not upstream): `packages/lib/server-only/pdf/format-zoned-time.ts` and `.test.ts`, `load-pdf-branding.ts`, `paperrocket-pdf-branding.ts`, `paperrocket-pdf-kit.ts`, and `scripts/paperrocket/render-certificate-snapshot.ts`.

## Templates

Emails rewritten to DESIGN.md "Email". New code lives in `packages/email/paperrocket/` (layout, parts, colour, logo, theme), `packages/lib/server-only/paperrocket/` (logo analysis and variants) and `apps/remix/server/api/paperrocket/` (logo route). `packages/email/template-components/` is left in place, unused by the templates. Lingui msgids changed, so non-English locales fall back to English until retranslated.

Upstream files touched:
- `packages/email/providers/branding.tsx`: optional `brandingName` and `brandingLogoMeta` on the branding context.
- `packages/lib/server-only/email/get-email-context.ts`: adds organisation name and logo metadata to `branding` (both returns).
- `apps/remix/server/router.ts`: mounts `/api/paperrocket/email-logo`.
- `packages/email/templates/access-auth-2fa.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/account-disabled.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/admin-user-created.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/bulk-send-complete.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/confirm-email.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/confirm-team-email.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-cancel.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-completed.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-created-from-direct-template.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-invite.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-pending.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-recipient-signed.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-rejected.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-rejection-confirmed.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-reminder.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-self-signed.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/document-super-delete.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/forgot-password.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-account-link-confirmation.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-delete.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-invite.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-join.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-leave.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-limit-alert.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/organisation-limits-updated.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/recipient-expired.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/recipient-removed-by-admin.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/recipient-removed-from-document.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/reset-password.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/team-delete.tsx`: rewritten on `PaperRocketEmail`, same exports and props.
- `packages/email/templates/team-email-removed.tsx`: rewritten on `PaperRocketEmail`, same exports and props.

New, not upstream: `scripts/paperrocket/render-snapshots.ts`.

## Brand pass (pr.2)

Nothing a signer, recipient or logged-out visitor sees says Documenso. The instance's own name comes from `NEXT_PUBLIC_BRAND_NAME` (unset: "Document signing"). New env vars: `NEXT_PUBLIC_BRAND_NAME`, `NEXT_PUBLIC_OIDC_PROVIDER_LOGO_URL`, `NEXT_PUBLIC_DISABLE_PASSKEY_SIGNIN`. Lingui msgids changed, so non-English locales fall back to English for the changed strings.

Upstream files touched:
- `packages/lib/constants/app.ts`: adds `BRAND_NAME()` and `SOURCE_CODE_URL`; the PDF signing reason fallback is now "Signed with <brand>".
- `apps/remix/app/utils/meta.ts`: rewritten brand-neutral (title, description, og and twitter tags; keywords, author and twitter:site removed).
- `packages/lib/jobs/definitions/emails/send-admin-user-created-email.handler.ts`: subject "Your signing account is ready".
- `packages/lib/jobs/definitions/emails/send-account-disabled-email.handler.ts`: subject "Your signing account has been disabled".
- `packages/lib/server-only/team/delete-team.ts`, `create-team-email-verification.ts`, `organisation/create-organisation-member-invites.ts`: " on Documenso" dropped from subjects.
- `packages/lib/server-only/2fa/setup-2fa.ts`: authenticator app issuer is the brand.
- `packages/lib/utils/authenticator.ts`: passkey relying party name is the brand.
- `apps/remix/app/routes/_recipient+/_layout.tsx`: tab title "Sign Document - <brand>".
- `apps/remix/app/routes/_recipient+/sign.$token+/_index.tsx`: removed the "Check out Documenso" marketing line on cancelled documents (two places).
- `apps/remix/app/routes/_unauthenticated+/articles.signature-disclosure.tsx`, `organisation.invite.$token.tsx`, `verify-email.$token.tsx`, `o.$orgUrl.signin.tsx`: product name replaced by the brand or dropped.
- `apps/remix/app/routes/_profile+/_layout.tsx`, `_profile+/p.$url.tsx`, `_share+/share.$slug.tsx`, `apps/remix/app/components/general/document/document-certificate-qr-view.tsx`: same, for public profile, share and QR certificate views.
- `apps/remix/app/components/general/public-legal-links.tsx`: always adds a quiet "Source code" link (AGPL section 13), so it shows in the sign-in footer, the signing page and the signer menu.
- `apps/remix/app/components/forms/signin.tsx`: optional OIDC logo image and the passkey button switch.
- `.env.example`, `docs/rolling-a-tag.md`: the new env vars.

Deliberately left (not visible to signers or logged-out visitors): admin and settings screens, API token and webhook dialogs, authenticated app header and nav, embed screens, expired-licence banner, organisation billing banner, support page, docs, the Documenso wordmark in `branding-logo.tsx` (shown only when a team has no logo set), sender name default (set by `NEXT_PRIVATE_SMTP_FROM_NAME`), `X-Documenso-*` mail and webhook headers, the email-2FA issuer (never shown).

## Brand pass (pr.2): app header mark

The logged-in header no longer shows the Documenso logo or wordmark. New `apps/remix/app/components/general/app-brand-mark.tsx` shows the organisation's own logo (`/api/branding/logo/organisation/<id>`, falls back when the route answers 404 or 400) and otherwise the `NEXT_PUBLIC_BRAND_NAME` text. Upstream files touched:
- `apps/remix/app/components/general/app-header.tsx`: `BrandingLogo` replaced by `AppBrandMark`.
- `apps/remix/app/components/general/app-nav-mobile.tsx`: Documenso logo image in the mobile menu replaced by `AppBrandMark`.
- `apps/remix/app/components/general/envelope-editor/envelope-editor-header.tsx`: non-embedded fallback logo replaced by `AppBrandMark`.
- `apps/remix/app/components/general/envelope-signing/envelope-signer-header.tsx`: fallback (no team logo) replaced by `AppBrandMark`.
- `apps/remix/app/routes/_profile+/_layout.tsx`: public profile header logos replaced by `AppBrandMark` (and the earlier alt text edit there is gone).
`branding-logo.tsx` stays for the embed, certificate and audit-log HTML routes.

## Replace PDF: tags win

When a replacement PDF carries `{{SIGNATURE, r1}}`-style tags, upstream kept every existing field and created the tagged ones on top, so each tagged field existed twice. Now, inside the same transaction and before `createMany`, existing fields on that envelope item whose (type, recipientId) pair a tag recreates are deleted. Other types and recipients stay.
- `packages/lib/server-only/envelope-item/replace-envelope-item-pdf.ts`: the delete before `createMany`.
New, not upstream: `packages/lib/server-only/envelope-item/select-fields-superseded-by-tags.ts` and `.test.ts` (pure choice of ids, unit tested).
