SINNARA  |  Data Model & Database Schema v1.0 

# **SINNARA** 

## **Data Model & Database Schema** 

#### **MVP v1.0** 

_The database is the source of truth. AI is a processing layer, not the database._ 

###### **Purpose** 

Define the canonical entities, relationships, storage strategy, constraints, indexes, Row Level Security model and migration approach that will support the SINNARA MVP while keeping the system globally extensible. 

|**Document**|**Status**|**Date**|
|---|---|---|
|SINNARA Data Model & Database Schema|v1.0 foundation|14 Sep2026|
|Database approach|Supabase PostgreSQL|MVP stage|
|Designposture|Normalized core + selective JSONB|MVP stage|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

### **1. Executive Data Model** 

SINNARA should use a relational core with explicit foreign keys, controlled taxonomies and strong row-level security. Flexible payloads belong in JSONB only where the shape is inherently variable, such as raw source payloads, AI evidence, event properties and vendor metadata. Supabase recommends JSONB for variable-schema data while cautioning against replacing relational structure with JSON everywhere. [Supabase JSON guidance] 

auth.users | +--> candidate_profiles | +--> education +--> experience +--> candidate_skills --> skills +--> certifications +--> languages +--> projects +--> career_interests +--> candidate_preferences +--> documents --> document_processing_runs --> document_artifacts |                                            | |                                            +--> profile_claims | +--> saved_opportunities --> opportunities --> organizations |                              |       | +--> matches <-----------------+       +--> opportunity_skills --> skills |                                      +--> opportunity_requirements |                                      +--> opportunity_versions | +--> applications --> generated_documents +--> notification_preferences --> notification_deliveries +--> analytics_events 

system/admin | +--> opportunity_sources --> opportunity_source_links +--> ai_runs --> ai_model_registry +--> processing_jobs +--> admin_insights +--> audit_logs 

###### **Source of truth rule** 

Canonical profile facts, canonical opportunity facts, user preferences and workflow state live in relational tables. AI outputs, parser outputs and raw provider payloads are evidence or derived data. A model response never silently becomes a canonical fact. 

### **2. Database Design Principles** 

|**Principle**|**Decision**|
|---|---|
|Identity|Use Supabase Auth user UUID as the primary identity key in application<br>tables.|
|Keys|Use UUID primary keys for business entities; use natural unique<br>constraints for stable external keys.<br>i|
|Time|Use timestamptz for instants and date + timezone fields when a posting<br>has a local deadline.|
|Money|Store amount as numeric plus currency_code, never hardcode SDG in<br>column names.|
|Location|Use hierarchical locations with countryandparent relationships.|
|Taxonomies|Use lookup tables with stable slugs instead of rigid database enums for<br>most business concepts.<br>i|
|JSONB|Use for variable payloads, evidence, configuration and analytics<br>properties.|
|Versioning|Keepsource revisions and AI runs rather than overwritinghistory.|
|Soft deletion|Use status/archived_at where history matters; avoid destructive<br>deletes of business records.|
|RLS|Enable RLS for exposed application tables and test allow/deny<br>behavior. Supabase explicitlyrecommends RLS for everyexposed|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

|**Principle**|**Decision**|
|---|---|
||table.<br>i|
|Storage|Keep private candidate files in private buckets with path-based<br>ownership policies and signed URLs.|
|AI vendor independence|Store provider/model/task metadata in ai_runs so model providers can<br>be changed later.|



### **3. Core Entity Domains** 

|**Domain**|**Core tables**|**MVP role**|
|---|---|---|
|Identity & access|candidate_profiles, user_roles,<br>candidate_preferences|Who the user is and what access they have|
|i|education, experience, skills,<br>i||
|Candidate profile|candidate_skills, certifications, languages,<br>projects,career_interests|Structured career representation|
|Documents & evidence|documents, document_processing_runs,<br>document_artifacts, profile_claims|Document upload, parsing, AI extraction and<br>provenance|
||organizations, opportunity_sources,||
|Opportunity intelligence|opportunities, opportunity_source_links,<br>opportunity_versions,<br>opportunity_requirements,opportunity_skills|Normalized job/opportunity supply|
|Matching|matches,saved_opportunities|Personalized relevance and user actions|
|Applications|applications, generated_documents,<br>application_events<br>i|Internal history and future tailoring workflow|
|Notifications|notification_preferences,<br>notification_deliveries|WhatsApp and future channels|
|Analytics|analytics_events, analytics_daily_metrics,<br>admin_insights|Behavior and product intelligence|
|AI & operations|ai_model_registry, ai_runs, processing_jobs,<br>audit_logs|Reliable, observable background work|
|Global configuration|countries, locations, sectors, job_types, skills,<br>education_levels|Reusable taxonomy and localization<br>foundation|



### **4. Identity, Roles and Candidate Profile** 

##### **4.1 candidate_profiles** 

|**Column**|**Type**|**Rules /purpose**|
|---|---|---|
|id<br>i|uuid PK|Equals auth.users.id|
|first_name|text|Required after onboardingextraction/review|
|last_name|text|Nullable where unavailable|
|headline|text|Shortprofessionalpositioning|
|professional_summary|text|User-approved summary; AI may propose<br>edits|
|phone|text|Private PII;never inpublic opportunityfeeds|
|country_code|char(2)|Currentprimarycountry;ISO-style code|
|current_location_id<br>i|uuid FK|References locations|
|profile_status|text|draft, processing,active,incomplete,archived|
|profile_completeness|numeric|Derived value, recalculated by deterministic<br>service|
|created_at / updated_at|timestamptz|Automatic timestamps|



