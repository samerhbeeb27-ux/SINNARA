**SINNARA / FOUNDATION DOCUMENT 06** 

# **UX & Product Experience Specification** 

_v1.0 | Production-oriented interaction, visual system, responsive behavior and component specification_ 

**Design standard** Premium, minimal, fast and calm. Apple-grade refinement in interaction quality, Linear-like information density, and Stripe-like clarity. The interface should feel considered without looking ornamental. 

|**Field**|**Decision**|
|---|---|
|Product|SINNARA|
|Primary surface|Responsive web application with PWA readiness|
|Initial audience|Sudan-focused job seekers and early-career professionals|
|Product language|English only in MVP|
|Primary modes|Light and dark|
|Implementation|Next.js / React / Tailwind CSS / shadcn UI|
|Interaction priority|Fast path to first useful opportunity|
|Accessibility baseline|WCAG 2.2 AA intent, keyboard and screen-reader compatible|
|Touch target baseline|44 x 44 CSS px minimum for primary controls|
|State philosophy|Every async action has explicit pending, success, recoverable error<br>and retry behavior|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

### **Relationship to Documents 1 through 5** 

This document is the experience layer over the canonical data, AI and ingestion systems already defined for SINNARA. It assumes the database remains authoritative, AI outputs are validated before persistence, opportunity records preserve source provenance, and matching is produced by a deterministic-plus-semantic pipeline rather than an opaque model score. 

|**Foundation dependency**|**UX implication**|
|---|---|
|Data Model & Database Schema|Draft claims, canonical profile facts, opportunities, matches, saved<br>jobs, applications, generated files and event history are separate<br>states.|
|AI Architecture & Prompt/Data Contracts|AI never silently writes user-visible truth. Extraction is reviewable,<br>explanations are evidence-backed, and generation is versioned.|
|Job Intelligence Architecture|Freshness, source authority, deduplication and verification status<br>determine whether an opportunity can appear in the feed.|
|Technical Architecture|MVP remains a modular monolith with shared services and<br>background jobs. UI should not assume synchronous processing.|
|MVP Product Blueprint|Progressive profiling, rapid time-to-value, opportunity discovery, alerts<br>and later application intelligence remain the core retention loop.|



Status: Foundation specification. It is intended to guide UI design, front-end implementation, QA, content design and product decisions before Claude Code implementation. 

## **Executive UX Position** 

SINNARA should feel less like a conventional job board and more like a focused career instrument. The user should never need to understand SINNARA's internal complexity to use it. They should be able to upload their existing material, confirm what SINNARA understood, and reach relevant opportunities with minimal setup. 

**Primary UX promise** The product should make the next useful action obvious, keep processing visible, and preserve user control at every consequential step. 

|**Principle**|**Concrete rule**|
|---|---|
|Value before configuration|Do not ask for fields that can be extracted or inferred from uploaded<br>evidence. Ask only for decisions the user must make.|
|Progressive profiling|Start with CV and documents; collect location, work mode and career<br>preferences when they materially improve recommendations.|
|Truth before polish|Never hide uncertainty to make the interface look complete.|
|Calm density|Show enough information to decide, not every field stored in the<br>database.|
|One primary action|Each screen should have a dominant next action. Secondary actions<br>remain available but visually subordinate.|
|Instant feedback|A click should create visible response within one frame: pressed state,<br>progress transition, optimistic state or explanatory delay.|
|Recoverability|Every failed background task should expose the next safe action: retry,<br>review, replace file or continue later.|
|No dead ends|An empty state should tell the user what to do next.|
|Source transparency|Every opportunity retains an easy path to the official source; match<br>claims can be traced internally to evidence.|



### **Experience hierarchy** 

GLOBAL NAVIGATION Home / Recommended Discover 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

Saved Applications Career Profile 

PRIMARY USER LOOP 

Upload -> Review -> Set preferences -> Recommendations -> Job detail -> Save / Apply 

#### SECONDARY LOOPS 

Notification -> Open opportunity -> Apply externally -> Mark status Profile update -> Recompute matches -> Improved feed 

### **MVP north-star interaction metric** 

Time-to-first-relevant-opportunity: from successful sign-in or document upload to a user seeing at least one opportunity that meets the current hard-eligibility and quality gates. Instrument this as a product KPI, not merely a technical latency metric. 

## **1. Design System & Visual Philosophy** 

### **1.1 Visual language** 

|**Layer**|**Specification**|**Do / Avoid**|
|---|---|---|
|Color|Neutral base with one restrained brand<br>accent. Use semantic colors only when they<br>carry meaning.|Do: calm neutrals, high contrast text, one<br>accent. Avoid gradients everywhere or<br>excessive saturated badges.|
|Surface|Cards are not containers by default. Use<br>surface changes to express hierarchy. Glass<br>effect is reserved for floating controls and<br>overlays.|Do: subtle translucency on nav/overlay. Avoid<br>making every card glassmorphic.|
|Depth|Use 1px borders, small elevation and blur to<br>separate layers.|Do: spatial hierarchy. Avoid heavy shadows or<br>floating everything.|
|Typography|SF Pro-like geometry using system UI<br>fallbacks. Strong contrast between title,<br>metadata and supporting text.|Do: compact headings and readable body<br>text. Avoid giant headlines inside dense task<br>flows.|
|Radius|Default 12 px for cards/inputs, 16 px for larger<br>surfaces, 999 px for compact pills.|Keep a consistent radius scale.|
|Icons|Lucide-style outlined icons, 18 to 20 px<br>default.|Use icons for recognition, not decoration.|
|Borders|1 px hairline, neutral. Increase contrast on<br>focus/error states.|Do: crisp geometry. Avoid 2 to 3 px default<br>borders.|
|Whitespace|Generous outer spacing, tighter within related<br>data groups.|Use whitespace as hierarchy rather than<br>boxes around every section.|



