# **SINNARA** 

## **MVP Roadmap & Testing Framework** 

v1.0 | Production-Grade Execution Specification 

_Sudan-focused today. Globally extensible underneath._ 

|**Document control**|**Value**<br>i|
|---|---|
|Status|Foundation specification for implementation andQA|
|Predecessors|Documents 1–8 + Foundation Reconciliation Review v1.0|
|Architecture|Modular monolith: Node.js / TypeScript / Supabase|
|Implementation agent|Claude Code under controlled autonomy|
|Quality posture|Evidence-driven,deterministic-first, privacy-first,release-gated|
|MVPprinciple|Prove the candidate value loopbefore expandingfeature surface|



SINNARA | MVP Roadmap & Testing Framework v1.0 

### **Executive Summary** 

This document converts the SINNARA foundation into an executable delivery system. It defines the dependency-ordered roadmap, verification evidence, technical spikes, scope controls, Claude Code autonomy rules, and production release gates. The roadmap is intentionally designed to prevent polished UX from masking unreliable parsing, unsafe AI behavior, stale opportunities, or weak permissions. 

Candidate: Upload -> Parse -> AI Gateway extraction -> Claim review -> User-promoted canonical profile Opportunity: Source -> Capture -> Parse -> Normalize -> Deduplicate -> Verify -> Publish -> Expire Matching: Hard eligibility -> Deterministic score -> Optional retrieval -> Grounded AI explanation 

Ordinary software owns identity, permissions, dates, state, persistence, retries, filtering, matching rules, and auditability. AI interprets and generates only inside explicit schemas, evidence constraints, budgets, and versioned prompts. 

#### **Quality principles** 

- Build the smallest complete value loop, not the largest feature list. 

- Make important transformations observable, replayable, and testable. 

- Treat canonical records and source evidence as authoritative. 

- Use deterministic rules for eligibility, expiry, deduplication, and scoring. 

- Prefer graceful degradation over fabricated success. 

- Use real anonymized fixtures early. 

- Release only when evidence meets a gate. 

### **1. Strategic Roadmap & Phase Decomposition** 

|**Phase**|**Objective**|**Exit evidence**|**Dependency**|
|---|---|---|---|
|0. Spikes & Core Harness|Remove technical uncertainty;<br>establish CI and fixtures|Spike reports, baseline metrics,<br>ADRs|None|
|1. DB & AI Gateway|Create canonical persistence<br>and safe AI boundary|Migrations, RLS tests, gateway<br>contracts|0|
|2. Processing & Claims|Deliver evidence-backed<br>candidateprofile flow|Pipeline, claim review, promotion<br>tests|0–1|
|3. Ingestion & Matching|Create trustworthy opportunities<br>and recommendations|Adapters, quality gates, scorer<br>benchmark|0–2|
|4. UX & App Tracker|Expose complete candidate loop|Playwright, accessibility,<br>responsiveQA|1–3|
|5. Hardening & Launch|Prove controlled-pilot readiness|Security, performance, rollback,<br>observability|1–4|



#### **Phase 0: Spikes & Core Harness** 

Objective: remove parser, AI contract, and matching uncertainty before structural commitments. 

|**ID**|**Deliverable**|**Evidence**|
|---|---|---|
|0.1|Repo skeleton, strict TypeScript,<br>lint/format/test commands|Fresh clone passes baseline<br>i|
|0.2|Environment and secret policy|No secrets in source, logs, fixtures, or client<br>bundle|
|0.3|Unit/integration/E2E harness and CI<br>i|CI runs all baseline suites|
|0.4|Anonymized fixture corpus and manifest|Expected outputs,consent/licensingnotes|
|0.5|Parser benchmark|Accuracy, latency, failure taxonomy,<br>recommendation|
|0.6|AI Gateway spike|Zod validation, bounded retries, rate-limit<br>simulation|
|0.7|Matching spike|Correctness, monotonicity, performance,<br>explainability|
|0.8|ADRs and backlog|Open choices have owner and evidenceplan|



- 

   - Do not select a production parser without fixture evidence. 

- Do not send real candidate PII to a provider until current terms and policy are approved. 

SINNARA | MVP Roadmap & Testing Framework v1.0 

- Do not expose numeric scores until scorer and UX interpretation are accepted. 

- CI must fail on type errors, lint errors, tests, schema drift, and secret findings. 

