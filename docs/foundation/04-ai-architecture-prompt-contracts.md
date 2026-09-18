**SINNARA**

**AI Architecture & Prompt / Data Contracts**

Version 1.0 \| September 2026

*Foundation document for the SINNARA MVP*

Sudan-focused career intelligence and opportunity discovery, built on a
globally extensible AI foundation.

# Document Status and Purpose

This document defines how AI participates in SINNARA, how AI outputs
become trusted structured data, how prompts and schemas are versioned,
how costs are controlled, and how the product can switch providers
without rewriting the application. It is intended to sit between the
Technical Architecture and the eventual Claude Code implementation plan.

  -----------------------------------------------------------------------
  **Item**                            **Decision**
  ----------------------------------- -----------------------------------
  Primary product AI for MVP          Gemini API, with the exact model
                                      selected through configuration and
                                      current quota verification.

  Initial high-capability model       Gemini 3.8 Flash, currently GA and
  candidate                           supporting structured output, PDF
                                      input, 1M-token context, tunable
                                      thinking and tool features. \[R1\]
                                      \[R2\]

  Embedding candidate                 Gemini Embedding 2, stable as of
                                      September 2026, with 128-3072
                                      dimensions and multimodal PDF
                                      support. \[R3\]

  AI output format                    Structured JSON validated by
                                      application-side schemas. Gemini
                                      supports structured JSON output
                                      with a subset of JSON Schema.
                                      \[R4\]

  Source of truth                     Supabase/Postgres canonical
                                      records, not model responses.

  Document parsing                    Prefer local/open-source parsing
                                      first, then AI interpretation. Test
                                      Docling or equivalent before
                                      committing.

  MVP matching                        Hybrid: deterministic hard
                                      filters + structured scoring +
                                      optional semantic similarity + LLM
                                      explanation.

  Provider abstraction                All model calls go through a single
                                      internal AI Gateway.

  Privacy posture                     Minimize PII sent to free-tier AI
                                      services; use synthetic/anonymized
                                      data during development. Reassess
                                      paid-tier privacy controls before
                                      production-scale sensitive document
                                      processing.
  -----------------------------------------------------------------------

# 1. Executive AI Architecture

User / Admin\
\|\
v\
Application Layer (Next.js + server-side services)\
\|\
+\--\> AI Gateway
\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| \| \|\
\| +\--\> Model Registry \|\
\| +\--\> Prompt Registry \|\
\| +\--\> Schema Registry \|\
\| +\--\> Cost / token policy \|\
\| +\--\> Retry / fallback \|\
\| +\--\> Safety / validation \|\
\| \|\
+\--\> Document Pipeline \|\
\| +\--\> Parser / OCR \|\
\| +\--\> Canonical text \|\
\| +\--\> Evidence anchors \|\
\| +\--\> AI extraction \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| \|\
+\--\> Matching Engine \|\
\| +\--\> Hard eligibility \|\
\| +\--\> Deterministic scoring \|\
\| +\--\> Semantic similarity \|\
\| +\--\> AI explanation \|\
\| \|\
+\--\> Generation Engine \|\
\| +\--\> CV tailoring \|\
\| +\--\> Cover letters \|\
\| +\--\> Application answers \|\
\| +\--\> Career plans \|\
\|\
v\
Supabase / Postgres / Storage / pgvector\
\|\
+\--\> Canonical data\
+\--\> AI runs and evidence\
+\--\> Embeddings\
+\--\> User/application history\
+\--\> Analytics

> Core rule: AI is a reasoning and transformation layer. It does not
> become the database, permission system, deadline authority,
> application state machine, or truth source.

# 2. AI Design Principles

-   Canonical data first. Store normalized candidate and opportunity
    records separately from raw AI responses.

-   One-way evidence flow. Documents and source postings produce claims;
    claims are validated and promoted into canonical records.

-   Never trust generated prose as evidence. Any factual claim that
    affects eligibility or a generated application artifact must be
    traceable to candidate or opportunity data.

-   Deterministic before probabilistic. Filter hard requirements,
    status, dates and preferences in code before spending AI tokens.

-   Use the smallest model that reliably performs the task. Escalate
    only when evaluation shows a measurable quality gain.

-   Prefer structured output over free-form extraction. Validate every
    AI response before persistence.

-   Idempotent AI jobs. Re-running a job should not create duplicate
    profile facts, opportunities, notifications or documents.

-   Version everything that matters: model, prompt, schema, parser
    version and task version.

-   Fail safely. When confidence is low or validation fails, route to
    review or retry rather than inventing data.

-   Human correction is first-class data. User edits should become
    canonical facts and should not be silently overwritten by later
    extraction.

