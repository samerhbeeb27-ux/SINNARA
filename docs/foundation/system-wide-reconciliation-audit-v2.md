# SINNARA System-Wide Architecture Reconciliation Audit v2.0

Status: **CONDITIONALLY READY**. The architecture remains coherent, but Document 13 must implement the explicit patch matrix before code synthesis.

## Mandatory patch families

- Root `CLAUDE.md` path and canonical skill directory names.
- Add `.claude/context/canonical-contracts.md`.
- Use repository markdown docs as runtime skill context, not DOCX paths.
- Split `opportunity_type` from `employment_type` with separate taxonomies.
- Make `official_apply_url` nullable before publication, mandatory at publication/recommendation.
- Canonicalize processing job `dead_letter` state and two-level document state machines.
- Freeze match components and current-match selection.
- Freeze canonical AIRequest, analytics envelope, notification persistence, and AI namespace semantics.
- Keep numeric match score internal/secondary.
- Keep deferred capabilities out of Phase 1.

## Core verdict

No redesign is required. Patch the contracts, then write Document 13 against the resulting canonical contract set.