#### **Phase 1: Database & AI Gateway** 

Objective: establish the canonical data foundation and the only permitted AI execution boundary. 

|**Migration**|**Scope**<br>i  i|**Key constraints**<br>i|
|---|---|---|
|0001|Identity, profiles, preferences, notification<br>preferences|auth.users UUID ownership; one profile per<br>user;RLS|
|0002|Taxonomies and locations|Stable slugs;no free-text-onlymatching|
|0003|Documents and artifacts|Private storage; checksums; immutable<br>metadata<br>i|
|0004|Profile claims|Evidence anchors, confidence, status, user<br>override|
|0005|Organizations and sources|Authority, access method, cadence,<br>active/paused<br>f|
|0006|Opportunities and versions|Official URL,status,expiry, provenance|
|0007|Matches|Algorithm version and component breakdown|
|0008|Applications|External action distinction;immutable events|
|0009|Analytics,AI runs, jobs,audit|Non-PII analytics;append-onlyintent|



type AIRequest<T> = { task: AITask; input: T; promptVersion: string; schemaVersion: string; policyVersion: string; priority: "interactive" | "background"; idempotencyKey: string; redactionProfile: "none" | "pii-minimized" | "synthetic" }; 

type AIResult<T> = { output: T; provider: string; model: string; promptVersion: string; schemaVersion: string; usage: object; latencyMs: number; validation: { ok: boolean; errors?: string[] }; aiRunId: string }; 

|**Endpoint**|**Purpose**|**Rule**|
|---|---|---|
|POST /api/documents<br>i|Create upload intent<br>i|Authenticated; private bucket; MIME/size<br>limits|
|GET /api/profile<br>i|Read canonicalprofile<br>i|Owner-only|
|PATCH /api/profile|Edit canonical fields|Audit; protect user-authored values|
|POST /api/documents/:id/process|Queue/replay processing|Idempotent|
|GET /api/admin/health|Operational health|Admin-only;no document contents|



- Migrations apply from empty and upgrade cleanly. 

- RLS tests prove cross-user read/update/delete/storage denial. 

- Gateway rejects unknown tasks, invalid schemas, missing versions, and over-budget requests. 

- No module imports a provider SDK directly outside the gateway adapter. 

**Phase 2: Processing & Claims** 

|**Milestone**|**Deliverables**|**Verification**|
|---|---|---|
|Upload|Signed intent, MIME/size validation,<br>checksum|**i**<br>Abuse, expiry, ownership tests|
|Parse|Parser adapter and versioned artifact|Fixture benchmark,corruption,timeout|
|Extract|candidate-extraction.v1 + Zod schema|Precision/recall,evidence validity|
|Review|Claim UI/API with confidence and evidence|Accept/edit/reject/conflict tests|
|Promote|Transactional canonicalpromotion|Idempotency,rollback,overrideprotection|
|Replay|Newparser/prompt runspreserve history|Lineage and regression tests|



uploaded -> processing -> parsed -> extracting -> review_ready -> partially_reviewed -> promoted \-> failed / needs_attention 

Rules: failed runs do not delete originals; new runs preserve lineage; user-authored values are never silently overwritten. 

|**Endpoint**|**Purpose**|
|---|---|
|POST /api/documents/:id/process|Queue or replay processing|
|GET /api/documents/:id/status|Safeprogress state|
|GET /api/documents/:id/claims|Claims with evidence metadata|
|PATCH /api/claims/:id|Accept,reject,or edit|
|POST /api/claims/promote|Transactionalpromotion|
|POST /api/profile/review/complete|Record review and activation|



SINNARA | MVP Roadmap & Testing Framework v1.0 

#### **Phase 3: Ingestion & Matching** 

1. Register source with authority, access method, terms, cadence, and owner. 

2. Discover via permitted API, RSS, sitemap, ATS, HTML, or manual import. 

3. Fetch with timeout, retry budget, content validation, and fingerprinting. 

4. Parse and normalize title, organization, location, type, work mode, requirements, dates, skills, and official URL. 

5. Deduplicate using canonical URL/content/title/organization signals. 

6. Apply quality gates: authority, freshness, expiry, required fields, official URL, parse confidence. 

7. Publish only passing records; suppress stale or ambiguous records. 

8. Run hard eligibility, deterministic score, then grounded explanation. 

