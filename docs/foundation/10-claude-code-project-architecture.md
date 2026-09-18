# **SINNARA** 

## **Claude Code Project Architecture** 

v1.0 | Developer Experience, Context, Memory & Tooling Specification 

_A controlled-autonomy workspace for production-grade AI software delivery_ 

|**Document control**|**Value**|
|---|---|
|Status|Foundation specification for Claude Code execution|
|Predecessors|Documents 1–9 + Foundation Reconciliation Review v1.0|
|Primaryarchitecture|Modular monolith: Next.js / React / TypeScript / Supabase|
|Primaryimplementation agent|Claude Code with bounded autonomyand mandatoryverification|
|Core principle|Creative implementation inside strict architectural and security<br>contracts|
|Document owner|SINNARA founder /product owner with architectural review authority|



SINNARA | Claude Code Project Architecture v1.0 

### **Executive Summary** 

Document 10 defines the operating environment in which Claude Code will build SINNARA. It is not merely a folder convention. It is a control system for preserving architecture, reducing context waste, making sessions resumable, constraining tool access, and ensuring that implementation autonomy produces evidence rather than unsupported claims. 

Claude Code is treated as a highly capable implementation partner, not as the owner of product truth. It may optimize code, refine UI details, improve abstractions, add tests, and handle edge cases. It may not silently redefine database ownership, RLS behavior, AI Gateway boundaries, matching semantics, document-processing states, or deferred scope. 

Operating model Foundation documents -> indexed project rules -> scoped task brief -> Claude Code implementation -> automated verification -> human/architect review for protected changes -> checkpoint + decision record -> mergeable increment 

#### **Non-negotiable operating principles** 

- Repository documentation is part of the product, not an optional explanation layer. 

- The smallest relevant context is preferable to loading every foundation document into every session. 

- The current code, migrations, tests, and decision records must agree. Any disagreement is a defect or an explicitly recorded transition. 

- Every important AI, parser, scorer, migration, security, and source-intelligence change is versioned and reviewable. 

- Claude Code must distinguish facts observed in the repository from assumptions, proposals, and unresolved questions. 

- No task is complete without verification commands, results, changed files, and known limitations. 

### **1. Workspace Hierarchy & File System Mapping** 

#### **1.1 Canonical repository tree** 

sinnara/ ├── .claude/ │├── CLAUDE.md │├── settings.json │├── settings.local.json              # ignored; developer-local only │├── commands/ ││├── start-task.md ││├── verify-change.md ││├── checkpoint.md ││├── restore-session.md ││└── review-protected-change.md │├── agents/ ││├── architecture-reviewer.md ││├── qa-reviewer.md ││├── security-reviewer.md ││└── documentation-reviewer.md │├── skills/ ││├── database-change/ ││├── ai-gateway-change/ ││├── ingestion-adapter/ ││├── matching-change/ ││├── document-pipeline/ ││└── release-verification/ │├── memory/ ││├── active-task.md ││├── current-state.md ││├── known-bugs.md ││├── deferred-debt.md ││├── decisions-index.md 

SINNARA | Claude Code Project Architecture v1.0 

││├── verification-history.md ││└── session-log.md │└── context/ │ ├── document-index.md │ ├── domain-map.md │ ├── protected-contracts.md │ └── task-brief-template.md ├── docs/ │├── 00-document-index.md │├── 01-mvp-product-blueprint.md │├── 02-technical-architecture.md │├── 03-data-model-database-schema.md │├── 04-ai-architecture-data-contracts.md │├── 05-job-intelligence-source-ingestion.md │├── 06-ux-product-experience.md │├── 07-growth-marketing-distribution.md │├── 08-security-privacy-trust.md │├── 09-roadmap-testing-framework.md │├── implementation/ ││├── api-contracts.md ││├── state-machines.md ││├── error-taxonomy.md ││├── observability.md ││└── runbooks.md │└── evaluations/ │ ├── dataset-card.md │ ├── ai-eval-protocol.md │ └── parser-benchmark.md ├── decisions/ │├── README.md │├── ADR-0001-modular-monolith.md │├── ADR-0002-ai-gateway-boundary.md │├── ADR-0003-document-processing-flow.md │├── ADR-0004-deterministic-matching.md │├── ADR-0005-private-document-storage.md │└── ADR-NNNN-short-title.md ├── src/ │├── app/                             # Next.js routes and UI entry points │├── components/                      # reusable presentation components │├── features/ ││├── auth/ ││├── candidate-profile/ ││├── documents/ ││├── claims/ ││├── opportunities/ ││├── matching/ ││├── applications/ ││├── career/ ││├── notifications/ ││└── admin/ │├── server/ ││├── db/ ││├── ai/ ││├── processing/ ││├── ingestion/ ││├── matching/ ││├── notifications/ ││├── analytics/ ││└── audit/ │├── lib/ ││├── env/ ││├── logging/ ││├── errors/ 

