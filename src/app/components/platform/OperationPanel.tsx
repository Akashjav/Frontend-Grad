import { useEffect, useRef, useState } from "react";
import { download, execute, initialValue, type Operation } from "../../../lib/platformApi";
import { useAuth } from "../../AuthContext";
import { Field, primary, secondary } from "./Fields";
import { RecordView } from "./RecordView";

export function contextFromRecord(op: Operation, row: any) {
  const values: Record<string, any> = {};
  if (row.code) values.code = row.code;
  if (row.id != null) {
    if (op.path.includes("certificates")) values.certificate_id = row.id;
    if (op.path.endsWith("/certificate")) values.certificate_id = row.id;
    if (op.path.endsWith("/milestones")) values.milestone_id = row.id;
    if (op.path.endsWith("/training-programs")) values.program_id = row.id;
    if (op.path.endsWith("/enroll")) values.enrollment_id = row.id;
    if (op.path.endsWith("/practical-assessments")) values.practical_id = row.id;
    if (op.path.endsWith("/practical-submissions")) values.submission_id = row.id;
    if (op.path.endsWith("/report") && row.program_id != null && row.student_id != null) values.enrollment_id = row.id;
  }
  for (const [key, value] of Object.entries(row)) if ((key.endsWith("_id") || key === "domain_id") && value != null) values[key] = value;
  const segment = op.path.split("/").filter(Boolean).at(-1) || "";
  const names: Record<string, string> = { opportunities: "opportunity_id", projects: "project_id", research: "item_id", assessments: "assessment_id", collaborations: "collaboration_id", communities: "community_id", conversations: "conversation_id", users: "user_id", alumni: "user_id", faculty: "user_id", industry: "user_id", domains: "domain_id", disciplines: "discipline_id", skills: "skill_id", competencies: "competency_id", resources: "resource_id", applications: "application_id", institutions: "institution_id", requests: "request_id", sessions: "session_id", portfolio: "item_id", education: "item_id", requirements: "requirement_id", events: "event_id", notifications: "notification_id", "skill-gaps": "gap_id", posts: "post_id", jobs: "job_id" };
  if (row.id != null) { if (names[segment]) values[names[segment]] = row.id; if (["projects", "research", "fdp", "consultancy"].includes(segment)) { values.item_id = row.id; values.opportunity_id = row.id; } }
  if (row.id != null && segment.startsWith("{")) values[segment.slice(1, -1)] = row.id;
  if (op.path === "/api/alumni/" && row.id != null) { values.alumni_id = row.id; delete values.user_id; }
  if (op.path.endsWith("/documents/resume") && row.id) values.document_id = row.id;
  if (row.match_id) values.match_id = row.match_id;
  if (row.conversation_id) values.conversation_id = row.conversation_id;
  return values;
}

export default function OperationPanel({ op, context, selectedRecord, onRecord }: { op: Operation; context: Record<string, any>; selectedRecord: any; onRecord: (op: Operation, row: any) => void }) {
  const { user, refreshUser, signOut } = useAuth();
  const [params, setParams] = useState<Record<string, any>>(() => Object.fromEntries(op.parameters.map(p => [p.name, context[p.name] ?? p.schema.default ?? ""])));
  const [payload, setPayload] = useState<any>(() => {
    if (!op.body) return undefined;
    const start = initialValue(op.body);
    if (op.path.endsWith("/weights")) return { readiness_weights: { technical: 1 }, matching_weights: { skill: .4, core: .25, project: .15, interest: .1, eligibility: .1 } };
    if (op.method === "PATCH" && selectedRecord && op.body.properties) {
      const source = { ...selectedRecord, ...(selectedRecord.profile || {}) };
      return Object.fromEntries(Object.keys(op.body.properties).filter(k => source[k] != null).map(k => [k, source[k]]));
    }
    if (start && !Array.isArray(start) && typeof start === "object") for (const key of Object.keys(op.body.properties || {})) if (context[key] != null) start[key] = context[key];
    return start;
  });
  const [result, setResult] = useState<any>(undefined); const [error, setError] = useState("");
  const [busy, setBusy] = useState(false); const [confirm, setConfirm] = useState(false); const [notice, setNotice] = useState("");
  const controller = useRef<AbortController | null>(null);
  const destructive = op.method === "DELETE" || /\/(suspend|role|mark-paid|alumni-payouts|revoke)$/.test(op.path);
  const mutation = op.method !== "GET";
  async function run() {
    controller.current?.abort(); const abort = new AbortController(); controller.current = abort;
    setBusy(true); setError(""); setNotice(""); setResult(undefined);
    try {
      const response = await execute(op, params, payload, abort.signal);
      if (abort.signal.aborted) return;
      if (response instanceof Blob) { download(response); setNotice("Your download is ready."); }
      else {
        setResult(response);
        if (mutation) { setNotice(response?.message || "Changes saved successfully."); if (response && typeof response === "object" && !Array.isArray(response)) onRecord(op, response); }
      }
      if (op.path === "/api/v1/auth/me" && op.method === "DELETE") signOut();
      else if (mutation && (op.path.endsWith("/me/profile") || op.path === "/api/v1/auth/me" || op.path.endsWith("/settings/account"))) await refreshUser();
    } catch (e) { if (!abort.signal.aborted) setError(e instanceof Error ? e.message : "Unable to complete this action."); }
    finally { if (!abort.signal.aborted) { setBusy(false); setConfirm(false); } }
  }
  useEffect(() => {
    if (op.method === "GET" && !op.parameters.some(p => p.required && !params[p.name])) void run();
    return () => controller.current?.abort();
  }, [op.key]);
  if (!user || !op.roles.includes(user.role)) return <p role="alert">This action is not available for your role.</p>;
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7 space-y-5 min-w-0">
    <h2 className="text-lg font-semibold text-slate-900">{op.title}</h2>
    {op.disabled ? <p role="status" className="rounded-lg bg-amber-50 text-amber-900 p-4">{op.disabled}</p> : <form onSubmit={e => { e.preventDefault(); if (destructive && !confirm) setConfirm(true); else void run(); }} className="space-y-5">
      <fieldset disabled={busy} className="space-y-5">
        {op.parameters.length > 0 && <div className="grid sm:grid-cols-2 gap-4">{op.parameters.map(p => <Field key={p.name} name={p.name} schema={p.schema} value={params[p.name]} required={p.required} module={op.module} values={params} onChange={value => setParams({ ...params, [p.name]: value })} />)}</div>}
        {op.body && <Field name={op.method === "PATCH" ? "Changes" : "Details"} schema={op.body} value={payload} required module={op.module} values={params} onChange={setPayload} />}
        {op.method === "PATCH" && <p className="text-xs text-slate-500">Blank optional fields are left unchanged.</p>}
        {confirm && <div className="bg-amber-50 text-amber-900 rounded-lg p-4" role="alert"><p>Confirm “{op.title}” for the selected record. Review the details before continuing.</p><button type="button" className={`${secondary} mt-3`} onClick={() => setConfirm(false)}>Cancel</button></div>}
        <button className={primary} disabled={busy}>{busy ? "Working…" : confirm ? "Confirm changes" : mutation ? op.title : "Load records"}</button>
      </fieldset>
    </form>}
    {busy && <p role="status" className="text-slate-600">Loading…</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
    {result !== undefined && <div className="border-t pt-5"><RecordView value={result} onSelect={row => onRecord(op, row)} />{!Array.isArray(result) && result && typeof result === "object" && <button className={`${secondary} mt-4`} onClick={() => onRecord(op, result)}>Use this record</button>}</div>}
  </section>;
}