9. Persist provenance, algorithm version, explanation version, and telemetry. 

|**Endpoint**|**Purpose**|
|---|---|
|GET /api/opportunities|Published feed with deterministic filters|
|GET /api/opportunities/:id|Detail,source,deadline,fit explanation|
|POST /api/opportunities/:id/save|Save/unsave|
|POST /api/opportunities/:id/apply-click|Record official click|
|POST /api/ingestion/sources/:id/run|Admin/internal source run|
|GET /api/matches|Candidate recommendations|



Stage 1: hard eligibility = education + experience + language + location/work mode + non-expired + no exclusions Stage 2: weighted deterministic score = education + experience + skills + language + location + alignment + evidence + freshness Stage 3: AI explanation reads only canonical facts, opportunity facts, score components, and evidence. It cannot alter score or eligibility. 

**Phase 4: UX & Application Tracker** 

|**Area**|**Deliverable**|**Tests**|
|---|---|---|
|Onboarding|Signup, upload, processing, review,<br>preferences|Happy path, reload/resume, failure recovery|
|Recommended|Relevant feed,labels,empty/partial states<br>i|Eligibilityand stale suppression|
|Discover|Search/filter/sort with URL state<br>f|Combinatorial and mobile controls|
|Detail|Source,deadline,explanation,official apply|URL integrity,expiry|
|Saved|Persistence and rollback|Concurrencyand duplicate actions|
|Applications<br>i|Self-reported applied timeline<br>i|No employer-outcome inference<br>l|
|Profile|Canonical fields and document vault|Permission,edit,conflict, privacy|



- A first-time candidate can reach a relevant opportunity without support. 

- Core flow works at 320px and 390px widths. 

- All async states have recovery behavior. 

- Playwright smoke passes in Chromium and a mobile viewport on every merge. 

- No critical accessibility defects. 

**Phase 5: Hardening & Launch** 

|**Workstream**|**Deliverable**|**Evidence**|
|---|---|---|
|Security|RLS, storage, secret, dependency, abuse<br>audits|Zero unresolved critical/high findings|
|Reliability|Timeouts, retries, idempotency, dead-letter,<br>rollback|Failure-injection and recovery report|
|Performance|API,DB,upload/process, pageperformance|Measured thresholds|
|Observability|Logs,correlation IDs,metrics,alerts|End-to-end trace walkthrough|
|Dataquality|Freshness,source health,AI/parser eval|Qualitydashboard and suppression|
|Operations|Backup/restore, migration rollback, incident<br>runbook|Rehearsed launch checklist|



#### **Critical Path & Risk Matrix** 

|**Risk**|**Impact**|**Early signal**|**Mitigation**|
|---|---|---|---|
|Parser quality failure|Blocks activation|Low recall, scan failures|Benchmark alternatives; manual-<br>review fallback|
|Providerquota/PII terms|Blocksproduction AI|429s,unclear terms|Gateway,redaction,synthetic|



SINNARA | MVP Roadmap & Testing Framework v1.0 

||||mode,fallback decision|
|---|---|---|---|
|RLS/storage leak|Severe trust impact|Cross-user test failure|Deny-by-default;isolation matrix|
|Source instability|Stale recommendations|Parse drift, blocked fetches|Health scores, suppression,<br>manual imports|
|Opaque scoring|Poor trust|Ranking reversals|Deterministic formula, golden<br>pairs,versioning<br>l|
|Scope creep|Delays validation|Future-feature PRs|Feature flags, ADR approval, scope<br>gate|
|Job duplication/loss|Corruption/cost|Repeated or stuck runs|Idempotency, unique constraints,<br>dead-letter<br>i|
|UX/backend drift|Rework|Mock states diverge|Contract-first vertical slices|
|Weak fixtures|False confidence|Only happy paths|Fixture acquisition and human<br>labels|



### **2. Testing Architecture & Verification Suite** 

|**Layer**|**Purpose**|**Gate**|
|---|---|---|
|Static|Type safety, lint, format, secret/dependency<br>checks|Every PR|
|Unit|Schemas,rules,state machines,normalizers|EveryPR|
|Integration|DB,RLS,storage, gateway,adapters|EveryPR/main|
|Contract|API and AI schemas,source adapters|EveryPR|
|E2E|High-value userjourneys|EveryPR smoke;RC full|
|AI eval|Golden sets,factuality,regressions|Prompt/model/parser change|
|Security|Isolation,masking,signed URLs,abuse|EveryRC|
|Performance|Latency,throughput,resilience|Beforepilot and major changes|



