**SINNARA**

**MVP PRODUCT BLUEPRINT**

Sudan-first career intelligence and opportunity discovery platform

  -----------------------------------------------------------------------
  **Core product idea\
  **SINNARA helps Sudanese job seekers discover opportunities that fit
  their qualifications, experience, preferences, and career direction. It
  reduces the work of searching, interprets opportunities, explains fit,
  and creates a trusted path from profile to application.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **Architecture principle\
  **Sudan-specific product today, globally extensible foundation
  tomorrow. The MVP must serve Sudan deeply without hardcoding Sudan into
  the core architecture.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **Document**      **Version**       **Status**        **Audience**
  ----------------- ----------------- ----------------- -----------------
  SINNARA MVP       v1.0              Foundational      Founder, product,
  Product Blueprint                                     design,
                                                        engineering,
                                                        Claude Code

  -----------------------------------------------------------------------

14 September 2026

# 1. Executive Summary

SINNARA is a Sudan-focused career intelligence platform for job seekers,
especially fresh graduates and early-stage professionals navigating a
fragmented employment market. The MVP focuses on one core promise: a
person uploads their CV and relevant documents, SINNARA builds a
structured profile, discovers and understands relevant opportunities,
explains why they fit, and sends useful alerts with the official
application link.

The product should feel simple and human. The intelligence is complex
behind the scenes, but the user experience is deliberately clean, fast,
and low-friction.

The MVP is not a full employer marketplace, ATS, learning marketplace,
global job aggregator, or mobile app. Those capabilities remain in the
roadmap and influence architecture only where that can be done without
premature complexity.

  -----------------------------------------------------------------------
  **MVP success condition\
  **A real Sudanese job seeker can move from sign-up to credible
  personalized opportunities with minimal effort and can clearly
  understand why the system recommended them.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 2. Product Vision and Positioning

## Vision

Build the most useful and trusted career intelligence layer for Sudan: a
product that understands the person, understands the opportunity, and
makes the connection clear.

## Positioning

SINNARA should not be positioned as just another job board. Its
differentiated promise is personalized career intelligence: discovering
opportunities, explaining fit, identifying gaps, and helping people make
better career decisions.

## Long-term direction

> **•** Individuals use SINNARA to discover jobs, internships, temporary
> and seasonal work, consultancies, fellowships, scholarships, training,
> volunteer opportunities, and remote contracts.
>
> **•** The platform helps users improve their career direction, close
> skill gaps, and later manage application materials and history.
>
> **•** Organizations eventually create paid professional profiles,
> structured vacancies, and employer workflows once there is strong
> candidate momentum.
>
> **•** A mature SINNARA can become a two-sided talent marketplace, but
> employer-side outcome learning only becomes valid when employers
> actually manage application workflows inside SINNARA.
>
> **•** The architecture remains country-agnostic while the initial
> product remains deeply tailored to Sudan.

# 3. Product Principles

  -----------------------------------------------------------------------
  **Principle**                       **Meaning**
  ----------------------------------- -----------------------------------
  Sudan-first, globally extensible    Optimize the product, content,
                                      sources, and market intelligence
                                      for Sudan while keeping core code
                                      and data models reusable.

  Useful before impressive            Prioritize features that improve
                                      discovery, application quality,
                                      career direction, trust, retention,
                                      or distribution.

  Document-first onboarding           Ask the user to upload the CV and
                                      certificates before asking them to
                                      manually fill long forms.

  Evidence before inference           AI can interpret evidence but must
                                      not silently invent credentials,
                                      employment history, dates,
                                      achievements, or skills.

  Explain recommendations             Show users why an opportunity is a
                                      good fit and where gaps remain.

  Trust source data                   Keep provenance, official links,
                                      deadline information, freshness and
                                      verification state for each
                                      opportunity.

  Fast and recoverable                Heavy work happens asynchronously;
                                      failures do not force the user to
                                      repeat successful steps.

  Low-cost by design                  Use deterministic code for
                                      deterministic tasks and AI only
                                      where interpretation adds value.

  Progressive profiling               Collect what is needed first and
                                      allow the profile to become richer
                                      over time.

  Human-quality outputs               Professional language, authentic
                                      tone, no generic AI clichés, no
                                      invented claims, and no em dash in
                                      public-facing copy.

  Provider independence               Gemini can be the initial model,
                                      but the application should not be
                                      structurally dependent on one AI
                                      provider.

  Continuous improvement              Use product analytics to identify
                                      friction, data-quality issues, and
                                      patterns that improve the product,
                                      while respecting privacy.
  -----------------------------------------------------------------------

