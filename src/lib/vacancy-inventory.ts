/**
 * Validates trusted-editor declarations, not permission evidence or identity.
 * All evaluation uses an injected clock. No source URLs are fetched.
 */
export type Bilingual = { en: string; ar: string };
export type ReviewedVacancy = {
  id: string;
  status: "approved";
  employer: { id: string; name: Bilingual };
  title: Bilingual;
  summary: Bilingual;
  requirements: Bilingual[];
  location: { country: "SD"; city: Bilingual; workMode: "on_site" | "hybrid" | "remote" };
  applicationUrl: string;
  closesAt: string | null;
  salary: {
    minimum: number | null; maximum: number | null;
    currency: "SDG" | "USD" | "EUR" | "SAR" | "AED" | null;
    period: "hour" | "day" | "month" | "year" | null;
  };
  source: { url: string; reference: string; checkedAt: string };
  permission: { basis: "employer_submitted" | "written_permission" | "licensed"; recordRef: string };
  review: {
    reviewedAt: string; reviewerRef: string;
    distinctFrom?: { vacancyId: string; recordRef: string }[];
  };
};
export type PublishedVacancy = Omit<ReviewedVacancy, "status" | "permission" | "review" | "employer"> & {
  employer: { name: Bilingual };
};
export type InventoryIssue = { index: number; path: string; code: string };
export type InventoryResult = {
  published: PublishedVacancy[];
  errors: InventoryIssue[];
  warnings: InventoryIssue[];
  withheld: { id: string; reason: "expired" | "needs_recheck" }[];
  drafts: number;
  withdrawn: number;
};
export const SOURCE_RECHECK_DAYS = 7;
const DAY = 86400000;
const identifier = /^[a-z0-9][a-z0-9-]{0,79}$/;
type RecordValue = Record<string, unknown>;
function record(v: unknown): v is RecordValue {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function text(v: unknown, max = 2000): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}
function oneOf(v: unknown, choices: string[]): boolean {
  return typeof v === "string" && choices.includes(v);
}
function bilingual(v: unknown): v is Bilingual {
  return record(v) && text(v.en) && text(v.ar);
}

