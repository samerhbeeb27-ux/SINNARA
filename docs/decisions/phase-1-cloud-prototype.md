# Phase 1: cloud-only prototype

Status: implementation branch, not a live recruitment service.

This decision applies to the current phase and takes priority over earlier MVP sequencing in the foundation documents. Those documents remain useful references for later architecture.

## What this phase delivers

A static Next.js and TypeScript prototype in Arabic and English: searchable vacancies, location and field filters, vacancy details, saved jobs, a sample profile and explicit empty, closed, loading, offline and error states.

All six employers and vacancies are fictional. Deadlines and open/closed flags are fixed examples. There are no real applications, employer relationships, accounts, CVs or AI requests. The skills comparison is a direct intersection of selected skill IDs, not an AI score.

## Development and hosting

All source changes are made through GitHub. GitHub Actions builds and tests on standard hosted runners in this public repository. No local clone, dependencies or app server are required. No paid runners, caches or build artifacts are configured.

The static export is designed for Cloudflare Pages. The prototype branch disables Vercel Git deployments for itself, leaving other branches' configuration unchanged. Do not merge or change production hosting until the prototype has been reviewed.

The first cloud run generates a lockfile, which must be committed before treating the branch as reproducible. Following runs use npm ci.

## Product and design choices

- Text: near-black #111315. Background: warm off-white #FAF9F6.
- Main action: deep green #145C46. Supporting surfaces: sage #E6EFE8 and sand #D7C6A8.
- No external fonts, stock photos, animation packages or analytics.
- Arabic is a first-class route with RTL layout, logical CSS properties and bilingual search. Search normalises Arabic diacritics, alef forms and alif maqsura.
- Jobs can be explored without signing in. The original application channel will be explicit in a later phase.
- Work location, pay currency, informal experience and relocation questions are visible where useful. No claims about safety, transport or housing are inferred.
- Saved vacancy IDs remain in browser storage until cleared. The sample profile is in memory only and clears on a full reload, language change or exit.
- If storage is denied, saving falls back to memory. Offline status preserves interaction with already-loaded fixtures; this is not an offline PWA and a cold reload is not guaranteed.

## Phase gates

1. Prototype: pass build, type checks, browser flows and automated accessibility checks. Review desktop and Arabic mobile screenshots. Then test with five representative users before calling the design validated.
2. Vacancy operations: source permissions, expiry, deduplication, original application links, admin review and explicit listing verification levels. Start with a small manually curated inventory.
3. Accounts and profiles: Supabase project and schema review, least-privilege RLS, shared-device sign-out, export/deletion, private file handling. No candidate documents in public storage.
4. AI assistance: verify current Gemini availability, free-tier terms and country access. Keep keys server-side. Use consent, redaction, quotas, schema validation and fallbacks; never put real CV data through a free tier without checking its data-use terms. Evaluate Arabic and Sudanese examples before release.
5. Pilot: recruit a small opt-in employer and applicant group. Measure successful application handoffs and useful matches, not registrations alone. All employer outreach requires explicit approval.
6. Revenue: test employer willingness to pay after useful inventory and traffic exist. No payment integration or premium hosting is enabled now.

## Validation limits

Automated checks do not replace native-speaker usability review or testing on actual low-end phones and Sudanese mobile networks. The static fixture prototype does not prove production authentication, permissions, AI quality, inventory freshness or commercial viability.