# 4. Target Users and Initial Market

## Primary users

Sudanese students approaching graduation, recent graduates, early-career
professionals, experienced professionals changing roles, and people
seeking temporary, seasonal, part-time, consultancy, internship,
fellowship, or remote opportunities.

## Initial market

Sudan only. The first release should understand Sudanese geography,
employers, NGOs, UN and development opportunities, private-sector
opportunities, common recruitment channels, and local employment
realities.

## Future stakeholders

Employers, recruiters, training providers, and career-support
organizations become increasingly important later, but the MVP does not
depend on them.

# 5. MVP Scope

## 5.1 Must-have

> **1.** Secure account creation and authentication.
>
> **2.** CV upload as the primary onboarding input.
>
> **3.** Certificate and supporting-document upload.
>
> **4.** Document parsing and AI-assisted extraction into a structured
> candidate profile.
>
> **5.** User review, correction, and completion of extracted data.
>
> **6.** Current location, preferred locations, relocation preference,
> work mode, availability, and employment preferences.
>
> **7.** Career interests / target role families / sectors.
>
> **8.** Sudan-focused opportunity database.
>
> **9.** Controlled initial job-source ingestion.
>
> **10.** Opportunity normalization and AI-assisted requirement
> extraction.
>
> **11.** Deduplication, deadline, freshness, provenance, and
> verification controls.
>
> **12.** Personalized recommended opportunities.
>
> **13.** Transparent explanation of suitability and gaps.
>
> **14.** Direct official application links.
>
> **15.** Basic search, filters, and saved opportunities.
>
> **16.** Basic notification preferences and an initial notification
> pathway if available within MVP constraints.
>
> **17.** Lightweight admin console for opportunity quality, source
> health, processing failures, and basic system operations.
>
> **18.** Product analytics for activation, discovery, engagement, and
> bottlenecks.

## 5.2 Deliberately outside MVP

> **1.** Employer accounts and paid organization profiles.
>
> **2.** Employer candidate search and outreach.
>
> **3.** Full application management / ATS.
>
> **4.** Reliable learning from shortlist, interview, offer, and hire
> outcomes.
>
> **5.** Automated tailored CVs and cover letters as a core release.
>
> **6.** Full learning-resource marketplace.
>
> **7.** Automated social publishing engine.
>
> **8.** Mobile apps.
>
> **9.** Payments and subscriptions.
>
> **10.** Large-scale global source coverage.
>
> **11.** Mass scraping of sources where access is not clearly
> permitted.
>
> **12.** Complex predictive hiring models.

  -----------------------------------------------------------------------
  **Boundary rule\
  **Future functionality can influence the architecture where cheap and
  safe, but it should not consume MVP implementation effort unless it
  supports the first proof of value.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 6. Core Candidate Journey

  -----------------------------------------------------------------------
  **Step**                **Stage**               **Expected experience**
  ----------------------- ----------------------- -----------------------
  1                       Landing                 One clear value
                                                  proposition: find
                                                  opportunities that fit
                                                  you.

  2                       Sign up                 Minimal account
                                                  creation; avoid
                                                  unnecessary questions.

  3                       Upload                  CV first, then
                                                  certificates and
                                                  optional supporting
                                                  documents.

  4                       Process                 Parse, extract,
                                                  structure, validate,
                                                  and prepare a draft
                                                  profile.

  5                       Review                  User confirms, edits,
                                                  and adds missing
                                                  information.

  6                       Preferences             Location, preferred
                                                  locations, work mode,
                                                  employment type,
                                                  availability, and
                                                  career interests.

  7                       Recommendations         SINNARA produces the
                                                  first useful set of
                                                  opportunities.

  8                       Opportunity             User sees fit
                                                  explanation, key
                                                  information, deadline,
                                                  and official link.

  9                       Save                    User saves
                                                  opportunities for
                                                  later.

  10                      Return                  Relevant alerts and new
                                                  recommendations bring
                                                  the user back.
  -----------------------------------------------------------------------

