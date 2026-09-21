import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Briefcase, Check, CheckCircle2, Circle, FileText, Github, GraduationCap, Linkedin, Mail, MapPin, Pencil, ShieldCheck, Sparkles, Target, Upload, UserRound, Zap } from "lucide-react";
import { useAuth } from "../AuthContext";
import { profileSkills, safeProfileUrl, userName, userSubtitle, type CurrentUser } from "../../lib/currentUser";
import { updateAccountProfile } from "../../lib/profileApi";
import { getDocuments, uploadDocument } from "../../lib/documentApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Badge from "./Badge";
import Btn from "./Btn";
import "../../styles/profile.css";

function accountForm(user: CurrentUser | null) {
  return {
    display_name: user?.profile?.display_name ?? user?.full_name ?? user?.student_profile?.full_name ?? user?.alumni_profile?.full_name ?? "",
    headline: user?.profile?.headline ?? "",
    company: user?.profile?.company ?? "",
    location: user?.profile?.location ?? "",
    bio: user?.profile?.bio ?? "",
  };
}

function documentList(data: any): any[] {
  if (Array.isArray(data)) return data;
  return [data?.documents, data?.items, data?.results, data?.data].find(Array.isArray) ?? [];
}

function documentError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to load verification documents.";
  return /student profile not found/i.test(message)
    ? "Verification is unavailable because your student record is missing. Please contact your administrator to restore it."
    : message;
}

function Panel({ title, icon, children, action }: { title: string; icon: ReactNode; children: ReactNode; action?: ReactNode }) {
  return <section className="profile-panel">
    <div className="profile-panel-heading"><div className="profile-section-icon">{icon}</div><h2>{title}</h2>{action}</div>
    {children}
  </section>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="profile-empty">{children}</p>;
}