Do not duplicate authentication email unless product requirements require a cached display value. Supabase Auth remains authoritative for credentials and account identity. Profile tables should contain professional information, not authentication secrets. 

##### **4.2 user_roles** 

|**Column**|**Type**|**Purpose**|
|---|---|---|
|user_id|uuid FK|References auth.users|
|role|text|candidate, admin, content_admin, analyst,<br>support|
|granted_at|timestamptz|Auditability|
|granted_by|uuid|Admin actor where applicable|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

###### **RLS rule** 

Normal users never receive direct admin privileges through client-controlled fields. Role checks must be enforced server-side and in RLS <u>policies. Supabase documentation recommends combining grants and RLS rather than relying on policies alone.</u> 

##### **4.3 candidate_preferences** 

|**Fieldgroup**|**Examples**|
|---|---|
|Work mode|remote,hybrid,onsite,any|
|Location|current location, preferred locations,willingto relocate|
|Employment type|full_time, part_time,temporary,seasonal,contract,internship|
|Availability|available_now,noticeperiod,start date|
|Sectors|target sectors<br>i|
|Roles|target role families and specific role titles|
|Compensation<br>i|optional minimum expectation + currency|
|Notification|channel opt-in,cadence,minimum match threshold, quiet hours|



### **5. Candidate Evidence Model** 

The candidate profile should distinguish what SINNARA knows, where it came from and how confident the extraction was. This prevents AI hallucination from becoming a permanent profile fact. 

##### **5.1 documents** 

|**Column**|**Type**|**Purpose**|
|---|---|---|
|id|uuid PK|Document identity|
|candidate_id|uuid FK|Owner<br>i|
|document_type<br>i|text|cv, certificate, recommendation, portfolio,<br>other<br>i|
|original_filename|text|User-visible filename|
|storage_bucket|text|Private Storage bucket<br>i|
|storage_path|text|Objectpath,uniqueper file|
|mime_type|text|Validated upload type|
|size_bytes|bigint|Upload validation and limits|
|sha256|text|Duplicate detection and integrity|
|status|text|uploaded, queued, processing, ready, failed,<br>deleted|
|is_primary|boolean|OptionalprimaryCV marker|
|created_at|timestamptz|Upload time|



##### **5.2 document_processing_runs** 

|**Column**|**Type**|**Purpose**|
|---|---|---|
|id|uuid PK|Processingattempt|
|document_id|uuid FK|Input document<br>l|
|pipeline_version|text|Parser/extraction workflow version|
|parser_name|text|Docling,Unstructured or futureparser|
|parser_version|text|Reproducibility|
|ai_run_id|uuid FK nullable|Links AI interpretation|
|status|text|queued,running,succeeded,failed,retrying|
|started_at / completed_at|timestamptz|Performance|
|error_code / error_message|text|Operational diagnosis|



##### **5.3 document_artifacts** 

|**Artifact**|**Purpose**|
|---|---|
|raw_text|Extractedplain text|
|structured_markdown|Human-readable structuralparse|
|structured_json|Parser output such as sections, pages and blocks|
|redacted_text|Optionalprivacy-safe text for analytics or debugging|
|preview|Optional low-resolution preview metadata, not used for identity<br>verification|



Artifacts should be stored in private Storage and referenced from the database. Do not place large extracted text blobs directly into analytics or ordinary relational tables unless there is a specific query need. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

##### **5.4 profile_claims** 

profile_claims is the provenance layer. It is not the candidate profile itself. A claim can point to a CV page, a certificate, a manual entry or an AI extraction run, and can be accepted, edited or rejected. 

|**Column**|**Type**|**Purpose**|
|---|---|---|
|id|uuid PK|Claim identity|
|candidate_id|uuid FK|Owner<br>i|
|entity_type|text|education, experience, skill, certification,<br>language, project, profile|
|entity_id<br>i|uuid nullable|Canonical entityonce created<br>i i|
|field_name|text|Specific field,e.g.job_title|
|value_json|jsonb|Extracted candidate value|
|source_type|text|document,user_input,system_import|
|source_document_id|uuid nullable|Document evidence|
|source_excerpt|text nullable|Short supportingexcerpt|
|source_page|integer nullable|Page number whenparserprovides it|
|confidence|numeric nullable|Extraction confidence,not hiring probability|
|ai_run_id|uuid nullable|Processing provenance|
|review_status|text|pending,accepted,edited,rejected|



###### **Why provenance matters** 

A user should be able to correct an AI-extracted date or skill without destroying the evidence that led SINNARA to propose it. This also <u>gives the admin team a defensible debugging trail.</u> 

### **6. Candidate Career Tables** 

##### **6.1 education** 

|**Column**|**Type**|**Rules**|
|---|---|---|
|id|uuid PK||
|candidate_id|uuid FK||
|institution_name|text||
|field_of_study|text||
|education_level_id|uuid FK|References education_levels|
|start_date / end_date|date|Nullable|
|grade_text|text|Keeporiginal representation|
|country_code|char(2)|Optional|
|location_id|uuid nullable|Optional|
|description|text|Optional|
|source_claim_id|uuid nullable|Provenance|