### **1.2 Token baseline** 

|**Token**|**Value / rule**|
|---|---|
|Space|4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 px|
|Container|max-width 1180 to 1240 px; page gutters 20 px mobile, 32 px tablet, 48<br>px desktop|
|Body|16 px, 1.5 line-height|
|Small|13 to 14 px|
|Caption|12 px, minimum for non-critical metadata|
|Heading 1|clamp(30px, 4vw, 54px) only for major landing/section statements|
|App page title|clamp(24px,3vw,34px)|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Token**|**Value / rule**|
|---|---|
|Touch target|minimum 44 x 44 px|
|Focus ring|2 px visible outline with 2 px offset|
|Motion|150 ms press feedback; 220 to 320 ms transitions; 350 to 600 ms only<br>for richer entry/exit transitions|
|Blur|8 to 20 px, used sparingly|



### **1.3 Responsive grid** 

|**Viewport**|**Grid / layout**|**Behavior**|
|---|---|---|
|Small < 640 px|4-column conceptual grid, 16-20 px gutters|Single column; bottom sheet patterns; sticky<br>primary CTA when needed.|
|Medium 640-1023 px|8-column conceptual grid, 24-32 px gutters|Two-column where content density benefits;<br>otherwise single flow.|
|Large >= 1024 px|12-column grid, 32-48 px gutters|Centered content; optional side panel for<br>filters or context.|
|Wide >= 1440 px|12-column with max container|Do not stretch text lines; increase breathing<br>room, not information density.|



#### Suggested CSS pattern 

.container { width: min(100% - 32px, 1180px); margin-inline: auto; } 

.page-title { font-size: clamp(24px, 3vw, 34px); } 

.hero-title { font-size: clamp(34px, 6vw, 56px); } 

.grid { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap: clamp(12px, 2vw, 24px); } 

### **1.4 Dark and light modes** 

|**Rule**|**Light**|**Dark**|
|---|---|---|
|Canvas|Off-white / neutral 98-100|Near-black neutral 5-8|
|Primary text|Near-black 90+|White 92+|
|Secondary text|Neutral 55-65|Neutral 65-75|
|Borders|Neutral 12-18|White 10-16|
|Surface|White|Neutral 10-14|
|Accent|Dark enough for AA text|Light enough for AA text|
|Glass|White 70-82% + blur|Black/neutral 45-65% + blur|



Do not rely on color alone to communicate eligibility, errors or match quality. Pair color with text, icons or shape. 

### **1.5 Motion and haptics** 

|**Motion**|**Behavior**|
|---|---|
|Tap / click|Immediate pressed state within 0-80 ms. No artificial delay.|
|Content replacement|220-280 ms opacity/translate transition. Avoid large movement.|
|Modal / sheet|280-360 ms; use reduced motion fallback.|
|Skeleton|Subtle shimmer, 1.2-1.6 s cycle. Stop once content is available.|
|Success|Small scale/opacity confirmation, 250-350 ms. Do not use celebration<br>animations for routine actions.|
|Error|No shake by default. Highlight field, show reason and corrective<br>action.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Motion**|**Behavior**|
|---|---|
|Haptics|For native wrappers/PWA integrations only when supported and<br>intentional. Use light confirmation for save/success and avoid haptics<br>on frequent feed interactions.|
|Reduced motion|Respect prefers-reduced-motion and disable non-essential<br>movement.|



## **2. End-to-End Candidate Experience** 

### **2.1 Information architecture** 

|**Surface**|**Purpose**|**Primary action**|
|---|---|---|
|Home / Recommended|Personalized feed|Open opportunity|
|Discover|Search and filter broader corpus|Filter / open|
|Saved|Shortlist opportunities|Review / move to application|
|Applications|Track external applications and generated<br>artifacts|Continue application / download|
|Career|Career intelligence and skill gaps|Explore next step|
|Profile|Review canonical professional profile|Edit / improve|
|Notifications|Preferences and delivery settings|Configure alerts|



### **2.2 First-run flow** 

#### LANDING 

- -> Sign up / Continue with supported auth 

- -> Upload CV 

- -> Optional certificates / supporting files 

- -> Processing state 

- -> Profile Claim Review 

- -> Required questions: current location + work preferences 

- -> Career interests (optional but encouraged) 

- -> First recommendation set 

- -> Ask for notification opt-in only after value is demonstrated 

### **2.3 Onboarding principles** 

|**Step**|**Required?**|**UX behavior**|
|---|---|---|
|Account|Yes|Use the least number of fields compatible<br>with auth. Do not ask for full professional<br>profile manually.|
|CV|Yes for first-time personalized feed|Large drop zone, paste/upload alternative,<br>clear accepted types and size.|
|Certificates|Optional|Allow multi-file upload. Explain value without<br>blocking progress.|
|Current location|Yes before location-sensitive<br>recommendations|Use a concise selector/search, not a long<br>form.|
|Preferred locations|Recommended|Multi-select plus “open to relocation” toggle.|
|Work mode|Recommended|Remote / hybrid / onsite / any.|
|Employment types|Recommended|Full-time / part-time / contract / temporary /<br>seasonal / internship / consultancy /<br>volunteer.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Step**|**Required?**|**UX behavior**|
|---|---|---|
|Career interests|Optional|Suggest from extracted profile; editable chips.|
|WhatsApp alerts|After first value|Explicit opt-in, cadence and threshold<br>controls.|



### **2.4 CV Drop Zone** 

