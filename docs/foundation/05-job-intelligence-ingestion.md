**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

# **SINNARA** 

## **Job Intelligence Architecture & Source/Ingestion System** 

MVP v1.0 

_Sudan-focused today. Source-agnostic and globally extensible underneath._ 

Purpose: define how SINNARA discovers, retrieves, parses, normalizes, verifies, deduplicates, versions, ranks and publishes career opportunities, while keeping the system efficient, trustworthy and inexpensive to operate. 

Research basis: current job-recommender literature, fair recruitment and AI-in-HR guidance, employment taxonomies, and current source/API documentation were reviewed during preparation of this architecture. [R1-R12] 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

### **1. Executive Architecture** 

The central design decision is that SINNARA must treat job intelligence as a data pipeline, not as a scraping task and not as an AI-agent task. The platform should collect authoritative opportunity records, preserve raw provenance, normalize jobs into a canonical representation, enrich them with standardized skills and occupations, verify freshness and application paths, detect duplicates and reposts, and only then expose them to the matching engine. 

```
SOURCE REGISTRY
      |
      +--> Discovery adapters
             API | RSS | Sitemap | ATS | HTML | Structured data | Social/manual
                         |
                         v
                 Fetch + fingerprint
                         |
                         v
                  Raw source record
                         |
                  Parse / extract
                         |
                         v
                Canonical opportunity
                         |
        +----------------+-----------------+
        |                |                 |
   Taxonomy        Quality / trust     Versioning
   mapping         + validation        + freshness
        |                |                 |
        +----------------+-----------------+
                         |
                         v
                 Search / retrieval
                         |
                         v
                Matching + ranking
                         |
                         v
             Candidate opportunity feed
```

The pipeline should be modular but not microservice-heavy. The MVP can run inside the single SINNARA application repository described in the Technical Architecture, with scheduled/background jobs and clear interfaces between ingestion, normalization, matching and publication. 

### **2. Research Findings That Shape SINNARA** 

Recent reviews of job recommender systems repeatedly identify hybrid approaches as the practical direction: contentbased and semantic methods are useful for sparse or cold-start settings, while knowledge-based, contextual, reciprocal and temporal signals improve real-world recommendation quality. A 2026 literature review also highlights the lack of standardized skill/competency representation and the need for explainability, fairness and hybrid architectures. [R1][R2] 

For SINNARA this implies a deliberate progression: normalize first, retrieve with multiple signals, apply hard constraints, rerank with transparent business logic, and reserve generative AI for interpretation and explanation. We should not train a complex end-to-end ranking model before SINNARA has enough reliable interaction and outcome data. 

Job recommendation is also temporal. A job that was a perfect semantic match yesterday may be useless today because it expired, was removed, changed, or is close to closing. Literature specifically identifies temporal modeling and interaction history as important dimensions of job recommendation. [R3] 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

#### **SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

Fairness and governance must be designed into the system because employment recommendation can influence access to opportunity. Recent ILO and OECD work warns that flawed objectives, poor data, opaque models and proxy variables can make AI systems reproduce or amplify inequity. [R4][R5] 

### **3. Non-Negotiable Design Principles** 

1. Authority before intelligence: Prefer first-party employer or ATS data over aggregators. Never let a lower-trust source silently override a higher-trust source. 

2. Freshness before relevance: An excellent match that is no longer open is not a recommendation. 

3. Evidence before inference: Every material job fact must have a provenance reference to source content or a verified source field. 

4. Normalize before matching: Titles, skills, locations, employment types and dates must be normalized before ranking. 

5. Deterministic gates before semantic ranking: Hard requirements should not be delegated to an LLM. 

6. One canonical opportunity, many observations: A job can appear through multiple channels but should resolve to one canonical opportunity with source observations and versions. 

7. Idempotency everywhere: The same source state should not create repeated jobs, repeated AI calls or repeated notifications. 

8. Quality over volume: 100 trustworthy opportunities are more valuable than 5,000 duplicates or stale listings. 

9. Adaptive automation: Crawl more often when a source changes frequently; back off when it is quiet or failing. 

10. Design for replacement: Source adapters, parsers, taxonomies, models and schedulers must be replaceable without rewriting the product. 

### **4. Source Intelligence Model** 

SINNARA should maintain a Source Registry as the control plane for all ingestion. A source is not merely a URL. It is an entity with a known authority level, access mechanism, update pattern, parsing strategy, legal/technical constraints and health history. 

|**Source class**|**Examples**|**Preferred method**|**Trust**|**MVP**|
|---|---|---|---|---|
|Official ATS / job board<br>API|Greenhouse, Lever, other<br>employer ATS|API / public JSON|Very high|Yes where available|
|Official employer careers<br>page|UN agency or company<br>careers site|Structured HTML / JSON-<br>LD / HTML|Very high|Yes|
|Official structured feed|RSS/Atom, sitemap,<br>public feed|Feed / sitemap|High|Yes|
|Official social account|Organization<br>LinkedIn/Facebook/Teleg<br>ram post|Official API where<br>permitted; otherwise<br>monitored/manual<br>source|High|Limited|
|Curated aggregator|ReliefWeb and similar<br>sources|Public API / feed|High if provenance is<br>retained|Yes|
|Generaljob aggregator|Third-party job site|API/feed/page|Medium|Selective|
|Manual submission|Admin-entered<br>opportunity|Admin form|Variable, verified by<br>admin|Yes|