# 7. Candidate Profile Blueprint

  -----------------------------------------------------------------------
  **Section**                         **Content**
  ----------------------------------- -----------------------------------
  Identity                            Name, contact information, current
                                      location, account state.

  Education                           Institution, qualification, field,
                                      dates, notable academic
                                      information.

  Experience                          Employer, role, dates,
                                      responsibilities, achievements,
                                      sector, employment type.

  Skills                              Technical, professional,
                                      interpersonal, software/tools,
                                      normalized skill labels.

  Certifications                      Name, provider, date, expiry where
                                      applicable.

  Languages                           Language and proficiency.

  Projects                            Academic, professional,
                                      entrepreneurial, personal, and
                                      community projects.

  Volunteering                        Organization, role, dates,
                                      activities.

  Preferences                         Preferred locations, relocation,
                                      remote/hybrid/on-site, employment
                                      types, availability.

  Career direction                    Target roles, sectors, interests,
                                      short/medium-term goals.

  Evidence                            Source document or user input
                                      supporting important claims.
  -----------------------------------------------------------------------

## Document-first onboarding

The system should extract first and ask second. Users should not be
forced to manually reproduce information that exists in their CV or
certificates. The profile review screen is a correction and completion
step, not a data-entry burden.

Source evidence and inferred attributes should remain conceptually
distinct. For example, a system may infer a normalized skill category
from a role description, but it must retain the underlying experience
statement that supports the inference.

# 8. Opportunity Intelligence Blueprint

> **•** Title and organization
>
> **•** Country, state/region, city and location attributes
>
> **•** Opportunity type
>
> **•** Sector / functional area
>
> **•** Seniority or experience level
>
> **•** Education requirements
>
> **•** Required skills and preferred skills
>
> **•** Languages
>
> **•** Compensation where explicitly published
>
> **•** Contract and duration information
>
> **•** Deadline and source timezone where known
>
> **•** Application instructions
>
> **•** Official application URL
>
> **•** Original source URL
>
> **•** Source type
>
> **•** Date discovered
>
> **•** Last verified
>
> **•** Status
>
> **•** Duplicate linkage
>
> **•** Extraction confidence

## Opportunity types

Use one generalized Opportunity model that can support permanent,
fixed-term, temporary, seasonal, internship, consultancy, part-time,
casual, volunteer, fellowship, scholarship, training, and remote
contract opportunities.

## Source trust

Prefer official organization postings and preserve the official URL.
Secondary social or aggregator sources can assist discovery but should
carry clearer provenance and verification rules.

# 9. Matching and Recommendation Model

The first matching engine should combine deterministic rules with
AI-assisted semantic interpretation. It should not depend entirely on an
opaque language-model score.

  -----------------------------------------------------------------------
  **Dimension**                       **Purpose**
  ----------------------------------- -----------------------------------
  Eligibility                         Hard requirements such as mandatory
                                      education, minimum experience,
                                      licenses, or explicit location
                                      constraints.

  Capability fit                      Skills, responsibilities, tools,
                                      domain/sector exposure, and
                                      demonstrated evidence.

  Preference fit                      Location, remote/on-site,
                                      employment type, availability, and
                                      other preferences.

  Career alignment                    Fit with the user's stated career
                                      direction and plausible next step.

  Evidence confidence                 How strongly the system can support
                                      the conclusion from available
                                      evidence.
  -----------------------------------------------------------------------

## User-facing result

Use simple labels such as Strong match, Good match, or Explore. An
internal score may support ranking, but the product should not present
it as a scientifically precise probability of getting hired.

  -----------------------------------------------------------------------
  **Example\
  **Strong match. Your education meets the stated requirement, your
  experience overlaps with programme support and reporting, and the
  location fits your preference. Possible gap: the role prefers
  KoboToolbox experience.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 10. Career Intelligence

Career intelligence is a core differentiator, especially for fresh
graduates and early-stage professionals who may lack local career
guidance.

  -----------------------------------------------------------------------
  **Capability**                      **Purpose**
  ----------------------------------- -----------------------------------
  Career direction                    Identify plausible role families
                                      and sectors based on evidence,
                                      preferences, and interests.

  Career pathways                     Suggest realistic next-step roles
                                      rather than only echoing the
                                      current job title.

  Skill-gap analysis                  Identify recurring skills requested
                                      in relevant opportunities that are
                                      absent or weak in the profile.

  Development priorities              Recommend a small number of
                                      high-value improvements instead of
                                      overwhelming the user.

  Career strategy                     Explain which opportunity types the
                                      user should prioritize now.

  Learning connections                Later connect identified gaps to
                                      curated free and paid learning
                                      resources.
  -----------------------------------------------------------------------

