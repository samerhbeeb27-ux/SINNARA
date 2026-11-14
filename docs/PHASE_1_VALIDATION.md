# Phase 1 validation

Review: https://github.com/samerhbeeb27-ux/SINNARA/pull/1

All development, dependency installation, builds and browser tests took place remotely. No local application checkout or development server was used.

## Checks

GitHub Actions runs npm ci, TypeScript validation, a Next.js static export and 14 Playwright checks on a standard Ubuntu hosted runner. The checks cover:

- Bilingual search, location and category filters, URL persistence and empty results.
- Saving, reloading, clearing and denied/malformed browser storage.
- Vacancy details, simulated application handoff, closed vacancies and browser back.
- Temporary profile preferences and direct skill comparison.
- Arabic HTML language/direction and normalised search.
- Error recovery, loading, invalid vacancy links and browser offline mode.
- Keyboard skip link, focus and bookmark state.
- English and Arabic mobile views at 360px, including detail and profile overflow checks.
- A compressed initial JavaScript budget of 500 KiB.
- Automated axe checks for WCAG A/AA issues on browse, detail, profile and saved views in both languages.

The revised prototype passed all 14 checks on 14 November 2026. The measured initial script payload was approximately 182 KiB compressed. English desktop and English/Arabic mobile screenshots were visually reviewed. The PR Checks tab is the current source of truth for the latest commit.

## Remaining validation

This is a fictional-data prototype, not a production service. Hosting validation on Cloudflare, native-speaker user feedback, five-person task testing and actual low-end device/network testing are still required. Automated accessibility checks are limited and do not certify complete WCAG compliance.

No tests of live Supabase, Gemini, employer applications or real vacancy ingestion were performed because those integrations are intentionally outside this phase.
