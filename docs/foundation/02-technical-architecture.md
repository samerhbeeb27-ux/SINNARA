SINNARA  |  Technical Architecture v1.0 

# **SINNARA** 

## **Technical Architecture** 

#### **MVP v1.0** 

###### _Sudan-focused today. Globally extensible underneath._ 

###### **Purpose** 

Translate the SINNARA MVP Product Blueprint into a concrete technical system that Claude Code can implement incrementally. The design optimizes for speed, accuracy, reliability and low cost while preserving a clean path to future employers, richer career intelligence and global expansion. 

|**Document**|**Status**|**Date**|
|---|---|---|
|SINNARA Technical Architecture|v1.0 foundation<br>i|14 Sep 2026|
|Primary deployment approach|Free-first MVP|MVP stage|
|Product language|English|MVP stage|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

### **1. Executive Architecture** 

SINNARA is a modular web platform with a shared data foundation. The product should not be built as a single AI agent. AI interprets and generates; ordinary software owns state, permissions, dates, persistence, filtering, matching rules, retries and system integrity. 

Candidate / Admin Web UI | v Next.js application + server modules | +-----+-------+--------+---------+---------+ |             |        |         |         | Profile       Jobs    Matching Applications Notifications |             |        |         |         | +-------------+--------+---------+---------+ | Supabase Postgres + Auth + Storage + RLS | +------------+------------+ |                         | Document pipeline           Opportunity ingestion |                         | parser -> AI -> schema       source adapters |                         | +------------+------------+ | AI Gateway Gemini initially | Jobs / Scheduler / Retry | Analytics / Audit / Health 

|**Layer**|**MVP choice**|**Reason**|
|---|---|---|
|Frontend|Next.js + React + TypeScript + Tailwind|Fast product iteration and clean<br>component model|
|Database|Supabase Postgres|Relational data, SQL, RLS, strong upgrade<br>path|
|Auth|Supabase Auth|Integrated with database security|
|Storage|Supabase Storage|Private files with policy controls|
|AI|Gemini via internal provider interface|Current free tier is suitable for early<br>validation|
|Document parsing|Docling or equivalent|Separate parsing from AI interpretation|
|Automation|Application jobs first; n8n optional|Avoid unnecessary infrastructure in MVP|
|Web hosting|Vercel for development/private demos;<br>production decision later|Vercel Hobby is non-commercial|
|Notifications|Channel adapter model; WhatsApp later|Keep messaging policy and cost isolated|
|Analytics|Postgres event stream + admin insights|Low-cost and fully owned data|



###### **Non-negotiable architecture idea** 

The product is Sudan-specific in its data and experience, but not in its core object model. Country, currency, location, source and opportunity type are configurable data dimensions. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

### **2. Architecture Principles** 

|**Principle**|**Technical implication**|
|---|---|
|AI is a specialist|Never make an LLM the source of truth for canonical facts.|
|Provenance first|Every opportunity and important candidate claim should retain<br>source evidence.|
|Deterministic first<br>i|Dates, permissions, filters, status, deduplication and notification<br>scheduling are code-driven.|
|Free-first<br>i|Use free tiers for validation, but hide vendors behind interfaces.<br>i|
|Progressive profiling|Extract first, ask only for what remains missing.|
|Human correction|AI results are drafts until reviewed where accuracy matters.<br>i|
|Quality over quantity|Prefer fewer verified opportunities to a large noisy feed.|
|Asynchronous heavy work|Document parsing, AI processing and ingestion run as jobs.|
|Observable by default|Record processing, latency, errors and user outcomes where<br>known.|
|Privacy by default|Candidate documents remain private unless a future employer<br>workflow has explicit consent.|
|Version everything important|Prompts, generated documents, opportunity snapshots and<br>processing runs are versioned.|
|Design for extraction later|Use modular domains now; split services only when scale<br>demands it.|



### **3. MVP Scope and Deferred Architecture** 

