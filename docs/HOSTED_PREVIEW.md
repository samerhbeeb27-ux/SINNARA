# Hosted prototype verification

User-supplied public URL: https://sinnara.pages.dev/

The existing Phase 1 pull request remains the development branch. Source, builds and tests stay in GitHub and Cloudflare; no local checkout or server is required.

The cloud workflow now checks both the fresh static export and the actual hosted site. Hosted tests reuse the browsing, saving, profile, Arabic, mobile, offline and accessibility checks. Additional checks verify the language chooser, server-rendered language/direction, noindex and security response headers, favicon and unknown-route handling.

The live checks are restricted to the approved prototype hostname. They operate only on fictional vacancies and browser-local sample state. They do not contact employers or send applications.

A successful live check confirms the deployed behaviours tested, not the exact Git commit. Cloudflare's deployment dashboard is authoritative for the deployed commit. See the PR checks for the latest result.

After hosting is verified, Phase 2 focuses on vacancy permissions and provenance, deadline handling, duplicate detection and a reviewed publishing process before real listings are introduced.