##### **6.2 experience** 

|**Column**|**Type**|**Rules**|
|---|---|---|
|id|uuid PK||
|candidate_id|uuid FK||
|organization_name|text|Keepsource wording|
|role_title|text|Canonical display|
|start_date / end_date|date||
|is_current|boolean|If true,end_date is null|
|location_id|uuid nullable||
|sector_id|uuid nullable||
|description|text|Responsibilities|
|achievements|text|Outcome-focused evidence|
|employment_type|text|Full-time,contract,internship,etc.|
|source_claim_id|uuid nullable||



##### **6.3 skills and candidate_skills** 

**<mark>Field</mark>** 

|**Field**|**Purpose**|
|---|---|
|skills.id / slug/ name|Canonical skill vocabulary|
|candidate_skills.candidate_id|Owner|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

|SINNARA|Data Model & Database Schema v1.0|
|---|



|**Field**|**Purpose**|
|---|---|
|candidate_skills.skill_id<br>i|Normalized skill<br>i|
|proficiency_level|beginner,intermediate,advanced,expert or configured scale|
|years_experience|Optional numeric evidence|
|last_used_at|Optional recencysignal|
|evidence_text|Short supportingevidence|
|source_claim_id|Traceability|



Keep the skills catalog separate from user-entered free text. Store the original phrase in evidence when needed, but normalize it to a canonical skill for matching and analytics. This enables later synonym mapping without rewriting candidate records. 

##### **6.4 certifications, languages, projects, volunteering** 

|**Table**|**Important fields**|
|---|---|
|certifications|name, issuer, issue_date, expiry_date, credential_id, credential_url,<br>source_claim_id<br>i i|
|languages|language_code, proficiency_reading, proficiency_writing,<br>proficiency_speaking,source_claim_id|
|projects|name, description, role, start_date, end_date, URL, skills referenced,<br>source_claim_id|
|volunteering|organization,role,dates,description,sector,source_claim_id|



### **7. Global Location and Taxonomy Model** 

Global expansion should be achieved by adding data, not rewriting table structures. Sudan is the first market configuration, not a special database case. 

##### **7.1 countries and locations** 

|**Table**|**Core fields**|
|---|---|
|countries|id,iso2,iso3,name,region_code,currency_code,active|
|locations|id, country_id, parent_id, location_type, name, normalized_name, slug,<br>latitude,longitude,active|



locations 

country -> region/state 

-> city 

-> locality (optional) 

Example: 

Sudan -> Kassala State -> Kassala 

##### **7.2 controlled taxonomies** 

|**Taxonomy**|**Examples**|
|---|---|
|education_levels|secondary,diploma,bachelor,master,doctorate<br>i|
|sectors|humanitarian, development, finance, technology, health, education,<br>etc.|
|job_types|full_time, part_time, contract, temporary, seasonal, internship,<br>consultancy,volunteer|
|seniority_levels|entry, junior,mid,senior,lead,manager,director|
|work_modes|remote,hybrid,onsite|
|skills|Excel,Power BI, project management,monitoringand evaluation,etc.|



Use slugs as stable machine identifiers and names/descriptions as editable presentation content. This avoids breaking code when terminology changes. 

### **8. Opportunity Intelligence Schema** 

##### **8.1 organizations** 

**<mark>Column Purpose</mark>** id Canonical organization identity 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

|**Column**|**Purpose**|
|---|---|
|name|Displayname|
|normalized_name|Deduplication/search|
|organization_type|UN,NGO, private_company, government,recruitment_agency,etc.|
|country_id|Primarycountry<br>f|
|website_url|Official site|
|logo_url<br>i|Optionalpublic asset<br>ii|
|verification_status|unverified,verified,trusted|
|created_at / updated_at|Lifecycle|



##### **8.2 opportunity_sources** 

|**Column**|**Purpose**|
|---|---|
|id|Source identity|
|name|Human-readable source<br>f|
|source_type|official_site, public_board,rss,api,social_page,admin_curated|
|base_url|Source homepage|
|country_id|Primarymarket|
|organization_id|Optional owner|
|ingestion_mode|manual,fetch_html,rss,api,import<br>i|
|parser_key|Adapter identifier|
|check_frequency_minutes|Scheduler hint|
|trust_level|high,medium,low<br>l|
|active|Operational flag|



##### **8.3 opportunities** 

|**Column**|**Type /purpose**|
|---|---|
|id|uuid PK|
|organization_id|uuid FK|
|title|text|
|normalized_title|text|
|description|text or artifact reference|
|opportunity_type_id|uuid FK|
|seniority_level_id|uuid nullable|
|country_id|uuid|
|location_id|uuid nullable|
|work_mode|text|
|employment_type|text|
|salary_min / salary_max|numeric nullable|
|salary_currency_code|char(3)nullable|
|deadline_at|timestamptz nullable|
|deadline_local_date|date nullable|
|deadline_timezone|text nullable|
|status<br>f|draft,review, published,expired,archived,rejected|
|official_apply_url|text|
|canonical_url<br>i|text nullable|
|first_seen_at|timestamptz|
|last_seen_at<br>i|timestamptz|
|last_verified_at|timestamptz nullable|
|content_hash|text|
|quality_score<br>i|numeric nullable|
|extraction_confidence|numeric nullable|