|**Capability**<br>i|**MVP**|**Deferred but architected**|
|---|---|---|
|Candidate profile<br>i|Yes|Advanced career graph<br>i|
|CV/certificate upload and extraction|Yes|More file types and richer evidence linking|
|Opportunity ingestion|Selected reliable sources + admin entry|Broad global source network|
|Personalized matching|Yes|Outcome-trained ranking|
|Career intelligence|Basic profile and skill-gap signals<br>i|Full career planner and learning<br>marketplace|
|Application history|Saved applications and generated files<br>when generation is enabled|Full in-platform ATS|
|CV/cover-letter tailoring<br>i|Limited or feature-flagged|Full recruiter-grade document suite|
|WhatsApp notifications|Preference model and adapter architecture|High-volume production messaging|
|Behavior analytics|Core events + admin intelligence|Advanced predictive analytics|
|||Paid company profiles, structured|
|Employer platform|No|vacancies, candidate discovery and<br>workflow|
|Social publishing|No dependency for MVP|Automated multi-channel distribution<br>engine|



###### **Boundary on hiring outcomes** 

When applications happen on external employer systems, SINNARA cannot reliably know whether a person was shortlisted, interviewed or hired. Those events only become trustworthy first-party signals when the workflow eventually operates inside SINNARA. 

### **4. Application Architecture** 

Use one repository and one deployable application for the MVP, but separate code by business domain. This avoids microservice overhead while protecting the project from becoming a single tangled codebase. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

###### src/ 

app/                  routes and page composition components/           reusable UI components modules/ auth/ candidates/ documents/ opportunities/ matching/ applications/ career/ notifications/ analytics/ admin/ server/ ai/ ingestion/ jobs/ storage/ security/ db/ schema/ queries/ policies/ lib/ scoring/ validation/ dates/ locations/ telemetry/ tests/ 

|**Domain module**|**Responsibilities**|**Must not do**|
|---|---|---|
|candidates|Profile, preferences, career direction,<br>profile completeness|Directly call vendor SDKs from UI|
|documents|Upload metadata, processing state,<br>evidence links|Decide user permissions itself|
|opportunities|Canonical jobs, source provenance,<br>status, expiry|Trust raw scraped data without validation|
|matching|Eligibility, ranking, explanation<br>orchestration|Store user passwords or raw auth state|
|applications|Saved jobs, application records, generated<br>files|Overwrite original documents|
|notifications|Policies, schedules, delivery state|Embed WhatsApp logic in matching|
|analytics|Event capture and aggregation|Store private document contents in generic<br>events|
|admin|Review queues, source health, corrections|Bypass audit trail|



### **5. Data Architecture** 

Postgres is the canonical system of record. Data should be normalized enough to preserve integrity, while JSONB is used selectively for flexible provider payloads, AI evidence and event properties. Do not turn the whole database into JSON just because AI produces JSON. 

|**Entity**|
|---|



**<mark>Purpose Relationship</mark>** 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

|||SINNARA  |  Technical Architecture v1.0|
|---|---|---|
|users|Authentication identity|One user to one candidate profile|
|candidate_profiles|Canonical professional profile<br>i|Owns profile sections and preferences<br>i|
|documents|Uploaded and generated file metadata|Links to user, profile and application|
|document_processing_runs|Parser and AI processing states|One document to many attempts|
|education|Degrees and academic records|Many per candidate|
|experience|Employment and professional experience|Many per candidate|
|skills|Controlled vocabulary|Shared across candidates and<br>opportunities|
|candidate_skills|Candidate skill claims|Skill + proficiency + evidence|
|certifications|Professional certificates|Many per candidate|
|languages|Language proficiency|Many per candidate|
|projects|Projects/portfolio evidence|Many per candidate|
|preferences|Work and notification preferences|One per candidate, versionable if needed|
|career_interests|Target roles and sectors|Many per candidate|
|organizations|Employers and source organizations|Referenced by opportunities|
|opportunity_sources|Source registry and adapter settings|Many sources per organization/country|
|opportunities|Canonical opportunity records|Belongs to organization/source|
|opportunity_requirements|Normalized requirements|One-to-many requirement items|
|opportunity_versions|Change history|Many per opportunity|
|matches|Candidate-opportunity result|Unique candidate + opportunity +<br>algorithm version|
|saved_opportunities|Bookmarks|Many per candidate|
|applications|User-side application tracker|One candidate + opportunity pair|
|generated_files|Tailored CVs/letters later|Versioned under application|
|notification_preferences|Channel/cadence controls|One per channel/user|
|notification_events|Delivery attempts|Many per notification|
|analytics_events|Product behavior telemetry|Many per user/session|
|ai_runs|AI execution metadata|Links model, task, prompt version, result<br>state|
|audit_logs|Sensitive admin/security events|Append-only audit trail|