SINNARA | Claude Code Project Architecture v1.0 

- ││├── security/ ││└── validation/ │└── types/ ├── supabase/ │├── migrations/ │├── seed/ │├── functions/ │└── config.toml ├── tests/ │├── unit/ │├── integration/ │├── contract/ │├── e2e/ │├── evals/ │├── security/ │├── performance/ │└── fixtures/ ├── scripts/ │├── verify/ │├── benchmark/ │├── seed/ │└── maintenance/ ├── public/ ├── .env.example ├── .gitignore ├── package.json ├── tsconfig.json ├── playwright.config.ts ├── vitest.config.ts ├── eslint.config.mjs ├── README.md └── CHANGELOG.md 

#### **1.2 Directory responsibilities** 

|**Directory**|**Responsibility**|**Must not contain**|
|---|---|---|
|/docs|Stable product, architecture, security, UX,<br>growth, roadmap and operational<br>specifications|Unreviewed brainstorming or secrets|
|/decisions|Accepted architecture decisions, reversals,<br>tradeoffs and consequences<br>i|Routine implementation notes|
|/.claude|Claude-specific instructions, skills,<br>commands, context maps and session<br>memory|Application secrets, private PII, provider<br>credentials<br>i|
|/src/features|Domain-oriented user-facing modules and<br>feature orchestration|Provider-specific SDK sprawl or direct SQL<br>scattered through UI|
|/src/server|Server-only services, repositories, adapters<br>and workflows|Browser-importable secrets or UI-specific<br>state|
|/supabase/migrations|Ordered, immutable database migrations|Manual edits to already-applied migration<br>files|
|/tests|Executable verification evidence and fixtures|Real user documents or uncontrolled<br>production exports|
|/scripts|Repeatable developer and verification<br>automation|One-off undocumented destructive<br>commands|



#### **1.3 Scannability rules** 

- Use domain names that match the foundation documents: documents, claims, candidate-profile, opportunities, matching, applications, AI, ingestion. 

- Keep files small enough to inspect. Prefer one clear responsibility per file over giant service files. 

- Use explicit suffixes: `.schema.ts`, `.repository.ts`, `.service.ts`, `.adapter.ts`, `.policy.ts`, `.test.ts`, `.spec.ts`. 

- Do not hide security behavior in generic helpers whose names do not reveal access control. 

SINNARA | Claude Code Project Architecture v1.0 

- Place tests near the domain concept in `/tests`, while keeping production code free of test-only branching. 

- Avoid duplicate sources of truth. A contract belongs in one canonical module and is imported elsewhere. 

- Use index files only when they improve discoverability and do not create circular dependencies. 

#### **1.4 Documentation synchronization protocol** 

Code changes and specification changes must move together when behavior, contracts, security, or architecture changes. Documentation is not required for every refactor, but it is mandatory when a change affects externally visible behavior or a protected invariant. 

|**Change type**|**Required documentation action**|
|---|---|
|Internal refactor with identical behavior|Update code and tests; no ADR unless risk or boundarychanges|
|New API endpoint or response field|Update implementation API contract and relevant foundation<br>document if behavior is architectural|
|Database table, column, constraint, RLS or storage change|Migration + schema documentation + security review + ADR when<br>semantics change|
|AI task,prompt, schema, model orpolicychange|Version registryupdate + eval results + AI contract documentation|
|Matching formula, weights or eligibility rule|Algorithm version + benchmark results + matching documentation +<br>ADR|
|New source adapter or publishing channel|Source/channel contract + permissions/terms note + operational<br>runbook|
|Deferred feature activation|Feature flagrecord + scope review + acceptance criteria|