##### **8.4 opportunity_source_links** 

One canonical opportunity may appear in multiple sources. Keep the source relationships separate so duplicate detection and provenance remain explicit. 

|**Field**|**Purpose**|
|---|---|
|opportunity_id + source_id|Composite unique key|
|source_url|Exact source URL<br>i|
|source_external_id|External identifier when available|
|discovered_at|When SINNARA found it|
|last_checked_at|Last successful source check|
|source_content_hash|Detect changes|
|source_status|active,inaccessible,removed,unknown|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

##### **8.5 opportunity_versions** 

|**Field**|**Purpose**|
|---|---|
|opportunity_id|Parent opportunity|
|source_link_id|Origin|
|captured_at|Snapshot time|
|raw_content_path|Private Storage object for raw source if retained|
|structured_payload|jsonbparsedpayload|
|content_hash|Change detection|
|ai_run_id|Extractionprovenance|
|is_current|Current version marker|



##### **8.6 opportunity_requirements and opportunity_skills** 

|**Table**|**Fields**|
|---|---|
|opportunity_requirements|requirement_type, requirement_group, text, normalized_value_json,<br>is_hard_requirement,weight|
|opportunity_skills|opportunity_id, skill_id, requirement_type(required/preferred),<br>proficiency_hint,importance_weight,source_text|



###### **Hard requirements versus preferences** 

A vacancy may say "minimum 3 years" and "experience with Power BI preferred". These should not be treated as equivalent. The schema therefore stores requirement hardness separately from ranking weight. 

### **9. Matching and Recommendation Schema** 

The matching table stores the result of a particular algorithm version. This permits ranking logic to improve without rewriting historical data and makes it possible to measure whether a new scoring version improves relevance. 

##### **9.1 matches** 

|**Column**|**Purpose**|
|---|---|
|id|Match identity|
|candidate_id|User|
|opportunity_id|Job|
|algorithm_version|Rankingversion|
|eligibility_status|eligible,ineligible,unclear|
|match_score|0-100 internal rankingscore|
|score_components|jsonb: education, experience, skills, location, preferences, career<br>alignment|
|explanation|Short user-facingreasoning|
|gaps|jsonb arrayof missing/weak requirements|
|generated_at|Timestamp|
|expires_at|Recompute threshold|
|ai_run_id|Optional explanation/modelprovenance|



##### **9.2 saved_opportunities** 

|**Field**|**Purpose**|
|---|---|
|candidate_id + opportunity_id|Unique bookmark|
|saved_at|User action|
|notes|Optionalpersonal note|
|status|saved, preparing,archived|



### **9.3 ranking strategy** 

Eligibility layer 

- -> hard education requirements 

- -> hard experience requirements 

- -> work authorization / location constraints when explicit 

- -> deadline validity 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

Ranking layer 

- -> skills alignment 

- -> experience relevance 

- -> sector alignment 

- -> location / work-mode preference 

- -> career-direction alignment 

- -> recency and opportunity quality 

Explanation layer 

- -> deterministic facts first 

- -> AI wording second 

- -> never invent qualifications 

###### **Do not market the score as hiring probability** 

"92/100 suitability" is a ranking signal, not a prediction that the user will get the job. The UI should use language such as Strong match, Good match and Potential match with reasons and visible gaps. 

### **10. Applications and Generated Documents** 

The application history is the retention mechanism for future document-generation features. Every tailored artifact is a new file linked to a specific opportunity and application record. The original CV remains unchanged. 

##### **10.1 applications** 

|**Field**|**Purpose**|
|---|---|
|id|Application tracker ID|
|candidate_id|Owner|
|opportunity_id|Target vacancy|
|status<br>i|saved, preparing, ready, clicked_external, applied_self_reported,<br>withdrawn,archived|
|first_started_at|Start|
|last_activity_at|Last interaction<br>f|
|external_application_url|Official destination|
|user_notes|Optional|
|created_at / updated_at|Lifecycle|



##### **10.2 generated_documents** 

|**Field**|**Purpose**|
|---|---|
|id|Generated artifact identity|
|application_id|Context|
|document_type|tailored_cv,cover_letter,answers,interview_notes|
|template_version|Document design version|
|ai_run_id|Generationprovenance<br>i|
|source_document_ids|jsonb references to source files<br>i|
|storage_bucket / storage_path|Private output file|
|format|pdf,docx|
|status|generating,ready,failed,archived|
|created_at|Generated timestamp|



##### **10.3 application_events** 

|**Event**|**Examples**|
|---|---|
|created|User started trackingan opportunity|
|document_generated|Tailored CVgenerated<br>f|
|external_link_clicked|User opened official application|
|applied_self_reported|User marked it applied<br>l|
|status_changed|User changed workflow state<br>i|
|document_downloaded|Generated file downloaded|



###### **Versioning rule** 

Generated CVs and letters are immutable artifacts. A revised version creates a new generated_documents row and a new Storage object. This preserves a complete application history. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

### **11. Notifications Data Model** 

|**Table**|**Key fields**|
|---|---|
|notification_preferences|candidate_id, channel, enabled, cadence, min_match_score,<br>categories, quiet_hours,timezone,last_digest_at<br>i|
|notification_deliveries|candidate_id, channel, notification_type, scheduled_for, sent_at,<br>status, provider_message_id,opportunity_ids,error_code|



