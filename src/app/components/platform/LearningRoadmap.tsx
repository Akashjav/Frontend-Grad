import { useEffect, useState } from "react";
import { perform } from "../../../lib/platformApi";
import { control, primary, secondary } from "./styles";
import AssessmentRunner from "./AssessmentRunner";

export default function LearningRoadmap() {
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [target, setTarget] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    perform("GET /api/v1/recommendations/opportunities", {}, undefined, controller.signal)
      .then(setOpportunities).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    setPlan(null); setError("");
    if (!target) return;
    const controller = new AbortController();
    setBusy(true);
    perform("GET /api/v1/students/me/learning-roadmap", { opportunity_id: target }, undefined, controller.signal)
      .then(setPlan).catch(e => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [target, revision]);
  async function update(resourceId: number, action: "start" | "complete") {
    setBusy(true); setError("");
    try { await perform(`POST /api/v1/learning/{resource_id}/${action}`, { resource_id: resourceId }); setRevision(r => r + 1); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not save progress."); setBusy(false); }
  }
  if (assessmentId) return <div className="space-y-4"><button className={secondary} onClick={() => { setAssessmentId(null); setRevision(r => r + 1); }}>Back to roadmap</button><AssessmentRunner key={assessmentId} assessmentId={assessmentId} reassess /></div>;
  return <section className="rounded-xl border bg-white p-5 space-y-5">
    <h2 className="text-xl font-semibold">My learning roadmap</h2>
    <label className="block text-sm">Choose your target opportunity
      <select className={control} value={target} disabled={busy} onChange={e => setTarget(e.target.value)}>
        <option value="">Select an opportunity</option>
        {opportunities.map(o => <option key={o.opportunity_id} value={o.opportunity_id}>{o.opportunity_title}</option>)}
      </select>
    </label>
    {!opportunities.length && <p className="text-sm text-slate-600">Eligible published opportunities will appear here.</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {busy && <p role="status">Updating your roadmap…</p>}
    {plan && <><p>{plan.guidance}</p><p className="font-medium">Current match: {plan.match_score}%</p>
      {!plan.steps.length && <p>Your validated skills meet the current skill targets. Review the opportunity to apply.</p>}
      <ol className="space-y-4">{plan.steps.map((step: any, index: number) => <li key={step.skill_id} className="rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold">{index + 1}. {step.skill}</h3>
        <p className="text-sm">Current: {step.current_level} · Target: {step.required_level} · Gap: {step.gap_score}</p>
        {step.resource_missing && <p>No suitable learning resource has been added yet. Ask your mentor or institution for guidance.</p>}
        {step.resources.map((r: any) => <div key={r.resource_id} className="flex flex-wrap items-center gap-3">
          {/^(https?):\/\//i.test(r.url) ? <a className="text-blue-700 underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a> : <span>{r.title}</span>}
          <span className="text-sm">{r.status.replaceAll("_", " ")}</span>
          {r.status !== "completed" && <button className={secondary} disabled={busy} onClick={() => update(r.resource_id, r.status === "started" ? "complete" : "start")}>{r.status === "started" ? "Mark completed" : "Start learning"}</button>}
        </div>)}
        <p className="text-sm">Practice: {step.practice}</p>
        {!!step.mentors.length && <p className="text-sm">Suggested mentors: {step.mentors.map((m: any) => m.display_name).join(", ")}. Use Mentorship to request support.</p>}
        {step.assessment_missing ? <p>No suitable reassessment is available yet.</p> : step.assessments.map((a: any) => <button key={a.assessment_id} className={primary} disabled={busy} onClick={() => setAssessmentId(a.assessment_id)}>Reassess: {a.title}</button>)}
      </li>)}</ol>
      <button className={secondary} disabled={busy} onClick={() => setRevision(r => r + 1)}>Refresh validated progress</button>
    </>}
  </section>;
}
