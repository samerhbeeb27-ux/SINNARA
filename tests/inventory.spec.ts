import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { evaluateInventory, timestamp, publicHttpsUrl } from "../src/lib/vacancy-inventory";
test.skip(Boolean(process.env.PLAYWRIGHT_BASE_URL), "Inventory rules run in the build job, not against the hosted UI.");
const now = Date.parse("2026-11-17T08:00:00Z");
// Synthetic URLs are parsed only and are never fetched.
function vacancy() {
  return {
    id: "sample-job", status: "approved",
    employer: { id: "sample-employer", name: { en: "Fictional employer", ar: "جهة افتراضية" } },
    title: { en: "Accounts assistant", ar: "مساعد حسابات" },
    summary: { en: "Synthetic test vacancy.", ar: "وظيفة افتراضية للاختبارات." },
    requirements: [{ en: "Spreadsheet skills.", ar: "مهارات جداول البيانات." }],
    location: { country: "SD", city: { en: "Port Sudan", ar: "بورتسودان" }, workMode: "on_site" },
    applicationUrl: "https://jobs.test-employer.sd/apply/123",
    closesAt: "2026-11-20T23:59:59+02:00",
    salary: { minimum: null, maximum: null, currency: null, period: null },
    source: { url: "https://jobs.test-employer.sd/vacancy?id=123", reference: "REF-123", checkedAt: "2026-11-16T08:00:00Z" },
    permission: { basis: "written_permission", recordRef: "permission-001" },
    review: { reviewedAt: "2026-11-16T09:00:00Z", reviewerRef: "editor-001" },
  };
}
function evaluate(...vacancies: unknown[]) { return evaluateInventory({ schemaVersion: 1, vacancies }, now); }