The notification service should receive a generic notification payload, then hand off to a channel adapter. WhatsApp is a channel, not a database design assumption. 

match event 

- -> notification eligibility check 

- -> group eligible opportunities by user/cadence 

- -> create delivery record 

- -> channel adapter sends message 

- -> record provider response 

- -> retry or mark failed 

### **12. Analytics and Behavioral Intelligence** 

Product behavior should be measurable without storing unnecessary personal or document content in analytics events. The raw event stream supports funnel analysis, product improvement and admin insights. 

##### **12.1 analytics_events** 

|**Field**|**Purpose**|
|---|---|
|id|Event identity|
|user_id|Nullable for anonymous events|
|session_id|Sessiongrouping|
|event_name|Stable event name|
|event_version|Schema version|
|occurred_at|Timestamp|
|route|Productpage or context|
|properties|jsonb,strictlynon-sensitive<br>i|
|source|web,system,notification|
|experiment_key/ variant|Futureproduct experiments|



##### **12.2 admin intelligence** 

|**Table**|**Purpose**|
|---|---|
|analytics_daily_metrics|Pre-aggregated metrics for low-cost dashboards|
|admin_insights|AI-assisted summaries of behavior patterns, bottlenecks and<br>anomalies|
|audit_logs|Securityand administrative actions|



**Analytics boundary** Never send CV text, certificate contents, phone numbers or other private profile details into generic analytics properties. Behavioral analytics should answer product questions without duplicating the private data store. 

### **13. AI Runtime Data Model** 

The AI layer needs its own metadata so SINNARA can measure cost, latency, quality and failures. This is essential for free-tier operation and future provider switching. 

##### **13.1 ai_model_registry** 

|**Field**|**Purpose**|
|---|---|
|id|Model identity|
|provider|gemini or futureprovider<br>i|
|model_name|Specific model<br>i|
|task_types|Profile extraction, jobparsing,explanation, generation|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

|**Field**|**Purpose**|
|---|---|
|input_cost_class / output_cost_class|Internal cost metadata|
|capabilities|jsonb<br>l|
|active<br>ff|Feature flag|
|effective_from / effective_to|Version lifecycle|



##### **13.2 ai_runs** 

|**Field**|**Purpose**|
|---|---|
|id|Run identity<br>i|
|task_type|profile_extract, job_extract, match_explain, career_insight,<br>document_generate|
|provider / model|Runtime choice<br>i|
|prompt_version|Versioned instruction identifier|
|input_refs|jsonb references,not rawprivatepayload when avoidable|
|input_hash|Deterministic cache key|
|status|queued,running,succeeded,failed|
|started_at / completed_at|Latency|
|input_units / output_units|Usage whenprovider reports it|
|estimated_cost|Optional internal estimate|
|output_json|Validated structured output|
|validation_status|passed,corrected,rejected|
|error_code|Failure diagnosis|



##### **13.3 processing_jobs** 

|**Field**|**Purpose**|
|---|---|
|id|Job identity|
|job_type|document_process, opportunity_ingest, match_refresh,<br>notification_send,insight_refresh|
|payload|jsonb reference IDs|
|status|queued,running,retrying,succeeded,failed|
|priority|int|
|attempts|Retrycounter|
|available_at|Scheduling|
|locked_at / locked_by|Concurrencycontrol|
|last_error|Failure diagnosis|
|idempotency_key|Duplicateprevention|



### **14. Storage Architecture** 

|**Bucket**|**Access**|**Contents**<br>i|
|---|---|---|
|candidate-private|Authenticated owner only|CVs,certificates and source documents|
|generated-private|Authenticated owner only|Tailored CVs,letters and application files|
|source-artifacts|Admin/server only|Optional raw job snapshots and parser<br>artifacts|
|public-assets|Public read|Logos,staticproduct assets if needed|



Supabase Storage supports ownership-based policies and signed URLs for time-limited access. Private files should not be made public merely to simplify downloads. Signed URLs should be generated on the server after authorization. [Supabase Storage security guidance] 

candidate-private/{user_id}/{document_id}/original.ext generated-private/{user_id}/{application_id}/{generated_document_id}.pdf source-artifacts/{source_id}/{opportunity_id}/{version_id}.json 

### **15. Row Level Security Model** 

RLS is the final database-level guardrail for user data. Supabase currently recommends enabling RLS for every exposed table, combining policies with grants, and testing allow and deny behavior. Service-role or secret credentials must remain server-side. 

|**Data area**<br>i|**Candidate**|**Admin**|**Public**|
|---|---|---|---|
|candidate_profiles|Own rows|Server/admin only|No|
|education / experience / skills|Own rows|Server/admin only|No|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

|||SINNARA||Data Model & Database Schema v1.0|
|---|---|---|---|
|**Data area**|**Candidate**|**Admin**|**Public**|
|documents / artifacts|Own rows|Server/admin only|No|
|opportunities|Published rows|Full management|Published only|
|matches|Own rows|Server/admin only|No|
|saved_opportunities|Own rows|Server/admin only|No|
|applications /<br>generated_documents|Own rows|Server/admin only|No|
|notification_preferences /<br>deliveries|Own rows|Support/admin only|No|
|analytics_events|Insert own events;limited read|Aggregate/server|No|
|organizations / sources|Readpublished subset|Management|Published subset|
|audit_logs|No|Read server/admin only|No|