ReliefWeb is particularly relevant to SINNARA because its public API exposes curated, continuously updated content and its jobs schema includes URL, title, source, closing date, body, application instructions and job metadata. [R6] 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

#### **SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

Greenhouse is a useful model for ATS ingestion: its public Job Board API exposes published jobs without authentication, can include full content, offices and departments, and exposes updated timestamps and job identifiers. Lever likewise exposes published postings and posting states through its API. [R7][R8] 

### **5. Source Registry Schema** 

|**Field**|**Purpose**<br>i|
|---|---|
|source_id|Stable internal identifier|
|organization_id|Owningorganization where known|
|source_name|Human-readable name|
|source_url|Root source endpoint<br>f|
|source_type|ats_api,official_site,rss,sitemap,social,aggregator,manual|
|access_method|api,rss,atom,sitemap,html, json_ld,browser/manual|
|adapter_key|Code adapter responsible for discovery/fetching|
|authority_tier|A,B,C,D|
|country_scope|Countries/markets covered|
|category_scope|Jobs,internships,fellowships,etc.<br>f|
|crawl_policy<br>i|Default schedule,backoff and concurrency|
|verification_policy|Rules forpublication and refresh|
|terms_notes|Operational notes about access constraints|
|active|Whether scheduledjobs should run|
|last_success_at / last_failure_at|Operational health|
|health_score|Rollingsource reliabilityindicator|
|last_content_change_at<br>i|Most recent observed change|
|etag/ last_modified|HTTP cache validators when supported|



### **6. Ingestion Pipeline** 

1. Discover: Find new candidate URLs/records using an adapter. 

2. Fetch: Retrieve the source using bounded timeouts, conditional requests and source-specific policies. 

3. Fingerprint: Compute canonical URL, content hash, source record ID and normalized text fingerprints. 

4. Parse: Convert HTML, JSON, feeds, PDFs or other input into clean source content while retaining structure. 

5. Extract: Use deterministic selectors first; use AI extraction only when structure is insufficient. 

6. Normalize: Map fields into SINNARA's canonical opportunity schema. 

7. Taxonomize: Map titles, occupations, skills, sectors and employment types to controlled vocabularies. 

8. Validate: Check required fields, URLs, dates, contradictions and evidence coverage. 

9. Deduplicate: Resolve exact, near-duplicate and reposted records to a canonical opportunity. 

10. Verify: Check source accessibility, deadline, application path and authority level. 

11. Publish: Make the opportunity eligible for candidate matching only after quality gates pass. 

12. Refresh / expire: Recheck open opportunities adaptively; mark closed/stale/removed states when evidence changes. 

13. Observe: Store operational metrics, errors and source health without duplicating raw sensitive content into analytics. 

### **7. Adapter Framework** 

Every source should implement a small common interface. This prevents source-specific logic from spreading across the application. 

```
SourceAdapter
  discover(cursor) -> candidate_records
  fetch(candidate) -> raw_response
  parse(raw_response) -> source_observation
  get_freshness_hint(observation) -> timestamp | null
  verify(observation) -> verification_result
  normalize(observation) -> canonical_payload
```

SINNARA • Internal Product & Engineering Blueprint • v1.0 

#### **SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

Adapters should be deliberately thin. Parsing and normalization logic should rely on shared services whenever possible: URL canonicalization, HTML cleaning, schema.org parsing, date normalization, location normalization, taxonomy mapping, fingerprinting and validation. 

### **8. Discovery and Fetching Strategy** 

|**Method**|**Use when**|**SINNARApolicy**<br>f|
|---|---|---|
|API|Public/authorized API exists|Preferred: structured, efficient, low parsing<br>risk<br>f|
|RSS / Atom|Source publishes feeds|Very efficient; treat feed item links as<br>observations|
|Sitemap|Employer lists canonical job URLs|Use <lastmod> when accurate; crawl only<br>job URLs whenpossible|
|ATS endpoint|Employer uses a public ATS board|Prefer direct ATS API/JSON over scraping<br>renderedpages|
|JSON-LD / JobPosting|Page embeds structured data|Parse as a high-value extraction signal;<br>cross-check against visible content<br>i|
|HTML page|No structured feed/API|Use source-specific selectors, then generic<br>extraction fallback|
|PDF attachment|Description lives in attached vacancy<br>document|Parse with document pipeline; retain source<br>PDF URL andpublication evidence<br>f|
|Social post|Vacancy is announced on a permitted<br>official channel|Use official API or manual/authorized<br>ingestion; store source post separately from<br>application URL|
|Manual admin entry|Source cannot be automated reliably|Provide a fast admin intake form and<br>preserveprovenance|



Google explicitly recommends JobPosting structured data on individual job pages and accurate last-modified/update information in sitemaps/feeds. SINNARA should use these signals because they reduce parsing ambiguity and unnecessary crawling. [R9] 

### **9. Job Extraction and Normalization** 

AI extraction should not start from the raw internet whenever deterministic structure is available. The preferred order is: source API fields -> JSON-LD/structured data -> clean HTML sections -> document text -> LLM interpretation. This minimizes token use and improves repeatability. 

