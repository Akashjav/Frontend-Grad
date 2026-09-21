import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { build } from "esbuild";
import { createRequire } from "node:module";
import { File } from "node:buffer";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url);
const contract = JSON.parse((await readFile("../Backend-Grad/docs/openapi.json", "utf8").catch(error => {
  if (error.code !== "ENOENT") throw error;
  return readFile("tests/generated/deployed-openapi.json", "utf8");
})).replace(/^\uFEFF/, ""));
const rawCatalog = JSON.parse(await readFile("src/lib/generated/apiCatalog.json", "utf8"));
const storage = new Map([["access_token", "test-session"], ["auth_api", "v1"]]);
const events = [];
const globals = { URL, URLSearchParams, FormData, File, Blob, Event, Headers, AbortController, DOMException, structuredClone, setTimeout, clearTimeout,
  localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
  window: { dispatchEvent: e => events.push(e.type), location: { hash: "#workspace/assessments" } }, sessionStorage: { getItem: () => null },
};
async function load(entry, extra = {}, role = "student") {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: "node", format: "cjs", packages: "external", jsx: "automatic", define: { "import.meta.env.VITE_API_URL": '"https://api.example.test"' }, plugins: [{ name: "auth", setup(b) {
    b.onResolve({ filter: /AuthContext$/ }, () => ({ path: "auth", namespace: "test" }));
    b.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: `export function useAuth() { return { user: { id: 'test-user', role: '${role}', profile: {domain_id: 1} }, refreshUser: async () => {}, signOut() {} }; }` }));
  } }] });
  const module = { exports: {} }; vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, require, console, ...globals, ...extra }); return module.exports;
}
const client = await load("src/lib/platformApi.ts");
const modules = await load("src/lib/platformModules.ts");

test("delivery forms suggest records from role-appropriate lists", async () => {
  const fields = await load("src/app/components/platform/Fields.tsx");
  assert.equal(fields.referencePath("certificate_id", "certificates", "student"), "/api/v1/certificates/me");
  assert.equal(fields.referencePath("certificate_id", "certificates", "industry"), undefined);
  assert.equal(fields.referencePath("program_id", "training", "institution_admin"), "/api/v1/institutions/me/training-programs");
  assert.equal(fields.referencePath("program_id", "training", "student"), "/api/v1/students/me/training-programs");
  assert.equal(fields.referencePath("practical_id", "practical", "student"), "/api/v1/practical-assessments");
  assert.equal(fields.referencePath("submission_id", "practical", "industry"), "/api/v1/practical-submissions");
});

test("guided workflows expose authorized steps and retain enrollment identifiers", async () => {
  for (const role of ["student", "industry", "institution_admin"]) {
    const component = await load("src/app/components/platform/GuidedWorkflow.tsx", {}, role);
    for (const moduleId of Object.keys(component.workflowSteps)) {
      const html = renderToStaticMarkup(React.createElement(component.default, { moduleId }));
      for (const [label, key] of component.workflowSteps[moduleId]) {
        if (!client.operation(key).roles.includes(role)) assert.ok(!html.includes(`>${label}</button>`), `${role}: ${label}`);
      }
      assert.ok(!html.includes("/api/v1/"));
      if (role === "student" && moduleId === "certificates") assert.ok(html.includes("My certificates") && html.includes("Download PDF"));
      if (role === "institution_admin" && moduleId === "training") assert.ok(html.includes("Complete enrollment"));
    }
  }
  const panel = await load("src/app/components/platform/OperationPanel.tsx");
  const enrollment = panel.contextFromRecord(client.operation("GET /api/v1/institutions/me/training-programs/{program_id}/report"), { id: 91, program_id: 7, student_id: "student-1" });
  assert.equal(enrollment.enrollment_id, 91);
  assert.equal(enrollment.program_id, 7);
});