### **15.1 RLS implementation pattern** 

alter table public.candidate_profiles enable row level security; 

create policy "candidate can read own profile" on public.candidate_profiles for select to authenticated using ((select auth.uid()) = id); create policy "candidate can update own profile" on public.candidate_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id); 

###### **Testing requirement** 

RLS policies should have explicit positive and negative tests for anon, authenticated owner, authenticated non-owner and admin/service <u>paths. Do not treat "the UI hides it" as a security control.</u> 

### **16. Indexing and Constraints** 

|**Table / field**|**Index or constraint**|
|---|---|
|candidate_skills|unique(candidate_id,skill_id)|
|experience|index(candidate_id,start_date desc)|
|education|index(candidate_id,end_date desc)|
|documents|unique(candidate_id,sha256)where status != deleted|
|opportunities|index(status,deadline_local_date)|
|opportunities|index(country_id,location_id,status)|
|opportunities|unique(canonical_url)where canonical_url is not null|
|opportunity_source_links|unique(source_id, source_external_id) where source_external_id is not<br>null|
|opportunity_source_links|index(opportunity_id,source_id)|
|opportunity_versions|index(opportunity_id,captured_at desc)|
|matches|unique(candidate_id,opportunity_id,algorithm_version)|
|saved_opportunities|unique(candidate_id,opportunity_id)|
|applications|unique(candidate_id,opportunity_id)|
|analytics_events|index(user_id, occurred_at desc) and index(event_name, occurred_at<br>desc)|
|processing_jobs|unique(idempotency_key)where idempotency_keyis not null|
|ai_runs|index(task_type,created_at desc)|



Index only after identifying real query patterns. Over-indexing consumes storage and slows writes. The initial indexes above are deliberately centered on user feeds, deadlines, ownership, duplicate detection and operational queues. 

### **17. Canonical SQL Skeleton** 

The following is the implementation starting point for the core tables. Claude Code should convert this skeleton into versioned Supabase migrations, then add RLS, indexes, triggers and tests. Names may be refined during implementation if the underlying invariants are preserved. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

create extension if not exists pgcrypto; 

create table public.candidate_profiles ( id uuid primary key references auth.users(id) on delete cascade, first_name text, last_name text, headline text, professional_summary text, phone text, country_code char(2), current_location_id uuid, profile_status text not null default 'draft', profile_completeness numeric(5,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now() ); create table public.documents ( id uuid primary key default gen_random_uuid(), candidate_id uuid not null references public.candidate_profiles(id) on delete cascade, document_type text not null, original_filename text not null, storage_bucket text not null, storage_path text not null, mime_type text not null, size_bytes bigint not null, sha256 text not null, status text not null default 'uploaded', is_primary boolean not null default false, created_at timestamptz not null default now() ); create table public.skills ( id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, skill_group text, active boolean not null default true, created_at timestamptz not null default now() ); create table public.candidate_skills ( id uuid primary key default gen_random_uuid(), candidate_id uuid not null references public.candidate_profiles(id) on delete cascade, skill_id uuid not null references public.skills(id), proficiency_level text, years_experience numeric(5,2), last_used_at date, evidence_text text, source_claim_id uuid, created_at timestamptz not null default now(), unique(candidate_id, skill_id) ); create table public.organizations ( id uuid primary key default gen_random_uuid(), name text not null, normalized_name text not null, organization_type text, country_id uuid, website_url text, verification_status text not null default 'unverified', created_at timestamptz not null default now(), updated_at timestamptz not null default now() ); create table public.opportunities ( id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), title text not null, normalized_title text not null, description text, opportunity_type_id uuid, seniority_level_id uuid, country_id uuid not null, location_id uuid, work_mode text, employment_type text, salary_min numeric, 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

salary_max numeric, salary_currency_code char(3), deadline_at timestamptz, deadline_local_date date, deadline_timezone text, status text not null default 'draft', official_apply_url text not null, canonical_url text, first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(), last_verified_at timestamptz, content_hash text, extraction_confidence numeric(5,2), created_at timestamptz not null default now(), updated_at timestamptz not null default now() ); create table public.opportunity_skills ( id uuid primary key default gen_random_uuid(), opportunity_id uuid not null references public.opportunities(id) on delete cascade, skill_id uuid not null references public.skills(id), requirement_type text not null default 'required', proficiency_hint text, importance_weight numeric(5,2), source_text text, unique(opportunity_id, skill_id, requirement_type) ); create table public.matches ( id uuid primary key default gen_random_uuid(), candidate_id uuid not null references public.candidate_profiles(id) on delete cascade, opportunity_id uuid not null references public.opportunities(id) on delete cascade, algorithm_version text not null, eligibility_status text not null, match_score numeric(5,2), score_components jsonb not null default '{}'::jsonb, explanation text, gaps jsonb not null default '[]'::jsonb, ai_run_id uuid, generated_at timestamptz not null default now(), expires_at timestamptz, unique(candidate_id, opportunity_id, algorithm_version) ); create table public.saved_opportunities ( candidate_id uuid not null references public.candidate_profiles(id) on delete cascade, opportunity_id uuid not null references public.opportunities(id) on delete cascade, saved_at timestamptz not null default now(), notes text, status text not null default 'saved', primary key(candidate_id, opportunity_id) ); create table public.applications ( id uuid primary key default gen_random_uuid(), candidate_id uuid not null references public.candidate_profiles(id) on delete cascade, opportunity_id uuid not null references public.opportunities(id) on delete cascade, status text not null default 'saved', external_application_url text, user_notes text, first_started_at timestamptz, last_activity_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(candidate_id, opportunity_id) ); create table public.analytics_events ( id bigint generated always as identity primary key, user_id uuid, session_id text, event_name text not null, event_version integer not null default 1, occurred_at timestamptz not null default now(), route text, properties jsonb not null default '{}'::jsonb, source text not null default 'web' ); 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