##### **5.1 Canonical versus derived data** 

Canonical fact: 

"Finance Intern" at "Example Ltd" from Jan 2025 to Jun 2025 

###### Evidence: 

document_id + page reference + source type 

###### Derived: 

normalized_skill = financial_reporting relevance_to_job = high confidence = 0.91 ai_run_id = ... 

Derived data must be refreshable. If a model changes, SINNARA can recompute derived intelligence without rewriting the candidate or job history. 

##### **5.2 Global-ready data dimensions** 

|**Dimension**|**Implementation now**|**Future**|
|---|---|---|
|Country|ISO-style country code on organizations,<br>locations and opportunities|Multi-country expansion|
|Location|Country, region/state, city, remote flag|Relocation and radius matching|
|Currency|amount + currency code|Salary normalization|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

|Opportunity type|job, internship, fellowship, consultancy,<br>seasonal, temporary, volunteer, remote|More categories|
|---|---|---|
|Language|language code + proficiency|Localized UI/content|
|Source|provider-neutral source record|New portals/APIs/feeds|



### **6. Candidate Document Pipeline** 

The first user input should be the CV and certificates. The system extracts what it can, shows a reviewable profile, and asks the user only for missing or incorrect information. Parsing and AI interpretation remain separate. 

Upload -> validate -> private storage -> processing job 

- -> document parser 

- -> structured text/layout 

- -> AI extraction 

- -> JSON schema validation 

- -> evidence linking 

- -> profile draft 

- -> user review/edit 

- -> canonical profile commit 

|**Stage**|**Action**|**Failure strategy**|
|---|---|---|
|Upload|Validate type/size and store privately|Reject with clear reason|
|Queue|Create idempotent processing job|Retry safely|
|Parse|Extract text and structure<br>i|Fallback parser/manual review<br>i|
|Extract|Map to profile schema|Retry; isolate uncertain fields|
|Validate|Schema and business-rule validation|Do not commit invalid results|
|Evidence|Attach source document/page when<br>available|Flag unsupported claims<br>i|
|Draft|Show changes before commit<br>i|User corrects or confirms|
|Commit|Write canonical profile|Create audit record|



###### **Document-processing choice** 

Docling is a strong candidate for evaluation because it can convert documents into a structured document representation and export to formats such as Markdown and dictionaries. Use it as a parser, not as the business logic. 

### **7. Opportunity Intelligence Architecture** 

Job collection is the most operationally difficult part of SINNARA. The architecture should therefore be source-agnostic and verification-oriented. Do not build a single "scraper". Build a registry of sources with adapters. 

source registry source_id organization_id country_scope source_type access_method adapter schedule verification_policy active 

ingestion 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

discover -> fetch -> fingerprint -> parse -> normalize -> deduplicate -> validate -> verify -> publish -> expire 

|**Ingestion stage**|**MVP behavior**|
|---|---|
|Discover|Run selected source checks on a schedule|
|Fetch|Use permitted APIs, feeds or public pages|
|Fingerprint|URL + content hash + normalized title/org signals|
|Parse|Source adapter first; generic parser second|
|Normalize|Map raw fields to canonical schema|
|Deduplicate|Deterministic comparison before semantic review|
|Validate|Require title, organization, source and application link at minimum|
|Verify|Keep source/provenance and last-checked timestamp|
|Publish|Only valid records enter candidate matching|
|Expire|Deadline/status checks and source revalidation|