#### **Automated matrix** 

|**Domain**|**Unit**|**Integration**|**E2E**|
|---|---|---|---|
|Schemas|Valid/invalid,defaults,unknown keys|API rejects malformed data|UI never renders impossible state|
|Matching|Gates,weights,monotonicity,ties|ReplayDB snapshots|Onlyeligiblepublished records|
|Documents|MIME,size,checksum,states|Storage ownership,rollback|Upload -> review ->promote|
|AI Gateway|Policy, retry classifier, budgets|Provider mocks, timeout, 429,<br>malformed output|Safe retry/error state|
|RLS|Policyhelpers|Cross-user CRUD and storage matrix|User A cannot access B|
|Ingestion|Dates, normalizer, dedup|Adapter, upsert, versioning,<br>suppression|Only fresh published jobs|
|Applications|Status/event validation|Idempotent click/applied|Save -> click -> self-report|
|Analytics|Allowlist and redaction|Noprivate content|Admin aggregates only|



#### **Example tests** 

describe("hard eligibility", () => { it("rejects expired opportunities", () => { const r = evaluateEligibility(candidate, expiredOpportunity, fixedNow); expect(r.eligible).toBe(false); expect(r.reasons).toContain("expired"); 

}); }); 

describe("score monotonicity", () => { it("does not reduce score when a verified skill is added", () => { expect(score(candidateWithSkill, opportunity)) .toBeGreaterThanOrEqual(score(candidateWithoutSkill, opportunity)); }); }); 

#### **Integration requirements** 

- Use disposable Supabase/Postgres test environment. 

SINNARA | MVP Roadmap & Testing Framework v1.0 

- Seed at least two users, private documents, opportunities, and roles. 

- Assert both allowed and denied access. 

- Test transaction rollback halfway through promotion/matching/event insertion. 

- Test migrations from empty and upgrade from prior snapshot. 

- Use fixed clocks for deadline and timezone boundary tests. 

#### **Playwright flows** 

10. Signup -> CV upload -> processing -> claim review -> promote -> preferences -> first recommendation. 

11. Malformed upload -> visible failure -> valid retry without duplicate records. 

12. User A attempts User B profile/document access -> denied/not found with no leakage. 

13. Open opportunity -> inspect explanation -> save -> reload -> official apply click. 

14. Mark applied self-reported -> timeline records only the user action. 

15. Opportunity expires between feed and detail -> apply action suppressed. 

16. Complete core flow at 320px and 390px with keyboard navigation. 

pull_request: install -> typecheck -> lint -> format -> secret scan -> unit -> contracts -> integration -> Playwright smoke main: all above + migration drift + AI eval subset + dependency audit release_candidate: full E2E + full AI eval + RLS/storage suite + performance + resilience + manual exploratory 

#### **AI Testing & Evaluation Framework** 

Schema validity is necessary but insufficient. AI evaluation must measure accuracy, groundedness, completeness, abstention quality, and contradiction with authoritative data. 

|**Prompt**|**Input**|**Output**|**Metrics**|
|---|---|---|---|
|candidate-extraction.v1|Parsed document|CandidateExtractionResult|Precision/recall, evidence validity,<br>unsupported claims|
|opportunity-extraction.v1|Source artifact|OpportunityExtractionResult|Title/org/deadline/URL accuracy|
|match-explanation.v1|Candidate + opportunity + score|MatchExplanationResult|Groundedness, contradiction,<br>usefulness|
|skill-normalize.v1|Rawphrase + taxonomy|SkillNormalizationResult|Top-1 accuracy,abstentionquality|



- Maintain versioned real-anonymized and synthetic fixtures. 

- Include columns, tables, scans, footers, mixed formatting, ambiguous dates, missing deadlines, and stale cached pages. 

- Label critical, material, and cosmetic errors. 

- Store commit SHA, model/provider, prompt/schema/policy/parser versions, dataset version, and timestamp. 

- Run on every prompt, schema, parser, model, or policy change. 