## Future learning-resource catalog

A later structured catalog should capture provider, program name, target
skill, fee, currency, duration, availability timeline, delivery format,
location, language, level, certificate option, deadline, financial aid,
and official URL. The interface can present clean clickable cards. This
database should be curated and structured rather than being a collection
of free-form AI recommendations.

# 11. Retention and Frequent-Use Strategy

SINNARA should retain users through useful recurring work, not
artificial gamification.

  -----------------------------------------------------------------------
  **Retention driver**                **Reason to return**
  ----------------------------------- -----------------------------------
  New relevant opportunities          Fresh jobs that genuinely fit the
                                      user.

  Deadline reminders                  Useful alerts for saved or high-fit
                                      opportunities closing soon.

  Profile improvement                 Prompts when a missing or weak
                                      profile element is hurting
                                      recommendation quality.

  Career insights                     Occasional personalized guidance
                                      based on the user's goals and
                                      market demand.

  Application workspace               Future tailored CV/cover-letter
                                      artifacts and history stored by
                                      application.

  Learning recommendations            Future connection between skill
                                      gaps and credible learning
                                      resources.
  -----------------------------------------------------------------------

## Future My Applications workspace

When tailored applications are introduced, the original CV must remain
unchanged. Every tailored CV, cover letter, answer set, and related
artifact should be saved as a separate application-specific version
under a structured My Applications area.

> **•** Target opportunity and organization
>
> **•** Application date
>
> **•** Original profile/CV reference
>
> **•** Tailored CV reference
>
> **•** Cover letter reference
>
> **•** Generated application answers
>
> **•** User notes
>
> **•** External application link
>
> **•** Optional user-entered status
>
> **•** Later: employer-originated status events when an application is
> managed inside SINNARA

  -----------------------------------------------------------------------
  **Versioning rule\
  **Generated application documents belong to the specific application
  that created them. The user's master CV and profile are never silently
  overwritten.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 12. Notification Strategy

WhatsApp is the preferred first-class notification channel for the
Sudan-focused experience. The core notification service must remain
channel-agnostic.

  -----------------------------------------------------------------------
  **Element**                         **Principle**
  ----------------------------------- -----------------------------------
  Frequency                           Instant, daily, twice weekly,
                                      weekly, or off, subject to the
                                      implementation available to the
                                      MVP.

  Relevance threshold                 Optional minimum suitability
                                      threshold to reduce noise.

  Message                             Opportunity title, organization,
                                      location, deadline, short fit
                                      explanation, official link.

  Consent                             Explicit opt-in and clear control
                                      over notification preferences.

  Provider independence               WhatsApp is an integration, not a
                                      core dependency.
  -----------------------------------------------------------------------

# 13. Product Analytics and Behavioral Intelligence

SINNARA should record structured product events to understand how people
use the platform, where they stop, which recommendations create value,
and which workflows need improvement. The purpose is product improvement
and operational intelligence, not unnecessary surveillance.

  -----------------------------------------------------------------------
  **Area**                            **Illustrative events**
  ----------------------------------- -----------------------------------
  Account                             signup_started, signup_completed

  Onboarding                          cv_uploaded, document_uploaded,
                                      extraction_completed,
                                      profile_reviewed

  Discovery                           recommendations_viewed,
                                      opportunity_opened, search_used,
                                      filter_used

  Intent                              opportunity_saved,
                                      official_link_clicked

  Notifications                       sent, clicked, unsubscribed

  Retention                           return_session,
                                      repeated_opportunity_use

  Errors                              processing_failed, matching_failed,
                                      notification_failed
  -----------------------------------------------------------------------

## Admin intelligence

The admin dashboard should eventually surface patterns rather than raw
event logs: onboarding bottlenecks, parsing failures, low-relevance
recommendation patterns, popular job categories, source health, drop-off
points, and unusual spikes in engagement.

  -----------------------------------------------------------------------
  **Privacy boundary\
  **Collect only behavioral data needed for product improvement,
  security, operations, and legitimate analytics. Do not capture
  sensitive attributes merely because the system can.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 14. AI and Cost Architecture Direction