##### **7.1 Opportunity schema** 

|**Field group**|**Examples**<br>f|
|---|---|
|Identity|title, organization, source, official URL|
|Location|country, region, city, remote/hybrid/on-site|
|Type|full-time, part-time, contract, temporary, seasonal, internship,<br>fellowship|
|Seniority|entry, junior, mid, senior, leadership<br>i i|
|Education|degree level, field, specific requirements|
|Experience|minimum/desired years and relevant contexts|
|Skills|required and preferred normalized skills<br>i|
|Languages|required/proferred language and proficiency|
|Eligibility|citizenship/work authorization/other explicit conditions<br>i|
|Timing|published date, deadline, timezone, status, last verified|
|Compensation|amount/range/currency/period where stated<br>i|
|Content|responsibilities, summary, benefits and application instructions|



### **8. Matching Engine** 

The matching engine should rank opportunities using multiple dimensions, while keeping the explanation understandable. A suitability score is not a probability of hiring. 

1. Hard eligibility 

education, minimum experience, explicit eligibility, essential constraints 

2. Suitability 

skill coverage, experience relevance, sector fit, evidence strength 

3. Preference fit 

location, remote preference, work type, availability 

4. Career alignment 

target roles, sectors, career level and plausible next step 

5. Output 

rank + label + reasons + gaps + evidence 

###### **<mark>Dimension</mark>** 

Eligibility <mark>Skills</mark> 

###### **<mark>Initial implementation</mark>** 

Deterministic rules from structured requirements <mark>Normalized skill overlap</mark> <u><mark>plus semantic similarity where needed</mark></u> 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

|Experience|Role/sector/responsibility relevance|
|---|---|
|Location|Exact city, region, relocation, remote compatibility|
|Career alignment|Candidate interests + role trajectory<br>i|
|Explanation|AI-assisted but grounded only in stored profile/job facts|



###### **Trust requirement** 

Never say "92% chance of getting hired." Say "Strong match" and explain why. Internal ranking may use a score, but user-facing language must not imply false statistical certainty. 

### **9. AI Gateway and Model Strategy** 

All product AI calls should pass through a SINNARA AI gateway. This is essential for cost control, prompt versioning, model switching and observability. Gemini should be the initial provider, not a hard dependency. 

Application -> AiGateway -> task policy -> provider adapter 

| +------+------+ |             | GeminiProvider   FutureProvider | response validation | cache / persistence | ai_runs record 

|**AI task**|**Preferred behavior**|
|---|---|
|CV/profile extraction|Structured output, evidence-first, low-cost model|
|Job parsing|Structured extraction; use rules before AI when possible|
|Skill normalization|Controlled taxonomy + AI suggestions|
|Match explanation|Grounded reasoning from candidate/job records|
|Career gap analysis|Use profile + observed opportunity demand|
|CV/cover letter generation|Template + verified facts + stronger model only when needed|
|Marketing content later|Opportunity data + brand instructions + channel-specific rules|



##### **9.1 AI guardrails** 

- Strict JSON schemas for machine-consumed outputs. 

- No invented qualifications, employers, dates, achievements or certifications. 

- Every generated document carries source and generation metadata internally. 

- Prompt versions are tracked. 

- Repeated transformations are cached or reused where appropriate. 

- Only minimum necessary context is sent to the model. 

- Permissions are enforced by the application and database, never by the model. 

- Provider failures produce graceful fallbacks rather than broken user workflows. 

### **10. Application and Generated Documents** 

The application history is a future retention engine and should be designed early even if full tailoring is feature-flagged. A tailored CV or cover letter must be a new immutable artifact linked to the specific job. The original CV is never overwritten. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

###### Original CV 

+--> Application A -> Tailored CV v1 -> Cover Letter v1 

- +--> Application B -> Tailored CV v1 -> Cover Letter v1 

Each generated artifact records: 

