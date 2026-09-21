import { useEffect, useRef, useState } from "react";
import { perform } from "../../../lib/platformApi";
import { useAuth } from "../../AuthContext";
import { primary, secondary } from "./Fields";
import { RecordView } from "./RecordView";

export default function AssessmentRunner({ assessmentId, reassess = false }: { assessmentId: number; reassess?: boolean }) {
  const { user } = useAuth(); const storageKey = `assessment:${user?.id}:${assessmentId}`;
  const [attempt, setAttempt] = useState<any>(() => { try { return JSON.parse(sessionStorage.getItem(storageKey) || "null"); } catch { return null; } });
  const [answers, setAnswers] = useState<Record<string, number>>(() => attempt?.answers || {});
  const [now, setNow] = useState(Date.now()); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState<any>(null);
  const abort = useRef<AbortController | null>(null);
  const expiry = attempt ? new Date(/Z$|[+-]\d\d:\d\d$/.test(attempt.expires_at) ? attempt.expires_at : `${attempt.expires_at}Z`).getTime() : 0;
  const remaining = Math.max(0, Math.ceil((expiry - now) / 1000));
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => { clearInterval(timer); abort.current?.abort(); }; }, []);
  useEffect(() => { if (attempt) sessionStorage.setItem(storageKey, JSON.stringify({ ...attempt, answers })); }, [attempt, answers, storageKey]);
  async function start() {
    abort.current?.abort(); const request = new AbortController(); abort.current = request;
    setBusy(true); setError(""); setResult(null);
    try { const data = await perform(`POST /api/v1/assessments/{assessment_id}/${reassess ? "reassess" : "start"}`, { assessment_id: assessmentId }, undefined, request.signal); if (!request.signal.aborted) { setAttempt(data); setAnswers({}); setNow(Date.now()); } }
    catch (e) { if (!request.signal.aborted) setError(e instanceof Error ? e.message : "Unable to start assessment."); }
    finally { if (!request.signal.aborted) setBusy(false); }
  }
  async function submit() {
    const request = new AbortController(); abort.current = request; setBusy(true); setError("");
    try { const data = await perform("POST /api/v1/assessments/{assessment_id}/submit", { assessment_id: assessmentId }, { attempt_id: attempt.attempt_id, answers }, request.signal); if (!request.signal.aborted) { setAttempt(null); setResult(data); sessionStorage.removeItem(storageKey); } }
    catch (e) { if (!request.signal.aborted) setError(e instanceof Error ? e.message : "Unable to submit assessment."); }
    finally { if (!request.signal.aborted) setBusy(false); }
  }
  if (user?.role !== "student") return <p role="alert">Only students can take assessments.</p>;
  return <section className="bg-white rounded-2xl border p-6 space-y-5"><h2 className="text-xl font-semibold">Skill assessment</h2>{error && <p role="alert" className="text-red-700">{error}</p>}
    {!attempt && !result && <><p className="text-slate-600">The timer starts when you begin. Your answers are saved in this browser tab until submission.</p><button className={primary} disabled={busy || !assessmentId} onClick={start}>{busy ? "Starting…" : reassess ? "Start reassessment" : "Begin assessment"}</button></>}
    {attempt && <><p role="timer" className="font-semibold">Time remaining: {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</p>{remaining === 0 && <p role="alert" className="text-amber-800">This attempt has expired. Start a new attempt to continue.</p>}
      <form onSubmit={e => { e.preventDefault(); void submit(); }} className="space-y-6"><fieldset disabled={busy || remaining === 0} className="space-y-6">{attempt.questions.map((question: any, index: number) => <fieldset key={question.id} className="space-y-2"><legend className="font-medium mb-3">{index + 1}. {question.prompt}</legend>{question.options.map((option: string, optionIndex: number) => <label key={optionIndex} className="flex items-center gap-3 border rounded-lg p-3"><input required type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })} />{option}</label>)}</fieldset>)}<button className={primary} disabled={busy || !remaining}>{busy ? "Submitting…" : "Submit answers"}</button></fieldset></form>
      {!remaining && <button className={secondary} disabled={busy} onClick={start}>Start a new attempt</button>}
    </>}
    {result && <><h3 className="font-semibold">Assessment result</h3><RecordView value={result} /><p className="text-slate-600">Review your skill gaps and learning recommendations to plan your next steps.</p></>}
  </section>;
}
