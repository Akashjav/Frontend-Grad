import { useEffect, useState } from "react";
import { visibleModules, tasksFor } from "../../../lib/platformModules";
import { type Operation } from "../../../lib/platformApi";
import { renewSession } from "../../../lib/authApi";
import { useAuth } from "../../AuthContext";
import OperationPanel, { contextFromRecord } from "./OperationPanel";
import AssessmentRunner from "./AssessmentRunner";
import LiveConversation from "./LiveConversation";
import LearningRoadmap from "./LearningRoadmap";
import GuidedWorkflow, { workflowSteps } from "./GuidedWorkflow";
import { control, primary, secondary } from "./Fields";

export default function PlatformWorkspace() {
  const { user, refreshUser } = useAuth();
  const available = visibleModules(user?.role || "student");
  const [moduleId, setModuleId] = useState(() => window.location.hash.split("/")[1] || "overview");
  const module = available.find(m => m.id === moduleId) || available[0];
  const tasks = tasksFor(module?.id || "", user?.role || "student");
  const [selectedKey, setSelectedKey] = useState(""); const [search, setSearch] = useState("");
  const selected = tasks.find(t => t.key === selectedKey) || tasks[0];
  const domainContext = { domain_id: user?.profile?.domain_id ?? "" };
  const [context, setContext] = useState<Record<string, any>>(domainContext); const [record, setRecord] = useState<any>(null);
  const [selection, setSelection] = useState(""); const [revision, setRevision] = useState(0);
  const [accountMessage, setAccountMessage] = useState(""); const [renewing, setRenewing] = useState(false);
  useEffect(() => { const sync = () => { setModuleId(window.location.hash.split("/")[1] || "overview"); setSelectedKey(""); setContext(current => ({ ...current, domain_id: user?.profile?.domain_id ?? "" })); setRecord(null); setSelection(""); }; window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync); }, [user?.profile?.domain_id]);
  const chooseModule = (id: string) => { window.location.hash = `workspace/${id}`; setModuleId(id); setSelectedKey(""); setContext(current => ({ ...current, ...domainContext })); setRecord(null); setSelection(""); setSearch(""); };
  function selectRecord(op: Operation, row: any) {
    setContext(current => ({ ...current, ...contextFromRecord(op, row) })); setRecord(row);
    setSelection(row.title || row.name || row.display_name || row.email || row.topic || `Record ${row.id ?? row.document_id ?? "selected"}`);
  }
  if (!user || !module || !selected) return <main className="p-6"><p>No workspace actions are available for this account.</p></main>;
  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
  return <main className="flex-1 min-w-0 bg-slate-50 p-4 md:p-7 space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-blue-700 font-medium mb-1">GradAlumni workspace</p><h1 className="text-2xl font-bold text-slate-900">{module.title}</h1><p className="text-sm text-slate-600 mt-2">{module.description}</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 capitalize">{user.role.replaceAll("_", " ")}</span></header>
    <label className="block text-sm font-medium lg:hidden">Workspace page<select className={control} value={module.id} onChange={e => chooseModule(e.target.value)}>{available.map(m => <option value={m.id} key={m.id}>{m.title}</option>)}</select></label>
    <nav aria-label="Workspace pages" className="hidden lg:flex flex-wrap gap-2">{available.map(m => <button key={m.id} aria-current={m.id === module.id ? "page" : undefined} className={m.id === module.id ? primary : secondary} onClick={() => chooseModule(m.id)}>{m.title}</button>)}</nav>
    {module.id === "account" && <div className="bg-white border rounded-xl p-4 space-y-2"><button className={secondary} disabled={renewing} onClick={async () => { setRenewing(true); try { await renewSession(); await refreshUser(); setAccountMessage("Your session has been renewed."); } catch (e) { setAccountMessage(e instanceof Error ? e.message : "Please sign in again."); } finally { setRenewing(false); } }}>{renewing ? "Renewing…" : "Renew my session"}</button>{accountMessage && <p role="status" className="text-sm">{accountMessage}</p>}</div>}
    {selection && <div className="flex flex-wrap items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm"><span>Selected: <strong>{selection}</strong></span><button className="text-blue-700 underline" onClick={() => { setContext({}); setRecord(null); setSelection(""); setRevision(r => r + 1); }}>Clear selection</button><span className="text-slate-600">Choose an action below to use this record.</span></div>}
    {workflowSteps[module.id] && <GuidedWorkflow key={`${user.id}-${module.id}`} moduleId={module.id} />}
    <details open={!workflowSteps[module.id]} key={module.id}>
    <summary className="cursor-pointer text-sm font-semibold text-slate-700 mb-4">All {module.title.toLowerCase()} actions</summary>
    <div className="grid xl:grid-cols-[270px_minmax(0,1fr)] gap-5 items-start">
      <aside className="rounded-xl border bg-white p-4 space-y-3"><label className="block text-sm font-medium">Find an action<input className={control} type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search this page" /></label><nav aria-label={`${module.title} actions`} className="max-h-[32rem] overflow-y-auto space-y-1">{filteredTasks.map(task => <button key={task.key} className={`w-full text-left text-sm rounded-lg px-3 py-2 ${selected.key === task.key ? "bg-blue-50 text-blue-800 font-semibold" : "text-slate-600 hover:bg-slate-50"}`} onClick={() => { setSelectedKey(task.key); setRevision(r => r + 1); }}>{task.title}</button>)}{!filteredTasks.length && <p className="text-sm text-slate-500">No matching actions.</p>}</nav></aside>
      <div className="min-w-0 space-y-5">
        {selected.path === "/api/v1/students/me/learning-roadmap" ? <LearningRoadmap key={user.id} /> : selected.handler === "assessment" ? <>
          <label className="block text-sm">Assessment reference<input className={control} type="number" min={1} value={context.assessment_id || ""} onChange={e => setContext({ ...context, assessment_id: Number(e.target.value) })} /></label>
          {context.assessment_id ? <AssessmentRunner key={`${user.id}-${context.assessment_id}`} assessmentId={Number(context.assessment_id)} reassess={selected.path.endsWith("reassess")} /> : <p className="rounded-xl bg-white border p-5">Use View assessments to select an assessment, then choose Start or Reassess.</p>}
        </> : <OperationPanel key={`${selected.key}-${revision}`} op={selected} context={context} selectedRecord={record} onRecord={selectRecord} />}
        {module.id === "messages" && context.conversation_id && <LiveConversation key={`${user.id}-${context.conversation_id}`} conversationId={Number(context.conversation_id)} />}
      </div>
    </div>
    </details>
  </main>;
}