opportunity_id source_document_ids template_version prompt_version ai_run_id generated_at file_path 

user_edit_state 

|**Feature**|**Technical rule**|
|---|---|
|My Applications|One record per candidate-opportunity pairing|
|Versions|Never overwrite generated artifacts|
|ATS output|Controlled template system, not freeform AI formatting<br>i|
|Tailoring facts|Only verified candidate facts from canonical data/evidence|
|Quality checks|Chronology, consistency, required sections and invented-content<br>checks<br>i|
|Download|Generate stable file artifact and retain history|



### **11. Notifications** 

The notification service should decide what to send before choosing how to send it. This creates one policy engine for WhatsApp, email and future channels. 

match/digest trigger 

- -> eligibility for notification 

- -> user opt-in check 

- -> frequency / quiet-hours check 

- -> minimum relevance check 

- -> duplicate/suppression check 

- -> channel adapter 

- -> delivery result 

- -> notification_events 

|**Preference**|**Example**|
|---|---|
|Channel|WhatsApp on, email off|
|Frequency|Daily digest|
|Minimum relevance|Strong match only|
|Categories|Finance, programmes, business development|
|Locations|Kassala, Port Sudan, remote|
|Quiet hours|22:00 to 07:00|
|Digest size|Top 5|



###### **WhatsApp design rule** 

Keep WhatsApp outside the core domain logic. Meta policies, templates, opt-in requirements and pricing can change. SINNARA should swap or pause that adapter without changing matching or user-profile code. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

### **12. Analytics and Admin Intelligence** 

Behavior data should help SINNARA improve relevance, onboarding and retention. The analytics layer should avoid placing raw CV contents, certificate text or private message bodies into generic event properties. 

|**Event family**|**Examples**|**Admin question**|
|---|---|---|
|Onboarding|signup, upload_started, upload_done,<br>profile_confirmed<br>i|Where do users stop?|
|Discovery|opportunity_viewed, search, filter_used|What are people looking for?|
|Relevance|saved, hidden, irrelevant_report|Are recommendations useful?|
|Application|apply_clicked, document_generated|Does SINNARA help people act?|
|Career|interest_added, gap_viewed<br>i|What guidance is valuable?|
|Retention|return_session, notification_opened<br>i|What brings people back?|
|System|parse_failed, ai_error, notification_failed|Where is the infrastructure weak?|



analytics_event user_id or anonymous_id session_id event_name occurred_at route object_type / object_id properties_json 

No raw CV or certificate contents in generic analytics events. 

##### **12.1 Admin dashboard architecture** 

|**Dashboard area**|**Initial insight**<br>i|
|---|---|
|Opportunity health|New, published, closing, expired, duplicate, low-confidence|
|Source health|Last successful fetch, failures, stale sources|
|AI health|Latency, error rate, task volumes, estimated usage|
|Onboarding funnel|Signup -> upload -> extraction -> confirmation -> first match|
|Recommendation quality|View -> save -> click -> irrelevant report|
|Retention|Daily/weekly active users and alert engagement|
|Bottlenecks|High-drop steps and slow processing stages|



### **13. Security and Privacy** 

Candidate documents are sensitive professional data. Security should be designed before real users upload files, even in MVP. 

- Use Supabase Row Level Security for all candidate-owned tables. 

- Store files in private storage buckets; access through authorized, short-lived URLs. 

- Never expose storage service-role credentials to the browser. 

- Keep AI provider keys server-side only. 

- Record sensitive admin actions in an audit log. 

- Validate file type, size and content handling before parsing. 

- Use least-privilege service roles for automation tasks. 

- Give users clear controls for notification consent and future profile discoverability. 

- Separate public opportunity data from private candidate data at the database and API layers. 

- Do not expose candidate contact information in MVP employer-facing surfaces because those surfaces do not exist yet. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

### **14. Reliability, Jobs and Idempotency** 

The application should behave like a reliable pipeline even when third-party APIs, models or parsers fail. Every heavy operation gets a processing record and an idempotency key. 

