"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  cities,
  fields,
  jobs,
  filterJobs,
  skillLabels,
  type Locale,
  type City,
  type Field,
} from "@/lib/jobs";
import { Icon, type IconName } from "./icons";
import { JobCard } from "./job-card";

type View = "browse" | "saved" | "profile";
type Route = {
  view: View;
  q: string;
  city: string;
  field: string;
  closed: boolean;
  job: string;
  state: string;
};
type Profile = {
  city: string;
  field: string;
  experience: string;
  skills: string[];
  relocate: boolean;
};
const emptyRoute: Route = {
  view: "browse",
  q: "",
  city: "",
  field: "",
  closed: false,
  job: "",
  state: "",
};
const emptyProfile: Profile = {
  city: "",
  field: "",
  experience: "",
  skills: [],
  relocate: false,
};
const SAVE_KEY = "sinnara-demo-saved-v1";
function readRoute(): Route {
  const p = new URLSearchParams(window.location.search);
  const view = p.get("view");
  return {
    view: view === "saved" || view === "profile" ? view : "browse",
    q: p.get("q")?.slice(0, 160) || "",
    city: Object.hasOwn(cities, p.get("city") || "") ? p.get("city")! : "",
    field: Object.hasOwn(fields, p.get("field") || "") ? p.get("field")! : "",
    closed: p.get("closed") === "1",
    job: p.get("job") || "",
    state: p.get("state") || "",
  };
}
function query(route: Route) {
  const p = new URLSearchParams();
  if (route.view !== "browse") p.set("view", route.view);
  for (const key of ["q", "city", "field", "job", "state"] as const)
    if (route[key]) p.set(key, route[key]);
  if (route.closed) p.set("closed", "1");
  return p.size ? "?" + p.toString() : "";
}
function ordinaryClick(e: MouseEvent<HTMLAnchorElement>) {
  return !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0;
}