test("real inventory remains empty until the reviewed-data UI is ready", () => {
  const data: unknown = JSON.parse(readFileSync("data/vacancies.json", "utf8"));
  const result = evaluateInventory(data, now);
  expect(result.errors).toEqual([]); expect(result.warnings).toEqual([]);
  expect(result.published).toEqual([]);
});
test("public projection excludes unexpected fields and private review metadata", () => {
  const job = vacancy();
  const result = evaluate({ ...job, privateNotes: "PRIVATE",
    employer: { ...job.employer, contact: "PRIVATE" },
    title: { ...job.title, hidden: "PRIVATE" }, source: { ...job.source, permissionEmail: "PRIVATE" } });
  expect(result.errors).toEqual([]); expect(result.published).toHaveLength(1);
  expect(JSON.stringify(result.published)).not.toContain("PRIVATE");
  expect(result.published[0]).not.toHaveProperty("permission");
  expect(result.published[0]).not.toHaveProperty("review");
  expect(result.published[0].employer).not.toHaveProperty("id");
});
test("drafts and withdrawn records cannot enter the public projection", () => {
  const result = evaluate({ id: "draft-1", status: "draft" }, { id: "withdrawn-1", status: "withdrawn" });
  expect(result.errors).toEqual([]); expect(result.drafts).toBe(1);
  expect(result.withdrawn).toBe(1); expect(result.published).toEqual([]);
});
test("permission and human review declarations are required", () => {
  for (const patch of [{ permission: undefined }, { permission: { basis: "found_online", recordRef: "ref" } }, { review: undefined }]) {
    const result = evaluate({ ...vacancy(), ...patch });
    expect(result.errors.length).toBeGreaterThan(0); expect(result.published).toEqual([]);
  }
});
test("Sudan-offset deadline closes at the exact instant", () => {
  const job = vacancy(); job.closesAt = "2026-11-17T10:00:00+02:00";
  expect(evaluate(job).withheld).toEqual([{ id: job.id, reason: "expired" }]);
  expect(evaluateInventory({ schemaVersion: 1, vacancies: [job] }, now - 1).published).toHaveLength(1);
});
test("unknown deadlines remain unknown and source checks expire after seven days", () => {
  const job = { ...vacancy(), closesAt: null };
  expect(evaluate(job).published[0].closesAt).toBeNull();
  job.source.checkedAt = "2026-11-10T08:00:00Z";
  expect(evaluate(job).withheld).toEqual([{ id: job.id, reason: "needs_recheck" }]);
  expect(evaluateInventory({ schemaVersion: 1, vacancies: [job] }, now - 1).published).toHaveLength(1);
});
test("invalid calendar dates and ambiguous timestamps are rejected", () => {
  for (const date of ["2026-02-30T10:00:00Z", "2026-11-17", "2026-11-17T08:00:00", "2026-11-17T08:00:00+15:00", "2026-11-17T24:00:00Z"])
    expect(timestamp(date)).toBeNull();
  expect(timestamp("2024-02-29T10:00:00Z")).not.toBeNull();
});
test("future source checks and reviews preceding source checks are rejected", () => {
  const job = vacancy(); job.source.checkedAt = "2026-11-18T08:00:00Z";
  expect(evaluate(job).errors.map(e => e.path)).toContain("source.checkedAt");
  job.source.checkedAt = "2026-11-16T10:00:00Z";
  expect(evaluate(job).errors.map(e => e.code)).toContain("review_must_follow_source_check");
});
test("unsafe URL forms and nonpublic host formats are rejected", () => {
  for (const url of ["javascript:alert(1)", "http://jobs.test-employer.sd", "https://u:p@jobs.test-employer.sd",
    "https://127.0.0.1", "https://[::1]", "https://localhost", "https://a.internal", "https://example.com", "https://jobs.test-employer.sd:444"])
    expect(publicHttpsUrl(url)).toBe(false);
  expect(publicHttpsUrl("https://jobs.test-employer.sd/apply?id=1")).toBe(true);
});
test("duplicate IDs and tracking-only copies of a source advert are blocked", () => {
  const first = vacancy();
  expect(evaluate(first, first).errors.map(e => e.code)).toContain("duplicate_id");
  const second = { ...vacancy(), id: "second-id" };
  second.source.url += "&utm_source=facebook&fbclid=abc";
  expect(evaluate(first, second).errors.map(e => e.code)).toContain("duplicate_source_advert");
  expect(evaluate(first, second).published).toEqual([]);
});
test("distinct job query identifiers are preserved", () => {
  const second = { ...vacancy(), id: "second-id", title: { en: "Warehouse officer", ar: "مسؤول مخازن" } };
  second.source.url = "https://jobs.test-employer.sd/vacancy?id=456";
  second.source.reference = "REF-456";
  expect(evaluate(vacancy(), second).published).toHaveLength(2);
});
test("similar roles need a documented distinct-advert review in either order", () => {
  const first = vacancy();
  const second = { ...vacancy(), id: "second-id", title: { en: "ACCOUNTS  assistant", ar: "مُساعد حسابات" } };
  second.source = { ...second.source, url: "https://other.test-employer.sd/vacancy/456", reference: "REF-456" };
  expect(evaluate(first, second).warnings).toHaveLength(1);
  expect(evaluate(first, second).published).toEqual([]);
  const reviewed = { ...second, review: { ...second.review, distinctFrom: [{ vacancyId: first.id, recordRef: "review-distinct-002" }] } };
  expect(evaluate(first, reviewed).published).toHaveLength(2);
  expect(evaluate(reviewed, first).published).toHaveLength(2);
});
test("salary amounts need currency and period and an ordered range", () => {
  expect(evaluate({ ...vacancy(), salary: { minimum: 100, maximum: 200, currency: null, period: null } }).errors.length).toBeGreaterThan(0);
  expect(evaluate({ ...vacancy(), salary: { minimum: 200, maximum: 100, currency: "USD", period: "month" } }).errors.length).toBeGreaterThan(0);
  expect(evaluate({ ...vacancy(), salary: { minimum: 100, maximum: 200, currency: "USD", period: "month" } }).published).toHaveLength(1);
});
test("malformed enums, missing Arabic and invalid envelopes fail validation", () => {
  expect(evaluate({ ...vacancy(), location: { ...vacancy().location, workMode: ["on_site"] } }).errors.length).toBeGreaterThan(0);
  expect(evaluate({ ...vacancy(), title: { en: "Title" } }).errors.length).toBeGreaterThan(0);
  expect(evaluateInventory({ vacancies: [] }, now).errors).toHaveLength(1);
  expect(() => evaluateInventory({ schemaVersion: 1, vacancies: [] }, NaN)).toThrow();
});
test("one invalid approved advert prevents partial batch publication", () => {
  expect(evaluate(vacancy(), { ...vacancy(), id: "bad-job", applicationUrl: "javascript:alert(1)" }).published).toEqual([]);
});