processing_job id type object_id idempotency_key status: queued | running | succeeded | failed | dead_letter attempts last_error next_retry_at started_at completed_at 

Retry policy 

short transient retry -> exponential backoff -> dead letter -> admin visibility 

|**Failure**|**Expected behavior**|
|---|---|
|AI timeout|Retry, then fallback or show processing status|
|Parser failure|Retry with alternative parser or manual review|
|Source unavailable|Keep prior verified opportunity state and flag source health|
|Duplicate job|Suppress before publication|
|Expired job|Remove from active recommendations|
|WhatsApp failure|Retry safely without duplicate sends|
|User closes browser|Server-side job continues|



### **15. Deployment and Environment Strategy** 

The development environment should be reproducible from GitHub and environment variables. Production credentials must never be committed to the repository. 

|**Environment**|**Purpose**|**Suggested setup**|
|---|---|---|
|Local|Claude Code development and testing|Node.js + local env + Supabase project|
|Preview|Feature review|Cloud preview deployment|
|MVP production|Real user pilot|Hosting plan that permits commercial use|
|Future production|Scale and reliability|Paid hosting/database tier + backups +<br>observability|



###### **Current hosting constraint** 

Vercel currently describes Hobby as a free plan for personal, non-commercial use. Therefore Vercel is excellent for development and private/non-commercial demos, but SINNARA should not assume Hobby is the permanent public commercial host. Keep the application portable so the deployment target can change without redesigning the product. 

### **16. Free-first Infrastructure Decision** 

As of 14 September 2026, Supabase still offers a Free plan with 500 MB database size, 1 GB file storage, 5 GB egress, 50,000 monthly active users and 500,000 Edge Function invocations, with free projects pausing after one week of inactivity and a two-project limit. This is suitable for a private MVP but requires operational awareness. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

Gemini currently provides free access to selected models with model-specific rate limits. The pricing page also notes that free-tier content can be used to improve Google products, whereas paid services provide different data-use terms. This means SINNARA should minimize unnecessary transmission of sensitive data and review the current terms before moving to real scale. 

n8n self-hosted Community edition remains free indefinitely and includes most features, but self-hosting still introduces infrastructure and maintenance work. For MVP, use n8n only when it genuinely replaces application complexity; do not add it merely because it is available. 

|**Tool**|**MVP role**|**Decision**|
|---|---|---|
|Supabase Free|DB/Auth/Storage|Primary data platform|
|Gemini Free tier|AI inference|Initial provider behind gateway|
|Vercel Hobby|Development/private demo|Use cautiously because commercial use is<br>restricted|
|Cloudflare Free|Possible commercial-friendly web/edge<br>alternative|Evaluate if public hosting is needed before<br>paid Vercel|
|Docling|Document parsing|Evaluate in prototype<br>li|
|n8n Community|Optional orchestration|Use only for workflows that benefit from it|
|GitHub|Source control|Required|
|Claude Pro + Claude Code|Development agent|Primary implementation environment|



### **17. Scalability Path** 

Do not build microservices now. Build clean interfaces so a few high-load areas can become separate services later. 

MVP 

Next.js app + Supabase + AI gateway + scheduled jobs 

Growth stage separate ingestion workers separate AI job queue dedicated search/index service if Postgres search becomes insufficient stronger observability background worker fleet 

Scale stage service extraction only where metrics justify it read replicas / caching durable queues dedicated document processing workers employer platform + multi-tenant controls 

|**Likely future pressure**|**First scaling move**|
|---|---|
|Many opportunity sources|Dedicated ingestion worker and queue|
|High AI volume|Model routing, caching, batching and budget controls|
|Large search volume|Postgres indexing first, dedicated search later|
|Large file volume|Separate object storage tier|
|Employer traffic|Dedicated employer domain module and stronger tenancy<br>controls|
|Global rollout|Country configuration and region-aware infrastructure|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

### **18. Future Employer Architecture** 

Employer functionality is intentionally outside the MVP, but the data model must not block it. When candidate momentum is strong, employers can become a paid customer group with structured vacancy creation, AI shortlist generation and eventually an end-to-end recruitment workflow. 