/** Reject calendar overflow and ambiguous local timestamps. */
export function timestamp(v: unknown): number | null {
  if (typeof v !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/.exec(v);
  if (!match) return null;
  const [, year, month, day, hour, minute, second, zone] = match;
  const y = Number(year), m = Number(month), d = Number(day);
  if (y < 2000 || m < 1 || m > 12 || d < 1 ||
      d > new Date(Date.UTC(y, m, 0)).getUTCDate() ||
      Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return null;
  if (zone !== "Z") {
    const [h, min] = zone.slice(1).split(":").map(Number);
    if (h > 14 || min > 59 || (h === 14 && min !== 0)) return null;
  }
  const parsed = Date.parse(v);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Syntax policy, not a trust check or DNS/redirect validation. */
export function publicHttpsUrl(v: unknown): v is string {
  if (!text(v, 2048) || v !== v.trim()) return false;
  try {
    const url = new URL(v);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    if (host.endsWith(".") || host.includes(":") || /^\d+(\.\d+){3}$/.test(host)) return false;
    if (!host.includes(".") || /\.(localhost|local|internal|test|invalid|example)$/.test(host)) return false;
    if (["example.com", "example.net", "example.org"].some(h => host === h || host.endsWith("." + h))) return false;
    return host.split(".").every(part => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(part));
  } catch { return false; }
}
export function canonicalSourceUrl(v: string): string {
  const url = new URL(v);
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_/i.test(key) || /^(fbclid|gclid|msclkid)$/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  return url.toString();
}
function normalise(v: string): string {
  return v.normalize("NFKD").replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function parseApproved(v: RecordValue, now: number, issue: (path: string, code: string) => void): ReviewedVacancy | null {
  let valid = true;
  const check = (ok: boolean, path: string, code = "invalid_value") => {
    if (!ok) { valid = false; issue(path, code); }
  };
  const employer = record(v.employer) ? v.employer : {};
  const location = record(v.location) ? v.location : {};
  const salary = record(v.salary) ? v.salary : {};
  const source = record(v.source) ? v.source : {};
  const permission = record(v.permission) ? v.permission : {};
  const review = record(v.review) ? v.review : {};
  check(typeof employer.id === "string" && identifier.test(employer.id), "employer.id");
  check(bilingual(employer.name), "employer.name", "both_languages_required");
  for (const field of ["title", "summary"]) check(bilingual(v[field]), field, "both_languages_required");
  check(Array.isArray(v.requirements) && v.requirements.length > 0 &&
    v.requirements.length <= 30 && v.requirements.every(bilingual), "requirements");
  check(location.country === "SD", "location.country");
  check(bilingual(location.city), "location.city");
  check(oneOf(location.workMode, ["on_site", "hybrid", "remote"]), "location.workMode");
  check(publicHttpsUrl(v.applicationUrl), "applicationUrl", "public_https_required");
  check(publicHttpsUrl(source.url), "source.url", "public_https_required");
  check(text(source.reference, 160), "source.reference", "original_ad_reference_required");
  check(oneOf(permission.basis, ["employer_submitted", "written_permission", "licensed"]),
    "permission.basis", "permission_basis_required");
  check(typeof permission.recordRef === "string" && identifier.test(permission.recordRef),
    "permission.recordRef", "private_evidence_reference_required");
  check(typeof review.reviewerRef === "string" && identifier.test(review.reviewerRef),
    "review.reviewerRef", "reviewer_reference_required");
  check(review.distinctFrom === undefined || (Array.isArray(review.distinctFrom) &&
    review.distinctFrom.length <= 20 && review.distinctFrom.every(item =>
      record(item) && typeof item.vacancyId === "string" && identifier.test(item.vacancyId) &&
      item.vacancyId !== v.id && typeof item.recordRef === "string" && identifier.test(item.recordRef))),
    "review.distinctFrom", "reviewed_duplicate_exceptions_require_references");
  const checked = timestamp(source.checkedAt), reviewed = timestamp(review.reviewedAt);
  check(checked !== null && checked <= now, "source.checkedAt", "valid_nonfuture_timestamp_required");
  check(reviewed !== null && reviewed <= now, "review.reviewedAt", "valid_nonfuture_timestamp_required");
  if (checked !== null && reviewed !== null)
    check(reviewed >= checked, "review.reviewedAt", "review_must_follow_source_check");
  check(v.closesAt === null || timestamp(v.closesAt) !== null, "closesAt", "explicit_offset_or_null_required");
  const amount = (n: unknown) => n === null || (typeof n === "number" && Number.isFinite(n) && n >= 0);
  check(amount(salary.minimum) && amount(salary.maximum), "salary", "finite_amounts_or_null_required");
  const hasAmount = typeof salary.minimum === "number" || typeof salary.maximum === "number";
  check(hasAmount
    ? oneOf(salary.currency, ["SDG", "USD", "EUR", "SAR", "AED"]) && oneOf(salary.period, ["hour", "day", "month", "year"])
    : salary.currency === null && salary.period === null, "salary", "currency_and_period_required_for_amounts");
  if (typeof salary.minimum === "number" && typeof salary.maximum === "number")
    check(salary.minimum <= salary.maximum, "salary", "minimum_exceeds_maximum");
  return valid ? v as unknown as ReviewedVacancy : null;
}
/** Call only with a validated ReviewedVacancy, or use evaluateInventory for untrusted input. */
export function publicationState(job: ReviewedVacancy, now: number): "eligible" | "expired" | "needs_recheck" {
  if (!Number.isFinite(now)) throw new Error("A finite evaluation time is required.");
  if (job.closesAt !== null && timestamp(job.closesAt)! <= now) return "expired";
  if (now - timestamp(job.source.checkedAt)! >= SOURCE_RECHECK_DAYS * DAY) return "needs_recheck";
  return "eligible";
}
function publish(job: ReviewedVacancy): PublishedVacancy {
  const copy = (v: Bilingual): Bilingual => ({ en: v.en.trim(), ar: v.ar.trim() });
  return {
    id: job.id, employer: { name: copy(job.employer.name) },
    title: copy(job.title), summary: copy(job.summary), requirements: job.requirements.map(copy),
    location: { country: job.location.country, city: copy(job.location.city), workMode: job.location.workMode },
    applicationUrl: job.applicationUrl, closesAt: job.closesAt,
    salary: { minimum: job.salary.minimum, maximum: job.salary.maximum, currency: job.salary.currency, period: job.salary.period },
    source: { url: job.source.url, reference: job.source.reference, checkedAt: job.source.checkedAt },
  };
}
export function evaluateInventory(input: unknown, now: number): InventoryResult {
  if (!Number.isFinite(now)) throw new Error("A finite evaluation time is required.");
  const result: InventoryResult = { published: [], errors: [], warnings: [], withheld: [], drafts: 0, withdrawn: 0 };
  if (!record(input) || input.schemaVersion !== 1 || !Array.isArray(input.vacancies)) {
    result.errors.push({ index: -1, path: "inventory", code: "schema_version_1_and_vacancies_array_required" });
    return result;
  }
  const ids = new Set<string>(), sources = new Set<string>();
  const similar = new Map<string, ReviewedVacancy[]>();
  input.vacancies.forEach((raw, index) => {
    const issue = (path: string, code: string) => result.errors.push({ index, path, code });
    if (!record(raw) || typeof raw.id !== "string" || !identifier.test(raw.id)) {
      issue("id", "valid_unique_id_required"); return;
    }
    if (ids.has(raw.id)) { issue("id", "duplicate_id"); return; }
    ids.add(raw.id);
    if (raw.status === "draft") { result.drafts++; return; }
    if (raw.status === "withdrawn") { result.withdrawn++; return; }
    if (raw.status !== "approved") { issue("status", "draft_approved_or_withdrawn_required"); return; }
    const job = parseApproved(raw, now, issue);
    if (!job) return;
    const state = publicationState(job, now);
    if (state !== "eligible") { result.withheld.push({ id: job.id, reason: state }); return; }
    const sourceKey = canonicalSourceUrl(job.source.url) + "|" + normalise(job.source.reference);
    if (sources.has(sourceKey)) { issue("source", "duplicate_source_advert"); return; }
    sources.add(sourceKey);
    const keys = (["en", "ar"] as const).map(lang =>
      [job.employer.id, normalise(job.title[lang]), normalise(job.location.city[lang]), job.location.workMode].join("|"));
    const matches = new Map<string, ReviewedVacancy>();
    keys.forEach(key => similar.get(key)?.forEach(other => matches.set(other.id, other)));
    const distinct = (a: ReviewedVacancy, b: ReviewedVacancy) =>
      a.review.distinctFrom?.some(entry => entry.vacancyId === b.id) ||
      b.review.distinctFrom?.some(entry => entry.vacancyId === a.id);
    if ([...matches.values()].some(other => !distinct(job, other)))
      result.warnings.push({ index, path: "title", code: "possible_duplicate_needs_editor_review" });
    keys.forEach(key => similar.set(key, [...(similar.get(key) || []), job]));
    result.published.push(publish(job));
  });
  // Invalid batches must never expose an apparently publishable partial subset.
  if (result.errors.length || result.warnings.length) result.published = [];
  return result;
}