|**Canonical field**|**Extraction strategy**|**Evidence requirement**|
|---|---|---|
|Title|Source field / JSON-LD / heading|Direct source value|
|Organization|Source field +page metadata|Source identity|
|Location|i<br>Source field / JSON-LD / visible location|Location textplus confidence|
|Opportunity type|i<br>Source enum / rules / AI only when<br>ambiguous|i<br>Section or field|
|Employment type|Source field / structured data|Source evidence|
|Date posted|i<br>Source field / JobPosting datePosted / feed<br>timestamp|Source evidence|
|Deadline|Source field / explicitphrase / ATS field|Exact source text or field|
|Description|ii<br>Raw source content,cleaned|i<br>Original URL|
|Requirements|Section detection + AI structured extraction|Requirement span references|
|Skills|Taxonomymappingfrom extractedphrases|Phrase + canonical skill mapping|
|Application URL|CTA/form/action field|Direct applicationpath|
|Source URL|i<br>Canonical sourcepage|Always retained|
|Status|Source state + page availability + deadline<br>logic|Verification event|
|Salary|Explicit source value only|Do not infer missingsalary|



SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

### **10. Taxonomy and Skill Normalization** 

SINNARA should not invent a proprietary skill universe in the MVP when a well-maintained open taxonomy can provide a starting layer. ESCO is especially useful because it is designed for job matching, career guidance and skills intelligence, exposes stable identifiers, and can be downloaded or accessed via API. Its current published version is ESCO v1.2.1. [R10] 

O*NET is useful as a secondary reference for occupations and skill relationships, particularly for cross-market enrichment and occupation-level context. O*NET Web Services exposes occupation and skill data through REST APIs. [R11] 

For the MVP, maintain SINNARA's own canonical skill table, but add external taxonomy identifiers and aliases rather than making ESCO or O*NET the database's primary identity. This protects the model from taxonomy-version changes and makes later regional enrichment possible. 

```
Raw phrase: "MS Excel", "Excel spreadsheets", "advanced Excel"
        |
        +--> alias resolver
        |
        +--> canonical skill: Microsoft Excel
        |
        +--> taxonomy links: ESCO / O*NET where available
        |
        +--> evidence: source span + extraction run
```

### **11. Opportunity Quality, Trust and Publication Gates** 

An opportunity should have separate internal dimensions for authority, completeness, freshness and verification. Do not collapse these into a single opaque score. 

|**Dimension**|**Example signals**<br>f  f|**Action**|
|---|---|---|
|Authority|Official employer/ATS, official social,<br>curated aggregator,third-party|Controls source weighting<br>i|
|Completeness|Title, org, location, deadline, application<br>path,requirements|Block publication when critical fields are<br>missing|
|Freshness|Recent update, accessible page, deadline<br>status|Adjust recency and recheck schedule|
|Consistency|Title/organization/location match across<br>structured and visible content<br>f|Flag contradiction|
|Application integrity|Official application URL works and points to<br>the intended role<br>i|High-priority verification<br>i|
|Provenance|Everymaterial field has source evidence|Required before high-confidencepublication|



A job should be published only when it clears a minimum quality gate. Low-confidence opportunities may remain in an admin review queue instead of entering the user feed. 

### **12. Deduplication and Repost Resolution** 

Duplicate jobs are not merely a data-cleaning inconvenience. They distort user trust, notification frequency, popularity signals and future ranking models. Deduplication therefore belongs before matching and before analytics. 

```
Exact layer
  source_record_id
  canonical_url
  ATS job ID
        |
Near-duplicate layer
  organization + normalized title + location + date window
```

SINNARA • Internal Product & Engineering Blueprint • v1.0 

#### **SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

```
  normalized description fingerprint
  token similarity / SimHash / MinHash
        |
Semantic suspicion layer
  embedding similarity only for borderline pairs
        |
Decision
  merge -> new source observation
  version -> changed posting
  separate -> genuinely different roles
```

Do not automatically merge two jobs merely because title and organization match. Preserve a canonical opportunity plus source observations and opportunity versions. When a job is reposted after a meaningful closure period, it may be a new opportunity rather than a new version of the old one. 

### **13. Opportunity Versioning and Temporal State** 

|**State**|**Meaning**<br>i|**User-facing treatment**|
|---|---|---|
|discovered|Seen but notyet normalized/verified|Not visible|
|draft_review|Needs admin or automated review|Not visible|
|published|Open andpassesquality gates<br>i|Visible|
|stale|Could not confirm current state within<br>freshness threshold|Visible only with caution or hidden, policy-<br>dependent|
|closed|Source says closed or application path no<br>longer accepts applications|Remove from active feed|
|expired|Deadlinepassed and no contraryevidence|Archive|
|removed|Source record disappeared or was explicitly<br>removed|Archive|
|superseded|Replaced bya newer canonical version<br>i|Archive with relationshipto replacement|
|error|Processing/verification failed|Adminqueue|



Every substantive change should create an opportunity version, preserving source snapshots or hashes. This lets SINNARA answer: what did the job say when we recommended it? That is essential for trust, debugging and future dispute handling. 

### **14. Source Health and Adaptive Scheduling** 

A fixed crawl interval for every source is inefficient. SINNARA should maintain a lightweight source health model that controls frequency and concurrency. 