# 3. AI Workload Map

  --------------------------------------------------------------------------------------
  **Task**          **AI role**        **Deterministic     **Priority**   **MVP**
                                       role**                             
  ----------------- ------------------ ------------------- -------------- --------------
  CV / certificate  Interpret document File validation,    Critical       Yes
  extraction        content into       size/type checks,                  
                    structured         persistence,                       
                    candidates and     dedupe, permissions                
                    claims                                                

  Job extraction    Interpret messy    Source tracking,    Critical       Yes
                    source content     URL validation,                    
                    into structured    deadlines/status,                  
                    opportunity and    dedupe                             
                    requirements                                          

  Skill             Map phrases to     Taxonomy storage    High           Yes
  normalization     canonical skills   and final skill IDs                
                    and aliases                                           

  Candidate-job     Semantic           Eligibility         Critical       Yes
  match             comparison and     filters, weighted                  
                    reasoning for      score, ranking                     
                    nuanced fit        rules                              

  Match explanation Explain            Evidence lookup and Critical       Yes
                    already-computed   rendering                          
                    factors                                               

  Career            Reason over        Market statistics   High           Light MVP
  intelligence      profile and local  and factual inputs                 
                    opportunity                                           
                    patterns                                              

  Learning          Rank suitable      Catalog filters and Later          No
  recommendations   resources and      resource metadata                  
                    explain relevance                                     

  CV tailoring      Rewrite and        Template, file      Later          No
                    reorder verified   generation, claim                  
                    candidate content  validation                         
                    for a target role                                     

  Cover letter      Generate           Facts and job       Later          No
                    role-specific      requirements                       
                    application copy                                      
                    from verified                                         
                    facts                                                 

  Marketing content Select high-value  Scheduling, links,  Later          No
                    opportunities and  publishing state                   
                    draft channel                                         
                    content                                               

  Admin             Summarize product  Metrics queries and Later          Light MVP
  intelligence      analytics and      event aggregation                  
                    patterns                                              
  --------------------------------------------------------------------------------------

# 4. The AI Gateway

All model access should be behind one internal interface. Product
features should never call Gemini SDK functions directly from UI
components or scattered server routes.

AI Gateway responsibilities\
- resolve task -\> model policy\
- load prompt version\
- load output schema version\
- construct minimal context\
- redact/minimize sensitive fields when possible\
- call provider\
- capture usage metadata\
- parse structured output\
- validate schema\
- run domain validation\
- retry / fallback when allowed\
- persist ai_run metadata\
- return typed result or typed failure

## 4.1 Provider-neutral interface

type AITask =\
\| \"profile_extract\"\
\| \"opportunity_extract\"\
\| \"skill_normalize\"\
\| \"match_explain\"\
\| \"career_analyze\"\
\| \"learning_rank\"\
\| \"cv_tailor\"\
\| \"cover_letter\"\
\| \"application_answer\"\
\| \"marketing_draft\";\
\
type AIRequest\<TInput\> = {\
task: AITask;\
input: TInput;\
promptVersion: string;\
schemaVersion: string;\
policyVersion: string;\
priority: \"interactive\" \| \"background\" \| \"batch\";\
};\
\
type AIResult\<TOutput\> = {\
output: TOutput;\
model: string;\
provider: string;\
usage?: Usage;\
latencyMs: number;\
aiRunId: string;\
validation: ValidationResult;\
};

The purpose is not abstraction for its own sake. It lets SINNARA change
a model, add a paid fallback, compare providers, or reduce cost without
touching product logic.

# 5. Current Gemini Strategy

As of September 2026, Gemini 3.8 Flash is documented as GA, with
1M-token context, 64k maximum output, structured output, PDF input,
function calling, URL context, search grounding and tunable thinking.
Google currently lists a free tier for Gemini 3.8 Flash and paid pricing
of \$0.75/1M input tokens and \$3.75/1M output tokens through December
31, 2026, followed by higher standard rates. Exact request/token quotas
remain model- and project-specific and should be checked in AI Studio
before deployment. \[R1\] \[R2\] \[R5\]

Gemini structured outputs return schema-constrained JSON but support
only a subset of JSON Schema. SINNARA should therefore keep schemas
practical and perform application-side validation after every response.
\[R4\]

Gemini provides implicit caching on current models and explicit caching
through the appropriate API path. Caching is useful for repeated long
system/context prefixes, but SINNARA should still minimize input rather
than rely on caching for cost control. \[R6\]

Gemini Embedding 2 is documented as a stable embedding model and
supports text, image, video, audio and PDF inputs, with flexible output
dimensionality. SINNARA can initially keep embeddings optional and add
them when the opportunity/candidate corpus is large enough to justify
semantic retrieval. \[R3\]

