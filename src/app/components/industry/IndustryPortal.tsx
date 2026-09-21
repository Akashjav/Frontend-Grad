import { useEffect, useState, type FormEvent } from "react";
import { industryApi, type Domain, type Opportunity, type Requirement, type Application, type Candidate } from "../../../lib/industryApi";
import { userName } from "../../../lib/currentUser";
import { useAuth } from "../../AuthContext";
import type { Page } from "../../types";

const input = "block w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 bg-white";
const button = "rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-50";
const box = "rounded-xl border border-slate-200 bg-white p-5 space-y-4";
const transitions: Record<string, string[]> = { applied: ["shortlisted", "rejected"], shortlisted: ["interview", "selected", "rejected"], interview: ["selected", "rejected"], selected: ["started"], started: ["completed"] };

export default function IndustryPortal({ page, navigate }: { page: Page; navigate: (page: Page) => void }) {
  const { user, refreshUser } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(0);
  const opportunity = opportunities.find(o => String(o.id) === selected);
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    Promise.all([industryApi.domains(), industryApi.opportunities()]).then(([d, o]) => {
      if (active) { setDomains(d); setOpportunities(o); setSelected(current => o.some(x => String(x.id) === current) ? current : String(o[0]?.id ?? "")); }
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);
  async function act(work: () => Promise<unknown>, success: string) {
    setBusy(true); setError(""); setMessage("");
    try { await work(); setMessage(success); setRevision(r => r + 1); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to save changes."); }
    finally { setBusy(false); }
  }
  const titles: Record<string, string> = { "industry-dashboard": "Industry dashboard", "industry-opportunities": "Your opportunities", "industry-applications": "Applications", "industry-matches": "Candidate matches", "industry-profile": "Company profile" };
  return <main className="flex-1 min-w-0 bg-slate-50 p-4 md:p-8 space-y-6">
    <header><p className="text-sm text-blue-700 mb-1">{user?.profile?.organization_name || userName(user)}</p><h1 className="text-2xl font-bold text-slate-900">{titles[page]}</h1>
      <p className="text-sm text-slate-600 mt-2">Primary domain: {domains.find(d => d.id === user?.profile?.domain_id)?.name || "Not set"}</p></header>
    {error && <div role="alert" className="rounded-lg bg-red-50 text-red-700 p-4">{error} <button className="underline ml-3" onClick={() => setRevision(r => r + 1)}>Reload</button></div>}
    {message && <p role="status" className="rounded-lg bg-blue-50 text-blue-700 p-4">{message}</p>}
    {loading ? <p role="status">Loading industry workspace…</p> : <>
      {page === "industry-dashboard" && <>
        <div className="grid sm:grid-cols-3 gap-4">{[["Your opportunities", opportunities.length], ["Published", opportunities.filter(o => o.status === "published").length], ["Awaiting approval", opportunities.filter(o => o.status === "draft" && !o.approved).length]].map(([label, value]) => <div key={label} className={box}><p className="text-slate-600">{label}</p><p className="text-3xl font-bold">{value}</p></div>)}</div>
        <div className={box}><h2 className="font-semibold">Recruit for your domain or collaborate across domains</h2><p className="text-slate-600">Create an opportunity, add required skills, then publish after administrator approval. Matching uses validated candidate skills and the opportunity's domain eligibility.</p><button className={button} onClick={() => navigate("industry-opportunities")}>Manage opportunities</button></div>
      </>}
      {page === "industry-profile" && <CompanyProfile key={user?.profile?.organization_name} domains={domains} busy={busy} save={data => act(async () => { await industryApi.profile(data); await refreshUser(); }, "Company profile saved.")} />}
      {page === "industry-opportunities" && <OpportunityForm domains={domains} busy={busy} create={data => act(async () => { const row = await industryApi.create(data); setSelected(String(row.id)); }, "Draft saved. Add skill requirements below; an administrator must approve it before publication.")} />}
      {["industry-opportunities", "industry-applications", "industry-matches"].includes(page) && <section className={box}>
        <label className="block font-medium">Select your opportunity<select className={input} value={selected} onChange={e => { setSelected(e.target.value); setMessage(""); }}><option value="">Select an opportunity</option>{opportunities.map(o => <option key={o.id} value={o.id}>{o.title} ({o.status})</option>)}</select></label>
        {!opportunities.length && <p className="text-slate-600">You have no opportunities yet. Create your first draft in Opportunities.</p>}
        {opportunity && <>
          <p className="text-sm text-slate-600">{domains.find(d => d.id === opportunity.domain_id)?.name} · {opportunity.cross_domain ? "Open across domains and disciplines" : "Restricted to the specified domain and discipline"} · {opportunity.status}</p>
          {page === "industry-opportunities" && <>
            <p>{opportunity.description}</p>
            <Requirements key={`${opportunity.id}-${revision}`} opportunity={opportunity} busy={busy} add={(skill, level) => act(() => industryApi.addRequirement(opportunity.id, skill, level), "Requirement saved. Administrator approval is required again.")} />
            <div className="flex flex-wrap gap-3"><button className={button} disabled={busy || !opportunity.approved || opportunity.status !== "draft"} onClick={() => act(() => industryApi.publish(opportunity.id), "Opportunity published.")}>Publish approved draft</button><button className="border rounded-lg px-4 py-2 disabled:opacity-50" disabled={busy || opportunity.status === "archived"} onClick={() => act(() => industryApi.archive(opportunity.id), "Opportunity archived.")}>Archive</button></div>
            {!opportunity.approved && <p className="text-sm text-amber-800">Administrator approval is required before publication. Reload after approval to enable Publish.</p>}
          </>}
          {page === "industry-applications" && <Applications key={`${opportunity.id}-${revision}`} id={opportunity.id} busy={busy} transition={(id, status) => act(() => industryApi.status(id, status), "Application status updated.")} />}
          {page === "industry-matches" && <Matches key={opportunity.id} id={opportunity.id} />}
        </>}
      </section>}
    </>}
    <button className="text-blue-700 text-sm" disabled={busy} onClick={() => setRevision(r => r + 1)}>Refresh workspace</button>
  </main>;
}

function CompanyProfile({ domains, busy, save }: { domains: Domain[]; busy: boolean; save: (data: object) => Promise<void> }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.profile?.organization_name || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [domain, setDomain] = useState(String(user?.profile?.domain_id || ""));
  return <form className={box} onSubmit={e => { e.preventDefault(); void save({ organization_name: name, bio, domain_id: Number(domain), ...(Number(domain) !== user?.profile?.domain_id ? { discipline_id: null } : {}) }); }}>
    <label className="block">Company name<input required maxLength={200} className={input} value={name} onChange={e => setName(e.target.value)} /></label>
    <label className="block">Primary domain<select required className={input} value={domain} onChange={e => setDomain(e.target.value)}><option value="">Select a domain</option>{domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
    <label className="block">About your company<textarea maxLength={5000} rows={4} className={input} value={bio} onChange={e => setBio(e.target.value)} /></label>
    <button className={button} disabled={busy}>Save company profile</button>
  </form>;
}

function OpportunityForm({ domains, busy, create }: { domains: Domain[]; busy: boolean; create: (data: object) => Promise<void> }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", domain_id: String(user?.profile?.domain_id || ""), discipline_id: "", kind: "internship", location: "Remote", cross_domain: false });
  const [disciplines, setDisciplines] = useState<Domain[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setDisciplines([]); setError(""); if (form.domain_id) industryApi.disciplines(Number(form.domain_id)).then(d => { if (active) setDisciplines(d); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, [form.domain_id]);
  function submit(e: FormEvent) { e.preventDefault(); void create({ ...form, domain_id: Number(form.domain_id), discipline_id: form.discipline_id ? Number(form.discipline_id) : null }); }
  return <form className={box} onSubmit={submit}>
    <h2 className="font-semibold text-lg">Create an opportunity</h2>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <div className="grid sm:grid-cols-2 gap-4"><label>Title<input required maxLength={200} className={input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Type<select className={input} value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}>{["internship", "job", "project", "research", "consultancy", "fdp", "faculty_internship", "workshop"].map(k => <option key={k} value={k}>{k.replaceAll("_", " ")}</option>)}</select></label>
    <label>Domain<select required className={input} value={form.domain_id} onChange={e => setForm({ ...form, domain_id: e.target.value, discipline_id: "" })}><option value="">Select a domain</option>{domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label><label>Discipline<select className={input} value={form.discipline_id} onChange={e => setForm({ ...form, discipline_id: e.target.value })}><option value="">All disciplines in this domain</option>{disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label></div>
    <label className="block">Description<textarea required maxLength={20000} rows={4} className={input} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
    <label className="block">Location<input required maxLength={200} className={input} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></label>
    <label className="flex gap-2 items-center"><input type="checkbox" checked={form.cross_domain} onChange={e => setForm({ ...form, cross_domain: e.target.checked })} />Accept candidates across all domains and disciplines</label>
    <button className={button} disabled={busy || !domains.length}>Save draft</button>
  </form>;
}

function Requirements({ opportunity, busy, add }: { opportunity: Opportunity; busy: boolean; add: (skill: number, level: number) => Promise<void> }) {
  const [skills, setSkills] = useState<Domain[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState(60);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; Promise.all([industryApi.skills(opportunity.cross_domain ? undefined : opportunity.domain_id), industryApi.requirements(opportunity.id)]).then(([s, r]) => { if (active) { setSkills(s); setRequirements(r); } }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [opportunity.id, opportunity.cross_domain, opportunity.domain_id]);
  return <div className="border-t pt-4 space-y-3"><h3 className="font-semibold">Required skills</h3>{error && <p role="alert" className="text-red-700">{error}</p>}{loading ? <p role="status">Loading requirements…</p> : <>
    {!requirements.length && <p className="text-slate-600">Add at least one skill before publication.</p>}
    {requirements.map(r => <p key={r.id}>{skills.find(s => s.id === r.skill_id)?.name || `Skill ${r.skill_id}`}: {r.level}/100</p>)}
    <form className="flex flex-wrap gap-3 items-end" onSubmit={e => { e.preventDefault(); void add(Number(skill), level); }}>
      <label className="flex-1 min-w-40">Skill<select required className={input} value={skill} onChange={e => setSkill(e.target.value)}><option value="">Select a skill</option>{skills.filter(s => !requirements.some(r => r.skill_id === s.id)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label>Minimum score<input type="number" min={1} max={100} required className={input} value={level} onChange={e => setLevel(Number(e.target.value))} /></label><button className={button} disabled={busy || opportunity.status === "archived" || !skill}>Add requirement</button>
    </form>
  </>}</div>;
}

function Applications({ id, busy, transition }: { id: number; busy: boolean; transition: (id: number, status: string) => Promise<void> }) {
  const [rows, setRows] = useState<Application[]>([]);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; industryApi.applications(id).then(r => { if (active) setRows(r); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  return <div className="space-y-4">{error && <p role="alert" className="text-red-700">{error}</p>}{loading ? <p role="status">Loading applications…</p> : !error && !rows.length ? <p>No applications yet.</p> : rows.map(row => <article key={row.id} className="border rounded-lg p-4 space-y-3"><h3 className="font-semibold">Application #{row.id}</h3><p className="text-sm break-all">Candidate: {row.student_id}</p><p className="capitalize">{row.status} · Progress {row.progress}%</p><div className="flex flex-wrap gap-2">{(transitions[row.status] || []).map(status => <button key={status} disabled={busy} className={button} onClick={() => transition(row.id, status)}>{status}</button>)}</div></article>)}</div>;
}

function Matches({ id }: { id: number }) {
  const [faculty, setFaculty] = useState(false); const [rows, setRows] = useState<Candidate[]>([]);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; setLoading(true); setRows([]); setError(""); industryApi.matches(id, faculty).then(r => { if (active) setRows(r); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id, faculty]);
  return <div className="space-y-4"><label className="block">Candidate group<select className={input} value={faculty ? "faculty" : "students"} onChange={e => setFaculty(e.target.value === "faculty")}><option value="students">Students</option><option value="faculty">Faculty</option></select></label><p className="text-sm text-slate-600">Only eligible, discoverable profiles are shown. Match scores use validated skills; they do not create applications.</p>{error && <p role="alert" className="text-red-700">{error}</p>}{loading ? <p role="status">Finding matches…</p> : !error && !rows.length ? <p>No eligible candidates found.</p> : rows.map(row => <article key={row.user_id} className="border rounded-lg p-4"><h3 className="font-semibold">{row.display_name}</h3><p>Match score: {row.score.toFixed(1)}</p><p className="text-sm text-slate-600">{row.skill_gaps.length} skill gaps</p></article>)}</div>;
}