|**State**|**Visual**|**Microcopy / action**|
|---|---|---|
|Idle|Dashed container + file icon|“Drop your CV here” / “or choose a file”|
|Hover / drag over|Accent border, soft surface tint|“Release to upload”|
|Uploading|Progress bar + filename|“Uploading CV…”|
|Processing|Skeleton profile preview|“Reading your CV. You can leave this page<br>and return later.”|
|Success|Check + summary|“We found 18 profile details. Review them<br>before they become part of your profile.”|
|Partial success|Success + warning group|“We extracted most of your profile. 3 details<br>need your review.”|
|Unsupported file|Inline error|“This file type is not supported. Upload PDF or<br>DOCX.”|
|Oversize|Inline error|“This file is too large. Try a smaller version.”|
|Parse failure|Recoverable error|“We could not read this file reliably. Try<br>another copy or upload an image/PDF<br>version.”|



### **2.5 Processing feedback** 

Do not show a single generic spinner for a multi-step pipeline. Show a compact progress sequence that reflects actual backend states: Uploading, Reading document, Extracting profile, Checking evidence, Preparing review. If a step is slow, keep the page visually stable and give an estimated qualitative state such as “Still processing”. Never invent a percentage unless the backend can report meaningful progress. 

### **2.6 Profile Claim Review** 

The review experience is the bridge between AI interpretation and canonical user data. It must make users feel that SINNARA is asking for confirmation, not interrogating them. 

|**Element**|**Behavior**|
|---|---|
|Claim card|Show field value, source evidence icon, confidence state, and editable<br>control.|
|Draft vs canonical|Unreviewed extraction is presented as “Suggested from your CV”.<br>Accepted or edited facts show as profile facts.|
|Evidence affordance|Tap/click opens a compact side sheet or modal showing source page,<br>excerpt and document name.|
|Bulk actions|“Accept all clear details” may be offered when confidence and<br>evidence thresholds are met.|
|Edit|Edits immediately become user-authored canonical data and should<br>be visually marked as verified by you.|
|Reject|Removes the suggestion from promotion flow, but retains provenance<br>for debugging.|
|Conflict|If two documents disagree, show both values and ask the user to<br>select or correct.|
|Missing field|Never show an empty error. Show “Add this if you want SINNARA to<br>use it.”|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

**Important** The client must never infer that a high AI confidence value means truth. Confidence is an extraction signal. Canonical status comes from validation plus user/admin rules. 

## **2.7 Dynamic Opportunity Feed** 

### **Feed information hierarchy** 

|**Priority**|**Content**|
|---|---|
|1|Opportunity title + organization|
|2|Suitability label: Strong match / Good match / Potential match|
|3|Location / work mode / deadline|
|4|One-line why it fits|
|5|Key requirement or notable gap only when decision-relevant|
|6|Save and open actions|



### **Opportunity card anatomy** 

[Organization logo/monogram]  Organization Opportunity title 

Strong match        Deadline: 14 Sep Kassala · Hybrid · Full-time “Your programme support and reporting experience align with the core requirements.” 

[View opportunity]  [Save] 

|**Card behavior**|**Specification**|
|---|---|
|Hover|Slight surface lift or border change only on pointer devices.|
|Tap|Entire body opens detail except explicit action controls.|
|Save|Optimistic state change immediately; sync silently. On failure, revert<br>and show inline toast.|
|Deadline|Use absolute date when near deadline. Use relative text only as<br>secondary context.|
|Expired|Never display in default recommendations. Saved expired items<br>remain visible in Saved with clear status.|
|Unverified|Admin-only until quality gate passes; do not expose internal low-trust<br>state.|
|Reason label|Generated from already-computed match components, not a fresh<br>LLM request on every feed render.|
|Skeleton|Match card skeleton should preserve final card dimensions to prevent<br>layout shift.|



### **Filters and sorting** 

|**Filter**|**Behavior**|
|---|---|
|Location|Multi-select; include current location, preferred locations, willing-to-<br>relocate and remote.|
|Work mode|Remote / hybrid / onsite / any.|
|Opportunity type|Jobs, internships, fellowships, consultancies, temporary, seasonal,<br>volunteer and other configured types.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Filter**|**Behavior**|
|---|---|
|Seniority|Entry, junior, mid, senior, lead/manager where available.|
|Education|Use canonical education levels; never exclude a posting solely<br>because education parsing is uncertain.|
|Deadline|Closing soon / this week / custom range.|
|Suitability|Strong / good / potential.|
|Sort|Recommended, newest, closing soon, saved state. Do not expose<br>opaque “highest score” as the only sort.|
|URL state|Filters should update URL query parameters so results can be shared<br>and restored.|



### **Instant filtering architecture** 

Filters that only affect the already-fetched result set should apply client-side immediately. Server-side filtering remains authoritative for large corpora, pagination and security-sensitive fields. Use debounced server queries for free-text search rather than delaying checkbox/chip interactions. Preserve the user's scroll position when filters change unless the result set becomes materially different. 

## **2.8 Job Detail & Grounded Match Explanation** 

### **Page structure** 

HEADER Organization Job title Location / work mode / type Deadline [Apply on official site] [Save] 

MATCH Strong match Why this fits you Evidence-backed strengths Potential gaps 

ROLE Responsibilities Requirements Preferred qualifications 

SOURCE Official posting / source provenance 

#### ACTIONS 

Track application Share Report issue 

|**Match presentation**|**Rule**|
|---|---|
|Headline|“Strong match” / “Good match” / “Potential match”.|
|Score|May be visible as a secondary numeric indicator, but never framed as<br>hire probability.|
|Strengths|Maximum 3 to 5 concise facts, each grounded in canonical profile<br>data.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Match presentation**|**Rule**|
|---|---|
|Gaps|Only meaningful gaps. Do not turn every missing optional skill into a<br>warning.|
|Hard eligibility|If a hard requirement appears unmet, show a clear eligibility note<br>before soft-fit praise.|
|Uncertainty|“We could not verify this requirement from the posting.” rather than a<br>guessed interpretation.|
|Explainability|Use evidence references in internal metadata and an evidence viewer<br>for user trust where practical.|



