import { useEffect, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Award,
  Linkedin,
  Github,
  Globe,
  Mail,
  Zap,
  Layers,
  UserPlus,
  Upload,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "../utils";
import {
  getMyProfile,
  updateAccountProfile,
} from "../../lib/profileApi";
import { getDocuments, uploadDocument } from "../../lib/documentApi";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

const missingStudentProfileMessage =
  "Your account is marked as a student, but the student profile needed for verification documents is missing. Please create the account through Student signup again or ask an admin to recreate the student profile for this account.";

function isMissingStudentProfileError(error: any) {
  return /student profile not found/i.test(String(error?.message || error || ""));
}

function normalizeDocuments(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.documents)) return data.documents;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("college_id");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({
    display_name: "",
    headline: "",
    company: "",
    location: "",
    bio: "",
  });
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const me = await getMyProfile();
      let docs: any[] = [];

      if (me?.role === "student") {
        try {
          docs = normalizeDocuments(await getDocuments());
        } catch (err: any) {
          if (isMissingStudentProfileError(err)) {
            setUploadError(missingStudentProfileMessage);
          } else {
            throw err;
          }
        }
      }

      setProfile(me);
      setDocuments(docs);

      setForm({
        display_name: me?.profile?.display_name || "",
        headline: me?.profile?.headline || "",
        company: me?.profile?.company || "",
        location: me?.profile?.location || "",
        bio: me?.profile?.bio || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    try {
      await updateAccountProfile(form);
      setEditMode(false);
      await loadProfile();
      alert("Profile updated successfully");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }
  }
  async function handleUploadDocument() {
    if (!selectedFile) {
      alert("Please choose a file first");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      await uploadDocument(documentType, selectedFile);

      setSelectedFile(null);

      const docs = normalizeDocuments(await getDocuments());
      setDocuments(docs);

      alert("Document uploaded successfully");
    } catch (err: any) {
      const message = isMissingStudentProfileError(err)
        ? missingStudentProfileMessage
        : err.message || "Failed to upload document";

      setUploadError(message);
    } finally {
      setUploading(false);
    }
  }
  const tabs = ["about", "experience", "skills", "projects", "achievements"];
  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=200&fit=crop&auto=format"
          alt="Cover"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Profile header */}
        <div className="relative -mt-12 mb-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white bg-blue-100 shadow-lg flex items-center justify-center text-3xl font-bold text-blue-700">
                {(profile?.profile?.display_name || profile?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="mb-2">
                <h2
                  className="font-bold text-gray-900 text-2xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {profile?.profile?.display_name || profile?.email}
                </h2>
                <p className="text-gray-600">
                  {profile?.profile?.headline || "Profile headline not added"} ·{" "}
                  {profile?.profile?.company || "Company not added"} ·{" "}
                  {profile?.profile?.location || "Location not added"}
                </p>
                <div className="flex gap-2 mt-1.5">
                  <Badge color="blue">{profile?.role}</Badge>
                  <Badge color="green">
                    {profile?.is_verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <Btn size="sm" variant="outline" icon={<Linkedin size={14} />}>
                LinkedIn
              </Btn>
              {editMode ? (
                <Btn size="sm" onClick={handleSaveProfile}>
                  Save
                </Btn>
              ) : (
                <Btn
                  size="sm"
                  icon={<UserPlus size={14} />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Btn>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { v: "23", l: "Connections" },
            { v: "14", l: "Sessions" },
            { v: "4.9", l: "Rating" },
            { v: "6 yrs", l: "Experience" },
          ].map((s) => (
            <Card key={s.l} className="p-4 text-center">
              <p
                className="font-bold text-blue-600 text-xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {s.v}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex gap-4 mb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors cursor-pointer border-b-2 capitalize",
                activeTab === t
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {editMode && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input
              value={form.display_name}
              onChange={(e) =>
                setForm({ ...form, display_name: e.target.value })
              }
              placeholder="Display name"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="Headline"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Location"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        )}

        <div className="pb-10">
          {activeTab === "about" && (
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <Card className="p-5 mb-5">
                  <h3
                    className="font-semibold text-gray-900 mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    About
                  </h3>
                  {editMode ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {profile?.profile?.bio || "Bio not added yet."}
                    </p>
                  )}
                </Card>
                <Card className="p-5">
                  <h3
                    className="font-semibold text-gray-900 mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Education
                  </h3>
                  {[
                    {
                      degree: "B.Tech – Computer Science",
                      inst: "National Institute of Technology",
                      year: "2014–2018",
                      gpa: "8.9 CGPA",
                    },
                    {
                      degree: "Class XII – Science",
                      inst: "Delhi Public School",
                      year: "2014",
                      gpa: "94.2%",
                    },
                  ].map((e) => (
                    <div key={e.degree} className="flex gap-3 mb-4 last:mb-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {e.degree}
                        </p>
                        <p className="text-xs text-gray-600">{e.inst}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {e.year} · {e.gpa}
                        </p>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
              <div className="space-y-5">
                <Card className="p-5">
                  <h3
                    className="font-semibold text-gray-900 mb-3 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {profile?.role === "student" && (
                      <Card className="p-5">
                        <h3
                          className="font-semibold text-gray-900 mb-3 text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Student Verification
                        </h3>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            {profile?.student_profile?.verification_status ===
                            "approved" ? (
                              <CheckCircle
                                size={16}
                                className="text-emerald-600"
                              />
                            ) : (
                              <Clock size={16} className="text-amber-600" />
                            )}

                            <span className="text-sm font-medium text-gray-700">
                              Status:{" "}
                              {profile?.student_profile?.verification_status ||
                                "not submitted"}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500">
                            Upload your college ID, bonafide certificate, or
                            student proof for admin verification.
                          </p>
                        </div>

                        <select
                          value={documentType}
                          onChange={(e) => setDocumentType(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
                        >
                          <option value="college_id">College ID</option>
                          <option value="bonafide">Bonafide Certificate</option>
                          <option value="marksheet">Marksheet</option>
                          <option value="other">Other</option>
                        </select>

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setSelectedFile(e.target.files?.[0] || null)
                          }
                          className="w-full text-sm mb-3"
                        />

                        <Btn
                          size="sm"
                          fullWidth
                          icon={<Upload size={14} />}
                          onClick={handleUploadDocument}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Upload Document"}
                        </Btn>

                        {uploadError && (
                          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            {uploadError}
                          </p>
                        )}

                        <div className="mt-4 space-y-2">
                          {documents.length === 0 ? (
                            <p className="text-xs text-gray-500">
                              No documents uploaded yet.
                            </p>
                          ) : (
                            documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText
                                    size={14}
                                    className="text-blue-600"
                                  />
                                  <div>
                                    <p className="text-xs font-medium text-gray-800">
                                      {doc.document_type}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                      {new Date(
                                        doc.uploaded_at,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <Badge
                                  color={
                                    doc.verification_status === "approved"
                                      ? "green"
                                      : doc.verification_status === "rejected"
                                        ? "red"
                                        : "amber"
                                  }
                                >
                                  {doc.verification_status}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>
                    )}
                    Contact & Links
                  </h3>
                  {[
                    {
                      icon: <Mail size={14} />,
                      text: profile?.email || "Email not added",
                    },
                    { icon: <Globe size={14} />, text: "priyasharma.dev" },
                    {
                      icon: <Linkedin size={14} />,
                      text: "linkedin.com/in/priyasharma",
                    },
                    {
                      icon: <Github size={14} />,
                      text: "github.com/priyasharma",
                    },
                    {
                      icon: <MapPin size={14} />,
                      text: profile?.profile?.location || "Location not added",
                    },
                  ].map((l) => (
                    <div
                      key={l.text}
                      className="flex items-center gap-2 py-1.5 text-sm text-gray-600"
                    >
                      <span className="text-gray-400">{l.icon}</span>
                      {l.text}
                    </div>
                  ))}
                </Card>
                <Card className="p-5">
                  <h3
                    className="font-semibold text-gray-900 mb-3 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Top Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      profile?.student_profile?.skills ||
                      profile?.alumni_profile?.mentorship_areas ||
                      "Skills not added"
                    )
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((s: string) => (
                        <Badge key={s} color="blue">
                          {s}
                        </Badge>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === "experience" && (
            <Card className="p-5">
              <h3
                className="font-semibold text-gray-900 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Work Experience
              </h3>
              <div className="space-y-5">
                {[
                  {
                    role: "Senior Software Engineer",
                    company: "Google",
                    period: "Aug 2021 – Present",
                    desc: "Lead development of core search infrastructure serving 1B+ daily users. Contributed to Project Titan and internal developer tooling.",
                    current: true,
                  },
                  {
                    role: "Software Engineer II",
                    company: "Microsoft",
                    period: "Jun 2019 – Jul 2021",
                    desc: "Worked on Azure DevOps pipelines and CI/CD tooling. Improved build times by 40% through distributed caching.",
                    current: false,
                  },
                  {
                    role: "Software Engineer Intern",
                    company: "Amazon",
                    period: "May 2018 – Jul 2018",
                    desc: "Built recommendation service using collaborative filtering for Amazon Fresh. Improved CTR by 12%.",
                    current: false,
                  },
                ].map((e) => (
                  <div key={e.role} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                    </div>
                    <div className="pb-4">
                      <div className="flex items-start gap-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {e.role}
                        </p>
                        {e.current && <Badge color="green">Current</Badge>}
                      </div>
                      <p className="text-xs text-blue-600 font-medium">
                        {e.company} · {e.period}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {e.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {(activeTab === "skills" ||
            activeTab === "projects" ||
            activeTab === "achievements") && (
            <Card className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                {activeTab === "skills" ? (
                  <Zap size={24} className="text-blue-600" />
                ) : activeTab === "projects" ? (
                  <Layers size={24} className="text-blue-600" />
                ) : (
                  <Award size={24} className="text-blue-600" />
                )}
              </div>
              <h3
                className="font-semibold text-gray-900 mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {activeTab === "skills"
                  ? "8 Skills Listed"
                  : activeTab === "projects"
                    ? "5 Projects Showcased"
                    : "12 Achievements"}
              </h3>
              <p className="text-gray-500 text-sm">
                This section is fully detailed in the complete profile view.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