|**Metric**|**Definition**<br>f|**Gate**|
|---|---|---|
|Critical field accuracy|Identity, title, org, deadline, official URL, hard<br>requirements|100% on release-critical fixtures or manual fallback|
|Material extraction error|Wrong/unsupported accepted claims|<1% target|
|Evidence validity|Claim anchor actuallysupports claim|≥99% accepted claims|
|Abstentionquality|Unknown when ambiguous|No fabricated critical fields|
|Explanationgroundedness|Material statements supported byfacts|i<br>≥98%|
|Critical contradiction|Explanation conflicts with eligibility/score|0|
|Schema validity|Exact schemaparse success|≥99.5% with bounded retry|



for fixture in golden_set: result = gateway.run(task="match_explanation", prompt_version="match-explanation.v1", schema_version="match-explanation-result.v1", input=fixture.context) 

assert schema_valid(result) assert no_unsupported_claims(result, fixture.authoritative_facts) assert no_score_or_eligibility_mutation(result, fixture.match_record) record_metrics(result, fixture) 

fail_release_if(critical_groundedness_failures > 0 or critical_contradictions > 0 or accepted_claim_error_rate >= 0.01) 

#### **PII & Security Auditing Suite** 

**<mark>Automated verifcation</mark> i** **<mark>Failure response</mark>** 

**<mark>Control</mark>** 

SINNARA | MVP Roadmap & Testing Framework v1.0 

|RLS isolation|Owner/other/anonymous/admin matrix for every<br>table|Block release; fix policy<br>i|
|---|---|---|
|Storage isolation|Cross-user object access andpathguessing|Revoke/fix/investigate|
|Signed URL expiry|Before,at,and after expiry|Fail closed;reduce TTL|
|PII masking|Logs/events/errors contain no raw document/PII<br>i|Redact andpurge|
|Payload minimization|Gatewaysends onlyrequired fields|Blockprovider call|
|Audit integrity|Sensitive actions append<br>actor/target/action/time/correlation|Alert on missing audit|
|Abuse controls|Upload/process/enumeration rate tests<br>i|Throttle/reject|
|Dependencies|Lockfile audit and secret scan|No critical/high unresolved|



test("documents are isolated by owner", async () => { const a = await createUser(); const b = await createUser(); const d = await createPrivateDocument(a.id); await asUser(b, async client => { expect(await client.from("documents").select().eq("id", d.id)).toHaveNoRows(); expect(await client.storage.from("candidate-documents").createSignedUrl(d.storage_path, 60)) .toHaveAccessDenied(); }); }); 

### **3. Technical Verification Spikes** 

**Spike 1: Document Parser Benchmark** 

|**Dimension**|**Method**<br>i|**Output**|
|---|---|---|
|Corpus|30 CVs, 15 certificates, 20 jobs; clean, columns,<br>tables,scans,malformed|Fixture manifest and ground truth|
|Accuracy|Text order, dates, sections, tables, URLs,<br>anchors|Per-fixture and aggregate accuracy|
|Latency|Cold/warmp50/p95|Latencyreport|
|Failure|Corrupt, encrypted, oversized, image-only,<br>timeout|Failure taxonomy and fallback|
|Operations|Memory, dependencies, containerization,<br>portability|Deployment notes|
|Decision|Weighted score with critical blockers|Parser ADR|



**Spike 2: AI Gateway & Schema Enforcement** 

|**Scenario**|**Expected behavior**|
|---|---|
|Valid output|Parse,validate, persist AI run|
|Malformed JSON|One bounded repair/retryor safe failure|
|Schema mismatch|Reject;no canonical write|
|429/rate limit|Classifyretryable;capped backof|
|Timeout/outage|Abort,record,safe degraded mode|
|Prompt injection|Treat document as untrusted data|
|Budget exceeded|Reject/downgrade by policy;record reason|



**Spike 3: Deterministic Matching Scorer** 

|**Benchmark**|**Method**|**Evidence**|
|---|---|---|
|Correctness|100–500 synthetic labeledpairs<br>ii|Confusion matrix and review|
|Monotonicity|Add/remove one verifiedqualification|Noprohibited reversals|
|Boundaries|Missing data, exact years, equivalent titles,<br>timezone edges|Stable outcomes|
|Performance|10k/100k/1m calculations|p95 and throughput|
|Replayability|Same snapshot/version twice|Identical result|
|Explainability|Each component maps to rule/feature|No untraceable contribution|



