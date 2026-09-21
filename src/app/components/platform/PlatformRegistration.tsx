import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../lib/api";
import { verifyEmail, resendVerification } from "../../../lib/authApi";
import type { Page } from "../../types";
import { control, primary, secondary } from "./styles";

export default function PlatformRegistration({ navigate, initialRole = "student" }: { navigate: (page: Page) => void; initialRole?: string }) {
  const [form, setForm] = useState({ role: initialRole, display_name: "", email: "", password: "", domain_id: "", discipline_id: "" });
  const [domains, setDomains] = useState<any[]>([]); const [disciplines, setDisciplines] = useState<any[]>([]);
  const [stage, setStage] = useState("register"); const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => { let active = true; api.get("/api/v1/domains").then(data => { if (active) setDomains(data); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, []);
  useEffect(() => { let active = true; setDisciplines([]); if (form.domain_id) api.get(`/api/v1/domains/${form.domain_id}/disciplines`).then(data => { if (active) setDisciplines(data); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, [form.domain_id]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (stage === "register") {
        await api.post("/api/v1/auth/signup", { ...form, domain_id: Number(form.domain_id), discipline_id: form.discipline_id ? Number(form.discipline_id) : null });
        setForm(current => ({ ...current, password: "" })); setStage("verify"); setMessage("Check your email for your verification code.");
      } else { await verifyEmail(form.email, code); setStage("complete"); setMessage("Your email is verified. You can now sign in."); }
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to continue."); } finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-slate-50 p-6"><section className="max-w-xl mx-auto bg-white border rounded-2xl p-8 space-y-5"><h1 className="text-2xl font-bold">{stage === "register" ? "Join GradAlumni" : stage === "verify" ? "Verify your email" : "Account ready"}</h1>
    <p className="text-slate-600">Connect through your role, domain and discipline.</p>{error && <p role="alert" className="text-red-700 bg-red-50 p-3 rounded-lg">{error}</p>}{message && <p role="status" className="text-blue-800 bg-blue-50 p-3 rounded-lg">{message}</p>}
    {stage !== "complete" && <form className="space-y-4" onSubmit={submit}><fieldset disabled={busy} className="space-y-4">
      {stage === "register" && <><label className="block text-sm">Your role<select className={control} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{["student", "alumni", "academician", "industry"].map(role => <option key={role} value={role}>{role === "academician" ? "Faculty / academician" : role[0].toUpperCase() + role.slice(1)}</option>)}</select></label>
        <label className="block text-sm">Full name<input required maxLength={200} className={control} autoComplete="name" value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} /></label></>}
      <label className="block text-sm">Email<input required type="email" className={control} autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      {stage === "register" ? <><label className="block text-sm">Password (at least 10 characters)<input required type="password" minLength={10} maxLength={128} autoComplete="new-password" className={control} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <label className="block text-sm">Domain<select required className={control} value={form.domain_id} onChange={e => setForm({ ...form, domain_id: e.target.value, discipline_id: "" })}><option value="">Choose a domain</option>{domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label className="block text-sm">Discipline<select className={control} value={form.discipline_id} onChange={e => setForm({ ...form, discipline_id: e.target.value })}><option value="">Not specified</option>{disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        {!domains.length && <p className="text-sm text-amber-800">The domain catalogue must be available before registration. Check the backend connection or ask an administrator to load it.</p>}
      </> : <label className="block text-sm">Verification code<input required minLength={6} autoComplete="one-time-code" className={control} value={code} onChange={e => setCode(e.target.value)} /></label>}
      <button className={primary} disabled={busy || (stage === "register" && !domains.length)}>{busy ? "Please wait…" : stage === "register" ? "Create account" : "Verify email"}</button>
    </fieldset></form>}
    <div className="flex flex-wrap gap-3">{stage === "register" && <button className={secondary} onClick={() => { setStage("verify"); setError(""); }}>Already registered? Verify email</button>}{stage === "verify" && <button className={secondary} disabled={busy || !form.email} onClick={async () => { setBusy(true); setError(""); try { await resendVerification(form.email); setMessage("A verification code has been requested. Check your email."); } catch (e) { setError(e instanceof Error ? e.message : "Unable to resend."); } finally { setBusy(false); } }}>Resend code</button>}<button className={secondary} onClick={() => navigate("login")}>Go to sign in</button></div>
    <p className="text-xs text-slate-500">Administrator and institution administrator accounts are assigned by a platform administrator.</p>
  </section></main>;
}