|**Signal**|**Interpretation**|**Scheduling effect**|
|---|---|---|
|Change rate|How often records actuallychange|Higher change rate -> shorter interval|
|Success rate|HTTP/API success over recent runs|Lower success -> exponential backoff|
|Freshness drift|Difference between source update time and<br>observed time|Large drift -> increase priority|
|Volume|Number of new/changed opportunities per<br>run|High volume -> batch processing and<br>incremental checkpoints|
|Last-modified support|ETag/ Last-Modified available|Use conditional requests|
|Deadline density|How oftenjobs are near closing|Increase refresh frequencyfor activejobs|
|Source criticality|Importance to SINNARA users|Protect capacityfor high-value sources|



The source scheduler should behave like a control loop: observe, adjust, re-run. This is more efficient than blindly polling every source at the same rate. 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

### **15. Freshness and Reverification Algorithm** 

Freshness should be field-aware. Deadline and application-path freshness matter more than a generic page timestamp. SINNARA should maintain a next-verification time for each opportunity and dynamically reduce or increase it. 

```
next_check = base_interval
            * source_backoff_factor
            * volatility_factor
            * deadline_factor
            * authority_factor
```

```
Clamp to minimum / maximum allowed interval.
```

Example policy: a newly discovered high-authority job with a deadline in 24-48 hours should be rechecked more often than a long-running seasonal vacancy with no explicit closing date. The exact coefficients should be configuration, not hardcoded constants. 

### **16. Matching Architecture: Candidate Generation First** 

SINNARA should separate retrieval from ranking. The first task is to identify a manageable candidate set of opportunities; the second is to rank that set accurately. This lowers latency and AI cost. 

```
Candidate profile
   |
   +--> hard filters (country / location / work mode / seniority / explicit eligibility)
   |
   +--> lexical retrieval (Postgres full text / BM25-like ranking)
   |
   +--> semantic retrieval (optional embeddings / pgvector)
   |
   +--> taxonomy expansion (skills / occupations / aliases)
   |
   v
Candidate set (e.g. top 100)
   |
   +--> deterministic scoring
   |
   +--> freshness / opportunity quality
   |
   +--> diversity / redundancy control
   |
   v
Top ranked opportunities
   |
   +--> LLM explanation for selected results only
```

This architecture follows the evidence that hybrid job recommendation methods are more appropriate for heterogeneous and sparse labor-market data than a single technique. [R1][R2] 

### **17. Smart Matching Algorithm v1** 

The MVP should use an interpretable scoring policy, not a black-box neural ranking model. The policy can evolve into learning-to-rank once SINNARA has sufficient validated interaction data. 

|**Component**|**Illustrative weight**|**Description**|
|---|---|---|
|Hard eligibility|Gate|Explicit requirements that are genuinely non-<br>negotiable|
|Skill coverage|25%|Coverage of required and preferred<br>normalized skills,weighted byimportance|
|Relevant experience|20%|Similarity and recency of experience to role<br>requirements|



SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

|Education|15%|Degree/discipline alignment and required<br>level|
|---|---|---|
|Career alignment|12%|Fit with target roles, sectors and plausible<br>progression|
|Location/work mode|10%|Current location, relocation willingness and<br>remote/on-site fit|
|Language|5%|Required/proven languageproficiency|
|Availability|4%|Start-date and availabilityalignment<br>i|
|Evidence strength|4%|Confidence that matching claims are<br>supported byuser evidence|
|Freshness/context|5%|Opportunity freshness and deadline context;<br>usedprimarilyfor feed ordering|



Weights are initial policy values, not scientific truths. They must be configurable, versioned and evaluated against a human-reviewed benchmark. The final user-facing result should emphasize a qualitative label and reasons rather than imply that the score is a probability of hiring. 

### **18. Hard Requirement Handling** 

A common failure in automated screening is treating missing information as a failure. SINNARA should distinguish: Pass, Fail, Unknown and Possibly satisfied through equivalent evidence. 

|**Requirement state**|**Example**<br>i|**Action**|
|---|---|---|
|Pass|Bachelor degree verified; required 2 years<br>experience verified|No penalty|
|Fail|Explicit maximum/minimum requirement<br>contradicted bycandidate evidence|Exclude or strong penalty, depending on<br>requirement type|
|Unknown|Posting requires French but candidate has<br>no language data|Do not assume fail; mark as unknown/gap|
|Equivalent|Posting says "monitoring and evaluation"<br>while candidate has "M&E"|Resolve through alias/taxonomy|
|Preferred missing|Preferred Power BI notpresent<br>ii|Penaltysmaller than a required skillgap|
|Evidence conflict|CV says 3 years, certificate/profile says<br>different date|Flag for review|



### **19. Ranking Quality Beyond Similarity** 

Pure similarity ranking can create repetitive feeds: the same employer, the same title and the same type of role can dominate the first screen. SINNARA should apply a lightweight diversity layer after relevance scoring. 

Recommended rule set: limit near-identical duplicate roles; cap repeated organization exposure within a short feed window; avoid showing multiple versions of the same opportunity; reserve a small portion of slots for adjacent but plausible roles; and penalize opportunities that the user has already viewed or dismissed unless material changes occurred. 

This creates an exploration/exploitation balance without requiring reinforcement learning. Later, the platform can learn from clicks, saves and application actions, but should protect against popularity feedback loops. 

