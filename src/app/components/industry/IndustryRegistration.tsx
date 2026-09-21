import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../lib/api";
import { verifyEmail, resendVerification } from "../../../lib/authApi";
import type { Page } from "../../types";

export default function IndustryRegistration({ navigate }: { navigate: (page: Page) => void }) {
  const [domains, setDomains] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({ display_name: "", email: "", password: "", domain_id: "" });
  const [code, setCode] = useState("");
  const [created, setCreated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { let active = true; api.get("/api/v1/domains").then(data => { if (active) setDomains(data); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (created) { await verifyEmail(form.email, code); setVerified(true); }
      else {
        await api.post("/api/v1/auth/signup", { ...form, domain_id: Number(form.domain_id), role: "industry" });
        setCreated(true); setForm(f => ({ ...f, password: "" }));
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to continue."); }
    finally { setBusy(false); }
  }
  const input = "block w-full rounded-lg border border-slate-300 p-3 mt-1";
  return <main className="min-h-screen bg-slate-50 p-6"><section className="max-w-lg mx-auto bg-white border rounded-2xl p-8">
    <h1 className="text-2xl font-bold">Create an industry account</h1>
    <p className="text-slate-600 my-4">Publish opportunities and find candidates. Add your company details after signing in.</p>
    {error && <p role="alert" className="text-red-700 my-3">{error}</p>}
    {message && <p role="status" className="text-blue-700 my-3">{message}</p>}
    {verified ? <p role="status" className="my-6">Your email is verified. Select Industry on the sign-in page to continue.</p> : <form onSubmit={submit} className="space-y-4">
      {!created ? <>
        <label className="block">Contact name<input required maxLength={200} value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} className={input} /></label>
        <label className="block">Work email<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={input} /></label>
        <label className="block">Password (at least 10 characters)<input required minLength={10} maxLength={128} type="password" autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={input} /></label>
        <label className="block">Primary domain<select required value={form.domain_id} onChange={e => setForm({ ...form, domain_id: e.target.value })} className={input}><option value="">Select a domain</option>{domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        {!domains.length && <p className="text-sm text-slate-600">No domains loaded. An administrator must configure the domain catalogue before registration.</p>}
      </> : <><p>A verification code has been requested for {form.email}.</p><label className="block">Email code<input required minLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} className={input} /></label></>}
      <button disabled={busy || (!created && !domains.length)} className="bg-blue-600 text-white rounded-lg p-3 w-full disabled:opacity-50">{busy ? "Please wait…" : created ? "Verify email" : "Create account"}</button>
    </form>}
    {!created && <button className="text-blue-700 mt-4" onClick={() => setCreated(true)}>Already registered? Verify your email</button>}
    {created && !verified && <>
      <label className="block mt-4">Account email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={input} /></label>
      <button disabled={busy || !form.email} className="text-blue-700 mt-4" onClick={async () => {
        setBusy(true); setError("");
        try { await resendVerification(form.email); setMessage("Another verification code has been requested."); }
        catch (e) { setError(e instanceof Error ? e.message : "Unable to resend."); } finally { setBusy(false); }
      }}>Resend code</button>
    </>}
    <button onClick={() => navigate("login")} className="block mt-5 text-blue-700">Go to sign in</button>
  </section></main>;
}