#### **1.5 ADR template** 

# ADR-NNNN: <Decision title> 

- Status: Proposed | Accepted | Superseded | Rejected - Date: YYYY-MM-DD - Owners: <names/roles> - Scope: <modules and contracts affected> - Related documents: <Document numbers and paths> 

## Context What problem or constraint requires a decision? 

## Decision State the chosen approach precisely. 

## Alternatives considered 1. Option A: advantages, disadvantages, cost, risk. 2. Option B: advantages, disadvantages, cost, risk. 

## Consequences - Positive: - Negative: - Operational: - Security/privacy: - Testing impact: - Reversal cost: ## Invariants preserved - ... ## Verification evidence - Commands: - Tests: - Benchmarks: - Review: ## Revisit trigger What evidence would justify revisiting this decision? 

SINNARA | Claude Code Project Architecture v1.0 

### **2. Context & Token-Efficiency Management Strategy** 

#### **2.1 Context loading hierarchy** 

Claude Code should load context in layers. The default session must not read all Documents 1–9 in full. It should identify the task domain, load the relevant contract summaries, inspect the exact code paths, and expand context only when a dependency or conflict is discovered. 

|**Layer**|**Always / conditionally loaded**|**Purpose**|
|---|---|---|
|L0: Root rules|`.claude/CLAUDE.md`, protected-<br>contracts.md|Non-negotiable boundaries and workflow|
|L1: Task brief|Current task only|Scope, acceptance criteria, files likely<br>affected|
|L2: Domain map|Relevant domain mapsection|Where code, tests, migrations and docs live|
|L3: Contract slice|Onlyrelevant sections of Documents 1–9|Exact behavior and invariants|
|L4: Implementation slice|Relevant source files and tests|Current code reality|
|L5: Evidence slice|Specific failing logs, migration diff, eval<br>fixture or trace|Resolve uncertainty without loading<br>unrelated history|
|L6: Historical context|Onlywhen needed|ADR,prior bug,previous session checkpoint|



#### **2.2 Document index** 

# docs/00-document-index.md 

- | Document | Canonical path | Primary domains | Load when | 

- |---|---|---|---| 

- | 01 Product Blueprint | docs/01-mvp-product-blueprint.md | scope, user value, MVP | feature intent or scope | 

- | 02 Technical Architecture | docs/02-technical-architecture.md | modules, runtime, hosting | architecture or infrastructure | 

| 03 Data Model | docs/03-data-model-database-schema.md | tables, RLS, migrations | DB, persistence, ownership | 

- | 04 AI Architecture | docs/04-ai-architecture-data-contracts.md | gateway, prompts, schemas | AI, extraction, explanations | 

- | 05 Job Intelligence | docs/05-job-intelligence-source-ingestion.md | sources, freshness, dedup | ingestion, opportunities | | 06 UX | docs/06-ux-product-experience.md | flows, states, accessibility | UI, interaction, responsive | 

- | 07 Growth | docs/07-growth-marketing-distribution.md | SEO, channels, telemetry | distribution, content | 

- | 08 Security | docs/08-security-privacy-trust.md | PII, RLS, storage, audit | security, privacy, auth | 

- | 09 Roadmap & Testing | docs/09-roadmap-testing-framework.md | phases, tests, gates | implementation and QA | 

#### **2.3 File slicing rules** 

- Read headings and directory listings before reading full files. 

- Read only the relevant function, type, migration, test, or documentation section first. 

- When a file is large, request bounded line ranges or search exact symbols before expanding. 

- Prefer source-of-truth files over generated output, copied snippets, or stale notes. 

- Do not paste full logs into context. Extract the first failure, stack trace, request ID, and relevant surrounding lines. 

- Do not repeatedly reread unchanged files. Record stable findings in the session checkpoint. 

