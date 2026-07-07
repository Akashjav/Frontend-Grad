import { useState } from "react";
import { CheckCircle, ChevronLeft } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumniSignup, studentSignup } from "../../lib/authApi";
import Btn from "./Btn";
import Card from "./Card";

type Role = "student" | "alumni";

type RegistrationForm = {
  full_name: string;
  email: string;
  password: string;
  roll_number: string;
  department: string;
  year_of_study: string;
  cgpa: string;
  skills: string;
  linkedin_url: string;
  github_url: string;
  career_goals: string;
  graduation_year: string;
  current_company: string;
  current_role: string;
  years_of_experience: string;
  mentorship_areas: string;
  availability: string;
};

type Field = {
  name: keyof RegistrationForm;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "url" | "textarea";
  placeholder?: string;
  options?: { label: string; value: string }[];
};

const initialForm: RegistrationForm = {
  full_name: "",
  email: "",
  password: "",
  roll_number: "",
  department: "",
  year_of_study: "",
  cgpa: "",
  skills: "",
  linkedin_url: "",
  github_url: "",
  career_goals: "",
  graduation_year: "",
  current_company: "",
  current_role: "",
  years_of_experience: "",
  mentorship_areas: "",
  availability: "",
};

const departmentOptions = ["CSE", "IT", "ECE", "ME", "CE", "EEE"].map((value) => ({
  label: value,
  value,
}));

