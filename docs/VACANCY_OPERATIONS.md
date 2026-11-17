# Vacancy operations: Phase 2A

## Implemented

A runtime-validated inventory contract in src/lib/vacancy-inventory.ts. Every cloud build checks data/vacancies.json before building the site. A public-field projection is written to the temporary .inventory-build directory only.

The real inventory starts empty. The public interface still uses separate fictional fixtures. Connecting reviewed inventory to the interface is Phase 2B. This change does not publish real adverts, create an admin portal, scrape sites or send messages.

## Editor workflow

1. Record a draft with a stable vacancy ID.
2. Confirm the original advert and employer's application channel. A social repost alone does not establish employer identity or publication permission.
3. Record the basis: employer submission, written permission or a licence covering the intended use. Keep evidence in private storage. Only an opaque reference belongs in this public repository. Never commit consent emails, signatures, private notes or candidate data, even on a draft.
4. Record source-check and review timestamps with explicit offsets. Provide accurate Arabic and English content. Do not infer salary, relocation support or unstated deadlines.
5. Approve through a reviewed GitHub change. Cloud checks reject invalid records and unresolved duplicates. Publication will use the allowlisted projection after UI integration and review.

JSON declarations are not authentication, proof of permission or legal verification. A trusted editor must substantiate them. GitHub access is the current editor boundary; a later admin service needs authentication, permissions and audit trails.

## Rules

- Approved adverts require source and application URLs, original advert reference, permission reference and reviewer reference.
- Only HTTPS public-hostname-shaped URLs are accepted. No URLs are fetched. These syntax checks do not verify DNS, redirects, employer identity or destination safety.
- Dates require explicit offsets. Clarify date-only deadlines rather than inventing a timezone or time. Unknown deadlines are null.
- Expiry takes effect at the exact deadline. Sources need rechecking after seven days. Seven days is an initial editorial policy, not a market statistic.
- Draft, withdrawn, expired and stale records do not enter the public projection.
- Duplicate IDs and source/reference pairs are blocked. Known tracking parameters are ignored; meaningful query values and fragments are preserved.
- Similar roles at the same employer and city require review. For genuinely distinct adverts, review.distinctFrom records the other vacancy ID and an opaque review-evidence reference. This cannot override exact source duplication.
- Salary amounts require a currency and payment period. There is no exchange-rate conversion or salary estimation.
- Unexpected fields and internal review/permission metadata are excluded from the public projection. This cannot hide anything already committed to a public Git repository.

## No local tools required

Use GitHub's browser editor and pull requests. The cloud build automatically runs npm run validate:inventory. The empty real inventory is intentional, with a test guard until the reviewed-data interface is ready.

The output is not currently served. Once connected, eligibility must also be evaluated at read time: a static build alone cannot remove an advert when its deadline passes. No daily scheduler or automatic source recheck is enabled.

## Next slice

Build an editor preview and the public vacancy adapter, including source labels and original application links. Keep fictional examples clearly separate. Use a small permission-cleared sample before introducing real adverts. Accounts, candidate documents and AI remain later phases.