AI is an interpretation layer, not the entire application. The
architecture should minimize repeated inference and keep deterministic
logic outside the model.

  -----------------------------------------------------------------------
  **Task**                            **Preferred mechanism**
  ----------------------------------- -----------------------------------
  Filtering, sorting, deadlines,      Application/database logic
  status                              

  File metadata/storage               Application/database logic

  Document parsing                    Specialized parser where suitable

  Profile extraction                  AI over clean document content

  Job extraction                      AI over normalized posting content

  Skill normalization                 AI + controlled vocabulary

  Matching                            AI-assisted semantic
                                      interpretation + deterministic
                                      ranking

  Career guidance                     AI reasoning over structured
                                      profile and market data

  Future document generation          Dedicated evidence-controlled
                                      generation workflow
  -----------------------------------------------------------------------

## Cost-control rules

> **•** Do not use an LLM for deterministic tasks.
>
> **•** Cache stable AI results and normalized source content.
>
> **•** Use smaller/faster models for extraction and classification when
> quality is sufficient.
>
> **•** Reserve deeper reasoning for tasks where it materially improves
> quality.
>
> **•** Process long-running jobs asynchronously.
>
> **•** Keep an internal AI-provider interface so the initial Gemini
> choice can be replaced later.
>
> **•** Store structured outputs and avoid resending identical documents
> or postings unnecessarily.

# 15. Document Processing Direction

Separate document parsing from AI interpretation. The preferred flow is:
original file -\> validation -\> structural/text extraction -\> AI
interpretation -\> schema/evidence validation -\> user review -\>
approved profile.

  -----------------------------------------------------------------------
  **Step**                **Stage**               **Purpose**
  ----------------------- ----------------------- -----------------------
  1                       Upload                  Securely store original
                                                  file.

  2                       Validate                Check type, size,
                                                  integrity, and basic
                                                  safety constraints.

  3                       Parse                   Convert PDF/DOCX and
                                                  similar files into
                                                  clean text and
                                                  structure.

  4                       Extract                 Convert parsed content
                                                  into structured
                                                  candidate fields.

  5                       Validate                Check schema, required
                                                  fields, evidence, and
                                                  uncertainty.

  6                       Review                  Let user correct or add
                                                  information.

  7                       Store                   Persist approved
                                                  profile plus processing
                                                  metadata.
  -----------------------------------------------------------------------

Open-source parsing candidates such as Docling or Unstructured can be
evaluated during technical architecture work. Selection should be based
on actual CV samples, extraction quality, supported formats, speed,
deployment fit, maintenance burden, and cost.

# 16. Job Ingestion and Data Quality

The opportunity database is the foundation of SINNARA's value. The
initial strategy should maximize trust and usefulness before maximizing
volume.

  -----------------------------------------------------------------------
  **Tier**                **Source type**         **Role**
  ----------------------- ----------------------- -----------------------
  Tier 1                  Official organization   Highest trust
                          career pages /          
                          structured official     
                          sources                 

  Tier 2                  Reliable job boards and Breadth
                          permitted feeds/APIs    

  Tier 3                  Curated social          Discovery; stronger
                          pages/channels and      verification
                          secondary sources       
  -----------------------------------------------------------------------

> **•** Normalize titles, organizations, locations, employment types,
> deadlines, and skills.
>
> **•** Detect duplicates across sources.
>
> **•** Track source check time and opportunity verification time.
>
> **•** Mark expired opportunities and exclude them from active
> recommendations.
>
> **•** Preserve official source links.
>
> **•** Flag unclear deadlines or low-confidence extraction for review.
>
> **•** Prefer primary source information when secondary postings
> conflict.

# 17. Admin and Operations Console

> **•** Opportunity review queue.
>
> **•** Source health and ingestion failure view.
>
> **•** Duplicate review.
>
> **•** Deadline/freshness warnings.
>
> **•** Low-confidence extraction queue.
>
> **•** Manual correction of structured opportunity data.
>
> **•** Processing error visibility.
>
> **•** Basic product funnel and behavior analytics.
>
> **•** Notification delivery monitoring.
>
> **•** Audit trail for sensitive administrative actions.

# 18. Growth and Market Entry Strategy

The idea can be copied at the feature-description level, so market entry
should create advantages through trust, audience habit, data quality,
distribution, relationships, and operational reliability.

  -----------------------------------------------------------------------
  **Growth layer**                    **Role**
  ----------------------------------- -----------------------------------
  Opportunity density                 Become known for consistently
                                      finding useful Sudan-focused
                                      opportunities.

  Trust                               Official links, accurate deadlines,
                                      transparent fit explanations, and
                                      reliable freshness.

  Audience                            Build a career-information
                                      audience, not merely an advertising
                                      audience.

  Distribution                        Use social content, sharing, and
                                      direct acquisition loops.

  Retention                           Personalized recommendations and
                                      alerts that generic job pages
                                      cannot replicate.

  Network effects                     Later connect a strong candidate
                                      base with employers.
  -----------------------------------------------------------------------