### **Microcopy examples** 

|**Scenario**|**Copy**|
|---|---|
|Strong|“Your finance degree and Excel experience align closely with the role’s<br>core requirements.”|
|Gap|“Power BI is preferred. It is not currently listed in your profile.”|
|Hard constraint|“This role requires three years of relevant experience. Your profile<br>currently shows two.”|
|Unclear|“The posting does not clearly state whether relocation support is<br>available.”|
|Freshness|“Last verified by SINNARA: today.”|
|External handoff|“Apply on the official site. SINNARA cannot confirm the employer’s<br>decision after you leave this page.”|



### **External application handoff** 

The “Apply” CTA opens the official URL in the safest platform-consistent manner. Before leaving, optionally offer “Track this application” so the application record is created. After return, the user can mark “Applied” themselves. SINNARA must not imply that an external click equals an application submission. 

## **2.9 Saved Jobs, Applications & Retention** 

### **Saved jobs** 

|**State**|**Behavior**|
|---|---|
|Saved|Persistent bookmark, with optional user note.|
|Preparing|User started an application workflow or generated a document.|
|Applied|Self-reported, never inferred from URL click.|
|Expired|Retained in history, removed from active recommendations.|
|Archived|User intentionally hides from active lists.|



### **Applications workspace** 

The Applications section is a long-term memory layer for the user, not an ATS clone. Each opportunity has a timeline and immutable generated artifacts when those features are introduced. 

APPLICATION LIST Role + organization Status chip Last activity Deadline / expired state 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

Files count 

APPLICATION DETAIL Opportunity snapshot Timeline Saved Tailored CV generated Cover letter generated External application opened Applied (self-reported) Documents Original source CV Tailored CV v1 Tailored CV v2 Cover letter v1 Notes Open official application 

### **Future document-generation UX** 

|**Requirement**|**UX rule**|
|---|---|
|Tailored CV|Never overwrite original CV. Create a versioned artifact linked to the<br>application.|
|Cover letter|Show target role and employer context before generation.|
|Generation state|Use background job state with progress narrative, not fake percentage.|
|Review|User can preview, edit and download.|
|Change summary|Show what was emphasized or rewritten.|
|Factual safety|Show a clear confirmation that SINNARA uses only verified profile<br>information.|
|ATS mode|Use a structured template and explain the format choice. Avoid<br>promising ATS success.|



### **WhatsApp and notification experience** 

|**Preference**|**UI behavior**|
|---|---|
|Channel|WhatsApp as the initial preferred channel, with architecture<br>supporting future channels.|
|Cadence|Instant, daily digest, twice weekly, weekly, or off. Final options can be<br>adjusted after usability testing.|
|Threshold|Minimum suitability level to include in digests.|
|Quiet hours|User timezone aware. Never send during configured quiet window.|
|Categories|Allow opportunity-type and sector preferences.|
|Digest preview|Show an example of the message before enabling.|
|Opt-out|One clear path to disable immediately from notification settings.|



### **Notification message style** 

SINNARA 

3 new opportunities matched your profile 

1. Programme Assistant · Strong match Kassala · Deadline 18 Sep 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

2. Finance Officer · Good match Port Sudan · Deadline 21 Sep 

Open SINNARA to review why these fit you. 

### **Career Intelligence surface** 

MVP career intelligence should feel like a concise briefing, not a long AI report. The user sees current career signals, a small number of actions, and links back to concrete opportunities. Learning-resource cards are a later extension and should preserve the same visual language. 

## **3. Admin & Operational Controls** 

### **3.1 Admin information architecture** 

|**Area**|**Purpose**|
|---|---|
|Overview|System health, new jobs, failures, queue depth, AI spend/usage<br>estimates.|
|Opportunity Triage|Review low-confidence, duplicate, stale or ambiguous postings.|
|Sources|Source status, last check, failure history, change frequency.|
|AI Runs|Task, model, prompt version, latency, validation failures, retries and<br>usage.|
|Documents|Failed candidate processing, parser diagnostics and retry controls.|
|Analytics|Funnel, activation, feed relevance, search/filter behavior and<br>bottlenecks.|
|Insights|AI-assisted summaries of aggregated product metrics, clearly labeled<br>as analysis.|
|Audit|Administrative actions and system events.|



### **3.2 Admin triage dashboard** 

#### TOP METRICS 

Jobs ingested today | Published | Expiring soon | Failed Document failures | Queue depth | AI p95 | Validation failure rate 

#### QUEUE 

[High] Deadline conflict 

[Medium] Possible duplicate [Low] Extraction confidence < threshold 

#### ACTION PANEL 

Review -> Compare source -> Correct -> Publish / Reject 

|**Control**|**Behavior**|
|---|---|
|Source health|Traffic-light summary based on last successful check, recent error rate<br>and freshness.|
|Retry|Idempotent retry only. Show next retry time and last error.|
|Compare versions|Show what changed between current and prior source observation.|
|Publish|Require official application URL and quality gate before publication.|
|Expire|Allow manual override with reason; automatic expiry remains default.|
|Prompt/model monitor|Filter by task, model, prompt version, validation status.|
|Cost monitor|Show token/runtime usage and estimates, not billing secrets.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

### **3.3 Admin AI monitoring** 

|**Metric**|**UI treatment**|**Alert threshold example**|
|---|---|---|
|p50/p95 latency|Sparkline + current value|Sustained rise versus baseline|
|Validation failure rate|Trend + task breakdown|Above configured ceiling|
|Retry rate|Trend + provider breakdown|Spike above baseline|
|Evidence coverage|Distribution|Below task-specific threshold|
|User correction rate|Trend|Sudden increase after model/prompt change|
|Provider 429/5xx|Trend|Repeated errors or queue growth|
|AI cost/run|Average and tail|Unexpected increase|
|Queue age|Oldest pending job|SLA breach|