### **20. Learning from User Behavior** 

MVP feedback should begin as analytics, not automatic model training. Events such as impression, open, save, hide, click application, return to job, notification click and user-reported relevance can feed dashboards and evaluation datasets. 

|**Signal**|**Meaning**|**Early use**|
|---|---|---|
|Open|Basic interest|UXquality|
|Save|Stronger interest|Candidatepreference signal|



SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

|Applyclick|High-value intent|Relevance evaluation|
|---|---|---|
|Hide / not relevant<br>i|Negative signal|Immediate suppression<br>i|
|Notification click|Alertquality|Notificationpolicy|
|Repeated viewing|Unresolved interest<br>i|Potential follow-upcue|
|User correction|Profile/job extraction issue|Qualityimprovement|
|Interview outcome later|Strongsuccess signal,when userprovides it|Future rankingvalidation|



Research on job recommender systems notes the importance of click and interaction data but also the difficulty of sparse data, bias and generalization. SINNARA should therefore treat behavioral signals as one input, not as ground truth. [R2] [R3] 

### **21. Cold Start and Sparse Data Strategy** 

SINNARA will have no meaningful collaborative signal at launch. The MVP must therefore work well for a single user with no history. 

- Content-based profile/job matching is the primary cold-start mechanism. 

- Taxonomy expansion compensates for different wording of the same skill. 

- Preference collection uses progressive profiling rather than a long onboarding form. 

- Freshness and opportunity quality prevent popular but irrelevant jobs from dominating. 

- Human-reviewed benchmark users can provide early feedback before training any learned ranker. 

- Later, collaborative and sequence signals can be added only after enough interaction volume exists. 

### **22. Where AI Should and Should Not Be Used** 

|**Use AI for**|**Do not use AI for**|
|---|---|
|Interpretingambiguousjob descriptions|Schedulingcrawls|
|Extractingrequirements from messy prose/PDFs|Checkingwhether a deadline is in thepast|
|Skill and title normalization when deterministic aliasingfails|Permission enforcement|
|Explainingwhyajob matched|Deduplicationprimarykeylogic|
|Career/adjacent-role reasoning<br>f|Canonicaljob status<br>i|
|Resolvingdifficult semantic equivalence cases|Notification suppression rules|
|Generatinginternal summaries for admins|Source health calculations|



Gemini structured output should be used for extraction tasks because the API supports JSON Schema-constrained output. The AI Architecture already defines validation and evidence contracts; Job Intelligence must call those contracts rather than inventing ad hoc JSON. [R12] 

### **23. Provenance Model** 

Every canonical field that materially affects matching should be traceable to its source. Provenance is not just for compliance; it is a debugging and trust mechanism. 

```
opportunity
  |
  +--> opportunity_version
        |
        +--> source_observation
              |
              +--> source_url / source_record_id
              +--> fetched_at
              +--> content_hash
              +--> parser_version
              +--> extraction_run_id
              +--> field_evidence[]
```

SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

|**Field**|**Minimumprovenance**<br>i|
|---|---|
|Deadline|Source text/field + fetched timestamp<br>i|
|Location|Source field or evidence span|
|Required skill|Requirement evidence + extraction run|
|Application URL|Direct URL source|
|Salary|Explicit source statement<br>i|
|Opportunitystatus|Latest verification event + source response/page state|



### **24. Social and High-Noise Sources** 

Social channels can surface valuable Sudanese opportunities but should be treated as a distinct ingestion class because posts may be informal, rapidly edited, duplicated or detached from the official application page. 

|**Rule**|**Implementation**|
|---|---|
|Source authenticity|Store account/page identityand authoritytier|
|Post-to-job relation|Create a social observation linked to the canonical opportunity|
|Applicationpath|Prefer direct official application URL over social URL<br>i|
|Expiration|Require deadline or explicit verification wherepossible|
|No link|Permit admin review but lower trust|
|Edited/deletedpost|Record changed/deleted observation,do not silentlyerase history<br>f|
|Platform access|Use official APIs/authorized mechanisms where available; do not<br>make the MVP dependent onprohibited scraping|



LinkedIn currently exposes an official Posts API for authorized posting and retrieval scenarios, with permissions varying by member and organization role. This supports using LinkedIn as a future distribution connector but does not justify designing SINNARA around unrestricted scraping of LinkedIn jobs or social data. [R13] 

### **25. Conflict Resolution Across Sources** 

When multiple sources describe the same opportunity, SINNARA should resolve conflicts using authority and freshness instead of simply taking the latest observation. 

`1. First-party ATS / employer careers page` 

`2. Official employer organization account` 

`3. Curated source with clear provenance` 

`4. Reputable aggregator` 

`5. Unverified repost / manual lead` 

```
Within the same tier:
```

```
  newer verified observation > older observation
```

If a lower-tier source has a newer deadline than a higher-tier source, do not silently overwrite. Flag the conflict, recheck the first-party source and, if unresolved, display the higher-confidence value or mark the deadline as requiring verification. 

### **26. Separate Source URL, Job URL and Application URL** 

This distinction should be explicit in the schema because a social post may point to an employer page, while the employer page points to an ATS form. SINNARA should never force users to navigate through an aggregator if a direct official application path exists. 