## Future social content engine

A later system can use SINNARA opportunity data to identify attractive
or strategically important jobs, create platform-native LinkedIn and
other social content, schedule posts, measure performance, and learn
which opportunity categories attract the right users. It should use
official or permitted platform APIs and connectors where possible rather
than making the product dependent on scraping.

The strongest content should highlight genuinely valuable opportunities,
not generic motivational posts. The call to action should lead to a very
low-friction SINNARA signup and profile-creation flow.

# 19. Global Expansion Readiness

Global expansion is not an MVP feature. It is an architectural
constraint.

> **•** Represent countries, regions, and cities as data entities rather
> than hardcoded Sudan-only logic.
>
> **•** Store currency as a field rather than embedding SDG-specific
> assumptions in code.
>
> **•** Use reusable opportunity and organization models.
>
> **•** Model job sources through adapters/configuration.
>
> **•** Keep AI and notification providers behind service boundaries.
>
> **•** Avoid Sudan-specific table names and business rules where a
> general model is practical.
>
> **•** Keep the user experience and market data Sudan-specific until
> expansion is justified.

  -----------------------------------------------------------------------
  **Architecture rule\
  **Build for Sudan, but never build the code as though Sudan is the only
  country that can ever exist.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 20. Future Employer and Monetization Model

Employer functionality becomes strategically valid after SINNARA has
meaningful candidate momentum and a useful opportunity ecosystem. At
that point, organizations can be offered paid professional profiles and
structured recruitment tools.

> **•** Paid company and organization profiles.
>
> **•** Structured vacancy creation and management.
>
> **•** Candidate search and shortlist generation.
>
> **•** Candidate invite/contact flows with privacy controls.
>
> **•** Application management inside SINNARA.
>
> **•** Employer analytics.
>
> **•** First-party outcome events such as shortlist, interview,
> rejection, offer, and hire.
>
> **•** Later use of first-party outcome data to improve matching, with
> appropriate governance.

This model supports a subscription business after organizations have
experienced value from the candidate pool and workflow. Subscription
pricing should come after demonstrated demand rather than being imposed
at launch.

# 21. Future Application Intelligence and My Applications

Application assistance is an important future retention mechanism. It
should be designed around evidence, relevance, and versioning rather
than generic AI writing.

> **•** Read the user's complete structured profile and the target
> opportunity.
>
> **•** Select only evidence relevant to the target role.
>
> **•** Write in the voice of an experienced recruiter/career writer
> while remaining faithful to the user's actual history.
>
> **•** Produce ATS-compatible documents where appropriate without
> keyword stuffing.
>
> **•** Allow user review and editing before use.
>
> **•** Never overwrite the master CV.
>
> **•** Save every generated version inside the relevant application
> record.

# 22. UX Standards

  -----------------------------------------------------------------------
  **Standard**                        **Expected behavior**
  ----------------------------------- -----------------------------------
  Low friction                        Do not ask users for information
                                      the system can reliably extract.

  Progressive disclosure              Introduce complexity only when
                                      useful.

  Fast feedback                       Confirm actions immediately;
                                      perform heavy operations in
                                      background.

  Recoverability                      A failed job should not destroy
                                      successful prior steps.

  Explainability                      Use simple language to describe
                                      what the system is doing.

  Professional tone                   Clean, direct, authentic English.

  No generic AI tone                  Avoid hype, clichés, vague
                                      marketing language, and mechanical
                                      phrasing.

  No em dash                          Avoid the long dash in
                                      public-facing product copy.

  Mobile-conscious web                A responsive web experience is
                                      required before a native app.
  -----------------------------------------------------------------------

# 23. Privacy, Security, and Trust

> **•** Candidate documents are private user data.
>
> **•** Separate public opportunity data from private candidate
> information.
>
> **•** Use least-privilege access and row-level security patterns in
> the data layer.
>
> **•** Do not expose candidate profiles to employers in the MVP.
>
> **•** Protect stored documents and avoid unnecessary public links.
>
> **•** Maintain auditability for sensitive admin operations.
>
> **•** Retain source provenance for opportunity data.
>
> **•** Do not use sensitive personal characteristics for matching
> simply because they are available.
>
> **•** Design deletion and retention rules before scale.