const studentFields: Field[][] = [
  [
    { name: "full_name", label: "Full Name", type: "text", placeholder: "Aryan Kapoor" },
    { name: "roll_number", label: "Roll Number", type: "text", placeholder: "21CSE1047" },
    { name: "email", label: "Institutional Email", type: "email", placeholder: "aryan@university.edu" },
    { name: "password", label: "Password", type: "password", placeholder: "Create a strong password" },
  ],
  [
    { name: "department", label: "Department", type: "select", options: departmentOptions },
    {
      name: "year_of_study",
      label: "Year of Study",
      type: "select",
      options: [
        { label: "1st Year", value: "1" },
        { label: "2nd Year", value: "2" },
        { label: "3rd Year", value: "3" },
        { label: "4th Year", value: "4" },
      ],
    },
    { name: "cgpa", label: "CGPA", type: "number", placeholder: "e.g. 8.5" },
    { name: "skills", label: "Skills (comma separated)", type: "text", placeholder: "React, Python, DSA..." },
  ],
  [
    { name: "linkedin_url", label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourname" },
    { name: "github_url", label: "GitHub URL", type: "url", placeholder: "https://github.com/username" },
    { name: "career_goals", label: "Career Goals", type: "textarea", placeholder: "Briefly describe your career objectives..." },
  ],
];

const alumniFields: Field[][] = [
  [
    { name: "full_name", label: "Full Name", type: "text", placeholder: "Priya Sharma" },
    { name: "graduation_year", label: "Graduation Year", type: "number", placeholder: "2018" },
    { name: "email", label: "Alumni Email", type: "email", placeholder: "priya@gmail.com" },
    { name: "password", label: "Password", type: "password", placeholder: "Create a strong password" },
  ],
  [
    { name: "department", label: "Department", type: "select", options: departmentOptions },
    { name: "current_company", label: "Current Company", type: "text", placeholder: "Google" },
    { name: "current_role", label: "Current Role", type: "text", placeholder: "Senior Software Engineer" },
    {
      name: "years_of_experience",
      label: "Years of Experience",
      type: "select",
      options: [
        { label: "1-2", value: "1" },
        { label: "3-5", value: "3" },
        { label: "6-10", value: "6" },
        { label: "10+", value: "10" },
      ],
    },
  ],
  [
    { name: "linkedin_url", label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourname" },
    { name: "mentorship_areas", label: "Areas of Mentorship (comma separated)", type: "text", placeholder: "DSA, System Design, Resume Review..." },
    {
      name: "availability",
      label: "Availability",
      type: "select",
      options: [
        { label: "Weekends only", value: "Weekends only" },
        { label: "Weekday evenings", value: "Weekday evenings" },
        { label: "Flexible", value: "Flexible" },
      ],
    },
  ],
];

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

function optionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function RegisterPage({ navigate }: { navigate: (p: Page) => void }) {
  const [role, setRole] = useState<Role>("student");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [registering, setRegistering] = useState(false);
  const totalSteps = 3;

  const fields = role === "student" ? studentFields[step - 1] : alumniFields[step - 1];
  const stepLabels = role === "student"
    ? ["Personal Info", "Academic Details", "Profile & Goals"]
    : ["Personal Info", "Professional Details", "Mentorship Preferences"];

  function updateField(name: keyof RegistrationForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function switchRole(nextRole: Role) {
    setRole(nextRole);
    setStep(1);
    setForm(initialForm);
  }

  function validateCurrentStep() {
    if (step !== 1) return true;

    if (!form.full_name.trim() || !form.email.trim() || !form.password.trim()) {
      alert("Please enter your name, email, and password.");
      return false;
    }

    return true;
  }

  async function completeRegistration() {
    setRegistering(true);

    try {
      if (role === "student") {
        await studentSignup({
          email: form.email.trim(),
          password: form.password,
          full_name: form.full_name.trim(),
          roll_number: optionalString(form.roll_number),
          department: optionalString(form.department),
          year_of_study: optionalNumber(form.year_of_study),
          cgpa: optionalNumber(form.cgpa),
          skills: optionalString(form.skills),
          linkedin_url: optionalString(form.linkedin_url),
          github_url: optionalString(form.github_url),
          career_goals: optionalString(form.career_goals),
        });
        navigate("student-dashboard");
        return;
      }

      await alumniSignup({
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim(),
        graduation_year: optionalNumber(form.graduation_year),
        department: optionalString(form.department),
        current_company: optionalString(form.current_company),
        current_role: optionalString(form.current_role),
        years_of_experience: optionalNumber(form.years_of_experience),
        linkedin_url: optionalString(form.linkedin_url),
        mentorship_areas: optionalString(form.mentorship_areas),
        availability: optionalString(form.availability),
      });
      navigate("alumni-dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to complete registration");
    } finally {
      setRegistering(false);
    }
  }

  async function handleNext() {
    if (!validateCurrentStep()) return;

    if (step < totalSteps) {
      setStep((current) => current + 1);
      return;
    }

    await completeRegistration();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>Create your account</h2>
          <p className="text-gray-500 text-sm mt-1">Join thousands of students and alumni on GradAlumni</p>
        </div>

        <Card className="p-8">
          {/* Role toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-7">
            {(["student", "alumni"] as const).map(r => (
              <button key={r} onClick={() => switchRole(r)}
                className={cn("flex-1 py-2.5 text-sm font-semibold rounded-md transition-all cursor-pointer",
                  role === r ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                {r === "student" ? "I'm a Student" : "I'm an Alumni"}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-7">
            <div className="flex justify-between mb-2">
              {stepLabels.map((l, i) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                    step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500")}>
                    {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={cn("text-xs hidden sm:block", step === i + 1 ? "text-blue-700 font-medium" : "text-gray-400")}>{l}</span>
                  {i < totalSteps - 1 && <div className={cn("h-0.5 w-8 sm:w-16 transition-colors", step > i + 1 ? "bg-emerald-400" : "bg-gray-200")} />}
                </div>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-7">
            {fields.map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={form[f.name]}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  >
                    <option value="">Select {f.label}</option>
                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    min={f.type === "number" ? "0" : undefined}
                    step={f.name === "cgpa" ? "0.1" : undefined}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 1 && <Btn variant="outline" onClick={() => setStep(s => s - 1)} icon={<ChevronLeft size={16} />} disabled={registering}>Back</Btn>}
            <Btn fullWidth onClick={handleNext} disabled={registering}>
              {registering ? "Creating Account..." : step < totalSteps ? "Continue" : "Complete Registration"}
            </Btn>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <button onClick={() => navigate("login")} className="text-blue-600 font-semibold hover:underline cursor-pointer">Sign in</button>
          </p>
        </Card>
      </div>
    </div>
  );
}