function scoreMatch(candidate, opportunity, policy) { const eligibility = evaluateEligibility(candidate, opportunity, policy); if (!eligibility.eligible) return { eligible: false, score: null, components: [] }; 

SINNARA | MVP Roadmap & Testing Framework v1.0 

const components = { education: educationScore(candidate, opportunity), experience: experienceScore(candidate, opportunity), skills: skillScore(candidate, opportunity), language: languageScore(candidate, opportunity), location: locationScore(candidate, opportunity), alignment: careerAlignmentScore(candidate, opportunity), evidence: evidenceStrength(candidate), freshness: freshnessScore(opportunity) }; return { eligible: true, score: weightedSum(components, policy.weights), components, algorithmVersion: policy.version }; } 

### **4. Explicit Scope Boundaries & Anti-Patterns** 

|**Feature flag**|**Default**|**Rule**|
|---|---|---|
|numeric_match_score|off|Qualitative label first; benchmark before<br>exposure|
|semantic_retrieval|off|No embeddings dependency before baseline<br>benchmark|
|career_briefing|limited|One concise evidence-backed briefing|
|whatsapp_notifications|off|Adapter/preferences first; provider validation<br>required|
|public_opportunity_pages|controlled|Only quality-gatedpublished records|
|ai_extraction_live_provider|environment|Synthetic/mock mode in development|
|admin_auto_publish|of|Human approval untilproven|
|application_document_generation|of|No full tailoringin MVP|
|employer_workspace|of|No employer accounts or ATS|



#### **Deferred capabilities** 

- Full CV tailoring, cover letters, interview preparation, automated application submission. 

- Employer platform, paid profiles, candidate search, shortlists, hiring outcomes. 

- Social publishing autopilot and autonomous group posting. 

- Native mobile applications. 

- Full career coach and long-form autonomous plans. 

- Vector embeddings/pgvector as core dependency. 

- Microservices, event mesh, multi-agent frameworks. 

- LinkedIn scraping dependency. 

- Payments, subscriptions, complex billing. 

- Blind applications or hiring-probability claims. 

#### **Anti-patterns** 

- AI writes directly to canonical tables without validation and provenance. 

- Frontend calculates a different score from the server. 

- Expired/unverified opportunities are distributed. 

- Jobs retry forever or duplicate without idempotency. 

- Raw CV content enters logs, analytics, URLs, or client state. 

- Provider SDK is imported throughout the codebase. 

- Future feature becomes hidden MVP dependency. 

- Fluent model output is treated as fact. 

- Claude silently changes schema, security, scoring, or scope. 

### **5. Directives for Claude Code & AI Autonomy** 

#### **Creative flexibility** 

- Component decomposition and internal helper naming within module boundaries. 

- UI styling within UX specification. 

- Refactoring that preserves contracts and tests. 

SINNARA | MVP Roadmap & Testing Framework v1.0 

- Equivalent test utilities and implementation patterns. 

- Improved errors, loading states, accessibility, and diagnostics. 

- Additional non-PII tests and observability. 

#### **Strict adherence** 

|**Area**|**No change without explicit approval**|
|---|---|
|Database|Tables,ownership,RLS,constraints,migration order,immutable records|
|AI Gateway|Provider boundary,task registry,schemas,retries,redaction,budgets|
|Matching<br>l|Eligibility,weights,algorithm versions,explanation separation|
|Document flow|Upload ->parse -> extract -> review ->promote|
|Security|Private storage,signed URLs,loggingand audit rules|
|Scope|Deferred features cannot become dependencies|
|Ingestion|Authority, provenance,freshness,dedup, publish/expire|



#### **Required workflow** 

17. Read relevant foundation docs, module rules, and tests. 

18. State change, contracts, risks, and ADR need. 

19. Implement smallest vertical slice. 

20. Add/update tests. 

21. Run typecheck, lint, unit, integration, E2E/evals. 

22. Inspect migrations, logs, and user-visible states. 

23. Report files, commands, results, limitations, and rollback. 

24. Never claim runtime success from code inspection alone. 

|**Level**|**Allowed action**|**Approval**|
|---|---|---|
|A0|Read,analyze, propose,write tests/docs|None|
|A1|Isolated UI/helper/refactor|PR review|
|A2|Feature within frozen contracts|PR + evidence|
|A3|DB/security/AI/scoring/privacy/scope change|Explicit approval + ADR|
|A4|Production migration/provider/public<br>distribution|Release authority + rollback rehearsal|