- Use summaries for historical context and exact source for current behavior. 

- When context becomes crowded, stop implementation, write a checkpoint, and begin a focused continuation session. 

#### **2.4 Task brief template** 

# Task: <short imperative title> 

## Objective 

One sentence describing the user or system outcome. 

## Scope - In scope: - Out of scope: 

## Relevant contracts - Document: - ADR: 

SINNARA | Claude Code Project Architecture v1.0 

- Source modules: - Database migrations: - Test suites: ## Protected invariants - ... ## Acceptance criteria - [ ] ... - [ ] ... ## Verification commands - ... ## Known uncertainty - ... ## Stop conditions Stop and request review if: - a protected schema/security contract must change; - a migration is destructive or irreversible; - a provider/privacy policy is unclear; - a deferred feature becomes a dependency; - test evidence contradicts the specification. 

#### **2.5 Token-budget operating rules** 

|**Situation**|**Claude Code behavior**|
|---|---|
|Small bugin known file|Read task brief, target file, nearest tests;patch and verify|
|Cross-module feature|Read domain map, contracts, interfaces, tests, then implement<br>vertical slice|
|Architecture uncertainty|Stopbroad coding; inspect ADRs and write aproposal or spike|
|Repeated test failure|Capture exact failure and reduce context to the failing path|
|Long session with many edits|Checkpoint after each stable milestone; avoid carrying all prior<br>discussion<br>i|
|Prompt/model regression|Load only AI contract, prompt version, golden fixtures and failure<br>examples|
|Database/RLS issue|Load migration, policy, repository query, integration fixture and<br>securitycontract|



### **3. Claude Memory & Session Continuity Framework** 

#### **3.1 Memory file roles** 

|**File**|**Purpose**<br>i|**Update frequency**|
|---|---|---|
|active-task.md|Current task, scope, files, next action and<br>blockers|Every meaningful state change|
|current-state.md|Stable implementation status bymodule|At milestone completion|
|known-bugs.md|Reproducible defects with severity and<br>workaround|When discovered/resolved|
|deferred-debt.md|Explicitly deferred technical debt and revisit<br>triggers|When debt is added or retired|
|decisions-index.md|Quick index of ADRs and affected modules|Whenever ADR changes|
|verification-history.md|Commands, dates, results, environment and<br>caveats|After verification runs|
|session-log.md|Short chronological handoffhistory|At session close|



#### **3.2 Active task template** 

# Active Task 

SINNARA | Claude Code Project Architecture v1.0 

- Task ID: SINNARA-<phase>-<number> - Title: - Status: planned | active | blocked | verification | ready-for-review | complete - Started: - Last updated: - Owner: - Branch: - Commit: - Current objective: ## In scope - ... ## Out of scope - ... ## Protected contracts - ... ## Files inspected - ... ## Files changed - ... ## Current implementation state - Completed: - In progress: - Not started: ## Verification - Command: - Result: - Remaining failure: ## Blockers / decisions needed - ... ## Next exact action - ... ## Stop conditions - ... 

#### **3.3 Current state template** 

# Current State ## Candidate document pipeline - Upload: - Parse: - AI extraction: - Claim review: - Promotion: - Known gaps: ## Opportunity intelligence - Sources: - Fetch: - Normalize: - Dedup: - Quality gates: - Publication: 

SINNARA | Claude Code Project Architecture v1.0 

- Expiry: 

## Matching - Stage 1 eligibility: - Stage 2 score: - Explanation: - Algorithm version: - Eval status: 

## Platform 

- Auth: - Database: - Storage: - Observability: - Notifications: - Admin: 

## Release readiness - Security: - Performance: - E2E: - AI eval: - Backup/restore: 

#### **3.4 Session checkpoint workflow** 

1. Stop editing at a stable boundary. Do not checkpoint in the middle of a migration or partially applied refactor. 

2. Run the narrowest relevant tests, then the standard verification suite required by the task. 

3. Record exact commands and outcomes in verification-history.md. 

4. Update active-task.md with changed files, current state, failures, and the next exact action. 