> Privacy caveat: Google states that the Free tier may use content to
> improve products, while paid services provide different data-use
> terms. Because SINNARA will eventually process CVs and certificates
> containing personal data, development should use synthetic or
> anonymized records where possible, and the production privacy posture
> should be re-evaluated before processing real user PII at scale.
> \[R7\]

## 5.1 Model policy

  -----------------------------------------------------------------------
  **Task**          **Default         **Thinking**      **Escalation**
                    policy**                            
  ----------------- ----------------- ----------------- -----------------
  Profile           Fast structured   Low / minimum     Retry same model
  extraction        model             sufficient        with cleaner
                                                        context, then
                                                        fallback model

  Opportunity       Fast structured   Low               Escalate only if
  extraction        model                               validation fails
                                                        or source is
                                                        unusually
                                                        ambiguous

  Skill             Fast structured   Low               AI only for
  normalization     model or                            unresolved terms
                    deterministic                       
                    alias map first                     

  Match explanation Fast model after  Low / medium when Higher reasoning
                    deterministic     needed            only for edge
                    ranking                             cases

  Career analysis   Higher reasoning  Medium            Fallback to
                    model when                          rules + templated
                    genuinely needed                    guidance

  Generation        Fast model with   Low / medium      Higher quality
                    strict candidate                    model only if
                    evidence context                    evaluation
                                                        supports it
  -----------------------------------------------------------------------

# 6. Document Intelligence Pipeline

Upload\
-\> file validation\
-\> malware / type checks\
-\> storage\
-\> checksum / duplicate detection\
-\> parser\
-\> canonical document text + page/section anchors\
-\> extraction task\
-\> structured JSON\
-\> schema validation\
-\> evidence validation\
-\> profile claim staging\
-\> canonical profile update\
-\> human review if required

The parser and the AI model have different responsibilities. A parser
should recover text and structure; the model should interpret that
content into SINNARA concepts. A candidate should never need to upload a
document multiple times because extraction was imperfect.

## 6.1 Parser strategy

-   Test Docling first for PDF/DOCX to Markdown/JSON conversion and
    table/structure preservation.

-   Use OCR only when the document lacks a reliable text layer. OCR
    should be isolated because it adds latency and error surface.

-   Persist a parser artifact with parser name/version and checksum.

-   Preserve page numbers and section headings so AI claims can
    reference evidence locations.

-   Normalize whitespace, repeated headers, footers and obvious encoding
    noise before AI processing.

-   Never permanently discard the original file solely because the
    parsed text looks good.

## 6.2 Profile extraction contract