## **4. Component Architecture** 

### **4.1 Component philosophy** 

Use a small set of composable primitives rather than screen-specific one-off widgets. Components should be controlled by explicit data and state, not inferred from CSS classes or hidden assumptions. shadcn UI can provide accessible foundations, while SINNARA owns the visual tokens and interaction behavior. 

|**Primitive**|**Responsibility**|
|---|---|
|AppShell|Global layout, navigation, account menu, responsive behavior.|
|PageHeader|Title, supporting text, primary action, optional filters.|
|Surface|Neutral container with optional border/elevation/blur variants.|
|Button|Primary, secondary, tertiary, destructive; loading and disabled states.|
|IconButton|44x44 minimum, tooltip on desktop, accessible label always.|
|Input / SearchField|Validation, loading, clear action, keyboard behavior.|
|Select / Command|Searchable location and taxonomy selection.|
|Chip / FilterChip|Compact filters with removable state.|
|StatusBadge|Semantic status, never color-only.|
|OpportunityCard|Reusable feed unit.|
|MatchSummary|Strong/Good/Potential + rationale.|
|EvidenceRow|Claim + source + excerpt entry point.|
|DocumentDropzone|Upload, progress, validation and retry.|
|ProgressSteps|Pipeline stage visualization.|
|Skeleton|Layout-preserving placeholder.|
|EmptyState|Message + next action.|
|Toast|Non-blocking confirmation/error, with action if useful.|
|Sheet / Dialog|Contextual detail without full navigation when appropriate.|
|Timeline|Application history and events.|
|DataTable|Admin operational grids with keyboard and pagination.|
|FilterBar|Responsive filter grouping with mobile sheet behavior.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

### **4.2 Component API rule** 

Prefer explicit states: <OpportunityCard opportunity={opportunity} match={match} saved={saved} onOpen={...} onSave={...} loading={...} /> 

Avoid components that query Supabase directly or call Gemini. Presentation receives typed data. Service hooks handle data access. 

### **4.3 Component state matrix** 

|**State**|**Visual**|**Allowed actions**|
|---|---|---|
|Loading initial|Skeleton matching final geometry|None unless a cancel action exists.|
|Loading mutation|Keep content visible; action shows spinner|Prevent duplicate submission.|
|Success|Normal state + micro confirmation|Continue.|
|Error recoverable|Inline reason + retry|Retry / change input / continue.|
|Empty|Purposeful message + next action|Primary setup or search action.|
|Disabled|Reduced contrast but still readable|No action.|
|Offline|Persistent but unobtrusive banner / badge|Retry / continue with cached data where safe.|
|Stale|Data visible with freshness note|Refresh.|
|Partial|Available content plus missing-state note|Retry missing piece or continue.|
|Permission denied|Explicit access explanation|Return / request access.|



### **4.4 UI state matrix by core component** 

|**Component**|**Idle**|**Busy**|**Success**|**Failure**|**Empty**|
|---|---|---|---|---|---|
|Dropzone|Ready|Upload/progress|Ready + file summary|Inline recovery|Not applicable|
|Profile Review|Claims visible|Claim processing|Canonical after save|Claim-level retry|“Nothing extracted”<br>recovery|
|Feed|Recommendations|Skeleton|Cards|Feed error + retry|Explain why no jobs<br>match|
|Job Detail|Loaded|Detail skeleton|Loaded|Source unavailable /<br>stale|Not found|
|Save|Unsaved|Spinner/optimistic|Saved|Rollback + toast|Not applicable|
|Application|No tracker|Creating|Tracked|Retry|Not applicable|
|Notifications|Configured|Saving|Updated|Inline error|Not enabled|



## **5. Cross-Platform Human Interface Requirements** 

### **5.1 Web and mobile parity** 

|**Area**|**Desktop**|**Mobile web / PWA**|
|---|---|---|
|Navigation|Side or topnavigation,dependingtested IA|Bottom navigation forprimarydestinations or|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Area**|**Desktop**|**Mobile web / PWA**|
|---|---|---|
|||compact top navigation|
|Filters|Inline filter bar + optional side sheet|Filter button opens full-height or bottom<br>sheet|
|Job detail|Two-column: content + sticky actions where<br>space permits|Single column, sticky bottom action if needed|
|Evidence|Side panel|Bottom sheet|
|Upload|Drag-and-drop + file picker|Camera/file picker where supported|
|Application history|Table/list hybrid|Cards/timeline|
|Admin|Dense desktop data tables|Responsive audit view, not a primary mobile<br>workflow|



### **5.2 Touch and gesture rules** 

- Primary interactive target >= 44 x 44 CSS px, with enough separation to prevent accidental taps. 

- Swipe is optional enhancement, never the only way to access a critical action. 

- Horizontal carousels should not be used for core opportunity lists. Prefer vertically scannable lists with predictable loading. 

- Long-press is not required for any critical function. 

- Avoid gesture conflicts with browser navigation and OS edge gestures. 

### **5.3 Accessibility requirements** 

|**Requirement**|**Implementation rule**|
|---|---|
|Keyboard|Every actionable control reachable in logical order.|
|Focus|Visible, high-contrast focus ring; no outline suppression without<br>replacement.|
|Labels|Icon-only controls have accessible names.|
|Errors|Use text explanation plus programmatic association to fields.|
|Status|Async results announced to assistive technology when appropriate.|
|Contrast|Target WCAG 2.2 AA for text and controls.|
|Motion|Respect prefers-reduced-motion.|
|Forms|Labels always visible for complex fields; placeholders are not labels.|
|Tables|Admin tables need semantic headers and responsive alternative on<br>narrow screens.|
|Language|Content is English in MVP; no text embedded in images.|



### **5.4 Safe-area and viewport behavior** 