export function JobExplorer({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const [route, setRoute] = useState<Route>(emptyRoute);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState("");
  const [applied, setApplied] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setRoute(readRoute());
    try {
      const data: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
      if (Array.isArray(data))
        setSaved(
          data.filter(
            (id): id is string =>
              typeof id === "string" && jobs.some((j) => j.id === id),
          ),
        );
    } catch {
      /* Storage is optional; browsing remains available. */
    }
    const online = () => setOffline(!navigator.onLine);
    const pop = () => {
      setRoute(readRoute());
      setApplied(false);
      mainRef.current?.focus();
    };
    online();
    setReady(true);
    window.addEventListener("online", online);
    window.addEventListener("offline", online);
    window.addEventListener("popstate", pop);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", online);
      window.removeEventListener("popstate", pop);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const href = (patch: Partial<Route>) =>
    "/" + locale + "/" + query({ ...route, ...patch });
  const go = (patch: Partial<Route>, replace = false) => {
    const next = { ...route, ...patch };
    setRoute(next);
    setApplied(false);
    setNotice("");
    window.history[replace ? "replaceState" : "pushState"](
      {},
      "",
      "/" + locale + "/" + query(next),
    );
    if (!replace) {
      window.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus();
    }
  };
  const follow =
    (patch: Partial<Route>) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (ordinaryClick(e)) {
        e.preventDefault();
        go(patch);
      }
    };
  const toggleSaved = (id: string) => {
    const next = saved.includes(id)
      ? saved.filter((value) => value !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      setNotice(
        next.includes(id)
          ? t("Saved on this browser.", "حُفظت في هذا المتصفح.")
          : t("Removed from saved jobs.", "أُزيلت من الوظائف المحفوظة."),
      );
    } catch {
      setNotice(
        t(
          "Saved for this visit only. Browser storage is unavailable.",
          "حُفظت لهذه الزيارة فقط. التخزين في المتصفح غير متاح.",
        ),
      );
    }
  };
  const clearFilters = () =>
    go({ q: "", city: "", field: "", closed: false }, true);
  const job = jobs.find((item) => item.id === route.job);
  const filtered =
    route.view === "saved"
      ? jobs.filter((item) => saved.includes(item.id))
      : filterJobs(route.q, route.city, route.field, route.closed);
  const loading = !ready || route.state === "loading";
  const error = route.state === "error";
  const isOffline = offline || route.state === "offline";
  const nav: { view: View; icon: IconName; text: string }[] = [
    {
      view: "browse",
      icon: "search",
      text: t("Explore jobs", "تصفّح الوظائف"),
    },
    {
      view: "saved",
      icon: "bookmark",
      text: t("Saved jobs", "الوظائف المحفوظة"),
    },
    { view: "profile", icon: "user", text: t("My profile", "ملفي") },
  ];
  const fieldOptions = Object.entries(fields);
  const cityOptions = Object.entries(cities);
  const deadline = (date: string) =>
    new Intl.DateTimeFormat(ar ? "ar-SD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date + "T12:00:00Z"));

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        {t("Skip to content", "انتقل إلى المحتوى")}
      </a>
      <header className="site-header">
        <a
          href={"/" + locale + "/"}
          className="brand"
          aria-label={t("Sinnara home", "الصفحة الرئيسية لسنارة")}
        >
          <img src="/favicon.svg" width="36" height="36" alt="" />
          <span>
            {ar ? "سنارة" : "sinnara"}
            <span className="brand-dot">.</span>
          </span>
        </a>
        <div className="header-right">
          <span className="prototype-tag">
            {t("EARLY PREVIEW", "نسخة تجريبية")}
          </span>
          <a
            className="language-button"
            href={"/" + (ar ? "en" : "ar") + "/" + query(route)}
            lang={ar ? "en" : "ar"}
          >
            <Icon name="globe" />
            {ar ? "English" : "العربية"}
          </a>
        </div>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <p className="sidebar-label">{t("YOUR WORKSPACE", "مساحتك")}</p>
          <nav aria-label={t("Main navigation", "التنقل الرئيسي")}>
            {nav.map((item) => (
              <a
                key={item.view}
                className={
                  "nav-item " + (route.view === item.view ? "active" : "")
                }
                href={href({ view: item.view, job: "", state: "" })}
                onClick={follow({ view: item.view, job: "", state: "" })}
                aria-current={route.view === item.view ? "page" : undefined}
              >
                <Icon name={item.icon} />
                <span>{item.text}</span>
                {item.view === "saved" && saved.length > 0 && (
                  <span className="count">{saved.length}</span>
                )}
              </a>
            ))}
          </nav>
          <div className="sidebar-note">
            <div className="note-line" />
            <p>{t("Built around work in Sudan.", "مصممة للعمل في السودان.")}</p>
            <span>
              {t(
                "Read vacancies in Arabic or English and keep the ones you want to revisit.",
                "بالعربية والإنجليزية، مع متطلبات واضحة وإمكانية الرجوع إلى الوظائف لاحقاً.",
              )}
            </span>
          </div>
          <div className="sidebar-footer">
            SINNARA <span>© 2026</span>
          </div>
        </aside>
        <main id="main" tabIndex={-1} ref={mainRef}>
          <div className="demo-banner">
            <span className="status-dot" aria-hidden="true" />
            <p>
              {t(
                "You’re exploring a prototype. All vacancies and employers are fictional. No applications are sent.",
                "أنت تتصفح نموذجاً تجريبياً. جميع الوظائف وجهات العمل افتراضية، ولا تُرسَل أي طلبات توظيف.",
              )}
            </p>
          </div>
          {isOffline && (
            <div className="notice warning" role="status">
              {t(
                "You’re offline. Sample jobs already loaded on this page remain available. New pages may not open.",
                "أنت غير متصل بالإنترنت. يمكنك تصفح الأمثلة المحمّلة في هذه الصفحة، وقد لا تُفتح صفحات جديدة.",
              )}
            </div>
          )}
          <div className="live-status" role="status" aria-live="polite">
            {notice}
          </div>

          {route.job ? (
            job ? (
              <section className="detail">
                <a
                  className="back-link"
                  href={href({ job: "" })}
                  onClick={follow({ job: "" })}
                >
                  <Icon name="arrow" />
                  {route.view === "saved"
                    ? t("Back to saved jobs", "العودة إلى المحفوظات")
                    : t("Back to results", "العودة إلى النتائج")}
                </a>
                <div className="detail-title">
                  <div>
                    <p className="eyebrow">
                      {fields[job.field][locale]} /{" "}
                      {t("SAMPLE VACANCY", "وظيفة افتراضية")}
                    </p>
                    <h1>{job.title[locale]}</h1>
                    <p>{job.employer[locale]}</p>
                  </div>
                  <button
                    className={
                      "secondary " + (saved.includes(job.id) ? "is-saved" : "")
                    }
                    aria-pressed={saved.includes(job.id)}
                    onClick={() => toggleSaved(job.id)}
                  >
                    <Icon name="bookmark" />
                    {saved.includes(job.id)
                      ? t("Saved", "محفوظة")
                      : t("Save job", "حفظ الوظيفة")}
                  </button>
                </div>
                {job.closed && (
                  <div className="notice warning">
                    {t(
                      "This example vacancy is closed. You can still read its requirements.",
                      "هذه الوظيفة الافتراضية مغلقة. لا يزال بإمكانك قراءة متطلباتها.",
                    )}
                  </div>
                )}
                <div className="detail-grid">
                  <div className="detail-body">
                    <section>
                      <h2>{t("About the role", "عن الوظيفة")}</h2>
                      <p>{job.summary[locale]}</p>
                    </section>
                    <section>
                      <h2>{t("What you would do", "المهام")}</h2>
                      <ul>
                        {job.responsibilities.map((item, i) => (
                          <li key={i}>{item[locale]}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h2>{t("What you would need", "المتطلبات")}</h2>
                      <ul>
                        {job.requirements.map((item, i) => (
                          <li key={i}>{item[locale]}</li>
                        ))}
                      </ul>
                    </section>
                    <section className="guidance">
                      <span className="eyebrow">
                        {t("PREPARING TO APPLY", "الاستعداد للتقديم")}
                      </span>
                      <h2>
                        {t(
                          "Check the requirements against your experience",
                          "قارن المتطلبات بخبرتك",
                        )}
                      </h2>
                      <p>
                        {t(
                          "Use a specific example of relevant work in your CV. Include informal or self-employed work when it demonstrates the required skill.",
                          "اذكر في سيرتك مثالاً محدداً من خبرتك المرتبطة بالوظيفة. ويمكنك تضمين العمل الحر أو غير الرسمي إذا كان يوضّح المهارة المطلوبة.",
                        )}
                      </p>
                      {profileSaved ? (
                        <>
                          <p>
                            {t(
                              "Skills you selected that also appear in this example:",
                              "المهارات التي اخترتها والمذكورة في هذا المثال:",
                            )}
                          </p>
                          <div className="tags">
                            {job.skills.filter((s) =>
                              profile.skills.includes(s),
                            ).length ? (
                              job.skills
                                .filter((s) => profile.skills.includes(s))
                                .map((s) => (
                                  <span key={s}>
                                    <Icon name="check" />
                                    {skillLabels[s][locale]}
                                  </span>
                                ))
                            ) : (
                              <span>
                                {t(
                                  "No shared skills selected yet",
                                  "لم تختر مهارات مشتركة بعد",
                                )}
                              </span>
                            )}
                          </div>
                          <p className="small">
                            {t(
                              "This is a direct comparison of selected skills, not an AI assessment or hiring recommendation.",
                              "هذه مقارنة مباشرة للمهارات المختارة، وليست تقييماً بالذكاء الاصطناعي أو توصية توظيف.",
                            )}
                          </p>
                        </>
                      ) : (
                        <a
                          className="text-link"
                          href={href({ view: "profile", job: "" })}
                          onClick={follow({ view: "profile", job: "" })}
                        >
                          {t("Try a sample profile", "جرّب إعداد ملف تجريبي")}
                          <Icon name="arrow" />
                        </a>
                      )}
                    </section>
                  </div>
                  <aside className="facts-panel">
                    <h2>{t("At a glance", "تفاصيل سريعة")}</h2>
                    <dl>
                      <div>
                        <dt>{t("Location", "الموقع")}</dt>
                        <dd>{cities[job.city][locale]}</dd>
                      </div>
                      <div>
                        <dt>{t("Working arrangement", "نظام العمل")}</dt>
                        <dd>{job.work[locale]}</dd>
                      </div>
                      <div>
                        <dt>{t("Pay and currency", "الراتب والعملة")}</dt>
                        <dd>
                          {t(
                            "Not specified in this example",
                            "غير محددين في هذا المثال",
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>{t("Example deadline", "موعد تجريبي للإغلاق")}</dt>
                        <dd>{deadline(job.deadline)}</dd>
                      </div>
                      <div>
                        <dt>{t("Source", "المصدر")}</dt>
                        <dd>
                          {t("Sinnara demo data", "بيانات سنارة التجريبية")}
                        </dd>
                      </div>
                    </dl>
                    <button
                      className="primary full-width"
                      disabled={!!job.closed}
                      onClick={() => setApplied(true)}
                    >
                      {job.closed
                        ? t("Applications closed", "التقديم مغلق")
                        : t("Preview application step", "معاينة خطوة التقديم")}
                      <Icon name="arrow" />
                    </button>
                    {applied && (
                      <p className="notice" role="status">
                        {t(
                          "In the live service, this step would open the employer’s original application channel. Nothing has been sent.",
                          "في الخدمة الفعلية، ستفتح هذه الخطوة قناة التقديم الأصلية لصاحب العمل. لم يُرسَل أي طلب.",
                        )}
                      </p>
                    )}
                    <p className="small">
                      {t(
                        "Never pay a fee to apply. Confirm the employer and application channel before sharing documents.",
                        "لا تدفع رسوماً للتقديم. تحقّق من صاحب العمل وقناة التقديم قبل مشاركة مستنداتك.",
                      )}
                    </p>
                  </aside>
                </div>
              </section>
            ) : (
              <section className="empty-state">
                <Icon name="briefcase" />
                <h1>{t("Vacancy not found", "الوظيفة غير موجودة")}</h1>
                <p>
                  {t(
                    "This link does not match a sample vacancy.",
                    "هذا الرابط لا يشير إلى وظيفة ضمن الأمثلة.",
                  )}
                </p>
                <button className="primary" onClick={() => go({ job: "" })}>
                  {t("Browse jobs", "تصفّح الوظائف")}
                </button>
              </section>
            )
          ) : route.view === "profile" ? (
            <section>
              <div className="page-heading">
                <p className="eyebrow">{t("YOUR EXPERIENCE", "خبرتك")}</p>
                <h1>{t("Your work preferences.", "عرّفنا على خبرتك.")}</h1>
                <p>
                  {t(
                    "Try a sample profile to compare skills with a vacancy. Use example information only.",
                    "جرّب إعداد ملف لمقارنة المهارات بمتطلبات الوظيفة. استخدم معلومات افتراضية فقط.",
                  )}
                </p>
              </div>
              <div className="profile-grid">
                <form
                  className="profile-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setProfileSaved(true);
                    setNotice(
                      t(
                        "Sample profile updated for this visit.",
                        "حُدّث الملف التجريبي لهذه الزيارة.",
                      ),
                    );
                  }}
                >
                  <h2>{t("Work preferences", "تفضيلات العمل")}</h2>
                  <div className="form-grid">
                    <label>
                      {t("Preferred field", "المجال المفضل")}
                      <select
                        value={profile.field}
                        onChange={(e) => {
                          setProfile({ ...profile, field: e.target.value });
                          setProfileSaved(false);
                        }}
                      >
                        <option value="">
                          {t("Choose a field", "اختر المجال")}
                        </option>
                        {fieldOptions.map(([id, label]) => (
                          <option value={id} key={id}>
                            {label[locale]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("Preferred location", "الموقع المفضل")}
                      <select
                        value={profile.city}
                        onChange={(e) => {
                          setProfile({ ...profile, city: e.target.value });
                          setProfileSaved(false);
                        }}
                      >
                        <option value="">
                          {t("Choose a location", "اختر الموقع")}
                        </option>
                        {cityOptions.map(([id, label]) => (
                          <option value={id} key={id}>
                            {label[locale]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    {t("Relevant experience", "الخبرة ذات الصلة")}
                    <select
                      value={profile.experience}
                      onChange={(e) => {
                        setProfile({ ...profile, experience: e.target.value });
                        setProfileSaved(false);
                      }}
                    >
                      <option value="">
                        {t("Choose experience level", "اختر مستوى الخبرة")}
                      </option>
                      <option value="0">
                        {t("Starting out", "بداية المسار المهني")}
                      </option>
                      <option value="1">
                        {t("1–2 years", "سنة إلى سنتين")}
                      </option>
                      <option value="3">
                        {t("3–5 years", "ثلاث إلى خمس سنوات")}
                      </option>
                      <option value="6">
                        {t("6+ years", "ست سنوات فأكثر")}
                      </option>
                    </select>
                  </label>
                  <fieldset>
                    <legend>{t("Skills to compare", "مهارات للمقارنة")}</legend>
                    <p className="small">
                      {t(
                        "Choose the skills to include in this example.",
                        "اختر المهارات التي تريد تضمينها في هذا المثال.",
                      )}
                    </p>
                    <div className="skill-options">
                      {Object.entries(skillLabels).map(([id, label]) => (
                        <label
                          key={id}
                          className={
                            profile.skills.includes(id) ? "selected" : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={profile.skills.includes(id)}
                            onChange={() => {
                              setProfile({
                                ...profile,
                                skills: profile.skills.includes(id)
                                  ? profile.skills.filter((s) => s !== id)
                                  : [...profile.skills, id],
                              });
                              setProfileSaved(false);
                            }}
                          />
                          {label[locale]}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={profile.relocate}
                      onChange={(e) => {
                        setProfile({ ...profile, relocate: e.target.checked });
                        setProfileSaved(false);
                      }}
                    />
                    {t(
                      "Open to discussing work in another city",
                      "مستعد لمناقشة العمل في مدينة أخرى",
                    )}
                  </label>
                  <p className="small">
                    {t(
                      "This preference does not imply that relocation is safe or that housing or transport is available.",
                      "هذا التفضيل لا يعني أن الانتقال آمن أو أن السكن والمواصلات متاحان.",
                    )}
                  </p>
                  <div className="form-actions">
                    <button className="primary" type="submit">
                      {t("Use sample profile", "استخدام الملف التجريبي")}
                    </button>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => {
                        setProfile(emptyProfile);
                        setProfileSaved(false);
                        setNotice(
                          t("Sample profile cleared.", "مُسح الملف التجريبي."),
                        );
                      }}
                    >
                      {t("Clear profile", "مسح الملف")}
                    </button>
                  </div>
                  {profileSaved && (
                    <div className="notice">
                      <Icon name="check" />
                      <span>
                        {t(
                          "Profile ready for this visit.",
                          "الملف جاهز لهذه الزيارة.",
                        )}{" "}
                        <a
                          className="text-link"
                          href={href({
                            view: "browse",
                            city: profile.city,
                            field: profile.field,
                            q: "",
                            closed: false,
                          })}
                          onClick={follow({
                            view: "browse",
                            city: profile.city,
                            field: profile.field,
                            q: "",
                            closed: false,
                          })}
                        >
                          {t(
                            "Browse with these preferences",
                            "تصفّح بهذه التفضيلات",
                          )}
                        </a>
                      </span>
                    </div>
                  )}
                </form>
                <aside className="profile-note">
                  <span className="section-number">01</span>
                  <h2>
                    {t("Your experience, in your words.", "خبرتك كما تعرفها.")}
                  </h2>
                  <p>
                    {t(
                      "A useful profile can include experience from a shop, a family business or freelance work. A formal job title is not the only way to describe what you can do.",
                      "قد تشمل الخبرة العمل في متجر أو مشروع عائلي أو العمل الحر. المسمى الوظيفي الرسمي ليس الطريقة الوحيدة لوصف ما تستطيع فعله.",
                    )}
                  </p>
                  <hr />
                  <h3>{t("Only for this visit", "لهذه الزيارة فقط")}</h3>
                  <p className="small">
                    {t(
                      "This profile stays in memory and clears when you reload, change language or leave. No name, CV or contact details are collected.",
                      "يبقى هذا الملف في الذاكرة ويُمسَح عند إعادة التحميل أو تغيير اللغة أو المغادرة. لا نجمع الاسم أو السيرة الذاتية أو بيانات الاتصال.",
                    )}
                  </p>
                </aside>
              </div>
            </section>
          ) : (
            <section>
              <div className="page-heading">
                <p className="eyebrow">
                  {route.view === "saved"
                    ? t("YOUR SHORTLIST", "قائمتك المختصرة")
                    : t("WORK IN SUDAN", "العمل في السودان")}
                </p>
                <h1>
                  {route.view === "saved"
                    ? t("Your saved jobs.", "وظائف للرجوع إليها.")
                    : t("Explore jobs in Sudan.", "تصفّح الوظائف في السودان.")}
                </h1>
                <p>
                  {route.view === "saved"
                    ? t(
                        "Saved on this browser, without an account. Clear them when using a shared device.",
                        "محفوظة في هذا المتصفح دون حساب. امسحها عند استخدام جهاز مشترك.",
                      )
                    : t(
                        "See the location, requirements and application route before deciding what to pursue.",
                        "اطّلع على الموقع والمتطلبات وطريقة التقديم قبل اختيار الوظيفة المناسبة لك.",
                      )}
                </p>
              </div>
              {route.view === "browse" && (
                <>
                  <div className="search-panel">
                    <label className="search-field">
                      <span className="sr-only">
                        {t("Search jobs", "ابحث عن وظيفة")}
                      </span>
                      <Icon name="search" />
                      <input
                        type="search"
                        value={route.q}
                        maxLength={160}
                        placeholder={t(
                          "Job title, field or location",
                          "المسمى الوظيفي أو المجال أو الموقع",
                        )}
                        onChange={(e) => go({ q: e.target.value }, true)}
                      />
                    </label>
                    <label className="location-field">
                      <span className="sr-only">{t("Location", "الموقع")}</span>
                      <Icon name="pin" />
                      <select
                        value={route.city}
                        onChange={(e) => go({ city: e.target.value }, true)}
                      >
                        <option value="">
                          {t("All locations", "كل المواقع")}
                        </option>
                        {cityOptions.map(([id, label]) => (
                          <option value={id} key={id}>
                            {label[locale]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div
                    className="category-row"
                    role="group"
                    aria-label={t("Filter by field", "تصفية حسب المجال")}
                  >
                    <button
                      className={!route.field ? "selected" : ""}
                      aria-pressed={!route.field}
                      onClick={() => go({ field: "" }, true)}
                    >
                      {t("All fields", "كل المجالات")}
                    </button>
                    {fieldOptions.map(([id, label]) => (
                      <button
                        key={id}
                        className={route.field === id ? "selected" : ""}
                        aria-pressed={route.field === id}
                        onClick={() => go({ field: id }, true)}
                      >
                        {label[locale]}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="results-layout">
                <div className="results-main">
                  <div className="results-heading">
                    <h2 aria-live="polite">
                      {loading
                        ? t("Loading samples…", "جارٍ تحميل الأمثلة…")
                        : t(
                            filtered.length +
                              " sample " +
                              (filtered.length === 1 ? "vacancy" : "vacancies"),
                            filtered.length === 0
                              ? "لا توجد وظائف افتراضية"
                              : filtered.length === 1
                                ? "وظيفة افتراضية واحدة"
                                : filtered.length === 2
                                  ? "وظيفتان افتراضيتان"
                                  : filtered.length + " وظائف افتراضية",
                          )}
                    </h2>
                    {route.view === "browse" ? (
                      <label className="check-label">
                        <input
                          type="checkbox"
                          checked={route.closed}
                          onChange={(e) =>
                            go({ closed: e.target.checked }, true)
                          }
                        />
                        {t("Show closed", "إظهار المغلقة")}
                      </label>
                    ) : (
                      saved.length > 0 && (
                        <button
                          className="text-button"
                          onClick={() => {
                            setSaved([]);
                            try {
                              localStorage.removeItem(SAVE_KEY);
                            } catch {}
                            setNotice(
                              t(
                                "Saved jobs cleared from this browser.",
                                "مُسحت الوظائف المحفوظة من هذا المتصفح.",
                              ),
                            );
                          }}
                        >
                          {t("Clear saved jobs", "مسح المحفوظات")}
                        </button>
                      )
                    )}
                  </div>
                  {route.view === "browse" &&
                    (route.q || route.city || route.field) && (
                      <div className="active-filters">
                        <span>
                          {[
                            route.q,
                            route.city
                              ? cities[route.city as City][locale]
                              : "",
                            route.field
                              ? fields[route.field as Field][locale]
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        <button className="text-button" onClick={clearFilters}>
                          {t("Clear filters", "مسح التصفية")}
                          <Icon name="close" />
                        </button>
                      </div>
                    )}
                  {error ? (
                    <div className="empty-state" role="alert">
                      <h2>
                        {t(
                          "We couldn’t load the results.",
                          "تعذّر تحميل النتائج.",
                        )}
                      </h2>
                      <p>
                        {t(
                          "This is a simulated error for the prototype. Your saved jobs have not changed.",
                          "هذا خطأ تجريبي لعرض الحالة. لم تتغير وظائفك المحفوظة.",
                        )}
                      </p>
                      <button
                        className="primary"
                        onClick={() => go({ state: "" }, true)}
                      >
                        {t("Try again", "حاول مرة أخرى")}
                      </button>
                    </div>
                  ) : loading ? (
                    <div
                      aria-busy="true"
                      aria-label={t("Loading vacancies", "تحميل الوظائف")}
                      className="job-list"
                    >
                      {[0, 1, 2].map((i) => (
                        <div className="skeleton-card" key={i}>
                          <div />
                          <div />
                          <div />
                        </div>
                      ))}
                      {route.state === "loading" && (
                        <button
                          className="secondary"
                          onClick={() => go({ state: "" }, true)}
                        >
                          {t("Finish loading preview", "إنهاء معاينة التحميل")}
                        </button>
                      )}
                    </div>
                  ) : filtered.length ? (
                    <div className="job-list">
                      {filtered.map((item) => (
                        <JobCard
                          key={item.id}
                          job={item}
                          locale={locale}
                          saved={saved.includes(item.id)}
                          onSave={() => toggleSaved(item.id)}
                          href={href({ job: item.id })}
                          onOpen={follow({ job: item.id })}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Icon
                        name={route.view === "saved" ? "bookmark" : "search"}
                      />
                      <h2>
                        {route.view === "saved"
                          ? t("No saved jobs yet.", "ابدأ قائمتك المختصرة.")
                          : t(
                              "No samples match these filters.",
                              "لا توجد أمثلة تطابق هذه التصفية.",
                            )}
                      </h2>
                      <p>
                        {route.view === "saved"
                          ? t(
                              "Use the bookmark on any vacancy to find it here later.",
                              "استخدم علامة الحفظ بجانب أي وظيفة للرجوع إليها هنا لاحقاً.",
                            )
                          : t(
                              "Try another location or remove a filter. You can also search in Arabic or English.",
                              "جرّب موقعاً آخر أو أزل أحد خيارات التصفية. يمكنك البحث بالعربية أو الإنجليزية.",
                            )}
                      </p>
                      <button
                        className="primary"
                        onClick={() =>
                          route.view === "saved"
                            ? go({ view: "browse" })
                            : clearFilters()
                        }
                      >
                        {route.view === "saved"
                          ? t("Explore jobs", "تصفّح الوظائف")
                          : t("Clear filters", "مسح التصفية")}
                      </button>
                    </div>
                  )}
                </div>
                <aside className="discovery-rail">
                  <div className="guide-card">
                    <span className="section-number">
                      01 / {t("GET STARTED", "ابدأ هنا")}
                    </span>
                    <div className="line-art" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <h2>
                      {t(
                        "Make your experience easier to see.",
                        "وضّح خبرتك لصاحب العمل.",
                      )}
                    </h2>
                    <p>
                      {t(
                        "Try a simple profile and compare the skills you select with a vacancy’s requirements.",
                        "جرّب ملفاً بسيطاً وقارن المهارات التي تختارها بمتطلبات الوظيفة.",
                      )}
                    </p>
                    <a
                      className="text-link"
                      href={href({ view: "profile", job: "" })}
                      onClick={follow({ view: "profile", job: "" })}
                    >
                      {t("Try a sample profile", "جرّب ملفاً تجريبياً")}
                      <Icon name="arrow" />
                    </a>
                  </div>
                  <div className="plain-note">
                    <h3>{t("Before you apply", "قبل التقديم")}</h3>
                    <p>
                      {t(
                        "Check the work location and pay currency. Ask about transport or housing if moving is involved.",
                        "تحقّق من موقع العمل وعملة الراتب. اسأل عن المواصلات أو السكن إذا تطلّب العمل الانتقال.",
                      )}
                    </p>
                    <p className="small">
                      {t(
                        "Sinnara will link to the original application channel. The prototype does not accept CVs.",
                        "ستربط سنارة بقناة التقديم الأصلية. النموذج التجريبي لا يستقبل السير الذاتية.",
                      )}
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          )}
          <footer className="content-footer">
            <span>
              {t(
                "Jobs and application guidance for Sudan.",
                "وظائف وإرشادات التقديم في السودان.",
              )}
            </span>
            <details>
              <summary>{t("About this preview", "عن هذه النسخة")}</summary>
              <div className="preview-notes">
                <p>
                  {t(
                    "Design preview only. No live listings, accounts, AI service or application submission. Dates and status are fixed examples, not current vacancies. Saved vacancy IDs stay in this browser until cleared.",
                    "نسخة لمراجعة التصميم فقط. لا توجد إعلانات فعلية أو حسابات أو خدمة ذكاء اصطناعي أو إرسال طلبات. التواريخ والحالات أمثلة ثابتة. تبقى معرّفات الوظائف المحفوظة في هذا المتصفح حتى مسحها.",
                  )}
                </p>
                <p>{t("Review example states:", "معاينة الحالات:")}</p>
                <div className="state-links">
                  {["offline", "error", "loading"].map((state) => (
                    <a
                      key={state}
                      href={href({ view: "browse", job: "", state })}
                      onClick={follow({ view: "browse", job: "", state })}
                    >
                      {state === "offline"
                        ? t("Offline", "دون اتصال")
                        : state === "error"
                          ? t("Error", "خطأ")
                          : t("Loading", "تحميل")}
                    </a>
                  ))}
                  <a
                    href={href({ state: "", job: "", view: "browse" })}
                    onClick={follow({ state: "", job: "", view: "browse" })}
                  >
                    {t("Normal view", "العرض العادي")}
                  </a>
                </div>
              </div>
            </details>
          </footer>
        </main>
      </div>
    </div>
  );
}