5. Update current-state.md only for durable milestone changes. 

6. Record any new bug, debt, decision, or scope concern in its dedicated file. 

7. Write a concise session-log entry with branch/commit and restoration instructions. 

8. End with a clean working tree or explicitly list intentional uncommitted changes. 

#### **3.5 Restoration workflow** 

1. Read .claude/CLAUDE.md. 

2. Read .claude/memory/active-task.md. 

3. Read only the relevant section of current-state.md. 

4. Inspect git status, branch, and recent commits. 

5. Inspect files changed in the checkpoint. 

6. Run the checkpoint verification commands before making new edits. 

7. Reconcile any difference between checkpoint claims and repository reality. 

8. Continue from the exact "Next action", not from a broad restatement of the project. 

#### **3.6 Memory hygiene** 

- Never store secrets, access tokens, raw CVs, certificate images, phone numbers, personal email addresses, or provider payloads in memory files. 

- Use identifiers, hashes, filenames, and redacted summaries instead of private content. 

- Delete stale temporary notes after their durable information is moved to an ADR, bug, debt item, or documentation page. 

- Do not treat memory files as authoritative over code, migrations, tests, or accepted ADRs. 

- When memory conflicts with repository reality, repository reality wins and the discrepancy is recorded. 

SINNARA | Claude Code Project Architecture v1.0 

### **4. Model Context Protocol (MCP) & Connector Architecture** 

#### **4.1 Tooling philosophy** 

MCP servers and connectors should reduce friction without expanding the trust boundary unnecessarily. Every tool must have a clear purpose, minimal permissions, documented failure behavior, and an owner. More tools do not automatically mean better DX. 

|**Tool category**|**Permittedpurpose**|**Defaultposture**|
|---|---|---|
|Filesystem/repository|Read, search, edit, inspect diffs and<br>repositorystate|Enabled locally with project-root scope|
|Git|Status, diff, log, branch inspection, commit<br>preparation|Read by default; commits require explicit<br>task intent|
|Supabase/database|Inspect schema, run safe test queries, apply<br>controlled migrations in approved<br>environments|Read-only by default; production writes<br>prohibited in normal sessions|
|Local dev server|Start application, inspect routes, reproduce<br>UI behavior|Allowed in isolated local environment|
|Test runner|Run unit, integration, E2E, eval, performance<br>and securitychecks|Required for completion|
|Browser automation|Inspect rendered UI and execute Playwright<br>flows|Use only against local/staging targets|
|Issue/project tracker|Read or update task state if explicitly<br>connected|Minimal project scope|
|Externalprovider|Onlyapproved API calls needed for a task|No live PII bydefault|



#### **4.2 Illustrative MCP configuration** 