:root { 

--safe-top: env(safe-area-inset-top, 0px); --safe-bottom: env(safe-area-inset-bottom, 0px); } 

.sticky-mobile-cta { padding-bottom: max(16px, var(--safe-bottom)); } 

Use dvh/svh cautiously for sheets and full-height mobile panels. Never assume 100vh equals the visible mobile viewport. 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

### **5.5 Performance UX contract** 

|**Performance area**|**UX requirement**|
|---|---|
|First paint|Show usable shell quickly; avoid blocking on non-critical analytics or<br>AI.|
|Feed|Render available data immediately; lazy-load secondary metadata.|
|Images|Reserve dimensions before load; use responsive sizes and optimized<br>assets.|
|AI operations|Move expensive work to background jobs where possible.|
|Navigation|Prefetch likely next route or data only when it does not compete with<br>initial render.|
|Interaction latency|Buttons should respond visually immediately even when server work<br>continues.|
|Layout stability|No content shift when skeletons are replaced; reserve space for media<br>and controls.|



## **6. Content Design & Microcopy** 

### **6.1 Tone** 

|**Attribute**|**Rule**|
|---|---|
|Professional|Clear, restrained, confident.|
|Human|Natural phrasing, no “As an AI” language.|
|Specific|Name the actual action or issue.|
|Concise|One idea per sentence where possible.|
|Non-alarmist|Errors describe what happened and what to do next.|
|Evidence-led|Avoid absolute claims when the data is uncertain.|
|No em dash|Use commas, periods, parentheses or semicolons instead.|
|No hype|Avoid “revolutionary”, “perfect match”, “guaranteed” or hiring-<br>probability claims.|



### **6.2 Preferred microcopy patterns** 

|**Avoid**|**Prefer**|
|---|---|
|“Oops! Something went wrong.”|“We could not load your recommendations. Try again.”|
|“AI is analyzing your CV…”|“Reading your CV and preparing your profile…”|
|“You are a 92% match!”|“Strong match” + evidence-backed reasons|
|“Congratulations, you found the perfect job!”|“This role aligns closely with your profile.”|
|“No jobs found.”|“No roles match these filters. Try widening your location or work-mode<br>preferences.”|
|“AI-generated content” everywhere|Use a quiet provenance label where necessary, while making factual<br>source and user control clearer.|



### **6.3 Confidence and uncertainty language** 

|**Internal state**|**User-facing language**|
|---|---|
|High evidence|“Based on your profile…”|
|Low evidence|“We could not verify…”|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Internal state**|**User-facing language**|
|---|---|
|Conflicting source|“Two sources show different dates. Review before relying on this<br>detail.”|
|Missing information|“Not listed in the posting.”|
|External outcome unknown|“SINNARA cannot see the employer’s decision after you apply<br>externally.”|



## **7. UX Integration with Data, AI and Job Intelligence** 

### **7.1 Canonical vs derived UI data** 

|**UI datum**|**Source**|**Refresh model**|
|---|---|---|
|Name / education / experience|Canonical profile tables|User edits / validated extraction|
|Suggested claim|profile_claims + processing run|Until accepted/edited/rejected|
|Match score|matches + ranking policy version|Recomputed when inputs/policy materially<br>change|
|Match explanation|Validated AI output linked to match evidence|Cached and refreshed when match changes|
|Deadline|opportunities canonical + freshness state|Scheduled refresh / source change|
|Opportunity source|source link + current source version|Ingestion pipeline|
|Application status|applications / application_events|User actions only in MVP|
|Notification state|notification_preferences / deliveries|User preference + dispatcher state|



### **7.2 When UX should call AI** 

- Profile extraction after a document is parsed and validated. 

- Opportunity explanation when the match record lacks a current explanation. 

- Career intelligence on explicit user request or controlled background refresh. 

- Future document generation after verified candidate evidence and target opportunity are loaded. 

- Never call AI merely to format a button label, sort a list, resolve a deterministic date, or determine whether a saved item exists. 

### **7.3 Evidence drawer** 

EVIDENCE SHEET “Why SINNARA says this” 

Claim 

Your experience: Business Development Intern 

Source 

CV.pdf · page 2 

Extract 

“Supported partner outreach…” 

Status 

Verified by you 

[Close] 

Evidence should be concise. Show enough source context to support trust without exposing unnecessary private document content. 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

### **7.4 Feed recomputation behavior** 

|**Trigger**|**Expected UX**|
|---|---|
|User edits a material profile fact|Show “Updating your recommendations…” and refresh affected cards.|
|New high-quality jobs ingested|Quietly prepare matches; notify only according to preferences.|
|Job expires|Remove from active feed on next query; preserve saved/application<br>history.|
|Matching policy version changes|Background recompute, do not block user navigation.|
|AI explanation fails|Show deterministic match summary without pretending the<br>explanation is available.|



## **8. Search, Discovery and Empty States** 

### **8.1 Search interaction** 

|**Behavior**|**Specification**|
|---|---|
|Input|Search by role, organization, skill or keyword.|
|Debounce|200-300 ms before remote suggestion/query.|
|Suggestions|Use canonical roles/organizations where known; show source context.|
|No results|Suggest related canonical concepts and filter relaxation.|
|Recent searches|Store locally first; optionally persist signed-in search history later.|
|URL state|Persist query and filter state in URL where safe.|
|Loading|Keep previous result set visible while next query loads when possible.|



### **8.2 Empty state taxonomy** 

|**Situation**|**Headline**|**Primary action**|
|---|---|---|
|No profile|“Build your profile to personalize SINNARA”|Upload CV|
|Processing|“Your profile is being prepared”|Review later|
|No matches|“Nothing strong enough yet”|Widen preferences|
|No saved jobs|“Your saved opportunities will appear here”|Explore opportunities|
|No applications|“Keep track of the roles you apply to”|Explore / save|
|No notifications|“Choose how SINNARA should reach you”|Set preferences|
|Admin queue empty|“Everything is up to date”|None|



