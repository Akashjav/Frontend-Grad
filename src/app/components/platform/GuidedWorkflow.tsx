import { useState } from "react";
import { operation } from "../../../lib/platformApi";
import { useAuth } from "../../AuthContext";
import OperationPanel, { contextFromRecord } from "./OperationPanel";
import { primary, secondary } from "./styles";

type Step = [string, string];
export const workflowSteps: Record<string, Step[]> = {
  certificates: [
    ["My certificates", "GET /api/v1/certificates/me"],
    ["Find applications", "GET /api/v1/opportunities/{opportunity_id}/applications"],
    ["Issue certificate", "POST /api/v1/applications/{application_id}/certificate"],
    ["Download PDF", "GET /api/v1/certificates/{certificate_id}/download"],
    ["Verify certificate", "GET /api/v1/certificates/verify/{code}"],
    ["Revoke certificate", "POST /api/v1/certificates/{certificate_id}/revoke"],
  ],
  training: [
    ["Available programs", "GET /api/v1/students/me/training-programs"],
    ["Institution programs", "GET /api/v1/institutions/me/training-programs"],
    ["Create program", "POST /api/v1/institutions/me/training-programs"],
    ["Enroll", "POST /api/v1/training-programs/{program_id}/enroll"],
    ["Outcomes and enrollments", "GET /api/v1/institutions/me/training-programs/{program_id}/report"],
    ["Complete enrollment", "POST /api/v1/institutions/me/training-programs/{program_id}/enrollments/{enrollment_id}/complete"],
    ["Open or close program", "PATCH /api/v1/institutions/me/training-programs/{program_id}"],
  ],
  practical: [
    ["Browse assessments", "GET /api/v1/practical-assessments"],
    ["Create assessment", "POST /api/v1/practical-assessments"],
    ["Submit evidence", "POST /api/v1/practical-assessments/{practical_id}/submit"],
    ["Submissions and results", "GET /api/v1/practical-submissions"],
    ["Review submission", "POST /api/v1/practical-submissions/{submission_id}/review"],
    ["Archive assessment", "DELETE /api/v1/practical-assessments/{practical_id}"],
  ],
  collaborations: [
    ["My teams", "GET /api/v1/collaborations"],
    ["Team milestones", "GET /api/v1/collaborations/{collaboration_id}/milestones"],
    ["Create milestone", "POST /api/v1/collaborations/{collaboration_id}/milestones"],
    ["Submit evidence", "POST /api/v1/milestones/{milestone_id}/submit"],
    ["Review milestone", "POST /api/v1/milestones/{milestone_id}/review"],
    ["Team progress", "GET /api/v1/collaborations/{collaboration_id}/progress"],
  ],
};
const guidance: Record<string, string> = {
  certificates: "Select a certificate to download or verify it. Issuers can select a completed application to issue its certificate once completion feedback is recorded. Revocation requires a reason.",
  training: "Select a program to enroll or view outcomes. Institution administrators can create programs, review enrollment records and capture completion outcomes from validated skills.",
  practical: "Select an assessment to read its instructions and rubric, then submit your evidence. Assigned reviewers can select a submission and provide a score for each rubric skill. Creating assessments requires a verified reviewer account.",
  collaborations: "Select a team, then a milestone. Active members submit evidence; the team owner creates and reviews milestones. Accepted milestones determine completion progress.",
};

export default function GuidedWorkflow({ moduleId }: { moduleId: string }) {
  const { user } = useAuth();
  const steps = (workflowSteps[moduleId] || []).filter(([, key]) => operation(key).roles.includes(user?.role || ""));
  const [selected, setSelected] = useState("");
  const [context, setContext] = useState<Record<string, any>>({ domain_id: user?.profile?.domain_id ?? "" });
  const [record, setRecord] = useState<any>(null);
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const step = steps.find(([, key]) => key === selected) || steps[0];
  if (!step) return null;
  return <section className="space-y-4" aria-label={`${moduleId} workflow`}>
    <div className="rounded-xl border bg-white p-5 space-y-3">
      <h2 className="text-lg font-semibold">{moduleId === "collaborations" ? "Milestone workflow" : "Get started"}</h2>
      <p className="text-sm text-slate-600">{guidance[moduleId]}</p>
      <nav className="flex flex-wrap gap-2" aria-label="Workflow steps">{steps.map(([label, key]) => <button key={key} className={key === step[1] ? primary : secondary} aria-current={key === step[1] ? "step" : undefined} onClick={() => { setSelected(key); setRevision(v => v + 1); }}>{label}</button>)}</nav>
      {notice && <p role="status" className="text-sm text-blue-800">{notice} <button className="underline" onClick={() => { setContext({ domain_id: user?.profile?.domain_id ?? "" }); setRecord(null); setNotice(""); setRevision(v => v + 1); }}>Clear selection</button></p>}
    </div>
    <OperationPanel key={`${step[1]}-${revision}`} op={operation(step[1])} context={context} selectedRecord={record} onRecord={(op, row) => {
      const next = contextFromRecord(op, row);
      setContext(current => {
        const retained = { ...current };
        // Child identifiers must not leak into another parent's workflow.
        if (next.collaboration_id && next.collaboration_id !== current.collaboration_id) delete retained.milestone_id;
        if (next.program_id && next.program_id !== current.program_id) delete retained.enrollment_id;
        if (next.practical_id && next.practical_id !== current.practical_id) delete retained.submission_id;
        if (next.application_id && next.application_id !== current.application_id) { delete retained.certificate_id; delete retained.code; }
        return { ...retained, ...next };
      });
      setRecord(row);
      setNotice(`Selected ${row.title || row.snapshot?.title || row.name || row.code || "record"}. Choose the next step above.`);
    }} />
  </section>;
}