{ "mcpServers": { "filesystem": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace/sinnara"], "permissions": ["read", "write-within-root"] }, "git": { "command": "npx", "args": ["-y", "mcp-server-git", "--repository", "/workspace/sinnara"], "permissions": ["status", "diff", "log", "branch"] }, "supabase-local": { "command": "npx", "args": ["-y", "supabase-mcp-server", "--environment", "local"], "permissions": ["schema-read", "query-test-db", "migration-check"] }, "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp"], "permissions": ["local-browser", "screenshots", "trace"] } } } 

This configuration is illustrative. Exact server packages, command names, permission syntax, and supported capabilities must be verified against the installed Claude Code/MCP environment before adoption. The architectural rule is more important than a particular package: local, least-privilege, auditable, and replaceable. 

#### **4.3 Tool-use decision protocol** 

|**Need**|**Required action before coding**|
|---|---|
|Unknown repositorylocation|List/search files; do notguesspaths|
|Database behavior or schemaquestion|Inspect migrations/schema and relevant tests|



SINNARA | Claude Code Project Architecture v1.0 

|RLS/security question|Inspectpolicies and run a negative access test<br>i|
|---|---|
|AI output issue|Inspect gateway contract, prompt/schema versions, fixture and raw<br>validation error|
|UI issue|Run local app and inspect rendered state; use Playwright when<br>interaction matters|
|Performance claim|Run a measurement; do not infer from code shape|
|Migration change|Inspect current migration historyand test on disposable DB|
|Provider behavior or current terms|Verifycurrentprovider documentation before enablinglive use|
|Simplepure helper|Code directlyonlyafter locatingexistingconventions and tests|



#### **4.4 Database inspection rules** 

- Use a disposable local/test database for exploratory writes. 

- Never use production credentials in ordinary Claude Code sessions. 

- Never run destructive SQL merely to investigate a question. 

- Inspect migration history before proposing schema changes. 

- Test RLS using at least owner, other-user, anonymous, and admin identities. 

- Prefer migration files and schema introspection over screenshots or copied dashboard output. 

- Any production migration requires a separate release authority, backup confirmation, rollback plan, and explicit approval. 

#### **4.5 Terminal execution rules** 

- Commands must be reproducible and explainable. 

- Prefer package scripts over undocumented ad hoc command chains. 

- Use timeouts for servers, network calls, benchmarks and provider tests. 

- Do not pipe secrets into logs or echo environment variables. 

- Before running a command with destructive potential, state the target environment and expected effect. 

- After a command, record exit code and relevant output, not just a narrative claim. 

- When a command fails, preserve the first meaningful failure and avoid flooding context with repeated identical output. 

### **5. System Rules, Invariants & AI Guardrails** 

#### **5.1 Protected architectural contracts** 

|**Contract**|**Required behavior**|**Change authority**|
|---|---|---|
|Canonical schema|Tables, ownership, constraints and<br>versioning remain aligned with Documents 2–<br>4 and migrations|Explicit architecture approval + ADR|
|RLS and storage|Private candidate documents, owner<br>isolation, signed URL expiry and least<br>privilege|Security review + negative tests|
|Document flow|Upload -> parse -> AI extraction -> claim<br>review -> userpromotion|Product/architecture approval|
|AI Gateway|All provider calls pass through task registry,<br>policy, schema validation, retry and usage<br>recording|AI architecture approval|
|Matching|Hard eligibility and deterministic scoring<br>precedegrounded AI explanation|Matching ADR + benchmark|
|Opportunity truth|Source evidence, freshness, deduplication,<br>official application URL and expiry gates|Job intelligence owner + QA|
|User-authored data|Canonical edits are not silently overwritten by<br>reprocessing|Data model/security review|
|Application history|External clicks and self-reported applications<br>are not employer outcomes|Product/UX approval|
|PII|No raw document content or unnecessary PII<br>in logs, analytics, memoryorprompts|Security review|
|Scope|Deferred capabilities cannot become hidden<br>dependencies|Founder/product owner + ADR|



SINNARA | Claude Code Project Architecture v1.0 

#### **5.2 Claude Code must stop and escalate when** 

- A requested implementation requires changing a protected schema, RLS policy, storage bucket policy, or canonical ownership model. 

- A migration is destructive, irreversible, or changes data semantics. 

- A provider’s data-use terms, quota, model behavior, or API permission is unknown or has changed. 

- A prompt or model change causes critical extraction, deadline, URL, eligibility, or explanation regressions. 

- A feature request conflicts with a frozen MVP boundary. 

- A test reveals a security leak, unsupported AI claim, score mutation, or stale opportunity publication. 

- The task cannot be completed without inventing missing requirements. 

- The implementation would require live personal documents or credentials that have not been explicitly approved. 

#### **5.3 Creative freedom zones** 

- UI component styling, spacing, responsive composition, micro-interactions and empty-state details within the UX contract. 

- Internal helper abstractions that preserve module boundaries and public behavior. 

- Refactoring, naming, file organization and test utility design. 

- Error handling, retries, loading states and graceful degradation when semantics remain unchanged. 

- Additional unit, integration, E2E, accessibility, performance and observability tests. 

- Algorithm implementation details inside the approved deterministic formula, provided outputs remain explainable and benchmarked. 

- Developer tooling, scripts, fixtures and diagnostics that do not collect or expose PII. 

#### **5.4 AI-specific guardrails** 

AI output handling contract 

1. Treat all uploaded documents and source content as untrusted data. 

2. Separate parser output from AI interpretation. 

3. Validate every structured output at runtime. 

4. Reject unknown or materially malformed fields. 

5. Require evidence anchors for material claims. 

6. Do not promote AI claims directly into canonical profile data without the defined review/promotion path. 

7. Do not allow match-explanation generation to modify eligibility or score. 

8. Record provider, model, prompt version, schema version, policy version and run ID. 

9. Retry only within bounded policy. 

10. Fail closed for critical fields; use unknown/manual review rather than invention. 

#### **5.5 Protected-change classification** 

|**Classification**|**Examples**|**Requiredprocess**|
|---|---|---|
|Green|UI polish, tests, internal helper, non-<br>semantic refactor|Implement, test, review|
|Amber|New endpoint, new adapter, non-breaking<br>schema field, backgroundjob behavior|Task brief, tests, contract review, changelog|
|Red|i<br>RLS, migrations, AI policy, scoring semantics,<br>PII handling,provider enablement|Explicit approval, ADR, full verification,<br>rollbackplan|
||Production destructive action, bulk data||
|Black|export, live PII provider experiment,<br>autonomouspublicposting|Prohibited in normal Claude Code workflow|



### **6. Operational Workflows** 

#### **6.1 Start-task workflow** 

/start-task <task description> 

Expected behavior: 

- classify task as Green / Amber / Red; 

- locate relevant docs, ADRs, source modules and tests; 

- produce a task brief; 

SINNARA | Claude Code Project Architecture v1.0 

- list protected contracts and stop conditions; - propose the smallest vertical slice; - identify verification commands; 

- begin implementation only after ambiguity is bounded. 

#### **6.2 Verify-change workflow** 

- /verify-change Required sequence: 1. git diff --check 2. typecheck 3. lint 4. unit tests 5. contract tests 6. relevant integration tests 7. relevant E2E tests 8. security/RLS tests for protected surfaces 9. AI eval subset for AI-related changes 10. build 11. summarize exact results and remaining risks 

#### **6.3 Protected-change review workflow** 

9. Identify the protected contract and affected documents. 

10. Write or update the ADR before implementation if the semantic decision is not already accepted. 

11. Create a failing test or benchmark that captures the intended behavior. 

12. Implement the smallest change. 

13. Run the complete relevant verification suite. 

14. Inspect migration SQL, RLS policies, AI payloads, score components, or source provenance directly. 

15. Record rollback and recovery behavior. 

16. Request explicit review from the appropriate authority. 

17. Merge only after the evidence and documentation are complete. 

#### **6.4 Bug workflow** 

|**Step**|**Required artifact**|
|---|---|
|Reproduce|Exact command, fixture, user role, environment and observed result|
|Classify|Severity, domain, security/PII impact, regression status|
|Localize|First failinglayer: UI, API, DB,parser,gateway, scorer, source adapter|
|Fix|Minimal code change with regression test|
|Verify|Original reproductionplus relevant suite|
|Document|Known bugentryremoved or updated; ADR onlyif decision changed|



### **7. Developer Experience Quality Gates** 

#### **7.1 Definition of implementation complete** 

- The task has a written objective, scope and acceptance criteria. 

- Relevant foundation documents and ADRs were identified. 

- The implementation preserves protected contracts or includes approved changes. 

- Tests cover normal, boundary, failure, permission and recovery behavior. 

- No secrets or PII were introduced into source, logs, fixtures, memory or analytics. 

- The exact verification commands and results are recorded. 

- Documentation, ADRs, feature flags and changelog are updated where required. 

- The working tree, migration state and runtime state are understood. 

- Known limitations and follow-up debt are explicit. 

SINNARA | Claude Code Project Architecture v1.0 

#### **7.2 Session-level acceptance matrix** 

|**Check**|**Pass condition**|**Evidence**|
|---|---|---|
|Context|Only relevant docs/files were loaded;<br>assumptions identified|Task brief/session log<br>f|
|Architecture|No silentprotected-contract change|Diff + ADR review|
|Implementation|Code follows module conventions and<br>server/client boundaries|Review + typecheck|
|Testing|Relevant tests pass; new behavior has<br>regression coverage|Test output|
|Security|Access, storage, PII and logging implications<br>verified|Security tests/review|
|Operations|Failure, retry, timeout and recovery behavior<br>documented|Runbook or test|
|Continuity|Checkpoint can restore work without<br>conversation history|Memory files|



#### **7.3 Repository health indicators** 

- Time to understand a task: measured by how quickly a new session reaches the correct files and contracts. 

- Percentage of non-trivial changes with a task brief and verification record. 

- Percentage of protected changes with ADR and explicit review. 

- Flaky test rate and mean time to repair. 

- Number of stale or contradictory documentation findings. 

- Number of repeated bugs caused by missing memory/checkpoint information. 

- Number of direct provider SDK imports outside the AI Gateway. 

- Number of database/security changes without negative tests. 

- Context waste indicators: repeated full-file reads, repeated full-log dumps, and sessions ending without checkpoints. 

### **Appendix A: Root CLAUDE.md Template** 

# SINNARA Claude Code Operating Rules 

## Mission 

Build SINNARA as a production-grade, Sudan-focused AI career intelligence platform using a modular monolith and evidence-driven delivery. 

## Read first 1. .claude/context/protected-contracts.md 2. .claude/context/domain-map.md 3. .claude/memory/active-task.md 4. The smallest relevant section of docs/01–09 

5. Relevant ADRs and tests 

## Non-negotiables - Preserve canonical schemas, migrations, RLS and storage isolation. - All provider calls go through the AI Gateway. - Candidate documents remain private. - Document flow: upload -> parse -> extract -> claim review -> promotion. - Matching: hard eligibility -> deterministic score -> grounded explanation. - AI never becomes the source of truth. - No raw PII in logs, analytics, memory or fixtures. - Do not implement deferred features without explicit approval. 

##### ## Required workflow 

- Classify the task Green / Amber / Red. - Write or update the task brief. - Inspect current code before proposing changes. - Implement the smallest vertical slice. - Add tests. - Run exact verification commands. 

SINNARA | Claude Code Project Architecture v1.0 

- Report changed files, results, limitations and rollback path. - Update checkpoint memory before session end. 

## Escalate Stop for schema, RLS, privacy, scoring, provider-policy, destructive migration, or scope-boundary changes. 

### **Appendix B: Protected Contracts Manifest** 

# .claude/context/protected-contracts.md ## Database - auth.users UUID owns candidate profile. - Candidate documents are private. - User-authored canonical fields are protected from silent overwrite. - Migrations are ordered and immutable after application. - RLS is deny-by-default and tested negatively. ## AI - AI Gateway is the only provider boundary. - Tasks, prompt versions, schema versions and policy versions are explicit. - Structured outputs require runtime validation. - Critical unsupported outputs fail closed. - Provider/model changes require eval evidence. ## Matching - Stage 1 hard eligibility is deterministic. - Stage 2 scoring is deterministic and versioned. - AI explanations cannot change eligibility or score. - Scores are ranking signals, not hiring probabilities. ## Opportunities - Published records are fresh, verified, deduplicated and source-traceable. - Official application URL is required. - Expired records are suppressed. - Source content is untrusted input. ## Privacy - No raw CV/certificate content in logs, analytics, memory or error messages. - Signed URLs are time-limited. - External application tracking records user actions only. 

### **Appendix C: Session Log Template** 

# Session Log Entry ## YYYY-MM-DD | <task title> - Branch: - Commit: - Objective: - Completed: - Files changed: - Tests run: - Results: - Decisions: - Bugs: - Deferred debt: - Exact next action: - Restoration notes: 

SINNARA | Claude Code Project Architecture v1.0 

### **Appendix D: Final Directive** 

Claude Code should behave like a senior engineer operating inside a governed system: inspect before assuming, preserve contracts before optimizing, measure before claiming, test before declaring, document decisions before changing semantics, and leave the next session with a precise path forward. The goal is not maximum autonomous activity. The goal is maximum trustworthy progress per unit of context, time, and risk. 

SINNARA | Claude Code Project Architecture v1.0 