|**URL type**|**Purpose**|
|---|---|
|source_url|Where SINNARA discovered the observation|
|canonical_job_url|Canonical employer/ATSpage describingthe role|
|application_url|Direct route where the candidate submits the application<br>f|
|organization_url|Official organization identity page|



SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

### **27. Temporary, Seasonal and Non-Standard Opportunities** 

The canonical schema must support seasonal, temporary, casual, project-based, consultancy, internship, fellowship and part-time roles. These are not edge cases; they can be particularly relevant in volatile labor markets. 

|**Opportunity type**|**Required metadata**|
|---|---|
|Temporary|Contract duration if stated|
|Seasonal|Season or activity period|
|Consultancy|Assignment duration,deliverables if stated|
|Internship|Paid/unpaid if explicitlystated,duration|
|Fellowship|Program dates,eligibility,fundingif stated|
|Part-time|Hours or workload if available|
|Remoteproject|Work arrangement + eligible locations|



### **28. MVP Source Rollout Strategy** 

Do not attempt internet-scale ingestion at launch. Build a deliberately small source portfolio that proves quality and coverage. 

|**Wave**|**Focus**|**Target**|
|---|---|---|
|Wave 1|Public APIs + structured official sources|ReliefWeb plus a small set of ATS/employer<br>sources|
|Wave 2|Official employer sites|Selected UN/NGO/private-sector careers<br>pages|
|Wave 3|Feeds and sitemaps|Expand reliable coverage while controlling<br>crawl cost<br>f|
|Wave 4|High-value social sources|Authorized/official channels with admin<br>verification|
|Wave 5|Broader aggregators|Only where provenance and freshness are<br>acceptable|



The first objective is not "maximum jobs." It is a measurable statement such as: SINNARA can maintain a trustworthy active set of several hundred relevant Sudan-accessible opportunities with low duplication and high application-link accuracy. The exact volume target should be set from the pilot source inventory. 

### **29. Admin Job Intelligence Dashboard** 

|**Dashboard area**|**Key indicators**|
|---|---|
|Source health|Success rate,latency,last change,failures,next run|
|Ingestionqueue|Queued/running/failed/dead-letter records|
|Quality|Completeness,evidence coverage,validation failures|
|Duplicates|Merge candidates,duplicate rate,false merges<br>i|
|Freshness|Openjobspast verification SLA,expired still visible|
|Coverage|Active opportunities bysector,location,organization,source|
|Matchingsupply|Opportunities eligible for matching,low-quality pool|
|User feedback|Hidden/not relevant rate,save/applyclick rates|
|AI cost|AI runs,token usage,extraction callsper newjob<br>l|
|Trust|Application URL failure rate,source conflict rate|



### **30. Required Data Model Extensions** 

The existing Data Model should be extended or confirmed to support the following ingestion-specific entities: 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

|**Entity**|**Purpose**|
|---|---|
|source_registry|Source configuration and operational metadata|
|source_runs|One execution of a source adapter<br>i|
|source_observations|Raw observation of a specificjob from a source|
|opportunity_versions<br>i|Historical canonicaljob states|
|field_evidence|Field-levelprovenance and extraction evidence|
|dedupe_candidates|Borderline duplicatepairs awaitingdecision|
|verification_events|Status/freshness/application-link checks|
|taxonomy_mappings|External skill/occupation mappings and versions|
|processing_jobs|Idempotentpipeline work|
|source_health_metrics|Aggregated source reliabilitystatistics|



### **31. Current Ecosystem Notes Relevant to Implementation** 

Several current public interfaces make the proposed architecture practical without buying a job-data provider at MVP stage: 

- ReliefWeb exposes a public API and a jobs schema with structured closing dates and application fields. [R6] 

- Greenhouse exposes published job data through a public Job Board API with IDs, updated timestamps, content and application metadata. [R7] 

- Lever exposes job postings and posting states through its developer API. [R8] 

- Google documents JobPosting structured data and sitemap/feed freshness signals, which are useful for generic employer-site ingestion. [R9] 

- ESCO provides downloadable and API-accessible standardized skills and occupations specifically intended for job matching and career guidance. [R10] 

- O*NET provides occupation and skills APIs as a secondary taxonomy reference. [R11] 

- n8n Community edition remains free for self-hosting and can orchestrate ingestion workflows, but SINNARA should only add it where the operational benefit exceeds the maintenance burden. [R14] 

### **32. Security and Source Risk** 

Job pages are untrusted external content. The ingestion pipeline must treat all retrieved text, HTML, PDF instructions and embedded prompts as data, not instructions to the application or AI model. 

- 

   - Sanitize HTML and never execute source JavaScript inside the extraction pipeline. 

- Prevent prompt injection from job descriptions from changing SINNARA system behavior. 

- 

- 

- 

- 

- 

- Limit fetched content size and response time. 

- Use SSRF protections and allowlisted protocols/ports for automated fetching. 

- Never expose source fetch credentials to the browser. 

- Keep raw source content separate from executable templates and application instructions. 

- Log source retrieval errors without leaking credentials or full private content. 

### **33. Performance and Cost Optimization** 

The highest leverage cost rule is: do not call AI twice for the same deterministic input. Every source observation should carry a content hash, parser version, extraction contract version and model policy version. If those inputs have not changed, reuse the previous result. 