### **6. Acceptance Criteria & Production Quality Gates** 

|**Gate**|**Target**|**Evidence**|**Blocking**|
|---|---|---|---|
|Build|Typecheck,lint,format,buildpass|CI artifacts|Yes|
|Unit/domain|Critical logic covered; no untested<br>scoringbranches|Coverage and edge tests|Yes|
|Parsing|>95% supported-document success|Benchmark byclass|Yes|
|Extraction|<1% material accepted-claim error|Golden set + audit|Yes|
|AI schema|≥99.5% valid with bounded retry|Gatewaymetrics|Yes|
|AI groundedness|0 critical unsupported/contradictory<br>claims<br>i|Eval report|Yes|
|Security|0 unresolved critical/high findings|RLS/storage/securityreport|Yes|
|API latency|p95 reads ≤500ms; writes ≤800ms<br>excludingasync|Load report|Yes|
|Async UX|Upload acknowledgement ≤1s; reload<br>recovery|E2E timing|Yes|
|Mobile|No clipping; LCP target ≤2.5s where<br>feasible|Mobile/Lighthouse report|Yes|
|Accessibility|No critical/serious defects<br>f|Automated + manual audit|Yes|
|Freshness|Expired records suppressed; official<br>URL required|Data quality report|Yes|
|Observability|Every failure traceable by correlation<br>ID|Trace walkthrough|Yes|
|Restore|Backup/restore rehearsalpasses|Runbook/log|Yes|
|Rollback|Application/migration rollback tested|Drill|Yes|



SINNARA | MVP Roadmap & Testing Framework v1.0 

#### **KPI definitions** 

- Parsing success = supported documents reaching usable parsed artifact / supported submissions, excluding intentional rejects. 

- Material extraction error = material incorrect or unsupported accepted claims / accepted claims reviewed. 

- First relevant opportunity = activated candidate shown at least one hard-eligible, quality-gated opportunity within onboarding window. 

- p95 API latency includes auth, DB, serialization, and app network work; excludes intentionally async provider processing. 

- Analytics must not use private CV/certificate content. 

#### **Launch checklist** 

- Reverify live model/provider terms, quotas, hosting, messaging, parser compatibility, and source access. 

- Configure secrets securely; scan repository. 

- Test backup/restore and migration rollback. 

- Run RLS/storage isolation suite. 

- Approve live AI mode, redaction, and retention policy. 

- Review source registry and suppression behavior. 

- Pin prompt/model/parser versions and pass golden set. 

- Pass desktop/mobile Playwright flows. 

- Verify admin health and incident tracing. 

- Keep deferred flags off. 

- Name pilot cohort, feedback mechanism, rollback owner. 

### **Appendix A: Repository Test Layout** 

tests/ unit/{schemas,matching,state-machines,normalizers} integration/{db,rls,storage,ai-gateway,ingestion} e2e/{onboarding,privacy,recommendations,applications,mobile} evals/{fixtures,candidate-extraction,opportunity-extraction,match-explanation,reports} performance/{api,processing,matching} security/{pii,abuse,dependency} 

### **Appendix B: Definition of Done** 

- Written contract and explicit non-goals. 

- Migration-based data changes with rollback/recovery plan. 

- All user-visible states including failure/recovery. 

- Unit, integration, contract, and relevant E2E tests. 

- Security/privacy and telemetry reviewed. 

- Docs and ADRs updated. 

- CI green and manual exercise completed. 

- Exact verification commands and results reported. 

### **Appendix C: Frozen Invariants** 

- Modular monolith first. 

- Canonical data is authoritative; AI is not source of truth. 

- Private candidate documents follow upload, parse, extraction, review, promotion. 

- Eligibility and scoring are deterministic; explanations cannot alter them. 

SINNARA | MVP Roadmap & Testing Framework v1.0 

- Published opportunities are fresh, traceable, quality-gated, and application-link complete. 

- User-authored profile data is never silently overwritten. 

- External applications record user actions, not imagined employer outcomes. 

- AI/parser/scorer/source transformations are versioned and replayable. 

- Privacy, RLS, signed URLs, and PII minimization are release blockers. 

- Deferred capabilities remain off until evidence justifies activation. 

SINNARA | MVP Roadmap & Testing Framework v1.0 

