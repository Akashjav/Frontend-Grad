import { useEffect, useId, useState } from "react";
import { catalog, execute, initialValue, normalized, type Schema } from "../../../lib/platformApi";
import { useAuth } from "../../AuthContext";

import { control, secondary } from "./styles";
export { control, primary, secondary } from "./styles";
const names: Record<string, string> = { domain_id: "Domain", discipline_id: "Discipline", opportunity_id: "Opportunity", student_id: "Student", user_id: "Person", alumni_id: "Mentor", institution_id: "Institution", skill_id: "Skill", resource_id: "Learning resource", assessment_id: "Assessment", collaboration_id: "Team", conversation_id: "Conversation", document_id: "Document reference", item_id: "Record", request_id: "Mentorship request", session_id: "Mentorship session", mentor_id: "Mentor", other_user_id: "Recipient", core: "Core skill", cross_domain: "Open to all domains and disciplines", answer: "Correct option (0 is the first option)", offset: "Skip records", limit: "Records per request", body: "Message", id: "Reference" };
export const labelFor = (name: string) => names[name] || name.replaceAll("_", " ").replaceAll("-", " ").replace(/^./, c => c.toUpperCase());

export function referencePath(name: string, module: string, role: string): string | undefined {
  if (name === "certificate_id") return role === "student" ? "/api/v1/certificates/me" : undefined;
  if (name === "program_id") return role === "student" ? "/api/v1/students/me/training-programs" : role === "institution_admin" ? "/api/v1/institutions/me/training-programs" : undefined;
  if (name === "practical_id") return "/api/v1/practical-assessments";
  if (name === "submission_id") return role !== "institution_admin" ? "/api/v1/practical-submissions" : undefined;
  if (name === "certificate_id") return role === "student" ? "/api/v1/certificates/me" : undefined;
  if (name === "program_id") return role === "student" ? "/api/v1/students/me/training-programs" : role === "institution_admin" ? "/api/v1/institutions/me/training-programs" : undefined;
  if (name === "practical_id") return "/api/v1/practical-assessments";
  if (name === "submission_id") return role !== "institution_admin" ? "/api/v1/practical-submissions" : undefined;
  const mapping: Record<string, string> = { domain_id: "/api/v1/domains", discipline_id: "/api/v1/disciplines", institution_id: "/api/v1/institutions", skill_id: "/api/v1/skills", competency_id: "/api/v1/competencies", opportunity_id: "/api/v1/opportunities", assessment_id: "/api/v1/assessments", resource_id: "/api/v1/learning/resources", collaboration_id: "/api/v1/collaborations", conversation_id: "/api/v1/conversations", community_id: "/api/v1/communities", event_id: "/api/v1/events", notification_id: "/api/v1/notifications", project_id: "/api/v1/projects", request_id: "/api/v1/mentorship/requests", session_id: "/api/v1/mentorship/sessions", job_id: "/api/jobs/", plan_id: "/api/subscription-plans", match_id: undefined as any, application_id: role === "student" ? "/api/v1/students/me/applications" : undefined as any, gap_id: "/api/v1/students/me/skill-gaps" };
  if (["user_id", "student_id", "other_user_id", "mentor_id", "alumni_id"].includes(name)) return ["admin", "super_admin"].includes(role) ? "/api/v1/admin/users" : "/api/v1/mentors";
  if (name === "item_id") return module === "portfolio" ? "/api/v1/students/me/portfolio" : "/api/v1/projects";
  return mapping[name];
}
function ReferenceField({ name, schema: propsSchema, value, onChange, required, module, values }: FieldProps) {
  const { user } = useAuth(); const id = useId();
  const [rows, setRows] = useState<any[]>([]); const [message, setMessage] = useState("");
  const path = name === "alumni_id" && normalized(propsSchema).type === "integer" ? "/api/alumni/" : referencePath(name, module, user?.role || "student");
  useEffect(() => {
    const abort = new AbortController(); setRows([]); setMessage("");
    const op = catalog.find(o => o.path === path && o.method === "GET");
    if (op) execute(op, { limit: 200, ...(values?.domain_id ? { domain_id: values.domain_id } : {}) }, undefined, abort.signal).then(data => {
      if (!abort.signal.aborted) setRows(Array.isArray(data) ? data : data.items || []);
    }).catch(e => { if (!abort.signal.aborted) setMessage(e.message); });
    return () => abort.abort();
  }, [path, values?.domain_id]);
  return <label className="block text-sm font-medium text-slate-700">{labelFor(name)}{required ? " *" : ""}
    <input className={control} list={id} value={value ?? ""} required={required} placeholder="Choose a record or enter its reference" onChange={e => onChange(e.target.value)} />
    <datalist id={id}>{rows.map((r, i) => <option key={`${r.id ?? r.user_id}-${i}`} value={String(r.id ?? r.user_id ?? r.session_id ?? r.request_id ?? "")}>{r.name || r.title || r.display_name || r.email || r.topic || r.skill_name || `Record ${r.id}`}{r.status ? ` · ${r.status}` : ""}</option>)}</datalist>
    {name === "discipline_id" && !required && <button type="button" className="text-xs text-blue-700 mt-1" onClick={() => onChange(null)}>Clear discipline restriction</button>}
    {message && <span className="block font-normal text-xs text-amber-800 mt-1">Could not load suggestions: {message}</span>}
  </label>;
}
export type FieldProps = { name: string; schema: Schema; value: any; onChange: (value: any) => void; required?: boolean; module: string; values?: Record<string, any> };
export function Field(props: FieldProps) {
  const { name, value, onChange, required, module, values } = props; const schema = normalized(props.schema);
  const [entry, setEntry] = useState(""); const [entryError, setEntryError] = useState("");
  const title = labelFor(name);
  if (schema.type === "object" || schema.properties) {
    if (schema.properties) return <fieldset className="space-y-4 min-w-0"><legend className="font-semibold text-sm mb-3">{title}</legend>{Object.entries(schema.properties).map(([key, child]) => <Field key={key} name={key} schema={child} value={value?.[key]} required={schema.required?.includes(key)} onChange={v => onChange({ ...(value || {}), [key]: v, ...(key === "domain_id" && schema.properties?.discipline_id ? { discipline_id: null } : {}) })} module={module} values={{ ...values, ...value }} />)}</fieldset>;
    return <fieldset className="border border-slate-200 rounded-lg p-3 space-y-3"><legend className="text-sm font-medium">{title}</legend>
      {Object.entries(value || {}).map(([key, v]) => <div key={key} className="flex gap-2 items-end"><div className="flex-1"><Field name={key} schema={typeof schema.additionalProperties === "object" ? schema.additionalProperties : { type: "string" }} value={v} required onChange={next => onChange({ ...value, [key]: next })} module={module} /></div><button type="button" className={secondary} onClick={() => { const copy = { ...value }; delete copy[key]; onChange(copy); }}>Remove</button></div>)}
      <label className="block text-sm">{["scores", "skill_weights"].includes(name) ? "Skill reference" : "Entry name"}<input className={control} value={entry} onChange={e => setEntry(e.target.value)} /></label>
      <button type="button" className={secondary} onClick={() => { const key = entry.trim(); if (!key || ["__proto__", "constructor", "prototype"].includes(key) || Object.hasOwn(value || {}, key)) { setEntryError("Enter a new, valid entry name."); return; } onChange({ ...value, [key]: "" }); setEntry(""); setEntryError(""); }}>Add entry</button>{entryError && <p role="alert" className="text-red-700 text-sm">{entryError}</p>}
    </fieldset>;
  }
  if (schema.type === "array") return <fieldset className="rounded-lg border border-slate-200 p-3 space-y-3"><legend className="text-sm font-medium">{title}</legend>
    {(value || []).map((item: any, index: number) => <div key={index} className="border-b border-slate-100 pb-3 space-y-2"><Field name={`${title} ${index + 1}`} schema={schema.items || { type: "string" }} value={item} required onChange={next => onChange(value.map((v: any, i: number) => i === index ? next : v))} module={module} values={values} /><button type="button" className="text-sm text-red-700" onClick={() => onChange(value.filter((_: any, i: number) => i !== index))}>Remove entry {index + 1}</button></div>)}
    <button type="button" className={secondary} disabled={(value || []).length >= (schema.maxItems ?? 200)} onClick={() => onChange([...(value || []), initialValue(schema.items || {})])}>Add {title.toLowerCase()} entry</button>
  </fieldset>;
  if (name.endsWith("_id") && schema.format !== "binary") return <ReferenceField {...props} />;
  const common = { className: control, required, value: value ?? "", onChange: (e: any) => onChange(e.target.value) };
  if (name === "two_factor_enabled") return <p className="text-sm text-slate-600">Two-factor authentication is not available yet. Sign-in alert preferences can be changed below.</p>;
  return <label className="block text-sm font-medium text-slate-700">{title}{required ? " *" : ""}
    {schema.format === "binary" ? <input className={control} type="file" accept={module === "documents" ? ".pdf,.png,.jpg,.jpeg" : undefined} required={required} onChange={e => onChange(e.target.files?.[0])} />
      : schema.enum ? <select {...common}><option value="">Select {title.toLowerCase()}</option>{schema.enum.map(option => <option key={String(option)} value={String(option)}>{labelFor(String(option))}</option>)}</select>
      : schema.type === "boolean" ? <select {...common}><option value="">{required ? "Choose" : "Keep unchanged"}</option><option value="true">Yes</option><option value="false">No</option></select>
      : ["text", "description", "bio", "message", "body", "comment", "content"].includes(name) ? <textarea {...common} rows={4} minLength={schema.minLength} maxLength={schema.maxLength} />
      : <input {...common} type={schema.type === "number" || schema.type === "integer" ? "number" : schema.format === "date-time" ? "datetime-local" : schema.format === "date" ? "date" : schema.format === "email" ? "email" : name.includes("password") ? "password" : schema.format === "uri" ? "url" : "text"} min={schema.minimum ?? schema.exclusiveMinimum} max={schema.maximum} minLength={schema.minLength} maxLength={schema.maxLength} step={schema.type === "integer" ? 1 : schema.type === "number" ? "any" : undefined} />}
  </label>;
}