Future employer workspace 

organization 

- -> employer users / roles 

- -> paid subscription 

- -> structured opportunity creation 

- -> candidate discovery (consent-controlled) 

- -> shortlist 

- -> invite to apply 

- -> in-platform applications 

- -> interview stages 

- -> hiring outcome 

- -> feedback / quality signal 

###### **Data flywheel timing** 

Only after employers manage meaningful parts of the workflow inside SINNARA should hiring outcomes become trusted training signals for ranking improvements. Until then, user-reported outcomes can be treated as optional feedback rather than ground truth. 

### **19. Claude Code Project Architecture** 

Claude Code should operate as the implementation agent inside a persistent repository. The project should give Claude enough permanent context to make consistent decisions, while moving long procedures into Skills so they load only when relevant. 

SINNARA/ CLAUDE.md README.md docs/ product-blueprint.md technical-architecture.md data-model.md ai-architecture.md ux-principles.md security.md roadmap.md decisions/ ADR-001-....md .claude/ skills/ architecture-review/SKILL.md data-model-review/SKILL.md ai-cost-review/SKILL.md security-review/SKILL.md ux-review/SKILL.md source-ingestion/SKILL.md testing/SKILL.md rules/ src/ tests/ 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

|**Claude facility**|**SINNARA use**|
|---|---|
|CLAUDE.md|Permanent architecture, coding conventions, product boundaries|
|Skills|Reusable procedures such as architecture review, security review<br>and testing|
|MCP|Only for useful external connections such as database or<br>documentation access|
|Subagents|Isolated research/review tasks that would otherwise consume<br>main context|
|Hooks|Formatting, tests and lightweight verification after changes|
|Auto memory|Local development learnings; not a replacement for project docs|



###### **Token discipline** 

The root CLAUDE.md should stay concise. Detailed procedures belong in Skills or project documents and are loaded on demand. This reduces context waste and helps Claude focus on the task at hand. 

### **20. Testing Strategy** 

|**Test type**|**MVP focus**|
|---|---|
|Unit|Matching rules, date logic, validation, deduplication, permissions|
|Integration|Supabase queries, storage access, AI gateway, ingestion adapters|
|Schema tests|AI JSON output and migration compatibility|
|End-to-end|Sign up -> upload -> extraction -> review -> recommendations|
|Failure tests|Provider timeout, parser failure, duplicate submission, expired job<br>i|
|Security tests|RLS, unauthorized file access, admin boundaries<br>i|
|UX performance|Time to interactive and time to first recommendation|



###### **Definition of done** 

A feature is not done when code compiles. It is done when the behavior is tested, failure paths are considered, security boundaries are respected, and the user experience is verified in a real browser. 

### **21. MVP Implementation Sequence** 

|**Phase**|**Technical milestone**|**Exit condition**|
|---|---|---|
|0|Repository, architecture docs,<br>environment setup<br>i|Claude can run the app and tests reliably<br>i|
|1|Auth + candidate profile shell|User can sign up and edit profile|
|2|Document upload + parser + extraction|Real CV produces editable structured draft|
|3|Opportunity schema + admin import|Admin can add and verify jobs|
|4|Ingestion adapters + deduplication|Selected sources produce clean records|
|5|Matching engine|Candidate receives useful ranked<br>opportunities|
|6|Recommendation UX|User can understand, save and open jobs|
|7|Notifications|Preference model works; approved<br>channel integration tested|
|8|Analytics/admin intelligence|Bottlenecks and relevance signals visible|
|9|Pilot hardening|Security, reliability, performance and<br>failure tests pass|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

### **22. Architecture Decisions to Freeze Before Coding** 