create table public.processing_jobs ( id uuid primary key default gen_random_uuid(), job_type text not null, payload jsonb not null default '{}'::jsonb, status text not null default 'queued', priority integer not null default 100, attempts integer not null default 0, available_at timestamptz not null default now(), locked_at timestamptz, locked_by text, last_error text, idempotency_key text unique, created_at timestamptz not null default now(), updated_at timestamptz not null default now() ); 

### **18. Migration Strategy** 

|**Phase**|**Database action**|**Rule**|
|---|---|---|
|M0|Create extensions, core identity tables and<br>taxonomies|No production data dependency|
|M1|Add candidate profile/document tables + RLS|Test ownership policies before UI depends on<br>them<br>i|
|M2|Add opportunity/source tables|Seed a small verified source set|
|M3|Add matches/saved/application tables|Release recommendation feed|
|M4|Add analytics, AI runtime and processing<br>queue tables|Instrument before broad testing|
|M5|Optimize indexes and constraints from<br>observedqueries|Measure first, then tune|
||Add organization accounts, members,||
|Future employer|subscriptions, employer roles and ATS<br>workflow|Separate from public organization records|



Every migration should be committed to Git, applied consistently across environments and never edited after it has been used in a shared environment. Corrections should be new migrations. 

### **19. Seed Data Strategy** 

The first database seed should make the MVP usable without creating a dependency on a live scraper. Seed carefully curated public taxonomy records and a small set of verified opportunity sources. 

|**Seedgroup**|**Initial content**|
|---|---|
|Countries|Sudan + a small standard reference set|
|Locations|KeySudan states/cities used byearlyusers and sources<br>i|
|Education|Commonqualification levels|
|Sectors|Initial Sudan-relevant sectors|
|Job types|Include temporaryand seasonal work from dayone|
|Skills|High-frequencyskills from the initial opportunitysample<br>i|
|Organizations|Onlyverifiedpublic organizations used byseed opportunities<br>f|
|Sources|Official websites andpermittedpublic sources with source metadata|



### **20. Data Quality Rules** 

|**Rule**<br>f|**Implementation**|
|---|---|
|Every published opportunityhas an official application URL|Database constraint + admin review<br>i|
|Expired opportunities are not recommended|Queryfilter + scheduled expiry job|
|Duplicate sources do not create duplicate opportunities<br>i|Canonical URL + content hash + source link dedupe|
|AI cannot invent candidatequalifications|Extraction stored as claims,canonical write requires validation<br>i|
|User edits override AI extraction|User-authored fields haveprecedence|
|Model changes do not silentlyrewrite history|Store algorithm/prompt/model versions<br>i|
|Every generated document has context<br>i|Link to application,source files andgeneration run|
|Private files are neverpublic bydefault|Private bucket + RLS + signed URL|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

### **21. Query Patterns the Schema Must Support** 

|**Use case**|**Primary query path**|
|---|---|
|Candidate home feed|candidate_id -> matches ->published opportunities -> organizations|
|Deadline filter|opportunities.status + deadline_local_date|
|Skillgap|candidate_skills minus required opportunity_skills|
|Savedjobs|saved_opportunities -> opportunities|
|Application history|applications ->generated_documents + application_events|
|Adminjobqueue|opportunities where status=review OR low extraction confidence|
|Source health|opportunity_sources -> opportunity_source_links -> last_checked_at|
|Behavior funnel|analytics_eventsgrouped byevent_name and user/session|



### **22. Future Employer Data Model** 

Do not implement employer accounts in the MVP, but reserve a clean separation between a public organization record and a private organization account. The same organization that appears on public job listings can later become a verified employer account. 

organizations | +--> organization_accounts       (future) | +--> organization_members 

- +--> organization_subscriptions 

- +--> employer_opportunities 

- +--> candidate_searches 

- +--> candidate_contacts 

- +--> recruitment_workflows 

- +--> hiring_outcomes 

###### **Future learning loop** 

Only after employers manage applications inside SINNARA should hiring outcomes become a reliable first-party training signal. Until then, candidate-reported application outcomes are useful product analytics but should not be treated as verified hiring data. 

### **23. Security and Privacy Checklist** 

|**Area**|**Requirement**|
|---|---|
|Auth|Use Supabase Auth;never storepasswords inpublic tables|
|RLS|Enabled on everyexposedprivate table|
|Storage|Private buckets for candidate andgenerated documents|
|Signed URLs|Short-lived andgenerated onlyafter server authorization|
|Secrets|AI keys,service-role keys and messagingcredentials server-side only|
|PII|Minimize collection and avoid duplication across tables<br>i|
|Logs|Never logfull CVs,certificates,tokens orprivate documents|
|AI prompts|Prefer references or minimized extracts over full private context where<br>possible|
|Admin access|Role-based,auditable and server-enforced<br>l|
|Deletion|Support account deletion and document deletion workflows while<br>retainingonlynecessarysystem audit records|