# 24. MVP Success Metrics

  -----------------------------------------------------------------------
  **Metric**              **Definition**          **Purpose**
  ----------------------- ----------------------- -----------------------
  Activation              \% of signups reaching  Onboarding
                          a usable profile        effectiveness

  Document-to-profile     \% of CV uploads        Extraction quality
  success                 producing a useful      
                          editable profile        

  Time to first           Time from sufficient    Speed and value
  recommendation          onboarding to first     
                          useful matches          

  Recommendation          Positive relevance      Core product quality
  relevance               feedback / engagement   
                          with recommendations    

  Official-link click     \% of viewed            Actionability
  rate                    opportunities leading   
                          to source               

  Save rate               \% of opportunities     Intent
                          saved                   

  7-day return rate       \% of new users         Early retention
                          returning within 7 days 

  Notification click rate \% of alerts producing  Alert quality
                          engagement              

  Processing failure rate \% of processing tasks  Reliability
                          failing                 

  Source freshness        \% of active            Trust
                          opportunities within    
                          freshness standard      
  -----------------------------------------------------------------------

# 25. MVP Delivery Phases

  -------------------------------------------------------------------------
  **Phase**         **Theme**         **Work**            **Exit
                                                          condition**
  ----------------- ----------------- ------------------- -----------------
  0                 Foundation        Product/technical   Approved
                                      blueprint,          foundation
                                      architecture, data  
                                      model, AI           
                                      boundaries,         
                                      security, Claude    
                                      project structure   

  1                 Candidate         Auth, upload,       User can create
                    onboarding        parsing, AI         profile from
                                      extraction,         documents
                                      editable profile    

  2                 Opportunity       Initial sources,    Trustworthy job
                    intelligence      normalization,      dataset
                                      extraction,         
                                      deduplication,      
                                      freshness, admin    
                                      review              

  3                 Matching          Eligibility,        Relevant
                                      preference,         recommendations
                                      semantic fit,       
                                      explanations,       
                                      recommendation feed 

  4                 Discovery and     Search, filters,    Actionable repeat
                    alerts            saves, notification use
                                      preferences, first  
                                      notification        
                                      pathway             

  5                 Career            Career direction,   Value beyond
                    intelligence      skill gaps,         listings
                                      market-aware        
                                      guidance            

  6                 Optimization      Analytics,          Stable MVP
                                      performance, source 
                                      expansion,          
                                      reliability         
                                      hardening           
  -------------------------------------------------------------------------

# 26. Testing Strategy

> **•** Document tests using varied real-world CV and certificate
> formats.
>
> **•** Job tests using realistic Sudan-focused vacancy examples from
> different source types.
>
> **•** Matching tests with human-reviewed candidate/job pairs.
>
> **•** UX tests with first-time users completing onboarding and finding
> an opportunity.
>
> **•** Failure tests for corrupt files, duplicates, missing deadlines,
> source failures, API failures, partial processing, and notification
> failures.
>
> **•** Cost tests covering AI calls, token use, cache hit rates,
> processing time, storage growth, and workflow volume.

# 27. Claude Code Working Model

Claude Pro + Claude Code should be the primary implementation
environment. Claude should operate as a technical partner, not simply an
executor.

> **•** Understand and respect the product blueprint before implementing
> features.
>
> **•** Challenge assumptions when a simpler, safer, cheaper, or more
> maintainable solution exists.
>
> **•** Preserve the Sudan-first scope.
>
> **•** Avoid speculative overengineering.
>
> **•** Record important architecture decisions.
>
> **•** Verify current vendor capabilities, pricing, limits, and API
> terms before major dependency decisions.
>
> **•** Prefer authoritative documentation for external services.
>
> **•** Maintain tests, error handling, logging, and clear interfaces as
> part of implementation.
>
> **•** Use modular project memory and task-specific Skills rather than
> enormous repeated prompts.

# 28. Project Memory Direction

The Claude project should use a small always-loaded instruction file
plus modular documentation and reusable Skills. The entire blueprint
should not be pasted into every prompt.

  -----------------------------------------------------------------------
  **Area**                            **Purpose**
  ----------------------------------- -----------------------------------
  CLAUDE.md                           Permanent project constitution:
                                      vision, principles, scope, quality,
                                      security, decision behavior.

  docs/product/                       Blueprint, requirements, user
                                      journeys, UX principles.

  docs/architecture/                  System architecture, data model, AI
                                      boundaries, security, deployment.

  docs/decisions/                     Architecture decision records and
                                      rationale.

  .claude/skills/                     Reusable workflows such as database
                                      design, matching, document
                                      processing, testing, UX review, and
                                      marketing.
  -----------------------------------------------------------------------