function StudentVerification({ user }: { user: CurrentUser }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("college_id");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    let active = true;
    getDocuments().then(data => { if (active) setDocuments(documentList(data)); })
      .catch(err => { if (active) setLoadError(documentError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function upload() {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError("");
    setSuccess("");
    try {
      await uploadDocument(documentType, file);
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      setSuccess("Document uploaded. Your submission is ready for review.");
      try {
        setDocuments(documentList(await getDocuments()));
        setLoadError("");
      } catch (err) { setLoadError(documentError(err)); }
      // Refresh errors must not turn a successful upload into a failed upload.
      await refreshUser().catch(() => {});
    } catch (err) {
      setUploadError(documentError(err));
    } finally { setUploading(false); }
  }

  const status = user.student_profile?.verification_status || "not submitted";
  return <Panel title="Student verification" icon={<ShieldCheck size={19} />}>
    <div className="profile-verification-status"><Badge color={status === "approved" ? "green" : status === "rejected" ? "red" : "amber"}>{status.replaceAll("_", " ")}</Badge></div>
    <p className="profile-helper">Verify your student status with a college ID, bonafide certificate, or marksheet.</p>
    <label className="profile-field" htmlFor="document-type">Document type
      <select id="document-type" value={documentType} onChange={e => setDocumentType(e.target.value)} disabled={uploading}>
        <option value="college_id">College ID</option><option value="bonafide">Bonafide certificate</option><option value="marksheet">Marksheet</option><option value="other">Other</option>
      </select>
    </label>
    <label className="profile-upload" htmlFor="verification-file">
      <Upload size={22} /><span>{file ? file.name : "Choose a document"}</span><small>PDF, JPG or PNG</small>
      <input ref={fileInput} id="verification-file" type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={uploading} onChange={e => { setFile(e.target.files?.[0] ?? null); setUploadError(""); setSuccess(""); }} />
    </label>
    <Btn fullWidth size="sm" icon={<Upload size={14} />} onClick={upload} disabled={!file || uploading}>{uploading ? "Uploading..." : "Upload document"}</Btn>
    {uploadError && <p role="alert" className="profile-message error">{uploadError}</p>}
    {success && <p role="status" className="profile-message success">{success}</p>}
    {loadError && <p role="alert" className="profile-message error">{loadError}</p>}
    <div className="profile-documents">
      {loading ? <p className="profile-helper" role="status">Loading documents...</p> : documents.length ? documents.map(doc => <div className="profile-document" key={doc.id}>
        <FileText size={16} /><span>{String(doc.document_type || "Document").replaceAll("_", " ")}</span><Badge color={doc.verification_status === "approved" ? "green" : doc.verification_status === "rejected" ? "red" : "amber"}>{doc.verification_status || "pending"}</Badge>
      </div>) : !loadError && <p className="profile-helper">No documents uploaded yet.</p>}
    </div>
  </Panel>;
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => accountForm(user));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");

  if (!user) return null;
  const name = userName(user);
  const student = user.student_profile;
  const alumni = user.alumni_profile;
  const isStudent = user.role === "student";
  const details = isStudent ? student : alumni;
  const skills = profileSkills(isStudent ? student?.skills : alumni?.mentorship_areas);
  const linkedin = safeProfileUrl(details?.linkedin_url);
  const github = safeProfileUrl(student?.github_url);
  const company = user.profile?.company ?? alumni?.current_company;
  const verified = user.is_verified || student?.verification_status === "approved";
  const checklist = [
    { label: "Add your name", complete: Boolean(accountForm(user).display_name.trim()) },
    { label: "Write a headline", complete: Boolean(user.profile?.headline?.trim()) },
    { label: "Add your location", complete: Boolean(user.profile?.location?.trim()) },
    { label: "Tell your story", complete: Boolean(user.profile?.bio?.trim()) },
  ];
  const completed = checklist.filter(item => item.complete).length;
  const completion = Math.round(completed / checklist.length * 100);

  function editProfile() {
    setForm(accountForm(user));
    setSaveError("");
    setNotice("");
    setEditing(true);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !form.display_name.trim()) return;
    setSaving(true);
    setSaveError("");
    const payload = {
      display_name: form.display_name.trim(), headline: form.headline.trim(),
      company: form.company.trim(), location: form.location.trim(), bio: form.bio.trim(),
    };
    try {
      await updateAccountProfile(payload);
      updateProfile(payload);
      setEditing(false);
      setNotice("Your profile has been updated.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unable to save your profile. Please try again.");
    } finally { setSaving(false); }
  }

  return <main className="profile-page">
    <div className="profile-container">
      <div className="profile-page-heading"><div><p className="profile-eyebrow">YOUR GRADALUMNI SPACE</p><h1>My profile</h1><p>A little about you. A world of connections ahead.</p></div><span className="profile-private-note"><UserRound size={14} /> Your personal profile</span></div>

      <section className="profile-hero" aria-label="Profile overview">
        <div className="profile-cover"><div><GraduationCap size={24} /><span>Learn. Connect. Grow.</span></div><span className="profile-cover-caption">Your next chapter starts here.</span></div>
        <div className="profile-identity">
          <div className="profile-avatar" aria-label={name}>{name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}</div>
          <div className="profile-identity-copy"><div className="profile-name-row"><h2>{name}</h2><Badge color="blue">{user.role === "admin" ? "Administrator" : user.role === "alumni" ? "Alumni" : "Student"}</Badge></div>
            <p className="profile-headline">{userSubtitle(user)}</p>
            <div className="profile-meta">
              {user.profile?.location && <span><MapPin size={14} />{user.profile.location}</span>}
              {company && <span><Briefcase size={14} />{company}</span>}
              <span className={verified ? "profile-verified" : ""}><ShieldCheck size={14} />{verified ? "Verified account" : "Not verified yet"}</span>
            </div>
          </div>
          <div className="profile-actions">
            <Btn icon={<Pencil size={15} />} onClick={editProfile}>Edit profile</Btn>
            {linkedin && <a className="profile-link-button" href={linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15} />LinkedIn<ArrowUpRight size={14} /></a>}
          </div>
        </div>
        <div className="profile-facts">
          <div><GraduationCap size={18} /><span><small>Department</small><strong>{details?.department || "Not added yet"}</strong></span></div>
          <div><Briefcase size={18} /><span><small>{isStudent ? "Year of study" : "Graduation year"}</small><strong>{isStudent ? (student?.year_of_study ? `Year ${student.year_of_study}` : "Not added yet") : alumni?.graduation_year ?? "Not added yet"}</strong></span></div>
          <div><Zap size={18} /><span><small>{isStudent ? "Skills & interests" : "Mentorship areas"}</small><strong>{skills.length ? `${skills.length} ${skills.length === 1 ? "area" : "areas"} added` : "Ready to discover"}</strong></span></div>
        </div>
      </section>
      {notice && <p role="status" className="profile-message success"><CheckCircle2 size={17} />{notice}</p>}

      <div className="profile-layout">
        <div className="profile-main-column">
          <Tabs defaultValue="about" className="profile-tabs">
            <TabsList aria-label="Profile sections" className="profile-tab-list"><TabsTrigger value="about">Overview</TabsTrigger><TabsTrigger value="background">{isStudent ? "Education" : "Experience"}</TabsTrigger><TabsTrigger value="skills">Skills & interests</TabsTrigger></TabsList>
            <TabsContent value="about" className="profile-tab-content">
              <Panel title="About me" icon={<UserRound size={19} />} action={<button className="profile-edit-link" onClick={editProfile} aria-label="Edit about me"><Pencil size={15} /></button>}>
                {user.profile?.bio ? <p className="profile-body-text">{user.profile.bio}</p> : <div className="profile-about-empty"><h3>Your story belongs here</h3><p>Share what you’re learning, what inspires you, and where you’d like to go next.</p><button className="profile-text-button" onClick={editProfile}>Write a short introduction <ArrowUpRight size={15} /></button></div>}
              </Panel>
              <Panel title={isStudent ? "Career aspirations" : "Mentorship & availability"} icon={<Target size={19} />}>
                {isStudent ? student?.career_goals ? <p className="profile-body-text">{student.career_goals}</p> : <EmptyState>Your career goals will appear here when added to your student profile.</EmptyState> : <>
                  {alumni?.availability ? <p className="profile-body-text">{alumni.availability}</p> : <EmptyState>No mentorship availability added yet.</EmptyState>}
                  {skills.length > 0 && <div className="profile-skill-list">{skills.map(skill => <Badge key={skill} color="indigo">{skill}</Badge>)}</div>}
                </>}
              </Panel>
              <Panel title={isStudent ? "Skills & interests" : "Areas of expertise"} icon={<Zap size={19} />}>
                {skills.length ? <div className="profile-skill-list">{skills.map(skill => <Badge key={skill} color="blue">{skill}</Badge>)}</div> : <EmptyState>No skills added yet. Your interests and expertise will appear here.</EmptyState>}
              </Panel>
            </TabsContent>
            <TabsContent value="background" className="profile-tab-content">
              <Panel title={isStudent ? "Academic details" : "Professional background"} icon={isStudent ? <GraduationCap size={19} /> : <Briefcase size={19} />}>
                <dl className="profile-detail-list">
                  {(isStudent ? [
                    ["Department", student?.department], ["Year of study", student?.year_of_study], ["Roll number", student?.roll_number], ["CGPA", student?.cgpa],
                  ] : [
                    ["Current role", alumni?.current_role], ["Company", company], ["Department", alumni?.department], ["Graduation year", alumni?.graduation_year], ["Years of experience", alumni?.years_of_experience],
                  ]).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "Not added yet"}</dd></div>)}
                </dl>
              </Panel>
            </TabsContent>
            <TabsContent value="skills" className="profile-tab-content"><Panel title={isStudent ? "Skills & interests" : "Mentorship areas"} icon={<Zap size={19} />}>
              {skills.length ? <div className="profile-skill-list">{skills.map(skill => <Badge key={skill} color="blue">{skill}</Badge>)}</div> : <EmptyState>No skills added yet.</EmptyState>}
            </Panel></TabsContent>
          </Tabs>
          <Panel title="Contact & connections" icon={<Mail size={19} />}>
            <div className="profile-contact-list">
              {user.email && <a href={`mailto:${user.email}`}><span className="profile-contact-icon"><Mail size={18} /></span><span><small>Email address</small><strong>{user.email}</strong></span><ArrowUpRight size={16} /></a>}
              {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer"><span className="profile-contact-icon"><Linkedin size={18} /></span><span><small>Professional network</small><strong>LinkedIn profile</strong></span><ArrowUpRight size={16} /></a>}
              {github && <a href={github} target="_blank" rel="noopener noreferrer"><span className="profile-contact-icon"><Github size={18} /></span><span><small>Code & projects</small><strong>GitHub profile</strong></span><ArrowUpRight size={16} /></a>}
            </div>
          </Panel>
        </div>
        <aside className="profile-side-column">
          <section className="profile-completion">
            <div className="profile-completion-heading"><div><Sparkles size={20} /><h2>Make it yours</h2></div><strong>{completion}%</strong></div>
            <p>A complete introduction helps your network get to know you.</p>
            <div className="profile-progress" role="progressbar" aria-label="Profile introduction completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}><span style={{ width: `${completion}%` }} /></div>
            <ul>{checklist.map(item => <li key={item.label} className={item.complete ? "complete" : ""}>{item.complete ? <CheckCircle2 size={16} /> : <Circle size={16} />}{item.label}</li>)}</ul>
            <button className="profile-complete-button" onClick={editProfile}>{completed === checklist.length ? "Update your introduction" : "Complete your introduction"}<ArrowUpRight size={16} /></button>
          </section>
          {isStudent && <StudentVerification user={user} />}
        </aside>
      </div>
    </div>

    <Dialog open={editing} onOpenChange={open => { if (!saving) setEditing(open); }}>
      <DialogContent className="profile-edit-dialog">
        <DialogHeader><DialogTitle>Edit your profile</DialogTitle><DialogDescription>Let your network know a little more about you.</DialogDescription></DialogHeader>
        <form onSubmit={saveProfile} className="profile-edit-form">
          <div className="profile-edit-fields">
            {([{ key: "display_name", label: "Display name", placeholder: "Your full name" }, { key: "headline", label: "Headline", placeholder: "What you do or aspire to do" }, { key: "company", label: "Company", placeholder: "Where you work (optional)" }, { key: "location", label: "Location", placeholder: "City, country" }] as const).map(field => <label key={field.key} className="profile-field" htmlFor={`profile-${field.key}`}>{field.label}
              <input id={`profile-${field.key}`} value={form[field.key]} placeholder={field.placeholder} required={field.key === "display_name"} disabled={saving} onChange={e => setForm(current => ({ ...current, [field.key]: e.target.value }))} />
            </label>)}
          </div>
          <label className="profile-field" htmlFor="profile-bio">About you<textarea id="profile-bio" value={form.bio} rows={5} placeholder="Share your interests, experience, and ambitions..." disabled={saving} onChange={e => setForm(current => ({ ...current, bio: e.target.value }))} /></label>
          {saveError && <p role="alert" className="profile-message error">{saveError}</p>}
          <div className="profile-edit-footer"><button type="button" className="profile-link-button" disabled={saving} onClick={() => setEditing(false)}>Cancel</button><button type="submit" className="profile-save-button" disabled={saving || !form.display_name.trim()}><Check size={16} />{saving ? "Saving..." : "Save changes"}</button></div>
        </form>
      </DialogContent>
    </Dialog>
  </main>;
}