|**Optimization**|**Mechanism**<br>i|
|---|---|
|Conditional HTTP|ETag/ Last-Modified where supported|
|Content hashing|Skip parse/AI on unchanged content<br>i|
|Layered extraction|Structured fields before LLM|
|Batching|Process source records in bounded batches<br>i|
|Top-K semantic matching|Embed onlycanonicalprofile/job text and retrieve small candidate|



SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

||sets|
|---|---|
|Cache taxonomymappings|Avoid repeated normalization of commonphrases<br>f|
|Backgroundprocessing|Move expensive work off requestpath|
|Circuit breakers|Pause low-prioritysources/models duringoutages|
|Adaptive crawl|Spend compute on volatile/high-value sources|
|Dead-letterqueues|Do not endlesslyretrybroken records|



### **34. Evaluation Framework** 

SINNARA must build an offline evaluation set before it attempts to learn from live behavior. The benchmark can begin with a few dozen candidate profiles and hundreds of opportunities, judged by at least one knowledgeable reviewer and expanded over time. 

|**Component**|**Metric**|
|---|---|
|Extraction|Fieldprecision/recall,evidence coverage|
|Deadline|Exact accuracyand freshness|
|Application URL|Correctness and reachability|
|Skills|Canonical mappingaccuracy|
|Deduplication|Precision of merges,recall of duplicates<br>i|
|Freshness|Percent of active feedjobs verified within SLA|
|Matching|Precision@K / Recall@K on reviewedpairs|
|Ranking|NDCG@K orpairwisepreference accuracy|
|Diversity|Duplicate exposure and organization concentration|
|User value|Apply-click rate and user relevance feedback|



The first ranking benchmark should favor high precision over high recall. SINNARA's promise is to reduce the candidate's search burden, not maximize the number of jobs shown. 

### **35. Implementation Roadmap for MVP** 

J1 — Source registry: Create source table, adapter interface, source-run logging and one manual source. 

J2 — First API adapter: Implement ReliefWeb ingestion and canonical normalization. 

J3 — Official ATS adapter: Implement one public ATS adapter such as Greenhouse where a relevant employer/source is available. 

J4 — Generic structured page parser: Support JSON-LD JobPosting, canonical URL, title/location/date fields. 

- J5 — Validation and provenance: Add field evidence, quality gates and admin review queue. 

- J6 — Deduplication: Exact + deterministic near-duplicate matching; add semantic suspicion later. 

- J7 — Freshness engine: Status transitions, verification schedules and source health. 

- J8 — Taxonomy layer: Seed ESCO-backed skills/occupations plus SINNARA aliases. 

- J9 — Matching v1: Hard gates + weighted scoring + lexical retrieval. 

J10 — Semantic retrieval: Optional embeddings/pgvector after baseline quality is measured. 

J11 — Feed ranking: Freshness, user preferences, diversity and suppression. 

- J12 — AI explanations: Generate grounded explanations from stored match evidence. 

J13 — Behavioral feedback: Log interactions and build admin quality metrics. 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

J14 — Pilot evaluation: Run with real users, correct sources, tune policies and only then consider learned ranking. 

### **36. Future Evolution: From Rules to Learned Ranking** 

When SINNARA has sufficient validated interaction and outcome data, the architecture can evolve from policy-based ranking to learning-to-rank. The important point is that the data contracts should not change: candidate/job representations, evidence, source provenance and event logs remain the same. 

```
Phase A: rules + taxonomy + lexical
Phase B: rules + embeddings + tuned weights
Phase C: supervised learning-to-rank using high-quality labels
Phase D: reciprocal ranking for employers and candidates
```

```
Phase E: constrained optimization for diversity/fairness + business objectives
```

Research on reciprocal recommenders highlights that recommendation quality is multi-sided: employers, candidates and platform objectives can conflict. When SINNARA introduces employer matching, the ranking layer should become a reciprocal recommendation service rather than simply reversing the candidate-side score. [R15] 

### **37. Fairness and Governance Controls** 

Because matching influences access to jobs, fairness should be treated as a product quality dimension. The MVP should not use protected characteristics as positive or negative ranking factors, and should be careful with proxies such as location, institution prestige or career history when these may encode structural inequality. 

- Keep explainable feature contributions for each match. 

- Keep model/ranking policy versions so recommendations can be audited. 

- Avoid training directly on historical hiring outcomes until their biases are understood. 

- Monitor whether the system systematically deprioritizes certain groups because of proxy variables or source coverage gaps. 

- Distinguish candidate preference from candidate worth; location preference should not be treated as a measure of competence. 

- Use human review for disputed or high-impact cases once employer-side decisions are introduced. 

The 2026 literature review and ILO/OECD work support this architecture: representation quality, objective definition, data quality, explainability and fairness must be addressed together rather than as separate post-launch features. [R1][R4][R5] 

### **38. Architecture Decisions to Freeze** 