## **9. Edge Cases, Errors and Recovery** 

|**Case**|**UX response**|
|---|---|
|User closes page during processing|Persist job state. On return, resume from known state.|
|Duplicate CV upload|Recognize checksum and offer “Use existing file” or “Upload new<br>version”.|
|CV and certificate conflict|Do not choose silently. Surface conflict for review.|
|Job source changes after user viewed it|Show latest verified state and optionally “Updated since you viewed<br>it”.|
|Official application URL breaks|Mark source issue, keep cached source metadata, disable direct apply<br>until verified.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Case**|**UX response**|
|---|---|
|Deadline passes while detail is open|Disable application CTA and explain that the posting has expired.|
|Network loss during save|Keep local optimistic state and retry when safe; do not show false<br>success.|
|User has no relevant jobs|Never fabricate recommendations just to fill the screen.|
|Very long job description|Prioritize summary and requirements, provide expandable sections.|
|Unreadable certificate scan|Offer re-upload at better quality; do not invent certificate details.|
|Unsupported country/location|Allow free-text review path and flag taxonomy gap for admin; do not<br>block the entire profile.|
|WhatsApp opt-in revoked externally|Reflect delivery failure and ask user to re-enable or choose another<br>channel later.|



## **10. Product Analytics & Behavioral Intelligence UX** 

The UX must make instrumentation possible without coupling the component tree to analytics logic. Components emit stable semantic events; an analytics service handles transport, versioning and privacy boundaries. 

|**Event**|**When emitted**|**Properties**|
|---|---|---|
|onboarding_started|Flow begins|surface, auth_state|
|cv_uploaded|File accepted|document_type, file_size_bucket|
|profile_review_started|Claims displayed|claim_count_bucket|
|profile_claim_edited|User edits suggestion|entity_type, field_name|
|recommendation_viewed|Feed item enters view|opportunity_id, position_bucket, match_label|
|opportunity_opened|Detail opened|source_context|
|opportunity_saved|Save succeeds|position_bucket|
|application_started|Tracker created|source_context|
|official_apply_clicked|External URL opened|opportunity_id|
|application_marked_applied|Self-report|opportunity_id|
|notification_opened|Notification click|channel, notification_type|
|filter_used|Filter changes result set|filter_name|
|search_submitted|Search request|query_length_bucket|
|error_seen|User-visible error|error_code, component|



### **Admin behavioral signals** 

|**Signal**|**Interpretation**|
|---|---|
|High upload, low review completion|Profile review may feel complex or extraction quality may be low.|
|High detail views, low external apply clicks|Job detail or trust/source presentation may not resolve decision<br>uncertainty.|
|High save, low application progression|Users may be using SINNARA as a shortlist rather than action tool.|
|Frequent filter changes|Default feed may not reflect preferences well.|
|High WhatsApp opt-out|Cadence, relevance or message format may be poor.|
|High claim edit rate on one field|Extraction or taxonomy quality needs review.|
|Long processing abandonment|Background job UX or pipeline reliability issue.|



Behavioral analytics must not include CV text, certificate content, phone numbers, or unnecessary PII in generic event properties. 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

## **11. React / Tailwind / shadcn Implementation Guidance** 

### **11.1 Suggested application structure** 

src/ 

app/ (marketing)/ 

(app)/ home/ discover/ saved/ applications/ career/ profile/ settings/ admin/ components/ ui/ opportunities/ profile/ documents/ applications/ analytics/ features/ onboarding/ matching/ notifications/ lib/ supabase/ analytics/ services/ validation/ types/ 

### **11.2 Server/client boundary** 

|**Concern**|**Preferred location**|
|---|---|
|Auth / privileged Supabase access|Server-side|
|AI Gateway calls|Server-side only|
|File signed URL issuance|Server-side|
|Candidate interactive state|Client-side|
|Feed filter state|Client + server query|
|Optimistic save|Client, reconciled server-side|
|Analytics emit|Client helper -> server ingestion|
|Admin actions|Server action / protected route|



### **11.3 Data fetching** 

- Use typed service functions that return domain objects, not raw Supabase rows throughout the UI. 

- Use query caching for feed/detail records where helpful, with explicit invalidation after mutations. 

- Never put service-role credentials in client bundles. 

- Keep the UI resilient to missing optional fields because source extraction is probabilistic and data evolves. 

SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

### **11.4 Loading strategy** 

|**Surface**|**Preferred strategy**|
|---|---|
|Feed|Server-render first page, skeleton on transitions, incremental<br>pagination/infinite load after testing.|
|Profile review|Load structured claims first, evidence on demand.|
|Job detail|Render canonical fields first, match explanation can load as<br>secondary block if not cached.|
|Applications|Paginate history, lazy-load document metadata.|
|Admin|Server pagination and filtering, avoid loading entire logs into browser.|



## **12. UX Quality Assurance** 

### **12.1 Functional QA** 

|**Area**|**Acceptance check**|
|---|---|
|Onboarding|A new user can reach first recommendations without unnecessary<br>manual profile entry.|
|Upload|Unsupported or unreadable documents fail gracefully and can be<br>retried.|
|Claims|Every extracted claim can be reviewed, edited, accepted or rejected as<br>designed.|
|Feed|Published, fresh opportunities appear; expired/rejected records do<br>not.|
|Matching|Hard eligibility is never overridden by soft relevance.|
|Detail|Official source and deadline are visible and accurate.|
|Saved|Save state persists and handles network failure.|
|Applications|External application click does not falsely mark Applied.|
|Notifications|Opt-in, cadence, threshold and quiet hours are respected.|
|Admin|Operational failures can be found and retried without database<br>editing.|



### **12.2 Visual QA** 

- No layout shift when skeletons resolve. 