### **24. Scalability Strategy** 

The MVP should remain a modular monolith until there is a measured reason to split it. The schema is already designed so domains can later move behind service boundaries without changing their conceptual ownership. 

|**Scale trigger**|**Likely response**|
|---|---|
|Large opportunityingestion volume|Separate ingestion workers /queue|
|AI usage becomes expensive|Caching,localparsing,smaller models, provider routing|
|Match feed becomes slow|Precomputed matches, pgvector candidate retrieval, background<br>refresh|
|Analytics table becomes large|Partitions and warehouse/exportpipeline|



SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

|**Scale trigger**|**Likely response**|
|---|---|
|File storagegrows materially|Lifecyclepolicies and external object storage<br>i|
|Multiple countries|Expand taxonomies/configuration,not core table architecture|
|Employer demand emerges<br>f|Add organization accounts and a recruitment domain|
|HeavyAPI traffic|Read replicas,cachingand selective service extraction|



### **25. Current Supabase Design Notes** 

This schema intentionally follows current Supabase guidance: RLS is the primary authorization mechanism for exposed database data; Storage supports ownership-based access patterns and signed URLs; pgvector is available as a Postgres extension if SINNARA later needs embedding search; and JSONB is appropriate for variable-shape payloads when used selectively. 

|**Current capability**|**SINNARA decision**|
|---|---|
|RLS|Required for user-private tables and tested in database migrations<br>i|
|Storage ownership|Use owner-scopedpolicies forprivate files<br>i|
|Signed URLs|Use for downloads ofprivate files|
|pgvector|Keepoptional for later semantic retrieval or rankingacceleration|
|JSONB|Use for AI outputs,sourcepayloads and analyticsproperties|



Sources: Supabase Row Level Security documentation; Supabase Storage security and signed URL documentation; Supabase pgvector documentation; Supabase JSON/JSONB guidance. These should be rechecked when implementation begins because vendor behavior and limits can change. 

### **26. Decisions to Freeze Before Claude Code Implementation** 

|**Decision**|**Recommended freeze**|
|---|---|
|Database|Supabase PostgreSQL<br>i|
|Primaryidentitykey|auth.users.id UUID reused in candidate_profiles|
|Schema style|Relational core + selective JSONB|
|Business IDs|UUID|
|Time|timestamptz + local deadline date/timezone where needed|
|Files|Private Supabase Storage buckets|
|AIprovenance|ai_runs +prompt/model version metadata|
|Opportunity provenance<br>i|source links + immutable source versions<br>i|
|Profileprovenance|profile_claims + document artifacts|
|Behavior analytics|analytics_events + derived admin metrics|
|Employer domain|Deferred;organization base entityremains reusable|
|Vector search|Optional,not a dependencyfor MVP|



### **27. Implementation Hand-off to Claude Code** 

Claude Code should not start by generating the whole database in one pass. It should implement and test migrations in small slices, with each slice producing a working database state. 

Recommended sequence 

1. Create Supabase project and local migration workflow. 

2. Create extensions and shared timestamp/update utilities. 

3. Create global taxonomies and locations. 

4. Create candidate profile + document tables. 

5. Add RLS and database tests for ownership. 

6. Add opportunity/source tables. 

7. Add opportunity deduplication constraints and indexes. 

8. Add matching/saved/application tables. 

9. Add AI runtime + processing jobs. 

10. Add analytics + admin intelligence tables. 

11. Seed controlled taxonomy and test opportunities. 

12. Run schema QA, RLS tests and representative queries. 

13. Only then connect the Next.js UI to production-like data. 

###### **Claude working rule** 

Claude should be allowed to improve naming, normalization or indexing when it can demonstrate a concrete benefit, but any change that alters a core business invariant must be recorded as an architecture decision before implementation continues. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

SINNARA  |  Data Model & Database Schema v1.0 

### **28. References** 

- Supabase Docs. Row Level Security. https://supabase.com/docs/guides/database/postgres/row-level-security 

- Supabase Docs. Managing JSON and unstructured data. https://supabase.com/docs/guides/database/json 

- Supabase Docs. pgvector: Embeddings and vector similarity. https://supabase.com/docs/guides/database/extensions/pgvector 

- Supabase Docs. Storage ownership/security and signed URLs. https://supabase.com/docs/guides/storage/security/ownership 

- SINNARA Technical Architecture v1.0. Internal project document, 14 September 2026. 

- SINNARA MVP Product Blueprint v1.0. Internal project document, 14 September 2026. 

### **29. Immediate Next Step** 

###### **Next artifact** 

SINNARA AI Architecture and Prompt/Data Contracts. This should define exactly how document parsers, Gemini, structured outputs, validation, caching, retries and model/provider switching interact with the schema defined here. 

After that, the project will have the product blueprint, technical architecture and data foundation required to construct the Claude Code project memory and begin implementation in controlled phases. 

SINNARA  |  Internal Product Architecture  |  14 September 2026 