|**Decision**|**Proposed default**|**Revisit when**|
|---|---|---|
|Primary database|Supabase Postgres|Scale or cost makes dedicated DB<br>preferable|
|Auth|Supabase Auth|Need enterprise identity / advanced auth|
|File store|Supabase Storage|Volume or egress becomes material<br>i|
|Initial AI provider|Gemini via AiGateway|Quality, privacy, rate or cost no longer fit<br>f|
|Document parser|Docling evaluation candidate|Accuracy or hosting cost is insufficient|
|Web app|Next.js modular monolith|Independent scaling becomes necessary<br>l|
|Job orchestration|App-managed jobs first<br>i|Need complex workflow UI or many non-<br>code workflows<br>f|
|Search|Postgres first|Search scale/quality proves insufficient|
|Notifications|Adapter abstraction|WhatsApp/email economics or policy<br>changes|



### **23. Risks and Mitigations** 

|**Risk**|**Severity**|**Mitigation**|
|---|---|---|
|Low-quality opportunity sources|High|Source registry, verification, dedupe and<br>expiry|
|AI hallucination|High|Structured schemas, evidence grounding,<br>validation and review|
|Provider rate limits|High|Model routing, caching, queues, retries and<br>fallback|
|Sensitive document exposure|Critical|RLS, private storage, short-lived access,<br>server-side secrets|
|Hosting plan restriction|Medium|Keep hosting adapter-independent;<br>separate dev from commercial production|
|User notification fatigue|High|Preference engine, digests, relevance<br>thresholds and quiet hours|
|Overbuilding|High|MVP gate and feature flags|
|Source blocking or policy changes|High|Multiple ingestion methods and source<br>diversification|
|Wrong match ranking|High|Transparent explanations, user feedback<br>and versioned scoring|



### **24. References and Current Vendor Notes** 

The following current vendor documentation was checked on 14 September 2026 and is used only for architecture constraints. These facts can change, so they must be rechecked before production decisions. 

|**Source**|**URL**|**Used for**|
|---|---|---|
|Supabase pricing|https://supabase.com/pricing|Free plan quotas and project pausing.|
|Supabase billing docs|https://supabase.com/docs/guides/<br>platform/billing-on-supabase|Free project limits and usage quotas.|
|Vercel pricing|https://vercel.com/pricing|Current Hobby and Pro positioning.|
|Vercel terms|https://vercel.com/legal/terms|Hobby plan personal/non-commercial<br>restriction.|
|Gemini API pricing|https://ai.google.dev/gemini-api/docs/<br>pricing|Current model pricing/free-tier<br>information.|
|Gemini billing|https://ai.google.dev/gemini-api/docs/<br>billing|Free and paid tier behavior.|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Technical Architecture v1.0 

|Gemini rate limits|https://ai.google.dev/gemini-api/docs/<br>rate-limits|Rate-limit and usage-tier rules.|
|---|---|---|
|Docling architecture|https://docling-project.github.io/docling/<br>concepts/architecture/|Structured document processing<br>architecture.|
|Docling quickstart|https://docling-project.github.io/docling/<br>getting_started/quickstart/|Document conversion and Markdown<br>export.|
||https://github.com/n8n-io/n8n-docs/||
|n8n Community edition|blob/main/docs/deploy/host-n8n/<br>community-edition-features.md|Self-hosted free Community edition scope.|
|Claude Code overview|https://code.claude.com/docs/en/<br>overview|Skills, MCP and project workflow.|
|Claude Code memory|https://code.claude.com/docs/en/memory|CLAUDE.md and memory behavior.|
|Claude Code skills|https://code.claude.com/docs/en/skills|On-demand reusable workflows.|



### **25. Immediate Next Step** 

Before implementation, the next document should be SINNARA Data Model and Database Schema. It should translate the entities above into concrete tables, keys, indexes, constraints, RLS policies, storage buckets, audit structures and migration order. After that, we should run a small technical proof of concept using real anonymized CVs, certificates and sample job postings to validate the document pipeline and AI extraction before building the full candidate experience. 

###### **Implementation rule** 

Claude should be allowed to challenge an architecture decision when evidence suggests a better approach, but it must explain the trade-off, protect the MVP boundary and record major changes as an architecture decision rather than silently rewriting the design. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