{\
\"schema_version\": \"candidate-profile-extraction.v1\",\
\"summary\": \"\...\",\
\"identity\": {\
\"full_name\": {\"value\": \"\...\", \"confidence\": 0.97, \"evidence\":
\[\"p1\"\]}\
},\
\"education\": \[\
{\
\"degree\": \"Bachelor of Business Administration\",\
\"field\": \"Finance\",\
\"institution\": \"\...\",\
\"start_date\": null,\
\"end_date\": \"2026-07\",\
\"evidence\": \[\"p1\"\]\
}\
\],\
\"experience\": \[\],\
\"skills\": \[\],\
\"certifications\": \[\],\
\"languages\": \[\],\
\"projects\": \[\],\
\"volunteering\": \[\],\
\"locations\": \[\],\
\"career_interests\": \[\],\
\"missing_fields\": \[\],\
\"warnings\": \[\]\
}

Important contract rule: confidence is not permission to write a fact
directly. The application validates evidence, data shape and user
ownership before promoting claims into canonical tables.

# 7. Opportunity Intelligence Pipeline

Source adapter\
-\> fetch / import\
-\> raw capture\
-\> content fingerprint\
-\> parser\
-\> opportunity extraction\
-\> source / organization validation\
-\> deadline normalization\
-\> requirement extraction\
-\> deduplication\
-\> verification status\
-\> canonical opportunity\
-\> embedding (optional)\
-\> candidate ranking eligibility

For each opportunity, preserve the original source URL and enough
raw/source metadata to explain where SINNARA got the information. The AI
should never be allowed to invent a deadline, application URL,
organization or location.

## 7.1 Opportunity extraction contract

{\
\"schema_version\": \"opportunity-extraction.v1\",\
\"title\": \"Programme Assistant\",\
\"organization_name\": \"Example Organization\",\
\"locations\": \[\],\
\"opportunity_type\": \"job\",\
\"employment_type\": \"fixed_term\",\
\"seniority\": \"entry\",\
\"education_requirements\": \[\],\
\"experience_requirements\": \[\],\
\"required_skills\": \[\],\
\"preferred_skills\": \[\],\
\"languages\": \[\],\
\"salary\": null,\
\"deadline\": {\"value\": \"2026-09-30\", \"timezone\": null,
\"evidence\": \[\"source\"\]},\
\"application_url\": \"https://official.example/apply\",\
\"application_method\": \"official_site\",\
\"source_confidence\": 0.99,\
\"ambiguities\": \[\]\
}

# 8. Hybrid Matching Architecture

The matching engine must not ask an LLM to invent a single opaque
suitability percentage. The recommended architecture is a multi-stage
ranker.

Stage 1: Hard eligibility\
- deadline active\
- geography / remote compatibility\
- required education when explicit\
- mandatory experience when explicit\
- mandatory language / work authorization constraints when explicit\
\
Stage 2: Deterministic feature score\
- relevant experience\
- required skills\
- preferred skills\
- education fit\
- sector fit\
- location preference\
- employment preference\
- availability\
- career interest alignment\
\
Stage 3: Semantic similarity (optional / later MVP)\
- candidate career summary \<-\> job summary\
- skills / responsibilities similarity\
\
Stage 4: AI explanation\
- explain strengths\
- explain gaps\
- identify uncertainty\
- never change the calculated score directly

## 8.1 Internal scoring contract

{\
\"match_schema_version\": \"match.v1\",\
\"eligibility\": {\
\"status\": \"eligible \| ineligible \| review\",\
\"hard_failures\": \[\]\
},\
\"components\": {\
\"experience\": 0.0,\
\"skills\": 0.0,\
\"education\": 0.0,\
\"sector\": 0.0,\
\"location\": 0.0,\
\"preferences\": 0.0,\
\"career_alignment\": 0.0\
},\
\"internal_score\": 0.0,\
\"score_version\": \"ranking-policy.v1\",\
\"evidence_refs\": \[\],\
\"explanation_request\": true\
}

The score weights live in versioned application configuration, not
inside a prompt. This allows controlled A/B testing and recalibration
without changing AI behavior.

## 8.2 Match explanation contract

{\
\"schema_version\": \"match-explanation.v1\",\
\"headline\": \"Strong match\",\
\"strengths\": \[\
\"Your degree matches the required education level.\",\
\"Your reporting and Excel experience aligns with core
responsibilities.\"\
\],\
\"gaps\": \[\
\"The vacancy prefers KoboToolbox experience, which is not present in
your profile.\"\
\],\
\"location_note\": \"Your selected location preference includes
Kassala.\",\
\"confidence\": 0.91,\
\"evidence_refs\": \[\"candidate.experience.3\",
\"job.requirement.4\"\]\
}

> User-facing language should say \"Strong match\" or a similarly
> calibrated label. Do not imply that a suitability score is a
> probability of being hired.

# 9. Prompt Architecture

Prompts should be modular and versioned. Avoid one giant master prompt.
Each task should have a short task prompt plus typed context and a
schema. Permanent product rules belong in code/documentation;
task-specific reasoning belongs in the prompt.

  ---------------------------------------------------------------------------
  **Layer**               **Purpose**             **Example**
  ----------------------- ----------------------- ---------------------------
  System / policy         Stable behavior and     Do not invent candidate
                          safety boundaries       qualifications.

  Task prompt             What this run must      Extract education and
                          accomplish              experience from this
                                                  document.

  Context contract        Typed structured inputs candidate evidence, job
                                                  requirements

  Output schema           Machine-readable result opportunity-extraction.v1

  Validation rules        Application-side truth  deadline must originate
                          checks                  from source text

  Post-processing         Normalize and persist   map skill aliases to
                                                  canonical skill IDs
  ---------------------------------------------------------------------------

## 9.1 Prompt rules for SINNARA

-   Use plain, professional English and no generic AI self-reference in
    user-facing output.

-   Never fabricate missing qualifications, employers, dates,
    achievements, salaries, deadlines or application outcomes.

-   Use explicit nulls for unknown fields. Do not guess.

-   When evidence conflicts, surface the conflict instead of silently
    choosing one value.

-   For writing tasks, prefer specific facts, measurable achievements
    and natural recruiter language over buzzwords.

-   Preserve candidate truth. Tailoring may reorder and rephrase
    verified content but may not create experience.

-   Keep prompts deterministic enough to evaluate: define task, inputs,
    output, constraints and failure behavior.

-   Never place secrets, API keys or internal access tokens into prompt
    content.

## 9.2 Example extraction prompt

TASK: Extract a candidate\'s professional profile from the supplied
document.\
\
SOURCE OF TRUTH:\
Use only the supplied document text and anchors. Do not infer facts that
are not supported.\
\
EXTRACT:\
- education\
- employment and relevant experience\
- skills and tools\
- certifications\
- languages and stated proficiency\
- projects / volunteering when present\
- locations stated in the document\
\
RULES:\
1. Use null when a field is unknown.\
2. Preserve dates as written when uncertain; do not fabricate dates.\
3. Separate explicit facts from inferred categorization.\
4. Attach evidence anchors to each material claim.\
5. Return JSON that conforms exactly to the supplied schema.\
6. Add warnings for ambiguity, conflicting dates, or unreadable
sections.

# 10. Prompt / Data Contract Versioning

Every AI task should be versioned independently. A model can change
without changing the contract, and a contract can evolve without
pretending historical outputs were created by the new version.

prompt_key: profile_extract\
prompt_version: 1.2.0\
schema_key: candidate-profile-extraction\
schema_version: 1.0.0\
policy_version: ai-policy-1\
model: gemini-3.8-flash\
temperature / thinking policy: task-configured\
parser_version: docling-x.y.z

  -----------------------------------------------------------------------
  **Change**                          **Action**
  ----------------------------------- -----------------------------------
  Wording-only prompt refinement      Patch/minor version; evaluate
                                      against regression set

  New optional output field           Minor schema version; backward
                                      compatible parser

  Renamed or removed field            Major schema version; migration
                                      required

  Changed scoring interpretation      New ranking policy version;
                                      preserve old match records

  Model replacement                   Record new model version; run
                                      regression evaluation before
                                      default switch

  Parser replacement                  Record parser version; do not
                                      overwrite prior artifacts without
                                      provenance
  -----------------------------------------------------------------------

# 11. Validation Pipeline

Model response\
-\> JSON parse\
-\> schema validation (Zod)\
-\> domain validation\
-\> evidence validation\
-\> safety / policy checks\
-\> normalization\
-\> canonical persistence\
-\> audit metadata

  -----------------------------------------------------------------------
  **Validation layer**    **Examples**            **Failure action**
  ----------------------- ----------------------- -----------------------
  Syntax                  Valid JSON              Retry once with same
                                                  input

  Schema                  Required fields/types   Retry with validation
                                                  error context

  Domain                  Dates valid, enum       Reject and retry or
                          known, score range 0-1  manual review

  Evidence                Claim has               Do not promote claim
                          page/section/source     
                          reference               

  Truth constraints       No generated facts      Reject offending claim
                          absent from source      

  Business rules          Opportunity deadline    Flag for review
                          not before publication  
                          unless explicitly       
                          explained               
  -----------------------------------------------------------------------

# 12. Cost and Latency Architecture

Cost control should be structural, not dependent on hoping the free tier
remains generous.

-   Cache parsed document artifacts and normalized opportunity text.
    Never re-parse unchanged files.

-   Hash inputs and skip identical AI runs when the task, input hash,
    schema and prompt version are unchanged.

-   Run AI asynchronously for background ingestion; reserve synchronous
    model calls for user-facing actions.

-   Use deterministic filters before semantic or generative calls to
    reduce candidate-job pair volume.

-   Use embeddings only when retrieval scale justifies them. A 100-job
    MVP can start without a vector search layer.

-   Use lower-cost/fast models for extraction and classification;
    reserve higher reasoning for difficult cases.

-   Exploit Gemini caching where applicable, but do not build a
    correctness dependency on cache hits. \[R6\]

-   Batch offline work when supported and latency is unimportant. Google
    documents Batch API separately with higher throughput and lower cost
    characteristics on paid usage. \[R5\]

-   Persist token usage and latency per ai_run so every feature can be
    costed before scale.

## 12.1 Cost budget guardrails

  -----------------------------------------------------------------------
  **Guardrail**                       **MVP policy**
  ----------------------------------- -----------------------------------
  Per interactive request             One primary call, one retry maximum

  Per background job                  Maximum configured call budget;
                                      dead-letter after repeated failure

  Duplicate input                     Zero AI calls when input hash and
                                      contract match a completed
                                      successful run

  Long document                       Parse and segment first; do not
                                      send irrelevant pages

  High-volume matching                Filter first, then score top
                                      candidate set

  Unknown spike                       Circuit breaker pauses non-critical
                                      AI jobs and alerts admin
  -----------------------------------------------------------------------

# 13. Embeddings and Retrieval

Embeddings are an optimization and retrieval layer, not a substitute for
hard eligibility logic. Gemini Embedding 2 currently supports 128-3072
dimensions and semantic search use cases; Supabase supports pgvector
directly in Postgres. \[R3\] \[R8\]

MVP progression\
Phase A: No embeddings. Deterministic score + AI explanation.\
Phase B: Embed normalized candidate summary and job summary.\
Phase C: Hybrid retrieval: hard filters + vector top-K + deterministic
scoring.\
Phase D: Optional multimodal / document embeddings if evaluation proves
value.

A first embedding implementation should use a smaller dimension such as
768 unless evaluations show a clear benefit from a larger vector. This
saves database storage and similarity compute while keeping the option
to re-embed later. Note that changing embedding models or dimensions
requires a planned re-indexing strategy. \[R3\]

# 14. Career Intelligence Architecture

Career intelligence should be generated from a mixture of canonical
profile data, opportunity market signals and controlled recommendations.
The model should not invent labor-market statistics from general world
knowledge.

Profile facts\
+ user\'s target roles / sectors\
+ recent opportunity frequency\
+ recurring required skills\
+ current gaps\
+ approved learning resources\
\|\
v\
Career analysis input\
\|\
v\
AI reasoning\
\|\
v\
Structured recommendations\
\|\
+\--\> career pathways\
+\--\> skill gaps\
+\--\> next actions\
+\--\> matched opportunities\
+\--\> relevant learning resources

  -----------------------------------------------------------------------
  **Insight**                         **Source required**
  ----------------------------------- -----------------------------------
  Skill gap                           Repeated requirements in relevant
                                      opportunities + candidate evidence

  Career path suggestion              Candidate preferences + profile +
                                      opportunity patterns

  Learning recommendation             Curated resource catalog + explicit
                                      skill gap

  Market statement                    Aggregated SINNARA opportunity data
                                      with date window

  Career confidence                   Evidence coverage and data
                                      freshness
  -----------------------------------------------------------------------

# 15. Generation Architecture for Future CV Tailoring

CV tailoring is intentionally outside the smallest MVP, but the AI
architecture should reserve the correct boundary now.

Original candidate profile (canonical)\
+\
Target opportunity (canonical)\
+\
Verified evidence set\
+\
CV layout template\
\|\
v\
Tailoring model\
\|\
+\--\> selected experiences\
+\--\> rewritten bullets\
+\--\> reordered sections\
+\--\> role-aligned summary\
+\--\> keyword coverage report\
\|\
v\
ATS-aware document generator\
\|\
v\
Generated document version linked to application

-   Never let the model create a job title, employer, degree,
    certification or achievement that does not exist in canonical
    evidence.

-   Preserve the original CV as immutable source material; every
    tailored version belongs to an application record.

-   Use a deterministic document template and style system. The model
    supplies content; it does not control final pagination or file
    integrity.

-   Run a post-generation factual checker against the candidate evidence
    and job requirements.

-   Generate a change summary so the user can see what was emphasized or
    rewritten.

# 16. Safety, Privacy and Prompt Injection Defense

SINNARA will process untrusted external content: uploaded CVs, job
pages, social posts and possibly employer descriptions. Those sources
must be treated as data, not instructions.

-   Quote or delimit source text clearly in prompts.

-   Explicitly instruct the model that instructions found inside
    documents or webpages are not system instructions.

-   Never let external text change tool permissions, database queries or
    application state directly.

-   Use allowlisted tool operations in any future agentic workflow.

-   Sanitize HTML and scripts before AI interpretation where practical.

-   Keep raw source content separate from prompt control text.

-   Log suspicious prompt-injection patterns for admin review.

-   Never expose another user\'s documents because of an AI-generated
    identifier or query.

# 17. Reliability, Retry and Failure States

  -----------------------------------------------------------------------
  **Failure**                         **Response**
  ----------------------------------- -----------------------------------
  Provider timeout                    Retry with bounded exponential
                                      backoff

  429 / rate limit                    Respect retry-after when available;
                                      reschedule background work

  Malformed JSON                      Schema error feedback and one retry

  Low-confidence extraction           Store staged result, request user
                                      review

  Parser failure                      Fallback parser or manual upload
                                      review

  Provider unavailable                Use configured fallback for
                                      eligible tasks or defer

  Partial processing                  Persist step state; resume from
                                      last successful stage

  Repeated failure                    Dead-letter processing job and
                                      surface admin alert
  -----------------------------------------------------------------------

# 18. Observability for AI

  -----------------------------------------------------------------------
  **Metric**                          **Why**
  ----------------------------------- -----------------------------------
  AI runs by task/model/version       Cost and quality attribution

  Input/output token usage            Budget management

  Latency p50/p95                     UX and capacity planning

  Validation failure rate             Prompt/schema health

  Evidence coverage                   Trustworthiness

  User correction rate                Extraction quality signal

  Match explanation disagreement /    Ranking improvement
  feedback                            

  Retry and fallback rate             Provider reliability

  Model quality by evaluation set     Safe model upgrades
  -----------------------------------------------------------------------

> Do not log raw CV text, phone numbers, email addresses or document
> contents into ordinary application logs. Store references to secure
> records instead.

# 19. Evaluation Framework

SINNARA needs a small permanent evaluation set before the first user
launch. The set should include representative CVs, certificates and job
postings, with expected structured outputs or review criteria.

  -----------------------------------------------------------------------
  **Test set**                        **Measure**
  ----------------------------------- -----------------------------------
  CV extraction                       Field precision, recall, evidence
                                      coverage

  Job extraction                      Requirement recall, deadline
                                      accuracy, application URL accuracy

  Skill normalization                 Canonical mapping accuracy

  Matching                            Top-K relevance judged by human
                                      reviewers

  Explanation                         Factuality and usefulness

  Career advice                       Grounding in supplied
                                      market/profile data

  Document generation later           Factual preservation, recruiter
                                      quality, ATS structure
  -----------------------------------------------------------------------

Every model or prompt change should run against the regression set
before becoming the default configuration. Store evaluation results
outside the user-facing data model, but reference model/prompt versions
exactly.

# 20. Human-in-the-Loop Rules

  -----------------------------------------------------------------------
  **Situation**                       **Human review**
  ----------------------------------- -----------------------------------
  Ambiguous identity or dates         Candidate review

  Low evidence coverage               Candidate review

  Unknown deadline                    Admin review

  Conflicting source information      Admin review

  High-impact generated application   User review before download
  claim                               

  Model changes                       Internal evaluation review

  Potential sensitive data incident   Admin/security escalation
  -----------------------------------------------------------------------

# 21. Claude Code Architecture for AI Work

Claude Code should not be asked to carry the entire AI specification in
every session. Claude Code supports project CLAUDE.md context, Skills,
rules, MCP servers, hooks and auto memory. Skills are loaded on demand,
while CLAUDE.md is intended for stable project instructions. \[R9\]
\[R10\]

SINNARA repo\
\|\
+\-- CLAUDE.md\
\| -\> stable project rules\
\|\
+\-- docs/ai/\
\| +\-- ai-architecture.md\
\| +\-- prompt-contracts.md\
\| +\-- model-policy.md\
\| +\-- evaluation.md\
\|\
+\-- .claude/skills/\
\| +\-- ai-contract-review/\
\| +\-- prompt-review/\
\| +\-- schema-change/\
\| +\-- model-evaluation/\
\| +\-- document-pipeline/\
\| +\-- matching-review/\
\| +\-- security-review/\
\|\
+\-- .claude/rules/\
\| +\-- ai.md\
\| +\-- database.md\
\| +\-- security.md\
\|\
+\-- .mcp.json\
-\> only approved external services needed for development

The principle is selective tooling. Connect Claude to systems where
direct access meaningfully reduces copy/paste and error, such as GitHub
and the development database. Do not connect every available service by
default. Claude Code documentation explicitly supports MCP for external
tools, Skills for reusable workflows, and project configuration for
permissions. \[R10\]

## 21.1 Recommended Claude skills

  -----------------------------------------------------------------------
  **Skill**               **Purpose**             **When used**
  ----------------------- ----------------------- -----------------------
  ai-contract-review      Check                   Before changing AI
                          task/schema/prompt      contract
                          compatibility           

  prompt-review           Evaluate grounding,     Before releasing a
                          ambiguity and           prompt
                          hallucination risk      

  model-evaluation        Run regression set and  Before model switch
                          summarize deltas        

  document-pipeline       Debug parser/extraction Document issues
                          stages                  

  matching-review         Review ranking policy   Matching changes
                          and evidence            

  security-review         Review PII flow and     Security-sensitive
                          tool permissions        changes

  cost-review             Estimate token/runtime  Feature or model
                          impact                  changes
  -----------------------------------------------------------------------

# 22. Data Contracts Summary

  ---------------------------------------------------------------------------------------------
  **Contract**                      **Input**         **Output**        **Persistence**
  --------------------------------- ----------------- ----------------- -----------------------
  candidate-profile-extraction.v1   Parsed document   Candidate claims  profile_claims +
                                    artifact          JSON              canonical tables

  opportunity-extraction.v1         Normalized source Opportunity JSON  opportunities +
                                    text                                requirements

  skill-normalization.v1            Raw skill phrases Canonical skill   skills +
                                                      mappings          candidate/opportunity
                                                                        links

  match.v1                          Candidate + job + Eligibility +     matches
                                    policy            component scores  

  match-explanation.v1              Match evidence    User-facing       match metadata or
                                                      explanation       cached result

  career-analysis.v1                Profile + market  Career paths,     career intelligence
                                    signals           gaps, actions     records

  cv-tailoring.v1                   Verified          Tailored content  generated documents
                                    profile + job +   blocks            
                                    template                            

  notification.v1                   Match/event +     Message payload   notifications
                                    preferences                         
  ---------------------------------------------------------------------------------------------

# 23. API / Service Boundaries

/api/ai/profile-extract\
/api/ai/opportunity-extract\
/api/ai/match-explain\
/api/ai/career-analyze\
/api/documents/process\
/api/opportunities/ingest\
/api/matches/recompute\
/api/notifications/dispatch\
/api/analytics/events

These are conceptual boundaries, not a demand that every item becomes a
public HTTP endpoint. In the MVP, internal server functions can call
shared services directly. The separation exists so background jobs,
tests and future worker infrastructure can reuse the same contracts.

# 24. MVP Implementation Sequence for AI

1.  Build schema registry and typed contract package.

2.  Build AI Gateway with one Gemini provider implementation.

3.  Build document parser adapter and artifact storage.

4.  Implement candidate extraction with evidence anchors and validation.

5.  Implement opportunity extraction and normalization.

6.  Implement deterministic eligibility and matching score.

7.  Add AI match explanations.

8.  Create evaluation fixtures and regression runner.

9.  Add usage/latency logging and cost guardrails.

10. Only after stable evaluation, add embeddings and semantic retrieval.

11. Only after the core MVP is reliable, implement advanced career
    intelligence and document generation.

# 25. Architecture Decisions to Freeze Now

  -----------------------------------------------------------------------
  **Decision**                        **Status**
  ----------------------------------- -----------------------------------
  LLM access only through AI Gateway  Freeze

  Canonical DB is source of truth     Freeze

  Structured JSON for extraction      Freeze
  tasks                               

  Application-side validation after   Freeze
  AI output                           

  Evidence/provenance required for    Freeze
  material facts                      

  Deterministic ranking before AI     Freeze
  explanation                         

  Model IDs stored in configuration / Freeze
  registry                            

  Prompt and schema versioning        Freeze

  AI runs auditable by                Freeze
  task/model/version                  

  Use synthetic/anonymized PII during Freeze
  development                         

  Embeddings optional, not required   Freeze
  for first matching prototype        

  Provider replacement supported by   Freeze
  interface, not immediate            
  multi-provider complexity           
  -----------------------------------------------------------------------

# 26. Open Questions for the Next Technical Stage

-   Which document parser passes the real CV/certificate fixture test
    with the lowest operational complexity?

-   What is the exact current Gemini free-tier quota available to the
    SINNARA project in AI Studio?

-   Which candidate fields need evidence anchors in the first release,
    and how should evidence be rendered to users?

-   Which deterministic scoring weights best match human judgments on a
    representative sample of Sudan-focused vacancies?

-   When does the opportunity corpus become large enough that embeddings
    materially improve top-K matching?

-   Which WhatsApp provider path is viable for opt-in notifications at
    MVP scale without creating a premature recurring cost?

-   Which external services should Claude Code access via MCP, and what
    permissions should be denied by default?

# 27. Current Verified Technology Notes and References

These references were checked in September 2026 and should be
re-verified before implementation when a specific vendor decision
becomes executable.

\[R1\] Gemini 3.8 Flash latest model documentation:
https://ai.google.dev/gemini-api/docs/latest-model

\[R2\] Gemini 3.8 Flash model specification:
https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash

\[R3\] Gemini Embeddings documentation:
https://ai.google.dev/gemini-api/docs/embeddings

\[R4\] Gemini structured output documentation:
https://ai.google.dev/gemini-api/docs/structured-output

\[R5\] Gemini pricing and rate limits:
https://ai.google.dev/gemini-api/docs/pricing and
https://ai.google.dev/gemini-api/docs/rate-limits

\[R6\] Gemini context caching:
https://ai.google.dev/gemini-api/docs/caching

\[R7\] Gemini billing / data-use overview:
https://ai.google.dev/gemini-api/docs/billing

\[R8\] Supabase pgvector:
https://supabase.com/docs/guides/database/extensions/pgvector

\[R9\] Claude Code Skills: https://code.claude.com/docs/en/skills

\[R10\] Claude Code architecture, memory and MCP:
https://code.claude.com/docs/en/features-overview,
https://code.claude.com/docs/en/memory,
https://code.claude.com/docs/en/mcp

\[R11\] Vercel Hobby plan and limits:
https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits

# 28. Immediate Next Step

The next artifact should translate this AI architecture into
implementation-ready repositories, typed Zod schemas, prompt files,
model registry configuration, evaluation fixtures, and the first Phase 1
Claude Code build prompt. We should also run one contained technical
spike using representative but anonymized CVs, certificates and job
postings before committing the production document-processing pipeline.