- All primary actions remain visible or reachable on 320 px wide mobile layouts. 

- No clipped text for long organization names or job titles. 

- Dark mode maintains contrast and hierarchy. 

- Focus states are visible and not hidden by sticky headers or overlays. 

- Safe-area insets work on modern iOS devices. 

- Reduced-motion mode removes non-essential transitions. 

- Empty, partial and error states are designed, not accidental browser fallbacks. 

### **12.3 UX performance targets** 

|**Metric**|**Target direction**|
|---|---|
|Interaction response|Immediate visual acknowledgement, ideally <100 ms perceived|
||response.|
|Core navigation|Fast enough that transitions feel direct; avoid loading screens between<br>stable routes.|
|Feed first useful content|Render meaningful opportunitycontent as earlyas backend data|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

|**Metric**|**Target direction**|
|---|---|
||allows.|
|Document processing|User should never be blocked by a long-lived synchronous request;|
||processing runs asynchronously.|
|Layout stability|Near-zero unexpected cumulative movement on core screens.|
|Admin operations|Actions show immediate state transition and preserve context.|



## **13. UX Decisions to Freeze Before Claude Code** 

|**Decision**|**Status**|**Notes**|
|---|---|---|
|English-only customer interface|Freeze|Localization architecture may exist<br>underneath, but MVP copy is English.|
|Responsive web first|Freeze|PWA-ready, no separate native app for MVP.|
|44x44 touch target baseline|Freeze|Use larger when context requires.|
|Progressive profiling|Freeze|CV first, then review and preference<br>completion.|
|Claims before canonical profile|Freeze|AI suggestions are reviewable before<br>promotion.|
|Match label over hiring probability|Freeze|Use Strong / Good / Potential with evidence.|
|Official application handoff|Freeze|External outcome not inferred.|
|Applications history architecture|Freeze|Future generated CV/cover letters are<br>versioned and immutable.|
|WhatsApp as channel, not core data model|Freeze|Notification service remains channel-<br>agnostic.|
|Admin operational visibility|Freeze|Failures must be inspectable and retryable.|
|Analytics without document PII|Freeze|Behavior events are separate from private<br>profile data.|
|Modular monolith|Freeze|Do not introduce microservices without a<br>measured need.|
|AI through gateway only|Freeze|No direct model calls from components.|
|Visual style|Freeze|Minimal, premium, restrained glass/depth,<br>high clarity.|



## **14. Open Design Questions** 

|**Question**|**Why it matters**|**Default assumption for MVP**|
|---|---|---|
|Exact onboarding auth method|Affects friction and identity data flow.|Choose the lowest-friction Supabase Auth<br>method that is reliable in target markets.|
|Exact first-run job count|Too many cards increase cognitive load.|Small curated set, with clear “See more”.|
|Whether numeric score is visible|Numbers can create false precision.|Use qualitative label first; numeric secondary<br>only if testing shows value.|
|Evidence detail level|Too much source content increases cognitive<br>load and privacy exposure.|Short excerpt + page/source metadata.|
|WhatsApp provider path|Could introduce cost or compliance<br>complexity.|Keep adapter interface ready; validate<br>provider economics before enabling at scale.|
|Career intelligence MVP depth|Could become a large AI surface.|One concise briefing with evidence and next<br>actions.|
|Exact document generation phase|High value but higher complexity.|After matching reliability is proven.|
|Admin mobile scope|Operational value isprimarilydesktop.|Responsive read-only/ lightweight mobile|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

**Question** 

**Why it matters** 

**Default assumption for MVP** 

support only initially. 

## **15. Handoff to Engineering and Claude Code** 

Claude Code should implement the UX in small vertical slices, not build every component library detail first. Each slice should connect a real user flow to the actual Supabase schema and AI/processing contracts. 

Suggested implementation order 

1. App shell + design tokens + responsive navigation 

2. Auth + onboarding shell 

3. Document drop zone + processing state 

4. Profile claim review 

5. Candidate profile and preferences 

6. Opportunity feed + card + filter state 

7. Job detail + match explanation 

8. Save + application tracking 

9. Notification settings 

10. Admin operational surfaces 

11. Analytics instrumentation 

12. Accessibility + performance hardening 

### **Claude Code implementation guardrails** 

- Read the Data Model and AI Data Contracts before creating UI data types. 

- Do not duplicate database schemas inside components when shared generated types can be used. 

- Do not call AI providers from client code. 

- Do not create fake data states as substitutes for unimplemented services unless explicitly marked as local fixtures. 

- For every new async interaction, implement loading, success, error, retry and empty behavior before considering the feature complete. 

- Any new UI state that introduces new product behavior should be recorded as a decision in the project docs when it changes an established contract. 

**Definition of “done”** A SINNARA screen is not complete when the happy path works. It is complete when its data source, async states, errors, empty state, accessibility behavior, responsive layout, analytics events and privacy boundaries are all defined and tested. 

## **16. Reference Standards** 

The UX specification is informed by established platform and accessibility conventions. These are reference points, not instructions to copy another product. 

|**Reference**|**Use**|
|---|---|
|Apple Human Interface Guidelines|Interaction hierarchy, platform conventions, motion, touch and<br>accessibility patterns.|
|Material Design guidance|Responsive web and Android-compatible interaction conventions,<br>especially touch targets and system feedback.|
|WCAG 2.2 AA|Accessibility baseline for web UI.|
|WAI-ARIA Authoring Practices|Accessible interaction patterns for dialogs, tabs, comboboxes and<br>other components.|
|Next.js / React platform guidance|Streaming, server/client boundaries and responsive performance<br>patterns.|
|shadcn UI / Radix primitives|Accessible composable foundations, with SINNARA-owned styling and<br>behavior.|



SINNARA | UX & Product Experience Specification v1.0 | Internal Product Foundation 