test("every backend HTTP operation has a frontend disposition and aliases resolve", () => {
  const expected = Object.entries(contract.paths).flatMap(([path, methods]) => Object.keys(methods).filter(m => ["get", "post", "put", "patch", "delete"].includes(m)).map(m => `${m.toUpperCase()} ${path}`));
  assert.equal(rawCatalog.length, expected.length);
  assert.deepEqual(new Set(rawCatalog.map(o => o.key)), new Set(expected));
  const ids = new Set(modules.modules.map(m => m.id));
  for (const op of rawCatalog) {
    assert.ok(["module", "alias", "identity", "assessment", "diagnostic", "compatibility"].includes(op.handler), op.key);
    if (op.handler === "module") assert.ok(ids.has(op.module), op.key);
    if (op.alias) assert.ok(rawCatalog.some(c => c.key === op.alias), op.key);
    assert.ok(op.roles.length > 0, op.key);
  }
});
test("navigation excludes administrative and publisher actions from other roles", () => {
  for (const role of ["student", "industry", "academician", "institution_admin"]) assert.equal(modules.tasksFor("administration", role).length, 0);
  assert.ok(modules.tasksFor("administration", "super_admin").some(o => o.path.endsWith("/approve")));
  assert.ok(modules.tasksFor("institutions", "institution_admin").some(o => o.path.endsWith("/analytics")));
  assert.ok(!modules.tasksFor("assessments", "industry").some(o => o.handler === "assessment"));
  assert.ok(!modules.tasksFor("opportunities", "student").some(o => o.method === "POST" && !o.path.endsWith("/apply")));
});
test("forms serialize scalar, nested, query and multipart inputs and reject invalid values", () => {
  const op = client.operation("POST /api/v1/opportunities");
  const prepared = client.prepare(op, {}, { domain_id: "2", title: "Research", description: "A project", cross_domain: "false", discipline_id: "" });
  const body = JSON.parse(prepared.body);
  assert.equal(body.domain_id, 2); assert.equal(body.cross_domain, false); assert.ok(!("discipline_id" in body));
  const profile = client.prepare(client.operation("PATCH /api/v1/auth/me"), {}, { domain_id: 2, discipline_id: null });
  assert.equal(JSON.parse(profile.body).discipline_id, null);
  const skills = client.prepare(client.operation("PUT /api/v1/students/me/skills"), {}, { skills: [{ skill_id: "8", score: "60" }] });
  assert.deepEqual(JSON.parse(skills.body), { skills: [{ skill_id: 8, score: 60 }] });
  assert.throws(() => client.prepare(op, {}, { domain_id: "invalid", title: "x", description: "y" }), /valid integer/);
  assert.throws(() => client.prepare(op, {}, { domain_id: 1 }), /required/);
  assert.ok(client.prepare(client.operation("GET /api/v1/alumni/{user_id}"), { user_id: "a/b?c" }).path.endsWith("a%2Fb%3Fc"));
  const query = client.prepare(client.operation("GET /api/v1/opportunities"), { domain_id: "2", search: "AI & Health", offset: 0, limit: 20 });
  assert.equal(new URL(query.path, "https://example.test").searchParams.get("search"), "AI & Health");
  const file = new File(["%PDF-demo"], "resume.pdf", { type: "application/pdf" });
  const upload = client.prepare(client.operation("POST /api/v1/documents/resume"), {}, { file });
  assert.ok(upload.body instanceof FormData); assert.equal(upload.body.get("file").name, "resume.pdf");
});
test("transport authenticates uploads, downloads PDFs and protects new sessions", async () => {
  const calls = [];
  const api = await load("src/lib/platformApi.ts", { fetch: async (url, options) => { calls.push({ url, ...options }); return new Response(JSON.stringify({ id: 1 }), { headers: { "content-type": "application/json" } }); } });
  await api.perform("POST /api/v1/documents/resume", {}, { file: new File(["pdf"], "resume.pdf") });
  assert.equal(calls[0].headers.Authorization, "Bearer test-session"); assert.equal(calls[0].headers["Content-Type"], undefined);
  const binary = await load("src/lib/platformApi.ts", { fetch: async () => new Response("%PDF", { headers: { "content-type": "application/pdf" } }) });
  assert.ok(await binary.perform("GET /api/v1/documents/resume/{document_id}", { document_id: 1 }) instanceof Blob);
  let resolve;
  const delayed = await load("src/lib/platformApi.ts", { fetch: () => new Promise(done => { resolve = done; }) });
  const pending = delayed.perform("GET /api/v1/auth/me"); storage.set("access_token", "new-session");
  resolve(new Response(JSON.stringify({ detail: "Expired" }), { status: 401 }));
  await assert.rejects(pending, /Expired/); assert.equal(storage.get("access_token"), "new-session"); assert.equal(events.length, 0);
  storage.set("access_token", "test-session");
});
test("all module actions render forms without showing endpoint paths or credentials", async () => {
  for (const role of ["student", "alumni", "industry", "academician", "institution_admin", "admin", "super_admin"]) {
    const component = await load("src/app/components/platform/OperationPanel.tsx", {}, role);
    for (const op of rawCatalog.filter(o => o.handler === "module" && o.roles[0] === role)) {
      const html = renderToStaticMarkup(React.createElement(component.default, { op, context: {}, selectedRecord: null, onRecord() {} }));
      assert.ok(!html.includes("This action is not available"), op.key);
      assert.ok(!html.includes(op.path), op.key);
      assert.ok(html.includes(op.title.replaceAll("&", "&amp;")), op.key);
    }
  }
  const view = await load("src/app/components/platform/RecordView.tsx");
  const html = renderToStaticMarkup(React.createElement(view.RecordView, { value: { password_hash: "SECRET", access_token: "TOKEN", title: "javascript:alert(1)", url: "https://example.test" } }));
  assert.ok(!html.includes("SECRET") && !html.includes("TOKEN")); assert.ok(!html.includes('href="javascript:'));
});
test("assessment and workspace screens render role-specific workflows", async () => {
  const assessment = await load("src/app/components/platform/AssessmentRunner.tsx");
  assert.match(renderToStaticMarkup(React.createElement(assessment.default, { assessmentId: 1 })), /Begin assessment/);
  const workspace = await load("src/app/components/platform/PlatformWorkspace.tsx");
  const html = renderToStaticMarkup(React.createElement(workspace.default));
  assert.match(html, /Assessments/); assert.match(html, /Learning/); assert.doesNotMatch(html, />Administration</);
});
function sample(raw, name = "") {
  const s = client.normalized(raw);
  if (s.default != null) return s.default;
  if (s.enum) return s.enum[0];
  if (s.type === "object" || s.properties) {
    if (!s.properties) return name === "matching_weights" ? { skill: .4, core: .25, project: .15, interest: .1, eligibility: .1 } : { "1": sample(typeof s.additionalProperties === "object" ? s.additionalProperties : { type: "number" }) };
    return Object.fromEntries(Object.entries(s.properties).filter(([k]) => s.required?.includes(k)).map(([k, v]) => [k, sample(v, k)]));
  }
  if (s.type === "array") return Array.from({ length: Math.max(s.minItems || 0, 1) }, (_, i) => sample(s.items || {}, `${name}${i}`));
  if (s.type === "integer" || s.type === "number") return Math.max(s.minimum ?? 0, s.exclusiveMinimum != null ? s.exclusiveMinimum + 1 : 0, name === "answer" ? 0 : 1);
  if (s.type === "boolean") return false;
  if (s.format === "email") return "test@example.com";
  if (s.format === "uuid") return "00000000-0000-4000-8000-000000000001";
  if (s.format === "uri") return "https://example.com/resource";
  if (s.format === "date-time") return "2027-01-01T12:00:00Z";
  if (s.format === "date") return "2027-01-01";
  return "Example value".padEnd(s.minLength || 0, "x").slice(0, s.maxLength || 100);
}
test("export frontend request bodies for backend model validation", async () => {
  const cases = [];
  for (const op of rawCatalog.filter(o => o.handler === "module" && o.body && o.media === "application/json" && !o.disabled)) {
    const params = Object.fromEntries(op.parameters.filter(p => p.required).map(p => [p.name, sample(p.schema, p.name)]));
    const prepared = client.prepare(op, params, sample(op.body));
    cases.push({ key: op.key, payload: JSON.parse(prepared.body) });
  }
  await mkdir("tests/generated", { recursive: true });
  await writeFile("tests/generated/frontend-payloads.json", JSON.stringify(cases, null, 2) + "\n");
  assert.ok(cases.length > 50);
});