# 29. Current Tooling Policy

Tool capabilities and pricing change frequently. Before each major
implementation decision, current official documentation should be
checked for free-tier limits, API availability, policy changes, quotas,
storage, and commercial-use constraints. SINNARA should prefer free and
open-source components during MVP where they are technically sound.

> **•** Claude Pro + Claude Code for implementation.
>
> **•** GitHub for version control.
>
> **•** Next.js/React for the web application.
>
> **•** Supabase for PostgreSQL, authentication and storage where the
> current free tier fits MVP usage.
>
> **•** Vercel or another suitable free development deployment path,
> re-verified before launch.
>
> **•** Gemini or another suitable low-cost/free-tier model as the
> initial AI provider behind an abstraction layer.
>
> **•** Open-source document parsing candidates such as Docling or
> Unstructured, validated against actual CVs.
>
> **•** A lightweight workflow/orchestration tool only if it reduces
> operational complexity and remains free at MVP scale.
>
> **•** Official WhatsApp Business / compliant provider path for
> notifications, subject to current availability and cost.

# 30. Decisions Locked for Future Documents

> **1.** Product name: SINNARA.
>
> **2.** Initial language: English only.
>
> **3.** Initial market: Sudan only.
>
> **4.** Architecture: globally extensible, Sudan-specific product.
>
> **5.** Onboarding: upload CV/certificates first, AI extraction second,
> user review third.
>
> **6.** Opportunity model: generalized Opportunity entity including
> temporary and seasonal work.
>
> **7.** Career intelligence: core differentiator.
>
> **8.** WhatsApp: preferred first-class notification channel with
> user-controlled frequency and relevance settings.
>
> **9.** Employer marketplace: future phase, not MVP dependency.
>
> **10.** Paid organization profiles: future monetization after
> candidate momentum.
>
> **11.** Application history and tailored document versions: future
> retention feature with immutable original CV.
>
> **12.** Behavior analytics: stored and summarized for continuous
> product improvement with privacy boundaries.
>
> **13.** Social content automation: future acquisition engine;
> opportunity data can feed it.
>
> **14.** AI providers and third-party integrations: replaceable,
> current facts re-verified before implementation.
>
> **15.** Claude Code: implementation partner with persistent project
> memory and reusable Skills.
>
> **16.** MVP priority: smoothness, speed, accuracy, reliability, and
> low operating cost over feature count.

# 31. Next Documents and Work Sequence

This blueprint is the product foundation. The next documents should
convert it into implementable architecture without prematurely writing
code.

> **1.** SINNARA Technical Architecture
>
> **2.** SINNARA Data Model
>
> **3.** SINNARA AI and Automation Architecture
>
> **4.** SINNARA UX Specification
>
> **5.** SINNARA MVP Roadmap and Test Plan
>
> **6.** Claude project memory structure
>
> **7.** Master CLAUDE.md
>
> **8.** Phase 1 implementation prompt

  -----------------------------------------------------------------------
  **Recommended rule\
  **Do not ask Claude to start building the application until the
  foundation documents above are coherent enough that the codebase can be
  implemented against stable boundaries.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# Appendix A. Product Vocabulary

  -----------------------------------------------------------------------
  **Term**                            **Meaning**
  ----------------------------------- -----------------------------------
  Candidate                           A person using SINNARA to explore
                                      and act on career opportunities.

  Opportunity                         A job or other career-related
                                      opportunity represented in the
                                      normalized platform model.

  Organization                        An employer or institution
                                      associated with opportunities.

  Match                               A structured relationship between a
                                      candidate and an opportunity
                                      explaining suitability.

  Career Intelligence                 Personalized interpretation of
                                      career direction, market fit, skill
                                      gaps, and next steps.

  My Applications                     Future application history where
                                      generated files and user activity
                                      are stored by opportunity.

  Evidence                            Source information supporting a
                                      candidate claim or opportunity
                                      attribute.

  Provenance                          The source and freshness
                                      information showing where an
                                      opportunity came from and when it
                                      was last verified.
  -----------------------------------------------------------------------