|**Decision**|**Status**|
|---|---|
|Source-agnostic adapter framework|Freeze|
|Canonical opportunity+ source observations + versions|Freeze|
|Authority/freshness/completeness tracked separately|Freeze|
|Structured data before LLM extraction|Freeze|
|Field-levelprovenance for material facts<br>i|Freeze|
|Deterministic hard filters before semantic ranking|Freeze<br>i|
|Hybrid lexical + semantic retrievalpath|Freeze;semantic optional in firstprototype|
|Interpretable weighted scoringfor MVP|Freeze|
|LLM explanation after ranking|Freeze|
|Adaptive source scheduling|Freeze|
|Exact + near-duplicate deduplication beforepublication|Freeze|
|Behavioral data collected before learning-to-rank|Freeze|
|TaxonomyIDs versioned and replaceable|Freeze|
|No dependencyon unrestricted LinkedIn scraping|Freeze|
|No internet-scale crawlingat MVP|Freeze|
|Single deployable application with modular domains|Freeze|



SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

### **39. Open Questions for Prototype Testing** 

- Which first 10-20 Sudan-relevant sources provide the best combination of authority, volume and reliable access? 

- How much job-description variation exists across the first source set, and how often does JSON-LD/structured data cover enough fields? 

- What minimum quality threshold produces a feed users perceive as trustworthy? 

- Which taxonomy mappings are weak for Sudan-specific employer language and local role naming? 

- How should SINNARA represent ambiguous locations such as "Sudan", "Port Sudan", hybrid arrangements and regional travel roles? 

- Which matching weights produce the best precision@10 on a human-reviewed benchmark? 

- When should semantic embeddings be added compared with a strong lexical baseline? 

- What source refresh cadence is necessary to keep expired jobs below an acceptable threshold? 

- What behavioral signals best predict genuine application intent without creating popularity bias? 

### **40. Claude Code Implementation Handoff** 

Claude should implement the Job Intelligence system in slices and never create a source-specific shortcut that bypasses the canonical pipeline. Every adapter must terminate in source_observation -> normalization -> validation -> deduplication -> verification -> publication. 

```
Before coding any ingestion adapter, Claude should:
```

`1. Inspect source documentation and current access constraints.` 

`2. Decide the least expensive reliable access method.` 

`3. Define source-specific fields and map them to canonical fields.` 

`4. Define failure and retry behavior.` 

`5. Define evidence/provenance capture.` 

`6. Add fixtures from representative source responses.` 

`7. Write tests for duplicates, deadlines, URLs and source changes.` 

`8. Measure runtime and expected AI calls.` 

`9. Update architecture/decision records if a new pattern is introduced.` 

`10. Keep the adapter replaceable.` 

The implementation should start with one real source and a fixture-based ingestion test before adding many sources. This creates a reference implementation that subsequent adapters must follow. 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

**SINNARA  |  Job Intelligence Architecture & Source/Ingestion System** 

### **Sources** 

**[R1]** Spoladore, D.; Criscuolo, S.; Isgrò, F. (2026). Representing jobs and job seekers in AI-based recommender systems: A literature review. Engineering Applications of Artificial Intelligence, 174, 114450. https://doi.org/10.1016/j.engappai.2026.114450 

**[R2]** Çelik Ertuğrul, D.; Bitirim, S. (2025). Job recommender systems: a systematic literature review, applications, open issues, and challenges. Journal of Big Data, 12, 140. https://link.springer.com/article/10.1186/s40537-025-01173-y 

**[R3]** de Ruijt, C.; Bhulai, S. (2021). Job Recommender Systems: A Review. arXiv:2111.13576. https://arxiv.org/abs/2111.13576 

**[R4]** International Labour Organization. (2025). AI in human resource management: The limits of empiricism. Working Paper 154. https://www.ilo.org/publications/ai-human-resource-management-limits-empiricism 

**[R5]** OECD. (2023). Artificial intelligence and labour market matching. OECD Social, Employment and Migration Working Papers No. 284. https://doi.org/10.1787/2b440821-en 

**[R6]** ReliefWeb API Documentation. Current API documentation and Jobs schema. https://apidoc.reliefweb.int/ 

**[R7]** Greenhouse Developer Documentation. Job Board API. https://docs.greenhouse.io/job-board.html 

**[R8]** Lever Developer Documentation. API Reference / Postings. https://hire.lever.co/developer/documentation 

**[R9]** Google Search Central. JobPosting structured data documentation. https://developers.google.com/search/docs/appearance/structured-data/job-posting 

**[R10]** European Commission, ESCO. Use ESCO Services / API and classification. https://esco.ec.europa.eu/en/use-esco 

**[R11]** U.S. Department of Labor, National Center for O*NET Development. O*NET Web Services. https://services.onetcenter.org/ 

**[R12]** Google AI for Developers. Gemini API structured outputs. https://ai.google.dev/gemini-api/docs/structured-output 

**[R13]** Microsoft Learn. LinkedIn Posts API documentation, current versioned API guidance. 

https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-04 

**[R14]** n8n Documentation. Self-hosted Community edition and deployment. https://docs.n8n.io/choose-n8n/ 

**[R15]** Tomita, Y.; Yokoyama, T. (2026). Balancing Fairness and High Match Rates in Reciprocal Recommender Systems: A Nash Social Welfare Approach. arXiv:2601.13609. https://arxiv.org/abs/2601.13609 

Document status: Foundational architecture for SINNARA MVP. This document should be treated as a living engineering specification. Any material source-access, taxonomy, ranking-policy or infrastructure change should be recorded as an architecture decision and tested against the evaluation framework. 

SINNARA • Internal Product & Engineering Blueprint • v1.0 

